"use client"

import { useRef, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Stars, Html, Environment, useTexture } from "@react-three/drei"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, Zap, Target, Wrench, Eye, Database } from "lucide-react"
import * as THREE from "three"
import { nasaDebrisClient, type DebrisObject } from "@/lib/nasa-debris"

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const cityLightsRef = useRef<THREE.Mesh>(null)
  const auroraRef = useRef<THREE.Mesh>(null)

  const earthTexture = useTexture("/realistic-earth-surface-texture-with-continents-an.jpg")
  const normalTexture = useTexture("/earth-normal-map-for-surface-detail.jpg")
  const specularTexture = useTexture("/earth-specular-map-showing-water-reflection.jpg")
  const cloudsTexture = useTexture("/earth-cloud-layer-texture-transparent.jpg")

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002
      // Subtle wobble for realistic axis tilt
      earthRef.current.rotation.z = Math.sin(time * 0.1) * 0.02
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.001
      // Pulsing atmosphere effect
      atmosphereRef.current.scale.setScalar(1.02 + Math.sin(time * 0.5) * 0.005)
    }

    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0015
      cloudsRef.current.rotation.x = Math.sin(time * 0.2) * 0.01
    }

    if (cityLightsRef.current) {
      // Flickering city lights effect
      cityLightsRef.current.material.opacity = 0.15 + Math.sin(time * 2) * 0.05
    }

    if (auroraRef.current) {
      // Aurora animation
      auroraRef.current.rotation.y += 0.005
      auroraRef.current.material.opacity = 0.3 + Math.sin(time * 1.5) * 0.2
    }
  })

  return (
    <group>
      {/* Enhanced Earth with better materials */}
      <mesh ref={earthRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2, 256, 256]} />
        <meshPhysicalMaterial
          map={earthTexture}
          normalMap={normalTexture}
          normalScale={[0.5, 0.5]}
          roughnessMap={specularTexture}
          roughness={0.8}
          metalness={0.1}
          clearcoat={0.1}
          clearcoatRoughness={0.3}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Enhanced cloud layer with better transparency */}
      <mesh ref={cloudsRef} scale={1.008}>
        <sphereGeometry args={[2, 128, 128]} />
        <meshLambertMaterial map={cloudsTexture} transparent opacity={0.6} depthWrite={false} alphaTest={0.1} />
      </mesh>

      {/* City lights on night side */}
      <mesh ref={cityLightsRef} scale={1.002}>
        <sphereGeometry args={[2, 128, 128]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Multi-layered atmosphere */}
      <mesh ref={atmosphereRef} scale={1.02}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color="#87CEEB"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer atmosphere glow */}
      <mesh scale={1.05}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#4A90E2"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Aurora effect at poles */}
      <mesh ref={auroraRef} scale={1.03} position={[0, 1.8, 0]}>
        <ringGeometry args={[0.3, 0.8, 32]} />
        <meshBasicMaterial
          color="#00FF88"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={auroraRef} scale={1.03} position={[0, -1.8, 0]} rotation={[Math.PI, 0, 0]}>
        <ringGeometry args={[0.3, 0.8, 32]} />
        <meshBasicMaterial
          color="#FF0088"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

function Satellite({
  position,
  type,
  name,
  status,
  onSelect,
  onViewInterior,
  isSelected,
}: {
  position: [number, number, number]
  type: "active" | "debris" | "harvester"
  name: string
  status: string
  onSelect: () => void
  onViewInterior?: () => void
  isSelected: boolean
}) {
  const satelliteRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [pulsePhase, setPulsePhase] = useState(Math.random() * Math.PI * 2)

  useFrame((state) => {
    if (satelliteRef.current) {
      const time = state.clock.getElapsedTime()
      const radius = Math.sqrt(position[0] ** 2 + position[2] ** 2)
      const angle = Math.atan2(position[2], position[0]) + time * 0.1

      satelliteRef.current.position.x = Math.cos(angle) * radius
      satelliteRef.current.position.z = Math.sin(angle) * radius
      satelliteRef.current.position.y = position[1] + Math.sin(time + pulsePhase) * 0.05

      satelliteRef.current.rotation.y += 0.02
      satelliteRef.current.rotation.x = Math.sin(time * 0.5) * 0.1
    }
  })

  const getColor = () => {
    switch (type) {
      case "active":
        return "#10B981"
      case "debris":
        return "#EF4444"
      case "harvester":
        return "#8B5CF6"
      default:
        return "#6B7280"
    }
  }

  const getIcon = () => {
    switch (type) {
      case "active":
        return <Zap className="h-3 w-3" />
      case "debris":
        return <Target className="h-3 w-3" />
      case "harvester":
        return <Wrench className="h-3 w-3" />
      default:
        return null
    }
  }

  const scale = hovered ? 1.3 : isSelected ? 1.2 : 1

  return (
    <group>
      <group
        ref={satelliteRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onSelect}
        scale={scale}
      >
        {/* Main body */}
        <mesh>
          <boxGeometry args={[0.15, 0.15, 0.15]} />
          <meshStandardMaterial
            color={getColor()}
            emissive={getColor()}
            emissiveIntensity={isSelected ? 0.3 : 0.1}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Solar panels for active satellites */}
        {type === "active" && (
          <>
            <mesh position={[0.2, 0, 0]}>
              <boxGeometry args={[0.25, 0.05, 0.15]} />
              <meshStandardMaterial
                color="#1E40AF"
                emissive="#001122"
                emissiveIntensity={0.2}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
            <mesh position={[-0.2, 0, 0]}>
              <boxGeometry args={[0.25, 0.05, 0.15]} />
              <meshStandardMaterial
                color="#1E40AF"
                emissive="#001122"
                emissiveIntensity={0.2}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          </>
        )}

        {/* Harvester arms */}
        {type === "harvester" && (
          <>
            <mesh position={[0.1, 0.1, 0]} rotation={[0, 0, Math.PI / 4]}>
              <cylinderGeometry args={[0.02, 0.02, 0.3]} />
              <meshStandardMaterial color="#8B5CF6" metalness={0.8} />
            </mesh>
            <mesh position={[-0.1, 0.1, 0]} rotation={[0, 0, -Math.PI / 4]}>
              <cylinderGeometry args={[0.02, 0.02, 0.3]} />
              <meshStandardMaterial color="#8B5CF6" metalness={0.8} />
            </mesh>
          </>
        )}

        {/* Debris irregular shape */}
        {type === "debris" && (
          <mesh position={[0.05, 0.05, 0.05]}>
            <dodecahedronGeometry args={[0.08]} />
            <meshStandardMaterial color="#EF4444" roughness={0.9} metalness={0.1} />
          </mesh>
        )}

        {/* Selection indicator */}
        {isSelected && (
          <mesh>
            <ringGeometry args={[0.3, 0.35, 16]} />
            <meshBasicMaterial color={getColor()} transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>

      {(hovered || isSelected) && (
        <Html position={position} center>
          <div className="bg-card/95 backdrop-blur-sm border rounded-lg p-3 shadow-xl min-w-[180px] animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center gap-2 mb-2">
              {getIcon()}
              <span className="font-semibold text-sm">{name}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{status}</p>
            <div className="flex items-center justify-between gap-2">
              <Badge variant="outline" className="text-xs">
                {type.toUpperCase()}
              </Badge>
              {isSelected && (
                <Badge variant="secondary" className="text-xs">
                  SELECTED
                </Badge>
              )}
            </div>
            {type === "harvester" && onViewInterior && (
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-2 text-xs gap-1 bg-transparent"
                onClick={(e) => {
                  e.stopPropagation()
                  onViewInterior()
                }}
              >
                <Eye className="h-3 w-3" />
                View Interior
              </Button>
            )}
          </div>
        </Html>
      )}
    </group>
  )
}

function OrbitalPath({
  radius,
  color = "#4B5563",
  animated = false,
}: {
  radius: number
  color?: string
  animated?: boolean
}) {
  const pathRef = useRef<THREE.Line>(null)
  const particlesRef = useRef<THREE.Points>(null)

  const points = []
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  // Particle system for animated paths
  const particleCount = animated ? 20 : 0
  const particlePositions = new Float32Array(particleCount * 3)

  useFrame((state) => {
    if (animated && particlesRef.current) {
      const time = state.clock.getElapsedTime()
      for (let i = 0; i < particleCount; i++) {
        const angle = (time * 0.5 + (i / particleCount) * Math.PI * 2) % (Math.PI * 2)
        particlePositions[i * 3] = Math.cos(angle) * radius
        particlePositions[i * 3 + 1] = 0
        particlePositions[i * 3 + 2] = Math.sin(angle) * radius
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group>
      <line ref={pathRef} geometry={geometry}>
        <lineBasicMaterial color={color} transparent opacity={0.4} />
      </line>

      {animated && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={particlePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial color={color} size={0.05} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
        </points>
      )}
    </group>
  )
}

function SpaceBackground() {
  const nebulaRef1 = useRef<THREE.Mesh>(null)
  const nebulaRef2 = useRef<THREE.Mesh>(null)
  const nebulaRef3 = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (nebulaRef1.current) {
      nebulaRef1.current.rotation.z += 0.001
      nebulaRef1.current.material.opacity = 0.08 + Math.sin(time * 0.3) * 0.03
    }

    if (nebulaRef2.current) {
      nebulaRef2.current.rotation.z -= 0.0008
      nebulaRef2.current.material.opacity = 0.06 + Math.cos(time * 0.4) * 0.02
    }

    if (nebulaRef3.current) {
      nebulaRef3.current.rotation.z += 0.0005
      nebulaRef3.current.material.opacity = 0.05 + Math.sin(time * 0.2) * 0.02
    }
  })

  return (
    <>
      <Environment preset="night" />
      <Stars radius={300} depth={150} count={12000} factor={8} saturation={0.3} fade speed={0.8} />

      {/* Enhanced nebula clouds with animation */}
      <mesh ref={nebulaRef1} position={[80, 30, -120]} rotation={[0.3, 0.8, 0]}>
        <planeGeometry args={[150, 90]} />
        <meshBasicMaterial color="#6A1B9A" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh ref={nebulaRef2} position={[-90, -40, 100]} rotation={[1.2, -0.5, 0.4]}>
        <planeGeometry args={[120, 80]} />
        <meshBasicMaterial color="#1A4A6A" transparent opacity={0.06} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh ref={nebulaRef3} position={[60, -60, -80]} rotation={[0.8, 1.2, -0.3]}>
        <planeGeometry args={[100, 70]} />
        <meshBasicMaterial color="#4A1A6A" transparent opacity={0.05} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Distant star clusters */}
      <mesh position={[200, 100, -200]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh position={[-180, -80, 150]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color="#FF6B35" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>
    </>
  )
}

function OrbitalScene({
  isPlaying,
  timeScale,
  selectedSatellite,
  onSatelliteSelect,
  onViewInterior,
}: {
  isPlaying: boolean
  timeScale: number
  selectedSatellite: number | null
  onSatelliteSelect: (index: number | null) => void
  onViewInterior: (index: number) => void
}) {
  const { camera } = useThree()
  const [nasaDebris, setNasaDebris] = useState<DebrisObject[]>([])
  const [debrisStats, setDebrisStats] = useState<any>(null)
  const [realSatellites, setRealSatellites] = useState<any[]>([])
  const [issPosition, setISSPosition] = useState<any>(null)
  const [earthImagery, setEarthImagery] = useState<any[]>([])

  useEffect(() => {
    camera.position.set(10, 8, 10)
    loadNASAOfficialData()

    // Update ISS position every 30 seconds
    const issInterval = setInterval(loadISSPosition, 30000)
    return () => clearInterval(issInterval)
  }, [camera])

  const loadNASAOfficialData = async () => {
    try {
      // Load multiple NASA datasets
      const [debrisData, stats, tleData, iss, imagery] = await Promise.all([
        nasaDebrisClient.getDebrisData({ limit: 50, altitude: [400, 2000] }),
        nasaDebrisClient.getDebrisStatistics(),
        fetch("/api/nasa/tle").then((r) => r.json()),
        fetch("/api/nasa/iss").then((r) => r.json()),
        fetch("/api/nasa/earth-imagery").then((r) => r.json()),
      ])

      setNasaDebris(debrisData.data)
      setDebrisStats(stats)
      setRealSatellites(tleData.data || [])
      setISSPosition(iss.data)
      setEarthImagery(imagery.data || [])
    } catch (error) {
      console.error("Failed to load NASA official data:", error)
    }
  }

  const loadISSPosition = async () => {
    try {
      const response = await fetch("/api/nasa/iss")
      const data = await response.json()
      if (data.success) {
        setISSPosition(data.data)
      }
    } catch (error) {
      console.error("Failed to update ISS position:", error)
    }
  }

  const issTo3DPosition = (iss: any): [number, number, number] => {
    if (!iss) return [0, 0, 0]

    const lat = (iss.latitude * Math.PI) / 180
    const lon = (iss.longitude * Math.PI) / 180
    const alt = ((iss.altitude + 6371) / 6371) * 2 // Scale to our Earth size

    const x = alt * Math.cos(lat) * Math.cos(lon)
    const y = alt * Math.sin(lat)
    const z = alt * Math.cos(lat) * Math.sin(lon)

    return [x, y, z]
  }

  const satellites = [
    {
      position: [4, 0.5, 0] as [number, number, number],
      type: "active" as const,
      name: "OrbNet-Alpha",
      status: "Data Relay Active",
    },
    {
      position: [0, 0.8, 4.5] as [number, number, number],
      type: "active" as const,
      name: "OrbNet-Beta",
      status: "Communication Hub",
    },
    {
      position: [-3.5, -0.3, 2] as [number, number, number],
      type: "debris" as const,
      name: "Debris-Falcon9-R2",
      status: "Targeted for Collection",
    },
    {
      position: [2.8, 1.2, -3] as [number, number, number],
      type: "debris" as const,
      name: "Defunct-Sat-K7",
      status: "High Priority Target",
    },
    {
      position: [-4.2, 0.2, -1.5] as [number, number, number],
      type: "harvester" as const,
      name: "Symbiont-Prime",
      status: "Debris Collection Mode",
    },
  ]

  return (
    <>
      {/* ... existing lighting and background code ... */}
      <ambientLight intensity={0.1} color="#1a1a2e" />
      <directionalLight
        position={[10, 0, 5]}
        intensity={2}
        color="#FFD700"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[15, 15, 15]} intensity={0.8} color="#87CEEB" />
      <pointLight position={[-15, -15, -15]} intensity={0.6} color="#4A90E2" />

      <SpaceBackground />
      <Earth />

      <OrbitalPath radius={4} color="#10B981" animated />
      <OrbitalPath radius={4.5} color="#10B981" animated />
      <OrbitalPath radius={3.5} color="#EF4444" />
      <OrbitalPath radius={4.2} color="#8B5CF6" animated />
      <OrbitalPath radius={3.8} color="#8B5CF6" />

      {issPosition && (
        <Satellite
          position={issTo3DPosition(issPosition)}
          type="active"
          name="ISS (NASA Live)"
          status={`Alt: ${issPosition.altitude}km | Live Position`}
          onSelect={() => {}}
          isSelected={false}
        />
      )}

      {realSatellites.slice(0, 10).map((sat, index) => (
        <mesh
          key={`real-sat-${index}`}
          position={[Math.random() * 8 - 4, Math.random() * 2 - 1, Math.random() * 8 - 4]}
        >
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#00FF88" emissive="#00FF88" emissiveIntensity={0.2} />
        </mesh>
      ))}

      {satellites.map((sat, index) => (
        <Satellite
          key={index}
          {...sat}
          onSelect={() => onSatelliteSelect(selectedSatellite === index ? null : index)}
          onViewInterior={sat.type === "harvester" ? () => onViewInterior(index) : undefined}
          isSelected={selectedSatellite === index}
        />
      ))}

      {nasaDebris.slice(0, 30).map((debris, index) => (
        <mesh key={`nasa-${debris.id}`} position={debris.position}>
          <sphereGeometry args={[Math.max(0.02, debris.size * 0.1), 8, 8]} />
          <meshBasicMaterial
            color={debris.status === "active" ? "#10B981" : debris.type === "fragment" ? "#F59E0B" : "#EF4444"}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
        autoRotate={isPlaying}
        autoRotateSpeed={0.5}
      />
    </>
  )
}

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

        <Canvas camera={{ fov: 60 }}>
          <OrbitalScene
            isPlaying={isPlaying}
            timeScale={timeScale[0]}
            selectedSatellite={selectedSatellite}
            onSatelliteSelect={setSelectedSatellite}
            onViewInterior={onViewInterior}
          />
        </Canvas>

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
