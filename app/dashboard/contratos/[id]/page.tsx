"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ExternalLink, Copy, CheckCircle2, FileCode } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/components/wallet-provider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Datos de ejemplo para el contrato
const contratosEjemplo = {
  "1": {
    id: "1",
    nombre: "ConfiaPago Escrow",
    descripcion: "Contrato de escrow para transacciones seguras",
    direccion: "0x1234567890123456789012345678901234567890",
    fechaDespliegue: "2023-05-01",
    red: "Scroll",
    transacciones: 12,
    tipo: "Escrow",
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_platformFee",
            type: "uint256",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [],
        name: "platform",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "transactionId",
            type: "bytes32",
          },
        ],
        name: "confirmDelivery",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    codigo: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ConfiaPago Escrow
 * @dev Contrato para transacciones seguras con depósito en garantía
 */
contract ConfiaPagoEscrow {
    address public platform;
    uint256 public platformFee; // en base 10000 (e.g., 200 = 2%)
    
    enum State { AWAITING_PAYMENT, AWAITING_DELIVERY, COMPLETE, REFUNDED, DISPUTED }
    
    struct Transaction {
        address buyer;
        address seller;
        uint256 amount;
        State state;
        uint256 createdAt;
        string description;
        bool exists;
    }
    
    mapping(bytes32 => Transaction) public transactions;
    
    event TransactionCreated(bytes32 indexed transactionId, address indexed buyer, address indexed seller, uint256 amount);
    event PaymentDeposited(bytes32 indexed transactionId, address indexed buyer, uint256 amount);
    event DeliveryConfirmed(bytes32 indexed transactionId, address indexed seller, uint256 amount);
    event TransactionDisputed(bytes32 indexed transactionId);
    event TransactionRefunded(bytes32 indexed transactionId, address indexed buyer, uint256 amount);
    
    modifier onlyPlatform() {
        require(msg.sender == platform, "Solo la plataforma puede ejecutar esta funcion");
        _;
    }
    
    modifier onlyBuyer(bytes32 transactionId) {
        require(transactions[transactionId].buyer == msg.sender, "Solo el comprador puede ejecutar esta funcion");
        _;
    }
    
    modifier onlySeller(bytes32 transactionId) {
        require(transactions[transactionId].seller == msg.sender, "Solo el vendedor puede ejecutar esta funcion");
        _;
    }
    
    constructor(uint256 _platformFee) {
        platform = msg.sender;
        platformFee = _platformFee;
    }
    
    function createTransaction(address seller, string memory description) external payable returns (bytes32) {
        require(msg.value > 0, "El monto debe ser mayor que cero");
        require(seller != address(0), "Direccion de vendedor invalida");
        require(seller != msg.sender, "El comprador no puede ser el vendedor");
        
        bytes32 transactionId = keccak256(abi.encodePacked(msg.sender, seller, block.timestamp, description));
        
        require(!transactions[transactionId].exists, "La transaccion ya existe");
        
        transactions[transactionId] = Transaction({
            buyer: msg.sender,
            seller: seller,
            amount: msg.value,
            state: State.AWAITING_PAYMENT,
            createdAt: block.timestamp,
            description: description,
            exists: true
        });
        
        emit TransactionCreated(transactionId, msg.sender, seller, msg.value);
        
        return transactionId;
    }
    
    function depositPayment(bytes32 transactionId) external payable onlyBuyer(transactionId) {
        Transaction storage transaction = transactions[transactionId];
        
        require(transaction.exists, "La transaccion no existe");
        require(transaction.state == State.AWAITING_PAYMENT, "Estado incorrecto");
        require(msg.value == transaction.amount, "Monto incorrecto");
        
        transaction.state = State.AWAITING_DELIVERY;
        
        emit PaymentDeposited(transactionId, msg.sender, msg.value);
    }
    
    function confirmDelivery(bytes32 transactionId) external onlyBuyer(transactionId) {
        Transaction storage transaction = transactions[transactionId];
        
        require(transaction.exists, "La transaccion no existe");
        require(transaction.state == State.AWAITING_DELIVERY, "Estado incorrecto");
        
        transaction.state = State.COMPLETE;
        
        uint256 fee = (transaction.amount * platformFee) / 10000;
        uint256 sellerAmount = transaction.amount - fee;
        
        payable(transaction.seller).transfer(sellerAmount);
        payable(platform).transfer(fee);
        
        emit DeliveryConfirmed(transactionId, transaction.seller, sellerAmount);
    }
    
    // Más funciones...
}`,
    txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    creador: "0x9876543210987654321098765432109876543210",
    eventos: [
      {
        nombre: "TransactionCreated",
        hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        fecha: "2023-05-01 14:30:45",
        datos: {
          transactionId: "0x1234567890123456789012345678901234567890123456789012345678901234",
          buyer: "0x1111111111111111111111111111111111111111",
          seller: "0x2222222222222222222222222222222222222222",
          amount: "500000000000000000",
        },
      },
      {
        nombre: "PaymentDeposited",
        hash: "0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890a",
        fecha: "2023-05-01 14:35:12",
        datos: {
          transactionId: "0x1234567890123456789012345678901234567890123456789012345678901234",
          buyer: "0x1111111111111111111111111111111111111111",
          amount: "500000000000000000",
        },
      },
    ],
  },
}

export default function ContratoDetallePage() {
  const params = useParams()
  const router = useRouter()
  const { isConnected, isScrollNetwork } = useWallet()
  const id = params.id as string
  const contrato = contratosEjemplo[id as keyof typeof contratosEjemplo]

  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  const [functionParams, setFunctionParams] = useState<{ [key: string]: string }>({})

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(address)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  if (!contrato) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center">
        <h1 className="text-2xl font-bold">Contrato no encontrado</h1>
        <p className="mb-4 text-muted-foreground">El contrato que buscas no existe o no tienes acceso a él.</p>
        <Button asChild>
          <Link href="/dashboard/contratos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Contratos
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard/contratos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Contratos
          </Link>
        </Button>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{contrato.nombre}</h1>
          <Badge variant="outline" className="bg-green-500/10 text-green-600">
            {contrato.red}
          </Badge>
        </div>
        <p className="text-muted-foreground">{contrato.descripcion}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="codigo" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="codigo">Código</TabsTrigger>
              <TabsTrigger value="interactuar">Interactuar</TabsTrigger>
              <TabsTrigger value="eventos">Eventos</TabsTrigger>
            </TabsList>

            <TabsContent value="codigo">
              <Card>
                <CardHeader>
                  <CardTitle>Código del Contrato</CardTitle>
                  <CardDescription>Código fuente en Solidity del contrato desplegado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-muted p-4 overflow-auto max-h-[500px]">
                    <pre className="text-xs font-mono">
                      <code>{contrato.codigo}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interactuar">
              <Card>
                <CardHeader>
                  <CardTitle>Interactuar con el Contrato</CardTitle>
                  <CardDescription>Ejecuta funciones del contrato directamente desde la interfaz</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!isConnected && (
                    <div className="rounded-md bg-amber-50 p-4 text-amber-800">
                      <p className="text-sm font-medium">Wallet no conectada</p>
                      <p className="text-xs">Necesitas conectar tu wallet para interactuar con el contrato.</p>
                    </div>
                  )}

                  {isConnected && !isScrollNetwork && (
                    <div className="rounded-md bg-amber-50 p-4 text-amber-800">
                      <p className="text-sm font-medium">Red incorrecta</p>
                      <p className="text-xs">
                        Por favor, cambia a la red Scroll en tu wallet para interactuar con el contrato.
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="rounded-md border p-4">
                      <h3 className="mb-2 text-sm font-medium">platform()</h3>
                      <p className="mb-4 text-xs text-muted-foreground">Obtiene la dirección de la plataforma</p>
                      <Button size="sm" disabled={!isConnected || !isScrollNetwork}>
                        Ejecutar
                      </Button>
                    </div>

                    <div className="rounded-md border p-4">
                      <h3 className="mb-2 text-sm font-medium">confirmDelivery(bytes32 transactionId)</h3>
                      <p className="mb-4 text-xs text-muted-foreground">
                        Confirma la entrega de un producto y libera el pago
                      </p>

                      <div className="mb-4 space-y-2">
                        <Label htmlFor="transactionId">transactionId (bytes32)</Label>
                        <Input
                          id="transactionId"
                          placeholder="0x1234..."
                          value={functionParams.transactionId || ""}
                          onChange={(e) => setFunctionParams({ ...functionParams, transactionId: e.target.value })}
                        />
                      </div>

                      <Button size="sm" disabled={!isConnected || !isScrollNetwork || !functionParams.transactionId}>
                        Ejecutar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="eventos">
              <Card>
                <CardHeader>
                  <CardTitle>Eventos del Contrato</CardTitle>
                  <CardDescription>Historial de eventos emitidos por el contrato</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contrato.eventos.map((evento, index) => (
                      <div key={index} className="rounded-md border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            {evento.nombre}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{evento.fecha}</span>
                        </div>

                        <div className="mb-2 text-xs">
                          <span className="text-muted-foreground">TX: </span>
                          <a
                            href={`https://scrollscan.com/tx/${evento.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {evento.hash.substring(0, 10)}...{evento.hash.substring(evento.hash.length - 8)}
                          </a>
                        </div>

                        <div className="rounded-md bg-muted p-2">
                          <pre className="text-xs overflow-auto">
                            <code>{JSON.stringify(evento.datos, null, 2)}</code>
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Información del Contrato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">Dirección</h3>
                <div className="flex items-center gap-1">
                  <p className="font-mono text-sm break-all">{contrato.direccion}</p>
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

              <Separator />

              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">Creador</h3>
                <p className="font-mono text-sm">
                  {contrato.creador.substring(0, 6)}...{contrato.creador.substring(contrato.creador.length - 4)}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">Fecha de despliegue</h3>
                <p className="text-sm">{contrato.fechaDespliegue}</p>
              </div>

              <Separator />

              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">Transacción de despliegue</h3>
                <a
                  href={`https://scrollscan.com/tx/${contrato.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline text-sm"
                >
                  {contrato.txHash.substring(0, 10)}...{contrato.txHash.substring(contrato.txHash.length - 8)}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <Separator />

              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">Transacciones</h3>
                <p className="text-sm">{contrato.transacciones}</p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a
                    href={`https://scrollscan.com/address/${contrato.direccion}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1"
                  >
                    Ver en Explorer
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <FileCode className="mr-1 h-4 w-4" />
                  Verificar
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>ABI del Contrato</CardTitle>
              <CardDescription>Interfaz Binaria de Aplicación para interactuar con el contrato</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-muted p-4 overflow-auto max-h-[200px]">
                <pre className="text-xs font-mono">
                  <code>{JSON.stringify(contrato.abi, null, 2)}</code>
                </pre>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleCopyAddress(JSON.stringify(contrato.abi))}
              >
                {copiedAddress === JSON.stringify(contrato.abi) ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar ABI
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
