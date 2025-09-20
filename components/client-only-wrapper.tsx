"use client"

import { useEffect, useState } from "react"

export function ClientOnlyWrapper({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <div>Loading 3D Scene...</div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}