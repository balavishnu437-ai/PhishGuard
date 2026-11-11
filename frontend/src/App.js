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
      <div className="relative min-h-screen overflow-x-clip bg-night font-sans text-slate-300">
        <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-grid" />
          <div className="absolute -top-44 left-1/4 h-[480px] w-[480px] rounded-full bg-cyan-500/10 blur-[140px]" />
          <div className="absolute right-[-120px] top-1/3 h-[460px] w-[460px] rounded-full bg-blue-600/10 blur-[150px]" />
          <div className="absolute bottom-[-80px] left-[-80px] h-[400px] w-[400px] rounded-full bg-emerald-500/[0.07] blur-[140px]" />
          <ParticleField />
        </div>
        <ScrollToTop />
        <Navbar />
        <AnimatedRoutes />
        <Footer />
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

