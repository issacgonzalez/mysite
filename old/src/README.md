# Issac Gonzalez - Portfolio Website

A sophisticated portfolio website for web developer Issac Gonzalez featuring experimental layouts, asymmetrical compositions, creative typography treatments, and innovative navigation patterns that feel more like a digital art piece than a standard portfolio.

## ✨ Features

- **Experimental Design**: Asymmetrical compositions and creative layouts that push boundaries
- **3D Tilt Effects**: Sophisticated interactive elements with depth and dimension
- **Advanced Animations**: Parallax sections with floating particles and smooth transitions
- **Dual Navigation**: Synchronized header and side navigation systems
- **Accessibility First**: Comprehensive accessibility system with reduce motion and light mode options
- **Smart Loading**: Complete loading screen system with animated bull logo
- **Hidden Easter Egg**: Dynamic Convergence page accessible via keyboard shortcut (Ctrl/Cmd + D) or triple-clicking the footer logo
- **Responsive Design**: Fully responsive across all devices
- **Performance Optimized**: Lazy loading, code splitting, and optimized assets

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (formerly Framer Motion)
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Backend**: Supabase (Edge Functions, Auth, Storage, Database)
- **Form Handling**: React Hook Form
- **Charts**: Recharts
- **Meta Tags**: React Helmet Async

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/issac-gonzalez-portfolio.git
cd issac-gonzalez-portfolio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The built files will be in the `dist` directory, ready to be deployed.

## 🎨 Color Palette

The site uses a sophisticated color system with two modes:

- **Light Mode**: Yellow (#f2b43b) accent with clean, bright backgrounds
- **Dark Mode**: Orange (#F89A1C) branding with deep, rich backgrounds

## 🗂️ Project Structure

```
├── components/           # React components
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   ├── data/            # Project data and content
│   ├── hooks/           # Custom React hooks
│   ├── figma/           # Figma-imported components
│   └── my-assets/       # Custom assets
├── styles/              # Global styles and CSS
├── utils/               # Utility functions
├── supabase/            # Supabase configuration and functions
│   └── functions/       # Edge functions
└── guidelines/          # Development guidelines

```

## 🔑 Key Components

- **LoadingScreen**: Animated loading screen with bull logo
- **Header**: Main navigation with accessibility toggle
- **SideNavigation**: Sticky side navigation with section indicators
- **ProjectPage**: Individual project detail pages with sticky breadcrumbs
- **AllProjectsPage**: Grid view of all projects
- **HiddenDynamicConvergencePage**: Easter egg page with special animations
- **AccessibilityProvider**: Global accessibility settings management

## 📄 License

MIT License - feel free to use this project as inspiration for your own portfolio!

## 👤 Author

**Issac Gonzalez**  
Web Developer

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
