import React from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { motion } from 'framer-motion';

const levels = [
  { id: 'Low',    label: 'Low',    emoji: '😰', description: 'Very Uncertain', color: 'border-red-500/60 bg-red-500/20 text-red-400 hover:bg-red-500/30' },
  { id: 'Medium', label: 'Medium', emoji: '🤔', description: 'Measured Risk', color: 'border-amber-500/60 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' },
  { id: 'High',   label: 'High',   emoji: '💪', description: 'Fully Committed', color: 'border-emerald-500/60 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' },
];

const ConfidenceMeter = ({ optionText, onSelect, onCancel }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-slate-900/40 rounded-3xl border border-indigo-500/30 p-8 shadow-2xl relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-4">
      <button onClick={onCancel} className="p-2 text-slate-500 hover:text-white transition-colors">
        <X className="w-5 h-5" />
      </button>
    </div>

    <div className="flex items-start gap-4 mb-8 pr-10">
      <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Confirm Your Strategy</h4>
        <p className="text-xl font-medium text-white leading-relaxed italic">"{optionText}"</p>
      </div>
    </div>

    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 text-center">
      How confident are you in this decision?
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {levels.map(l => (
        <button
          key={l.id}
          onClick={() => onSelect(l.id)}
          className={`flex flex-col items-center gap-2 p-6 rounded-2xl border transition-all hover:scale-105 active:scale-95 group ${l.color}`}
        >
          <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">{l.emoji}</span>
          <span className="font-bold text-sm uppercase tracking-wide">{l.label}</span>
          <span className="text-[10px] opacity-60 uppercase font-mono tracking-tighter">{l.description}</span>
        </button>
      ))}
    </div>
  </motion.div>
);

export default ConfidenceMeter;
