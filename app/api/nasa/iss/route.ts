import { NextResponse } from "next/server"
import { nasaOfficialClient } from "@/lib/nasa-official"

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const issPosition = await nasaOfficialClient.getISSPosition()

    if (!issPosition) {
      return NextResponse.json({ success: false, error: "Failed to get ISS position" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: issPosition })
  } catch (error) {
    console.error("ISS API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch ISS position" }, { status: 500 })
  }
}
