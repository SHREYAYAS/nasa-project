"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Network, Shield, Zap, Signal, Globe, Activity } from "lucide-react"

export function OrbNetPanel() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">OrbNet Communication Hub</h2>
          <p className="text-muted-foreground">Secure, low-latency LEO satellite constellation</p>
        </div>
        <Button>
          <Activity className="h-4 w-4 mr-2" />
          Network Status
        </Button>
      </div>

      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Network className="h-4 w-4" />
              Active Satellites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">of 50 deployed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Signal className="h-4 w-4" />
              Network Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">99.97%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Avg Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12ms</div>
            <p className="text-xs text-muted-foreground">Global average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Data Throughput
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 Tbps</div>
            <p className="text-xs text-muted-foreground">Current capacity</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="constellation" className="space-y-4">
        <TabsList>
          <TabsTrigger value="constellation">Constellation Status</TabsTrigger>
          <TabsTrigger value="security">Security & Encryption</TabsTrigger>
          <TabsTrigger value="clients">Client Services</TabsTrigger>
        </TabsList>

        <TabsContent value="constellation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Satellite Health Monitor</CardTitle>
                <CardDescription>Real-time status of OrbNet constellation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">OrbNet-1 through OrbNet-15</p>
                      <p className="text-sm text-muted-foreground">Orbital Plane Alpha</p>
                    </div>
                    <Badge variant="default">Operational</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">OrbNet-16 through OrbNet-30</p>
                      <p className="text-sm text-muted-foreground">Orbital Plane Beta</p>
                    </div>
                    <Badge variant="default">Operational</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">OrbNet-31 through OrbNet-47</p>
                      <p className="text-sm text-muted-foreground">Orbital Plane Gamma</p>
                    </div>
                    <Badge variant="default">Operational</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">OrbNet-48, OrbNet-49</p>
                      <p className="text-sm text-muted-foreground">Orbital Plane Delta</p>
                    </div>
                    <Badge variant="secondary">Maintenance</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coverage Map</CardTitle>
                <CardDescription>Global communication coverage zones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">100%</div>
                      <p className="text-sm text-muted-foreground">North America</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">98%</div>
                      <p className="text-sm text-muted-foreground">Europe</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">95%</div>
                      <p className="text-sm text-muted-foreground">Asia Pacific</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-amber-600">87%</div>
                      <p className="text-sm text-muted-foreground">Other Regions</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      Next satellite deployment scheduled for Q2 2024 to improve coverage in underserved regions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Encryption Status
              </CardTitle>
              <CardDescription>End-to-end encryption and security protocols</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Encryption Protocols</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">AES-256 Encryption</p>
                        <p className="text-sm text-muted-foreground">Data at rest</p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">TLS 1.3</p>
                        <p className="text-sm text-muted-foreground">Data in transit</p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Quantum-Resistant Keys</p>
                        <p className="text-sm text-muted-foreground">Future-proof security</p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Security Metrics</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Threat Detection Rate</span>
                        <span>99.8%</span>
                      </div>
                      <Progress value={99.8} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>False Positive Rate</span>
                        <span>0.02%</span>
                      </div>
                      <Progress value={0.02} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Key Rotation Compliance</span>
                        <span>100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data-as-a-Service Clients</CardTitle>
              <CardDescription>Current subscribers and service tiers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">23</div>
                        <p className="text-sm text-muted-foreground">Enterprise Clients</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">7</div>
                        <p className="text-sm text-muted-foreground">Government Agencies</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">156</div>
                        <p className="text-sm text-muted-foreground">Research Institutions</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Recent Client Activity</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Financial Services Corp</p>
                        <p className="text-sm text-muted-foreground">High-frequency trading data</p>
                      </div>
                      <Badge variant="default">Premium Tier</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Defense Research Lab</p>
                        <p className="text-sm text-muted-foreground">Secure communications</p>
                      </div>
                      <Badge variant="secondary">Government Tier</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Climate Research Institute</p>
                        <p className="text-sm text-muted-foreground">Environmental monitoring</p>
                      </div>
                      <Badge variant="outline">Research Tier</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
