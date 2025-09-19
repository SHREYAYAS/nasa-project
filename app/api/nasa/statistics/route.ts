import { NextResponse } from "next/server"

export async function GET() {
  try {
    const statistics = {
      totalObjects: 34000,
      trackableObjects: 25000,
      activeSatellites: 8800,
      inactiveSatellites: 3000,
      rocketBodies: 2900,
      fragments: 19300,
      byAltitude: {
        leo: 28000, // 200-2000km
        meo: 4500, // 2000-35786km
        geo: 1500, // 35786km+
      },
      bySize: {
        large: 25000, // >10cm
        medium: 500000, // 1-10cm (estimated)
        small: 100000000, // <1cm (estimated)
      },
      collisionRisk: "moderate",
      lastUpdate: new Date().toISOString(),
    }

    return NextResponse.json(statistics)
  } catch (error) {
    console.error("Failed to fetch NASA statistics:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
