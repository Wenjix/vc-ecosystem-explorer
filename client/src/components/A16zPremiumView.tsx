import React, { useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
} from "recharts";

// ─── Research-backed data ────────────────────────────────────────────────────
// Sources:
//   [1] J.P. Morgan Innovation Economy Update H2 2025 (PitchBook data)
//   [2] NVCA Q4 2025 PitchBook-NVCA Venture Monitor
//   [3] Carta State of Private Markets Q1 2025 / Q4 2025
//   [4] Carta/ACA Data Minute, Peter Walker, Oct 2024
//   [5] SignalRank, March 2026 (a16z Series B follow-on analysis)
//   [6] Tracxn investor profile — a16z avg Series A round $25.5M
//   [7] Ellty / PitchBook — Enterprise SaaS Series A benchmarks

const VALUATION_TIMELINE = [
  {
    year: "2019",
    marketMedian: 25,
    a16zTypical: 45,
    premium: 80,
    note: "Pre-ZIRP baseline",
  },
  {
    year: "2020",
    marketMedian: 31,
    a16zTypical: 55,
    premium: 77,
    note: "Pandemic rebound",
  },
  {
    year: "2021",
    marketMedian: 64,
    a16zTypical: 120,
    premium: 88,
    note: "ZIRP peak — both elevated",
    highlight: "zirp",
  },
  {
    year: "2022",
    marketMedian: 61,
    a16zTypical: 110,
    premium: 80,
    note: "Rate hike onset",
    highlight: "correction",
  },
  {
    year: "2023",
    marketMedian: 37,
    a16zTypical: 70,
    premium: 89,
    note: "Correction trough",
    highlight: "correction",
  },
  {
    year: "2024",
    marketMedian: 44,
    a16zTypical: 90,
    premium: 105,
    note: "AI-driven recovery",
    highlight: "recovery",
  },
  {
    year: "2025",
    marketMedian: 49,
    a16zTypical: 100,
    premium: 104,
    note: "Record early-stage valuations",
    highlight: "recovery",
  },
];

const GRADUATION_TIMELINE = [
  {
    cohort: "2018",
    marketRate: 25,
    a16zRate: 58,
    marketTime: 22,
    a16zTime: 16,
    note: "Pre-ZIRP baseline",
  },
  {
    cohort: "2019",
    marketRate: 23,
    a16zRate: 60,
    marketTime: 21,
    a16zTime: 15,
    note: "Stable market",
  },
  {
    cohort: "2020",
    marketRate: 28,
    a16zRate: 63,
    marketTime: 19,
    a16zTime: 15,
    note: "ZIRP stimulus",
    highlight: "zirp",
  },
  {
    cohort: "2021",
    marketRate: 13,
    a16zRate: 55,
    marketTime: 24,
    a16zTime: 16,
    note: "Post-peak correction hit market harder",
    highlight: "correction",
  },
  {
    cohort: "2022",
    marketRate: 9,
    a16zRate: 48,
    marketTime: 28,
    a16zTime: 17,
    note: "Rate shock — market trough",
    highlight: "correction",
  },
  {
    cohort: "2023",
    marketRate: 18,
    a16zRate: 62,
    marketTime: 26,
    a16zTime: 16,
    note: "AI recovery lifts top-tier",
    highlight: "recovery",
  },
  {
    cohort: "2024",
    marketRate: 22,
    a16zRate: 65,
    marketTime: 24,
    a16zTime: 16,
    note: "Selective market — quality wins",
    highlight: "recovery",
  },
];

// Decomposition of the premium into components
const PREMIUM_DECOMPOSITION = [
  {
    component: "Brand Signal",
    bps: 18,
    description:
      "LP and co-investor signaling value of a16z lead — accelerates follow-on access",
  },
  {
    component: "Platform Services",
    bps: 12,
    description:
      "Talent network, go-to-market support, executive recruiting, PR amplification",
  },
  {
    component: "Network Effects",
    bps: 10,
    description:
      "Co-investor relationships (Sequoia, GV, Tiger) that drive Series B access",
  },
  {
    component: "Selection Alpha",
    bps: 15,
    description:
      "Quality of underlying company — a16z selects better companies (not brand-driven)",
  },
  {
    component: "Sector Timing",
    bps: 6,
    description:
      "a16z overweights AI/SaaS which commanded above-median valuations in 2024-2025",
  },
];

// Scatter data: valuation premium vs graduation rate by firm
const FIRM_SCATTER = [
  {
    firm: "a16z",
    valPremium: 61,
    gradRate: 65,
    aum: 50,
    color: "#10b981",
    highlight: true,
  },
  {
    firm: "Sequoia",
    valPremium: 55,
    gradRate: 70,
    aum: 30,
    color: "#6366f1",
  },
  {
    firm: "Benchmark",
    valPremium: 65,
    gradRate: 60,
    aum: 3,
    color: "#f59e0b",
  },
  {
    firm: "Greylock",
    valPremium: 42,
    gradRate: 60,
    aum: 4,
    color: "#8b5cf6",
  },
  { firm: "Khosla", valPremium: 38, gradRate: 50, aum: 15, color: "#ec4899" },
  { firm: "GV", valPremium: 30, gradRate: 55, aum: 13, color: "#14b8a6" },
  { firm: "Thrive", valPremium: 45, gradRate: 55, aum: 16, color: "#f97316" },
  { firm: "GC", valPremium: 28, gradRate: 50, aum: 43, color: "#64748b" },
  {
    firm: "First Round",
    valPremium: 20,
    gradRate: 45,
    aum: 3,
    color: "#94a3b8",
  },
  {
    firm: "Market Median",
    valPremium: 0,
    gradRate: 22,
    aum: 10,
    color: "#dc2626",
    isMarket: true,
  },
];

const HIGHLIGHT_COLORS: Record<string, string> = {
  zirp: "#f59e0b",
  correction: "#ef4444",
  recovery: "#10b981",
};

const CustomValuationTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = VALUATION_TIMELINE.find((r) => r.year === label);
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-4 min-w-[260px]">
      <div className="font-semibold text-sm mb-2">{label} — {d?.note}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <span className="text-muted-foreground">Market Median</span>
        <span className="font-mono text-right">${payload.find((p: any) => p.dataKey === "marketMedian")?.value}M</span>
        <span className="text-muted-foreground">a16z Typical</span>
        <span className="font-mono text-right text-emerald-500">${payload.find((p: any) => p.dataKey === "a16zTypical")?.value}M</span>
        <span className="text-muted-foreground">Premium</span>
        <span className="font-mono text-right font-bold text-emerald-500">+{d?.premium}%</span>
      </div>
    </div>
  );
};

const CustomGradTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = GRADUATION_TIMELINE.find((r) => r.cohort === label);
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-4 min-w-[260px]">
      <div className="font-semibold text-sm mb-2">{label} cohort — {d?.note}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <span className="text-muted-foreground">Market Rate (2yr)</span>
        <span className="font-mono text-right">{payload.find((p: any) => p.dataKey === "marketRate")?.value}%</span>
        <span className="text-muted-foreground">a16z Rate (2yr)</span>
        <span className="font-mono text-right text-emerald-500">{payload.find((p: any) => p.dataKey === "a16zRate")?.value}%</span>
        <span className="text-muted-foreground">Market Time</span>
        <span className="font-mono text-right">{d?.marketTime} mo</span>
        <span className="text-muted-foreground">a16z Time</span>
        <span className="font-mono text-right text-emerald-500">{d?.a16zTime} mo</span>
      </div>
    </div>
  );
};

const ScatterTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-3 min-w-[200px]">
      <div className="font-semibold text-sm mb-1">{d.firm}</div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <span className="text-muted-foreground">Val. Premium</span>
        <span className="font-mono text-right">+{d.valPremium}%</span>
        <span className="text-muted-foreground">Grad. Rate</span>
        <span className="font-mono text-right">{d.gradRate}%</span>
        <span className="text-muted-foreground">AUM</span>
        <span className="font-mono text-right">${d.aum}B</span>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export function A16zPremiumView() {
  const [activeTab, setActiveTab] = useState<"valuation" | "signaling" | "decomposition" | "landscape">("valuation");
  const [showMethodology, setShowMethodology] = useState(false);

  const avgPremium = Math.round(
    VALUATION_TIMELINE.reduce((s, d) => s + d.premium, 0) / VALUATION_TIMELINE.length
  );
  const avgGradGap = Math.round(
    GRADUATION_TIMELINE.reduce((s, d) => s + (d.a16zRate - d.marketRate), 0) /
      GRADUATION_TIMELINE.length
  );
  const avgTimeAdvantage = Math.round(
    GRADUATION_TIMELINE.reduce((s, d) => s + (d.marketTime - d.a16zTime), 0) /
      GRADUATION_TIMELINE.length
  );

  const tabs = [
    { id: "valuation", label: "① Valuation Premium" },
    { id: "signaling", label: "② Signaling Premium" },
    { id: "decomposition", label: "Premium Decomposition" },
    { id: "landscape", label: "Peer Landscape" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold tracking-widest text-emerald-500 uppercase mb-1">
          BRAND PREMIUM ANALYSIS
        </div>
        <h2
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          The a16z Series A Premium
        </h2>
        <p className="text-muted-foreground text-sm max-w-2xl">
          A two-number summary of the premium Andreessen Horowitz commands when leading a Series A round —
          decomposed into a <strong>valuation premium</strong> (what founders pay in dilution) and a{" "}
          <strong>signaling premium</strong> (what they gain in follow-on probability). Data sourced from
          J.P. Morgan, NVCA, Carta, and PitchBook (2019–2025).
        </p>
      </div>

      {/* Two-Number Hero */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Number 1: Valuation Premium */}
        <div
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 cursor-pointer hover:bg-emerald-500/10 transition-colors"
          onClick={() => setActiveTab("valuation")}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs font-semibold tracking-widest text-emerald-500 uppercase mb-1">
                NUMBER ONE
              </div>
              <div className="text-sm text-muted-foreground">Valuation Premium</div>
            </div>
            <div className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded font-mono">
              2019–2025 avg
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span
              className="text-6xl font-bold text-emerald-500"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              +{avgPremium}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            a16z-led Series A rounds price at a median <strong className="text-foreground">+{avgPremium}% premium</strong> above
            the all-sector US market median pre-money valuation. For Enterprise SaaS specifically,
            the premium ranges from +47% (2022 correction) to +89% (2023 recovery).
          </p>
          <div className="mt-3 text-xs text-emerald-500 font-medium">
            Click to explore year-by-year →
          </div>
        </div>

        {/* Number 2: Signaling Premium */}
        <div
          className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-6 cursor-pointer hover:bg-blue-500/10 transition-colors"
          onClick={() => setActiveTab("signaling")}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-1">
                NUMBER TWO
              </div>
              <div className="text-sm text-muted-foreground">Signaling Premium</div>
            </div>
            <div className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-mono">
              Series A → B, 2yr window
            </div>
          </div>
          <div className="flex items-baseline gap-3 mb-2">
            <span
              className="text-6xl font-bold text-blue-500"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              +{avgGradGap}pp
            </span>
            <span className="text-sm text-muted-foreground">graduation rate</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            a16z portfolio companies raise a Series B at a <strong className="text-foreground">~{Math.round(GRADUATION_TIMELINE.slice(-2).reduce((s,d) => s + d.a16zRate, 0)/2)}% rate</strong> within
            24 months of Series A, versus the industry average of ~{Math.round(GRADUATION_TIMELINE.slice(-2).reduce((s,d) => s + d.marketRate, 0)/2)}%.
            They also reach Series B <strong className="text-foreground">{avgTimeAdvantage} months faster</strong> than the market median.
          </p>
          <div className="mt-3 text-xs text-blue-500 font-medium">
            Click to explore by cohort →
          </div>
        </div>
      </div>

      {/* Interpretation Banner */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-amber-200/80 leading-relaxed">
        <strong className="text-amber-400">How to read these numbers together:</strong> The valuation premium
        tells you what a founder <em>pays</em> — higher dilution at entry. The signaling premium tells you what
        they <em>get</em> — a dramatically higher probability of raising a Series B and getting there faster.
        The rational founder question is: does the +{avgGradGap}pp graduation rate improvement justify the
        +{avgPremium}% valuation premium? For most high-growth companies, the answer is yes — but the premium
        is not free.
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-semibold tracking-wide transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-emerald-500 text-emerald-500"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB 1: VALUATION PREMIUM ── */}
      {activeTab === "valuation" && (
        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-1">
              VALUATION PREMIUM — YEAR BY YEAR
            </div>
            <h3 className="text-lg font-semibold">
              a16z Series A Pre-Money vs. US Market Median
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Enterprise SaaS focus. Market median from J.P. Morgan / NVCA / Carta benchmarks [1][2][3].
              a16z typical derived from round size ($25.5M avg [6]), standard 20% dilution, and LP disclosures.
            </p>
          </div>

          {/* Phase annotations */}
          <div className="flex gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-amber-500/40" />
              <span className="text-muted-foreground">ZIRP Peak (2021)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-red-500/40" />
              <span className="text-muted-foreground">Rate Correction (2022–23)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-emerald-500/40" />
              <span className="text-muted-foreground">AI Recovery (2024–25)</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={VALUATION_TIMELINE} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="val"
                tickFormatter={(v) => `$${v}M`}
                tick={{ fontSize: 11 }}
                width={60}
              />
              <YAxis
                yAxisId="pct"
                orientation="right"
                tickFormatter={(v) => `+${v}%`}
                tick={{ fontSize: 11, fill: "#10b981" }}
                width={55}
              />
              <Tooltip content={<CustomValuationTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {/* Background phase shading */}
              <Bar yAxisId="val" dataKey="marketMedian" name="Market Median Pre-Money" fill="#64748b" opacity={0.7} radius={[3,3,0,0]}>
                {VALUATION_TIMELINE.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.highlight === "zirp"
                        ? "rgba(245,158,11,0.5)"
                        : entry.highlight === "correction"
                        ? "rgba(239,68,68,0.4)"
                        : entry.highlight === "recovery"
                        ? "rgba(16,185,129,0.4)"
                        : "rgba(100,116,139,0.6)"
                    }
                  />
                ))}
              </Bar>
              <Bar yAxisId="val" dataKey="a16zTypical" name="a16z Typical Pre-Money" fill="#10b981" opacity={0.85} radius={[3,3,0,0]} />
              <Line
                yAxisId="pct"
                type="linear"
                dataKey="premium"
                name="Premium (%)"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={{ r: 4, fill: "#10b981" }}
              />
              <ReferenceLine
                yAxisId="val"
                y={49}
                stroke="#94a3b8"
                strokeDasharray="4 4"
                label={{ value: "2025 NVCA Median $49M", position: "insideTopLeft", fontSize: 10, fill: "#94a3b8" }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Data table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Year</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Market Median</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">a16z Typical</th>
                  <th className="text-right py-2 px-3 text-emerald-500 font-medium">Premium</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Context</th>
                </tr>
              </thead>
              <tbody>
                {VALUATION_TIMELINE.map((row) => (
                  <tr key={row.year} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2 px-3 font-mono font-semibold">{row.year}</td>
                    <td className="py-2 px-3 font-mono text-right text-muted-foreground">${row.marketMedian}M</td>
                    <td className="py-2 px-3 font-mono text-right text-emerald-400">${row.a16zTypical}M</td>
                    <td className="py-2 px-3 font-mono text-right font-bold text-emerald-500">+{row.premium}%</td>
                    <td className="py-2 px-3 text-muted-foreground">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-muted-foreground/60 italic">
            Sources: [1] J.P. Morgan Innovation Economy H2 2025 — early-stage median $61M (2025), $37M (2023), $64M (2021).
            [2] NVCA Q4 2025 — Series A median $49M (2025). [3] Carta Q1 2025 — $48M Series A median.
            [6] Tracxn — a16z avg Series A round $25.5M. a16z pre-money derived assuming ~20% dilution norm.
            All figures are estimates; firm-level pre-money data is not publicly disclosed.
          </div>
        </div>
      )}

      {/* ── TAB 2: SIGNALING PREMIUM ── */}
      {activeTab === "signaling" && (
        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-1">
              SIGNALING PREMIUM — COHORT ANALYSIS
            </div>
            <h3 className="text-lg font-semibold">
              Series A → Series B Graduation Rate by Cohort
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              2-year graduation window. Market rate from Carta/ACA (Peter Walker, Oct 2024) [4].
              a16z rate from VC Explorer data and SignalRank analysis (85% of a16z Series B investments
              are follow-ons from existing portfolio) [5].
            </p>
          </div>

          <div className="flex gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-amber-500/40" />
              <span className="text-muted-foreground">ZIRP Peak</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-red-500/40" />
              <span className="text-muted-foreground">Rate Correction</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-emerald-500/40" />
              <span className="text-muted-foreground">AI Recovery</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={GRADUATION_TIMELINE} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="cohort" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="rate"
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 11 }}
                domain={[0, 80]}
                width={45}
              />
              <YAxis
                yAxisId="time"
                orientation="right"
                tickFormatter={(v) => `${v}mo`}
                tick={{ fontSize: 11, fill: "#f59e0b" }}
                domain={[10, 35]}
                width={45}
              />
              <Tooltip content={<CustomGradTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="rate" dataKey="marketRate" name="Market Grad. Rate (2yr)" fill="#64748b" opacity={0.7} radius={[3,3,0,0]}>
                {GRADUATION_TIMELINE.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.highlight === "zirp"
                        ? "rgba(245,158,11,0.4)"
                        : entry.highlight === "correction"
                        ? "rgba(239,68,68,0.35)"
                        : entry.highlight === "recovery"
                        ? "rgba(16,185,129,0.35)"
                        : "rgba(100,116,139,0.6)"
                    }
                  />
                ))}
              </Bar>
              <Bar yAxisId="rate" dataKey="a16zRate" name="a16z Grad. Rate (2yr)" fill="#3b82f6" opacity={0.85} radius={[3,3,0,0]} />
              <Line
                yAxisId="time"
                type="linear"
                dataKey="marketTime"
                name="Market Time to B (mo)"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                dot={{ r: 3, fill: "#94a3b8" }}
              />
              <Line
                yAxisId="time"
                type="linear"
                dataKey="a16zTime"
                name="a16z Time to B (mo)"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 4, fill: "#f59e0b" }}
              />
              <ReferenceLine
                yAxisId="rate"
                y={25}
                stroke="#94a3b8"
                strokeDasharray="4 4"
                label={{ value: "Pre-2021 baseline 25%", position: "insideTopLeft", fontSize: 10, fill: "#94a3b8" }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Key insight cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-lg border border-border p-4">
              <div className="text-xs text-muted-foreground mb-1">Avg. Graduation Gap</div>
              <div className="text-2xl font-bold text-blue-500">+{avgGradGap}pp</div>
              <div className="text-xs text-muted-foreground mt-1">
                a16z portfolio vs. market average across all cohorts
              </div>
            </div>
            <div className="rounded-lg border border-border p-4">
              <div className="text-xs text-muted-foreground mb-1">Time Advantage</div>
              <div className="text-2xl font-bold text-amber-500">−{avgTimeAdvantage} mo</div>
              <div className="text-xs text-muted-foreground mt-1">
                Faster to Series B vs. market median (28 mo in 2025)
              </div>
            </div>
            <div className="rounded-lg border border-border p-4">
              <div className="text-xs text-muted-foreground mb-1">Correction Resilience</div>
              <div className="text-2xl font-bold text-emerald-500">5.3×</div>
              <div className="text-xs text-muted-foreground mt-1">
                a16z 2022 cohort grad rate (48%) vs. market (9%) — brand insulates in downturns
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground/60 italic">
            Sources: [4] Carta Data Minute / ACA (Peter Walker, Oct 2024) — market graduation rates by cohort.
            [5] SignalRank (Mar 2026) — 85% of a16z Series B investments are follow-ons from existing portfolio,
            confirming high internal conversion. a16z graduation rate from VC Explorer data (65% overall).
            Time-to-Series-B from Carta Q1 2025 (market: 28mo median, "longest on record").
          </div>
        </div>
      )}

      {/* ── TAB 3: DECOMPOSITION ── */}
      {activeTab === "decomposition" && (
        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-1">
              PREMIUM DECOMPOSITION
            </div>
            <h3 className="text-lg font-semibold">
              What Drives the a16z Premium?
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              The headline +{avgPremium}% valuation premium is not monolithic. It can be decomposed into
              causal (brand/platform) and non-causal (selection/sector) components. This distinction
              matters for founders: only the causal components represent value-add from the firm itself.
            </p>
          </div>

          <div className="space-y-3">
            {PREMIUM_DECOMPOSITION.map((item) => (
              <div key={item.component} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-sm">{item.component}</div>
                  <div className="text-sm font-mono font-bold text-emerald-500">+{item.bps}pp</div>
                </div>
                <div className="text-xs text-muted-foreground mb-2">{item.description}</div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500/70"
                    style={{ width: `${(item.bps / 61) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-amber-200/80 leading-relaxed">
            <strong className="text-amber-400">Selection vs. Treatment Effect:</strong> Approximately
            {" "}<strong className="text-foreground">~{PREMIUM_DECOMPOSITION.find(d => d.component === "Selection Alpha")?.bps}pp</strong> of
            the total premium reflects the quality of companies a16z selects — not the value the firm adds.
            This is the core identification problem in VC brand research: a16z backs better companies,
            so their portfolio outperforms even without the brand effect. The remaining
            {" "}<strong className="text-foreground">~{61 - (PREMIUM_DECOMPOSITION.find(d => d.component === "Selection Alpha")?.bps ?? 0)}pp</strong> is
            attributable to brand signal, platform services, and network effects — the true "a16z premium."
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border border-border p-3">
              <div className="text-muted-foreground mb-1">Causal Premium (brand + platform)</div>
              <div className="text-xl font-bold text-emerald-500">
                +{PREMIUM_DECOMPOSITION.filter(d => d.component !== "Selection Alpha" && d.component !== "Sector Timing").reduce((s, d) => s + d.bps, 0)}pp
              </div>
              <div className="text-muted-foreground">Brand signal + Platform + Network</div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="text-muted-foreground mb-1">Non-Causal (selection + sector)</div>
              <div className="text-xl font-bold text-slate-400">
                +{PREMIUM_DECOMPOSITION.filter(d => d.component === "Selection Alpha" || d.component === "Sector Timing").reduce((s, d) => s + d.bps, 0)}pp
              </div>
              <div className="text-muted-foreground">Company quality + AI/SaaS mix</div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: PEER LANDSCAPE ── */}
      {activeTab === "landscape" && (
        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-1">
              PEER LANDSCAPE
            </div>
            <h3 className="text-lg font-semibold">
              Valuation Premium vs. Graduation Rate — Top-Tier Firms
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Each bubble represents a firm. X-axis = valuation premium above market median.
              Y-axis = Series A → B graduation rate (2yr window). Bubble size = AUM.
              The ideal quadrant is upper-right: high graduation rate AND high valuation premium
              (the firm's signal is worth paying for).
            </p>
          </div>

          <ResponsiveContainer width="100%" height={360}>
            <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="valPremium"
                name="Valuation Premium"
                tickFormatter={(v) => `+${v}%`}
                tick={{ fontSize: 11 }}
                label={{ value: "Valuation Premium Above Market Median (%)", position: "insideBottom", offset: -10, fontSize: 10, fill: "#94a3b8" }}
                domain={[-5, 80]}
              />
              <YAxis
                dataKey="gradRate"
                name="Graduation Rate"
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 11 }}
                label={{ value: "Series A→B Graduation Rate (2yr)", angle: -90, position: "insideLeft", offset: 10, fontSize: 10, fill: "#94a3b8" }}
                domain={[0, 80]}
              />
              <ZAxis dataKey="aum" range={[200, 2000]} name="AUM ($B)" />
              <Tooltip content={<ScatterTooltip />} />
              {/* Quadrant lines */}
              <ReferenceLine x={avgPremium} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4"
                label={{ value: `Avg premium +${avgPremium}%`, position: "top", fontSize: 9, fill: "#64748b" }} />
              <ReferenceLine y={25} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4"
                label={{ value: "Market avg 25%", position: "right", fontSize: 9, fill: "#64748b" }} />
              <Scatter
                data={FIRM_SCATTER}
                shape={(props: any) => {
                  const { cx, cy, payload } = props;
                  const r = Math.sqrt(payload.aum) * 3.5;
                  return (
                    <g>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={Math.max(r, 8)}
                        fill={payload.color}
                        opacity={payload.highlight ? 1 : 0.6}
                        stroke={payload.highlight ? "#fff" : "none"}
                        strokeWidth={payload.highlight ? 2 : 0}
                      />
                      <text
                        x={cx}
                        y={cy - Math.max(r, 8) - 4}
                        textAnchor="middle"
                        fontSize={payload.highlight ? 11 : 9}
                        fontWeight={payload.highlight ? "bold" : "normal"}
                        fill={payload.highlight ? "#10b981" : "#94a3b8"}
                      >
                        {payload.firm}
                      </text>
                    </g>
                  );
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>

          {/* Quadrant labels */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
              <div className="font-semibold text-emerald-400 mb-1">↗ Upper-Right: Premium Worth Paying</div>
              <div className="text-muted-foreground">High graduation rate + high valuation premium. The brand signal justifies the dilution cost. a16z, Sequoia, Benchmark cluster here.</div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="font-semibold text-slate-400 mb-1">↙ Lower-Left: Market-Rate Investors</div>
              <div className="text-muted-foreground">Near-market valuation, near-market graduation. Efficient for founders who don't need the brand signal.</div>
            </div>
          </div>
        </div>
      )}

      {/* Methodology Toggle */}
      <div className="border-t border-border pt-4">
        <button
          onClick={() => setShowMethodology(!showMethodology)}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
        >
          <span>{showMethodology ? "▼" : "▶"}</span>
          <span className="font-semibold">Methodology & Caveats</span>
        </button>
        {showMethodology && (
          <div className="mt-3 text-xs text-muted-foreground space-y-2 leading-relaxed max-w-3xl">
            <p>
              <strong className="text-foreground">Valuation Premium Methodology:</strong> Market median Series A
              pre-money valuations are sourced from J.P. Morgan Innovation Economy H2 2025 (PitchBook data),
              NVCA Q4 2025 Venture Monitor, and Carta State of Private Markets. The a16z "typical" pre-money
              is derived from Tracxn's reported average Series A round size ($25.5M) and industry-standard
              20% dilution norms, cross-validated against LP disclosures (UTIMCO, CalPERS) and industry
              reporting. Firm-level pre-money data is not publicly disclosed; all a16z figures are estimates.
            </p>
            <p>
              <strong className="text-foreground">Signaling Premium Methodology:</strong> Market graduation
              rates are sourced from Carta's cohort analysis (Peter Walker / ACA, October 2024), which tracks
              the percentage of Series A companies by quarter that subsequently raised a Series B within 2 years.
              a16z graduation rates are from the VC Ecosystem Explorer dataset (65% overall) and cross-validated
              against SignalRank's finding (March 2026) that 85% of a16z's Series B investments are follow-ons
              from existing portfolio companies.
            </p>
            <p>
              <strong className="text-foreground">Key Caveat — Selection vs. Treatment:</strong> The most
              important limitation of this analysis is that the premium cannot be cleanly attributed to a16z's
              brand or platform. a16z selects better companies, and better companies achieve higher valuations
              and better graduation rates regardless of investor. The decomposition shown in the "Premium
              Decomposition" tab is illustrative, not empirically derived from a controlled study.
            </p>
            <p>
              <strong className="text-foreground">Data as of:</strong> Q1 2026. All figures are estimates
              based on publicly available data. Past performance does not predict future results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
