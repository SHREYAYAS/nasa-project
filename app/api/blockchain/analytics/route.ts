import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "7d"

    // Mock analytics data
    const analyticsData = {
      network: {
        totalTransactions: 1247893,
        totalBlocks: 1247893,
        activeValidators: 7,
        networkHashRate: "1.2 TH/s",
        avgBlockTime: "2.1s",
        tps: 450, // transactions per second
        uptime: 99.97,
      },
      transactions: {
        daily: [
          { date: "2024-01-09", count: 1247, volume: 2.4 },
          { date: "2024-01-10", count: 1356, volume: 2.8 },
          { date: "2024-01-11", count: 1489, volume: 3.1 },
          { date: "2024-01-12", count: 1623, volume: 3.6 },
          { date: "2024-01-13", count: 1734, volume: 4.2 },
          { date: "2024-01-14", count: 1845, volume: 4.8 },
          { date: "2024-01-15", count: 1967, volume: 5.3 },
        ],
        byType: {
          debris_capture: 45,
          material_processing: 30,
          satellite_servicing: 15,
          power_transfer: 10,
        },
      },
      contracts: {
        totalDeployed: 4,
        totalInteractions: 5429,
        mostActive: "Orbital Debris Registry",
        gasConsumption: {
          total: 12847593,
          average: 35420,
        },
      },
      validators: [
        {
          name: "OrbNet-Validator-1",
          address: "0xValidator1Address123456789abcdef",
          blocksProduced: 178234,
          uptime: 99.98,
          stake: "1000000 ORB",
        },
        {
          name: "OrbNet-Validator-2",
          address: "0xValidator2Address456789abcdef123",
          blocksProduced: 178156,
          uptime: 99.95,
          stake: "950000 ORB",
        },
        {
          name: "OrbNet-Validator-3",
          address: "0xValidator3Address789abcdef123456",
          blocksProduced: 178089,
          uptime: 99.97,
          stake: "900000 ORB",
        },
      ],
      security: {
        threatLevel: "low",
        lastSecurityAudit: "2024-01-01",
        encryptionStandard: "AES-256",
        consensusAlgorithm: "Proof of Stake",
        decentralizationScore: 8.7,
      },
    }

    return NextResponse.json({
      success: true,
      data: analyticsData,
      timeframe,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 })
  }
}
