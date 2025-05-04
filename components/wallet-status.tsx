"use client"

import { useWallet } from "@/components/wallet-provider"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function WalletStatus() {
  const { address, isConnected, isScrollNetwork, balance, disconnect } = useWallet()
  const [shortAddress, setShortAddress] = useState<string>("")

  useEffect(() => {
    if (address) {
      setShortAddress(`${address.substring(0, 6)}...${address.substring(address.length - 4)}`)
    }
  }, [address])

  if (!isConnected) {
    return (
      <Button variant="outline" size="sm" className="text-xs">
        <AlertCircle className="mr-1 h-3 w-3 text-destructive" />
        No conectado
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 px-3 py-1.5 text-sm">
          <span className="hidden sm:inline">{shortAddress}</span>
          <span className="sm:hidden">{shortAddress.substring(0, 8)}</span>
          <div
            className={`h-2 w-2 rounded-full ${isScrollNetwork ? "bg-green-500" : "bg-amber-500"}`}
            title={isScrollNetwork ? "Conectado a Scroll" : "Red incorrecta"}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mi Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <p className="mb-1 text-xs font-medium text-muted-foreground">Dirección</p>
          <p className="break-all text-xs">{address}</p>
        </div>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <p className="mb-1 text-xs font-medium text-muted-foreground">Balance</p>
          <p className="text-sm font-medium">{Number.parseFloat(balance).toFixed(4)} ETH</p>
        </div>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <p className="mb-1 text-xs font-medium text-muted-foreground">Red</p>
          <div className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${isScrollNetwork ? "bg-green-500" : "bg-amber-500"}`} />
            <p className="text-sm">{isScrollNetwork ? "Scroll" : "Red incorrecta"}</p>
          </div>
          {!isScrollNetwork && (
            <p className="mt-1 text-xs text-amber-600">Por favor, cambia a la red Scroll en tu wallet.</p>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnect} className="text-destructive focus:text-destructive">
          Desconectar wallet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
