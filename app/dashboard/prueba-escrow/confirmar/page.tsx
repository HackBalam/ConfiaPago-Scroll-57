"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ExternalLink, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/components/wallet-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { confirmDelivery, getTransactionDetails } from "@/lib/escrow-contract"

export default function ConfirmarPage() {
  const { isConnected, isScrollNetwork, signer, provider } = useWallet()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [transactionId, setTransactionId] = useState("")
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [transactionDetails, setTransactionDetails] = useState<any>(null)

  const handleVerifyTransaction = async () => {
    if (!provider || !transactionId) return

    try {
      setVerifying(true)
      const result = await getTransactionDetails(provider, transactionId)

      if (result.success) {
        setTransactionDetails(result.transaction)
        toast({
          title: "Transacción verificada",
          description: "Los detalles de la transacción se han cargado correctamente.",
        })
      } else {
        toast({
          title: "Error al verificar la transacción",
          description: result.error,
          variant: "destructive",
        })
        setTransactionDetails(null)
      }
    } catch (error) {
      console.error("Error al verificar transacción:", error)
      toast({
        title: "Error al verificar la transacción",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      })
      setTransactionDetails(null)
    } finally {
      setVerifying(false)
    }
  }

  const handleConfirmDelivery = async () => {
    if (!signer || !transactionDetails) return

    try {
      setLoading(true)
      const result = await confirmDelivery(signer, transactionId)

      if (result.success) {
        setTransactionHash(result.transactionHash)
        toast({
          title: "Entrega confirmada",
          description: "La entrega ha sido confirmada y los fondos liberados al vendedor.",
        })
      } else {
        toast({
          title: "Error al confirmar la entrega",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al confirmar entrega:", error)
      toast({
        title: "Error al confirmar la entrega",
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
          <Link href="/dashboard/prueba-escrow">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Prueba de Escrow
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Confirmar Entrega</h1>
        <p className="text-muted-foreground">
          Confirma la recepción del producto o servicio para liberar los fondos al vendedor.
        </p>
      </div>

      {!isConnected && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet no conectada</AlertTitle>
          <AlertDescription>Necesitas conectar tu wallet para confirmar la entrega.</AlertDescription>
        </Alert>
      )}

      {isConnected && !isScrollNetwork && (
        <Alert variant="warning" className="mb-6 border-amber-200 bg-amber-50 text-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-800" />
          <AlertTitle>Red incorrecta</AlertTitle>
          <AlertDescription>Por favor, cambia a la red Scroll en tu wallet para confirmar la entrega.</AlertDescription>
        </Alert>
      )}

      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Confirmar Entrega y Liberar Fondos</CardTitle>
            <CardDescription>
              Ingresa el ID de la transacción para verificar y confirmar que has recibido el producto o servicio.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transactionId">ID de la Transacción</Label>
              <div className="flex gap-2">
                <Input
                  id="transactionId"
                  placeholder="0x..."
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
                <Button
                  onClick={handleVerifyTransaction}
                  disabled={!isConnected || !isScrollNetwork || !transactionId || verifying}
                >
                  {verifying ? "Verificando..." : "Verificar"}
                </Button>
              </div>
            </div>

            {transactionDetails && (
              <div className="rounded-md border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Vendedor:</span>
                  <span className="font-mono text-xs">
                    {`${transactionDetails.seller.substring(0, 6)}...${transactionDetails.seller.substring(
                      transactionDetails.seller.length - 4,
                    )}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Monto:</span>
                  <span className="font-medium">{transactionDetails.amount} ETH</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estado:</span>
                  <span
                    className={`text-xs font-medium ${
                      transactionDetails.state === "AWAITING_PAYMENT"
                        ? "text-amber-600"
                        : transactionDetails.state === "AWAITING_DELIVERY"
                          ? "text-blue-600"
                          : transactionDetails.state === "COMPLETE"
                            ? "text-green-600"
                            : "text-red-600"
                    }`}
                  >
                    {transactionDetails.state === "AWAITING_PAYMENT"
                      ? "Esperando Pago"
                      : transactionDetails.state === "AWAITING_DELIVERY"
                        ? "Esperando Entrega"
                        : transactionDetails.state === "COMPLETE"
                          ? "Completado"
                          : transactionDetails.state === "REFUNDED"
                            ? "Reembolsado"
                            : "En Disputa"}
                  </span>
                </div>
                <div className="pt-2">
                  <span className="text-sm font-medium">Descripción:</span>
                  <p className="mt-1 text-sm text-muted-foreground">{transactionDetails.description}</p>
                </div>
              </div>
            )}

            {transactionDetails && transactionDetails.state !== "AWAITING_DELIVERY" && (
              <Alert
                variant={
                  transactionDetails.state === "COMPLETE"
                    ? "default"
                    : transactionDetails.state === "AWAITING_PAYMENT"
                      ? "warning"
                      : "destructive"
                }
                className={
                  transactionDetails.state === "COMPLETE" ? "bg-green-50 border-green-200 text-green-800" : undefined
                }
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  {transactionDetails.state === "COMPLETE"
                    ? "Transacción ya completada"
                    : transactionDetails.state === "AWAITING_PAYMENT"
                      ? "Pago pendiente"
                      : "No se puede confirmar"}
                </AlertTitle>
                <AlertDescription>
                  {transactionDetails.state === "COMPLETE"
                    ? "Esta transacción ya ha sido completada y los fondos liberados al vendedor."
                    : transactionDetails.state === "AWAITING_PAYMENT"
                      ? "El comprador aún no ha depositado los fondos en el escrow."
                      : "Esta transacción está en un estado que no permite confirmar la entrega."}
                </AlertDescription>
              </Alert>
            )}

            {transactionHash && (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>¡Entrega confirmada con éxito!</AlertTitle>
                <AlertDescription>
                  <p>Has confirmado la entrega y los fondos han sido liberados al vendedor.</p>
                  <div className="mt-2">
                    <span className="text-sm font-medium">Hash de transacción:</span>
                    <a
                      href={`https://scrollscan.com/tx/${transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline mt-1"
                    >
                      {`${transactionHash.substring(0, 10)}...${transactionHash.substring(transactionHash.length - 8)}`}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleConfirmDelivery}
              disabled={
                !isConnected ||
                !isScrollNetwork ||
                !transactionDetails ||
                transactionDetails.state !== "AWAITING_DELIVERY" ||
                loading
              }
              className="w-full"
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
                  Confirmando entrega...
                </>
              ) : (
                "Confirmar Entrega y Liberar Fondos"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
