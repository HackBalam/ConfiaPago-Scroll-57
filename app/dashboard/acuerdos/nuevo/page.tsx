"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWallet } from "@/components/wallet-provider"
import { useToast } from "@/components/ui/use-toast"
import { ethers } from "ethers"
import { createTransaction } from "@/lib/escrow-contract"

export default function NuevoAcuerdoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isConnected, signer, address } = useWallet()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    descripcion: "",
    condicion: "",
    precio: "",
    link: "",
    email: "",
    wallet: "",
    confirmacion: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, confirmacion: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected || !signer) {
      toast({
        title: "Wallet no conectada",
        description: "Por favor, conecta tu wallet para crear un acuerdo.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      // Validaciones del formulario
      if (!formData.descripcion.trim()) {
        throw new Error("La descripción del producto/servicio es obligatoria")
      }

      if (!formData.condicion) {
        throw new Error("Debes seleccionar la condición del producto/servicio")
      }

      if (!formData.precio || isNaN(Number.parseFloat(formData.precio)) || Number.parseFloat(formData.precio) <= 0) {
        throw new Error("El precio debe ser un número positivo")
      }

      if (!formData.email.trim()) {
        throw new Error("El email o identificador de la contraparte es obligatorio")
      }

      // Validar dirección del vendedor/comprador
      try {
        if (!ethers.isAddress(formData.wallet)) {
          throw new Error("La dirección de wallet no es una dirección Ethereum válida")
        }
      } catch (error) {
        throw new Error("Error al validar la dirección de wallet")
      }

      // Crear transacción en el contrato de escrow
      console.log("Enviando transacción con los siguientes datos:", {
        signer: signer ? "Signer válido" : "Signer inválido",
        wallet: formData.wallet,
        descripcion: formData.descripcion,
        precio: formData.precio,
      })

      const result = await createTransaction(
        signer,
        formData.wallet, // Dirección de la contraparte
        formData.descripcion, // Descripción del producto/servicio
        formData.precio, // Monto en ETH
      )

      if (result.success) {
        toast({
          title: "Acuerdo creado con éxito",
          description: `Tu acuerdo ha sido creado y registrado en la blockchain. ID de transacción: ${result.transactionId?.substring(0, 10)}...`,
          variant: "success",
        })

        // Redirigir al dashboard después de crear el acuerdo
        setTimeout(() => {
          router.push("/dashboard/acuerdos")
        }, 2000)
      } else {
        throw new Error(result.error || "Ha ocurrido un error al crear el acuerdo")
      }
    } catch (error) {
      console.error("Error al crear acuerdo:", error)
      toast({
        title: "Error al crear el acuerdo",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard/acuerdos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Acuerdos
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Define tu Acuerdo con Claridad y Seguridad</h1>
        <p className="text-muted-foreground">
          Completa cada campo con precisión. Un acuerdo bien definido es la base de una transacción exitosa y sin
          sorpresas.
        </p>
      </div>

      <Card className="mx-auto max-w-3xl bg-white shadow-md">
        <form onSubmit={handleSubmit}>
          <CardHeader className="bg-confia-light/10">
            <CardTitle className="text-confia-green">Crear Nuevo Acuerdo</CardTitle>
            <CardDescription>
              Todos los campos son importantes para garantizar la seguridad de la transacción.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción detallada del producto/servicio</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                placeholder="Describe con detalle el producto o servicio (marca, modelo, estado, características, etc.)"
                value={formData.descripcion}
                onChange={handleInputChange}
                required
                rows={4}
                className="border-confia-light/50 focus-visible:ring-confia-green"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condicion">Condición</Label>
              <Select
                required
                value={formData.condicion}
                onValueChange={(value) => handleSelectChange("condicion", value)}
              >
                <SelectTrigger id="condicion" className="border-confia-light/50 focus-visible:ring-confia-green">
                  <SelectValue placeholder="Selecciona la condición" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nuevo">Nuevo</SelectItem>
                  <SelectItem value="usado-excelente">Usado - Excelente estado</SelectItem>
                  <SelectItem value="usado-bueno">Usado - Buen estado</SelectItem>
                  <SelectItem value="usado-aceptable">Usado - Estado aceptable</SelectItem>
                  <SelectItem value="servicio">Servicio (No aplica)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio">Precio acordado (ETH)</Label>
              <Input
                id="precio"
                name="precio"
                type="number"
                placeholder="0.1"
                value={formData.precio}
                onChange={handleInputChange}
                required
                min="0.0001"
                step="0.0001"
                className="border-confia-light/50 focus-visible:ring-confia-green"
              />
              <p className="text-xs text-muted-foreground">
                El monto en ETH que se depositará en el contrato de escrow.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Link relevante (opcional)</Label>
              <Input
                id="link"
                name="link"
                type="url"
                placeholder="https://ejemplo.com/producto"
                value={formData.link}
                onChange={handleInputChange}
                className="border-confia-light/50 focus-visible:ring-confia-green"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email o identificador de la contraparte</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="contraparte@ejemplo.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="border-confia-light/50 focus-visible:ring-confia-green"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet">Dirección de Wallet de la contraparte</Label>
              <Input
                id="wallet"
                name="wallet"
                placeholder="0x..."
                value={formData.wallet}
                onChange={handleInputChange}
                required
                className="border-confia-light/50 focus-visible:ring-confia-green"
              />
              <p className="text-xs text-muted-foreground">
                Verifícala cuidadosamente para asegurar el destino correcto.
              </p>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="confirmacion"
                checked={formData.confirmacion}
                onCheckedChange={handleCheckboxChange}
                required
                className="border-confia-light data-[state=checked]:bg-confia-green data-[state=checked]:border-confia-green"
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="confirmacion"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Confirmo que mi wallet conectada (
                  {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : "No conectada"})
                  es la correcta y segura para esta operación.
                </Label>
                <p className="text-xs text-muted-foreground">
                  Esta wallet será utilizada para recibir el pago si eres vendedor, o recibir reembolso si eres
                  comprador.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 bg-confia-light/5 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/dashboard/acuerdos")}
              className="border-confia-green text-confia-green hover:bg-confia-green/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isConnected || loading || !formData.confirmacion}
              className="bg-confia-green hover:bg-confia-green/90 text-white"
            >
              {loading ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creando acuerdo...
                </>
              ) : (
                "Crear y Enviar Acuerdo para Aprobación Segura"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
