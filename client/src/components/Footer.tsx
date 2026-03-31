import { VC_DATA, ALL_STAGES } from "@/lib/vcData";

const SECTION_PATTERN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663363495483/QPbzCZxS4jnMm4bKZUvB72/section-pattern-7BbW9xpe5cwzC9YHXttBXf.webp";

export default function Footer() {
  return (
    <footer className="relative border-t border-border py-16 mt-8 overflow-hidden">
      {/* Subtle pattern bg */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url(${SECTION_PATTERN})`, backgroundSize: "300px" }} />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-600" />
              <span className="font-semibold text-sm" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>VC Ecosystem Explorer</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mb-4">
              Interactive analysis of seed and Series A financing across {VC_DATA.length} tier-1 venture capital firms. Data sourced from PitchBook, Carta, Crunchbase, NVCA, Cambridge Associates, and public filings.
            </p>
            <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
              <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded">{VC_DATA.length} Firms</span>
              <span className="px-2 py-0.5 bg-secondary rounded">{ALL_STAGES.length} Stages</span>
              <span className="px-2 py-0.5 bg-secondary rounded">12+ Metrics</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">Data Sources</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-teal-500" />
                PitchBook-NVCA Venture Monitor Q4 2025
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-teal-500" />
                Carta State of Private Markets
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-teal-500" />
                Cambridge Associates US VC Benchmark
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-teal-500" />
                Crunchbase, UTIMCO Public Disclosures
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-teal-500" />
                Newcomer, The Information, Not Boring
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">Methodology</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All metrics represent estimates based on publicly available data as of Q1 2026. Check sizes reflect typical ranges, not absolute limits. Graduation rates and pacing metrics are approximations based on portfolio analysis and industry reports. Fund performance data (TVPI, IRR) is sourced from public LP disclosures (UTIMCO, CalPERS) and industry reporting. Different metrics draw from different sources — not all sources cover all firms or all metrics uniformly.
            </p>
          </div>
        </div>
        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] font-mono text-muted-foreground">Interactive Analysis — March 2026</p>
          <p className="text-[10px] font-mono text-muted-foreground">Data as of Q1 2026 | All figures are estimates</p>
        </div>
      </div>
    </footer>
  );
}
