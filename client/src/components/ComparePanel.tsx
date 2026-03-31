/**
 * ComparePanel — v2 (improved)
 *
 * Key changes from v1:
 *  • Replaced the misleading radar chart with a Small-Multiple Bar Chart grid.
 *    Radar charts distort perception because polygon area scales quadratically
 *    and implies relationships between independent metrics.
 *  • Added a Dumbbell / Range chart for two-firm comparisons to show the gap
 *    between firms on each metric with precise, linear encoding.
 *  • Grouped bar chart is retained but now uses a horizontal layout per metric
 *    for easier cross-firm reading.
 *  • Industry average column highlighted distinctly in the comparison table.
 *  • DPI added alongside TVPI and IRR in the comparison table.
 */
import { useMemo, useState } from "react";
import { VC_DATA, INDUSTRY_BENCHMARKS, type VCFirm } from "@/lib/vcData";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import { X, Info } from "lucide-react";

interface Props {
  compareFirms: string[];
  onToggleCompare: (short: string) => void;
}

const COLORS = ["#0d9488", "#2563eb", "#d97706", "#dc2626", "#7c3aed"];

// ─── Metric definitions for small-multiple grid ────────────────────────────
interface MetricDef {
  key: string;
  label: string;
  unit: string;
  getValue: (f: VCFirm) => number;
  benchmark?: number;
  benchmarkLabel?: string;
  higherIsBetter: boolean;
  description: string;
}

const METRICS: MetricDef[] = [
  {
    key: "aum", label: "AUM", unit: "B",
    getValue: f => f.aum / 1000,
    higherIsBetter: true,
    description: "Assets under management in $B",
  },
  {
    key: "seedMax", label: "Seed Check Max", unit: "M",
    getValue: f => f.seedMax,
    benchmark: INDUSTRY_BENCHMARKS.seedMedianRound,
    benchmarkLabel: "Median",
    higherIsBetter: true,
    description: "Maximum typical seed investment ($M). Larger is not inherently better — depends on founder needs.",
  },
  {
    key: "seriesAMax", label: "Series A Max", unit: "M",
    getValue: f => f.seriesAMax,
    benchmark: INDUSTRY_BENCHMARKS.seriesAMedianRound,
    benchmarkLabel: "Median",
    higherIsBetter: true,
    description: "Maximum typical Series A investment ($M). Larger is not inherently better — depends on founder needs.",
  },
  {
    key: "dealsYr", label: "Deals / Year", unit: "",
    getValue: f => f.dealsYr,
    higherIsBetter: true,
    description: "Approximate number of investments per year",
  },
  {
    key: "gradRate", label: "Graduation Rate", unit: "%",
    getValue: f => f.gradRate,
    benchmark: INDUSTRY_BENCHMARKS.seedGradRate,
    benchmarkLabel: "Industry Avg",
    higherIsBetter: true,
    description: "% of seed portfolio companies that raise a Series A",
  },
  {
    key: "timeNext", label: "Time to Next Round", unit: " mo",
    getValue: f => f.timeNext,
    benchmark: INDUSTRY_BENCHMARKS.medianTimeToSeriesA,
    benchmarkLabel: "Median",
    higherIsBetter: false,
    description: "Median months from seed to Series A",
  },
  {
    key: "markup", label: "Markup Multiple", unit: "x",
    getValue: f => f.markup,
    benchmark: INDUSTRY_BENCHMARKS.medianStepUp,
    benchmarkLabel: "Median",
    higherIsBetter: true,
    description: "Median step-up in valuation at next round",
  },
  {
    key: "dilution", label: "Dilution at Entry", unit: "%",
    getValue: f => f.dilution,
    higherIsBetter: false,
    description: "Typical equity taken at entry. ~10–15% at seed, ~20% at Series A for lead investors.",
  },
];

// ─── Small-Multiple Chart ──────────────────────────────────────────────────
function SmallMultipleChart({
  metric, firms, colors,
}: { metric: MetricDef; firms: VCFirm[]; colors: string[] }) {
  const data = firms.map((f, i) => ({
    name: f.short,
    value: metric.getValue(f),
    color: colors[i],
  })).filter(d => d.value > 0);

  const maxVal = Math.max(...data.map(d => d.value), metric.benchmark ?? 0) * 1.15;

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-2.5 text-xs">
        <span className="font-semibold" style={{ color: d.color }}>{d.name}</span>
        <span className="ml-2 font-mono">{d.value.toFixed(1)}{metric.unit}</span>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start justify-between mb-1">
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{metric.label}</p>
        <div className="group relative">
          <Info className="w-3 h-3 text-muted-foreground/50 cursor-help" />
          <div className="absolute right-0 top-4 z-20 hidden group-hover:block bg-card border border-border rounded p-2 text-[10px] text-muted-foreground w-40 shadow-lg">
            {metric.description}
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} layout="vertical" margin={{ top: 2, right: 30, bottom: 2, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis
            type="number" domain={[0, maxVal]}
            tick={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fill: "#94a3b8" }}
            tickFormatter={v => `${v}${metric.unit}`}
            axisLine={false} tickLine={false}
          />
          <YAxis
            type="category" dataKey="name" width={50}
            tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fill: "#334155" }}
            axisLine={false} tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
          {metric.benchmark != null && (
            <ReferenceLine
              x={metric.benchmark}
              stroke="#94a3b8"
              strokeDasharray="4 3"
              label={{ value: metric.benchmarkLabel, position: "top", style: { fontSize: 8, fill: "#94a3b8" } }}
            />
          )}
          <Bar dataKey="value" radius={[0, 3, 3, 0]} barSize={14}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Dumbbell / Range chart for 2-firm comparison ─────────────────────────
function DumbbellChart({ firms, colors }: { firms: VCFirm[]; colors: string[] }) {
  const metrics = METRICS.filter(m => firms.every(f => m.getValue(f) > 0));

  const data = metrics.map(m => {
    const vals = firms.map(f => m.getValue(f));
    return {
      label: m.label,
      unit: m.unit,
      vals,
      min: Math.min(...vals),
      max: Math.max(...vals),
      gap: Math.abs(vals[0] - vals[1]),
    };
  });

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
        Head-to-Head Gap Analysis
      </p>
      <p className="text-[10px] text-muted-foreground mb-5">
        Each row shows the spread between the two firms. Larger gap = greater differentiation.
      </p>
      <div className="space-y-3">
        {data.map((d, i) => {
          const globalMax = Math.max(...d.vals) * 1.2;
          return (
            <div key={i} className="grid grid-cols-[120px_1fr] gap-3 items-center">
              <span className="text-[10px] font-mono text-muted-foreground truncate">{d.label}</span>
              <div className="relative h-5">
                {/* Background track */}
                <div className="absolute inset-y-0 left-0 right-0 bg-secondary/40 rounded-full" />
                {/* Gap bar */}
                <div
                  className="absolute inset-y-1 rounded-full bg-slate-200"
                  style={{
                    left: `${(d.min / globalMax) * 100}%`,
                    width: `${(d.gap / globalMax) * 100}%`,
                  }}
                />
                {/* Firm dots */}
                {d.vals.map((v, fi) => (
                  <div
                    key={fi}
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                    style={{ left: `calc(${(v / globalMax) * 100}% - 6px)`, backgroundColor: colors[fi] }}
                    title={`${firms[fi].short}: ${v.toFixed(1)}${d.unit}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex gap-4 mt-4">
        {firms.map((f, i) => (
          <div key={f.short} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i] }} />
            <span className="text-[10px] font-mono text-muted-foreground">{f.short}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function ComparePanel({ compareFirms, onToggleCompare }: Props) {
  const [tableExpanded, setTableExpanded] = useState(false);

  const firms = useMemo(
    () => compareFirms.map(s => VC_DATA.find(f => f.short === s)).filter(Boolean) as VCFirm[],
    [compareFirms],
  );

  const availableFirms = VC_DATA.filter(f => !compareFirms.includes(f.short));

  return (
    <div className="space-y-6">
      {/* Firm selector */}
      <div className="flex flex-wrap items-center gap-3">
        {firms.map((f, i) => (
          <div
            key={f.short}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 bg-white shadow-sm"
            style={{ borderColor: COLORS[i] }}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
            <span className="text-sm font-medium">{f.short}</span>
            <span className="text-[9px] text-muted-foreground font-mono">{f.type}</span>
            <button onClick={() => onToggleCompare(f.short)} className="hover:bg-secondary rounded-full p-0.5 ml-1">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {compareFirms.length < 5 && (
          <select
            onChange={e => { if (e.target.value) onToggleCompare(e.target.value); e.target.value = ""; }}
            className="text-sm bg-background border border-dashed border-teal-400 rounded-full px-4 py-1.5 text-muted-foreground hover:border-teal-600 transition-colors"
            defaultValue=""
          >
            <option value="" disabled>+ Add firm to compare</option>
            {availableFirms.map(f => (
              <option key={f.short} value={f.short}>{f.short} — {f.type}</option>
            ))}
          </select>
        )}
      </div>

      {firms.length >= 2 ? (
        <div className="space-y-6">
          {/* Methodology note */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Why small-multiple charts instead of a radar chart?</strong> Radar charts distort
              comparisons because polygon area scales quadratically and implies relationships between
              independent metrics. Each chart below uses a linear bar scale for precise, unambiguous reading.
            </p>
          </div>

          {/* Dumbbell chart (2-firm only) */}
          {firms.length === 2 && (
            <DumbbellChart firms={firms} colors={COLORS} />
          )}

          {/* Small-multiple grid */}
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
              Metric-by-Metric Breakdown
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {METRICS.map(m => (
                <SmallMultipleChart key={m.key} metric={m} firms={firms} colors={COLORS} />
              ))}
            </div>
          </div>

          {/* Detailed comparison table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30 cursor-pointer"
              onClick={() => setTableExpanded(v => !v)}
            >
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Full Comparison Table
              </p>
              <span className="text-xs text-teal-600 font-mono">{tableExpanded ? "▲ Collapse" : "▼ Expand"}</span>
            </div>
            {tableExpanded && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Metric</th>
                      {firms.map((f, i) => (
                        <th key={f.short} className="px-3 py-3 text-right text-[10px] font-mono uppercase tracking-wider" style={{ color: COLORS[i] }}>
                          {f.short}
                        </th>
                      ))}
                      <th className="px-3 py-3 text-right text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-slate-50">
                        Industry Avg
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "AUM", fmt: (f: VCFirm) => `$${(f.aum / 1000).toFixed(0)}B`, bench: "—" },
                      { label: "Latest Fund", fmt: (f: VCFirm) => f.latestFund >= 1000 ? `$${(f.latestFund / 1000).toFixed(1)}B` : `$${f.latestFund}M`, bench: "—" },
                      { label: "Seed Range", fmt: (f: VCFirm) => f.seedMax > 0 ? `$${f.seedMin}–${f.seedMax}M` : "—", bench: `$${INDUSTRY_BENCHMARKS.seedMedianRound}M` },
                      { label: "Series A Range", fmt: (f: VCFirm) => f.seriesAMax > 0 ? `$${f.seriesAMin}–${f.seriesAMax}M` : "—", bench: `$${INDUSTRY_BENCHMARKS.seriesAMedianRound}M` },
                      { label: "Deals/Year", fmt: (f: VCFirm) => `${f.dealsYr}`, bench: "—" },
                      { label: "Graduation Rate", fmt: (f: VCFirm) => f.gradRate > 0 ? `${f.gradRate}%` : "—", bench: `${INDUSTRY_BENCHMARKS.seedGradRate}%` },
                      { label: "Time to Next Round", fmt: (f: VCFirm) => f.timeNext > 0 ? `${f.timeNext} mo` : "—", bench: `${INDUSTRY_BENCHMARKS.medianTimeToSeriesA} mo` },
                      { label: "Markup Multiple", fmt: (f: VCFirm) => f.markup > 0 ? `${f.markup}x` : "—", bench: `${INDUSTRY_BENCHMARKS.medianStepUp}x` },
                      { label: "Dilution at Entry", fmt: (f: VCFirm) => f.dilution > 0 ? `${f.dilution}%` : "—", bench: "~20%" },
                      { label: "Best Fund TVPI", fmt: (f: VCFirm) => f.fundPerformance.length > 0 ? f.fundPerformance[0].tvpi : f.tvpi, bench: `${INDUSTRY_BENCHMARKS.medianTVPI}x` },
                      { label: "Best Fund DPI", fmt: (f: VCFirm) => f.fundPerformance.length > 0 ? f.fundPerformance[0].dpi : "N/A", bench: `${INDUSTRY_BENCHMARKS.medianDPI}x` },
                      { label: "Best Fund IRR", fmt: (f: VCFirm) => f.fundPerformance.length > 0 ? f.fundPerformance[0].irr : f.irr, bench: `${INDUSTRY_BENCHMARKS.topQuartileIRR}% (TQ)` },
                      { label: "Leads Rounds", fmt: (f: VCFirm) => f.founderFit.leadsRounds ? "Yes" : "No", bench: "—" },
                      { label: "Board Seat", fmt: (f: VCFirm) => f.founderFit.boardSeat, bench: "—" },
                      { label: "Ownership Target", fmt: (f: VCFirm) => `${f.founderFit.ownershipTargetMin}–${f.founderFit.ownershipTargetMax}%`, bench: "~15–20%" },
                      { label: "Decision Time", fmt: (f: VCFirm) => f.founderFit.decisionWeeks > 0 ? `${f.founderFit.decisionWeeks} wk` : "Same day", bench: "~3–4 wk" },
                      { label: "Founded", fmt: (f: VCFirm) => `${f.founded}`, bench: "—" },
                      { label: "HQ", fmt: (f: VCFirm) => f.hq, bench: "—" },
                    ].map(row => (
                      <tr key={row.label} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                        <td className="px-4 py-2.5 text-xs text-muted-foreground font-medium">{row.label}</td>
                        {firms.map(f => (
                          <td key={f.short} className="px-3 py-2.5 text-right font-mono text-xs">{row.fmt(f)}</td>
                        ))}
                        <td className="px-3 py-2.5 text-right font-mono text-xs text-slate-400 bg-slate-50">{row.bench}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-card border border-dashed border-teal-300 rounded-lg p-16 text-center">
          <div className="w-12 h-12 rounded-full bg-teal-100 mx-auto mb-4 flex items-center justify-center">
            <span className="text-teal-600 text-lg">+</span>
          </div>
          <p className="text-muted-foreground text-sm mb-2">Select at least 2 firms to compare</p>
          <p className="text-muted-foreground text-xs">Use the checkboxes in the Data Table or add firms above.</p>
        </div>
      )}
    </div>
  );
}
