/*
 * Swiss Data Cartography: Minimal sticky nav with section tabs
 * Thin ruled line separator, small-caps labels
 */
import type { Section } from "@/pages/Home";
import { motion } from "framer-motion";

const SECTIONS: { id: Section; label: string }[] = [
  { id: "overview", label: "Ecosystem" },
  { id: "sectors", label: "Sectors" },
  { id: "checksizes", label: "Check Sizes" },
  { id: "graduation", label: "Graduation" },
  { id: "performance", label: "Data Table" },
  { id: "stages", label: "Stage Map" },
  { id: "compare", label: "Compare" },
  { id: "timeline", label: "Timeline" },
  { id: "a16zpremium", label: "a16z Premium" },
];

interface NavBarProps {
  activeSection: Section;
  onSectionChange: (s: Section) => void;
}

export default function NavBar({ activeSection, onSectionChange }: NavBarProps) {
  const scrollTo = (id: Section) => {
    onSectionChange(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-14">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
          <span className="font-semibold text-sm tracking-tight hidden sm:inline" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
            VC Explorer
          </span>
        </div>
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="relative px-2.5 sm:px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors whitespace-nowrap"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.1em" }}
            >
              <span className={activeSection === s.id ? "text-teal-700 font-semibold" : "text-muted-foreground hover:text-foreground"}>
                {s.label}
              </span>
              {activeSection === s.id && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-1 right-1 h-0.5 bg-teal-600 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
