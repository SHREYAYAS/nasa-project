import { NextResponse } from "next/server"
import { nasaOfficialClient } from "@/lib/nasa-official"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const satelliteId = searchParams.get("satelliteId")

    const tleData = await nasaOfficialClient.getTLEData(satelliteId ? Number.parseInt(satelliteId) : undefined)

    return NextResponse.json({ success: true, data: tleData })
  } catch (error) {
    console.error("TLE API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch TLE data" }, { status: 500 })
  }
}
