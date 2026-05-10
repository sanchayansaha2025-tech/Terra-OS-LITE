import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Info, TrendingUp, DollarSign, Loader2, ArrowUpRight, AlertTriangle } from 'lucide-react';
import { predictProfit } from '../services/gemini';
import { ProfitPrediction } from '../types';
import { cn } from '../lib/utils';

interface ProfitCalculatorProps {
  onBack: () => void;
}

export default function ProfitCalculator({ onBack }: ProfitCalculatorProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProfitPrediction | null>(null);
  const [data, setData] = useState({
    crop: 'Rice',
    landSize: 5,
    soilHealth: 75,
    riskLevel: 'Medium'
  });

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await predictProfit(data);
      setResult(res);
    } catch (error) {
      console.error(error);
      alert("Profit prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center text-zinc-500 font-medium">
        <ChevronLeft size={18} /> Back
      </button>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-zinc-900">Profit Predictor</h2>
        <p className="text-sm text-zinc-500">Estimate your returns based on market & risk intel.</p>
      </div>

      {!result ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="card-organic p-6 space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Select Crop</label>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                {['Rice', 'Wheat', 'Sugarcane', 'Maize', 'Cotton'].map(c => (
                  <button 
                    key={c}
                    onClick={() => setData({...data, crop: c})}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                      data.crop === c ? "bg-green-600 text-white border-green-600 shadow-sm" : "bg-zinc-50 text-zinc-500 border-transparent"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Land Size (Acres): {data.landSize}</label>
              <input 
                type="range" min="1" max="50" value={data.landSize}
                onChange={e => setData({...data, landSize: parseInt(e.target.value)})}
                className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>

            <div className="space-y-3">
               <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Local Risk Level</label>
               <div className="grid grid-cols-3 gap-2">
                 {['Low', 'Medium', 'High'].map(r => (
                   <button 
                     key={r}
                     onClick={() => setData({...data, riskLevel: r})}
                     className={cn(
                       "py-3 rounded-xl text-[10px] uppercase font-bold border transition-all",
                       data.riskLevel === r ? "bg-zinc-100 border-zinc-800 text-zinc-900" : "bg-white border-zinc-100 text-zinc-400"
                     )}
                   >
                     {r}
                   </button>
                 ))}
               </div>
            </div>
          </div>

          <button 
            disabled={loading}
            onClick={handlePredict}
            className="w-full py-4 bg-green-600 text-white rounded-3xl font-bold shadow-lg shadow-green-100 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <>Calculate Expected ROI <ArrowUpRight size={18}/></>}
          </button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 pb-12">
           <div className="card-organic p-6 bg-gradient-to-br from-green-600 to-emerald-700 text-white border-0">
             <p className="text-[10px] font-bold uppercase tracking-widest text-green-100">Estimated Net Profit</p>
             <h3 className="text-4xl font-black mt-2">₹{result.totalProfit.toLocaleString('en-IN')}</h3>
             <div className="flex gap-4 mt-6 pt-6 border-t border-white/20">
               <div className="space-y-1">
                 <p className="text-[8px] uppercase tracking-widest text-green-100">Yield / Acre</p>
                 <p className="text-sm font-bold">{result.estimatedYield} Quintals</p>
               </div>
               <div className="space-y-1">
                 <p className="text-[8px] uppercase tracking-widest text-green-100">Market Price</p>
                 <p className="text-sm font-bold">₹{result.estimatedPrice} / Q</p>
               </div>
             </div>
           </div>

           <div className="card-organic p-4 border-amber-100 bg-amber-50 flex gap-3">
              <AlertTriangle className="text-amber-600 shrink-0" size={20} />
              <div className="space-y-1">
                <h5 className="text-[10px] font-bold text-amber-900 uppercase tracking-widest">Risk Advisory</h5>
                <p className="text-[11px] text-amber-700 leading-snug">{result.riskWarning}</p>
              </div>
           </div>

           <div className="card-organic p-5 space-y-3">
              <h4 className="font-bold text-sm text-zinc-900">Optimization Strategy</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">{result.suggestions}</p>
           </div>

           <button onClick={() => setResult(null)} className="w-full py-4 border-2 border-zinc-100 text-zinc-400 rounded-2xl font-bold">Adjust Parameters</button>
        </motion.div>
      )}
    </div>
  );
}
