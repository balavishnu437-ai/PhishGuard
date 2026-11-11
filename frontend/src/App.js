import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticleField } from "@/components/ParticleField";
import Home from "@/pages/Home";
import Scanner from "@/pages/Scanner";
import Dashboard from "@/pages/Dashboard";
import History from "@/pages/History";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import ThreatIntel from "@/pages/ThreatIntel";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/threat-intel" element={<ThreatIntel />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen overflow-x-clip bg-[#060914] font-sans text-slate-300">
        {/* Dynamic Multi-Color Animated Aurora Background & High-Tech Cyber Wallpaper (Fixed z-0 Layer) */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
          {/* Base Dark Foundation */}
          <div className="absolute inset-0 bg-[#060914]" />

          {/* Real High-Definition Cyber Security Wallpaper Background Cover */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{ backgroundImage: `url('/images/cyber-bg.jpg')` }}
          />
          {/* Atmospheric dark gradient overlay to guarantee crystal-clear text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#060914]/55 via-[#060914]/35 to-[#060914]/85" />
          <div className="absolute inset-0 bg-grid opacity-30" />
          
          {/* Animated Multi-Color Glowing Mesh Orbs */}
          {/* 1. Electric Purple / Violet (Top Center-Left) */}
          <div className="animate-orb-1 absolute -top-40 left-1/6 h-[560px] w-[560px] rounded-full bg-gradient-to-br from-purple-600/30 via-indigo-600/20 to-transparent blur-[130px]" />
          
          {/* 2. Neon Cyan / Aqua (Top Right) */}
          <div className="animate-orb-2 absolute -top-20 right-[-80px] h-[520px] w-[520px] rounded-full bg-gradient-to-bl from-cyan-400/30 via-sky-500/20 to-transparent blur-[125px]" />
          
          {/* 3. Hot Magenta / Fuchsia (Center Floating) */}
          <div className="animate-orb-3 absolute top-1/3 left-1/3 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-pink-500/25 via-fuchsia-600/18 to-transparent blur-[140px]" />
          
          {/* 4. Emerald Green / Mint (Bottom Left) */}
          <div className="animate-orb-4 absolute bottom-[-100px] left-[-80px] h-[480px] w-[480px] rounded-full bg-gradient-to-tr from-emerald-500/22 via-teal-500/15 to-transparent blur-[130px]" />
          
          {/* 5. Sunset Amber / Coral (Bottom Right) */}
          <div className="animate-orb-1 absolute bottom-10 right-[-60px] h-[440px] w-[440px] rounded-full bg-gradient-to-tl from-amber-500/20 via-rose-500/15 to-transparent blur-[135px]" />
          
          {/* Subtle Cyber Wave scanline gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.22),rgba(255,255,255,0))]" />
          
          <ParticleField />
        </div>

        {/* Rock-Solid Foreground Content Wrapper (z-10 guarantees zero flickering) */}
        <div className="relative z-10 flex min-h-screen flex-col">
          <ScrollToTop />
          <Navbar />
          <div className="flex-1">
            <AnimatedRoutes />
          </div>
          <Footer />
        </div>

        <Toaster
          position="top-right"
          theme="dark"
          richColors
          toastOptions={{
            style: {
              background: "rgba(10, 17, 34, 0.9)",
              border: "1px solid rgba(0, 240, 255, 0.2)",
              color: "#e2e8f0",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;

