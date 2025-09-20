# LEO Debris Management & OrbNet Integration Platform

A real-time Low Earth Orbit (LEO) debris tracking and management system that integrates NASA's live data with advanced 3D visualization, blockchain verification, and autonomous collection planning.

**Live Demo:** [https://nasa-project-lake.vercel.app/](https://nasa-project-lake.vercel.app/)

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/nasa-project-lake.git
   cd nasa-project-lake
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Environment Variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   # NASA API Configuration (optional for demo)
   NASA_API_KEY=your_nasa_api_key
   NASA_TRACKING_ENDPOINT=https://api.nasa.gov/planetary/earth/imagery
   
   # Analytics (optional)
   NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with each push

That's it! Your NASA debris tracking platform should now be running locally.

## 🛠️ Tech Stack

- Next.js 14 with TypeScript
- Tailwind CSS v4
- Radix UI components
- Real-time 3D visualization
- NASA API integration

- **Documentation**: [Live Demo](https://nasa-project-lake.vercel.app/)
