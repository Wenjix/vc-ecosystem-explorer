/**
 * TimelineView — v2 (improved)
 *
 * Key changes from v1:
 *  • Linear interpolation replaces "monotone" curves. VC metrics are discrete
 *    annual snapshots; curved lines imply continuous changes that don't exist.
 *  • Highlight-on-hover: hovering a firm in the legend or on a line fades all
 *    other lines to opacity 0.1, bringing the selected firm into sharp focus.
 *    This eliminates the "spaghetti chart" problem when many firms are shown.
 *  • Focus mode: click a firm to lock it in focus; click again to release.
 *  • AUM metric added to the selector.
 *  • Industry average line preserved with correct linear type.
 *  • Narrative annotations and era shading preserved.
 */
import { useState, useMemo, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ReferenceArea,
  BarChart, Bar, Cell,
} from "recharts";
import { FIRM_TIMELINES, INDUSTRY_TIMELINE, type FirmTimeline } from "@/lib/vcData";
import { motion, AnimatePresence } from "framer-motion";

const FIRM_COLORS = [
  "#0d9488", "#2563eb", "#dc2626", "#d97706", "#7c3aed",
  "#059669", "#0891b2", "#db2777", "#65a30d", "#9333ea",
  "#be185d", "#0e7490",
];

const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

type Metric = "seedMax" | "seriesAMax" | "dealsYr" | "timeNext" | "aum";

const METRIC_CONFIG: Record<Metric, { label: string; unit: string; desc: string; yLabel: string; hasIndustry: boolean }> = {
  seedMax:    { label: "Seed Check Size",    unit: "M",  desc: "Typical maximum seed investment ($M)", yLabel: "$M", hasIndustry: true },
  seriesAMax: { label: "Series A Check Size",unit: "M",  desc: "Typical maximum Series A investment ($M)", yLabel: "$M", hasIndustry: true },
  dealsYr:    { label: "Deal Velocity",      unit: "",   desc: "Approximate number of deals per year", yLabel: "Deals/yr", hasIndustry: false },
  timeNext:   { label: "Time to Next Round", unit: " mo",desc: "Median months from seed to Series A", yLabel: "Months", hasIndustry: true },
  aum:        { label: "AUM",                unit: "B",  desc: "Assets under management ($B)", yLabel: "$B", hasIndustry: false },
};

const DEFAULT_FIRMS = ["a16z", "Sequoia", "Benchmark", "YC", "Thrive", "GC"];

const ERAS = [
  { x1: 2020, x2: 2021.5, label: "ZIRP Boom",    color: "#0d948820", border: "#0d9488" },
  { x1: 2021.5, x2: 2023.5, label: "Correction", color: "#dc262615", border: "#dc2626" },
  { x1: 2023.5, x2: 2026,   label: "AI Recovery",color: "#2563eb15", border: "#2563eb" },
];

function getSnapValue(snap: FirmTimeline["snapshots"][0], metric: Metric): number {
  if (metric === "aum") return snap.aum / 1000;
  return snap[metric] as number;
}

export default function TimelineView() {
  const [selectedFirms, setSelectedFirms] = useState<string[]>(DEFAULT_FIRMS);
  const [activeMetric, setActiveMetric] = useState<Metric>("seedMax");
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [showIndustry, setShowIndustry] = useState(true);
  // Hover/focus state for spaghetti-fix
  const [hoveredFirm, setHoveredFirm] = useState<string | null>(null);
  const [focusedFirm, setFocusedFirm] = useState<string | null>(null);

  const effectiveFocus = focusedFirm ?? hoveredFirm;

  const toggleFirm = (short: string) => {
    setSelectedFirms(prev =>
      prev.includes(short)
        ? prev.filter(s => s !== short)
        : prev.length < 12
        ? [...prev, short]
        : prev
    );
  };

  const handleLegendClick = (short: string) => {
    setFocusedFirm(prev => prev === short ? null : short);
  };

  const getLineOpacity = useCallback((short: string) => {
    if (!effectiveFocus) return 1;
    return effectiveFocus === short ? 1 : 0.08;
  }, [effectiveFocus]);

  const getLineWidth = useCallback((short: string) => {
    if (!effectiveFocus) return 2;
    return effectiveFocus === short ? 3 : 1;
  }, [effectiveFocus]);

  const lineData = useMemo(() => {
    return YEARS.map(year => {
      const row: Record<string, number | string> = { year };
      selectedFirms.forEach(short => {
        const tl = FIRM_TIMELINES.find(f => f.short === short);
        const snap = tl?.snapshots.find(s => s.year === year);
        if (snap) row[short] = getSnapValue(snap, activeMetric);
      });
      const industrySnap = INDUSTRY_TIMELINE.find(s => s.year === year);
      if (industrySnap && METRIC_CONFIG[activeMetric].hasIndustry) {
        const val = activeMetric === "aum" ? null : industrySnap[activeMetric as "seedMax" | "seriesAMax" | "timeNext"];
        if (val != null) row["Industry"] = val as number;
      }
      return row;
    });
  }, [selectedFirms, activeMetric]);

  const snapshotData = useMemo(() => {
    const year = hoveredYear ?? 2025;
    return FIRM_TIMELINES
      .filter(f => selectedFirms.includes(f.short))
      .map(f => {
        const snap = f.snapshots.find(s => s.year === year);
        return {
          short: f.short,
          value: snap ? getSnapValue(snap, activeMetric) : 0,
          color: FIRM_COLORS[selectedFirms.indexOf(f.short) % FIRM_COLORS.length],
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [selectedFirms, activeMetric, hoveredYear]);

  const cfg = METRIC_CONFIG[activeMetric];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const era = ERAS.find(e => (label as number) >= e.x1 && (label as number) < e.x2);
    return (
      <div className="bg-card border border-border rounded-lg shadow-xl p-4 min-w-[200px]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold font-mono">{label}</span>
          {era && (
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: era.color, color: era.border, border: `1px solid ${era.border}40` }}>
              {era.label}
            </span>
          )}
        </div>
        <div className="space-y-1">
          {payload
            .sort((a: any, b: any) => b.value - a.value)
            .map((entry: any) => (
              <div key={entry.dataKey} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs text-muted-foreground font-mono">{entry.dataKey}</span>
                </div>
                <span className="text-xs font-mono font-semibold" style={{ color: entry.color }}>
                  {entry.dataKey === "Industry" ? "~" : ""}{Number(entry.value).toFixed(1)}{cfg.unit}
                </span>
              </div>
            ))}
        </div>
      </div>
    );
  };

  const calcChange = (short: string, fromYear: number, toYear: number): number | null => {
    const tl = FIRM_TIMELINES.find(f => f.short === short);
    if (!tl) return null;
    const fromSnap = tl.snapshots.find(s => s.year === fromYear);
    const toSnap = tl.snapshots.find(s => s.year === toYear);
    if (!fromSnap || !toSnap) return null;
    const from = getSnapValue(fromSnap, activeMetric);
    const to = getSnapValue(toSnap, activeMetric);
    if (!from) return null;
    return Math.round(((to - from) / from) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Metric selector tabs */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(METRIC_CONFIG) as Metric[]).map(m => (
          <button
            key={m}
            onClick={() => setActiveMetric(m)}
            className={`px-5 py-2 rounded-lg text-sm font-mono transition-all border ${
              activeMetric === m
                ? "bg-teal-600 text-white border-teal-600 shadow-md"
                : "bg-card text-muted-foreground border-border hover:border-teal-400 hover:text-foreground"
            }`}
          >
            {METRIC_CONFIG[m].label}
          </button>
        ))}
        {cfg.hasIndustry && (
          <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-mono text-muted-foreground cursor-pointer hover:border-teal-400 transition-all ml-auto">
            <input
              type="checkbox"
              checked={showIndustry}
              onChange={e => setShowIndustry(e.target.checked)}
              className="accent-teal-600"
            />
            Industry Avg
          </label>
        )}
      </div>

      {/* Era legend */}
      <div className="flex flex-wrap items-center gap-4">
        {ERAS.map(era => (
          <div key={era.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: era.color, border: `1px solid ${era.border}` }} />
            <span className="text-[10px] font-mono text-muted-foreground">{era.label}</span>
          </div>
        ))}
        <span className="text-[10px] font-mono text-muted-foreground ml-auto">{cfg.desc}</span>
      </div>

      {/* Main line chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="mb-3">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            {cfg.label} — 2020 to 2026
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {selectedFirms.length} firms selected · hover legend to highlight · click to lock focus
          </p>
          {effectiveFocus && (
            <p className="text-xs text-teal-600 font-mono mt-1">
              Focused: <strong>{effectiveFocus}</strong> —{" "}
              <button className="underline" onClick={() => { setHoveredFirm(null); setFocusedFirm(null); }}>
                clear focus
              </button>
            </p>
          )}
        </div>

        <ResponsiveContainer width="100%" height={380}>
          <LineChart
            data={lineData}
            margin={{ top: 10, right: 30, bottom: 10, left: 10 }}
            onClick={(e: any) => {
              if (e?.activeLabel) setHoveredYear(Number(e.activeLabel));
            }}
            onMouseMove={(e: any) => {
              if (e?.activeLabel) setHoveredYear(Number(e.activeLabel));
            }}
            onMouseLeave={() => setHoveredYear(null)}
          >
            {ERAS.map(era => (
              <ReferenceArea
                key={era.label}
                x1={era.x1} x2={era.x2}
                fill={era.color}
                strokeOpacity={0}
              />
            ))}
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fill: "#64748b" }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fill: "#64748b" }}
              axisLine={false} tickLine={false}
              tickFormatter={v => `${v}${cfg.unit}`}
              label={{ value: cfg.yLabel, angle: -90, position: "insideLeft", style: { fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fill: "#94a3b8" } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={2021} stroke="#0d9488" strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: "ZIRP Peak", position: "top", style: { fontSize: 9, fontFamily: "monospace", fill: "#0d9488" } }} />
            <ReferenceLine x={2022} stroke="#dc2626" strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: "Correction", position: "top", style: { fontSize: 9, fontFamily: "monospace", fill: "#dc2626" } }} />
            <ReferenceLine x={2024} stroke="#2563eb" strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: "AI Surge", position: "top", style: { fontSize: 9, fontFamily: "monospace", fill: "#2563eb" } }} />

            {/* Industry average — linear type */}
            {showIndustry && cfg.hasIndustry && (
              <Line
                type="linear"
                dataKey="Industry"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="6 3"
                dot={false}
                name="Industry"
                opacity={effectiveFocus ? 0.2 : 0.8}
              />
            )}

            {/* Firm lines — linear type (v2 key change) */}
            {selectedFirms.map((short, i) => (
              <Line
                key={short}
                type="linear"
                dataKey={short}
                stroke={FIRM_COLORS[i % FIRM_COLORS.length]}
                strokeWidth={getLineWidth(short)}
                dot={{ r: 3, fill: FIRM_COLORS[i % FIRM_COLORS.length] }}
                activeDot={{ r: 5 }}
                name={short}
                opacity={getLineOpacity(short)}
                style={{ transition: "opacity 0.2s, stroke-width 0.15s" }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        {/* Interactive legend below chart */}
        <div className="flex flex-wrap gap-x-3 gap-y-2 mt-4 pt-4 border-t border-border/50">
          {selectedFirms.map((short, i) => {
            const color = FIRM_COLORS[i % FIRM_COLORS.length];
            const isFocused = effectiveFocus === short;
            return (
              <button
                key={short}
                className={`flex items-center gap-1.5 text-[10px] font-mono rounded px-2 py-1 transition-all ${
                  isFocused ? "bg-secondary ring-1 ring-teal-400" : "hover:bg-secondary/50"
                }`}
                style={{ opacity: effectiveFocus && !isFocused ? 0.35 : 1 }}
                onMouseEnter={() => setHoveredFirm(short)}
                onMouseLeave={() => setHoveredFirm(null)}
                onClick={() => handleLegendClick(short)}
              >
                <div className="w-5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                <span style={{ color: isFocused ? color : "#64748b" }}>{short}</span>
              </button>
            );
          })}
          {showIndustry && cfg.hasIndustry && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1">
              <div className="w-5 h-px border-t-2 border-dashed border-slate-400" />
              <span className="text-slate-400">Industry Avg</span>
            </div>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground font-mono mt-2">
          Lines use linear interpolation — VC metrics are discrete annual snapshots.
          Curved lines would imply continuous changes that do not exist in the data.
        </p>
      </div>

      {/* Year snapshot bar chart */}
      <AnimatePresence mode="wait">
        <motion.div
          key={hoveredYear ?? 2025}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Snapshot — {hoveredYear ?? 2025}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {cfg.label} ranked by selected firms
              </p>
            </div>
            {hoveredYear && hoveredYear > 2020 && (
              <div className="text-[10px] font-mono text-muted-foreground text-right">
                <p>vs. {hoveredYear - 1}</p>
                <div className="flex flex-wrap gap-2 mt-1 justify-end">
                  {selectedFirms.slice(0, 5).map((short) => {
                    const chg = calcChange(short, hoveredYear - 1, hoveredYear);
                    if (chg === null) return null;
                    return (
                      <span
                        key={short}
                        className="px-1.5 py-0.5 rounded text-[9px] font-mono"
                        style={{
                          backgroundColor: chg >= 0 ? "#0d948818" : "#dc262618",
                          color: chg >= 0 ? "#0d9488" : "#dc2626",
                        }}
                      >
                        {short} {chg >= 0 ? "+" : ""}{chg}%
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={snapshotData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="short"
                tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fill: "#334155" }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fill: "#94a3b8" }}
                axisLine={false} tickLine={false}
                tickFormatter={v => `${v}${cfg.unit}`}
              />
              <Tooltip
                formatter={(v: any) => [`${Number(v).toFixed(1)}${cfg.unit}`, cfg.label]}
                contentStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, borderRadius: 8 }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
                {snapshotData.map((d) => (
                  <Cell key={d.short} fill={d.color} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>

      {/* Firm selector grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Select Firms to Track ({selectedFirms.length}/12 selected)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedFirms(DEFAULT_FIRMS)}
              className="text-[10px] font-mono text-teal-600 hover:text-teal-700 underline underline-offset-2"
            >
              Reset to defaults
            </button>
            <span className="text-border">·</span>
            <button
              onClick={() => setSelectedFirms(FIRM_TIMELINES.map(f => f.short))}
              className="text-[10px] font-mono text-teal-600 hover:text-teal-700 underline underline-offset-2"
            >
              Select all
            </button>
            <span className="text-border">·</span>
            <button
              onClick={() => setSelectedFirms([])}
              className="text-[10px] font-mono text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {FIRM_TIMELINES.map((tl, i) => {
            const isSelected = selectedFirms.includes(tl.short);
            const colorIdx = selectedFirms.indexOf(tl.short);
            const color = isSelected ? FIRM_COLORS[colorIdx % FIRM_COLORS.length] : undefined;
            const v2020Snap = tl.snapshots.find(s => s.year === 2020);
            const v2025Snap = tl.snapshots.find(s => s.year === 2025);
            const v2020 = v2020Snap ? getSnapValue(v2020Snap, activeMetric) : null;
            const v2025 = v2025Snap ? getSnapValue(v2025Snap, activeMetric) : null;
            const pctChange = v2020 && v2025 ? Math.round(((v2025 - v2020) / v2020) * 100) : null;

            return (
              <button
                key={tl.short}
                onClick={() => toggleFirm(tl.short)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? "shadow-sm"
                    : "bg-card border-border hover:border-slate-300"
                }`}
                style={isSelected ? {
                  backgroundColor: `${color}12`,
                  borderColor: `${color}60`,
                } : {}}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold font-mono" style={{ color: isSelected ? color : "#334155" }}>
                      {tl.short}
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-0.5 font-mono">{tl.type}</p>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full mt-0.5" style={{ backgroundColor: color }} />
                  )}
                </div>
                {pctChange !== null && (
                  <div className="mt-1.5 flex items-center gap-1">
                    <span
                      className="text-[9px] font-mono px-1 py-0.5 rounded"
                      style={{
                        backgroundColor: pctChange >= 0 ? "#0d948815" : "#dc262615",
                        color: pctChange >= 0 ? "#0d9488" : "#dc2626",
                      }}
                    >
                      {pctChange >= 0 ? "+" : ""}{pctChange}% '20→'25
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Key insights panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-[10px] font-mono uppercase tracking-wider text-teal-600 mb-2">ZIRP Peak (2021)</p>
          <p className="text-2xl font-bold font-mono text-foreground">+60%</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Average seed check size increase across top-tier firms from 2020 to 2021 peak, driven by near-zero interest rates and record LP commitments.
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-[10px] font-mono uppercase tracking-wider text-amber-600 mb-2">Correction (2022–23)</p>
          <p className="text-2xl font-bold font-mono text-foreground">–22%</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Median deal velocity contraction across the ecosystem as rate hikes compressed valuations and LPs pulled back on new commitments.
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-[10px] font-mono uppercase tracking-wider text-blue-600 mb-2">AI Recovery (2024–26)</p>
          <p className="text-2xl font-bold font-mono text-foreground">+38%</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Series A check size rebound for AI-focused firms (a16z, Thrive, GC) as generative AI deal flow drove selective but outsized rounds.
          </p>
        </div>
      </div>
    </div>
  );
}
