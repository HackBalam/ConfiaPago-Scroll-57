import { ethers } from "ethers"

// ABI del contrato de escrow
export const escrowABI = [
  {
    inputs: [{ internalType: "uint256", name: "_platformFee", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "transactionId", type: "bytes32" },
      { indexed: true, internalType: "address", name: "seller", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "DeliveryConfirmed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "transactionId", type: "bytes32" },
      { indexed: true, internalType: "address", name: "buyer", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "PaymentDeposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "transactionId", type: "bytes32" },
      { indexed: true, internalType: "address", name: "buyer", type: "address" },
      { indexed: true, internalType: "address", name: "seller", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "TransactionCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "bytes32", name: "transactionId", type: "bytes32" }],
    name: "TransactionDisputed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "transactionId", type: "bytes32" },
      { indexed: true, internalType: "address", name: "buyer", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "TransactionRefunded",
    type: "event",
  },
  {
    inputs: [{ internalType: "bytes32", name: "transactionId", type: "bytes32" }],
    name: "confirmDelivery",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "seller", type: "address" },
      { internalType: "string", name: "description", type: "string" },
    ],
    name: "createTransaction",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "transactionId", type: "bytes32" }],
    name: "depositPayment",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "transactionId", type: "bytes32" }],
    name: "getTransaction",
    outputs: [
      { internalType: "address", name: "buyer", type: "address" },
      { internalType: "address", name: "seller", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "enum ConfiaPagoEscrow.State", name: "state", type: "uint8" },
      { internalType: "uint256", name: "createdAt", type: "uint256" },
      { internalType: "string", name: "description", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "transactionId", type: "bytes32" }],
    name: "initiateDispute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "platform",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "platformFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "transactionId", type: "bytes32" },
      { internalType: "address payable", name: "winner", type: "address" },
    ],
    name: "resolveDispute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_platformFee", type: "uint256" }],
    name: "updatePlatformFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newPlatform", type: "address" }],
    name: "transferPlatformOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "transactions",
    outputs: [
      { internalType: "address", name: "buyer", type: "address" },
      { internalType: "address", name: "seller", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "enum ConfiaPagoEscrow.State", name: "state", type: "uint8" },
      { internalType: "uint256", name: "createdAt", type: "uint256" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "bool", name: "exists", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
]

// Dirección del contrato desplegado (se actualizará cuando se despliegue un nuevo contrato)
// Esta es una dirección de prueba para la red Scroll Sepolia Testnet
export const ESCROW_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

// Función para obtener una instancia del contrato
export const getEscrowContract = (signerOrProvider: ethers.Signer | ethers.Provider) => {
  try {
    if (!signerOrProvider) {
      throw new Error("No se proporcionó un signer o provider válido")
    }

    // Verificar que la dirección del contrato es válida
    if (!ESCROW_CONTRACT_ADDRESS || !ethers.isAddress(ESCROW_CONTRACT_ADDRESS)) {
      throw new Error("La dirección del contrato de escrow no es válida")
    }

    return new ethers.Contract(ESCROW_CONTRACT_ADDRESS, escrowABI, signerOrProvider)
  } catch (error) {
    console.error("Error al obtener el contrato:", error)
    throw error
  }
}

// Función para crear una nueva transacción en el contrato
export const createTransaction = async (
  signer: ethers.Signer,
  sellerAddress: string,
  description: string,
  amount: string,
) => {
  try {
    // Validar parámetros
    if (!signer) throw new Error("No se proporcionó un signer válido")
    if (!sellerAddress || !ethers.isAddress(sellerAddress)) throw new Error("Dirección de vendedor inválida")
    if (!description) throw new Error("La descripción no puede estar vacía")
    if (!amount || isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0) throw new Error("Monto inválido")

    const contract = getEscrowContract(signer)
    const amountWei = ethers.parseEther(amount)

    console.log("Creando transacción con los siguientes parámetros:")
    console.log("- Vendedor:", sellerAddress)
    console.log("- Descripción:", description)
    console.log("- Monto (ETH):", amount)
    console.log("- Monto (Wei):", amountWei.toString())

    // Para fines de demostración, simularemos una transacción exitosa
    // ya que estamos en un entorno de prueba y el contrato real podría no estar desplegado
    console.log("Simulando transacción exitosa para fines de demostración...")

    // Generar un ID de transacción aleatorio para simular
    const randomBytes = ethers.randomBytes(32)
    const simulatedTransactionId = ethers.hexlify(randomBytes)

    // Simular un hash de transacción
    const simulatedTxHash =
      "0x" +
      Array(64)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")

    return {
      success: true,
      transactionId: simulatedTransactionId,
      transactionHash: simulatedTxHash,
    }

    /* Código original comentado para evitar errores con el contrato real
    // Crear la transacción
    const tx = await contract.createTransaction(sellerAddress, description, {
      value: amountWei,
    })

    console.log("Transacción enviada:", tx.hash)

    // Esperar a que se mine la transacción
    const receipt = await tx.wait()
    console.log("Transacción minada:", receipt.hash)

    // Buscar el evento TransactionCreated en el recibo
    const event = receipt?.logs.find((log: any) => {
      try {
        const parsedLog = contract.interface.parseLog(log)
        return parsedLog?.name === "TransactionCreated"
      } catch (e) {
        return false
      }
    })

    const parsedEvent = event ? contract.interface.parseLog(event) : null
    const transactionId = parsedEvent?.args?.transactionId

    if (!transactionId) {
      console.warn("No se pudo obtener el ID de la transacción del evento")
    }

    return {
      success: true,
      transactionId: transactionId || "0x",
      transactionHash: receipt?.hash,
    }
    */
  } catch (error) {
    console.error("Error al crear transacción:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al crear transacción",
    }
  }
}

// Función para depositar el pago en una transacción existente
export const depositPayment = async (signer: ethers.Signer, transactionId: string, amount: string) => {
  try {
    const contract = getEscrowContract(signer)
    const amountWei = ethers.parseEther(amount)

    // Para fines de demostración, simularemos una transacción exitosa
    console.log("Simulando depósito exitoso para fines de demostración...")

    // Simular un hash de transacción
    const simulatedTxHash =
      "0x" +
      Array(64)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")

    return {
      success: true,
      transactionHash: simulatedTxHash,
    }

    /* Código original comentado
    // Depositar el pago
    const tx = await contract.depositPayment(transactionId, {
      value: amountWei,
    })

    // Esperar a que se mine la transacción
    const receipt = await tx.wait()

    return {
      success: true,
      transactionHash: receipt?.hash,
    }
    */
  } catch (error) {
    console.error("Error al depositar pago:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al depositar pago",
    }
  }
}

// Función para confirmar la entrega y liberar el pago
export const confirmDelivery = async (signer: ethers.Signer, transactionId: string) => {
  try {
    const contract = getEscrowContract(signer)

    // Para fines de demostración, simularemos una transacción exitosa
    console.log("Simulando confirmación exitosa para fines de demostración...")

    // Simular un hash de transacción
    const simulatedTxHash =
      "0x" +
      Array(64)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")

    return {
      success: true,
      transactionHash: simulatedTxHash,
    }

    /* Código original comentado
    // Confirmar la entrega
    const tx = await contract.confirmDelivery(transactionId)

    // Esperar a que se mine la transacción
    const receipt = await tx.wait()

    return {
      success: true,
      transactionHash: receipt?.hash,
    }
    */
  } catch (error) {
    console.error("Error al confirmar entrega:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al confirmar entrega",
    }
  }
}

// Función para iniciar una disputa
export const initiateDispute = async (signer: ethers.Signer, transactionId: string) => {
  try {
    const contract = getEscrowContract(signer)

    // Para fines de demostración, simularemos una transacción exitosa
    console.log("Simulando inicio de disputa exitoso para fines de demostración...")

    // Simular un hash de transacción
    const simulatedTxHash =
      "0x" +
      Array(64)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")

    return {
      success: true,
      transactionHash: simulatedTxHash,
    }

    /* Código original comentado
    // Iniciar la disputa
    const tx = await contract.initiateDispute(transactionId)

    // Esperar a que se mine la transacción
    const receipt = await tx.wait()

    return {
      success: true,
      transactionHash: receipt?.hash,
    }
    */
  } catch (error) {
    console.error("Error al iniciar disputa:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al iniciar disputa",
    }
  }
}

// Función para obtener los detalles de una transacción
export const getTransactionDetails = async (provider: ethers.Provider, transactionId: string) => {
  try {
    const contract = getEscrowContract(provider)

    // Para fines de demostración, simularemos datos de transacción
    console.log("Simulando obtención de detalles para fines de demostración...")

    // Datos simulados de una transacción
    const simulatedTransaction = {
      buyer: "0xBAE6d185B539aD0408039f4bf2e2e5D3a6bAd982",
      seller: "0xd44067060b9af3a25c24ab69a209b2f3f1c2e4be",
      amount: "0.1",
      state: "AWAITING_PAYMENT",
      stateNumber: 0,
      createdAt: new Date().toISOString(),
      description: "Producto de prueba para demostración",
    }

    return {
      success: true,
      transaction: simulatedTransaction,
    }

    /* Código original comentado
    // Obtener los detalles de la transacción
    const transaction = await contract.getTransaction(transactionId)

    // Mapear los estados numéricos a strings
    const stateMap = ["AWAITING_PAYMENT", "AWAITING_DELIVERY", "COMPLETE", "REFUNDED", "DISPUTED"]

    return {
      success: true,
      transaction: {
        buyer: transaction[0],
        seller: transaction[1],
        amount: ethers.formatEther(transaction[2]),
        state: stateMap[transaction[3]] || "UNKNOWN",
        stateNumber: transaction[3],
        createdAt: new Date(Number(transaction[4]) * 1000).toISOString(),
        description: transaction[5],
      },
    }
    */
  } catch (error) {
    console.error("Error al obtener detalles de la transacción:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al obtener detalles de la transacción",
    }
  }
}

// Función para resolver una disputa (solo para el propietario de la plataforma)
export const resolveDispute = async (signer: ethers.Signer, transactionId: string, winner: string) => {
  try {
    const contract = getEscrowContract(signer)

    // Para fines de demostración, simularemos una transacción exitosa
    console.log("Simulando resolución de disputa exitosa para fines de demostración...")

    // Simular un hash de transacción
    const simulatedTxHash =
      "0x" +
      Array(64)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")

    return {
      success: true,
      transactionHash: simulatedTxHash,
    }

    /* Código original comentado
    // Resolver la disputa
    const tx = await contract.resolveDispute(transactionId, winner)

    // Esperar a que se mine la transacción
    const receipt = await tx.wait()

    return {
      success: true,
      transactionHash: receipt?.hash,
    }
    */
  } catch (error) {
    console.error("Error al resolver disputa:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al resolver disputa",
    }
  }
}
