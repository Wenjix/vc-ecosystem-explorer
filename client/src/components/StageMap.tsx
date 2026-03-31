import type { VCFirm } from "@/lib/vcData";
import { ALL_STAGES } from "@/lib/vcData";
import { motion } from "framer-motion";

interface Props {
  data: VCFirm[];
  onSelect: (f: VCFirm) => void;
}

const TYPE_BADGE_COLORS: Record<string, string> = {
  "Mega-Fund": "bg-teal-100 text-teal-800",
  "Multi-Stage": "bg-cyan-100 text-cyan-800",
  "Accelerator": "bg-amber-100 text-amber-800",
  "Community/Incubator": "bg-violet-100 text-violet-800",
  "Residency": "bg-violet-100 text-violet-800",
  "Pre-Seed Specialist": "bg-emerald-100 text-emerald-800",
  "Seed Specialist": "bg-emerald-100 text-emerald-800",
  "Angel/Seed": "bg-yellow-100 text-yellow-800",
  "Crypto Specialist": "bg-indigo-100 text-indigo-800",
  "Equal Partnership": "bg-red-100 text-red-800",
  "CVC": "bg-blue-100 text-blue-800",
  "Thesis-Driven": "bg-teal-100 text-teal-800",
  "Generalist Seed": "bg-emerald-100 text-emerald-800",
  "Seed/Early": "bg-emerald-100 text-emerald-800",
  "Early-Stage": "bg-cyan-100 text-cyan-800",
  "Growth/Buyout": "bg-slate-100 text-slate-800",
};

export default function StageMap({ data, onSelect }: Props) {
  const sorted = [...data].sort((a, b) => {
    const stageIndices = (f: VCFirm) => f.stages.map(s => ALL_STAGES.indexOf(s)).filter(i => i >= 0);
    const aMin = Math.min(...stageIndices(a));
    const bMin = Math.min(...stageIndices(b));
    if (aMin !== bMin) return aMin - bMin;
    return a.stages.length - b.stages.length;
  });

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground w-28 sticky left-0 bg-secondary/50 z-10">Firm</th>
              {ALL_STAGES.map(s => (
                <th key={s} className="px-3 py-3 text-center text-[10px] font-mono uppercase tracking-wider text-muted-foreground min-w-[80px]">{s}</th>
              ))}
              <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Type</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((f, rowIdx) => (
              <motion.tr
                key={f.short}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: rowIdx * 0.02 }}
                className="border-b border-border/30 hover:bg-teal-50/30 cursor-pointer transition-colors"
                onClick={() => onSelect(f)}
              >
                <td className="px-4 py-2.5 sticky left-0 bg-card z-10">
                  <span className="text-sm font-medium">{f.short}</span>
                </td>
                {ALL_STAGES.map((stage, colIdx) => {
                  const active = f.stages.includes(stage);
                  return (
                    <td key={stage} className="px-3 py-2.5 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: rowIdx * 0.02 + colIdx * 0.03, type: "spring", stiffness: 400 }}
                        className={`w-7 h-7 mx-auto rounded-md flex items-center justify-center transition-colors ${
                          active
                            ? "bg-teal-600 shadow-sm"
                            : "bg-secondary/40"
                        }`}
                      >
                        {active && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </motion.div>
                    </td>
                  );
                })}
                <td className="px-4 py-2.5">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${TYPE_BADGE_COLORS[f.type] || "bg-slate-100 text-slate-800"}`}>
                    {f.type}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
