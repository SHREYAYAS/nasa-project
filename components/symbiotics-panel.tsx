"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Recycle, Factory, Wrench, TrendingUp, AlertTriangle } from "lucide-react"

export function SymbioticsPanel() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Orbital Symbiotics Operations</h2>
          <p className="text-muted-foreground">Debris recycling, manufacturing, and satellite servicing</p>
        </div>
        <Button>
          <TrendingUp className="h-4 w-4 mr-2" />
          View Reports
        </Button>
      </div>

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
    </div>
  )
}
