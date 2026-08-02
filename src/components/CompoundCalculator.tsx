import React, { useState } from 'react';
import { TrendingUp, Sparkles, Award, Zap, Code, ShieldCheck, RefreshCw } from 'lucide-react';

export const CompoundCalculator: React.FC = () => {
  const [days, setDays] = useState<number>(365);
  const [dailyRate, setDailyRate] = useState<number>(1.01); // 1% default

  // Math: Rate^Days
  const compoundResult = Math.pow(dailyRate, days);
  const baselineResult = 1.0;
  const declineResult = Math.pow(0.99, days);

  // Generate SVG curve points for days
  const pointsCount = 30;
  const step = Math.max(1, Math.floor(days / pointsCount));
  
  const generateSvgPoints = (rate: number) => {
    const coords: { x: number; y: number }[] = [];
    const width = 600;
    const height = 220;
    const maxVal = Math.max(38, Math.pow(rate, days));

    for (let i = 0; i <= days; i += step) {
      const val = Math.pow(rate, i);
      const x = (i / days) * (width - 40) + 20;
      const y = height - 20 - (val / maxVal) * (height - 40);
      coords.push({ x, y });
    }

    return coords.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  };

  const getPercentageChange = () => {
    const pct = (dailyRate - 1) * 100;
    if (pct > 0) return `+${pct.toFixed(1)}% daily improvement`;
    if (pct < 0) return `${pct.toFixed(1)}% daily decline`;
    return '0% change (Stagnant)';
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Banner */}
      <div className="relative rounded-3xl p-6 lg:p-8 bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border border-indigo-500/30 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Power of Atomic Compounding</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            "1% Better Every Day = 37.78x Better in 1 Year"
          </h1>
          
          <p className="text-gray-300 text-sm leading-relaxed">
            Habits are the compound interest of self-improvement. Just as money multiplies through compound interest, the effects of your habits multiply as you repeat them in Computer Science and software engineering.
          </p>
        </div>
      </div>

      {/* Interactive Controls & Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Controls Card */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Simulator Parameters</span>
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Adjust daily effort and timeline to observe exponential divergence.
            </p>

            {/* Slider 1: Daily Rate */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300 font-semibold">Daily Effort Level:</span>
                <span className="font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                  {getPercentageChange()}
                </span>
              </div>
              <input
                type="range"
                min="0.95"
                max="1.05"
                step="0.005"
                value={dailyRate}
                onChange={(e) => setDailyRate(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>0.95x (-5%)</span>
                <span>1.00x (0%)</span>
                <span>1.01x (+1%)</span>
                <span>1.05x (+5%)</span>
              </div>
            </div>

            {/* Slider 2: Days */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300 font-semibold">Time Horizon:</span>
                <span className="font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  {days} Days ({ (days / 365).toFixed(1) } yrs)
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="365"
                step="5"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>30d</span>
                <span>90d</span>
                <span>180d</span>
                <span>365d</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setDailyRate(1.01); setDays(365); }}
            className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Classic 1% / 365d</span>
          </button>
        </div>

        {/* Compound Multiplier Outcome Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* 1% Better Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-indigo-950/40 border border-indigo-500/40 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-indigo-400 font-mono">1.01^{days}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">+1% Daily</span>
              </div>
              <p className="text-xs text-gray-400">Compounded Growth</p>
              <div className="text-3xl lg:text-4xl font-extrabold text-white font-mono my-3">
                {compoundResult.toFixed(2)}x
              </div>
            </div>
            <p className="text-[11px] text-indigo-200/90 leading-tight border-t border-indigo-500/20 pt-3">
              Small improvements accumulate exponentially over time into remarkable mastery.
            </p>
          </div>

          {/* Stagnant Card */}
          <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-gray-400 font-mono">1.00^{days}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-800 text-gray-400">0% Daily</span>
              </div>
              <p className="text-xs text-gray-400">Baseline Stagnation</p>
              <div className="text-3xl lg:text-4xl font-extrabold text-gray-400 font-mono my-3">
                {baselineResult.toFixed(2)}x
              </div>
            </div>
            <p className="text-[11px] text-gray-500 leading-tight border-t border-gray-800 pt-3">
              Doing nothing new leaves you exactly where you started.
            </p>
          </div>

          {/* 1% Worse Card */}
          <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-rose-400 font-mono">0.99^{days}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-500/30">-1% Daily</span>
              </div>
              <p className="text-xs text-gray-400">Compounded Decline</p>
              <div className="text-3xl lg:text-4xl font-extrabold text-rose-400 font-mono my-3">
                {declineResult.toFixed(2)}x
              </div>
            </div>
            <p className="text-[11px] text-rose-300/80 leading-tight border-t border-rose-500/20 pt-3">
              Slips and excuses erode skills down toward near zero over time.
            </p>
          </div>

        </div>
      </div>

      {/* Exponential Curve Graph Visualizer */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span>Exponential Curve Visualizer</span>
            </h3>
            <p className="text-xs text-gray-400">Comparing 1.01^n vs 1.00^n vs 0.99^n trajectory over time</p>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-3 h-1 bg-indigo-500 rounded" /> 1% Better
            </span>
            <span className="flex items-center gap-1.5 text-gray-400">
              <span className="w-3 h-1 bg-gray-500 rounded" /> Baseline
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-3 h-1 bg-rose-500 rounded" /> 1% Worse
            </span>
          </div>
        </div>

        {/* SVG Graph Container */}
        <div className="w-full overflow-x-auto bg-[#0b0f19] p-4 rounded-2xl border border-gray-800/80">
          <svg viewBox="0 0 600 220" className="w-full h-48 lg:h-60 overflow-visible">
            {/* Grid lines */}
            <line x1="20" y1="20" x2="580" y2="20" stroke="#1f2937" strokeDasharray="3,3" />
            <line x1="20" y1="70" x2="580" y2="70" stroke="#1f2937" strokeDasharray="3,3" />
            <line x1="20" y1="120" x2="580" y2="120" stroke="#1f2937" strokeDasharray="3,3" />
            <line x1="20" y1="170" x2="580" y2="170" stroke="#1f2937" strokeDasharray="3,3" />
            <line x1="20" y1="200" x2="580" y2="200" stroke="#374151" strokeWidth="1.5" />

            {/* Baseline Line */}
            <polyline
              fill="none"
              stroke="#6b7280"
              strokeWidth="2"
              strokeDasharray="4,4"
              points={generateSvgPoints(1.0)}
            />

            {/* Decline Line */}
            <polyline
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2.5"
              points={generateSvgPoints(0.99)}
            />

            {/* Growth Line */}
            <polyline
              fill="none"
              stroke="#6366f1"
              strokeWidth="3.5"
              points={generateSvgPoints(dailyRate)}
            />
          </svg>
        </div>
      </div>

      {/* Real-World Computer Science Compounding Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Code className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">1 DSA Problem / Day</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Solving just 1 problem per day equals <span className="text-cyan-300 font-bold">365 algorithms solved</span> in a year. You will comfortably master pattern recognition for top-tier software interviews.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">10 Pages Technical Book / Day</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Reading 10 pages of software architecture daily yields <span className="text-indigo-300 font-bold">3,650 pages</span> per year (~12 to 15 classic engineering books like DDIA, Clean Code, Pragmatic Programmer).
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">1 Clean Commit / Day</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Shipping 1 tested feature or module commit daily creates <span className="text-emerald-300 font-bold">365 solid contributions</span> on your GitHub profile, establishing a top 1% developer portfolio.
          </p>
        </div>

      </div>

    </div>
  );
};
