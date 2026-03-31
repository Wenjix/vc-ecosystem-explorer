/**
 * FirmDetailDrawer — v2 (improved)
 *
 * Key changes from v1:
 *  1. Vintage-year performance table: TVPI/IRR/DPI are now shown per fund
 *     with vintage year, eliminating the misleading single-number display.
 *     A 2.0x TVPI is excellent for a 2022 vintage but mediocre for a 2014 vintage.
 *  2. DPI (Distributed to Paid-In) added: the most critical LP metric —
 *     actual cash returned, not paper markups.
 *  3. Granular source citations: each performance metric has a source tooltip.
 *  4. Founder Fit module: lead/follow, board seat policy, ownership targets,
 *     decision timeline, and value-add categories.
 *  5. Sector convictions displayed with conviction badges (Primary/Active/Adjacent)
 *     and estimated deal share, replacing flat sector tags.
 *  6. Industry benchmark comparisons for all key metrics.
 */
import type { VCFirm, ConvictionLevel, ValueAddCategory } from "@/lib/vcData";
import { INDUSTRY_BENCHMARKS } from "@/lib/vcData";
import { X, MapPin, Calendar, TrendingUp, Target, Clock, Layers, DollarSign, Percent, Info, CheckCircle, XCircle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Props {
  firm: VCFirm;
  onClose: () => void;
  onToggleCompare?: (short: string) => void;
  compareFirms?: string[];
}

const CONVICTION_COLORS: Record<ConvictionLevel, string> = {
  Primary: "#0d9488",
  Active: "#2563eb",
  Adjacent: "#94a3b8",
};

const VALUE_ADD_ICONS: Partial<Record<ValueAddCategory, string>> = {
  "Recruiting": "👥",
  "GTM": "🚀",
  "Regulatory": "⚖️",
  "Technical": "🔧",
  "Business Development": "🤝",
  "PR / Brand": "📣",
  "Follow-on Capital": "💰",
  "International Expansion": "🌍",
  "M&A": "🏢",
};

function MetricRow({
  label, value, benchmark, benchmarkLabel, higherIsBetter, source, icon: Icon,
}: {
  label: string;
  value: number | string;
  benchmark?: number | string;
  benchmarkLabel?: string;
  higherIsBetter?: boolean;
  source?: string;
  icon?: any;
}) {
  const numVal = typeof value === "number" ? value : parseFloat(String(value));
  const numBench = benchmark != null ? (typeof benchmark === "number" ? benchmark : parseFloat(String(benchmark))) : null;
  const isAbove = numBench != null && !isNaN(numVal) && !isNaN(numBench) ? numVal > numBench : null;
  const isGood = isAbove != null ? (higherIsBetter ? isAbove : !isAbove) : null;

  return (
    <div className="flex items-start justify-between py-3 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
        <span className="text-sm text-muted-foreground">{label}</span>
        {source && (
          <div className="group relative">
            <Info className="w-3 h-3 text-muted-foreground/40 cursor-help" />
            <div className="absolute left-0 top-5 z-30 hidden group-hover:block bg-card border border-border rounded p-2 text-[10px] text-muted-foreground w-52 shadow-lg leading-relaxed">
              <strong>Source:</strong> {source}
            </div>
          </div>
        )}
      </div>
      <div className="text-right">
        <span className={`font-mono text-sm font-medium ${
          isGood === true ? "text-teal-600" : isGood === false ? "text-amber-600" : ""
        }`}>
          {typeof value === "number" && value > 0 ? value : typeof value === "string" ? value : "—"}
        </span>
        {benchmark != null && numVal > 0 && (
          <div className="text-[10px] font-mono mt-0.5 text-muted-foreground/60">
            {benchmarkLabel ?? "Benchmark"}: {benchmark}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FirmDetailDrawer({ firm, onClose, onToggleCompare, compareFirms = [] }: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "performance" | "fit">("overview");
  const isCompared = compareFirms.includes(firm.short);

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "performance" as const, label: "Performance" },
    { id: "fit" as const, label: "Founder Fit" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-card border-l border-border shadow-2xl overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-6 z-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-teal-600 mb-1">{firm.type}</p>
                <h3 className="text-xl font-bold" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>{firm.firm}</h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{firm.hq}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Est. {firm.founded}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onToggleCompare && (
                  <button
                    onClick={() => onToggleCompare(firm.short)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                      isCompared
                        ? "bg-teal-600 text-white border-teal-600"
                        : "bg-card text-muted-foreground border-border hover:border-teal-400"
                    }`}
                  >
                    {isCompared ? "✓ Comparing" : "+ Compare"}
                  </button>
                )}
                <button onClick={onClose} className="p-1.5 rounded hover:bg-secondary transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    activeTab === tab.id
                      ? "bg-teal-600 text-white"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-6">

            {/* ── OVERVIEW TAB ─────────────────────────────────────────── */}
            {activeTab === "overview" && (
              <>
                {/* Key stats grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-teal-50 rounded-lg p-3 text-center">
                    <p className="text-[9px] font-mono uppercase tracking-wider text-teal-700">AUM</p>
                    <p className="font-mono text-lg font-bold text-teal-900 mt-1">
                      {firm.aum >= 1000 ? `$${(firm.aum / 1000).toFixed(0)}B` : `$${firm.aum}M`}
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Latest Fund</p>
                    <p className="font-mono text-lg font-bold mt-1">{firm.latestFund >= 1000 ? `$${(firm.latestFund / 1000).toFixed(1)}B` : `$${firm.latestFund}M`}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Deals/Yr</p>
                    <p className="font-mono text-lg font-bold mt-1">{firm.dealsYr}</p>
                  </div>
                </div>

                {/* Differentiator */}
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <p className="text-xs font-mono uppercase tracking-wider text-teal-700 mb-2">Key Differentiator</p>
                  <p className="text-sm text-teal-900 leading-relaxed">{firm.differentiator}</p>
                </div>

                {/* Deal Economics */}
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Deal Economics</p>
                  <div className="bg-card border border-border rounded-lg px-4">
                    <MetricRow label="Seed Check" value={firm.seedMax > 0 ? `$${firm.seedMin}–$${firm.seedMax}M` : "N/A"} icon={Target} />
                    <MetricRow label="Series A Check" value={firm.seriesAMax > 0 ? `$${firm.seriesAMin}–$${firm.seriesAMax}M` : "N/A"} icon={DollarSign} />
                    <MetricRow label="Dilution at Entry" value={firm.dilution > 0 ? `${firm.dilution}%` : "—"} benchmark="~20%" benchmarkLabel="Typical" higherIsBetter={false} icon={Percent} />
                    <MetricRow label="Time to Next Round" value={firm.timeNext > 0 ? `${firm.timeNext} mo` : "—"} benchmark={`${INDUSTRY_BENCHMARKS.medianTimeToSeriesA} mo`} benchmarkLabel="Industry" higherIsBetter={false} icon={Clock} />
                    <MetricRow label="Markup Multiple" value={firm.markup > 0 ? `${firm.markup}x` : "—"} benchmark={`${INDUSTRY_BENCHMARKS.medianStepUp}x`} benchmarkLabel="Industry" higherIsBetter={true} icon={Layers} />
                  </div>
                </div>

                {/* Sector Convictions (v2 — structured) */}
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Sector Convictions</p>
                  <div className="space-y-1.5">
                    {firm.sectorConvictions.map(sc => (
                      <div
                        key={sc.name}
                        className="flex items-center justify-between bg-card border border-border rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="text-[9px] font-mono px-2 py-0.5 rounded-full font-medium shrink-0"
                            style={{
                              backgroundColor: `${CONVICTION_COLORS[sc.conviction]}18`,
                              color: CONVICTION_COLORS[sc.conviction],
                              border: `1px solid ${CONVICTION_COLORS[sc.conviction]}40`,
                            }}
                          >
                            {sc.conviction}
                          </span>
                          <span className="text-sm text-foreground">{sc.name}</span>
                        </div>
                        {sc.dealShare != null && (
                          <div className="flex items-center gap-2">
                            <div className="w-14 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${sc.dealShare}%`, backgroundColor: CONVICTION_COLORS[sc.conviction] }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">~{sc.dealShare}%</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono mt-2">
                    Deal share = estimated % of recent portfolio in this sector.
                  </p>
                </div>

                {/* Stages */}
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Stage Coverage</p>
                  <div className="flex flex-wrap gap-1.5">
                    {firm.stages.map(s => (
                      <span key={s} className="px-2.5 py-1 bg-teal-100 text-teal-800 text-xs rounded-md font-medium">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Notable */}
                {firm.notable && (
                  <div className="border-t border-border pt-4">
                    <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Notable Performance</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{firm.notable}</p>
                  </div>
                )}

                {/* Geography */}
                <div className="border-t border-border pt-4 pb-2">
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Geography</p>
                  <span className="px-3 py-1 bg-secondary text-xs rounded-md font-mono">{firm.geo}</span>
                </div>
              </>
            )}

            {/* ── PERFORMANCE TAB ──────────────────────────────────────── */}
            {activeTab === "performance" && (
              <>
                {/* Interpretation note */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-800 leading-relaxed space-y-1">
                    <p>
                      <strong>TVPI</strong> (Total Value to Paid-In) includes unrealized paper markups.
                      It is the most commonly cited metric but can be misleading for recent funds.
                    </p>
                    <p>
                      <strong>DPI ★</strong> (Distributed to Paid-In) measures actual cash distributions
                      to LPs. For mature funds (7+ years), DPI is the most reliable performance indicator.
                      For younger funds, low DPI is expected and normal. A high TVPI with low DPI means
                      gains are still on paper — which is typical for recent vintages.
                    </p>
                    <p>
                      Always compare performance within the same <strong>vintage year</strong>.
                      A 2.0x TVPI is excellent for a 2022 fund but mediocre for a 2014 fund.
                    </p>
                  </div>
                </div>

                {/* Per-fund performance table */}
                {firm.fundPerformance && firm.fundPerformance.length > 0 ? (
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                      Fund-Level Performance
                    </p>
                    <div className="bg-card border border-border rounded-lg overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border bg-secondary/30">
                            <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Fund</th>
                            <th className="px-3 py-2.5 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Vintage</th>
                            <th className="px-3 py-2.5 text-right font-mono text-[10px] uppercase tracking-wider text-teal-600">TVPI</th>
                            <th className="px-3 py-2.5 text-right font-mono text-[10px] uppercase tracking-wider text-blue-600">DPI ★</th>
                            <th className="px-3 py-2.5 text-right font-mono text-[10px] uppercase tracking-wider text-muted-foreground">IRR</th>
                            <th className="px-3 py-2.5 text-right font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Src</th>
                          </tr>
                        </thead>
                        <tbody>
                          {firm.fundPerformance.map((fp, i) => (
                            <tr key={i} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                              <td className="px-4 py-2.5 font-medium text-foreground">{fp.fundName}</td>
                              <td className="px-3 py-2.5 text-center font-mono text-muted-foreground">{fp.vintage}</td>
                              <td className="px-3 py-2.5 text-right font-mono font-semibold text-teal-600">{fp.tvpi}</td>
                              <td className="px-3 py-2.5 text-right font-mono font-semibold text-blue-600">{fp.dpi}</td>
                              <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">{fp.irr}</td>
                              <td className="px-3 py-2.5 text-right">
                                <div className="group relative inline-block">
                                  <Info className="w-3 h-3 text-muted-foreground/40 cursor-help" />
                                  <div className="absolute right-0 top-4 z-30 hidden group-hover:block bg-card border border-border rounded p-2 text-[10px] text-muted-foreground w-48 shadow-lg leading-relaxed">
                                    {fp.source}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="px-4 py-2 bg-secondary/20 border-t border-border/50">
                        <p className="text-[9px] font-mono text-muted-foreground">
                          ★ Industry median DPI: {INDUSTRY_BENCHMARKS.medianDPI}x.
                          Hover the info icon for source details.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-card border border-dashed border-border rounded-lg p-6 text-center">
                    <p className="text-sm text-muted-foreground font-mono">Fund-level performance data not publicly disclosed</p>
                    {(firm.tvpi !== "N/A" || firm.irr !== "N/A") && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Legacy aggregate estimate — TVPI: {firm.tvpi}, IRR: {firm.irr}
                      </p>
                    )}
                  </div>
                )}

                {/* Operational metrics */}
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Operational Metrics</p>
                  <div className="bg-card border border-border rounded-lg px-4">
                    <MetricRow
                      label="Graduation Rate"
                      value={firm.gradRate > 0 ? `${firm.gradRate}%` : "—"}
                      benchmark={`${INDUSTRY_BENCHMARKS.seedGradRate}%`}
                      benchmarkLabel="Industry"
                      higherIsBetter={true}
                      icon={TrendingUp}
                      source="Graduation rate = % of portfolio companies that raised a follow-on round. Source: public portfolio data."
                    />
                    <MetricRow
                      label="Markup Multiple"
                      value={firm.markup > 0 ? `${firm.markup}x` : "—"}
                      benchmark={`${INDUSTRY_BENCHMARKS.medianStepUp}x`}
                      benchmarkLabel="Industry"
                      higherIsBetter={true}
                      icon={Layers}
                      source="Median step-up from seed to Series A for portfolio companies. Source: Carta / PitchBook data."
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── FOUNDER FIT TAB (new in v2) ──────────────────────────── */}
            {activeTab === "fit" && firm.founderFit && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex gap-2">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Founder Fit data helps founders assess whether a firm's operational style, ownership
                    requirements, and value-add match their specific needs. New in v2.
                  </p>
                </div>

                {/* Lead / Board */}
                <div className="bg-card border border-border rounded-lg p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-mono text-muted-foreground mb-1.5">Leads Rounds</p>
                      <div className="flex items-center gap-1.5">
                        {firm.founderFit.leadsRounds
                          ? <CheckCircle className="w-4 h-4 text-teal-600" />
                          : <XCircle className="w-4 h-4 text-slate-400" />
                        }
                        <span className="text-sm font-medium font-mono">
                          {firm.founderFit.leadsRounds ? "Leads rounds" : "Follows / participates"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-muted-foreground mb-1.5">Board Seat Policy</p>
                      <span className={`text-sm font-medium font-mono ${
                        firm.founderFit.boardSeat === "Always" ? "text-amber-600" :
                        firm.founderFit.boardSeat === "Usually" ? "text-amber-500" :
                        firm.founderFit.boardSeat === "Sometimes" ? "text-slate-600" : "text-slate-400"
                      }`}>
                        {firm.founderFit.boardSeat}
                      </span>
                    </div>
                  </div>

                  {/* Ownership target */}
                  <div>
                    <p className="text-[10px] font-mono text-muted-foreground mb-1.5">Target Ownership at Entry</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full"
                          style={{ width: `${(firm.founderFit.ownershipTargetMax / 30) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono font-semibold text-teal-700 shrink-0">
                        {firm.founderFit.ownershipTargetMin}–{firm.founderFit.ownershipTargetMax}%
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Industry typical for lead investors: 15–20% at Series A</p>
                  </div>

                  {/* Decision timeline */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <p className="text-[10px] font-mono text-muted-foreground">Decision Timeline</p>
                    </div>
                    <p className="text-sm font-mono font-semibold">
                      {firm.founderFit.decisionWeeks === 0
                        ? "Same day (accelerator model)"
                        : `~${firm.founderFit.decisionWeeks} week${firm.founderFit.decisionWeeks > 1 ? "s" : ""} from first meeting`
                      }
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Industry typical: 3–4 weeks</p>
                  </div>

                  {/* Pro-rata */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Pro-Rata Rights</p>
                    <div className="flex items-center gap-1.5">
                      {firm.founderFit.proRataFriendly
                        ? <CheckCircle className="w-4 h-4 text-teal-600" />
                        : <Info className="w-4 h-4 text-amber-500" />
                      }
                      <span className="text-xs font-mono font-medium">
                        {firm.founderFit.proRataFriendly ? "Flexible on pro-rata" : "Exercises pro-rata aggressively"}
                      </span>
                    </div>
                  </div>

                  {/* Value Add */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Zap className="w-3 h-3 text-muted-foreground" />
                      <p className="text-[10px] font-mono text-muted-foreground">Value-Add Categories</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {firm.founderFit.valueAdd.map(va => (
                        <span
                          key={va}
                          className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-full bg-secondary border border-border text-foreground"
                        >
                          <span>{VALUE_ADD_ICONS[va] ?? "•"}</span>
                          {va}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
