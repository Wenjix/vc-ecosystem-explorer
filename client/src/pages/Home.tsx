/*
 * Design: Swiss Data Cartography
 * - Strict grid, high contrast charcoal on white, teal/emerald accent
 * - Instrument Sans headings, DM Sans body, JetBrains Mono data
 * - Full-width analytical sections with sticky nav tabs
 */
import { useState, useMemo, useEffect } from "react";
import { VC_DATA, INDUSTRY_BENCHMARKS, ALL_STAGES, type VCFirm } from "@/lib/vcData";
import HeroSection from "@/components/HeroSection";
import NavBar from "@/components/NavBar";
import EcosystemBubble from "@/components/EcosystemBubble";
import CheckSizeChart from "@/components/CheckSizeChart";
import GraduationChart from "@/components/GraduationChart";
import PerformanceTable from "@/components/PerformanceTable";
import FirmDetailDrawer from "@/components/FirmDetailDrawer";
import StageMap from "@/components/StageMap";
import ComparePanel from "@/components/ComparePanel";
import FilterBar from "@/components/FilterBar";
import Footer from "@/components/Footer";
import SectorActivityChart from "@/components/SectorActivityChart";
import TimelineView from "@/components/TimelineView";
import { A16zPremiumView } from "@/components/A16zPremiumView";

// Sector keyword mapping for filtering (mirrors SectorActivityChart)
const SECTOR_KEYWORDS: Record<string, string[]> = {
  AI:            ["AI", "Machine Learning", "ML"],
  SaaS:          ["SaaS", "Cloud", "Software", "Developer Tools"],
  Crypto:        ["Crypto", "Web3", "DeFi", "Blockchain", "Bitcoin"],
  Enterprise:    ["Enterprise", "B2B"],
  Fintech:       ["Fintech", "Finance", "Payments"],
  Consumer:      ["Consumer", "Media", "Commerce", "Creator Economy", "Gaming"],
  Healthcare:    ["Healthcare", "Health", "Life Sciences", "Bio", "Biotech"],
  "Deep Tech":   ["Deep Tech", "Frontier", "Robotics", "Aerospace", "Energy"],
  Defense:       ["Defense", "American Dynamism"],
  Climate:       ["Climate", "Sustainability", "Cleantech"],
  Web3:          ["Web3", "DeFi", "Crypto", "Blockchain"],
  Cybersecurity: ["Cybersecurity", "Security"],
};

function firmMatchesSector(firm: VCFirm, sectorKey: string): boolean {
  const keywords = SECTOR_KEYWORDS[sectorKey] ?? [sectorKey];
  return firm.sectors.some(s => keywords.some(k => s.toLowerCase().includes(k.toLowerCase())));
}

export type Section = "overview" | "sectors" | "checksizes" | "graduation" | "performance" | "stages" | "compare" | "timeline" | "a16zpremium";

const SECTION_IDS: Section[] = ["overview", "sectors", "checksizes", "graduation", "performance", "stages", "compare", "timeline", "a16zpremium"];

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [selectedFirm, setSelectedFirm] = useState<VCFirm | null>(null);
  const [compareFirms, setCompareFirms] = useState<string[]>(["a16z", "Sequoia"]);
  const [filterType, setFilterType] = useState<string>("All");
  const [filterStage, setFilterStage] = useState<string>("All");
  const [filterSector, setFilterSector] = useState<string>("All");
  const [activeSector, setActiveSector] = useState<string>("AI");

  // Intersection observer for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as Section);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // When sector filter changes, also update the sector explorer tab
  const handleFilterSectorChange = (sector: string) => {
    setFilterSector(sector);
    if (sector !== "All") setActiveSector(sector);
  };

  const filteredData = useMemo(() => {
    return VC_DATA.filter(f => {
      if (filterType !== "All" && f.type !== filterType) return false;
      if (filterStage !== "All" && !f.stages.includes(filterStage)) return false;
      if (filterSector !== "All" && !firmMatchesSector(f, filterSector)) return false;
      return true;
    });
  }, [filterType, filterStage, filterSector]);

  const toggleCompare = (short: string) => {
    setCompareFirms(prev =>
      prev.includes(short)
        ? prev.filter(s => s !== short)
        : prev.length < 5
        ? [...prev, short]
        : prev
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar activeSection={activeSection} onSectionChange={setActiveSection} />
      <HeroSection />

      <div className="container py-8">
        <FilterBar
          filterType={filterType}
          setFilterType={setFilterType}
          filterStage={filterStage}
          setFilterStage={setFilterStage}
          filterSector={filterSector}
          setFilterSector={handleFilterSectorChange}
          firmCount={filteredData.length}
        />
      </div>

      {/* Overview — Ecosystem Bubble Map */}
      <section id="overview" className="container py-12">
        <div className="mb-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-teal-600 mb-2">Ecosystem Map</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
            The Venture Capital Landscape
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
            Each bubble represents a firm. Size encodes AUM, position maps check size vs. deal velocity. Click any firm to explore its profile.
          </p>
        </div>
        <EcosystemBubble data={filteredData} onSelect={setSelectedFirm} compareFirms={compareFirms} onToggleCompare={toggleCompare} />
      </section>

      {/* Sector Analysis */}
      <section id="sectors" className="py-16 bg-secondary/30">
        <div className="container">
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-teal-600 mb-2">Sector Intelligence</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
              Sector Activity by Firm
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
              Drill into any sector to see which firms are most active, their depth of focus, and key metrics. Select a sector below to explore.
            </p>
          </div>

          {/* Sector pill selector */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { key: "AI", label: "AI", color: "#0d9488" },
              { key: "SaaS", label: "SaaS", color: "#0891b2" },
              { key: "Crypto", label: "Crypto / Web3", color: "#6366f1" },
              { key: "Enterprise", label: "Enterprise", color: "#2563eb" },
              { key: "Fintech", label: "Fintech", color: "#d97706" },
              { key: "Consumer", label: "Consumer", color: "#f59e0b" },
              { key: "Healthcare", label: "Healthcare", color: "#059669" },
              { key: "Deep Tech", label: "Deep Tech", color: "#7c3aed" },
              { key: "Defense", label: "Defense", color: "#dc2626" },
              { key: "Climate", label: "Climate", color: "#16a34a" },
              { key: "Cybersecurity", label: "Cybersecurity", color: "#64748b" },
            ].map(pill => (
              <button
                key={pill.key}
                onClick={() => setActiveSector(pill.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-mono transition-all border ${
                  activeSector === pill.key
                    ? "text-white border-transparent shadow-md"
                    : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-current"
                }`}
                style={activeSector === pill.key ? { backgroundColor: pill.color, borderColor: pill.color } : {}}
              >
                {pill.label}
              </button>
            ))}
          </div>

          <SectorActivityChart activeSector={activeSector} onSelect={setSelectedFirm} />
        </div>
      </section>

      {/* Check Sizes */}
      <section id="checksizes" className="container py-16">
        <div className="mb-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-teal-600 mb-2">Deal Economics</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
            Seed & Series A Check Sizes
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
            Comparing typical investment ranges across firms. The industry median seed round is ${INDUSTRY_BENCHMARKS.seedMedianRound}M and Series A is ${INDUSTRY_BENCHMARKS.seriesAMedianRound}M.
            {filterSector !== "All" && <span className="text-teal-600 font-medium"> Filtered to {filterSector} firms.</span>}
          </p>
        </div>
        <CheckSizeChart data={filteredData} onSelect={setSelectedFirm} />
      </section>

      {/* Graduation Rates */}
      <section id="graduation" className="py-16 bg-secondary/30">
        <div className="container">
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-teal-600 mb-2">Performance Metrics</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
              Portfolio Graduation & Velocity
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
              How quickly and successfully do portfolio companies progress? Industry average seed-to-Series A graduation is ~{INDUSTRY_BENCHMARKS.seedGradRate}%.
              {filterSector !== "All" && <span className="text-teal-600 font-medium"> Filtered to {filterSector} firms.</span>}
            </p>
          </div>
          <GraduationChart data={filteredData} />
        </div>
      </section>

      {/* Performance Table */}
      <section id="performance" className="container py-16">
        <div className="mb-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-teal-600 mb-2">Fund Returns</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
            Comprehensive Firm Comparison
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
            Sortable table of all firms with key metrics. Click any row for detailed analysis.
            {filterSector !== "All" && <span className="text-teal-600 font-medium"> Showing {filteredData.length} firms active in {filterSector}.</span>}
          </p>
        </div>
        <PerformanceTable data={filteredData} onSelect={setSelectedFirm} compareFirms={compareFirms} onToggleCompare={toggleCompare} />
      </section>

      {/* Stage Map */}
      <section id="stages" className="py-16 bg-secondary/30">
        <div className="container">
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-teal-600 mb-2">Stage Coverage</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
              Investment Stage Heatmap
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
              Where each firm plays across the startup lifecycle, from pre-seed through buyout.
            </p>
          </div>
          <StageMap data={filteredData} onSelect={setSelectedFirm} />
        </div>
      </section>

      {/* Compare Panel */}
      <section id="compare" className="container py-16">
        <div className="mb-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-teal-600 mb-2">Head-to-Head</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
            Firm Comparison Tool
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
            Select up to 5 firms to compare side-by-side across all metrics.
          </p>
        </div>
        <ComparePanel compareFirms={compareFirms} onToggleCompare={toggleCompare} />
      </section>

      {/* Timeline View */}
      <section id="timeline" className="py-16 bg-secondary/30">
        <div className="container">
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-teal-600 mb-2">Historical Trends</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
              Check Size &amp; Velocity Timeline
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
              How each firm's seed check sizes, Series A investments, and deal velocity evolved from 2020 through 2026 — across the ZIRP boom, the 2022 correction, and the AI-driven recovery.
            </p>
          </div>
          <TimelineView />
        </div>
      </section>

      {/* a16z Premium Analysis */}
      <section id="a16zpremium" className="container py-16">
        <A16zPremiumView />
      </section>

      <Footer />

      {selectedFirm && (
        <FirmDetailDrawer firm={selectedFirm} onClose={() => setSelectedFirm(null)} />
      )}
    </div>
  );
}
