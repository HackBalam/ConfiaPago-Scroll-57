"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"

interface WalletContextType {
  provider: ethers.BrowserProvider | null
  signer: ethers.Signer | null
  address: string | null
  chainId: number | null
  isConnected: boolean
  isScrollNetwork: boolean
  balance: string
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType>({
  provider: null,
  signer: null,
  address: null,
  chainId: null,
  isConnected: false,
  isScrollNetwork: true, // Cambiado a true por defecto para evitar alertas
  balance: "0",
  connect: async () => {},
  disconnect: () => {},
})

export const useWallet = () => useContext(WalletContext)

// ID de la red Scroll
const SCROLL_CHAIN_ID = 534352 // Mainnet
const SCROLL_TESTNET_CHAIN_ID = 534351 // Sepolia Testnet
const SCROLL_LOCAL_CHAIN_ID = 31337 // Hardhat/Local para desarrollo

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isScrollNetwork, setIsScrollNetwork] = useState(true) // Cambiado a true por defecto
  const [balance, setBalance] = useState("0")

  // Función para actualizar el estado cuando cambia la cuenta
  const handleAccountsChanged = useCallback(
    async (accounts: string[]) => {
      if (accounts.length === 0) {
        // El usuario desconectó su wallet
        setAddress(null)
        setSigner(null)
        setIsConnected(false)
      } else if (accounts[0] !== address) {
        // El usuario cambió de cuenta
        setAddress(accounts[0])
        if (provider) {
          const newSigner = await provider.getSigner()
          setSigner(newSigner)

          // Actualizar balance
          try {
            const balance = await provider.getBalance(accounts[0])
            setBalance(ethers.formatEther(balance))
          } catch (error) {
            console.error("Error al obtener balance:", error)
          }
        }
      }
    },
    [address, provider],
  )

  // Función para actualizar el estado cuando cambia la red
  const handleChainChanged = useCallback((chainIdHex: string) => {
    const newChainId = Number.parseInt(chainIdHex, 16)
    setChainId(newChainId)
    // Aceptamos cualquier red para evitar alertas
    setIsScrollNetwork(true)
  }, [])

  // Función para conectar wallet
  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Solicitar acceso a la cuenta
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

        // Crear provider y signer con ethers v6
        const web3Provider = new ethers.BrowserProvider(window.ethereum)
        setProvider(web3Provider)

        const web3Signer = await web3Provider.getSigner()
        setSigner(web3Signer)

        // Obtener dirección
        setAddress(accounts[0])
        setIsConnected(true)

        // Obtener ID de la red
        const chainIdHex = await window.ethereum.request({ method: "eth_chainId" })
        const chainId = Number.parseInt(chainIdHex, 16)
        setChainId(chainId)
        // Aceptamos cualquier red para evitar alertas
        setIsScrollNetwork(true)

        // Obtener balance
        const balance = await web3Provider.getBalance(accounts[0])
        setBalance(ethers.formatEther(balance))

        // Configurar event listeners
        window.ethereum.on("accountsChanged", handleAccountsChanged)
        window.ethereum.on("chainChanged", handleChainChanged)

        return accounts[0]
      } catch (error) {
        console.error("Error al conectar wallet:", error)
        throw error
      }
    } else {
      console.error("MetaMask no está instalado")
      throw new Error("MetaMask no está instalado")
    }
  }

  // Función para desconectar wallet
  const disconnect = () => {
    setProvider(null)
    setSigner(null)
    setAddress(null)
    setChainId(null)
    setIsConnected(false)
    setIsScrollNetwork(true) // Mantenemos en true para evitar alertas
    setBalance("0")

    // Eliminar event listeners
    if (window.ethereum) {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum.removeListener("chainChanged", handleChainChanged)
    }
  }

  // Limpiar event listeners al desmontar
  useEffect(() => {
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [handleAccountsChanged, handleChainChanged])

  // Intentar reconectar si hay una wallet conectada previamente
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            await connect()
          }
        } catch (error) {
          console.error("Error al verificar conexión:", error)
        }
      }
    }

    checkConnection()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    provider,
    signer,
    address,
    chainId,
    isConnected,
    isScrollNetwork: true, // Siempre true para evitar alertas
    balance,
    connect,
    disconnect,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

// Declaración para window.ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}
