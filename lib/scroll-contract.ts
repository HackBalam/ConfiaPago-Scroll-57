import { ethers } from "ethers"

// Función para obtener el proveedor de Scroll
export const getScrollProvider = () => {
  // Scroll Mainnet
  return new ethers.JsonRpcProvider("https://rpc.scroll.io")

  // Para Scroll Sepolia Testnet, usar:
  // return new ethers.JsonRpcProvider("https://sepolia-rpc.scroll.io")
}

// Función para obtener un signer (firmante) con una wallet conectada
export const getScrollSigner = (provider: ethers.BrowserProvider) => {
  return provider.getSigner()
}

// Función para desplegar un contrato en Scroll
export const deployContract = async (
  abi: any[],
  bytecode: string,
  signer: ethers.Signer,
  constructorArgs: any[] = [],
) => {
  try {
    // Crear una factory de contrato
    const contractFactory = new ethers.ContractFactory(abi, bytecode, signer)

    // Estimar gas para el despliegue
    const gasEstimate = await signer.estimateGas({
      data: (await contractFactory.getDeployTransaction(...constructorArgs)).data,
    })

    // Desplegar el contrato con un límite de gas ligeramente mayor
    const contract = await contractFactory.deploy(...constructorArgs, {
      gasLimit: (gasEstimate * BigInt(120)) / BigInt(100), // 20% extra para seguridad
    })

    // Esperar a que se mine la transacción
    await contract.waitForDeployment()

    return {
      success: true,
      contractAddress: await contract.getAddress(),
      transactionHash: contract.deploymentTransaction()?.hash,
    }
  } catch (error) {
    console.error("Error al desplegar contrato:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al desplegar contrato",
    }
  }
}

// Función para verificar si una dirección es un contrato
export const isContract = async (address: string, provider: ethers.Provider) => {
  try {
    const code = await provider.getCode(address)
    return code !== "0x"
  } catch (error) {
    console.error("Error al verificar contrato:", error)
    return false
  }
}

// Función para interactuar con un contrato desplegado
export const getContract = (address: string, abi: any[], signerOrProvider: ethers.Signer | ethers.Provider) => {
  return new ethers.Contract(address, abi, signerOrProvider)
}

// Función para obtener el balance de ETH en una dirección
export const getBalance = async (address: string, provider: ethers.Provider) => {
  try {
    const balance = await provider.getBalance(address)
    return ethers.formatEther(balance)
  } catch (error) {
    console.error("Error al obtener balance:", error)
    return "0"
  }
}
