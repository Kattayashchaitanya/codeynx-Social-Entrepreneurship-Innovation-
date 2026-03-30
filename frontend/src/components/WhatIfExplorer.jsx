import React from 'react';
import { GitBranch, CheckCircle2, XCircle } from 'lucide-react';

const confidenceLabel = (c) => c === 1 ? '😰 Low' : c === 2 ? '🤔 Medium' : c === 3 ? '💪 High' : '—';

const WhatIfExplorer = ({ decisions }) => {
  const explorable = (decisions || []).filter(d => d.allOptions && d.allOptions.length > 1);
  if (explorable.length === 0) return null;

  return (
    <div className="mt-10 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-700/50" />
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">🔀 What-If Branch Explorer</h2>
        <div className="h-px flex-1 bg-slate-700/50" />
      </div>

      <div className="space-y-4">
        {explorable.map((d, i) => {
          const chosen = d.option;
          const alternatives = (d.allOptions || []).filter(o => o.id !== chosen?.id);
          return (
            <div key={i} className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                Step {d.step + 1}
                {d.confidence && (
                  <span className="ml-3 text-slate-600">· Confidence: {confidenceLabel(d.confidence)}</span>
                )}
              </p>

              {/* Chosen path */}
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-emerald-300 mb-1">You chose:</p>
                  <p className="text-slate-300 text-sm">{chosen?.text}</p>
                  {chosen?.effects && (
                    <p className="text-xs text-slate-500 mt-1 font-mono">
                      Impact {chosen.effects.impact > 0 ? '+' : ''}{chosen.effects.impact} · Budget {chosen.effects.budgetPercentage > 0 ? '+' : ''}{chosen.effects.budgetPercentage}% · Risk {chosen.effects.risk > 0 ? '+' : ''}{chosen.effects.risk} · Trust {chosen.effects.trust > 0 ? '+' : ''}{chosen.effects.trust}
                    </p>
                  )}
                </div>
              </div>

              {/* Alternatives */}
              {alternatives.map((alt, j) => (
                <div key={j} className="flex items-start gap-3 pl-2 border-l border-slate-700 ml-2.5">
                  <GitBranch className="w-4 h-4 text-indigo-400 shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-semibold text-indigo-400 mb-1">If you had chosen:</p>
                    <p className="text-slate-400 text-sm">{alt.text}</p>
                    {alt.effects && (
                      <p className="text-xs text-slate-600 mt-1 font-mono">
                        Impact {alt.effects.impact > 0 ? '+' : ''}{alt.effects.impact} · Budget {alt.effects.budgetPercentage > 0 ? '+' : ''}{alt.effects.budgetPercentage}% · Risk {alt.effects.risk > 0 ? '+' : ''}{alt.effects.risk} · Trust {alt.effects.trust > 0 ? '+' : ''}{alt.effects.trust}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WhatIfExplorer;
