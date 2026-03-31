import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight } from 'lucide-react';

const emojiMap = { positive: '🟢', neutral: '🟡', negative: '🔴' };

const getEmoji = (text) => {
  const t = text.toLowerCase();
  if (t.includes('impres') || t.includes('appreciat') || t.includes('satisf') || t.includes('delight') || t.includes('overjoyed') || t.includes('excited') || t.includes('good')) return emojiMap.positive;
  if (t.includes('concern') || t.includes('wary') || t.includes('nervous') || t.includes('confus') || t.includes('worried') || t.includes('watching') || t.includes('wait')) return emojiMap.neutral;
  if (t.includes('irritat') || t.includes('frustrat') || t.includes('angry') || t.includes('deep') || t.includes('oppos') || t.includes('risk') || t.includes('bad')) return emojiMap.negative;
  return emojiMap.neutral;
};

const StakeholderReactions = ({ reactions, onContinue }) => {
  const reactionEntries = Object.entries(reactions || {});

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900/60 rounded-3xl border border-indigo-500/30 p-8 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Immediate Feedback</h4>
          <p className="text-xl font-bold text-white">Stakeholder Reactions</p>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        {reactionEntries.length > 0 ? (
          reactionEntries.map(([name, reaction]) => (
            <motion.div 
              key={name} 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <span className="text-2xl shrink-0">{getEmoji(reaction)}</span>
              <div>
                <p className="font-bold text-indigo-300 text-sm mb-1 uppercase tracking-wide">{name}</p>
                <p className="text-slate-200 italic leading-relaxed">"{reaction}"</p>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-slate-500 text-center py-4 italic">The stakeholders are silent... for now.</p>
        )}
      </div>

      <div className="flex justify-center border-t border-slate-800/50 pt-8 mt-4">
        <button
          onClick={onContinue}
          className="group relative flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
        >
          <span>Continue to Next Step</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 rounded-2xl ring-2 ring-indigo-500/50 ring-offset-4 ring-offset-slate-950 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </motion.div>
  );
};

export default StakeholderReactions;
