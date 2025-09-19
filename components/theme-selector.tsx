"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette, Check } from "lucide-react"

const themes = [
  {
    name: "Space Blue",
    id: "space-blue",
    primary: "oklch(0.5 0.2 260)",
    secondary: "oklch(0.6 0.15 280)",
    accent: "oklch(0.6 0.2 220)",
    description: "Deep space exploration theme",
  },
  {
    name: "Orbital Green",
    id: "orbital-green",
    primary: "oklch(0.5 0.2 150)",
    secondary: "oklch(0.6 0.15 130)",
    accent: "oklch(0.55 0.2 170)",
    description: "Sustainable orbital operations",
  },
  {
    name: "Cosmic Purple",
    id: "cosmic-purple",
    primary: "oklch(0.55 0.25 290)",
    secondary: "oklch(0.6 0.2 320)",
    accent: "oklch(0.5 0.3 270)",
    description: "Advanced space technology",
  },
  {
    name: "Solar Orange",
    id: "solar-orange",
    primary: "oklch(0.65 0.2 45)",
    secondary: "oklch(0.6 0.25 30)",
    accent: "oklch(0.7 0.2 60)",
    description: "Solar power and energy systems",
  },
  {
    name: "Nebula Pink",
    id: "nebula-pink",
    primary: "oklch(0.6 0.2 320)",
    secondary: "oklch(0.65 0.15 340)",
    accent: "oklch(0.55 0.25 300)",
    description: "Cosmic phenomena and exploration",
  },
  {
    name: "Asteroid Gray",
    id: "asteroid-gray",
    primary: "oklch(0.4 0.05 240)",
    secondary: "oklch(0.5 0.1 220)",
    accent: "oklch(0.6 0.15 200)",
    description: "Industrial space operations",
  },
]

export function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState("space-blue")

  const applyTheme = (theme: (typeof themes)[0]) => {
    const root = document.documentElement

    // Apply the new theme colors
    root.style.setProperty("--primary", theme.primary)
    root.style.setProperty("--secondary", theme.secondary)
    root.style.setProperty("--accent", theme.accent)

    // Update chart colors to match theme
    root.style.setProperty("--chart-1", theme.primary)
    root.style.setProperty("--chart-2", theme.secondary)
    root.style.setProperty("--chart-3", theme.accent)
    root.style.setProperty(
      "--chart-4",
      `oklch(0.7 0.2 ${Number.parseInt(theme.primary.match(/\d+/)?.[0] || "260") + 60})`,
    )
    root.style.setProperty(
      "--chart-5",
      `oklch(0.6 0.25 ${Number.parseInt(theme.primary.match(/\d+/)?.[0] || "260") + 120})`,
    )

    // Update sidebar colors
    root.style.setProperty("--sidebar-primary", theme.primary)
    root.style.setProperty("--sidebar-accent", theme.secondary)

    setCurrentTheme(theme.id)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Selector
        </CardTitle>
        <p className="text-sm text-muted-foreground">Customize the visual theme of your orbital command center</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                currentTheme === theme.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onClick={() => applyTheme(theme)}
            >
              {currentTheme === theme.id && (
                <div className="absolute top-2 right-2">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: theme.primary }} />
                  <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: theme.secondary }} />
                  <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: theme.accent }} />
                </div>

                <div>
                  <h3 className="font-semibold text-sm">{theme.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{theme.description}</p>
                </div>

                {currentTheme === theme.id && (
                  <Badge variant="secondary" className="text-xs">
                    Active Theme
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Theme Preview</h4>
          <div className="flex items-center gap-2">
            <Button size="sm" className="text-xs">
              Primary Button
            </Button>
            <Button size="sm" variant="secondary" className="text-xs">
              Secondary
            </Button>
            <Button size="sm" variant="outline" className="text-xs bg-transparent">
              Outline
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
