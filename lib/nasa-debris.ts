export interface DebrisObject {
  id: string
  name: string
  position: [number, number, number]
  velocity: [number, number, number]
  size: number
  mass: number
  type: "satellite" | "rocket_body" | "fragment" | "unknown"
  launchDate?: string
  country?: string
  apogee: number
  perigee: number
  inclination: number
  period: number
  eccentricity: number
  rcs: number // Radar Cross Section
  status: "active" | "inactive" | "decayed"
  lastUpdate: string
}

export interface NASADebrisResponse {
  data: DebrisObject[]
  totalCount: number
  lastUpdated: string
}

class NASADebrisClient {
  async getDebrisData(params?: {
    altitude?: [number, number]
    size?: [number, number]
    limit?: number
    type?: string[]
  }): Promise<NASADebrisResponse> {
    const searchParams = new URLSearchParams()

    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.altitude) {
      searchParams.set("altitudeMin", params.altitude[0].toString())
      searchParams.set("altitudeMax", params.altitude[1].toString())
    }

    const response = await fetch(`/api/nasa/debris?${searchParams}`)
    if (!response.ok) {
      throw new Error("Failed to fetch debris data")
    }

    return response.json()
  }

  async getDebrisStatistics() {
    const response = await fetch("/api/nasa/statistics")
    if (!response.ok) {
      throw new Error("Failed to fetch debris statistics")
    }

    return response.json()
  }
}

export const nasaDebrisClient = new NASADebrisClient()
