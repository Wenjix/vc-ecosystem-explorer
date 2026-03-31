import { useMemo, useState } from "react";
import type { VCFirm } from "@/lib/vcData";
import { INDUSTRY_BENCHMARKS } from "@/lib/vcData";

interface Props {
  data: VCFirm[];
  onSelect: (f: VCFirm) => void;
}

export default function CheckSizeChart({ data, onSelect }: Props) {
  const [mode, setMode] = useState<"seed" | "seriesA">("seed");

  const chartData = useMemo(() => {
    const filtered = mode === "seed"
      ? data.filter(f => f.seedMax > 0).sort((a, b) => (b.seedMin + b.seedMax) / 2 - (a.seedMin + a.seedMax) / 2)
      : data.filter(f => f.seriesAMax > 0).sort((a, b) => (b.seriesAMin + b.seriesAMax) / 2 - (a.seriesAMin + a.seriesAMax) / 2);

    return filtered.map(f => ({
      name: f.short,
      min: mode === "seed" ? f.seedMin : f.seriesAMin,
      max: mode === "seed" ? f.seedMax : f.seriesAMax,
      avg: mode === "seed" ? (f.seedMin + f.seedMax) / 2 : (f.seriesAMin + f.seriesAMax) / 2,
      firm: f,
    }));
  }, [data, mode]);

  const median = mode === "seed" ? INDUSTRY_BENCHMARKS.seedMedianRound : INDUSTRY_BENCHMARKS.seriesAMedianRound;
  const maxVal = Math.max(...chartData.map(d => d.max), median * 1.2);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Toggle */}
      <div className="flex gap-2 mb-6">
        {(["seed", "seriesA"] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${
              mode === m ? "bg-teal-600 text-white shadow-sm" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {m === "seed" ? "Seed" : "Series A"}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
          <div className="w-3 h-0.5 bg-red-400" />
          Industry Median ${median}M
        </div>
      </div>

      {/* Custom bar chart */}
      <div className="space-y-1.5">
        {chartData.map(d => {
          const minPct = (d.min / maxVal) * 100;
          const maxPct = (d.max / maxVal) * 100;
          const medianPct = (median / maxVal) * 100;
          const aboveMedian = d.avg > median;

          return (
            <div
              key={d.name}
              className="flex items-center gap-3 py-1.5 px-2 rounded hover:bg-teal-50/50 cursor-pointer transition-colors group"
              onClick={() => onSelect(d.firm)}
            >
              <span className="text-xs font-mono w-20 text-right text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                {d.name}
              </span>
              <div className="flex-1 relative h-5">
                {/* Median line */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-red-400 z-10"
                  style={{ left: `${medianPct}%` }}
                />
                {/* Range bar */}
                <div
                  className="absolute top-1 bottom-1 rounded-sm transition-all"
                  style={{
                    left: `${minPct}%`,
                    width: `${maxPct - minPct}%`,
                    backgroundColor: aboveMedian ? "#0d9488" : "#94a3b8",
                    opacity: 0.7,
                  }}
                />
                {/* Average dot */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white z-20"
                  style={{
                    left: `${(d.avg / maxVal) * 100}%`,
                    backgroundColor: aboveMedian ? "#0f766e" : "#64748b",
                  }}
                />
              </div>
              <span className="text-[10px] font-mono w-16 text-muted-foreground shrink-0">
                ${d.min}-{d.max}M
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground mt-6 font-mono">
        Teal = above industry median. Gray = at or below. Bars show min-max range, dots show average. Click any row for details.
      </p>
    </div>
  );
}
