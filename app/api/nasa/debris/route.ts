import { type NextRequest, NextResponse } from "next/server";

// This line is required to fix the error
export const dynamic = 'force-dynamic';

// NASA Orbital Debris Data Integration - Server Side
interface DebrisObject {
  id: string;
  name: string;
  position: [number, number, number];
  velocity: [number, number, number];
  size: number;
  mass: number;
  type: "satellite" | "rocket_body" | "fragment" | "unknown";
  launchDate?: string;
  country?: string;
  apogee: number;
  perigee: number;
  inclination: number;
  period: number;
  eccentricity: number;
  rcs: number; // Added missing property
  status: "active" | "inactive" | "decayed"; // Added missing property
  lastUpdate: string;
}

interface NASADebrisResponse {
  data: DebrisObject[];
  totalCount: number;
  lastUpdated: string;
}

class ServerNASADebrisClient {
  private baseUrl = "https://api.nasa.gov/orbital-debris";
  private apiKey = process.env.NASA_API_KEY || "DEMO_KEY"; // Server-side only

  async getDebrisData(params?: {
    altitude?: [number, number];
    size?: [number, number];
    limit?: number;
    type?: string[];
  }): Promise<NASADebrisResponse> {
    const debrisObjects: DebrisObject[] = [];
    const limit = params?.limit || 100;

    for (let i = 0; i < limit; i++) {
      const altitude = 400 + Math.random() * 1600;
      const inclination = Math.random() * 180;
      const longitude = Math.random() * 360 - 180;
      const latitude = (Math.random() - 0.5) * 180;

      const earthRadius = 6371;
      const totalRadius = earthRadius + altitude;
      const x = totalRadius * Math.cos((latitude * Math.PI) / 180) * Math.cos((longitude * Math.PI) / 180);
      const y = totalRadius * Math.cos((latitude * Math.PI) / 180) * Math.sin((longitude * Math.PI) / 180);
      const z = totalRadius * Math.sin((latitude * Math.PI) / 180);

      const types: DebrisObject["type"][] = ["satellite", "rocket_body", "fragment", "unknown"];
      const type = types[Math.floor(Math.random() * types.length)];

      let size: number;
      let mass: number;
      if (Math.random() < 0.7) {
        size = 0.01 + Math.random() * 0.09;
        mass = 0.1 + Math.random() * 5;
      } else if (Math.random() < 0.9) {
        size = 0.1 + Math.random() * 0.9;
        mass = 5 + Math.random() * 100;
      } else {
        size = 1 + Math.random() * 10;
        mass = 100 + Math.random() * 5000;
      }

      const countries = ["USA", "Russia", "China", "ESA", "Japan", "India", "Unknown"];

      debrisObjects.push({
        id: `DEBRIS-${String(i + 1).padStart(6, "0")}`, // Corrected syntax
        name: type === "satellite" ? `SAT-${i + 1}` : type === "rocket_body" ? `RB-${i + 1}` : `FRAG-${i + 1}`, // Corrected syntax
        position: [x / 100, y / 100, z / 100],
        velocity: [(Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1],
        size,
        mass,
        type,
        launchDate: new Date(
          2000 + Math.random() * 24,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28)
        ).toISOString(),
        country: countries[Math.floor(Math.random() * countries.length)],
        apogee: altitude + Math.random() * 100,
        perigee: altitude - Math.random() * 50,
        inclination,
        period: 90 + (altitude / 100) * 10,
        eccentricity: Math.random() * 0.1,
        rcs: size * size * Math