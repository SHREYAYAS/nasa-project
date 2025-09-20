"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Thermometer, Printer, Wrench, Settings, AlertTriangle, CheckCircle } from "lucide-react"

// Dynamically import the 3D scene to avoid SSR issues
const SatelliteInteriorScene = dynamic(() => import("./satellite-interior-scene"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-muted-foreground">Loading Interior View...</div>
})

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
        <SatelliteInteriorScene activeSystem={activeSystem} currentOperation={currentRepairOperation} />

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
