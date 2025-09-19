"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, DollarSign, Target, Zap } from "lucide-react"

// Mock data for charts
const revenueData = [
  { month: "Jan", symbiotics: 2.1, orbnet: 1.8, total: 3.9 },
  { month: "Feb", symbiotics: 2.4, orbnet: 2.1, total: 4.5 },
  { month: "Mar", symbiotics: 2.8, orbnet: 2.3, total: 5.1 },
  { month: "Apr", symbiotics: 3.2, orbnet: 2.6, total: 5.8 },
  { month: "May", symbiotics: 3.6, orbnet: 2.9, total: 6.5 },
  { month: "Jun", symbiotics: 4.2, orbnet: 3.2, total: 7.4 },
]

const operationsData = [
  { month: "Jan", debris: 180, manufacturing: 12, servicing: 3 },
  { month: "Feb", debris: 220, manufacturing: 15, servicing: 4 },
  { month: "Mar", debris: 280, manufacturing: 18, servicing: 5 },
  { month: "Apr", debris: 340, manufacturing: 22, servicing: 6 },
  { month: "May", debris: 420, manufacturing: 28, servicing: 8 },
  { month: "Jun", debris: 480, manufacturing: 32, servicing: 9 },
]

const serviceDistribution = [
  { name: "Debris Recycling", value: 45, color: "#EF4444" },
  { name: "Manufacturing", value: 30, color: "#8B5CF6" },
  { name: "Satellite Servicing", value: 15, color: "#10B981" },
  { name: "OrbNet Services", value: 10, color: "#3B82F6" },
]

export function AnalyticsPanel() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Business Analytics</h2>
          <p className="text-muted-foreground">Integrated performance metrics for Orbital Symbiotics & OrbNet</p>
        </div>
        <Button>
          <TrendingUp className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$7.4M</div>
            <p className="text-xs text-green-600">+18.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Mission Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.8%</div>
            <p className="text-xs text-muted-foreground">All operations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Operational Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-green-600">+2.1% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5</div>
            <p className="text-xs text-muted-foreground">Based on 247 reviews</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="operations">Operations Metrics</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue breakdown by service line</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}M`, ""]} />
                    <Bar dataKey="symbiotics" fill="#8B5CF6" name="Orbital Symbiotics" />
                    <Bar dataKey="orbnet" fill="#3B82F6" name="OrbNet" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Distribution</CardTitle>
                <CardDescription>Revenue share by service category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {serviceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Combined Revenue Growth</CardTitle>
              <CardDescription>Total monthly revenue from integrated operations</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}M`, "Total Revenue"]} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operational Metrics</CardTitle>
              <CardDescription>Monthly operations volume across all service lines</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={operationsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="debris" fill="#EF4444" name="Debris Processed (kg)" />
                  <Bar dataKey="manufacturing" fill="#8B5CF6" name="Components Made" />
                  <Bar dataKey="servicing" fill="#10B981" name="Satellites Serviced" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Debris Processing Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">480 kg/month</div>
                <p className="text-xs text-green-600">+14.3% efficiency gain</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Manufacturing Output</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32 components</div>
                <p className="text-xs text-green-600">+14.3% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Service Missions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">9 satellites</div>
                <p className="text-xs text-green-600">+12.5% increase</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Position</CardTitle>
                <CardDescription>Competitive analysis and market share</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">LEO Debris Removal Market</span>
                    <Badge variant="default">Market Leader</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">In-Space Manufacturing</span>
                    <Badge variant="secondary">Early Adopter</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Satellite Servicing</span>
                    <Badge variant="default">Top 3 Provider</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">LEO Communications</span>
                    <Badge variant="secondary">Growing Share</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Projections</CardTitle>
                <CardDescription>12-month forward-looking estimates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Revenue Growth</span>
                      <span>+45% projected</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Market Expansion</span>
                      <span>+32% new clients</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "32%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Operational Scale</span>
                      <span>+60% capacity</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Strategic Opportunities</CardTitle>
              <CardDescription>Identified growth areas and partnerships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Near-term Opportunities</h4>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium text-sm">Orbital Power Grid Deployment</p>
                      <p className="text-xs text-muted-foreground">New revenue stream from power-as-a-service</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium text-sm">Government Contracts</p>
                      <p className="text-xs text-muted-foreground">Defense and space agency partnerships</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Long-term Vision</h4>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium text-sm">Deep Space Operations</p>
                      <p className="text-xs text-muted-foreground">Extend services beyond LEO</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium text-sm">Space Habitat Construction</p>
                      <p className="text-xs text-muted-foreground">Large-scale in-space assembly</p>
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
