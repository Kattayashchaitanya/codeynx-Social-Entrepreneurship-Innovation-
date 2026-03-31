import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, Info, ExternalLink } from 'lucide-react';

const GovernmentPolicyCard = ({ policy }) => {
  if (!policy) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-slate-900/80 border-2 border-indigo-500/30 rounded-3xl p-6 mb-6 overflow-hidden relative group"
    >
      {/* Background Seal Accent */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
        <Landmark size={120} />
      </div>

      <div className="flex items-start gap-4 relative z-10">
        <div className="bg-indigo-500/20 p-3 rounded-2xl border border-indigo-500/30">
          <Landmark className="w-6 h-6 text-indigo-400" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400/80 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
              Active Regulatory Context
            </span>
            <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
              <Info size={10} /> Public Policy
            </span>
          </div>
          
          <h3 className="text-lg font-bold text-slate-100 mb-2">
            {policy.title}
          </h3>
          
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            {policy.description}
          </p>

          {policy.impactSummary && (
            <div className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-3 flex items-start gap-3">
              <div className="text-amber-500 mt-0.5">
                <ExternalLink size={14} />
              </div>
              <p className="text-xs text-amber-200/70 italic leading-snug">
                <strong>Strategic Impact:</strong> {policy.impactSummary}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GovernmentPolicyCard;
