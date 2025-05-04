"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ExternalLink, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/components/wallet-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { getTransactionDetails } from "@/lib/escrow-contract"
import { Separator } from "@/components/ui/separator"

export default function VerificarTransaccionPage() {
  const { isConnected, isScrollNetwork, provider } = useWallet()
  const { toast } = useToast()
  const [verifying, setVerifying] = useState(false)
  const [transactionId, setTransactionId] = useState("")
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

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Verificar Transacción en Blockchain</h1>
        <p className="text-muted-foreground">
          Verifica el estado y detalles de cualquier transacción en la blockchain de Scroll usando su ID.
        </p>
      </div>

      {!isConnected && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet no conectada</AlertTitle>
          <AlertDescription>
            Necesitas conectar tu wallet para verificar transacciones en la blockchain.
          </AlertDescription>
        </Alert>
      )}

      {isConnected && !isScrollNetwork && (
        <Alert variant="warning" className="mb-6 border-amber-200 bg-amber-50 text-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-800" />
          <AlertTitle>Red incorrecta</AlertTitle>
          <AlertDescription>
            Por favor, cambia a la red Scroll en tu wallet para verificar transacciones.
          </AlertDescription>
        </Alert>
      )}

      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Verificar Transacción</CardTitle>
            <CardDescription>
              Ingresa el ID de la transacción para verificar su estado y detalles en la blockchain.
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
              <p className="text-xs text-muted-foreground">
                El ID de la transacción es un hash único generado cuando se crea la transacción en la blockchain.
              </p>
            </div>

            {transactionDetails && (
              <div className="rounded-md border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Comprador:</span>
                  <span className="font-mono text-xs">
                    {`${transactionDetails.buyer.substring(0, 6)}...${transactionDetails.buyer.substring(
                      transactionDetails.buyer.length - 4,
                    )}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Vendedor:</span>
                  <span className="font-mono text-xs">
                    {`${transactionDetails.seller.substring(0, 6)}...${transactionDetails.seller.substring(
                      transactionDetails.seller.length - 4,
                    )}`}
                  </span>
                </div>
                <Separator />
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
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Fecha de creación:</span>
                  <span className="text-sm">{new Date(transactionDetails.createdAt).toLocaleString()}</span>
                </div>
                <Separator />
                <div className="pt-2">
                  <span className="text-sm font-medium">Descripción:</span>
                  <p className="mt-1 text-sm text-muted-foreground">{transactionDetails.description}</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Volver al Dashboard</Link>
            </Button>
            {transactionDetails && (
              <Button variant="outline" asChild>
                <a
                  href={`https://scrollscan.com/tx/${transactionId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  Ver en Explorer
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
