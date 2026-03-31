import { useState, useMemo } from "react";
import type { VCFirm } from "@/lib/vcData";
import { ChevronUp, ChevronDown, GitCompareArrows } from "lucide-react";

interface Props {
  data: VCFirm[];
  onSelect: (f: VCFirm) => void;
  compareFirms: string[];
  onToggleCompare: (short: string) => void;
}

type SortKey = "firm" | "aum" | "seedMax" | "seriesAMax" | "dealsYr" | "gradRate" | "timeNext" | "markup" | "founded";

export default function PerformanceTable({ data, onSelect, compareFirms, onToggleCompare }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("aum");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      if (typeof av === "string" && typeof bv === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [data, sortKey, sortDir]);

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ChevronDown className="w-3 h-3 opacity-20" />;
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3 text-teal-600" /> : <ChevronDown className="w-3 h-3 text-teal-600" />;
  };

  const cols: { key: SortKey; label: string; align?: string }[] = [
    { key: "firm", label: "Firm" },
    { key: "aum", label: "AUM ($B)" },
    { key: "seedMax", label: "Seed Max ($M)" },
    { key: "seriesAMax", label: "Series A Max ($M)" },
    { key: "dealsYr", label: "Deals/Yr" },
    { key: "gradRate", label: "Grad %" },
    { key: "timeNext", label: "Velocity (mo)" },
    { key: "markup", label: "Markup (x)" },
    { key: "founded", label: "Est." },
  ];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-3 py-3 text-left w-10">
                <GitCompareArrows className="w-3.5 h-3.5 text-muted-foreground" />
              </th>
              {cols.map(c => (
                <th
                  key={c.key}
                  onClick={() => toggleSort(c.key)}
                  className="px-3 py-3 text-left cursor-pointer hover:bg-secondary/80 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{c.label}</span>
                    <SortIcon k={c.key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(f => {
              const isCompare = compareFirms.includes(f.short);
              return (
                <tr
                  key={f.short}
                  className={`border-b border-border/50 hover:bg-teal-50/50 transition-colors cursor-pointer ${isCompare ? "bg-teal-50/30" : ""}`}
                  onClick={() => onSelect(f)}
                >
                  <td className="px-3 py-2.5" onClick={e => { e.stopPropagation(); onToggleCompare(f.short); }}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${isCompare ? "border-teal-600 bg-teal-600" : "border-border"}`}>
                      {isCompare && <span className="text-white text-[8px] font-bold">✓</span>}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div>
                      <span className="font-medium text-foreground">{f.short}</span>
                      <span className="text-[10px] text-muted-foreground ml-2">{f.type}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-xs">${(f.aum / 1000).toFixed(0)}B</td>
                  <td className="px-3 py-2.5 font-mono text-xs">{f.seedMax > 0 ? `$${f.seedMax}M` : "—"}</td>
                  <td className="px-3 py-2.5 font-mono text-xs">{f.seriesAMax > 0 ? `$${f.seriesAMax}M` : "—"}</td>
                  <td className="px-3 py-2.5 font-mono text-xs">{f.dealsYr}</td>
                  <td className="px-3 py-2.5">
                    {f.gradRate > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-teal-600 rounded-full" style={{ width: `${f.gradRate}%` }} />
                        </div>
                        <span className="font-mono text-xs">{f.gradRate}%</span>
                      </div>
                    ) : <span className="text-muted-foreground text-xs">—</span>}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-xs">{f.timeNext > 0 ? `${f.timeNext}` : "—"}</td>
                  <td className="px-3 py-2.5 font-mono text-xs">{f.markup > 0 ? `${f.markup}x` : "—"}</td>
                  <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{f.founded}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
