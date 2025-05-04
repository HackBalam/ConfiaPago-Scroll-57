"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Copy, CheckCircle2, ExternalLink, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/components/wallet-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ethers } from "ethers"
import { ESCROW_CONTRACT_ADDRESS, createTransaction } from "@/lib/escrow-contract"

export default function PruebaEscrowPage() {
  const { isConnected, isScrollNetwork, signer, address } = useWallet()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    sellerAddress: "",
    description: "",
    amount: "",
  })

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAddress(text)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signer) return

    try {
      setLoading(true)

      // Validar dirección del vendedor
      if (!ethers.isAddress(formData.sellerAddress)) {
        toast({
          title: "Dirección inválida",
          description: "La dirección del vendedor no es una dirección Ethereum válida.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Validar monto
      if (isNaN(Number.parseFloat(formData.amount)) || Number.parseFloat(formData.amount) <= 0) {
        toast({
          title: "Monto inválido",
          description: "El monto debe ser un número positivo.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Crear la transacción
      const result = await createTransaction(signer, formData.sellerAddress, formData.description, formData.amount)

      if (result.success) {
        setTransactionId(result.transactionId)
        setTransactionHash(result.transactionHash)
        toast({
          title: "Transacción creada",
          description: "La transacción se ha creado correctamente.",
        })
      } else {
        toast({
          title: "Error al crear la transacción",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al crear transacción:", error)
      toast({
        title: "Error al crear la transacción",
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
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Prueba de Escrow en Scroll</h1>
        <p className="text-muted-foreground">
          Crea una transacción de escrow real en la blockchain de Scroll y comparte el ID con la contraparte.
        </p>
      </div>

      {!isConnected && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet no conectada</AlertTitle>
          <AlertDescription>Necesitas conectar tu wallet para crear una transacción de escrow.</AlertDescription>
        </Alert>
      )}

      {isConnected && !isScrollNetwork && (
        <Alert variant="warning" className="mb-6 border-amber-200 bg-amber-50 text-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-800" />
          <AlertTitle>Red incorrecta</AlertTitle>
          <AlertDescription>
            Por favor, cambia a la red Scroll en tu wallet para crear una transacción de escrow.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="crear" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="crear">Crear Transacción</TabsTrigger>
              <TabsTrigger value="verificar">Verificar Transacción</TabsTrigger>
            </TabsList>

            <TabsContent value="crear">
              <Card>
                <form onSubmit={handleCreateTransaction}>
                  <CardHeader>
                    <CardTitle>Crear Nueva Transacción de Escrow</CardTitle>
                    <CardDescription>
                      Completa el formulario para crear una nueva transacción de escrow en la blockchain.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sellerAddress">Dirección del Vendedor</Label>
                      <Input
                        id="sellerAddress"
                        name="sellerAddress"
                        placeholder="0x..."
                        value={formData.sellerAddress}
                        onChange={handleInputChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        La dirección Ethereum del vendedor que recibirá el pago.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción del Producto/Servicio</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Descripción detallada del producto o servicio..."
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Monto (ETH)</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.0001"
                        min="0.0001"
                        placeholder="0.1"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        El monto en ETH que se depositará en el contrato de escrow.
                      </p>
                    </div>

                    {transactionId && (
                      <Alert className="bg-green-50 border-green-200 text-green-800">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle>¡Transacción creada con éxito!</AlertTitle>
                        <AlertDescription className="space-y-2">
                          <p>La transacción se ha creado correctamente en la blockchain de Scroll.</p>
                          <div className="mt-2 rounded-md bg-green-100 p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">ID de la transacción:</span>
                              <div className="flex items-center">
                                <span className="font-mono text-xs mr-2">{`${transactionId?.substring(
                                  0,
                                  10,
                                )}...${transactionId?.substring((transactionId?.length || 0) - 8)}`}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleCopyAddress(transactionId || "")}
                                >
                                  {copiedAddress === transactionId ? (
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Hash de transacción:</span>
                              <a
                                href={`https://scrollscan.com/tx/${transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline font-mono text-xs"
                              >
                                {`${transactionHash?.substring(0, 10)}...${transactionHash?.substring(
                                  (transactionHash?.length || 0) - 8,
                                )}`}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                          <p className="mt-2 text-sm">
                            Comparte el ID de la transacción con el comprador para que pueda depositar los fondos.
                          </p>
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={!isConnected || !isScrollNetwork || loading} className="w-full">
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
                          Creando transacción...
                        </>
                      ) : (
                        "Crear Transacción de Escrow"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="verificar">
              <Card>
                <CardHeader>
                  <CardTitle>Verificar Transacción Existente</CardTitle>
                  <CardDescription>
                    Ingresa el ID de una transacción para verificar su estado y detalles.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="transactionId">ID de la Transacción</Label>
                    <Input id="transactionId" placeholder="0x..." />
                  </div>
                  <Button className="w-full">Verificar Transacción</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Información del Contrato</CardTitle>
              <CardDescription>Detalles del contrato de escrow en Scroll</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">Dirección del Contrato</h3>
                <div className="flex items-center gap-1">
                  <p className="font-mono text-sm break-all">{ESCROW_CONTRACT_ADDRESS}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCopyAddress(ESCROW_CONTRACT_ADDRESS)}
                  >
                    {copiedAddress === ESCROW_CONTRACT_ADDRESS ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">Tu Dirección</h3>
                <p className="font-mono text-sm break-all">{address || "No conectado"}</p>
              </div>

              <Separator />

              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">Red</h3>
                <div className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full ${isScrollNetwork ? "bg-green-500" : "bg-amber-500"}`} />
                  <p className="text-sm">{isScrollNetwork ? "Scroll" : "Red incorrecta"}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a
                  href={`https://scrollscan.com/address/${ESCROW_CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1"
                >
                  Ver Contrato en Explorer
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Instrucciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">1. Crear Transacción</h3>
                <p className="text-xs text-muted-foreground">
                  El vendedor crea una transacción especificando la dirección del comprador y los detalles del producto.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">2. Compartir ID</h3>
                <p className="text-xs text-muted-foreground">
                  El vendedor comparte el ID de la transacción con el comprador.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">3. Depositar Fondos</h3>
                <p className="text-xs text-muted-foreground">
                  El comprador deposita los fondos en el contrato de escrow usando el ID de la transacción.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">4. Confirmar Entrega</h3>
                <p className="text-xs text-muted-foreground">
                  Una vez recibido el producto, el comprador confirma la entrega y los fondos se liberan al vendedor.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
