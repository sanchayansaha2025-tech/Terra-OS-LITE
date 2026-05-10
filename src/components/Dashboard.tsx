import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertCircle, 
  MapPin, 
  Droplets, 
  ArrowUpRight, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  CloudSun
} from 'lucide-react';

import { cn } from '../lib/utils';

interface DashboardProps {
  onNavigate: (screen: any) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="space-y-6 pt-2">
      {/* Weather/Stat Banner */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="card-organic p-5 bg-gradient-to-br from-green-600 to-green-700 text-white border-0"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-green-100 text-sm font-medium">Ludhiana, Punjab</p>
            <h2 className="text-3xl font-bold mt-1">28°C <span className="text-lg font-light">Cloudy</span></h2>
          </div>
          <CloudSun size={32} className="text-green-100" />
        </div>
        <div className="mt-4 flex gap-4 text-xs font-medium uppercase tracking-wider">
          <div className="flex items-center gap-1">
            <Droplets size={12} /> 65% Humidity
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp size={12} /> 0% Rain
          </div>
        </div>
      </motion.div>

      {/* Critical Alert */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        onClick={() => onNavigate('map')}
        className="card-organic p-4 border-red-100 bg-red-50 flex items-center gap-3 cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <AlertCircle className="text-red-600" size={20} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-red-900 leading-tight">Locust Alert Nearby</h4>
          <p className="text-xs text-red-700 mt-0.5">High risk detected 12km West.</p>
        </div>
        <ChevronRight size={18} className="text-red-400" />
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-4">
        <MenuCard 
          icon={<Droplets className="text-blue-500" />} 
          title="Soil Health" 
          subtitle="Check nutrients" 
          onClick={() => onNavigate('soil')}
        />
        <MenuCard 
          icon={<TrendingUp className="text-orange-500" />} 
          title="Yield Forecast" 
          subtitle="Profit estimation" 
          onClick={() => onNavigate('profit')}
        />
        <MenuCard 
          icon={<ShieldCheck className="text-indigo-500" />} 
          title="Govt Schemes" 
          subtitle="New benefits" 
          onClick={() => onNavigate('schemes')}
        />
        <MenuCard 
          icon={<MapPin className="text-red-500" />} 
          title="Pest Map" 
          subtitle="Live outbreaks" 
          onClick={() => onNavigate('map')}
        />
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <h3 className="font-bold text-zinc-900 px-1">Recent Checks</h3>
        <div className="space-y-2">
          <ActivityItem 
            title="Rice Leaf Blast Scan" 
            status="Healthy" 
            time="2h ago" 
            color="green" 
          />
          <ActivityItem 
            title="Soil Analysis" 
            status="Low Nitrogen" 
            time="Yesterday" 
            color="amber" 
          />
        </div>
      </div>
    </div>
  );
}

function MenuCard({ icon, title, subtitle, onClick }: { icon: React.ReactNode, title: string, subtitle: string, onClick: () => void }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="card-organic p-4 cursor-pointer hover:bg-zinc-50 transition-colors"
    >
      <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h4 className="text-sm font-bold text-zinc-900">{title}</h4>
      <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-tight">{subtitle}</p>
    </motion.div>
  );
}

function ActivityItem({ title, status, time, color }: { title: string, status: string, time: string, color: 'green' | 'amber' | 'red' }) {
  const colorMap = {
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700"
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-zinc-100">
      <div>
        <h5 className="text-xs font-bold text-zinc-800">{title}</h5>
        <p className="text-[10px] text-zinc-400 mt-0.5">{time}</p>
      </div>
      <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full", colorMap[color])}>
        {status}
      </span>
    </div>
  );
}
