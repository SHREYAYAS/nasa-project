# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` or `pnpm dev`
- **Build**: `npm run build` 
- **Production start**: `npm run start`
- **Linting**: `npm run lint`

## Project Architecture

This is a Next.js 14 application implementing an **Orbital Debris Management & Space Industry Integration Platform** with blockchain components.

### Core Application Structure

**Main App (`app/page.tsx`)**:
- Tab-based interface with 5 main sections: 3D Orbital View, Blockchain Data, Symbiotics (debris management), OrbNet (networking), and Analytics
- Uses React state for view switching between orbital and satellite interior views
- Built with shadcn/ui components and Tailwind CSS

**API Routes (`app/api/`)**:
- **NASA APIs** (`/api/nasa/`): debris tracking, earth imagery, ISS position, TLE data, statistics
- **Blockchain APIs** (`/api/blockchain/`): transactions, blocks, smart contracts, analytics
- All routes are marked with `export const dynamic = 'force-dynamic'` for dynamic rendering

**Key Libraries & Services**:
- **NASA Integration** (`lib/nasa-official.ts`): Real NASA API client for TLE data, ISS position, Earth imagery, and space debris tracking
- **Blockchain Integration** (`lib/blockchain.ts`): Custom blockchain client for orbital debris transactions and smart contracts
- **3D Visualization**: Uses `@react-three/fiber` and `@react-three/drei` for orbital and satellite interior rendering
- **UI Components**: Comprehensive shadcn/ui component library with Radix UI primitives

### Component Architecture

**Main Components**:
- `orbital-visualization.tsx`: 3D Earth/orbital view with debris tracking
- `satellite-interior.tsx`: Interior satellite view with robotic arms and equipment
- `blockchain-dashboard.tsx`: Blockchain transaction and block data
- `symbiotics-panel.tsx`: Debris management and processing interface
- `orbnet-panel.tsx`: Network connectivity and satellite communication
- `analytics-panel.tsx`: Data visualization and metrics

### Configuration Notes

- **TypeScript**: Strict mode enabled with path aliases (`@/*` maps to project root)
- **Build Configuration**: ESLint and TypeScript errors are ignored during builds (`ignoreDuringBuilds: true`)
- **Images**: Unoptimized for static deployment compatibility
- **Styling**: Uses Tailwind CSS with custom animations and gradients

### NASA API Integration

The application integrates with real NASA APIs and includes:
- Two-Line Element (TLE) satellite tracking data
- Real-time ISS position tracking  
- Earth observation imagery
- Space debris catalog data with orbital mechanics calculations
- Simplified SGP4 implementation for orbital position calculations

### Blockchain Components

Custom blockchain implementation for space industry use cases:
- Transaction types: debris capture, material processing, satellite servicing, power transfer
- Smart contract execution for automated space operations
- Gas-based fee calculation system
- Orbital debris tracking on blockchain ledger