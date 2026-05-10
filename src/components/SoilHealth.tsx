import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Info, Sprout, Loader2, CheckCircle2, TrendingDown } from 'lucide-react';
import { analyzeSoil } from '../services/gemini';
import { SoilHealthResult } from '../types';
import { cn } from '../lib/utils';

interface SoilHealthProps {
  onBack: () => void;
}

export default function SoilHealth({ onBack }: SoilHealthProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SoilHealthResult | null>(null);
  const [form, setForm] = useState({
    location: 'Ludhiana, Punjab',
    soilFeel: '',
    irrigation: '',
    currentCrop: ''
  });

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const answers = `Soil feel: ${form.soilFeel}, Irrigation: ${form.irrigation}, Current crop: ${form.currentCrop}`;
      const res = await analyzeSoil(form.location, answers);
      setResult(res);
      setStep(3);
    } catch (error) {
      console.error(error);
      alert("Analysis failed.");
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
        <h2 className="text-2xl font-bold text-zinc-900">Soil Intelligence</h2>
        <p className="text-sm text-zinc-500">Estimating soil health using observational intelligence.</p>
      </div>

      {step === 1 && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5"
        >
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">Quick Survey</h4>
            
            <div className="space-y-3">
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-tight">How does the soil feel?</label>
              <div className="grid grid-cols-2 gap-3">
                {['Sandy & Loose', 'Hard & Clay', 'Moist & Rich', 'Dry & Cracked'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => setForm({...form, soilFeel: opt})}
                    className={cn(
                      "p-4 rounded-2xl border text-sm transition-all",
                      form.soilFeel === opt ? "bg-green-50 border-green-200 text-green-700 shadow-sm" : "bg-white border-zinc-100 text-zinc-600"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-tight">Irrigation Source</label>
              <select 
                value={form.irrigation}
                onChange={e => setForm({...form, irrigation: e.target.value})}
                className="w-full p-4 rounded-2xl border border-zinc-100 bg-white text-sm outline-none focus:border-green-300"
              >
                <option value="">Select source</option>
                <option value="Canal">Canal Water</option>
                <option value="Tube-well">Tube-well</option>
                <option value="Rainfed">Rainfed Only</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-tight">Current/Planned Crop</label>
              <input 
                type="text"
                placeholder="e.g. Rice, Wheat, Cotton"
                value={form.currentCrop}
                onChange={e => setForm({...form, currentCrop: e.target.value})}
                className="w-full p-4 rounded-2xl border border-zinc-100 bg-white text-sm outline-none focus:border-green-300"
              />
            </div>
          </div>

          <button 
            disabled={!form.soilFeel || !form.irrigation || !form.currentCrop}
            onClick={() => setStep(2)}
            className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-100 disabled:opacity-50"
          >
            Review Analysis
          </button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 pt-4 text-center"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <Sprout size={40} className={cn("text-green-600", loading ? "animate-bounce" : "")} />
          </div>
          <h3 className="text-xl font-bold">Ready for Soil Intel?</h3>
          <p className="text-sm text-zinc-500 px-6">Gemini will analyze your observations against regional soil data to estimate nutrient levels.</p>
          
          <div className="pt-6 space-y-3">
            <button 
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : "Start AI Analysis"}
            </button>
            <button onClick={() => setStep(1)} className="text-zinc-400 text-sm font-medium">Edit Observations</button>
          </div>
        </motion.div>
      )}

      {step === 3 && result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5 pb-12"
        >
          <div className="card-organic p-6 flex flex-col items-center text-center space-y-2">
             <div className="w-24 h-24 rounded-full border-8 border-green-50 flex items-center justify-center relative">
                <span className="text-3xl font-black text-green-600">{result.healthScore}</span>
                <span className="absolute -bottom-2 bg-green-600 text-white text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Score</span>
             </div>
             <h3 className="font-bold text-lg pt-2">{result.soilType} Soil</h3>
             <p className="text-xs text-zinc-400 uppercase font-medium">Health Status: {result.healthScore > 70 ? 'Excellent' : 'Needs Care'}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <NutrientCard label="N" value={result.nutrientStatus.nitrogen} />
            <NutrientCard label="P" value={result.nutrientStatus.phosphorus} />
            <NutrientCard label="K" value={result.nutrientStatus.potassium} />
          </div>

          <div className="card-organic p-5 space-y-4">
             <h4 className="font-bold text-sm text-zinc-900 border-b pb-2">Recommendations</h4>
             <ul className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-3 text-sm text-zinc-600">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                    {rec}
                  </li>
                ))}
             </ul>
          </div>

          <button onClick={() => setStep(1)} className="w-full py-4 border-2 border-zinc-100 text-zinc-400 rounded-2xl font-bold">New Assessment</button>
        </motion.div>
      )}
    </div>
  );
}

function NutrientCard({ label, value }: { label: string, value: string }) {
  const isLow = value.toLowerCase() === 'low';
  return (
    <div className={cn("p-3 rounded-2xl border", isLow ? "bg-amber-50 border-amber-100" : "bg-white border-zinc-100")}>
       <span className="text-[10px] font-bold text-zinc-400">{label}</span>
       <p className={cn("text-xs font-bold mt-1 uppercase", isLow ? "text-amber-600" : "text-green-600")}>{value}</p>
    </div>
  );
}
