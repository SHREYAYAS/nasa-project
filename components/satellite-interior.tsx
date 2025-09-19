"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Html, Environment } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Thermometer, Printer, Wrench, Settings, AlertTriangle, CheckCircle } from "lucide-react"
import * as THREE from "three"

interface RepairOperation {
  id: string
  satelliteName: string
  operation: "repair" | "replace" | "upgrade"
  component: string
  materialsNeeded?: { material: string; amount: number }[]
  duration: number
  progress: number
  status: "pending" | "in-progress" | "completed" | "waiting-materials"
}

interface MaterialInventory {
  aluminum: number
  titanium: number
  silicon: number
  copper: number
  carbon_fiber: number
}

interface PartAvailability {
  partName: string
  availableFromRecycling: boolean
  canManufacture: boolean
  materialsRequired: { material: string; amount: number }[]
  estimatedTime: number
  inStock: number
}

function RoboticArm({
  position,
  rotation,
  isActive,
}: { position: [number, number, number]; rotation: [number, number, number]; isActive: boolean }) {
  const armRef = useRef<THREE.Group>(null)
  const joint1Ref = useRef<THREE.Mesh>(null)
  const joint2Ref = useRef<THREE.Mesh>(null)
  const effectorRef = useRef<THREE.Mesh>(null)
  const [animationPhase, setAnimationPhase] = useState(Math.random() * Math.PI * 2)

  useFrame((state) => {
    if (armRef.current && isActive) {
      const time = state.clock.getElapsedTime()

      // Complex multi-joint animation
      armRef.current.rotation.y = Math.sin(time * 0.4 + animationPhase) * 0.5

      if (joint1Ref.current) {
        joint1Ref.current.rotation.z = Math.cos(time * 0.6 + animationPhase) * 0.3
      }

      if (joint2Ref.current) {
        joint2Ref.current.rotation.x = Math.sin(time * 0.8 + animationPhase) * 0.4
      }

      if (effectorRef.current) {
        // Gripper opening/closing animation
        effectorRef.current.scale.x = 1 + Math.sin(time * 2 + animationPhase) * 0.2
        effectorRef.current.material.emissiveIntensity = 0.3 + Math.sin(time * 3) * 0.2
      }
    }
  })

  return (
    <group ref={armRef} position={position} rotation={rotation}>
      {/* Base with rotation indicator */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.1]} />
        <meshStandardMaterial color="#2563EB" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Rotation ring */}
      <mesh position={[0, 0.05, 0]}>
        <torusGeometry args={[0.18, 0.02, 8, 16]} />
        <meshStandardMaterial
          color={isActive ? "#10B981" : "#6B7280"}
          metalness={0.9}
          roughness={0.1}
          emissive={isActive ? "#10B981" : "#000000"}
          emissiveIntensity={isActive ? 0.2 : 0}
        />
      </mesh>

      {/* First segment with hydraulics */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5]} />
        <meshStandardMaterial color="#1E40AF" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Hydraulic pistons */}
      <mesh position={[0.06, 0.25, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.06, 0.25, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Joint 1 with enhanced detail */}
      <mesh ref={joint1Ref} position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.12]} />
        <meshStandardMaterial color="#3B82F6" metalness={0.9} roughness={0.1} envMapIntensity={1.5} />
      </mesh>

      {/* Second segment */}
      <mesh position={[0.2, 0.8, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.06, 0.06, 0.4]} />
        <meshStandardMaterial color="#1E40AF" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Joint 2 */}
      <mesh ref={joint2Ref} position={[0.32, 0.95, 0]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="#3B82F6" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* End effector with gripper */}
      <mesh ref={effectorRef} position={[0.35, 1.0, 0]}>
        <boxGeometry args={[0.12, 0.08, 0.08]} />
        <meshStandardMaterial
          color={isActive ? "#10B981" : "#6B7280"}
          metalness={0.8}
          roughness={0.2}
          emissive={isActive ? "#10B981" : "#000000"}
          emissiveIntensity={isActive ? 0.3 : 0}
        />
      </mesh>

      {/* Gripper claws */}
      <mesh position={[0.42, 1.0, 0.03]}>
        <boxGeometry args={[0.06, 0.02, 0.02]} />
        <meshStandardMaterial color="#10B981" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.42, 1.0, -0.03]}>
        <boxGeometry args={[0.06, 0.02, 0.02]} />
        <meshStandardMaterial color="#10B981" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Enhanced activity indicator */}
      {isActive && (
        <Html position={[0.5, 1.3, 0]} center>
          <div className="bg-green-500/30 backdrop-blur-sm border border-green-500/70 rounded-lg px-3 py-2 text-xs text-green-300 font-mono animate-pulse">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              MANIPULATING
            </div>
            <div className="text-xs text-green-400/70">Progress: {Math.floor(Math.random() * 100)}%</div>
            <div className="w-20 h-1 bg-green-900 rounded-full mt-1">
              <div
                className="h-full bg-green-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.floor(Math.random() * 100)}%` }}
              ></div>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

function Furnace({ position, isActive }: { position: [number, number, number]; isActive: boolean }) {
  const furnaceRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const processingRef = useRef<THREE.Mesh>(null)
  const outputRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (glowRef.current && isActive) {
      glowRef.current.material.emissiveIntensity = 0.6 + Math.sin(time * 3) * 0.3
      glowRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.05)
    }

    if (processingRef.current && isActive) {
      processingRef.current.rotation.y += 0.03
      processingRef.current.material.emissiveIntensity = 0.3 + Math.sin(time * 4) * 0.2
    }

    if (outputRef.current && isActive) {
      outputRef.current.position.y = 0.1 + Math.sin(time * 1.5) * 0.02
    }
  })

  return (
    <group ref={furnaceRef} position={position}>
      {/* Main furnace body */}
      <mesh>
        <cylinderGeometry args={[0.35, 0.4, 0.7]} />
        <meshStandardMaterial color="#DC2626" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Processing chamber */}
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.6]} />
        <meshStandardMaterial
          color="#EF4444"
          emissive={isActive ? "#FF4500" : "#000000"}
          emissiveIntensity={isActive ? 0.7 : 0}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Debris input chute */}
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 6, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.3]} />
        <meshStandardMaterial color="#7C2D12" metalness={0.5} roughness={0.6} />
      </mesh>

      {/* Material processing indicator */}
      <mesh ref={processingRef} position={[0, 0, 0]}>
        <torusGeometry args={[0.25, 0.03, 8, 16]} />
        <meshStandardMaterial
          color={isActive ? "#F59E0B" : "#6B7280"}
          emissive={isActive ? "#F59E0B" : "#000000"}
          emissiveIntensity={isActive ? 0.4 : 0}
        />
      </mesh>

      {/* Raw material output */}
      <mesh ref={outputRef} position={[0.4, 0.1, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color={isActive ? "#10B981" : "#374151"} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Enhanced status display */}
      {isActive && (
        <Html position={[0.5, 0.2, 0]} center>
          <div className="bg-red-900/70 backdrop-blur-sm border border-red-500/70 rounded-lg px-3 py-2 text-xs text-red-300 font-mono">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              PROCESSING
            </div>
            <div className="text-xs text-red-400/70">Temp: {1650 + Math.floor(Math.sin(Date.now() * 0.01) * 50)}°C</div>
            <div className="text-xs text-red-400/70">Output: {Math.floor(Math.random() * 50) + 25}kg/h</div>
            <div className="text-xs text-green-400/70">Materials: Al, Ti, Fe</div>
          </div>
        </Html>
      )}
    </group>
  )
}

function Printer3D({ position, isActive }: { position: [number, number, number]; isActive: boolean }) {
  const printerRef = useRef<THREE.Group>(null)
  const extruderRef = useRef<THREE.Mesh>(null)
  const printObjectRef = useRef<THREE.Mesh>(null)
  const [printProgress, setPrintProgress] = useState(0)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (extruderRef.current && isActive) {
      // Realistic printing pattern movement
      const layer = Math.floor(time * 0.5) % 10
      extruderRef.current.position.x = Math.sin(time * 2) * 0.15
      extruderRef.current.position.z = Math.cos(time * 1.8) * 0.15
      extruderRef.current.position.y = 0.3 - layer * 0.02
    }

    if (printObjectRef.current && isActive) {
      // Growing print object
      const progress = (Math.sin(time * 0.3) + 1) * 0.5
      setPrintProgress(Math.floor(progress * 100))
      printObjectRef.current.scale.y = progress
      printObjectRef.current.position.y = -0.05 + progress * 0.05
    }
  })

  return (
    <group ref={printerRef} position={position}>
      {/* Enhanced base platform */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.6, 0.05, 0.6]} />
        <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Frame with more detail */}
      {[
        [-0.25, 0.2, -0.25],
        [0.25, 0.2, -0.25],
        [-0.25, 0.2, 0.25],
        [0.25, 0.2, 0.25],
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.03, 0.8, 0.03]} />
          <meshStandardMaterial color="#6B7280" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Top frame */}
      <mesh position={[0, 0.6, -0.25]}>
        <boxGeometry args={[0.5, 0.03, 0.03]} />
        <meshStandardMaterial color="#6B7280" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.6, 0.25]}>
        <boxGeometry args={[0.5, 0.03, 0.03]} />
        <meshStandardMaterial color="#6B7280" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Enhanced print bed */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.4, 0.02, 0.4]} />
        <meshStandardMaterial color="#1F2937" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Print object being created */}
      {isActive && (
        <mesh ref={printObjectRef} position={[0, -0.05, 0]}>
          <boxGeometry args={[0.08, 0.1, 0.08]} />
          <meshStandardMaterial color="#8B5CF6" metalness={0.2} roughness={0.8} transparent opacity={0.8} />
        </mesh>
      )}

      {/* Enhanced extruder with heating element */}
      <mesh ref={extruderRef} position={[0, 0.3, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <meshStandardMaterial
          color={isActive ? "#8B5CF6" : "#4B5563"}
          metalness={0.8}
          roughness={0.2}
          emissive={isActive ? "#8B5CF6" : "#000000"}
          emissiveIntensity={isActive ? 0.4 : 0}
        />
      </mesh>

      {/* Heating nozzle */}
      <mesh position={[0, 0.25, 0]}>
        <coneGeometry args={[0.02, 0.04, 8]} />
        <meshStandardMaterial
          color={isActive ? "#FF4500" : "#6B7280"}
          emissive={isActive ? "#FF2200" : "#000000"}
          emissiveIntensity={isActive ? 0.6 : 0}
        />
      </mesh>

      {/* Filament feed */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.3]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.1} roughness={0.9} />
      </mesh>

      {/* Enhanced print progress indicator */}
      {isActive && (
        <Html position={[0, 0.8, 0]} center>
          <div className="bg-purple-900/70 backdrop-blur-sm border border-purple-500/70 rounded-lg px-4 py-3 text-sm text-purple-300 font-mono">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>PRINTING ACTIVE</span>
            </div>
            <div className="text-xs text-purple-400/70">Progress: {printProgress}%</div>
            <div className="w-20 h-1 bg-purple-900 rounded-full mt-1">
              <div
                className="h-full bg-purple-400 rounded-full transition-all duration-300"
                style={{ width: `${printProgress}%` }}
              ></div>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

function DebrisCollectionArm({
  position,
  rotation,
  isActive,
}: { position: [number, number, number]; rotation: [number, number, number]; isActive: boolean }) {
  const armRef = useRef<THREE.Group>(null)
  const scannerRef = useRef<THREE.Mesh>(null)
  const magnetRef = useRef<THREE.Mesh>(null)
  const debrisRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (armRef.current && isActive) {
      const time = state.clock.getElapsedTime()

      // Scanning motion
      armRef.current.rotation.y = Math.sin(time * 0.3) * 1.2

      if (scannerRef.current) {
        scannerRef.current.rotation.z += 0.05
        scannerRef.current.material.emissiveIntensity = 0.5 + Math.sin(time * 4) * 0.3
      }

      if (magnetRef.current) {
        magnetRef.current.material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.2
      }

      // Simulate debris capture
      if (debrisRef.current) {
        debrisRef.current.position.y = -0.2 + Math.sin(time * 0.8) * 0.1
        debrisRef.current.rotation.x += 0.02
        debrisRef.current.rotation.y += 0.01
      }
    }
  })

  return (
    <group ref={armRef} position={position} rotation={rotation}>
      {/* Base with enhanced sensors */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.15]} />
        <meshStandardMaterial color="#059669" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Sensor array */}
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[0.22, 0.03, 8, 16]} />
        <meshStandardMaterial
          color={isActive ? "#10B981" : "#6B7280"}
          emissive={isActive ? "#10B981" : "#000000"}
          emissiveIntensity={isActive ? 0.4 : 0}
        />
      </mesh>

      {/* Main arm with debris scanner */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.6]} />
        <meshStandardMaterial color="#047857" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Debris scanner head */}
      <mesh ref={scannerRef} position={[0, 0.8, 0]}>
        <coneGeometry args={[0.12, 0.2, 8]} />
        <meshStandardMaterial
          color={isActive ? "#10B981" : "#374151"}
          emissive={isActive ? "#10B981" : "#000000"}
          emissiveIntensity={isActive ? 0.6 : 0}
        />
      </mesh>

      {/* Magnetic gripper */}
      <mesh ref={magnetRef} position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial
          color="#DC2626"
          emissive={isActive ? "#DC2626" : "#000000"}
          emissiveIntensity={isActive ? 0.4 : 0}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Captured debris */}
      {isActive && (
        <mesh ref={debrisRef} position={[0, 1.1, 0]}>
          <dodecahedronGeometry args={[0.04]} />
          <meshStandardMaterial color="#6B7280" metalness={0.8} roughness={0.4} />
        </mesh>
      )}

      {/* Collection status */}
      {isActive && (
        <Html position={[0.3, 1.2, 0]} center>
          <div className="bg-green-900/70 backdrop-blur-sm border border-green-500/70 rounded-lg px-3 py-2 text-xs text-green-300 font-mono">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              DEBRIS SCAN
            </div>
            <div className="text-xs text-green-400/70">Objects: {Math.floor(Math.random() * 15) + 5}</div>
            <div className="text-xs text-green-400/70">Range: 2.5km</div>
          </div>
        </Html>
      )}
    </group>
  )
}

function RepairStation({
  position,
  isActive,
  currentOperation,
}: {
  position: [number, number, number]
  isActive: boolean
  currentOperation?: RepairOperation
}) {
  const stationRef = useRef<THREE.Group>(null)
  const toolRef = useRef<THREE.Mesh>(null)
  const diagnosticRef = useRef<THREE.Mesh>(null)
  const repairArmRef = useRef<THREE.Mesh>(null)
  const sparksRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (toolRef.current && isActive && currentOperation?.status === "in-progress") {
      // Realistic repair tool movement
      toolRef.current.rotation.z = Math.sin(time * 3) * 0.2
      toolRef.current.position.y = 0.2 + Math.sin(time * 2) * 0.03
    }

    if (repairArmRef.current && isActive && currentOperation?.status === "in-progress") {
      // Repair arm working motion
      repairArmRef.current.rotation.x = Math.sin(time * 1.5) * 0.3
      repairArmRef.current.position.z = Math.cos(time * 1.2) * 0.05
    }

    if (diagnosticRef.current && isActive) {
      diagnosticRef.current.material.emissiveIntensity = 0.4 + Math.sin(time * 3) * 0.2
    }

    // Sparks animation during repair
    if (sparksRef.current && currentOperation?.status === "in-progress") {
      sparksRef.current.children.forEach((spark, i) => {
        spark.position.y += Math.random() * 0.02
        spark.position.x += (Math.random() - 0.5) * 0.01
        spark.position.z += (Math.random() - 0.5) * 0.01
        if (spark.position.y > 0.5) {
          spark.position.y = 0.2
          spark.position.x = (Math.random() - 0.5) * 0.1
          spark.position.z = (Math.random() - 0.5) * 0.1
        }
      })
    }
  })

  return (
    <group ref={stationRef} position={position}>
      {/* Base platform */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.1]} />
        <meshStandardMaterial color="#1E40AF" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Repair tools array */}
      <mesh position={[-0.2, 0.1, 0]}>
        <boxGeometry args={[0.15, 0.3, 0.08]} />
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Active repair tool */}
      <mesh ref={toolRef} position={[-0.2, 0.2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15]} />
        <meshStandardMaterial
          color={isActive ? "#F59E0B" : "#6B7280"}
          emissive={isActive ? "#F59E0B" : "#000000"}
          emissiveIntensity={isActive ? 0.3 : 0}
        />
      </mesh>

      <mesh ref={repairArmRef} position={[0.2, 0.2, 0]}>
        <boxGeometry args={[0.08, 0.25, 0.06]} />
        <meshStandardMaterial
          color={currentOperation?.status === "in-progress" ? "#10B981" : "#4B5563"}
          emissive={currentOperation?.status === "in-progress" ? "#10B981" : "#000000"}
          emissiveIntensity={currentOperation?.status === "in-progress" ? 0.4 : 0}
        />
      </mesh>

      {/* Diagnostic scanner */}
      <mesh ref={diagnosticRef} position={[0.2, 0.15, 0]}>
        <boxGeometry args={[0.12, 0.12, 0.06]} />
        <meshStandardMaterial
          color={isActive ? "#8B5CF6" : "#4B5563"}
          emissive={isActive ? "#8B5CF6" : "#000000"}
          emissiveIntensity={isActive ? 0.5 : 0}
        />
      </mesh>

      {currentOperation?.status === "in-progress" && (
        <group ref={sparksRef}>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh key={i} position={[Math.random() * 0.1 - 0.05, 0.2, Math.random() * 0.1 - 0.05]}>
              <sphereGeometry args={[0.005]} />
              <meshBasicMaterial color="#FFD700" />
            </mesh>
          ))}
        </group>
      )}

      {/* Holographic display */}
      {isActive && (
        <mesh position={[0, 0.4, 0]}>
          <planeGeometry args={[0.3, 0.2]} />
          <meshBasicMaterial color="#00FFFF" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>
      )}

      {isActive && (
        <Html position={[0, 0.6, 0]} center>
          <div className="bg-blue-900/70 backdrop-blur-sm border border-blue-500/70 rounded-lg px-3 py-2 text-xs text-blue-300 font-mono">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              HERMES REPAIR STATION
            </div>
            {currentOperation ? (
              <>
                <div className="text-xs text-blue-400/70">Target: {currentOperation.satelliteName}</div>
                <div className="text-xs text-blue-400/70">Operation: {currentOperation.operation.toUpperCase()}</div>
                <div className="text-xs text-blue-400/70">Component: {currentOperation.component}</div>
                <div className="text-xs text-blue-400/70">Progress: {Math.floor(currentOperation.progress)}%</div>
                <div className="w-20 h-1 bg-blue-900 rounded-full mt-1">
                  <div
                    className="h-full bg-blue-400 rounded-full transition-all duration-300"
                    style={{ width: `${currentOperation.progress}%` }}
                  ></div>
                </div>
              </>
            ) : (
              <div className="text-xs text-blue-400/70">STANDBY - Awaiting Instructions</div>
            )}
          </div>
        </Html>
      )}
    </group>
  )
}

function PartAvailabilityChecker({
  materialInventory,
  onClose,
}: {
  materialInventory: MaterialInventory
  onClose: () => void
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPart, setSelectedPart] = useState<PartAvailability | null>(null)

  const satelliteParts: PartAvailability[] = [
    {
      partName: "Solar Panel Array",
      availableFromRecycling: true,
      canManufacture: true,
      materialsRequired: [
        { material: "silicon", amount: 15 },
        { material: "aluminum", amount: 8 },
      ],
      estimatedTime: 120,
      inStock: 3,
    },
    {
      partName: "Communication Antenna",
      availableFromRecycling: false,
      canManufacture: true,
      materialsRequired: [
        { material: "copper", amount: 12 },
        { material: "aluminum", amount: 5 },
      ],
      estimatedTime: 90,
      inStock: 0,
    },
    {
      partName: "Thruster Module",
      availableFromRecycling: true,
      canManufacture: true,
      materialsRequired: [
        { material: "titanium", amount: 20 },
        { material: "carbon_fiber", amount: 8 },
      ],
      estimatedTime: 180,
      inStock: 1,
    },
    {
      partName: "Gyroscope Assembly",
      availableFromRecycling: false,
      canManufacture: true,
      materialsRequired: [
        { material: "titanium", amount: 10 },
        { material: "silicon", amount: 5 },
      ],
      estimatedTime: 150,
      inStock: 0,
    },
    {
      partName: "Battery Pack",
      availableFromRecycling: true,
      canManufacture: false,
      materialsRequired: [],
      estimatedTime: 0,
      inStock: 2,
    },
    {
      partName: "Thermal Radiator",
      availableFromRecycling: true,
      canManufacture: true,
      materialsRequired: [
        { material: "aluminum", amount: 18 },
        { material: "copper", amount: 6 },
      ],
      estimatedTime: 100,
      inStock: 1,
    },
    {
      partName: "Star Tracker",
      availableFromRecycling: false,
      canManufacture: true,
      materialsRequired: [
        { material: "silicon", amount: 8 },
        { material: "titanium", amount: 5 },
      ],
      estimatedTime: 200,
      inStock: 0,
    },
    {
      partName: "Reaction Wheel",
      availableFromRecycling: true,
      canManufacture: true,
      materialsRequired: [
        { material: "titanium", amount: 15 },
        { material: "carbon_fiber", amount: 4 },
      ],
      estimatedTime: 160,
      inStock: 1,
    },
  ]

  const filteredParts = satelliteParts.filter((part) => part.partName.toLowerCase().includes(searchQuery.toLowerCase()))

  const checkMaterialAvailability = (part: PartAvailability) => {
    return part.materialsRequired.every((req) => {
      const available = materialInventory[req.material as keyof MaterialInventory]
      return available >= req.amount
    })
  }

  const getAvailabilityStatus = (part: PartAvailability) => {
    if (part.inStock > 0) return { status: "in-stock", color: "green", text: "IN STOCK" }
    if (part.availableFromRecycling) return { status: "recyclable", color: "blue", text: "FROM RECYCLING" }
    if (part.canManufacture && checkMaterialAvailability(part))
      return { status: "manufacturable", color: "purple", text: "CAN MANUFACTURE" }
    if (part.canManufacture) return { status: "insufficient", color: "yellow", text: "INSUFFICIENT MATERIALS" }
    return { status: "unavailable", color: "red", text: "UNAVAILABLE" }
  }

  return (
    <Card className="border-cyan-500/30 bg-cyan-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-400" />
            PROMETHEUS Parts Availability Scanner
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Interface */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search satellite parts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm"
          />
          <Button variant="outline" size="sm">
            Scan
          </Button>
        </div>

        {/* Parts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {filteredParts.map((part) => {
            const availability = getAvailabilityStatus(part)
            return (
              <div
                key={part.partName}
                className={`bg-slate-800/50 rounded-lg p-3 cursor-pointer transition-all hover:bg-slate-700/50 border ${
                  selectedPart?.partName === part.partName ? "border-cyan-500" : "border-slate-600"
                }`}
                onClick={() => setSelectedPart(selectedPart?.partName === part.partName ? null : part)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-mono text-sm text-white">{part.partName}</h4>
                  <Badge
                    variant="outline"
                    className={`text-xs border-${availability.color}-500 text-${availability.color}-400`}
                  >
                    {availability.text}
                  </Badge>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>In Stock:</span>
                    <span className={part.inStock > 0 ? "text-green-400" : "text-red-400"}>{part.inStock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>From Recycling:</span>
                    <span className={part.availableFromRecycling ? "text-blue-400" : "text-gray-500"}>
                      {part.availableFromRecycling ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Can Manufacture:</span>
                    <span className={part.canManufacture ? "text-purple-400" : "text-gray-500"}>
                      {part.canManufacture ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                {selectedPart?.partName === part.partName && (
                  <div className="mt-3 pt-3 border-t border-slate-600 space-y-2">
                    {part.materialsRequired.length > 0 && (
                      <div>
                        <div className="text-xs text-cyan-400 mb-1">Materials Required:</div>
                        <div className="space-y-1">
                          {part.materialsRequired.map((req) => {
                            const available = materialInventory[req.material as keyof MaterialInventory]
                            const hasEnough = available >= req.amount
                            return (
                              <div key={req.material} className="flex justify-between text-xs">
                                <span className="capitalize">{req.material.replace("_", " ")}:</span>
                                <span className={hasEnough ? "text-green-400" : "text-red-400"}>
                                  {req.amount}kg ({available}kg available)
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {part.canManufacture && part.estimatedTime > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-cyan-400">Manufacturing Time:</span>
                        <span className="text-white">{part.estimatedTime} minutes</span>
                      </div>
                    )}

                    <div className="flex gap-2 mt-2">
                      {part.inStock > 0 && (
                        <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700">
                          Use Stock
                        </Button>
                      )}
                      {part.availableFromRecycling && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs border-blue-500 text-blue-400 bg-transparent"
                        >
                          Source from Debris
                        </Button>
                      )}
                      {part.canManufacture && checkMaterialAvailability(part) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs border-purple-500 text-purple-400 bg-transparent"
                        >
                          Manufacture
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-600">
          <div className="bg-green-900/30 rounded p-2 text-center">
            <div className="text-xs text-green-400">In Stock</div>
            <div className="text-sm font-mono text-white">{satelliteParts.filter((p) => p.inStock > 0).length}</div>
          </div>
          <div className="bg-blue-900/30 rounded p-2 text-center">
            <div className="text-xs text-blue-400">Recyclable</div>
            <div className="text-sm font-mono text-white">
              {satelliteParts.filter((p) => p.availableFromRecycling).length}
            </div>
          </div>
          <div className="bg-purple-900/30 rounded p-2 text-center">
            <div className="text-xs text-purple-400">Manufacturable</div>
            <div className="text-sm font-mono text-white">
              {satelliteParts.filter((p) => p.canManufacture && checkMaterialAvailability(p)).length}
            </div>
          </div>
          <div className="bg-red-900/30 rounded p-2 text-center">
            <div className="text-xs text-red-400">Unavailable</div>
            <div className="text-sm font-mono text-white">
              {
                satelliteParts.filter(
                  (p) =>
                    p.inStock === 0 &&
                    !p.availableFromRecycling &&
                    (!p.canManufacture || !checkMaterialAvailability(p)),
                ).length
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SatelliteInterior({ onBack }: { onBack: () => void }) {
  const [activeSystem, setActiveSystem] = useState<string | null>("repair-station")
  const [showRepairInterface, setShowRepairInterface] = useState(false)
  const [showPartChecker, setShowPartChecker] = useState(false)
  const [newRepairForm, setNewRepairForm] = useState({
    satelliteName: "",
    operation: "repair" as "repair" | "replace" | "upgrade",
    component: "",
  })

  const [repairOperations, setRepairOperations] = useState<RepairOperation[]>([
    {
      id: "1",
      satelliteName: "HUBBLE-LEGACY",
      operation: "repair",
      component: "Solar Panel Array",
      duration: 45,
      progress: 0,
      status: "pending",
    },
  ])

  const [materialInventory, setMaterialInventory] = useState<MaterialInventory>({
    aluminum: 45,
    titanium: 23,
    silicon: 67,
    copper: 34,
    carbon_fiber: 12,
  })

  const startRepairOperation = (operationId: string) => {
    setRepairOperations((prev) =>
      prev.map((op) => (op.id === operationId ? { ...op, status: "in-progress" as const, progress: 0 } : op)),
    )

    // Simulate repair progress
    const interval = setInterval(() => {
      setRepairOperations((prev) =>
        prev.map((op) => {
          if (op.id === operationId && op.status === "in-progress") {
            const newProgress = Math.min(op.progress + Math.random() * 5, 100)
            if (newProgress >= 100) {
              clearInterval(interval)
              return { ...op, progress: 100, status: "completed" as const }
            }
            return { ...op, progress: newProgress }
          }
          return op
        }),
      )
    }, 500)
  }

  const addRepairOperation = () => {
    if (!newRepairForm.satelliteName || !newRepairForm.component) return

    const materialsNeeded =
      newRepairForm.operation !== "repair"
        ? [
            { material: "aluminum", amount: Math.floor(Math.random() * 20) + 5 },
            { material: "titanium", amount: Math.floor(Math.random() * 15) + 3 },
          ]
        : undefined

    const newOperation: RepairOperation = {
      id: Date.now().toString(),
      satelliteName: newRepairForm.satelliteName,
      operation: newRepairForm.operation,
      component: newRepairForm.component,
      materialsNeeded,
      duration: Math.floor(Math.random() * 60) + 30,
      progress: 0,
      status: materialsNeeded ? "waiting-materials" : "pending",
    }

    // Check material availability
    if (materialsNeeded) {
      const hasEnoughMaterials = materialsNeeded.every((needed) => {
        const available = materialInventory[needed.material as keyof MaterialInventory]
        return available >= needed.amount
      })

      if (hasEnoughMaterials) {
        newOperation.status = "pending"
        // Deduct materials
        setMaterialInventory((prev) => {
          const updated = { ...prev }
          materialsNeeded.forEach((needed) => {
            updated[needed.material as keyof MaterialInventory] -= needed.amount
          })
          return updated
        })
      }
    }

    setRepairOperations((prev) => [...prev, newOperation])
    setNewRepairForm({ satelliteName: "", operation: "repair", component: "" })
    setShowRepairInterface(false)
  }

  const currentRepairOperation = repairOperations.find((op) => op.status === "in-progress")

  const systems = [
    { id: "debris-collector", name: "ATLAS Debris Collector", status: "Active", power: 88, type: "collection" },
    { id: "repair-station", name: "HERMES Repair Station", status: "Active", power: 76, type: "repair" },
    { id: "furnace", name: "VULCAN Recycling Furnace", status: "Active", power: 94, type: "recycling" },
    { id: "printer", name: "PROMETHEUS 3D Printer", status: "Standby", power: 45, type: "manufacturing" },
    { id: "arm1", name: "TITAN Manipulator Arm", status: "Active", power: 82, type: "manipulation" },
    { id: "arm2", name: "APOLLO Support Arm", status: "Standby", power: 15, type: "manipulation" },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          Back to Orbital View
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="animate-pulse">
            ORBITAL SYMBIONT-1 Interior - Multi-Function Operations Center
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRepairInterface(!showRepairInterface)}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Repair Operations
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowPartChecker(!showPartChecker)} className="gap-2">
            <Settings className="h-4 w-4" />
            Parts Scanner
          </Button>
        </div>
      </div>

      {showPartChecker && (
        <PartAvailabilityChecker materialInventory={materialInventory} onClose={() => setShowPartChecker(false)} />
      )}

      {showRepairInterface && (
        <Card className="border-blue-500/30 bg-blue-950/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wrench className="h-5 w-5 text-blue-400" />
              HERMES Repair Operations Center
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Material Inventory */}
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(materialInventory).map(([material, amount]) => (
                <div key={material} className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-muted-foreground capitalize">{material.replace("_", " ")}</div>
                  <div className="text-sm font-mono text-green-400">{amount}kg</div>
                </div>
              ))}
            </div>

            {/* New Repair Form */}
            <div className="grid grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Satellite Name"
                value={newRepairForm.satelliteName}
                onChange={(e) => setNewRepairForm((prev) => ({ ...prev, satelliteName: e.target.value }))}
                className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm"
              />
              <select
                value={newRepairForm.operation}
                onChange={(e) => setNewRepairForm((prev) => ({ ...prev, operation: e.target.value as any }))}
                className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm"
              >
                <option value="repair">Repair</option>
                <option value="replace">Replace Part</option>
                <option value="upgrade">Upgrade</option>
              </select>
              <input
                type="text"
                placeholder="Component"
                value={newRepairForm.component}
                onChange={(e) => setNewRepairForm((prev) => ({ ...prev, component: e.target.value }))}
                className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm"
              />
              <Button onClick={addRepairOperation} size="sm">
                Add Operation
              </Button>
            </div>

            {/* Active Operations */}
            <div className="space-y-2">
              {repairOperations.map((operation) => (
                <div key={operation.id} className="flex items-center justify-between bg-slate-800/30 rounded-lg p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm">{operation.satelliteName}</span>
                      <Badge variant="outline" className="text-xs">
                        {operation.operation.toUpperCase()}
                      </Badge>
                      {operation.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {operation.status === "waiting-materials" && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{operation.component}</div>
                    {operation.progress > 0 && <Progress value={operation.progress} className="h-1 mt-1" />}
                  </div>
                  <div className="flex items-center gap-2">
                    {operation.materialsNeeded && (
                      <div className="text-xs text-yellow-400">
                        Materials: {operation.materialsNeeded.map((m) => `${m.amount}kg ${m.material}`).join(", ")}
                      </div>
                    )}
                    {operation.status === "pending" && (
                      <Button size="sm" onClick={() => startRepairOperation(operation.id)}>
                        Start
                      </Button>
                    )}
                    {operation.status === "waiting-materials" && (
                      <Badge variant="destructive" className="text-xs">
                        Insufficient Materials
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3D Interior View */}
      <div className="relative h-[600px] w-full rounded-xl border-2 border-primary/20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden shadow-2xl">
        <Canvas camera={{ position: [3, 2.5, 3], fov: 60 }}>
          {/* Enhanced lighting for better visibility */}
          <ambientLight intensity={0.5} />
          <pointLight position={[2, 2, 2]} intensity={1.2} color="#ffffff" />
          <pointLight position={[-2, 1, -1]} intensity={0.8} color="#3B82F6" />
          <spotLight position={[0, 3, 0]} intensity={1} angle={0.6} penumbra={0.5} />
          <pointLight position={[0, 1, 2]} intensity={0.6} color="#10B981" />

          <Environment preset="warehouse" />

          {/* Interior walls with enhanced detail */}
          <mesh position={[0, 0, -2]}>
            <boxGeometry args={[4, 3, 0.1]} />
            <meshStandardMaterial color="#1E293B" metalness={0.3} roughness={0.7} />
          </mesh>
          <mesh position={[-2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[4, 3, 0.1]} />
            <meshStandardMaterial color="#1E293B" metalness={0.3} roughness={0.7} />
          </mesh>
          <mesh position={[2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <boxGeometry args={[4, 3, 0.1]} />
            <meshStandardMaterial color="#1E293B" metalness={0.3} roughness={0.7} />
          </mesh>

          {/* Enhanced floor with grid pattern */}
          <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <boxGeometry args={[4, 4, 0.1]} />
            <meshStandardMaterial color="#0F172A" metalness={0.5} roughness={0.5} />
          </mesh>

          <DebrisCollectionArm
            position={[-1.2, -0.5, 1]}
            rotation={[0, -Math.PI / 4, 0]}
            isActive={activeSystem === "debris-collector"}
          />
          <RepairStation
            position={[1.2, -0.8, 1]}
            isActive={activeSystem === "repair-station"}
            currentOperation={currentRepairOperation}
          />
          <Furnace position={[0, -0.5, -1.2]} isActive={activeSystem === "furnace"} />
          <Printer3D position={[1.2, -0.5, -1.2]} isActive={activeSystem === "printer"} />
          <RoboticArm position={[-1.2, -0.5, -0.2]} rotation={[0, Math.PI / 6, 0]} isActive={activeSystem === "arm1"} />
          <RoboticArm position={[0.8, -0.5, 0.2]} rotation={[0, -Math.PI / 3, 0]} isActive={activeSystem === "arm2"} />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>

        {/* Enhanced HUD Overlay */}
        <div className="absolute top-4 left-4 space-y-2 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-xs font-mono text-cyan-400 border border-cyan-500/30">
            <div className="text-cyan-300 font-semibold mb-2">SYMBIONT-1 OPERATIONS CENTER</div>
            <div>LIFE SUPPORT: NOMINAL</div>
            <div>PRESSURE: 1.0 ATM</div>
            <div>DEBRIS COLLECTED: {Math.floor(Math.random() * 150) + 50} OBJECTS</div>
            <div>REPAIRS COMPLETED: {repairOperations.filter((op) => op.status === "completed").length}</div>
            <div>ACTIVE OPERATIONS: {repairOperations.filter((op) => op.status === "in-progress").length}</div>
          </div>
        </div>

        {/* Mission status */}
        <div className="absolute top-4 right-4 pointer-events-none">
          <div className="bg-green-900/60 backdrop-blur-sm rounded-lg p-3 text-xs font-mono text-green-300 border border-green-500/30">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              MISSION ACTIVE
            </div>
            <div>ORBITAL CLEANUP: 78%</div>
            <div>SATELLITE REPAIRS: {repairOperations.filter((op) => op.status === "completed").length}/15</div>
            <div>MATERIAL RESERVES: {Object.values(materialInventory).reduce((a, b) => a + b, 0)}kg</div>
          </div>
        </div>
      </div>

      {/* Enhanced System Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {systems.map((system) => (
          <Card
            key={system.id}
            className={`cursor-pointer transition-all duration-200 ${
              activeSystem === system.id ? "border-primary bg-primary/5 shadow-lg" : "hover:border-primary/50"
            }`}
            onClick={() => setActiveSystem(activeSystem === system.id ? null : system.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                {system.type === "collection" && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                {system.type === "repair" && <Wrench className="h-4 w-4 text-blue-500" />}
                {system.type === "recycling" && <Thermometer className="h-4 w-4 text-red-500" />}
                {system.type === "manufacturing" && <Printer className="h-4 w-4 text-purple-500" />}
                {system.type === "manipulation" && <Wrench className="h-4 w-4 text-yellow-500" />}
                {system.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Status:</span>
                <Badge variant={system.status === "Active" ? "default" : "secondary"} className="text-xs">
                  {system.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Power:</span>
                  <span className="font-mono">{system.power}%</span>
                </div>
                <Progress value={system.power} className="h-1" />
              </div>
              <div className="text-xs text-muted-foreground">
                {system.type === "collection" && `Objects: ${Math.floor(Math.random() * 20) + 5}`}
                {system.type === "repair" && `Repairs: ${Math.floor(Math.random() * 10) + 2}/day`}
                {system.type === "recycling" && `Output: ${Math.floor(Math.random() * 50) + 25}kg/h`}
                {system.type === "manufacturing" && `Queue: ${Math.floor(Math.random() * 5) + 1} items`}
                {system.type === "manipulation" && `Tasks: ${Math.floor(Math.random() * 8) + 3} pending`}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export { SatelliteInterior }
