import { NextResponse } from "next/server"
import { nasaOfficialClient } from "@/lib/nasa-official"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")
    const date = searchParams.get("date")

    const imagery = await nasaOfficialClient.getEarthImagery(
      lat ? Number.parseFloat(lat) : undefined,
      lon ? Number.parseFloat(lon) : undefined,
      date || undefined,
    )

    return NextResponse.json({ success: true, data: imagery })
  } catch (error) {
    console.error("Earth imagery API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch Earth imagery" }, { status: 500 })
  }
}
