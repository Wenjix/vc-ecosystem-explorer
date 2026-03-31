/*
 * Design: Swiss Data Cartography
 * - Pill-style sector selector with teal/color-coded accents
 * - Monospace labels, subtle hover states
 */
import { motion } from "framer-motion";
import { SECTOR_PILLS } from "@/components/SectorActivityChart";

interface Props {
  activeSector: string;
  onSectorChange: (sector: string) => void;
  filterSector: string;
  onFilterSectorChange: (sector: string) => void;
}

export default function SectorFilter({ activeSector, onSectorChange, filterSector, onFilterSectorChange }: Props) {
  return (
    <div className="space-y-3">
      {/* Global filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground shrink-0">Filter All Views:</span>
        <button
          onClick={() => onFilterSectorChange("All")}
          className={`px-3 py-1 rounded-full text-xs font-mono transition-all border ${
            filterSector === "All"
              ? "bg-foreground text-background border-foreground"
              : "bg-card text-muted-foreground border-border hover:border-foreground hover:text-foreground"
          }`}
        >
          All Sectors
        </button>
        {SECTOR_PILLS.map(pill => (
          <button
            key={pill.key}
            onClick={() => onFilterSectorChange(filterSector === pill.key ? "All" : pill.key)}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all border ${
              filterSector === pill.key
                ? "text-white border-transparent shadow-sm"
                : "bg-card text-muted-foreground border-border hover:text-foreground"
            }`}
            style={filterSector === pill.key ? { backgroundColor: pill.color, borderColor: pill.color } : {}}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Sector explorer row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground shrink-0">Explore Sector:</span>
        {SECTOR_PILLS.map(pill => (
          <motion.button
            key={pill.key}
            onClick={() => onSectorChange(pill.key)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all border ${
              activeSector === pill.key
                ? "text-white border-transparent shadow-md"
                : "bg-card text-muted-foreground border-border hover:text-foreground"
            }`}
            style={activeSector === pill.key ? { backgroundColor: pill.color, borderColor: pill.color } : {}}
          >
            {pill.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
