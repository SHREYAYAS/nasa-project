"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { OrbitalVisualization } from "@/components/orbital-visualization"
import { SatelliteInterior } from "@/components/satellite-interior"
import { BlockchainDashboard } from "@/components/blockchain-dashboard"
import { SymbioticsPanel } from "@/components/symbiotics-panel"
import { OrbNetPanel } from "@/components/orbnet-panel"
import { AnalyticsPanel } from "@/components/analytics-panel"
import { ThemeSelector } from "@/components/theme-selector"
import { Satellite, Recycle, Network, BarChart3, Database, Settings, Palette } from "lucide-react"

export default function OrbitalApp() {
  const [activeTab, setActiveTab] = useState("visualization")
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [viewMode, setViewMode] = useState<"orbital" | "interior">("orbital")
  const [selectedSatelliteIndex, setSelectedSatelliteIndex] = useState<number | null>(null)

  const handleViewInterior = (satelliteIndex: number) => {
    setSelectedSatelliteIndex(satelliteIndex)
    setViewMode("interior")
  }

  const handleBackToOrbital = () => {
    setViewMode("orbital")
    setSelectedSatelliteIndex(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-gradient-to-r from-card/80 via-card/50 to-card/80 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <Satellite className="h-6 w-6 text-primary-foreground animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Orbital Symbiotics Command
                </h1>
                <p className="text-sm text-muted-foreground">LEO Debris Management & OrbNet Integration Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                  System Online
                </Badge>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowThemeSelector(!showThemeSelector)}
                className="gap-2"
              >
                <Palette className="h-4 w-4" />
                Themes
              </Button>

              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {showThemeSelector && (
        <div className="border-b bg-card/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <ThemeSelector />
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-card/50 backdrop-blur-sm border shadow-lg">
            <TabsTrigger
              value="visualization"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
            >
              <Satellite className="h-4 w-4" />
              <span className="hidden sm:inline">3D Orbital View</span>
              <span className="sm:hidden">3D View</span>
            </TabsTrigger>
            <TabsTrigger
              value="blockchain"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
            >
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Blockchain Data</span>
              <span className="sm:hidden">Blockchain</span>
            </TabsTrigger>
            <TabsTrigger
              value="symbiotics"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
            >
              <Recycle className="h-4 w-4" />
              <span className="hidden sm:inline">Symbiotics</span>
              <span className="sm:hidden">Debris</span>
            </TabsTrigger>
            <TabsTrigger
              value="orbnet"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
            >
              <Network className="h-4 w-4" />
              <span className="hidden sm:inline">OrbNet</span>
              <span className="sm:hidden">Network</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualization" className="space-y-6">
            <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-card/80 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Satellite className="h-5 w-5 text-primary" />
                      {viewMode === "orbital" ? "Low Earth Orbit Command Center" : "Satellite Interior View"}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {viewMode === "orbital"
                        ? "Real-time 3D visualization of orbital operations, debris tracking, and satellite management"
                        : "Detailed interior view of satellite systems, robotic arms, furnace, and 3D printer"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/20 text-primary-foreground border-primary/50">
                      Live Data
                    </Badge>
                    <Badge variant="outline" className="bg-secondary/20 text-secondary-foreground border-secondary/50">
                      Interactive
                    </Badge>
                    {viewMode === "interior" && (
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">
                        Interior View
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {viewMode === "orbital" ? (
                  <OrbitalVisualization onViewInterior={handleViewInterior} />
                ) : (
                  <SatelliteInterior onBack={handleBackToOrbital} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blockchain" className="space-y-6">
            <BlockchainDashboard />
          </TabsContent>

          <TabsContent value="symbiotics" className="space-y-6">
            <SymbioticsPanel />
          </TabsContent>

          <TabsContent value="orbnet" className="space-y-6">
            <OrbNetPanel />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsPanel />
          </TabsContent>
        </Tabs>
      </main>

      <div className="fixed bottom-4 right-4 z-50">
        <Card className="bg-card/90 backdrop-blur-sm border-primary/20 shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-xs">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">System Status:</span>
              <span className="text-green-600 font-medium">Operational</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
