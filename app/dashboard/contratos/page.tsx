"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileCode, ExternalLink, Copy, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/components/wallet-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

// Datos de ejemplo para contratos desplegados
const contratosEjemplo = [
  {
    id: "1",
    nombre: "ConfiaPago Escrow",
    descripcion: "Contrato de escrow para transacciones seguras",
    direccion: "0x1234567890123456789012345678901234567890",
    fechaDespliegue: "2023-05-01",
    red: "Scroll",
    transacciones: 12,
    tipo: "Escrow",
  },
  {
    id: "2",
    nombre: "Token USDT",
    descripcion: "Implementación de token ERC-20 para USDT en Scroll",
    direccion: "0x2345678901234567890123456789012345678901",
    fechaDespliegue: "2023-04-15",
    red: "Scroll",
    transacciones: 45,
    tipo: "Token",
  },
  {
    id: "3",
    nombre: "Verificador de Pruebas",
    descripcion: "Contrato para verificar pruebas de envío mediante hashes",
    direccion: "0x3456789012345678901234567890123456789012",
    fechaDespliegue: "2023-05-10",
    red: "Scroll",
    transacciones: 8,
    tipo: "Verificador",
  },
]

export default function ContratosPage() {
  const { isConnected, isScrollNetwork } = useWallet()
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(address)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Contratos Inteligentes</h1>
          <p className="text-muted-foreground">Gestiona tus contratos inteligentes en la blockchain de Scroll.</p>
        </div>
        <Button asChild className="w-full md:w-auto">
          <Link href="/dashboard/contratos/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Desplegar Nuevo Contrato
          </Link>
        </Button>
      </div>

      {!isConnected && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <div className="mt-1 text-amber-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-amber-800">Wallet no conectada</h3>
                <p className="text-sm text-amber-700">
                  Necesitas conectar tu wallet para interactuar con contratos en la blockchain.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isConnected && !isScrollNetwork && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <div className="mt-1 text-amber-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-amber-800">Red incorrecta</h3>
                <p className="text-sm text-amber-700">
                  Por favor, cambia a la red Scroll en tu wallet para interactuar con los contratos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="desplegados" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="desplegados">Contratos Desplegados</TabsTrigger>
          <TabsTrigger value="plantillas">Plantillas</TabsTrigger>
        </TabsList>
        <TabsContent value="desplegados">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contratosEjemplo.map((contrato) => (
              <Card key={contrato.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30 p-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {contrato.tipo}
                    </Badge>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600">
                      {contrato.red}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="mb-2 text-lg">{contrato.nombre}</CardTitle>
                  <CardDescription className="mb-4">{contrato.descripcion}</CardDescription>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Dirección:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium">
                          {contrato.direccion.substring(0, 6)}...
                          {contrato.direccion.substring(contrato.direccion.length - 4)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopyAddress(contrato.direccion)}
                        >
                          {copiedAddress === contrato.direccion ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Fecha:</span>
                      <span className="text-sm">{contrato.fechaDespliegue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Transacciones:</span>
                      <span className="text-sm">{contrato.transacciones}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/contratos/${contrato.id}`}>Ver Detalles</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={`https://scrollscan.com/address/${contrato.direccion}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        Explorer
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="plantillas">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Contrato de Escrow</CardTitle>
                <CardDescription>Plantilla para transacciones seguras con depósito en garantía</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-4">
                  <pre className="text-xs">
                    <code>
                      // SPDX-License-Identifier: MIT{"\n"}
                      pragma solidity ^0.8.0;{"\n\n"}
                      contract Escrow {"{"}
                      {"\n"}
                      {"  "}// Código del contrato{"\n"}
                      {"}"}
                    </code>
                  </pre>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/dashboard/contratos/nuevo?template=escrow">
                    <FileCode className="mr-2 h-4 w-4" />
                    Usar Plantilla
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Token ERC-20</CardTitle>
                <CardDescription>Plantilla para crear tokens fungibles en la red Scroll</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-4">
                  <pre className="text-xs">
                    <code>
                      // SPDX-License-Identifier: MIT{"\n"}
                      pragma solidity ^0.8.0;{"\n\n"}
                      import "@openzeppelin/contracts/token/ERC20/ERC20.sol";{"\n\n"}
                      contract MyToken is ERC20 {"{"}
                      {"\n"}
                      {"  "}// Código del contrato{"\n"}
                      {"}"}
                    </code>
                  </pre>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/dashboard/contratos/nuevo?template=erc20">
                    <FileCode className="mr-2 h-4 w-4" />
                    Usar Plantilla
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>NFT (ERC-721)</CardTitle>
                <CardDescription>Plantilla para crear tokens no fungibles (NFTs)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-4">
                  <pre className="text-xs">
                    <code>
                      // SPDX-License-Identifier: MIT{"\n"}
                      pragma solidity ^0.8.0;{"\n\n"}
                      import "@openzeppelin/contracts/token/ERC721/ERC721.sol";{"\n\n"}
                      contract MyNFT is ERC721 {"{"}
                      {"\n"}
                      {"  "}// Código del contrato{"\n"}
                      {"}"}
                    </code>
                  </pre>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/dashboard/contratos/nuevo?template=erc721">
                    <FileCode className="mr-2 h-4 w-4" />
                    Usar Plantilla
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
