// Blockchain utility functions and types

export interface Transaction {
  id: string
  type: "debris_capture" | "material_processing" | "satellite_servicing" | "power_transfer"
  timestamp: string
  blockHeight: number
  hash: string
  from: string
  to: string
  data: Record<string, any>
  status: "pending" | "confirmed" | "failed"
  gasUsed: number
  signature: string
}

export interface Block {
  height: number
  hash: string
  timestamp: string
  previousHash: string
  merkleRoot: string
  transactions: string[]
  validator: string
  gasUsed: number
  gasLimit: number
  difficulty: number
  nonce: number
  size: number
}

export interface SmartContract {
  address: string
  name: string
  type: string
  deployedAt: string
  version: string
  status: "active" | "paused" | "deprecated"
  totalTransactions: number
  lastActivity: string
  abi: any[]
  bytecode: string
}

// Blockchain API client
export class BlockchainClient {
  private baseUrl: string

  constructor(baseUrl = "/api/blockchain") {
    this.baseUrl = baseUrl
  }

  async getTransactions(params?: {
    type?: string
    status?: string
    limit?: number
  }): Promise<{ data: Transaction[]; total: number }> {
    const searchParams = new URLSearchParams()
    if (params?.type) searchParams.set("type", params.type)
    if (params?.status) searchParams.set("status", params.status)
    if (params?.limit) searchParams.set("limit", params.limit.toString())

    const response = await fetch(`${this.baseUrl}/transactions?${searchParams}`)
    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error)
    }

    return { data: result.data, total: result.total }
  }

  async createTransaction(transaction: {
    type: string
    data: Record<string, any>
    from: string
    to: string
  }): Promise<Transaction> {
    const response = await fetch(`${this.baseUrl}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error)
    }

    return result.data
  }

  async getBlocks(params?: {
    limit?: number
    height?: number
  }): Promise<{ data: Block | Block[]; total?: number }> {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.height) searchParams.set("height", params.height.toString())

    const response = await fetch(`${this.baseUrl}/blocks?${searchParams}`)
    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error)
    }

    return { data: result.data, total: result.total }
  }

  async getSmartContracts(params?: {
    type?: string
    address?: string
  }): Promise<{ data: SmartContract | SmartContract[]; total?: number }> {
    const searchParams = new URLSearchParams()
    if (params?.type) searchParams.set("type", params.type)
    if (params?.address) searchParams.set("address", params.address)

    const response = await fetch(`${this.baseUrl}/smart-contracts?${searchParams}`)
    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error)
    }

    return { data: result.data, total: result.total }
  }

  async executeContract(params: {
    contractAddress: string
    functionName: string
    parameters: any[]
  }): Promise<any> {
    const response = await fetch(`${this.baseUrl}/smart-contracts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error)
    }

    return result.data
  }

  async getAnalytics(timeframe = "7d"): Promise<any> {
    const response = await fetch(`${this.baseUrl}/analytics?timeframe=${timeframe}`)
    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error)
    }

    return result.data
  }
}

// Utility functions
export function formatTransactionHash(hash: string): string {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function calculateTransactionFee(gasUsed: number, gasPrice = 20): number {
  return (gasUsed * gasPrice) / 1e9 // Convert to ORB tokens
}

export function validateTransactionData(type: string, data: any): boolean {
  switch (type) {
    case "debris_capture":
      return data.satellite && data.debris && data.quantity
    case "material_processing":
      return data.satellite && data.material && data.quantity
    case "satellite_servicing":
      return data.satellite && data.target && data.service
    case "power_transfer":
      return data.from && data.to && data.powerAmount
    default:
      return false
  }
}

// Create singleton instance
export const blockchainClient = new BlockchainClient()
