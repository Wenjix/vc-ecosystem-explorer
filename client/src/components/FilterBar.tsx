/*
 * Design: Swiss Data Cartography
 * - Compact filter bar with firm type, stage, and sector pills
 */
import { FIRM_TYPES, ALL_STAGES } from "@/lib/vcData";
import { SECTOR_PILLS } from "@/components/SectorActivityChart";

interface FilterBarProps {
  filterType: string;
  setFilterType: (v: string) => void;
  filterStage: string;
  setFilterStage: (v: string) => void;
  filterSector: string;
  setFilterSector: (v: string) => void;
  firmCount: number;
}

export default function FilterBar({
  filterType, setFilterType,
  filterStage, setFilterStage,
  filterSector, setFilterSector,
  firmCount
}: FilterBarProps) {
  const hasFilters = filterType !== "All" || filterStage !== "All" || filterSector !== "All";

  return (
    <div className="bg-card border border-border rounded-lg px-5 py-4 space-y-3">
      {/* Row 1: Type + Stage dropdowns */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground whitespace-nowrap">Firm Type</label>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="text-sm bg-background border border-border rounded-md px-3 py-1.5 text-foreground focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors outline-none"
          >
            <option value="All">All Types</option>
            {FIRM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground whitespace-nowrap">Stage</label>
          <select
            value={filterStage}
            onChange={e => setFilterStage(e.target.value)}
            className="text-sm bg-background border border-border rounded-md px-3 py-1.5 text-foreground focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors outline-none"
          >
            <option value="All">All Stages</option>
            {ALL_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {hasFilters && (
          <button
            onClick={() => { setFilterType("All"); setFilterStage("All"); setFilterSector("All"); }}
            className="text-[10px] font-mono text-teal-600 hover:text-teal-800 underline underline-offset-2 transition-colors"
          >
            Clear all filters
          </button>
        )}
        <div className="ml-auto flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          <span className="text-xs font-mono text-muted-foreground">{firmCount} firms</span>
        </div>
      </div>

      {/* Row 2: Sector pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/50">
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground shrink-0">Sector</span>
        <button
          onClick={() => setFilterSector("All")}
          className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all border ${
            filterSector === "All"
              ? "bg-foreground text-background border-foreground"
              : "bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        {SECTOR_PILLS.map(pill => (
          <button
            key={pill.key}
            onClick={() => setFilterSector(filterSector === pill.key ? "All" : pill.key)}
            className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all border ${
              filterSector === pill.key
                ? "text-white border-transparent shadow-sm"
                : "bg-background text-muted-foreground border-border hover:text-foreground"
            }`}
            style={filterSector === pill.key ? { backgroundColor: pill.color, borderColor: pill.color } : {}}
          >
            {pill.label}
          </button>
        ))}
      </div>
    </div>
  );
}
