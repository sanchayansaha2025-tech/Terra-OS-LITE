import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Mic, MicOff, Send, Loader2, User, Bot, Volume2 } from 'lucide-react';
import { getGeminiModel } from '../services/gemini';
import { cn } from '../lib/utils';

interface VoiceAssistantProps {
  onBack: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: number;
}

export default function VoiceAssistant({ onBack }: VoiceAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bot', content: "Hello! I'm your Terra-OS AI assistant. You can ask me about crop issues, soil, or market prices. How can I help you today?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async (text?: string) => {
    const query = text || input;
    if (!query.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: query, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const ai = getGeminiModel();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        config: {
          systemInstruction: "You are an expert agricultural assistant. Answer questions simply and clearly for a farmer. Use local context if possible (India)."
        }
      });

      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'bot', content: response.text || "I'm sorry, I couldn't process that.", timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.start();
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSend(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center text-zinc-500 font-medium">
          <ChevronLeft size={18} /> Back
        </button>
        <div className="p-1 px-3 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest">
           AI Expert Live
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
        {messages.map(msg => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "flex w-full mb-2",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "max-w-[85%] p-4 rounded-2xl text-sm relative",
              msg.role === 'user' 
                ? "bg-green-600 text-white rounded-tr-none" 
                : "bg-white border border-zinc-100 text-zinc-700 rounded-tl-none shadow-sm"
            )}>
              {msg.role === 'bot' && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-50">
                   <Bot size={14} className="text-green-500" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Terra AI</span>
                </div>
              )}
              <p className="leading-relaxed">{msg.content}</p>
              <span className={cn(
                "text-[8px] absolute -bottom-4 opacity-50",
                msg.role === 'user' ? "right-1" : "left-1"
              )}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white border border-zinc-100 p-4 rounded-2xl flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-green-500" />
                <span className="text-xs text-zinc-400 font-medium">Analysing your query...</span>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input 
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about farming..."
              className="w-full p-4 rounded-2xl bg-white border border-zinc-100 text-sm outline-none focus:border-green-300 shadow-sm pr-12"
            />
            <button 
              onClick={() => handleSend()}
              className="absolute right-3 top-2.5 p-1.5 bg-green-50 text-green-600 rounded-xl"
            >
              <Send size={18} />
            </button>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={toggleListening}
            className={cn(
              "p-4 rounded-2xl shadow-lg transition-colors border-2",
              isListening ? "bg-red-50 text-red-600 border-red-200" : "bg-green-600 text-white border-green-700"
            )}
          >
            {isListening ? <MicOff size={22} className="animate-pulse" /> : <Mic size={22} />}
          </motion.button>
        </div>
        
        {isListening && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-4 py-2"
          >
             {[1,2,3,4].map(i => (
               <motion.div 
                 key={i}
                 animate={{ height: [10, 30, 10] }}
                 transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                 className="w-1 bg-green-500 rounded-full"
               />
             ))}
             <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Listening...</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
