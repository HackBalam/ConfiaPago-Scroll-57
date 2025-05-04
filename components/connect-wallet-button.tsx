"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { useWallet } from "@/components/wallet-provider"

interface ConnectWalletButtonProps extends React.ComponentProps<typeof Button> {}

export function ConnectWalletButton({ className, size, variant, ...props }: ConnectWalletButtonProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { connect, isConnected } = useWallet()

  const handleConnect = async (walletType: string) => {
    setError(null)

    try {
      if (walletType === "metamask") {
        await connect()
        setOpen(false)

        // Redirigir al dashboard después de conectar
        router.push("/dashboard")
      } else {
        setError("Wallet no soportada actualmente.")
      }
    } catch (err) {
      setError("Error al conectar. Asegúrate que tu wallet esté activa y configurada para la red Scroll.")
    }
  }

  return (
    <>
      <Button
        onClick={() => (isConnected ? router.push("/dashboard") : setOpen(true))}
        className={className}
        size={size}
        variant={variant}
        {...props}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isConnected ? "Ir al Dashboard" : "Conectar Wallet"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Conecta tu Wallet Segura</DialogTitle>
            <DialogDescription>
              Elige tu wallet compatible con Scroll. Es el primer paso para acceder a la máxima seguridad en tus
              intercambios P2P con ConfiaPago.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button onClick={() => handleConnect("metamask")} className="flex items-center justify-center gap-2">
              <img src="/placeholder.svg?height=24&width=24" alt="MetaMask" className="h-6 w-6" />
              Conectar con MetaMask
            </Button>
            <Button
              onClick={() => handleConnect("walletconnect")}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <img src="/placeholder.svg?height=24&width=24" alt="WalletConnect" className="h-6 w-6" />
              Conectar con WalletConnect
            </Button>

            {error && (
              <div className="mt-2 flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
