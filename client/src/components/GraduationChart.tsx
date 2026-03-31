import { useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid, Label } from "recharts";
import type { VCFirm } from "@/lib/vcData";
import { INDUSTRY_BENCHMARKS } from "@/lib/vcData";

interface Props {
  data: VCFirm[];
}

export default function GraduationChart({ data }: Props) {
  const chartData = useMemo(() => {
    return data.filter(f => f.gradRate > 0 && f.timeNext > 0).map(f => ({
      x: f.timeNext,
      y: f.gradRate,
      z: f.markup * 25,
      name: f.short,
      firm: f,
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const f = d.firm as VCFirm;
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="font-semibold text-sm mb-1" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>{f.firm}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <span className="text-muted-foreground">Graduation</span>
          <span className="font-mono text-right">{f.gradRate}%</span>
          <span className="text-muted-foreground">Time to Next</span>
          <span className="font-mono text-right">{f.timeNext} mo</span>
          <span className="text-muted-foreground">Markup</span>
          <span className="font-mono text-right">{f.markup}x</span>
          <span className="text-muted-foreground">Deals/yr</span>
          <span className="font-mono text-right">{f.dealsYr}</span>
        </div>
      </div>
    );
  };

  const renderDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy) return <g />;
    const r = Math.max(payload.z / 5, 8);
    return (
      <g key={payload.name}>
        <circle cx={cx} cy={cy} r={r} fill="#0d9488" fillOpacity={0.4} stroke="#0d9488" strokeWidth={1.5} />
        <text
          x={cx}
          y={cy - r - 5}
          textAnchor="middle"
          fontSize={9}
          fontFamily="'JetBrains Mono', monospace"
          fill="#334155"
          fontWeight={500}
        >
          {payload.name}
        </text>
      </g>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main scatter */}
      <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
            <div className="w-3 h-0.5 bg-red-400" style={{ borderTop: "1px dashed #dc2626" }} />
            Industry avg graduation
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
            <div className="w-3 h-0.5 bg-amber-400" style={{ borderTop: "1px dashed #f59e0b" }} />
            Median time to next round
          </div>
        </div>
        <ResponsiveContainer width="100%" height={450}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[10, 28]}
              tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fill: "#64748b" }}
            >
              <Label value="Time to Next Round (months)" position="bottom" offset={10} style={{ fontSize: 11, fill: "#64748b" }} />
            </XAxis>
            <YAxis
              type="number"
              dataKey="y"
              domain={[15, 80]}
              tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fill: "#64748b" }}
            >
              <Label value="Graduation Rate (%)" angle={-90} position="insideLeft" offset={10} style={{ fontSize: 11, fill: "#64748b" }} />
            </YAxis>
            <ZAxis type="number" dataKey="z" range={[40, 300]} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={INDUSTRY_BENCHMARKS.seedGradRate} stroke="#dc2626" strokeDasharray="4 4" />
            <ReferenceLine x={INDUSTRY_BENCHMARKS.medianTimeToSeriesA} stroke="#f59e0b" strokeDasharray="4 4" />
            <Scatter data={chartData} shape={renderDot} cursor="pointer" />
          </ScatterChart>
        </ResponsiveContainer>
        <p className="text-[10px] text-muted-foreground mt-2 font-mono">
          Bubble size = markup multiple. Upper-left quadrant = best performers (high graduation, fast velocity).
        </p>
      </div>

      {/* Side stats */}
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Top Graduation Rates</p>
          {data.filter(f => f.gradRate > 0).sort((a, b) => b.gradRate - a.gradRate).slice(0, 8).map((f, i) => (
            <div key={f.short} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground w-4">{i + 1}</span>
                <span className="text-sm font-medium">{f.short}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full transition-all" style={{ width: `${f.gradRate}%` }} />
                </div>
                <span className="text-xs font-mono w-8 text-right">{f.gradRate}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Fastest to Next Round</p>
          {data.filter(f => f.timeNext > 0).sort((a, b) => a.timeNext - b.timeNext).slice(0, 6).map((f, i) => (
            <div key={f.short} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground w-4">{i + 1}</span>
                <span className="text-sm font-medium">{f.short}</span>
              </div>
              <span className="text-xs font-mono">{f.timeNext} mo</span>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Highest Markup</p>
          {data.filter(f => f.markup > 0).sort((a, b) => b.markup - a.markup).slice(0, 5).map((f, i) => (
            <div key={f.short} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground w-4">{i + 1}</span>
                <span className="text-sm font-medium">{f.short}</span>
              </div>
              <span className="text-xs font-mono font-semibold text-teal-700">{f.markup}x</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
