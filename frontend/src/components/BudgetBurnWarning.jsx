import React from 'react';
import { AlertTriangle } from 'lucide-react';

const BudgetBurnWarning = ({ currentBudget, initialBudget, stepsCompleted, totalSteps }) => {
  if (stepsCompleted < 2 || initialBudget <= 0) return null;

  const spent = initialBudget - currentBudget;
  const burnPerStep = spent / stepsCompleted;
  const stepsLeft = totalSteps - stepsCompleted;
  const projectedFinalBudget = currentBudget - (burnPerStep * stepsLeft);
  const willRunOut = projectedFinalBudget < 0;
  const stepsUntilZero = burnPerStep > 0 ? Math.floor(currentBudget / burnPerStep) : Infinity;
  const isCritical = stepsUntilZero <= 2 && burnPerStep > 0;
  const isWarning = stepsUntilZero <= 4 && !isCritical && burnPerStep > 0;

  if (!isCritical && !isWarning) return null;

  return (
    <div className={`mt-3 flex items-start gap-2 px-3 py-2 rounded-xl text-xs border ${
      isCritical
        ? 'bg-red-500/10 border-red-500/40 text-red-400'
        : 'bg-amber-500/10 border-amber-500/40 text-amber-400'
    }`}>
      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
      <span>
        {isCritical
          ? `⚠️ Critical: Budget runs out in ~${stepsUntilZero} step${stepsUntilZero === 1 ? '' : 's'}!`
          : `Budget low — ~${stepsUntilZero} steps remaining at current burn rate.`
        }
      </span>
    </div>
  );
};

export default BudgetBurnWarning;
