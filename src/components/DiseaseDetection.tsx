import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, Upload, ChevronLeft, Loader2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { detectCropDisease } from '../services/gemini';
import { DiseaseDetectionResult } from '../types';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';

interface DiseaseDetectionProps {
  onBack: () => void;
}

export default function DiseaseDetection({ onBack }: DiseaseDetectionProps) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseDetectionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64Data = image.split(',')[1];
      const res = await detectCropDisease(base64Data);
      setResult(res);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze image. Please try again.");
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
        <h2 className="text-2xl font-bold text-zinc-900">Crop Guardian</h2>
        <p className="text-sm text-zinc-500">Scan your crop to detect diseases instantly.</p>
      </div>

      <div className="card-organic relative aspect-[4/3] flex items-center justify-center bg-zinc-50 overflow-hidden group">
        {image ? (
          <>
            <img src={image} alt="Crop scan" className="w-full h-full object-cover" />
            {!loading && !result && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-white rounded-full shadow-lg">
                  <RefreshCw className="text-green-600" />
                </button>
              </div>
            )}
          </>
        ) : (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-3 text-zinc-400"
          >
            <div className="p-5 bg-white rounded-full shadow-sm">
              <Camera size={32} className="text-green-600" />
            </div>
            <span className="text-sm font-medium">Take Photo or Upload</span>
          </button>
        )}
        <input 
          type="file" 
          accept="image/*" 
          capture="environment"
          ref={fileInputRef}
          onChange={handleCapture}
          className="hidden" 
        />
      </div>

      {image && !result && !loading && (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleAnalyze}
          className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-100 flex items-center justify-center gap-2"
        >
          Analyze Scan
        </motion.button>
      )}

      {loading && (
        <div className="flex flex-col items-center gap-3 py-6">
          <Loader2 className="text-green-600 animate-spin" size={32} />
          <p className="text-sm font-medium text-zinc-500">Gemini is analyzing your crop...</p>
        </div>
      )}

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 pb-12"
        >
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-zinc-100 shadow-sm">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
              result.severity === 'high' ? "bg-red-50 text-red-600" : 
              result.severity === 'medium' ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"
            )}>
              {result.severity === 'low' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 capitalize">{result.diseaseName}</h3>
              <p className={cn(
                "text-xs font-bold uppercase tracking-wider",
                result.severity === 'high' ? "text-red-500" : 
                result.severity === 'medium' ? "text-amber-500" : "text-green-500"
              )}>
                Severity: {result.severity}
              </p>
            </div>
          </div>

          <div className="card-organic p-5 space-y-3">
            <h4 className="font-bold text-sm text-zinc-900 border-b pb-2">Recommended Treatment</h4>
            <div className="text-sm text-zinc-600 leading-relaxed prose prose-sm max-w-none">
              <Markdown>{result.treatment}</Markdown>
            </div>
          </div>

          <button 
            onClick={() => {setImage(null); setResult(null);}}
            className="w-full py-3 border-2 border-zinc-100 text-zinc-500 rounded-2xl font-bold"
          >
            Scan Another Crop
          </button>
        </motion.div>
      )}
    </div>
  );
}
