import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const emoji = { positive: '🟢', neutral: '🟡', negative: '🔴' };

const getEmoji = (text) => {
  const t = text.toLowerCase();
  if (t.includes('impres') || t.includes('appreciat') || t.includes('satisf') || t.includes('delight') || t.includes('overjoyed') || t.includes('excited')) return emoji.positive;
  if (t.includes('concern') || t.includes('wary') || t.includes('nervous') || t.includes('confus') || t.includes('worried') || t.includes('watching')) return emoji.neutral;
  if (t.includes('irritat') || t.includes('frustrat') || t.includes('angry') || t.includes('deep') || t.includes('oppos')) return emoji.negative;
  return emoji.neutral;
};

const StakeholderReactions = ({ reactions, visible }) => {
  if (!reactions || Object.keys(reactions).length === 0) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="mt-4 bg-slate-900/70 border border-slate-700/60 rounded-2xl p-4 space-y-2"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
            🧠 Stakeholder Reactions
          </p>
          {Object.entries(reactions).map(([name, reaction]) => (
            <div key={name} className="flex items-start gap-3 text-sm">
              <span className="text-base shrink-0 mt-0.5">{getEmoji(reaction)}</span>
              <div>
                <span className="font-bold text-slate-300">{name}: </span>
                <span className="text-slate-400 italic">"{reaction}"</span>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StakeholderReactions;
