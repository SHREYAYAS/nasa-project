import { type NextRequest, NextResponse } from "next/server"

interface BlockchainBlock {
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

// Mock blockchain blocks
const mockBlocks: BlockchainBlock[] = [
  {
    height: 1247893,
    hash: "0x9f8e7d6c5b4a39281726354abc123def456789ab",
    timestamp: new Date().toISOString(),
    previousHash: "0x8e7d6c5b4a392817263541def456789abc123def",
    merkleRoot: "0x7d6c5b4a3928172635412fdef456789abc123def4",
    transactions: ["0x1a2b3c4d5e6f7890", "0x2b3c4d5e6f789012", "0x3c4d5e6f78901234"],
    validator: "OrbNet-Validator-1",
    gasUsed: 156000,
    gasLimit: 8000000,
    difficulty: 15000000000000,
    nonce: 2847593,
    size: 2048,
  },
  {
    height: 1247892,
    hash: "0x8e7d6c5b4a392817263541def456789abc123def",
    timestamp: new Date(Date.now() - 120000).toISOString(),
    previousHash: "0x7d6c5b4a3928172635412fdef456789abc123def4",
    merkleRoot: "0x6c5b4a3928172635412fdef456789abc123def456",
    transactions: ["0x4d5e6f7890123456", "0x5e6f789012345678"],
    validator: "OrbNet-Validator-2",
    gasUsed: 98000,
    gasLimit: 8000000,
    difficulty: 14800000000000,
    nonce: 1847293,
    size: 1536,
  },
  {
    height: 1247891,
    hash: "0x7d6c5b4a3928172635412fdef456789abc123def4",
    timestamp: new Date(Date.now() - 240000).toISOString(),
    previousHash: "0x6c5b4a3928172635412fdef456789abc123def456",
    merkleRoot: "0x5b4a3928172635412fdef456789abc123def45678",
    transactions: [
      "0x6f78901234567890",
      "0x789012345678901a",
      "0x89012345678901ab",
      "0x9012345678901abc",
      "0xa012345678901bcd",
    ],
    validator: "OrbNet-Validator-3",
    gasUsed: 234000,
    gasLimit: 8000000,
    difficulty: 14600000000000,
    nonce: 3847193,
    size: 3072,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const height = searchParams.get("height")

    if (height) {
      const block = mockBlocks.find((b) => b.height === Number.parseInt(height))
      if (!block) {
        return NextResponse.json({ success: false, error: "Block not found" }, { status: 404 })
      }
      return NextResponse.json({
        success: true,
        data: block,
      })
    }

    const paginatedBlocks = mockBlocks.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: paginatedBlocks,
      total: mockBlocks.length,
      chainInfo: {
        latestBlock: Math.max(...mockBlocks.map((b) => b.height)),
        totalBlocks: mockBlocks.length,
        avgBlockTime: "2.1s",
        networkHashRate: "1.2 TH/s",
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch blocks" }, { status: 500 })
  }
}
