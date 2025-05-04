"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, FileCode, Upload, AlertCircle, CheckCircle, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useWallet } from "@/components/wallet-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { deployContract } from "@/lib/scroll-contract"

// Plantillas de contratos
const plantillas = {
  escrow: `// SPDX-License-Identifier: MIT
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
    
    function initiateDispute(bytes32 transactionId) external {
        Transaction storage transaction = transactions[transactionId];
        
        require(transaction.exists, "La transaccion no existe");
        require(transaction.state == State.AWAITING_DELIVERY, "Estado incorrecto");
        require(msg.sender == transaction.buyer || msg.sender == transaction.seller, "No autorizado");
        
        transaction.state = State.DISPUTED;
        
        emit TransactionDisputed(transactionId);
    }
    
    function resolveDispute(bytes32 transactionId, address payable winner) external onlyPlatform {
        Transaction storage transaction = transactions[transactionId];
        
        require(transaction.exists, "La transaccion no existe");
        require(transaction.state == State.DISPUTED, "Estado incorrecto");
        require(winner == transaction.buyer || winner == transaction.seller, "Ganador invalido");
        
        if (winner == transaction.buyer) {
            transaction.state = State.REFUNDED;
            payable(transaction.buyer).transfer(transaction.amount);
            emit TransactionRefunded(transactionId, transaction.buyer, transaction.amount);
        } else {
            transaction.state = State.COMPLETE;
            
            uint256 fee = (transaction.amount * platformFee) / 10000;
            uint256 sellerAmount = transaction.amount - fee;
            
            payable(transaction.seller).transfer(sellerAmount);
            payable(platform).transfer(fee);
            
            emit DeliveryConfirmed(transactionId, transaction.seller, sellerAmount);
        }
    }
    
    function getTransaction(bytes32 transactionId) external view returns (
        address buyer,
        address seller,
        uint256 amount,
        State state,
        uint256 createdAt,
        string memory description
    ) {
        Transaction storage transaction = transactions[transactionId];
        require(transaction.exists, "La transaccion no existe");
        
        return (
            transaction.buyer,
            transaction.seller,
            transaction.amount,
            transaction.state,
            transaction.createdAt,
            transaction.description
        );
    }
    
    function updatePlatformFee(uint256 _platformFee) external onlyPlatform {
        platformFee = _platformFee;
    }
    
    function transferPlatformOwnership(address newPlatform) external onlyPlatform {
        require(newPlatform != address(0), "Nueva direccion de plataforma invalida");
        platform = newPlatform;
    }
}`,
  erc20: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Token ERC-20 para ConfiaPago
 * @dev Implementación de token ERC-20 para uso en la plataforma ConfiaPago
 */
contract ConfiaPagoToken is ERC20, Ownable {
    uint8 private _decimals;
    
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimalsValue,
        uint256 initialSupply,
        address owner
    ) ERC20(name, symbol) Ownable(owner) {
        _decimals = decimalsValue;
        _mint(owner, initialSupply * (10 ** decimalsValue));
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    function burn(uint256 amount) public {
        _burn(_msgSender(), amount);
    }
    
    function burnFrom(address account, uint256 amount) public {
        _spendAllowance(account, _msgSender(), amount);
        _burn(account, amount);
    }
}`,
  erc721: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title NFT para ConfiaPago
 * @dev Implementación de NFT (ERC-721) para certificados de transacciones
 */
contract ConfiaPagoNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Eventos
    event NFTMinted(uint256 tokenId, address owner, string tokenURI);
    
    constructor(
        string memory name,
        string memory symbol,
        address owner
    ) ERC721(name, symbol) Ownable(owner) {}
    
    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        emit NFTMinted(newItemId, recipient, tokenURI);
        
        return newItemId;
    }
    
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
}`,
}

export default function NuevoContratoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isConnected, isScrollNetwork, signer } = useWallet()

  const [loading, setLoading] = useState(false)
  const [contractName, setContractName] = useState("")
  const [contractCode, setContractCode] = useState("")
  const [compiledContract, setCompiledContract] = useState<{ abi: any[]; bytecode: string } | null>(null)
  const [deploymentStatus, setDeploymentStatus] = useState<{
    status: "idle" | "compiling" | "compiled" | "deploying" | "success" | "error"
    message?: string
    address?: string
    txHash?: string
  }>({ status: "idle" })

  // Cargar plantilla si se especifica en la URL
  useEffect(() => {
    const template = searchParams.get("template")
    if (template && plantillas[template as keyof typeof plantillas]) {
      setContractCode(plantillas[template as keyof typeof plantillas])

      // Establecer nombre predeterminado según la plantilla
      if (template === "escrow") {
        setContractName("ConfiaPagoEscrow")
      } else if (template === "erc20") {
        setContractName("ConfiaPagoToken")
      } else if (template === "erc721") {
        setContractName("ConfiaPagoNFT")
      }
    }
  }, [searchParams])

  // Función para simular la compilación del contrato
  const compileContract = async () => {
    if (!contractCode.trim()) {
      setDeploymentStatus({
        status: "error",
        message: "El código del contrato no puede estar vacío",
      })
      return
    }

    setDeploymentStatus({ status: "compiling" })

    try {
      // En una implementación real, aquí se enviaría el código a un servicio de compilación
      // o se usaría una biblioteca como solc-js para compilar el contrato

      // Simulamos la compilación con un retraso
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulamos un ABI y bytecode para el ejemplo
      // En una implementación real, estos vendrían de la compilación
      const simulatedAbi = [
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
      ]

      const simulatedBytecode =
        "0x608060405234801561001057600080fd5b5060405161091f38038061091f83398101604081905261002f916100f7565b600080546001600160a01b03191633179055600155610124565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561008357818101518382015260200161006b565b60008484015250505050565b600082601f8301126100a057600080fd5b81516001600160401b03808211156100ba576100ba610047565b604051601f8301601f19908116603f011681019082821181831017156100e2576100e2610047565b816040528381526020925086838588010111156100fe57600080fd5b600091505b8382101561012057858201830151818301840152908201906100fe565b83821115610131576000848401525b50505050565b600060208284031215610108576000fd5b81516001600160a01b038116811461011e576000fd5b9392505050565b6107ec806101336000396000f3fe608060405260043610610051576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063430c208114610056578063aa8c217c1461008a578063f2c298be146100b5575b600080fd5b34801561006257600080fd5b5061006b6100de565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200160405180910390f35b34801561009657600080fd5b5061009f6100fd565b60405190815260200160405180910390f35b3480156100c157600080fd5b506100dc6100d0366004610103565b610103565b005b60005473ffffffffffffffffffffffffffffffffffffffff1681565b60015481565b600080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff83169081179091556040519081527f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0906020015b60405180910390a150565b60006020828403121561017457600080fd5b813573ffffffffffffffffffffffffffffffffffffffff8116811461019857600080fd5b9392505050565b6000602082840312156101b157600080fd5b5035919050565b6000602082840312156101ca57600080fd5b813567ffffffffffffffff8111156101e157600080fd5b8201601f810184136101f257600080fd5b803561020561020082610779565b610748565b81815287602083850101111561021a57600080fd5b61022b8260208301602086016107a9565b95945050505050565b60008060006060848603121561024957600080fd5b833573ffffffffffffffffffffffffffffffffffffffff8116811461026d57600080fd5b9250602084013567ffffffffffffffff8082111561028a57600080fd5b61029687838801610163565b935060408601359150808211156102ac57600080fd5b506102b9868287016101b8565b9150509250925092565b600080604083850312156102d657600080fd5b823573ffffffffffffffffffffffffffffffffffffffff811681146102fa57600080fd5b946020939093013593505050565b60006020828403121561031a57600080fd5b813567ffffffffffffffff81111561033157600080fd5b61033d848285016101b8565b949350505050565b60008060006060848603121561035a57600080fd5b833567ffffffffffffffff81111561037157600080fd5b61037d868287016101b8565b935050602084013573ffffffffffffffffffffffffffffffffffffffff811681146103a657600080fd5b9150604084013590509250925092565b600080604083850312156103c957600080fd5b823567ffffffffffffffff8111156103e057600080fd5b6103ec858286016101b8565b95602094909401359450505050565b60006020828403121561040d57600080fd5b813567ffffffffffffffff81111561042457600080fd5b8201601f8101841361043557600080fd5b803561044361020082610779565b81815287602083850101111561045857600080fd5b6104698260208301602086016107a9565b95945050505050565b6000806040838503121561048557600080fd5b823567ffffffffffffffff81111561049c57600080fd5b6104a8858286016101b8565b95602094909401359450505050565b600080604083850312156104ca57600080fd5b823567ffffffffffffffff8111156104e157600080fd5b6104ed858286016101b8565b95602094909401359450505050565b60006020828403121561050e57600080fd5b5035919050565b60006020828403121561052757600080fd5b813567ffffffffffffffff81111561053e57600080fd5b61033d848285016101b8565b60006020828403121561055c57600080fd5b813567ffffffffffffffff81111561057357600080fd5b8201601f8101841361058457600080fd5b803561059261020082610779565b8181528760208385010111156105a757600080fd5b6105b88260208301602086016107a9565b95945050505050565b600080604083850312156105d457600080fd5b823567ffffffffffffffff8111156105eb57600080fd5b6105f7858286016101b8565b95602094909401359450505050565b60006020828403121561061857600080fd5b813567ffffffffffffffff81111561062f57600080fd5b61033d848285016101b8565b60006020828403121561064c57600080fd5b813567ffffffffffffffff81111561066357600080fd5b61033d848285016101b8565b60006020828403121561068057600080fd5b813567ffffffffffffffff81111561069757600080fd5b61033d848285016101b8565b6000602082840312156106b457600080fd5b813567ffffffffffffffff8111156106cb57600080fd5b61033d848285016101b8565b6000602082840312156106e857600080fd5b813567ffffffffffffffff8111156106ff57600080fd5b61033d848285016101b8565b60006020828403121561071c57600080fd5b813567ffffffffffffffff81111561073357600080fd5b61033d848285016101b8565b604051601f8201601f1916810167ffffffffffffffff8111828210171561077157610771610779565b604052919050565b634e487b7160e01b600052604160045260246000fd5b60005b838110156107c45781810151838201526020016107ac565b50506000910152565b600181811c908216806107e257607f821691505b6020821081036107e057634e487b7160e01b600052602260045260246000fd5b50919050565b6000602082840312156107f957600080fd5b813567ffffffffffffffff81111561081057600080fd5b8201601f8101841361082157600080fd5b803561082f61020082610779565b81815287602083850101111561084457600080fd5b6108558260208301602086016107a9565b9594505050505056fea2646970667358221220d7a0f8c8a3c8f9c9f9c9f9c9f9c9f9c9f9c9f9c9f9c9f9c9f9c9f9c9f9c9f9c964736f6c63430008110033"

      setCompiledContract({
        abi: simulatedAbi,
        bytecode: simulatedBytecode,
      })

      setDeploymentStatus({
        status: "compiled",
        message: "Contrato compilado correctamente",
      })
    } catch (error) {
      console.error("Error al compilar contrato:", error)
      setDeploymentStatus({
        status: "error",
        message: error instanceof Error ? error.message : "Error desconocido al compilar contrato",
      })
    }
  }

  // Función para desplegar el contrato
  const deployCompiledContract = async () => {
    if (!signer || !compiledContract) {
      setDeploymentStatus({
        status: "error",
        message: "No hay un contrato compilado o wallet conectada",
      })
      return
    }

    setDeploymentStatus({ status: "deploying" })

    try {
      // En una implementación real, aquí se desplegaría el contrato usando ethers.js
      // Simulamos el despliegue para el ejemplo

      // Parámetros del constructor (ejemplo para el contrato de escrow)
      const constructorArgs = [200] // 2% de comisión

      // Desplegar el contrato
      const result = await deployContract(compiledContract.abi, compiledContract.bytecode, signer, constructorArgs)

      if (result.success) {
        setDeploymentStatus({
          status: "success",
          message: "Contrato desplegado correctamente",
          address: result.contractAddress,
          txHash: result.transactionHash,
        })
      } else {
        throw new Error(result.error || "Error desconocido al desplegar contrato")
      }
    } catch (error) {
      console.error("Error al desplegar contrato:", error)
      setDeploymentStatus({
        status: "error",
        message: error instanceof Error ? error.message : "Error desconocido al desplegar contrato",
      })
    }
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
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Desplegar Nuevo Contrato</h1>
        <p className="text-muted-foreground">Crea y despliega un contrato inteligente en la blockchain de Scroll.</p>
      </div>

      {!isConnected && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet no conectada</AlertTitle>
          <AlertDescription>Necesitas conectar tu wallet para desplegar contratos en la blockchain.</AlertDescription>
        </Alert>
      )}

      {isConnected && !isScrollNetwork && (
        <Alert variant="warning" className="mb-6 border-amber-200 bg-amber-50 text-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-800" />
          <AlertTitle>Red incorrecta</AlertTitle>
          <AlertDescription>Por favor, cambia a la red Scroll en tu wallet para desplegar contratos.</AlertDescription>
        </Alert>
      )}

      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>Información del Contrato</CardTitle>
          <CardDescription>Proporciona los detalles del contrato inteligente que deseas desplegar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Contrato</Label>
            <Input
              id="nombre"
              placeholder="Ej: ConfiaPagoEscrow"
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              required
            />
          </div>

          <Tabs defaultValue="codigo" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="codigo">Código del Contrato</TabsTrigger>
              <TabsTrigger value="archivo" disabled={deploymentStatus.status !== "idle"}>
                Subir Archivo
              </TabsTrigger>
            </TabsList>
            <TabsContent value="codigo">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código Solidity</Label>
                <Textarea
                  id="codigo"
                  placeholder="// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MiContrato {
    // Tu código aquí
}"
                  className="font-mono h-[400px]"
                  value={contractCode}
                  onChange={(e) => setContractCode(e.target.value)}
                  required
                />
              </div>
            </TabsContent>
            <TabsContent value="archivo">
              <div className="flex items-center justify-center rounded-md border border-dashed p-8">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">Arrastra y suelta o haz clic para seleccionar</p>
                  <p className="text-xs text-muted-foreground">Soporta archivos .sol (max. 1MB)</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {deploymentStatus.status === "compiled" && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Compilación exitosa</AlertTitle>
              <AlertDescription>
                El contrato ha sido compilado correctamente y está listo para ser desplegado.
              </AlertDescription>
            </Alert>
          )}

          {deploymentStatus.status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{deploymentStatus.message}</AlertDescription>
            </Alert>
          )}

          {deploymentStatus.status === "success" && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>¡Contrato desplegado con éxito!</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>El contrato ha sido desplegado correctamente en la blockchain de Scroll.</p>
                <div className="mt-2 rounded-md bg-green-100 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Dirección del contrato:</span>
                    <span className="font-mono text-xs">{deploymentStatus.address}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Hash de transacción:</span>
                    <a
                      href={`https://scrollscan.com/tx/${deploymentStatus.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline font-mono text-xs"
                    >
                      {deploymentStatus.txHash?.substring(0, 10)}...
                      {deploymentStatus.txHash?.substring((deploymentStatus.txHash?.length || 0) - 8)}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/dashboard/contratos")}
            disabled={loading || deploymentStatus.status === "compiling" || deploymentStatus.status === "deploying"}
          >
            Cancelar
          </Button>

          {deploymentStatus.status === "idle" && (
            <Button
              type="button"
              onClick={compileContract}
              disabled={!isConnected || !isScrollNetwork || !contractCode.trim() || loading}
            >
              <FileCode className="mr-2 h-4 w-4" />
              Compilar Contrato
            </Button>
          )}

          {deploymentStatus.status === "compiling" && (
            <Button disabled>
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Compilando...
            </Button>
          )}

          {deploymentStatus.status === "compiled" && (
            <Button
              type="button"
              onClick={deployCompiledContract}
              disabled={!isConnected || !isScrollNetwork || !compiledContract}
            >
              <Upload className="mr-2 h-4 w-4" />
              Desplegar Contrato
            </Button>
          )}

          {deploymentStatus.status === "deploying" && (
            <Button disabled>
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Desplegando...
            </Button>
          )}

          {deploymentStatus.status === "success" && (
            <Button type="button" onClick={() => router.push("/dashboard/contratos")}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Ver Mis Contratos
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
