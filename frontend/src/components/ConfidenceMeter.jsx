import React from 'react';

const levels = [
  { id: 1, label: 'Low',    emoji: '😰', color: 'border-red-500/60 bg-red-500/10 text-red-400' },
  { id: 2, label: 'Medium', emoji: '🤔', color: 'border-amber-500/60 bg-amber-500/10 text-amber-400' },
  { id: 3, label: 'High',   emoji: '💪', color: 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400' },
];

const ConfidenceMeter = ({ value, onChange }) => (
  <div className="mt-6 pt-5 border-t border-slate-800">
    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 text-center">
      How confident are you in this decision?
    </p>
    <div className="flex gap-2 justify-center">
      {levels.map(l => (
        <button
          key={l.id}
          onClick={() => onChange(l.id)}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl border text-xs font-bold transition-all
            ${value === l.id ? l.color : 'border-slate-700 text-slate-500 hover:bg-slate-800'}`}
        >
          <span className="text-lg">{l.emoji}</span>
          <span>{l.label}</span>
        </button>
      ))}
    </div>
  </div>
);

export default ConfidenceMeter;
