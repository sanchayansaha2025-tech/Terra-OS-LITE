import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Camera, 
  Map as MapIcon, 
  Sprout, 
  TrendingUp, 
  BookOpen, 
  Mic,
  AlertTriangle,
  ChevronRight,
  Plus
} from 'lucide-react';
import { cn } from './lib/utils';

// Lazy load components? Maybe just simple state for now.
import Dashboard from './components/Dashboard';
import DiseaseDetection from './components/DiseaseDetection';
import PestMap from './components/PestMap';
import SoilHealth from './components/SoilHealth';
import ProfitCalculator from './components/ProfitCalculator';
import Schemes from './components/Schemes';
import VoiceAssistant from './components/VoiceAssistant';

type ActiveScreen = 'dashboard' | 'disease' | 'map' | 'soil' | 'profit' | 'schemes' | 'voice';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard': return <Dashboard onNavigate={setActiveScreen} />;
      case 'disease': return <DiseaseDetection onBack={() => setActiveScreen('dashboard')} />;
      case 'map': return <PestMap onBack={() => setActiveScreen('dashboard')} />;
      case 'soil': return <SoilHealth onBack={() => setActiveScreen('dashboard')} />;
      case 'profit': return <ProfitCalculator onBack={() => setActiveScreen('dashboard')} />;
      case 'schemes': return <Schemes onBack={() => setActiveScreen('dashboard')} />;
      case 'voice': return <VoiceAssistant onBack={() => setActiveScreen('dashboard')} />;
      default: return <Dashboard onNavigate={setActiveScreen} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#F8FAF7] relative overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-6 pb-2 flex justify-between items-center z-10">
        <h1 className="text-2xl font-bold tracking-tight text-forest-900">Terra-OS<span className="text-green-600 font-light ml-1">Lite</span></h1>
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <Sprout size={18} className="text-green-600" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24 overflow-y-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bottom-nav-blur border-t border-zinc-100 px-6 py-4 z-50 flex justify-between items-center">
        <NavButton active={activeScreen === 'dashboard'} icon={<Home size={22} />} onClick={() => setActiveScreen('dashboard')} />
        <NavButton active={activeScreen === 'map'} icon={<MapIcon size={22} />} onClick={() => setActiveScreen('map')} />
        
        {/* Central Action */}
        <button 
          onClick={() => setActiveScreen('disease')}
          className={cn(
            "w-14 h-14 rounded-full bg-green-600 flex items-center justify-center -mt-10 shadow-lg shadow-green-200 border-4 border-white transition-transform active:scale-95",
            activeScreen === 'disease' ? "bg-green-700" : ""
          )}
        >
          <Camera size={24} className="text-white" />
        </button>

        <NavButton active={activeScreen === 'profit'} icon={<TrendingUp size={22} />} onClick={() => setActiveScreen('profit')} />
        <NavButton active={activeScreen === 'voice'} icon={<Mic size={22} />} onClick={() => setActiveScreen('voice')} />
      </nav>
    </div>
  );
}

function NavButton({ active, icon, onClick }: { active: boolean, icon: React.ReactNode, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-2 rounded-xl transition-all duration-300",
        active ? "text-green-600 bg-green-50" : "text-zinc-400"
      )}
    >
      {icon}
    </button>
  );
}
