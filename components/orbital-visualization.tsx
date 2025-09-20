"use client"

import { useRef, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, Zap, Target, Wrench, Eye, Database } from "lucide-react"

// Dynamically import Three.js components to avoid SSR issues
const Canvas = dynamic(() => import("@react-three/fiber").then((mod) => ({ default: mod.Canvas })), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-muted-foreground">Loading 3D Scene...</div>
})

// Create a client-only component for the 3D scene
const OrbitalScene3D = dynamic(() => import("./orbital-scene"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-muted-foreground">Initializing Orbital View...</div>
})


export function OrbitalVisualization({ onViewInterior }: { onViewInterior: (satelliteIndex: number) => void }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [timeScale, setTimeScale] = useState([1])
  const [selectedSatellite, setSelectedSatellite] = useState<number | null>(null)
  const [cameraMode, setCameraMode] = useState<"free" | "follow">("free")
  const [showNASAData, setShowNASAData] = useState(true)
  const [nasaDataStats, setNasaDataStats] = useState<any>(null)

  useEffect(() => {
    loadNASAStats()
  }, [])

  const loadNASAStats = async () => {
    try {
      const [iss, debris] = await Promise.all([
        fetch("/api/nasa/iss").then((r) => r.json()),
        fetch("/api/nasa/debris").then((r) => r.json()),
      ])

      setNasaDataStats({
        issActive: iss.success,
        debrisCount: debris.data?.length || 0,
        lastUpdate: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Failed to load NASA stats:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant={isPlaying ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="transition-all duration-200"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? "Pause Simulation" : "Start Simulation"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedSatellite(null)
              setCameraMode("free")
            }}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset View
          </Button>

          <Button
            variant={showNASAData ? "default" : "outline"}
            size="sm"
            onClick={() => setShowNASAData(!showNASAData)}
          >
            <Database className="h-4 w-4 mr-2" />
            NASA Live Data
          </Button>

          {selectedSatellite !== null && (
            <Badge variant="secondary" className="animate-pulse">
              Satellite Selected
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Simulation Speed:</span>
          <div className="w-32">
            <Slider
              value={timeScale}
              onValueChange={setTimeScale}
              max={5}
              min={0.1}
              step={0.1}
              className="cursor-pointer"
            />
          </div>
          <span className="text-sm font-mono min-w-[40px]">{timeScale[0].toFixed(1)}x</span>
        </div>
      </div>

      <div className="relative h-[700px] w-full rounded-xl border-2 border-primary/20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

        <OrbitalScene3D
          isPlaying={isPlaying}
          timeScale={timeScale[0]}
          selectedSatellite={selectedSatellite}
          onSatelliteSelect={setSelectedSatellite}
          onViewInterior={onViewInterior}
        />

        <div className="absolute top-4 left-4 space-y-2 pointer-events-none">
          <div className="bg-slate-950/80 backdrop-blur-sm rounded-lg p-2 text-xs font-mono text-green-400 border border-green-500/20">
            <div>ORBITAL COMMAND CENTER</div>
            <div>STATUS: {isPlaying ? "ACTIVE" : "PAUSED"}</div>
            <div>SPEED: {timeScale[0].toFixed(1)}x</div>
            <div>NASA DATA: {showNASAData ? "LIVE" : "OFFLINE"}</div>
          </div>
        </div>

        <div className="absolute top-4 right-4 pointer-events-none">
          <div className="bg-slate-950/80 backdrop-blur-sm rounded-lg p-2 text-xs font-mono text-blue-400 border border-blue-500/20">
            <div>OBJECTS TRACKED: {6 + (nasaDataStats?.debrisCount || 0)}</div>
            <div>ISS STATUS: {nasaDataStats?.issActive ? "LIVE" : "OFFLINE"}</div>
            <div>NASA DEBRIS: {nasaDataStats?.debrisCount || 0}</div>
            <div>
              LAST UPDATE: {nasaDataStats?.lastUpdate ? new Date(nasaDataStats.lastUpdate).toLocaleTimeString() : "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* ... existing status cards code ... */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
              <div>
                <span className="text-sm font-semibold">NASA Live Data</span>
                <p className="text-xs text-muted-foreground">ISS position & TLE tracking</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50"></div>
              <div>
                <span className="text-sm font-semibold">Space Debris</span>
                <p className="text-xs text-muted-foreground">Official NASA catalog data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full bg-purple-500 animate-pulse shadow-lg shadow-purple-500/50"></div>
              <div>
                <span className="text-sm font-semibold">Symbiont Harvesters</span>
                <p className="text-xs text-muted-foreground">Autonomous collection units</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
