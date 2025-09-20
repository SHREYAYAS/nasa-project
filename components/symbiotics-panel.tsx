"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Recycle, Factory, Wrench, TrendingUp, AlertTriangle, Eye, RotateCcw } from "lucide-react"

// Dynamically import the 3D components to avoid SSR issues
const OrbitalScene = dynamic(() => import("./orbital-scene"), { ssr: false })
const SatelliteInteriorScene = dynamic(() => import("./satellite-interior-scene"), { ssr: false })

export function SymbioticsPanel() {
  const [viewMode, setViewMode] = useState<"dashboard" | "3d-operations" | "interior">("dashboard")
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Orbital Symbiotics Operations</h2>
          <p className="text-muted-foreground">Debris recycling, manufacturing, and satellite servicing</p>
        </div>
        <div className="flex items-center gap-2">
          {viewMode !== "dashboard" && (
            <Button variant="outline" onClick={() => setViewMode("dashboard")}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          )}
          <Button 
            variant={viewMode === "3d-operations" ? "default" : "outline"}
            onClick={() => setViewMode("3d-operations")}
          >
            <Eye className="h-4 w-4 mr-2" />
            3D Operations View
          </Button>
          <Button variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Reports
          </Button>
        </div>
      </div>

      {/* 3D Operations View */}
      {viewMode === "3d-operations" && (
        <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-card/80 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Recycle className="h-5 w-5 text-primary" />
              Live Symbiotic Operations View
            </CardTitle>
            <CardDescription>
              Real-time 3D visualization of debris collection, processing, and satellite servicing operations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-[600px] w-full rounded-b-xl overflow-hidden">
              <OrbitalScene 
                isPlaying={true}
                timeScale={1}
                selectedSatellite={null}
                onSatelliteSelect={() => {}}
                onViewInterior={(index: number) => {
                  setSelectedOperation(`operation-${index}`)
                  setViewMode("interior")
                }}
              />
              
              {/* Operations overlay */}
              <div className="absolute top-4 left-4 space-y-2 pointer-events-none">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-xs font-mono text-cyan-400 border border-cyan-500/30">
                  <div className="text-cyan-300 font-semibold mb-2">ACTIVE SYMBIOTIC OPERATIONS</div>
                  <div>🛰️ DEBRIS COLLECTION: 3 missions active</div>
                  <div>🔧 SATELLITE SERVICING: OrbNet-2 fuel refill 67%</div>
                  <div>🏭 MANUFACTURING: Solar panel assembly in progress</div>
                  <div>♻️ PROCESSING: 847kg material recycled today</div>
                </div>
              </div>

              {/* Mission status */}
              <div className="absolute top-4 right-4 pointer-events-none">
                <div className="bg-green-900/60 backdrop-blur-sm rounded-lg p-3 text-xs font-mono text-green-300 border border-green-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    SYMBIOSIS ACTIVE
                  </div>
                  <div>EFFICIENCY: 94%</div>
                  <div>MATERIAL YIELD: 89%</div>
                  <div>OPERATIONS: 7 concurrent</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interior View */}
      {viewMode === "interior" && (
        <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-card/80 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Factory className="h-5 w-5 text-primary" />
              Symbiont Manufacturing & Processing Hub
            </CardTitle>
            <CardDescription>
              Inside view of orbital debris processing and component manufacturing
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-[600px] w-full rounded-b-xl overflow-hidden">
              <SatelliteInteriorScene 
                activeSystem="furnace"
                currentOperation={{
                  id: "symbiotic-process-1",
                  satelliteName: "DEBRIS-PROCESSOR-1",
                  operation: "repair",
                  component: "Debris Processing Unit",
                  duration: 120,
                  progress: 67,
                  status: "in-progress"
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard View */}
      {viewMode === "dashboard" && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Recycle className="h-4 w-4" />
              Debris Recycled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847 kg</div>
            <p className="text-xs text-muted-foreground">+23% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Factory className="h-4 w-4" />
              Components Made
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Various parts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Satellites Serviced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Life extended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4.2M</div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="operations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="operations">Active Operations</TabsTrigger>
          <TabsTrigger value="manufacturing">Manufacturing Hub</TabsTrigger>
          <TabsTrigger value="servicing">Satellite Servicing</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Recycle className="h-5 w-5" />
                  Debris Collection Missions
                </CardTitle>
                <CardDescription>Current and planned debris capture operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Mission ODR-2024-001</p>
                      <p className="text-sm text-muted-foreground">Target: Defunct Satellite A47</p>
                    </div>
                    <Badge variant="default">In Progress</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Mission ODR-2024-002</p>
                      <p className="text-sm text-muted-foreground">Target: Rocket Stage B23</p>
                    </div>
                    <Badge variant="secondary">Planned</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Mission ODR-2024-003</p>
                      <p className="text-sm text-muted-foreground">Target: Multiple Small Debris</p>
                    </div>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Health and performance of Symbiont platforms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Symbiont-1 (Harvester)</span>
                      <span>98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Manufacturing Hub-1</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Servicing Module-1</span>
                      <span>89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    Servicing Module-1: Scheduled maintenance in 3 days
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manufacturing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="h-5 w-5" />
                In-Space Manufacturing Hub
              </CardTitle>
              <CardDescription>3D printing and component fabrication using recycled materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Current Production Queue</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Solar Panel Assembly</p>
                        <p className="text-sm text-muted-foreground">For OrbNet-3 upgrade</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="default">Printing</Badge>
                        <p className="text-xs text-muted-foreground mt-1">6h remaining</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Thruster Components</p>
                        <p className="text-sm text-muted-foreground">Replacement parts</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">Queued</Badge>
                        <p className="text-xs text-muted-foreground mt-1">Est. 12h</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Material Inventory</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Aluminum Alloy</span>
                        <span>847 kg</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Titanium</span>
                        <span>234 kg</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Rare Earth Elements</span>
                        <span>67 kg</span>
                      </div>
                      <Progress value={23} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="servicing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Satellite Life Extension Services
              </CardTitle>
              <CardDescription>Repair, refuel, and upgrade operations for active satellites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">OrbNet-2</h4>
                        <Badge variant="default">Servicing</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Fuel refill operation</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>67%</span>
                        </div>
                        <Progress value={67} className="h-1" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">CommSat-5</h4>
                        <Badge variant="secondary">Scheduled</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Solar panel replacement</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>ETA</span>
                          <span>2 days</span>
                        </div>
                        <Progress value={0} className="h-1" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">WeatherSat-3</h4>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Antenna repair</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Completed</span>
                          <span>Jan 14</span>
                        </div>
                        <Progress value={100} className="h-1" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </>
      )}
    </div>
  )
}
