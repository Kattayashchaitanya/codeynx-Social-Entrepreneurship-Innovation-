import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Zap } from 'lucide-react';

const CrisisEventModal = ({ event, onResolve }) => (
  <AnimatePresence>
    {event && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 shadow-2xl"
      >
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
        <motion.div
          initial={{ scale: 0.8, y: 40, rotateX: 20 }}
          animate={{ scale: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative w-full max-w-md bg-gradient-to-b from-red-900 to-slate-900 border border-red-500/50 rounded-[2.5rem] p-10 shadow-[0_0_80px_rgba(239,68,68,0.4)] text-center overflow-hidden"
        >
          {/* Pulsing Background Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/20 blur-[80px] rounded-full animate-pulse" />
          
          <div className="flex justify-center mb-6">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-red-500/20 p-5 rounded-full border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
            >
              <AlertOctagon className="w-12 h-12 text-red-500" />
            </motion.div>
          </div>

          <p className="text-xs font-black uppercase tracking-[0.4em] text-red-500 mb-2">
            System Emergency
          </p>
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight leading-tight">{event.title}</h2>
          <p className="text-slate-300 leading-relaxed mb-8 text-sm font-medium">{event.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {Object.entries(event.effects || {}).map(([key, val]) => {
              if (val === 0) return null;
              const isNegative = val < 0;
              return (
                <div key={key} className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-colors hover:border-white/20">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{key}</p>
                  <p className={`text-xl font-black ${isNegative ? 'text-red-400' : 'text-emerald-400'}`}>
                    {val > 0 ? '+' : ''}{val}{key.toLowerCase().includes('percentage') || key === 'risk' || key === 'trust' ? '%' : ''}
                  </p>
                </div>
              );
            })}
          </div>

          <button
            onClick={onResolve}
            className="group relative w-full bg-red-600 hover:bg-red-500 text-white py-5 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-[0_10px_20px_rgba(220,38,38,0.3)] flex items-center justify-center gap-3"
          >
            <Zap className="w-6 h-6 fill-current" />
            <span>AUTHORIZE MITIGATION</span>
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default CrisisEventModal;
