import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ─── Custom Tooltip Skin ──────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 shadow-2xl text-sm">
      <p className="text-slate-400 font-bold mb-2 uppercase tracking-widest text-xs">Step {label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-mono font-semibold">
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

// ─── Single Metric Chart ──────────────────────────────────────────────────────
const MetricChart = ({ data, dataKey, name, color, formatter }) => (
  <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-5">
    <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color }}>
      {name}
    </p>
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="step"
          tick={{ fill: '#64748b', fontSize: 11 }}
          tickLine={false}
          label={{ value: 'Step', position: 'insideBottom', offset: -2, fill: '#475569', fontSize: 10 }}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 11 }}
          tickLine={false}
          tickFormatter={formatter}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey={dataKey}
          name={name}
          stroke={color}
          strokeWidth={2.5}
          dot={{ fill: color, r: 3, strokeWidth: 0 }}
          activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: '#0f172a' }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// ─── Dynamic Insight Generator ────────────────────────────────────────────────
const generateInsights = (history) => {
  if (!history || history.length < 2) return [];
  const insights = [];

  const first = history[0];
  const last = history[history.length - 1];
  const mid = history[Math.floor(history.length / 2)];

  // Impact insight
  const impactGrowth = last.impact - first.impact;
  if (impactGrowth > 20) {
    insights.push({ icon: TrendingUp, color: 'text-emerald-400', text: `Impact grew by ${impactGrowth} points — your initiative created genuine societal value through bold, consistent decisions.` });
  } else if (impactGrowth < 5) {
    insights.push({ icon: TrendingDown, color: 'text-red-400', text: `Impact stagnated (+${impactGrowth}) — consider more proactive community engagement in future runs.` });
  }

  // Risk insight
  const maxRisk = Math.max(...history.map(h => h.risk));
  const riskAtEnd = last.risk;
  if (maxRisk > 70) {
    insights.push({ icon: TrendingDown, color: 'text-orange-400', text: `Risk peaked at ${maxRisk}% — the project was moments away from forced shutdown at its most volatile point.` });
  } else if (riskAtEnd < 30) {
    insights.push({ icon: TrendingUp, color: 'text-emerald-400', text: `Risk stayed controlled at ${riskAtEnd}% by the end — excellent crisis management throughout.` });
  }

  // Budget insight
  const budgetDrop = first.budget - last.budget;
  const budgetDropPct = Math.round((budgetDrop / first.budget) * 100);
  if (budgetDropPct > 60) {
    insights.push({ icon: TrendingDown, color: 'text-amber-400', text: `${budgetDropPct}% of starting capital was spent — heavy investment. Evaluate whether impact justified the expenditure.` });
  } else if (budgetDropPct < 25) {
    insights.push({ icon: TrendingUp, color: 'text-cyan-400', text: `Only ${budgetDropPct}% of capital was used — strong fiscal conservatism preserved long-term sustainability.` });
  }

  // Trust insight
  const trustDelta = last.trust - first.trust;
  if (trustDelta > 20) {
    insights.push({ icon: TrendingUp, color: 'text-blue-400', text: `Stakeholder trust improved by ${trustDelta} points — your collaborative approach built durable relationships.` });
  } else if (trustDelta < -15) {
    insights.push({ icon: TrendingDown, color: 'text-red-400', text: `Trust fell by ${Math.abs(trustDelta)} points — certain decisions alienated key stakeholders along the way.` });
  } else {
    insights.push({ icon: Minus, color: 'text-slate-400', text: `Trust remained relatively stable (${trustDelta > 0 ? '+' : ''}${trustDelta}) — stakeholder alignment was maintained but not deepened.` });
  }

  return insights.slice(0, 3);
};

// ─── Main Component ───────────────────────────────────────────────────────────
const PerformanceCharts = ({ stepHistory }) => {
  const insights = useMemo(() => generateInsights(stepHistory), [stepHistory]);

  if (!stepHistory || stepHistory.length < 2) {
    return (
      <div className="text-center text-slate-500 py-10 text-sm">
        Not enough step data to render analytics.
      </div>
    );
  }

  const budgetFormatter = (v) => v >= 1000000 ? `₹${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`;

  return (
    <div className="mt-10 space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-700/50" />
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">📊 Performance Analysis</h2>
        <div className="h-px flex-1 bg-slate-700/50" />
      </div>

      {/* 4 Line Charts — 2×2 grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricChart data={stepHistory} dataKey="impact" name="Impact" color="#34d399" />
        <MetricChart data={stepHistory} dataKey="budget" name="Budget" color="#fbbf24" formatter={budgetFormatter} />
        <MetricChart data={stepHistory} dataKey="risk"   name="Risk %" color="#f87171" />
        <MetricChart data={stepHistory} dataKey="trust"  name="Trust %" color="#60a5fa" />
      </div>

      {/* Dynamic Insight Cards */}
      {insights.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">🧠 Insight Layer</p>
          <div className="space-y-3">
            {insights.map((ins, i) => {
              const Icon = ins.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4"
                >
                  <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${ins.color}`} />
                  <p className="text-slate-300 text-sm leading-relaxed">{ins.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceCharts;
