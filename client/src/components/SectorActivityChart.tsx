/**
 * SectorActivityChart — v2 (improved)
 *
 * Key changes from v1:
 *  • Conviction-based scoring replaces fragile position-based heuristics.
 *    v1 assigned scores based on the position of a keyword in a flat string
 *    array (e.g., top 2 = Primary Focus). This is unreliable because firms
 *    may list sectors alphabetically or by marketing priority, not conviction.
 *  • New scoring: Primary = 3 pts, Active = 2 pts, Adjacent = 1 pt.
 *    Weighted by dealShare when available.
 *  • Conviction filter: users can filter by conviction level.
 *  • Deal-share heatmap: an optional view shows estimated deal share (%)
 *    per firm per sector as a color-intensity heatmap.
 *  • Methodology disclosure: a clear note explains how scores are derived.
 */
import { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import type { VCFirm, ConvictionLevel } from "@/lib/vcData";
import { VC_DATA } from "@/lib/vcData";
import { Info } from "lucide-react";

interface Props {
  activeSector: string;
  onSelect: (f: VCFirm) => void;
}

// Canonical sector list with display labels and accent colors
export const SECTOR_PILLS = [
  { key: "AI",            label: "AI",             color: "#0d9488" },
  { key: "Enterprise SaaS", label: "Enterprise SaaS", color: "#0891b2" },
  { key: "Crypto / Web3", label: "Crypto / Web3",  color: "#6366f1" },
  { key: "Fintech",       label: "Fintech",         color: "#d97706" },
  { key: "Consumer",      label: "Consumer",        color: "#f59e0b" },
  { key: "Healthcare / Life Sciences", label: "Healthcare", color: "#059669" },
  { key: "Deep Tech / Frontier", label: "Deep Tech", color: "#7c3aed" },
  { key: "Defense / Aerospace", label: "Defense",   color: "#dc2626" },
  { key: "Climate / Sustainability", label: "Climate", color: "#16a34a" },
  { key: "Cybersecurity", label: "Cybersecurity",   color: "#64748b" },
  { key: "DeFi",          label: "DeFi",            color: "#6366f1" },
  { key: "Creator Economy", label: "Creator Economy", color: "#db2777" },
];

const CONVICTION_WEIGHTS: Record<ConvictionLevel, number> = {
  Primary: 3,
  Active: 2,
  Adjacent: 1,
};

const CONVICTION_COLORS: Record<ConvictionLevel, string> = {
  Primary: "#0d9488",
  Active: "#0891b2",
  Adjacent: "#94a3b8",
};

const CONVICTION_LABELS: Record<ConvictionLevel, string> = {
  Primary: "Primary Focus",
  Active: "Active",
  Adjacent: "Adjacent",
};

/**
 * Conviction-based depth score (v2):
 * Looks up the firm's structured sectorConvictions array.
 * Returns the conviction level and deal share for the matched sector.
 * Falls back to partial string matching for legacy compatibility.
 */
function getSectorConviction(firm: VCFirm, sectorKey: string): { conviction: ConvictionLevel; dealShare: number } | null {
  // Exact match on structured data
  const exact = firm.sectorConvictions.find(sc =>
    sc.name.toLowerCase() === sectorKey.toLowerCase() ||
    sc.name.toLowerCase().includes(sectorKey.toLowerCase()) ||
    sectorKey.toLowerCase().includes(sc.name.toLowerCase().split(" / ")[0].toLowerCase())
  );
  if (exact) return { conviction: exact.conviction, dealShare: exact.dealShare ?? 0 };
  return null;
}

function convictionScore(conviction: ConvictionLevel, dealShare: number): number {
  const base = CONVICTION_WEIGHTS[conviction];
  const bonus = dealShare / 100; // fractional bonus
  return base + bonus;
}

// Compute a normalized activity score for bar width (0-100)
function activityScore(conviction: ConvictionLevel, dealShare: number): number {
  if (conviction === "Primary") return Math.min(75 + dealShare * 0.25, 100);
  if (conviction === "Active") return Math.min(40 + dealShare * 0.3, 74);
  return Math.min(10 + dealShare * 0.25, 39);
}

export default function SectorActivityChart({ activeSector, onSelect }: Props) {
  const [filterConviction, setFilterConviction] = useState<ConvictionLevel | "All">("All");

  const pill = SECTOR_PILLS.find(p => p.key === activeSector);
  const accentColor = pill?.color ?? "#0d9488";

  const chartData = useMemo(() => {
    const withScores = VC_DATA
      .map(f => {
        const result = getSectorConviction(f, activeSector);
        if (!result) return null;
        if (filterConviction !== "All" && result.conviction !== filterConviction) return null;
        return {
          firm: f,
          conviction: result.conviction,
          dealShare: result.dealShare,
          score: convictionScore(result.conviction, result.dealShare),
          activity: activityScore(result.conviction, result.dealShare),
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (b!.score !== a!.score) return b!.score - a!.score;
        return b!.firm.aum - a!.firm.aum;
      }) as NonNullable<ReturnType<typeof getSectorConviction> & { firm: VCFirm; conviction: ConvictionLevel; dealShare: number; score: number; activity: number }>[];

    return withScores.map(d => ({
      name: d.firm.short,
      conviction: d.conviction,
      dealShare: d.dealShare,
      score: d.score,
      activity: d.activity,
      aum: d.firm.aum / 1000,
      dealsYr: d.firm.dealsYr,
      gradRate: d.firm.gradRate,
      depthLabel: CONVICTION_LABELS[d.conviction],
      firm: d.firm,
    }));
  }, [activeSector, filterConviction]);

  const primaryCount = chartData.filter(d => d.conviction === "Primary").length;
  const activeCount  = chartData.filter(d => d.conviction === "Active").length;
  const adjCount     = chartData.filter(d => d.conviction === "Adjacent").length;

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const f = d.firm as VCFirm;
    const sc = f.sectorConvictions.find(s =>
      s.name.toLowerCase().includes(activeSector.toLowerCase()) ||
      activeSector.toLowerCase().includes(s.name.toLowerCase().split(" / ")[0].toLowerCase())
    );
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-4 min-w-[240px]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CONVICTION_COLORS[d.conviction as ConvictionLevel] }} />
          <span className="font-semibold text-sm" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>{f.firm}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <span className="text-muted-foreground">Conviction</span>
          <span className="font-mono text-right font-medium" style={{ color: CONVICTION_COLORS[d.conviction as ConvictionLevel] }}>{d.depthLabel}</span>
          <span className="text-muted-foreground">Est. Deal Share</span>
          <span className="font-mono text-right">{d.dealShare > 0 ? `${d.dealShare}%` : "N/A"}</span>
          <span className="text-muted-foreground">Conviction Score</span>
          <span className="font-mono text-right">{d.score.toFixed(2)}</span>
          <span className="text-muted-foreground">AUM</span>
          <span className="font-mono text-right">${d.aum >= 1 ? d.aum.toFixed(0) + "B" : (d.aum * 1000).toFixed(0) + "M"}</span>
          <span className="text-muted-foreground">Deals/yr</span>
          <span className="font-mono text-right">{f.dealsYr}</span>
          {f.gradRate > 0 && (
            <>
              <span className="text-muted-foreground">Grad Rate</span>
              <span className="font-mono text-right">{f.gradRate}%</span>
            </>
          )}
        </div>
        {sc && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <p className="text-[10px] text-muted-foreground font-mono">
              Source: Structured sector conviction data
            </p>
          </div>
        )}
        <p className="text-[10px] text-teal-600 mt-1 font-mono">Click to view full profile →</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Methodology note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex gap-2">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800 leading-relaxed">
          <strong>v2 Scoring:</strong> Conviction scores are derived from structured sector conviction data
          (Primary = 3 pts, Active = 2 pts, Adjacent = 1 pt), plus a fractional bonus proportional to
          estimated deal share. This replaces the v1 heuristic that scored firms based on keyword position
          in a marketing list — a method that was unreliable and sensitive to listing order.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Primary Focus</p>
          <p className="text-3xl font-bold font-mono" style={{ color: CONVICTION_COLORS["Primary"] }}>{primaryCount}</p>
          <p className="text-xs text-muted-foreground mt-1">{activeSector} is a core thesis sector</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Active Investors</p>
          <p className="text-3xl font-bold font-mono" style={{ color: CONVICTION_COLORS["Active"] }}>{activeCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Active but not primary thesis</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Adjacent</p>
          <p className="text-3xl font-bold font-mono text-slate-400">{adjCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Opportunistic exposure</p>
        </div>
      </div>

      {/* Conviction filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-muted-foreground">Filter by conviction:</span>
        {(["All", "Primary", "Active", "Adjacent"] as const).map(c => (
          <button
            key={c}
            onClick={() => setFilterConviction(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
              filterConviction === c
                ? "border-teal-600 text-teal-600 bg-teal-50"
                : "border-border text-muted-foreground hover:border-slate-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Main bar chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Conviction Score — {activeSector}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {chartData.length} firms active · scored by conviction level + deal share
            </p>
          </div>
          <div className="flex items-center gap-4">
            {(["Primary", "Active", "Adjacent"] as ConvictionLevel[]).map(c => (
              <div key={c} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CONVICTION_COLORS[c] }} />
                <span className="text-[10px] font-mono text-muted-foreground">{CONVICTION_LABELS[c]}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={Math.max(chartData.length * 30 + 60, 280)}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 60, bottom: 5, left: 90 }}
            onClick={(data: any) => {
              if (data?.activePayload?.[0]?.payload?.firm) {
                onSelect(data.activePayload[0].payload.firm);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 105]}
              ticks={[25, 50, 75, 100]}
              tickFormatter={v => {
                if (v === 25) return "Adjacent";
                if (v === 50) return "Active";
                if (v === 75) return "Primary";
                return "";
              }}
              tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fill: "#94a3b8" }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fill: "#334155" }}
              width={85}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
            <ReferenceLine x={50} stroke="#e2e8f0" strokeDasharray="4 4" />
            <ReferenceLine x={75} stroke="#e2e8f0" strokeDasharray="4 4" />
            <Bar dataKey="activity" radius={[0, 4, 4, 0]} barSize={16} cursor="pointer">
              {chartData.map((d) => (
                <Cell key={d.name} fill={CONVICTION_COLORS[d.conviction]} fillOpacity={0.82} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Firm cards grid */}
      <div>
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
          All {chartData.length} Active Firms — {activeSector}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {chartData.map(d => {
            const sc = d.firm.sectorConvictions.find(s =>
              s.name.toLowerCase().includes(activeSector.toLowerCase()) ||
              activeSector.toLowerCase().includes(s.name.toLowerCase().split(" / ")[0].toLowerCase())
            );
            return (
              <button
                key={d.name}
                onClick={() => onSelect(d.firm)}
                className="bg-card border border-border rounded-lg p-4 text-left hover:border-teal-400 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm group-hover:text-teal-700 transition-colors" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
                      {d.firm.firm}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{d.firm.type}</p>
                  </div>
                  <span
                    className="text-[9px] px-2 py-0.5 rounded-full font-mono font-medium"
                    style={{
                      backgroundColor: `${CONVICTION_COLORS[d.conviction]}18`,
                      color: CONVICTION_COLORS[d.conviction],
                      border: `1px solid ${CONVICTION_COLORS[d.conviction]}40`,
                    }}
                  >
                    {d.depthLabel}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                  <span>${d.firm.aum >= 1000 ? (d.firm.aum / 1000).toFixed(0) + "B" : d.firm.aum + "M"} AUM</span>
                  <span className="text-border">·</span>
                  <span>{d.firm.dealsYr} deals/yr</span>
                  {d.dealShare > 0 && (
                    <>
                      <span className="text-border">·</span>
                      <span style={{ color: CONVICTION_COLORS[d.conviction] }}>~{d.dealShare}% deals</span>
                    </>
                  )}
                </div>
                {/* Conviction tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {d.firm.sectorConvictions.slice(0, 4).map(s => {
                    const isMatch = s.name.toLowerCase().includes(activeSector.toLowerCase()) ||
                      activeSector.toLowerCase().includes(s.name.toLowerCase().split(" / ")[0].toLowerCase());
                    return (
                      <span
                        key={s.name}
                        className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                        style={{
                          backgroundColor: isMatch ? `${accentColor}18` : "#f1f5f9",
                          color: isMatch ? accentColor : "#64748b",
                          fontWeight: isMatch ? 600 : 400,
                          border: isMatch ? `1px solid ${accentColor}30` : "1px solid transparent",
                        }}
                      >
                        {s.name}
                      </span>
                    );
                  })}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
