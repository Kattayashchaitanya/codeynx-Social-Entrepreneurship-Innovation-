import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Zap } from 'lucide-react';

const CrisisEventModal = ({ crisis, onDismiss }) => (
  <AnimatePresence>
    {crisis && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 0.85, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.85, y: 30 }}
          className="relative w-full max-w-md bg-red-950/80 border border-red-500/50 rounded-3xl p-8 shadow-[0_0_60px_rgba(239,68,68,0.3)] text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-3xl pointer-events-none" />

          <div className="flex justify-center mb-4">
            <div className="bg-red-500/20 p-4 rounded-full border border-red-500/40">
              <AlertOctagon className="w-10 h-10 text-red-400" />
            </div>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-400/80 mb-2">
            ⚡ Crisis Event
          </p>
          <h2 className="text-2xl font-bold text-white mb-4">{crisis.title}</h2>
          <p className="text-slate-300 leading-relaxed mb-6 text-sm">{crisis.description}</p>

          <div className="grid grid-cols-2 gap-3 mb-6 text-xs font-mono">
            {crisis.effect.impact !== 0 && (
              <div className="bg-slate-900/60 rounded-xl p-3">
                <p className="text-slate-400">Impact</p>
                <p className={`text-lg font-bold ${crisis.effect.impact > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {crisis.effect.impact > 0 ? '+' : ''}{crisis.effect.impact}
                </p>
              </div>
            )}
            {crisis.effect.budgetPercentage !== 0 && (
              <div className="bg-slate-900/60 rounded-xl p-3">
                <p className="text-slate-400">Budget</p>
                <p className={`text-lg font-bold ${crisis.effect.budgetPercentage > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {crisis.effect.budgetPercentage > 0 ? '+' : ''}{crisis.effect.budgetPercentage}%
                </p>
              </div>
            )}
            {crisis.effect.risk !== 0 && (
              <div className="bg-slate-900/60 rounded-xl p-3">
                <p className="text-slate-400">Risk</p>
                <p className={`text-lg font-bold ${crisis.effect.risk > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {crisis.effect.risk > 0 ? '+' : ''}{crisis.effect.risk}%
                </p>
              </div>
            )}
            {crisis.effect.trust !== 0 && (
              <div className="bg-slate-900/60 rounded-xl p-3">
                <p className="text-slate-400">Trust</p>
                <p className={`text-lg font-bold ${crisis.effect.trust > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {crisis.effect.trust > 0 ? '+' : ''}{crisis.effect.trust}%
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onDismiss}
            className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Zap className="w-4 h-4" /> Absorb & Continue
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default CrisisEventModal;
