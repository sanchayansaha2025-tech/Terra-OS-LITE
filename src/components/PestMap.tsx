import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ChevronLeft, Info, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

import { cn } from '../lib/utils';

// Fix for default marker icons in Leaflet
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Marker.prototype.options.icon = DefaultIcon;

interface PestMapProps {
  onBack: () => void;
}

const MOCK_REPORTS = [
  { id: 1, lat: 30.9010, lng: 75.8573, type: 'Locust', severity: 'high', distance: '12km' },
  { id: 2, lat: 30.9210, lng: 75.8773, type: 'Brown Plant Hopper', severity: 'medium', distance: '8km' },
  { id: 3, lat: 30.8810, lng: 75.8373, type: 'Rice Stem Borer', severity: 'low', distance: '15km' },
];

export default function PestMap({ onBack }: PestMapProps) {
  const [activeReport, setActiveReport] = useState<any>(null);

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between px-1">
        <button onClick={onBack} className="flex items-center text-zinc-500 font-medium">
          <ChevronLeft size={18} /> Back
        </button>
        <div className="flex items-center gap-1 text-red-600 animate-pulse">
           <div className="w-2 h-2 rounded-full bg-red-600" />
           <span className="text-[10px] font-bold uppercase tracking-widest">Live Alerts</span>
        </div>
      </div>

      <div className="card-organic h-[400px] relative z-0 overflow-hidden">
        <MapContainer 
          {...{
            center: [30.9010, 75.8573],
            zoom: 12,
            style: { height: '100%', width: '100%' },
            zoomControl: false
          } as any}
        >
          <TileLayer
            {...{
              url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
              attribution: '&copy; OpenStreetMap contributors'
            } as any}
          />
          {MOCK_REPORTS.map(report => (
            <React.Fragment key={report.id}>
              <Marker 
                position={[report.lat, report.lng]}
                eventHandlers={{
                  click: () => setActiveReport(report),
                }}
              />
              <Circle 
                {...{
                  center: [report.lat, report.lng],
                  radius: 2000,
                  pathOptions: { 
                    color: report.severity === 'high' ? 'red' : report.severity === 'medium' ? 'orange' : 'green',
                    fillOpacity: 0.1 
                  }
                } as any}
              />
            </React.Fragment>
          ))}
        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg z-10 border border-zinc-100">
           <div className="space-y-1.5">
              <LegendItem color="bg-red-500" label="High Risk" />
              <LegendItem color="bg-orange-500" label="Medium" />
              <LegendItem color="bg-green-500" label="Low" />
           </div>
        </div>
      </div>

      {activeReport ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-organic p-5 bg-white space-y-3"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-zinc-900">{activeReport.type}</h3>
              <p className="text-xs text-zinc-400">{activeReport.distance} from your location</p>
            </div>
            <span className={cn(
              "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
              activeReport.severity === 'high' ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
            )}>
              {activeReport.severity} Severity
            </span>
          </div>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Reported by nearby farmers. Wind direction implies movement towards North-East. 
            Ensure prophylactic spray of Chlorpyriphos.
          </p>
          <button 
            onClick={() => setActiveReport(null)}
            className="w-full py-2 bg-zinc-50 text-zinc-500 rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Clear Selection
          </button>
        </motion.div>
      ) : (
        <div className="card-organic p-4 bg-blue-50 border-blue-100 flex gap-3">
          <Info className="text-blue-500 shrink-0" size={20} />
          <p className="text-[11px] text-blue-700 leading-snug">
            Map shows aggregated pest reports from AI scans in your community. Enable GPS for precise localized alerts.
          </p>
        </div>
      )}
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2 h-2 rounded-full", color)} />
      <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-tighter">{label}</span>
    </div>
  );
}
