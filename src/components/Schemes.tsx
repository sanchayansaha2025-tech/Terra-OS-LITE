import React from 'react';
import { ChevronLeft, ExternalLink, Bookmark, Search, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface SchemesProps {
  onBack: () => void;
}

const SCHEMES = [
  {
    id: 1,
    title: "PM-KISAN Samman Nidhi",
    benefit: "₹6,000 / Year direct transfer",
    eligibility: "All land-holding farmer families",
    category: "Financial Support"
  },
  {
    id: 2,
    title: "PM Fasal Bima Yojana",
    benefit: "Low-premium insurance for all crops",
    eligibility: "Farmers with crops in notified areas",
    category: "Insurance"
  },
  {
    id: 3,
    title: "Kisan Credit Card (KCC)",
    benefit: "Easy loans up to ₹3L at 4% interest",
    eligibility: "All farmers, including tenant farmers",
    category: "Credit"
  },
  {
    id: 4,
    title: "National Mission for Sustainable Agriculture",
    benefit: "Subsidies on drip/sprinkler irrigation",
    eligibility: "Farmers adopting micro-irrigation",
    category: "Infrastructure"
  }
];

export default function Schemes({ onBack }: SchemesProps) {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center text-zinc-500 font-medium">
        <ChevronLeft size={18} /> Back
      </button>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-zinc-900">Smart Schemes</h2>
        <p className="text-sm text-zinc-500">Government support tailored to your profile.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-zinc-300" size={18} />
        <input 
          type="text" 
          placeholder="Search schemes..." 
          className="w-full p-4 pl-12 rounded-2xl bg-white border border-zinc-100 text-sm outline-none focus:border-green-300 shadow-sm"
        />
      </div>

      <div className="space-y-4">
        {SCHEMES.map((scheme, idx) => (
          <motion.div 
            key={scheme.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card-organic p-5 space-y-4"
          >
            <div className="flex justify-between items-start">
               <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-50 text-green-700 uppercase tracking-wider">{scheme.category}</span>
               <button className="text-zinc-300 hover:text-green-600"><Bookmark size={18} /></button>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-bold text-zinc-900">{scheme.title}</h3>
              <p className="text-sm font-semibold text-green-600">{scheme.benefit}</p>
            </div>

            <div className="pt-3 border-t border-zinc-50 flex justify-between items-center">
              <div className="flex items-center gap-2 text-zinc-400">
                <Award size={14} />
                <span className="text-[10px] font-medium max-w-[150px] truncate">{scheme.eligibility}</span>
              </div>
              <button className="flex items-center gap-1 text-xs font-bold text-zinc-900 uppercase tracking-widest">
                Apply <ExternalLink size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pb-12 text-center">
         <p className="text-[10px] text-zinc-400">Data provided by Ministry of Agriculture & FW</p>
      </div>
    </div>
  );
}
