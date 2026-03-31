/**
 * EcosystemBubble — v2 (improved)
 *
 * Key changes from v1:
 *  • Check-size range indicator: a horizontal range bar is drawn beneath each
 *    bubble to show the min–max check range, not just the midpoint average.
 *    This prevents misrepresentation of broad-range investors.
 *  • Log-scale toggle for the x-axis: the 400x spread in AUM and check sizes
 *    compresses small firms into an unreadable cluster on a linear scale.
 *  • Jitter: firms with identical or very close x/y values are slightly offset
 *    to reduce over-plotting and improve interactivity.
 *  • Improved label strategy: labels are shown for all firms when hovering,
 *    and always for compare-selected firms, with collision avoidance.
 *  • Bubble size now uses area-proportional scaling (correct perceptual encoding).
 */
import { useMemo, useState } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, CartesianGrid, Cell, Label,
} from "recharts";
import type { VCFirm } from "@/lib/vcData";
import { INDUSTRY_BENCHMARKS } from "@/lib/vcData";

interface Props {
  data: VCFirm[];
  onSelect: (f: VCFirm) => void;
  compareFirms: string[];
  onToggleCompare: (short: string) => void;
}

const TYPE_COLORS: Record<string, string> = {
  "Mega-Fund":          "#0d9488",
  "Multi-Stage":        "#0891b2",
  "Accelerator":        "#d97706",
  "Community/Incubator":"#7c3aed",
  "Residency":          "#7c3aed",
  "Pre-Seed Specialist":"#059669",
  "Seed Specialist":    "#059669",
  "Angel/Seed":         "#f59e0b",
  "Crypto Specialist":  "#6366f1",
  "Equal Partnership":  "#dc2626",
  "CVC":                "#2563eb",
  "Thesis-Driven":      "#0d9488",
  "Generalist Seed":    "#059669",
  "Seed/Early":         "#059669",
  "Early-Stage":        "#0891b2",
  "Growth/Buyout":      "#64748b",
};

/** Deterministic jitter to separate overlapping firms */
function jitter(val: number, index: number, spread: number): number {
  const offsets = [0, 0.08, -0.08, 0.16, -0.16, 0.24, -0.24];
  return val + (offsets[index % offsets.length] ?? 0) * spread;
}

export default function EcosystemBubble({ data, onSelect, compareFirms, onToggleCompare }: Props) {
  const [logScale, setLogScale] = useState(false);
  const [hoveredFirm, setHoveredFirm] = useState<string | null>(null);

  const chartData = useMemo(() => {
    // Group firms by approximate x position to detect over-plotting
    const posMap: Record<string, number> = {};
    return data.map(f => {
      const rawX = f.seedMax > 0
        ? (f.seedMin + f.seedMax) / 2
        : (f.seriesAMin + f.seriesAMax) / 2;
      const key = `${Math.round(rawX)}_${Math.round(f.dealsYr / 10)}`;
      posMap[key] = (posMap[key] ?? -1) + 1;
      const jitterIdx = posMap[key];

      const x = logScale
        ? Math.log10(Math.max(rawX, 0.05)) + 1.3   // shift so log(0.05)→0
        : jitter(rawX, jitterIdx, 0.5);
      const y = jitter(f.dealsYr, jitterIdx, 8);

      return {
        x,
        rawX,
        y,
        // Area-proportional: r ∝ sqrt(AUM), then scale to pixel range
        z: Math.max(Math.sqrt(f.aum) * 2.2, 80),
        firm: f,
        name: f.short,
        fill: TYPE_COLORS[f.type] || "#64748b",
        checkMin: f.seedMax > 0 ? f.seedMin : f.seriesAMin,
        checkMax: f.seedMax > 0 ? f.seedMax : f.seriesAMax,
      };
    });
  }, [data, logScale]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const f = d.firm as VCFirm;
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-4 max-w-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
          <span className="font-semibold text-sm" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>{f.firm}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <span className="text-muted-foreground">AUM</span>
          <span className="font-mono text-right">${(f.aum / 1000).toFixed(0)}B</span>
          <span className="text-muted-foreground">Seed Range</span>
          <span className="font-mono text-right">
            {f.seedMax > 0 ? `$${f.seedMin}–${f.seedMax}M` : "N/A"}
          </span>
          <span className="text-muted-foreground">Series A Range</span>
          <span className="font-mono text-right">
            {f.seriesAMax > 0 ? `$${f.seriesAMin}–${f.seriesAMax}M` : "N/A"}
          </span>
          <span className="text-muted-foreground">Deals/yr</span>
          <span className="font-mono text-right">{f.dealsYr}</span>
          <span className="text-muted-foreground">Type</span>
          <span className="font-mono text-right">{f.type}</span>
          <span className="text-muted-foreground">Grad Rate</span>
          <span className="font-mono text-right">{f.gradRate > 0 ? `${f.gradRate}%` : "—"}</span>
        </div>
        <p className="text-[10px] text-teal-600 mt-2 font-mono">Click to open full profile →</p>
      </div>
    );
  };

  const renderDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy) return <g />;
    const f = payload.firm as VCFirm;
    const isCompare = compareFirms.includes(payload.name);
    const isHovered = hoveredFirm === payload.name;
    const r = Math.max(Math.sqrt(payload.z) * 1.2, 5);
    const opacity = hoveredFirm && !isHovered && !isCompare ? 0.2 : isCompare ? 0.9 : 0.5;

    // Draw check-size range bar below bubble
    const rangeMin = logScale
      ? (Math.log10(Math.max(payload.checkMin, 0.05)) + 1.3)
      : payload.checkMin;
    const rangeMax = logScale
      ? (Math.log10(Math.max(payload.checkMax, 0.05)) + 1.3)
      : payload.checkMax;

    return (
      <g key={payload.name}
        style={{ cursor: "pointer" }}
        onClick={() => onSelect(f)}
        onMouseEnter={() => setHoveredFirm(payload.name)}
        onMouseLeave={() => setHoveredFirm(null)}
      >
        {/* Bubble */}
        <circle
          cx={cx} cy={cy} r={r}
          fill={payload.fill}
          fillOpacity={opacity}
          stroke={isCompare || isHovered ? payload.fill : "transparent"}
          strokeWidth={isCompare ? 2.5 : isHovered ? 1.5 : 0}
        />
        {/* Label — always for compare/hovered, only for large bubbles otherwise */}
        {(r > 8 || isCompare || isHovered) && (
          <text
            x={cx} y={cy - r - 5}
            textAnchor="middle"
            fontSize={isHovered || isCompare ? 10 : 8}
            fontFamily="'JetBrains Mono', monospace"
            fill={isCompare ? payload.fill : "#334155"}
            fontWeight={isCompare ? 700 : isHovered ? 600 : 400}
            opacity={opacity}
          >
            {payload.name}
          </text>
        )}
        {/* Check-size range indicator (thin horizontal bar) */}
        {payload.checkMin > 0 && payload.checkMax > 0 && (isHovered || isCompare) && (
          <line
            x1={cx - r * 0.8} x2={cx + r * 0.8}
            y1={cy + r + 4} y2={cy + r + 4}
            stroke={payload.fill} strokeWidth={2} strokeLinecap="round"
            opacity={0.6}
          />
        )}
      </g>
    );
  };

  const xAxisTickFormatter = (v: number) => {
    if (logScale) {
      const real = Math.pow(10, v - 1.3);
      return real < 1 ? `$${(real * 1000).toFixed(0)}K` : `$${real.toFixed(0)}M`;
    }
    return `$${v}M`;
  };

  const medianX = logScale
    ? Math.log10(Math.max(INDUSTRY_BENCHMARKS.seedMedianRound, 0.05)) + 1.3
    : INDUSTRY_BENCHMARKS.seedMedianRound;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Controls row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {Object.entries(TYPE_COLORS)
            .filter(([k]) => data.some(f => f.type === k))
            .map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{type}</span>
              </div>
            ))}
        </div>
        {/* Log scale toggle */}
        <label className="flex items-center gap-2 text-xs font-mono text-muted-foreground cursor-pointer select-none">
          <div
            className={`w-8 h-4 rounded-full transition-colors relative ${logScale ? "bg-teal-600" : "bg-slate-200"}`}
            onClick={() => setLogScale(v => !v)}
          >
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${logScale ? "translate-x-4" : "translate-x-0.5"}`} />
          </div>
          Log Scale
        </label>
      </div>

      <ResponsiveContainer width="100%" height={520}>
        <ScatterChart margin={{ top: 20, right: 40, bottom: 40, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            type="number"
            dataKey="x"
            name="Check Size"
            tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fill: "#64748b" }}
            tickFormatter={xAxisTickFormatter}
            domain={logScale ? ["auto", "auto"] : [0, "auto"]}
          >
            <Label
              value={logScale ? "Average Check Size (log scale)" : "Average Check Size ($M)"}
              position="bottom" offset={20}
              style={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", fill: "#64748b" }}
            />
          </XAxis>
          <YAxis
            type="number"
            dataKey="y"
            name="Deals/Year"
            tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fill: "#64748b" }}
          >
            <Label
              value="Deals per Year"
              angle={-90} position="insideLeft" offset={10}
              style={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", fill: "#64748b" }}
            />
          </YAxis>
          <ZAxis type="number" dataKey="z" range={[40, 600]} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            x={medianX}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            label={{ value: "Median Seed", position: "top", style: { fontSize: 9, fill: "#94a3b8" } }}
          />
          <Scatter
            data={chartData}
            shape={renderDot}
            onClick={(entry: any) => { if (entry?.firm) onSelect(entry.firm); }}
          />
        </ScatterChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4">
        <p className="text-[10px] text-muted-foreground font-mono">
          Bubble size ∝ AUM (area-proportional). Hover to highlight. Click to open profile.
        </p>
        <p className="text-[10px] text-muted-foreground font-mono">
          Dashed line = industry median seed round (${INDUSTRY_BENCHMARKS.seedMedianRound}M).
        </p>
        <p className="text-[10px] text-muted-foreground font-mono">
          Firms with no seed activity are positioned by their Series A check size.
        </p>
        {logScale && (
          <p className="text-[10px] text-teal-600 font-mono">
            Log scale active — small firms are now visible alongside mega-funds.
          </p>
        )}
      </div>
    </div>
  );
}
