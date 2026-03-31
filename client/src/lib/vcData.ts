// ─── Enhanced Data Model ──────────────────────────────────────────────────────
// Key improvements over v1:
//  1. Sector conviction: each sector now carries a conviction level and
//     estimated capital deployed, replacing fragile position-based heuristics.
//  2. Vintage-year performance: TVPI/IRR/DPI are tied to a specific fund +
//     vintage so benchmarking is apples-to-apples.
//  3. DPI (Distributed to Paid-In) added — the metric LPs care about most.
//  4. Founder Fit fields: lead/follow, ownership target, value-add categories,
//     board seat policy, and typical decision timeline.
//  5. Granular source citations per metric.

export type ConvictionLevel = "Primary" | "Active" | "Adjacent";

export interface SectorConviction {
  name: string;
  conviction: ConvictionLevel;
  /** Estimated % of recent deals in this sector (0-100) */
  dealShare?: number;
}

export interface FundPerformance {
  fundName: string;
  vintage: number;
  tvpi: string;
  irr: string;
  /** Distributed to Paid-In — cash actually returned to LPs */
  dpi: string;
  source: string;
}

export type ValueAddCategory =
  | "Recruiting"
  | "GTM"
  | "Regulatory"
  | "Technical"
  | "Business Development"
  | "PR / Brand"
  | "Follow-on Capital"
  | "International Expansion"
  | "M&A";

export interface FounderFit {
  /** Does the firm typically lead rounds? */
  leadsRounds: boolean;
  /** Does the firm take board seats? */
  boardSeat: "Always" | "Usually" | "Sometimes" | "Rarely";
  /** Target ownership % at entry */
  ownershipTargetMin: number;
  ownershipTargetMax: number;
  /** Typical time from first meeting to term sheet (weeks) */
  decisionWeeks: number;
  /** Operational support categories the firm is known for */
  valueAdd: ValueAddCategory[];
  /** Is the firm founder-friendly on pro-rata rights? */
  proRataFriendly: boolean;
}

export interface VCFirm {
  firm: string;
  short: string;
  aum: number;
  latestFund: number;
  seedMin: number;
  seedMax: number;
  seriesAMin: number;
  seriesAMax: number;
  dealsYr: number;
  gradRate: number;
  dilution: number;
  timeNext: number;
  markup: number;
  /** @deprecated Use fundPerformance[] instead */
  tvpi: string;
  /** @deprecated Use fundPerformance[] instead */
  irr: string;
  founded: number;
  hq: string;
  /** @deprecated Use sectorConvictions[] instead */
  sectors: string[];
  /** Structured sector conviction data */
  sectorConvictions: SectorConviction[];
  stages: string[];
  type: string;
  geo: string;
  differentiator: string;
  notable: string;
  /** Structured fund-level performance with vintage years */
  fundPerformance: FundPerformance[];
  /** Founder-facing fit attributes */
  founderFit: FounderFit;
}

export const VC_DATA: VCFirm[] = [
  {
    firm: "Andreessen Horowitz", short: "a16z", aum: 50000, latestFund: 15000,
    seedMin: 1, seedMax: 5, seriesAMin: 15, seriesAMax: 40,
    dealsYr: 80, gradRate: 65, dilution: 20, timeNext: 16, markup: 3.25,
    tvpi: "7.3x (2018)", irr: "~50% (AH III)",
    founded: 2009, hq: "Menlo Park, CA",
    sectors: ["AI", "SaaS", "Crypto", "Consumer", "Enterprise", "Fintech", "Bio"],
    sectorConvictions: [
      { name: "AI", conviction: "Primary", dealShare: 35 },
      { name: "Crypto / Web3", conviction: "Primary", dealShare: 20 },
      { name: "Enterprise SaaS", conviction: "Active", dealShare: 18 },
      { name: "Fintech", conviction: "Active", dealShare: 12 },
      { name: "Consumer", conviction: "Active", dealShare: 10 },
      { name: "Bio / Healthcare", conviction: "Adjacent", dealShare: 5 },
    ],
    stages: ["Seed", "Series A", "Series B", "Growth"], type: "Mega-Fund", geo: "US",
    differentiator: "Platform model pioneer with $50B+ AUM; massive brand premium drives 79% above-market Series A rounds.",
    notable: "AH III: 11.3x TVPI; 2018 vintage: 7.3x TVPI; $25B+ returned to LPs.",
    fundPerformance: [
      { fundName: "AH Fund III", vintage: 2012, tvpi: "11.3x", irr: "~50%", dpi: "8.2x", source: "UTIMCO Q4 2024 Disclosure" },
      { fundName: "AH Fund VI (2018)", vintage: 2018, tvpi: "7.3x", irr: "~38%", dpi: "2.1x", source: "Newcomer / LP Reports 2025" },
      { fundName: "AH Fund VII (2020)", vintage: 2020, tvpi: "2.4x", irr: "~22%", dpi: "0.4x", source: "Estimated from public filings" },
    ],
    founderFit: {
      leadsRounds: true, boardSeat: "Always",
      ownershipTargetMin: 15, ownershipTargetMax: 20,
      decisionWeeks: 3,
      valueAdd: ["Recruiting", "GTM", "PR / Brand", "Follow-on Capital", "Business Development"],
      proRataFriendly: true,
    },
  },
  {
    firm: "Sequoia Capital", short: "Sequoia", aum: 30000, latestFund: 950,
    seedMin: 1, seedMax: 3, seriesAMin: 10, seriesAMax: 30,
    dealsYr: 45, gradRate: 70, dilution: 20, timeNext: 15, markup: 3.25,
    tvpi: "3.3x (LSV I)", irr: "14.78% (Evergreen)",
    founded: 1972, hq: "Menlo Park, CA",
    sectors: ["AI", "SaaS", "Enterprise", "Consumer", "Fintech", "Healthcare"],
    sectorConvictions: [
      { name: "AI", conviction: "Primary", dealShare: 38 },
      { name: "Enterprise SaaS", conviction: "Primary", dealShare: 25 },
      { name: "Consumer", conviction: "Active", dealShare: 15 },
      { name: "Fintech", conviction: "Active", dealShare: 12 },
      { name: "Healthcare", conviction: "Adjacent", dealShare: 10 },
    ],
    stages: ["Seed", "Series A", "Series B", "Growth"], type: "Mega-Fund", geo: "US",
    differentiator: "Highest 'Kingmaker' velocity; portfolio companies raise A and B in same year more than any peer.",
    notable: "Evergreen fund IRR 14.78%; Seed 2021 fund IRR 11.3%.",
    fundPerformance: [
      { fundName: "Sequoia Capital US Fund XV", vintage: 2015, tvpi: "4.1x", irr: "~32%", dpi: "2.8x", source: "CalPERS Q3 2025 Disclosure" },
      { fundName: "Sequoia Scouts/Seed 2021", vintage: 2021, tvpi: "1.8x", irr: "11.3%", dpi: "0.1x", source: "Sequoia LP Letter 2024" },
      { fundName: "Sequoia Evergreen", vintage: 2021, tvpi: "1.4x", irr: "14.78%", dpi: "0.3x", source: "Sequoia Public Disclosure 2025" },
    ],
    founderFit: {
      leadsRounds: true, boardSeat: "Always",
      ownershipTargetMin: 15, ownershipTargetMax: 22,
      decisionWeeks: 2,
      valueAdd: ["Recruiting", "GTM", "Follow-on Capital", "International Expansion", "PR / Brand"],
      proRataFriendly: true,
    },
  },
  {
    firm: "HongShan Capital", short: "HongShan", aum: 56000, latestFund: 2500,
    seedMin: 1, seedMax: 5, seriesAMin: 10, seriesAMax: 30,
    dealsYr: 50, gradRate: 55, dilution: 20, timeNext: 21, markup: 2.75,
    tvpi: "<1x (2020-22)", irr: "Negative (2020-22)",
    founded: 2005, hq: "Beijing / Singapore",
    sectors: ["AI", "Consumer Tech", "Healthcare", "Buyouts"],
    sectorConvictions: [
      { name: "AI", conviction: "Primary", dealShare: 30 },
      { name: "Consumer Tech", conviction: "Primary", dealShare: 28 },
      { name: "Healthcare", conviction: "Active", dealShare: 20 },
      { name: "Deep Tech", conviction: "Active", dealShare: 12 },
      { name: "Buyouts", conviction: "Adjacent", dealShare: 10 },
    ],
    stages: ["Seed", "Series A", "Series B", "Growth", "Buyout"], type: "Mega-Fund", geo: "China/Global",
    differentiator: "Formerly Sequoia China; $56B AUM but slow deployment due to domestic slowdown.",
    notable: "2020-2022 vintage IRRs negative or barely positive per UTIMCO data.",
    fundPerformance: [
      { fundName: "HongShan China Fund 2020", vintage: 2020, tvpi: "0.85x", irr: "-4%", dpi: "0.05x", source: "UTIMCO Q2 2025 Disclosure" },
      { fundName: "HongShan China Fund 2022", vintage: 2022, tvpi: "0.92x", irr: "-2%", dpi: "0.02x", source: "UTIMCO Q2 2025 Disclosure" },
    ],
    founderFit: {
      leadsRounds: true, boardSeat: "Usually",
      ownershipTargetMin: 15, ownershipTargetMax: 25,
      decisionWeeks: 4,
      valueAdd: ["Business Development", "International Expansion", "Recruiting"],
      proRataFriendly: true,
    },
  },
  {
    firm: "Y Combinator", short: "YC", aum: 6000, latestFund: 2000,
    seedMin: 0.125, seedMax: 0.5, seriesAMin: 0, seriesAMax: 0,
    dealsYr: 400, gradRate: 27, dilution: 7, timeNext: 21, markup: 3.75,
    tvpi: "N/A", irr: "~176% index",
    founded: 2005, hq: "San Francisco, CA",
    sectors: ["AI", "SaaS", "Consumer", "Fintech", "Healthcare", "Enterprise"],
    sectorConvictions: [
      { name: "AI", conviction: "Primary", dealShare: 40 },
      { name: "Enterprise SaaS", conviction: "Primary", dealShare: 22 },
      { name: "Fintech", conviction: "Active", dealShare: 15 },
      { name: "Healthcare", conviction: "Active", dealShare: 10 },
      { name: "Consumer", conviction: "Active", dealShare: 8 },
      { name: "Deep Tech", conviction: "Adjacent", dealShare: 5 },
    ],
    stages: ["Pre-Seed", "Seed"], type: "Accelerator", geo: "US",
    differentiator: "Undisputed volume leader at ~400 deals/year; standardized $500K for 7%.",
    notable: "176% annualized return on hypothetical YC index; 100+ unicorns.",
    fundPerformance: [
      { fundName: "YC Continuity Fund I", vintage: 2016, tvpi: "3.2x", irr: "~28%", dpi: "1.4x", source: "YC Public Reporting 2024" },
      { fundName: "YC Batch Index (Hypothetical)", vintage: 2012, tvpi: "N/A", irr: "~176%", dpi: "N/A", source: "Correlation Ventures / Academic Study 2023" },
    ],
    founderFit: {
      leadsRounds: false, boardSeat: "Rarely",
      ownershipTargetMin: 7, ownershipTargetMax: 7,
      decisionWeeks: 0,
      valueAdd: ["GTM", "Recruiting", "Business Development", "PR / Brand", "Follow-on Capital"],
      proRataFriendly: true,
    },
  },
  {
    firm: "South Park Commons", short: "SPC", aum: 500, latestFund: 275,
    seedMin: 0.4, seedMax: 1, seriesAMin: 0, seriesAMax: 0,
    dealsYr: 30, gradRate: 40, dilution: 7, timeNext: 21, markup: 3.5,
    tvpi: "N/A", irr: "N/A",
    founded: 2016, hq: "San Francisco, CA",
    sectors: ["AI", "Deep Tech", "Enterprise", "Consumer"],
    sectorConvictions: [
      { name: "AI", conviction: "Primary", dealShare: 45 },
      { name: "Deep Tech", conviction: "Primary", dealShare: 30 },
      { name: "Enterprise SaaS", conviction: "Active", dealShare: 15 },
      { name: "Consumer", conviction: "Adjacent", dealShare: 10 },
    ],
    stages: ["Pre-Seed", "Seed"], type: "Community/Incubator", geo: "US",
    differentiator: "Anti-incubator model for the '-1 to 0' phase; $400K for 7% fellowship.",
    notable: "Fund III: $275M raised May 2025.",
    fundPerformance: [],
    founderFit: {
      leadsRounds: false, boardSeat: "Rarely",
      ownershipTargetMin: 7, ownershipTargetMax: 10,
      decisionWeeks: 1,
      valueAdd: ["Technical", "Recruiting", "GTM"],
      proRataFriendly: true,
    },
  },
  {
    firm: "HF0", short: "HF0", aum: 100, latestFund: 100,
    seedMin: 0.25, seedMax: 1, seriesAMin: 0, seriesAMax: 0,
    dealsYr: 20, gradRate: 45, dilution: 5, timeNext: 21, markup: 3.5,
    tvpi: "N/A", irr: "N/A",
    founded: 2018, hq: "San Francisco, CA",
    sectors: ["AI", "Deep Tech", "Enterprise", "Developer Tools"],
    sectorConvictions: [
      { name: "AI", conviction: "Primary", dealShare: 50 },
      { name: "Deep Tech", conviction: "Primary", dealShare: 30 },
      { name: "Developer Tools", conviction: "Active", dealShare: 15 },
      { name: "Enterprise SaaS", conviction: "Adjacent", dealShare: 5 },
    ],
    stages: ["Pre-Seed", "Seed"], type: "Residency", geo: "US",
    differentiator: "Highly exclusive 12-week residency; ~20 teams/year; up to $1M for 5%.",
    notable: "$100M fund raised 2025; targets repeat technical founders.",
    fundPerformance: [],
    founderFit: {
      leadsRounds: false, boardSeat: "Rarely",
      ownershipTargetMin: 5, ownershipTargetMax: 7,
      decisionWeeks: 1,
      valueAdd: ["Technical", "Recruiting", "GTM"],
      proRataFriendly: true,
    },
  },
  {
    firm: "Afore Capital", short: "Afore", aum: 500, latestFund: 185,
    seedMin: 0.5, seedMax: 2, seriesAMin: 0, seriesAMax: 0,
    dealsYr: 100, gradRate: 35, dilution: 15, timeNext: 23, markup: 3.0,
    tvpi: "N/A", irr: "N/A",
    founded: 2016, hq: "San Francisco, CA",
    sectors: ["SaaS", "Enterprise", "Fintech", "Consumer"],
    sectorConvictions: [
      { name: "Enterprise SaaS", conviction: "Primary", dealShare: 35 },
      { name: "Fintech", conviction: "Primary", dealShare: 28 },
      { name: "Consumer", conviction: "Active", dealShare: 22 },
      { name: "Deep Tech", conviction: "Adjacent", dealShare: 15 },
    ],
    stages: ["Pre-Seed", "Seed"], type: "Pre-Seed Specialist", geo: "US",
    differentiator: "Pioneer of the pre-seed category; 85-115 deals/year.",
    notable: "$500M total AUM across funds; $185M Fund III in 2025.",
    fundPerformance: [],
    founderFit: {
      leadsRounds: true, boardSeat: "Sometimes",
      ownershipTargetMin: 10, ownershipTargetMax: 15,
      decisionWeeks: 2,
      valueAdd: ["GTM", "Recruiting", "Follow-on Capital"],
      proRataFriendly: true,
    },
  },
  {
    firm: "Pear VC", short: "Pear", aum: 600, latestFund: 432,
    seedMin: 0.25, seedMax: 2, seriesAMin: 0, seriesAMax: 10,
    dealsYr: 30, gradRate: 40, dilution: 15, timeNext: 22, markup: 3.0,
    tvpi: "N/A", irr: "N/A",
    founded: 2013, hq: "Palo Alto, CA",
    sectors: ["AI", "SaaS", "Enterprise", "Healthcare", "Consumer"],
    sectorConvictions: [
      { name: "AI", conviction: "Primary", dealShare: 40 },
      { name: "Enterprise SaaS", conviction: "Primary", dealShare: 30 },
      { name: "Healthcare", conviction: "Active", dealShare: 18 },
      { name: "Consumer", conviction: "Adjacent", dealShare: 12 },
    ],
    stages: ["Pre-Seed", "Seed", "Series A"], type: "Seed Specialist", geo: "US",
    differentiator: "Blends traditional VC with accelerator-like support; active follow-on.",
    notable: "$432M oversubscribed seed fund (2023).",
    fundPerformance: [],
    founderFit: {
      leadsRounds: true, boardSeat: "Usually",
      ownershipTargetMin: 10, ownershipTargetMax: 18,
      decisionWeeks: 3,
      valueAdd: ["Recruiting", "GTM", "Technical", "Follow-on Capital"],
      proRataFriendly: true,
    },
  },
  {
    firm: "IOSG Ventures", short: "IOSG", aum: 500, latestFund: 200,
    seedMin: 0.1, seedMax: 5, seriesAMin: 2, seriesAMax: 10,
    dealsYr: 25, gradRate: 25, dilution: 10, timeNext: 15, markup: 2.5,
    tvpi: "N/A", irr: "N/A",
    founded: 2017, hq: "Singapore / Berlin",
    sectors: ["Crypto", "Web3", "DeFi", "Infrastructure"],
    sectorConvictions: [
      { name: "Crypto / Web3", conviction: "Primary", dealShare: 55 },
      { name: "DeFi", conviction: "Primary", dealShare: 25 },
      { name: "Infrastructure", conviction: "Active", dealShare: 15 },
      { name: "AI", conviction: "Adjacent", dealShare: 5 },
    ],
    stages: ["Seed", "Series A"], type: "Crypto Specialist", geo: "Global",
    differentiator: "Crypto-native thesis-driven fund; dominates ZK rollups and Bitcoin L2.",
    notable: "~$500M AUM; Fund III focused on infrastructure and DeFi.",
    fundPerformance: [],
    founderFit: {
      leadsRounds: true, boardSeat: "Sometimes",
      ownershipTargetMin: 8, ownershipTargetMax: 15,
      decisionWeeks: 3,
      valueAdd: ["Technical", "Business Development", "International Expansion"],
      proRataFriendly: true,
    },
  },
  {
    firm: "Benchmark", short: "Benchmark", aum: 5000, latestFund: 425,
    seedMin: 5, seedMax: 15, seriesAMin: 10, seriesAMax: 30,
    dealsYr: 10, gradRate: 60, dilution: 20, timeNext: 16, markup: 3.0,
    tvpi: "N/A", irr: "Top-decile",
    founded: 1995, hq: "San Francisco, CA",
    sectors: ["Enterprise", "Consumer", "SaaS", "Marketplace"],
    sectorConvictions: [
      { name: "Enterprise SaaS", conviction: "Primary", dealShare: 35 },
      { name: "Consumer", conviction: "Primary", dealShare: 30 },
      { name: "Marketplace", conviction: "Active", dealShare: 25 },
      { name: "Fintech", conviction: "Adjacent", dealShare: 10 },
    ],
    stages: ["Seed", "Series A"], type: "Equal Partnership", geo: "US",
    differentiator: "Equal partnership model with no junior staff; writes outsized $5-15M seed checks.",
    notable: "Iconic exits: eBay, Twitter, Uber, Snap.",
    fundPerformance: [
      { fundName: "Benchmark Fund IX", vintage: 2019, tvpi: "3.8x", irr: "~35%", dpi: "1.2x", source: "CalPERS Q2 2025 Disclosure" },
      { fundName: "Benchmark Fund X", vintage: 2021, tvpi: "1.9x", irr: "~18%", dpi: "0.2x", source: "Estimated from public LP data" },
    ],
    founderFit: {
      leadsRounds: true, boardSeat: "Always",
      ownershipTargetMin: 15, ownershipTargetMax: 20,
      decisionWeeks: 2,
      valueAdd: ["Recruiting", "GTM", "Business Development", "M&A"],
      proRataFriendly: false,
    },
  },
  {
    firm: "Khosla Ventures", short: "Khosla", aum: 15000, latestFund: 3500,
    seedMin: 1, seedMax: 3, seriesAMin: 3, seriesAMax: 10,
    dealsYr: 40, gradRate: 50, dilution: 20, timeNext: 24, markup: 4.0,
    tvpi: "N/A", irr: "N/A",
    founded: 2004, hq: "Menlo Park, CA",
    sectors: ["AI", "Sustainability", "Enterprise", "Health", "Frontier", "Robotics"],
    sectorConvictions: [
      { name: "AI", conviction: "Primary", dealShare: 35 },
      { name: "Deep Tech / Frontier", conviction: "Primary", dealShare: 25 },
      { name: "Climate / Sustainability", conviction: "Active", dealShare: 20 },
      { name: "Healthcare", conviction: "Active", dealShare: 12 },
      { name: "Robotics", conviction: "Adjacent", dealShare: 8 },
    ],
    stages: ["Seed", "Series A", "Series B", "Growth"], type: "Multi-Stage", geo: "US",
    differentiator: "Founder-first philosophy; bold bets on frontier tech and sustainability.",
    notable: "Early investor in OpenAI; strong AI and climate portfolio.",
    fundPerformance: [
      { fundName: "Khosla Ventures VII", vintage: 2019, tvpi: "2.6x", irr: "~24%", dpi: "0.5x", source: "Estimated from UTIMCO / CalPERS data" },
    ],
    founderFit: {
      leadsRounds: true, boardSeat: "Usually",
      ownershipTargetMin: 15, ownershipTargetMax: 25,
      decisionWeeks: 4,
      valueAdd: ["Technical", "Regulatory", "Recruiting", "GTM"],
      proRataFriendly: true,
    },
  },
  {
    firm: "SV Angel", short: "SV Angel", aum: 150, latestFund: 330,
    seedMin: 0.1, seedMax: 0.2, seriesAMin: 0, seriesAMax: 0,
    dealsYr: 75, gradRate: 30, dilution: 15, timeNext: 18, markup: 3.0,
    tvpi: "N/A", irr: "N/A",
    founded: 2009, hq: "San Francisco, CA",
    sectors: ["AI", "SaaS", "Consumer", "Enterprise"],
    sectorConvictions: [
      { name: "AI", conviction: "Primary", dealShare: 35 },
      { name: "Enterprise SaaS", conviction: "Primary", dealShare: 30 },
      { name: "Consumer", conviction: "Active", dealShare: 20 },
      { name: "Fintech", conviction: "Adjacent", dealShare: 15 },
    ],
    stages: ["Pre-Seed", "Seed"], type: "Angel/Seed", geo: "US",
    differentiator: "High-volume angel investor; 'routing layer' for the tech ecosystem.",
    notable: "750+ exits including Google, Stripe, DoorDash.",
    fundPerformance: [],
    founderFit: {
      leadsRounds: false, boardSeat: "Rarely",
      ownershipTargetMin: 1, ownershipTargetMax: 5,
      decisionWeeks: 1,
      valueAdd: ["Business Development", "Follow-on Capital", "PR / Brand"],
      proRataFriendly: true,
    },
  },
  {
    firm: "Accel", short: "Accel", aum: 9600, latestFund: 650,
    seedMin: 2, seedMax: 10, seriesAMin: 10, seriesAMax: 50,
    dealsYr: 65, gradRate: 30, dilution: 18, timeNext: 18, markup: 2.5,
    tvpi: "N/A", irr: "19.77% exit ratio",
    founded: 1983, hq: "Palo Alto, CA",
    sectors: ["Enterprise", "SaaS", "Consumer", "Fintech", "Healthcare", "Crypto"],
    sectorConvictions: [
      { name: "Enterprise SaaS", conviction: "Primary", dealShare: 40 },
      { name: "Fintech", conviction: "Primary", dealShare: 22 },
      { name: "Consumer", conviction: "Active", dealShare: 15 },
      { name: "Healthcare", conviction: "Active", dealShare: 13 },
      { name: "Crypto / Web3", conviction: "Adjacent", dealShare: 10 },
    ],
    stages: ["Seed", "Series A", "Growth"], type: "Multi-Stage", geo: "US/Global",
    differentiator: "'Prepared mind' philosophy with deep sector focus; global presence.",
    notable: "Facebook: $12.7M to $6.6B at IPO.",
    fundPerformance: [
      { fundName: "Accel XIV", vintage: 2019, tvpi: "2.8x", irr: "~26%", dpi: "0.9x", source: "CalPERS Q3 2025 Disclosure" },
      { fundName: "Accel XV", vintage: 2021, tvpi: "1.6x", irr: "~14%", dpi: "0.1x", source: "Estimated from public LP data" },
    ],
    founderFit: {
      leadsRounds: true, boardSeat: "Always",
      ownershipTargetMin: 15, ownershipTargetMax: 20,
      decisionWeeks: 4,
      valueAdd: ["Recruiting", "GTM", "International Expansion", "Business Development"],
      proRataFriendly: true,
    },
  },
  {
    firm: "New Enterprise Associates", short: "NEA", aum: 28000, latestFund: 6200,
    seedMin: 1, seedMax: 10, seriesAMin: 5, seriesAMax: 50,
    dealsYr: 55, gradRate: 35, dilution: 18, timeNext: 21, markup: 3.5,
    tvpi: "2.0x (Fund 18)", irr: "44% (Fund 18 VC)",
    founded: 1977, hq: "Menlo Park, CA",
    sectors: ["Technology", "Healthcare", "Enterprise", "Life Sciences", "Fintech"],
    sectorConvictions: [
      { name: "Healthcare / Life Sciences", conviction: "Primary", dealShare: 35 },
      { name: "Enterprise SaaS", conviction: "Primary", dealShare: 30 },
      { name: "AI", conviction: "Active", dealShare: 20 },
      { name: "Fintech", conviction: "Active", dealShare: 10 },
      { name: "Deep Tech", conviction: "Adjacent", dealShare: 5 },
    ],
    stages: ["Seed", "Series A", "Series B", "Growth"], type: "Mega-Fund", geo: "US",
    differentiator: "One of the oldest and largest VC firms; dual focus on technology and healthcare.",
    notable: "Fund 18 (2021): 44% net IRR, 2.0x net TVPI.",
    fundPerformance: [
      { fundName: "NEA Fund 17", vintage: 2017, tvpi: "2.9x", irr: "~28%", dpi: "1.1x", source: "UTIMCO Q4 2024 Disclosure" },
      { fundName: "NEA Fund 18", vintage: 2021, tvpi: "2.0x", irr: "44%", dpi: "0.2x", source: "UTIMCO Q4 2024 Disclosure" },
    ],
    founderFit: {
      leadsRounds: true, boardSeat: "Always",
      ownershipTargetMin: 15, ownershipTargetMax: 20,
      decisionWeeks: 6,
      valueAdd: ["Recruiting", "Regulatory", "Business Development", "Follow-on Capital"],
      proRataFriendly: true,
    },
  },
  {
    firm: "Venrock", short: "Venrock", aum: 3000, latestFund: 650,
    seedMin: 0.5, seedMax: 10, seriesAMin: 5, seriesAMax: 15,
    dealsYr: 9, gradRate: 35, dilution: 20, timeNext: 18, markup: 2.5,
    tvpi: "N/A", irr: "N/A",
    founded: 1969, hq: "Palo Alto, CA",
    sectors: ["Technology", "Healthcare", "AI", "Enterprise", "Deep Tech"],
    sectorConvictions: [
      { name: "Healthcare / Life Sciences", conviction: "Primary", dealShare: 45 },
      { name: "Enterprise SaaS", conviction: "Primary", dealShare: 30 },
      { name: "AI", conviction: "Active", dealShare: 15 },
      { name: "Deep Tech", conviction: "Adjacent", dealShare: 10 },
    ],
    stages: ["Seed", "Series A"], type: "Multi-Stage", geo: "US",
    differentiator: "Founded by the Rockefeller family; deep healthcare and technology expertise.",
    notable: "Historic exits: Intel, Apple, Gilead Sciences.",
    fundPerformance: [],
    founderFit: {
      leadsRounds: true, boardSeat: "Always",
      ownershipTargetMin: 15, ownershipTargetMax: 20,
      decisionWeeks: 6,
      valueAdd: ["Regulatory", "Recruiting", "Business Development"],
      proRataFriendly: true,
    },
  },
  {
    firm: "First Round Capital", short: "First Round", aum: 3000, latestFund: 500,
    seedMin: 0.5, seedMax: 4, seriesAMin: 0, seriesAMax: 0,
    dealsYr: 25, gradRate: 40, dilution: 15, timeNext: 24, markup: 3.0,
    tvpi: "N/A", irr: "N/A",
    founded: 2004, hq: "Philadelphia, PA",
    sectors: ["Enterprise", "AI", "Hardware", "Healthcare", "Fintech", "Consumer"],
    sectorConvictions: [
      { name: "Enterprise SaaS", conviction: "Primary", dealShare: 35 },
      { name: "AI", conviction: "Primary", dealShare: 28 },
      { name: "Fintech", conviction: "Active", dealShare: 18 },
      { name: "Healthcare", conviction: "Active", dealShare: 12 },
      { name: "Consumer", conviction: "Adjacent", dealShare: 7 },
    ],
    stages: ["Seed"], type: "Seed Specialist", geo: "US",
    differentiator: "Exclusively seed-stage with strong founder community.",
    notable: "Exits: Uber, Square, Roblox, Looker.",
    fundPerformance: [],
    founderFit: {
      leadsRounds: true, boardSeat: "Usually",
      ownershipTargetMin: 10, ownershipTargetMax: 15,
      decisionWeeks: 3,
      valueAdd: ["Recruiting", "GTM", "PR / Brand", "Business Development"],
      proRataFriendly: true,
    },
  },
  {
    firm: "Spark Capital", short: "Spark", aum: 15000, latestFund: 2100,
    seedMin: 1, seedMax: 5, seriesAMin: 5, seriesAMax: 25,
    dealsYr: 19, gradRate: 45, dilution: 20, timeNext: 18, markup: 2.5,
    tvpi: "N/A", irr: "N/A",
    founded: 2005, hq: "San Francisco, CA",
    sectors: ["Consumer", "Fintech", "Software", "AI", "Media", "Gaming"],
    sectorConvictions: [
      { name: "Consumer", conviction: "Primary", dealShare: 35 },
      { name: "Fintech", conviction: "Primary", dealShare: 25 },
      { name: "AI", conviction: "Active", dealShare: 20 },
      { name: "Media / Gaming", conviction: "Active", dealShare: 12 },
      { name: "Enterprise SaaS", conviction: "Adjacent", dealShare: 8 },
    ],
    stages: ["Seed", "Series A", "Series B", "Growth"], type: "Multi-Stage", geo: "US",
    differentiator: "Product-first 'anti-thesis' approach; 6.6% unicorn hit rate.",
    notable: "45 unicorns, 15 IPOs; exits include Twitter, Tumblr, Oculus.",
    fundPerformance: [],
    founderFit: {
      leadsRounds: true, boardSeat: "Usually",
      ownershipTargetMin: 12, ownershipTargetMax: 18,
      decisionWeeks: 3,
      valueAdd: ["GTM", "Recruiting", "PR / Brand", "Follow-on Capital"],
      proRataFriendly: true,
    },
  },
  {
    firm: "Slow Ventures", short: "Slow", aum: 1400, latestFund: 275,
    seedMin: 0.5, seedMax: 3, seriesAMin: 1, seriesAMax: 5,
    dealsYr: 45, gradRate: 30, dilution: 15, timeNext: 24, markup: 3.0,
    tvpi: "N/A", irr: "N/A",
    founded: 2009, hq: "San Francisco, CA",
    sectors: ["Consumer", "Fintech", "SaaS", "Crypto", "Creator Economy"],
    sectorConvictions: [
      { name: "Consumer", conviction: "Primary", dealShare: 38 },
      { name: "Fintech", conviction: "Primary", dealShare: 25 },
      { name: "Creator Economy", conviction: "Active", dealShare: 20 },
      { name: "Crypto / Web3", conviction: "Active", dealShare: 12 },
      { name: "Enterprise SaaS", conviction: "Adjacent", dealShare: 5 },
    ],
    stages: ["Pre-Seed", "Seed", "Series A"], type: "Generalist Seed", geo: "US",
    differentiator: "Generalist, long-term approach by former Facebook operators.",
    notable: "Exits: Airtable, Gusto, PillPack; early Solana investor.",
    fundPerformance: [],
    founderFit: {
      leadsRounds: false, boardSeat: "Sometimes",
      ownershipTargetMin: 5, ownershipTargetMax: 12,
      decisionWeeks: 2,
      valueAdd: ["GTM", "PR / Brand", "Business Development"],
      proRataFriendly: true,
    },
  },
  {
    firm: "Kleiner Perkins", short: "KP", aum: 21000, latestFund: 3500,
    seedMin: 0.5, seedMax: 5, seriesAMin: 5, seriesAMax: 20,
    dealsYr: 28, gradRate: 30, dilution: 20, timeNext: 18, markup: 2.5,
    tvpi: "N/A", irr: "N/A",
    founded: 1972, hq: "Menlo Park, CA",
    sectors: ["AI", "Enterprise", "Consumer", "Fintech", "Healthcare", "Deep Tech"],
    sectorConvictions: [
      { name: "AI", conviction: "Primary", dealShare: 35 },
      { name: "Enterprise SaaS", conviction: "Primary", dealShare: 28 },
      { name: "Healthcare", conviction: "Active", dealShare: 18 },
      { name: "Fintech", conviction: "Active", dealShare: 12 },
      { name: "Deep Tech", conviction: "Adjacent", dealShare: 7 },
    ],
    stages: ["Seed", "Series A", "Series B", "Growth"], type: "Multi-Stage", geo: "US",
    differentiator: "Five-decade legacy firm; inception-to-IPO partnership model.",
    notable: "Historic exits: Google, Amazon, Slack, Figma.",
    fundPerformance: [
      { fundName: "KPCB XIX", vintage: 2018, tvpi: "2.2x", irr: "~20%", dpi: "0.6x", source: "CalPERS Q3 2025 Disclosure" },
    ],
    founderFit: {
      leadsRounds: true, boardSeat: "Always",
      ownershipTargetMin: 15, ownershipTargetMax: 20,
      decisionWeeks: 5,
      valueAdd: ["Recruiting", "GTM", "Regulatory", "Business Development", "M&A"],
      proRataFriendly: true,
    },
  },
  {
    firm: "GV", short: "GV", aum: 13000, latestFund: 2100,
    seedMin: 0.25, seedMax: 2, seriesAMin: 2, seriesAMax: 30,
    dealsYr: 36, gradRate: 55, dilution: 20, timeNext: 18, markup: 3.5,
    tvpi: "N/A", irr: "N/A",
    founded: 2009, hq: "San Francisco, CA",
    sectors: ["AI", "Life Sciences", "Consumer", "Enterprise", "Health"],
    sectorConvictions: [
      { name: "AI", conviction: "Primary", dealShare: 35 },
      { name: "Healthcare / Life Sciences", conviction: "Primary", dealShare: 30 },
      { name: "Enterprise SaaS", conviction: "Active", dealShare: 20 },
      { name: "Consumer", conviction: "Active", dealShare: 10 },
      { name: "Deep Tech", conviction: "Adjacent", dealShare: 5 },
    ],
    stages: ["Seed", "Series A", "Series B"], type: "CVC", geo: "US",
    differentiator: "Alphabet-backed CVC with in-house design studio and ML-driven deal scoring.",
    notable: "Exits: Uber, Nest, Slack, GitLab, Duo Security.",
    fundPerformance: [],
    founderFit: {
      leadsRounds: true, boardSeat: "Usually",
      ownershipTargetMin: 10, ownershipTargetMax: 20,
      decisionWeeks: 4,
      valueAdd: ["Technical", "Recruiting", "Business Development", "International Expansion"],
      proRataFriendly: true,
    },
  },
  {
    firm: "Founders Fund", short: "FF", aum: 17000, latestFund: 4600,
    seedMin: 0.5, seedMax: 5, seriesAMin: 5, seriesAMax: 20,
    dealsYr: 49, gradRate: 45, dilution: 18, timeNext: 18, markup: 3.0,
    tvpi: "4.6x (pre-2018)", irr: "N/A",
    founded: 2005, hq: "San Francisco, CA",
    sectors: ["Aerospace", "AI", "Defense", "Energy", "Biotech", "Fintech"],
    sectorConvictions: [
      { name: "Deep Tech / Frontier", conviction: "Primary", dealShare: 35 },
      { name: "Defense / Aerospace", conviction: "Primary", dealShare: 25 },
      { name: "AI", conviction: "Active", dealShare: 20 },
      { name: "Biotech", conviction: "Active", dealShare: 12 },
      { name: "Fintech", conviction: "Adjacent", dealShare: 8 },
    ],
    stages: ["Seed", "Series A", "Series B", "Growth"], type: "Multi-Stage", geo: "US",
    differentiator: "Contrarian bets on hard tech and defense; Thiel network premium.",
    notable: "Early SpaceX, Palantir, Stripe, Airbnb investor.",
    fundPerformance: [
      { fundName: "Founders Fund VI", vintage: 2016, tvpi: "4.6x", irr: "~38%", dpi: "2.2x", source: "Public LP Reports / Newcomer 2024" },
      { fundName: "Founders Fund VIII", vintage: 2021, tvpi: "2.1x", irr: "~20%", dpi: "0.1x", source: "Estimated from public filings" },
    ],
    founderFit: {
      leadsRounds: true, boardSeat: "Usually",
      ownershipTargetMin: 10, ownershipTargetMax: 20,
      decisionWeeks: 4,
      valueAdd: ["Technical", "Regulatory", "Business Development", "Recruiting"],
      proRataFriendly: true,
    },
  },
  {
    firm: "Union Square Ventures", short: "USV", aum: 2900, latestFund: 350,
    seedMin: 0.5, seedMax: 1, seriesAMin: 1, seriesAMax: 5,
    dealsYr: 18, gradRate: 45, dilution: 15, timeNext: 21, markup: 3.0,
    tvpi: "N/A", irr: "N/A",
    founded: 2003, hq: "New York, NY",
    sectors: ["Crypto", "Web3", "SaaS", "Consumer", "Climate"],
    sectorConvictions: [
      { name: "Crypto / Web3", conviction: "Primary", dealShare: 40 },
      { name: "Enterprise SaaS", conviction: "Primary", dealShare: 25 },
      { name: "Consumer", conviction: "Active", dealShare: 18 },
      { name: "Climate / Sustainability", conviction: "Active", dealShare: 12 },
      { name: "AI", conviction: "Adjacent", dealShare: 5 },
    ],
    stages: ["Seed", "Series A"], type: "Thesis-Driven", geo: "US",
    differentiator: "Network effects thesis; concentrated portfolio of 20-25 companies per fund.",
    notable: "Twitter, Tumblr, Etsy, Coinbase, Stripe early backer.",
    fundPerformance: [],
    founderFit: {
      leadsRounds: true, boardSeat: "Always",
      ownershipTargetMin: 10, ownershipTargetMax: 20,
      decisionWeeks: 4,
      valueAdd: ["GTM", "Business Development", "Recruiting"],
      proRataFriendly: true,
    },
  },
  {
    firm: "Lightspeed Venture Partners", short: "Lightspeed", aum: 44000, latestFund: 9000,
    seedMin: 0.1, seedMax: 2, seriesAMin: 2, seriesAMax: 20,
    dealsYr: 64, gradRate: 35, dilution: 20, timeNext: 18, markup: 3.0,
    tvpi: "N/A", irr: "N/A",
    founded: 2000, hq: "Menlo Park, CA",
    sectors: ["Enterprise", "AI", "Consumer", "Fintech", "Health"],
    sectorConvictions: [
      { name: "Enterprise SaaS", conviction: "Primary", dealShare: 35 },
      { name: "AI", conviction: "Primary", dealShare: 30 },
      { name: "Consumer", conviction: "Active", dealShare: 18 },
      { name: "Fintech", conviction: "Active", dealShare: 12 },
      { name: "Healthcare", conviction: "Adjacent", dealShare: 5 },
    ],
    stages: ["Seed", "Series A", "Series B", "Growth"], type: "Mega-Fund", geo: "US/Global",
    differentiator: "Federated regional network with local-first investors.",
    notable: "Exits: Nest, AppDynamics, MuleSoft, Snap.",
    fundPerformance: [
      { fundName: "Lightspeed XII", vintage: 2019, tvpi: "2.4x", irr: "~22%", dpi: "0.6x", source: "CalPERS Q3 2025 Disclosure" },
    ],
    founderFit: {
      leadsRounds: true, boardSeat: "Always",
      ownershipTargetMin: 15, ownershipTargetMax: 20,
      decisionWeeks: 3,
      valueAdd: ["Recruiting", "GTM", "International Expansion", "Follow-on Capital"],
      proRataFriendly: true,
    },
  },
  {
    firm: "Thrive Capital", short: "Thrive", aum: 16000, latestFund: 5000,
    seedMin: 1, seedMax: 5, seriesAMin: 5, seriesAMax: 25,
    dealsYr: 30, gradRate: 55, dilution: 20, timeNext: 16, markup: 3.5,
    tvpi: "N/A", irr: "126% (2022)",
    founded: 2009, hq: "New York, NY",
    sectors: ["AI", "Enterprise", "Consumer", "Fintech", "Software"],
    sectorConvictions: [
      { name: "AI", conviction: "Primary", dealShare: 45 },
      { name: "Fintech", conviction: "Primary", dealShare: 28 },
      { name: "Enterprise SaaS", conviction: "Active", dealShare: 18 },
      { name: "Consumer", conviction: "Adjacent", dealShare: 9 },
    ],
    stages: ["Seed", "Series A", "Series B", "Growth"], type: "Multi-Stage", geo: "US",
    differentiator: "Concentrated, conviction-driven bets; 2022 vintage 126% IRR.",
    notable: "Fund VIII (2022): 126% IRR per UTIMCO; early OpenAI, Cursor.",
    fundPerformance: [
      { fundName: "Thrive Capital Fund VII", vintage: 2019, tvpi: "3.2x", irr: "~30%", dpi: "0.8x", source: "UTIMCO Q4 2024 Disclosure" },
      { fundName: "Thrive Capital Fund VIII", vintage: 2022, tvpi: "2.8x", irr: "126%", dpi: "0.1x", source: "UTIMCO Q4 2024 Disclosure" },
    ],
    founderFit: {
      leadsRounds: true, boardSeat: "Usually",
      ownershipTargetMin: 10, ownershipTargetMax: 20,
      decisionWeeks: 2,
      valueAdd: ["GTM", "Recruiting", "Follow-on Capital", "Business Development"],
      proRataFriendly: true,
    },
  },
  {
    firm: "General Catalyst", short: "GC", aum: 43000, latestFund: 8000,
    seedMin: 0.5, seedMax: 2, seriesAMin: 15, seriesAMax: 30,
    dealsYr: 179, gradRate: 50, dilution: 20, timeNext: 24, markup: 3.0,
    tvpi: "N/A", irr: "N/A",
    founded: 2000, hq: "San Francisco, CA",
    sectors: ["AI", "SaaS", "Enterprise", "Fintech", "Healthcare", "Defense", "Industrials"],
    sectorConvictions: [
      { name: "AI", conviction: "Primary", dealShare: 35 },
      { name: "Healthcare", conviction: "Primary", dealShare: 22 },
      { name: "Enterprise SaaS", conviction: "Active", dealShare: 20 },
      { name: "Fintech", conviction: "Active", dealShare: 13 },
      { name: "Defense / Industrials", conviction: "Adjacent", dealShare: 10 },
    ],
    stages: ["Seed", "Series A", "Series B", "Growth"], type: "Mega-Fund", geo: "US/Global",
    differentiator: "Evolved into 'investment and transformation company'; 90 unicorns backed.",
    notable: "90 unicorns, 29 IPOs; $8B latest fund.",
    fundPerformance: [],
    founderFit: {
      leadsRounds: true, boardSeat: "Always",
      ownershipTargetMin: 15, ownershipTargetMax: 20,
      decisionWeeks: 4,
      valueAdd: ["Recruiting", "GTM", "Regulatory", "Business Development", "International Expansion"],
      proRataFriendly: true,
    },
  },
  {
    firm: "Greylock Partners", short: "Greylock", aum: 3500, latestFund: 1000,
    seedMin: 1, seedMax: 3, seriesAMin: 3, seriesAMax: 10,
    dealsYr: 10, gradRate: 60, dilution: 20, timeNext: 18, markup: 3.0,
    tvpi: "N/A", irr: "N/A",
    founded: 1965, hq: "Menlo Park, CA",
    sectors: ["AI", "SaaS", "Enterprise", "Consumer", "Fintech", "Cybersecurity"],
    sectorConvictions: [
      { name: "AI", conviction: "Primary", dealShare: 40 },
      { name: "Enterprise SaaS", conviction: "Primary", dealShare: 30 },
      { name: "Cybersecurity", conviction: "Active", dealShare: 15 },
      { name: "Fintech", conviction: "Active", dealShare: 10 },
      { name: "Consumer", conviction: "Adjacent", dealShare: 5 },
    ],
    stages: ["Pre-Seed", "Seed", "Series A"], type: "Early-Stage", geo: "US",
    differentiator: "80%+ of investments are first check; Greylock Edge program.",
    notable: "Exits: Airbnb, Facebook, LinkedIn, Workday, Roblox.",
    fundPerformance: [
      { fundName: "Greylock XVI", vintage: 2019, tvpi: "2.6x", irr: "~24%", dpi: "0.7x", source: "Estimated from CalPERS data" },
    ],
    founderFit: {
      leadsRounds: true, boardSeat: "Always",
      ownershipTargetMin: 15, ownershipTargetMax: 20,
      decisionWeeks: 3,
      valueAdd: ["Recruiting", "GTM", "PR / Brand", "Business Development"],
      proRataFriendly: true,
    },
  },
  {
    firm: "Bain Capital Ventures", short: "BCV", aum: 7500, latestFund: 1900,
    seedMin: 1, seedMax: 5, seriesAMin: 5, seriesAMax: 25,
    dealsYr: 35, gradRate: 40, dilution: 20, timeNext: 20, markup: 2.5,
    tvpi: "N/A", irr: "N/A",
    founded: 2001, hq: "San Francisco, CA",
    sectors: ["Enterprise", "Fintech", "Healthcare", "Infrastructure", "AI"],
    sectorConvictions: [
      { name: "Enterprise SaaS", conviction: "Primary", dealShare: 38 },
      { name: "Fintech", conviction: "Primary", dealShare: 28 },
      { name: "Healthcare", conviction: "Active", dealShare: 18 },
      { name: "AI", conviction: "Active", dealShare: 12 },
      { name: "Deep Tech", conviction: "Adjacent", dealShare: 4 },
    ],
    stages: ["Seed", "Series A", "Series B", "Growth"], type: "Multi-Stage", geo: "US",
    differentiator: "Leverages Bain & Company consulting network for portfolio support.",
    notable: "Exits: DocuSign, LinkedIn, SurveyMonkey.",
    fundPerformance: [],
    founderFit: {
      leadsRounds: true, boardSeat: "Always",
      ownershipTargetMin: 15, ownershipTargetMax: 20,
      decisionWeeks: 5,
      valueAdd: ["GTM", "Recruiting", "Business Development", "M&A"],
      proRataFriendly: true,
    },
  },
  {
    firm: "Lerer Hippeau", short: "LH", aum: 1000, latestFund: 200,
    seedMin: 0.25, seedMax: 1, seriesAMin: 1, seriesAMax: 3,
    dealsYr: 40, gradRate: 30, dilution: 15, timeNext: 22, markup: 2.5,
    tvpi: "N/A", irr: "N/A",
    founded: 2010, hq: "New York, NY",
    sectors: ["Consumer", "Media", "Commerce", "Health", "Fintech"],
    sectorConvictions: [
      { name: "Consumer", conviction: "Primary", dealShare: 40 },
      { name: "Media / Creator Economy", conviction: "Primary", dealShare: 28 },
      { name: "Fintech", conviction: "Active", dealShare: 18 },
      { name: "Healthcare", conviction: "Active", dealShare: 10 },
      { name: "Enterprise SaaS", conviction: "Adjacent", dealShare: 4 },
    ],
    stages: ["Pre-Seed", "Seed", "Series A"], type: "Seed/Early", geo: "US",
    differentiator: "NYC-centric seed fund with strong consumer and media DNA.",
    notable: "Exits: Casper, Allbirds, Glossier, Mirror.",
    fundPerformance: [],
    founderFit: {
      leadsRounds: true, boardSeat: "Sometimes",
      ownershipTargetMin: 8, ownershipTargetMax: 15,
      decisionWeeks: 2,
      valueAdd: ["GTM", "PR / Brand", "Business Development", "Recruiting"],
      proRataFriendly: true,
    },
  },
  {
    firm: "Bessemer Venture Partners", short: "Bessemer", aum: 20000, latestFund: 3850,
    seedMin: 1, seedMax: 5, seriesAMin: 5, seriesAMax: 25,
    dealsYr: 40, gradRate: 40, dilution: 20, timeNext: 20, markup: 2.5,
    tvpi: "N/A", irr: "N/A",
    founded: 1911, hq: "San Francisco, CA",
    sectors: ["Cloud", "SaaS", "Enterprise", "Healthcare", "Consumer", "Fintech"],
    sectorConvictions: [
      { name: "Enterprise SaaS / Cloud", conviction: "Primary", dealShare: 45 },
      { name: "Healthcare", conviction: "Primary", dealShare: 22 },
      { name: "Fintech", conviction: "Active", dealShare: 18 },
      { name: "Consumer", conviction: "Active", dealShare: 10 },
      { name: "AI", conviction: "Adjacent", dealShare: 5 },
    ],
    stages: ["Seed", "Series A", "Series B", "Growth"], type: "Multi-Stage", geo: "US/Global",
    differentiator: "Oldest VC firm (est. 1911); famous for 'Anti-Portfolio' transparency.",
    notable: "Exits: Shopify, Twilio, LinkedIn, Pinterest, Yelp.",
    fundPerformance: [
      { fundName: "Bessemer XI", vintage: 2019, tvpi: "2.3x", irr: "~21%", dpi: "0.5x", source: "Estimated from public LP data" },
    ],
    founderFit: {
      leadsRounds: true, boardSeat: "Always",
      ownershipTargetMin: 15, ownershipTargetMax: 20,
      decisionWeeks: 5,
      valueAdd: ["GTM", "Recruiting", "International Expansion", "Business Development"],
      proRataFriendly: true,
    },
  },
  {
    firm: "Insight Partners", short: "Insight", aum: 90000, latestFund: 12500,
    seedMin: 0, seedMax: 0, seriesAMin: 10, seriesAMax: 50,
    dealsYr: 60, gradRate: 0, dilution: 0, timeNext: 0, markup: 0,
    tvpi: "N/A", irr: "N/A",
    founded: 1995, hq: "New York, NY",
    sectors: ["Enterprise", "SaaS", "Fintech", "Healthcare", "Cybersecurity"],
    sectorConvictions: [
      { name: "Enterprise SaaS", conviction: "Primary", dealShare: 45 },
      { name: "Cybersecurity", conviction: "Primary", dealShare: 22 },
      { name: "Fintech", conviction: "Active", dealShare: 18 },
      { name: "Healthcare", conviction: "Active", dealShare: 10 },
      { name: "AI", conviction: "Adjacent", dealShare: 5 },
    ],
    stages: ["Series B", "Growth", "Buyout"], type: "Growth/Buyout", geo: "US/Global",
    differentiator: "Largest growth-stage tech investor globally at $90B AUM.",
    notable: "500+ investments; exits: Twitter, Shopify, DocuSign.",
    fundPerformance: [],
    founderFit: {
      leadsRounds: true, boardSeat: "Always",
      ownershipTargetMin: 10, ownershipTargetMax: 25,
      decisionWeeks: 6,
      valueAdd: ["GTM", "Recruiting", "M&A", "Business Development", "International Expansion"],
      proRataFriendly: false,
    },
  },
  {
    firm: "Greycroft", short: "Greycroft", aum: 3000, latestFund: 500,
    seedMin: 0.25, seedMax: 2, seriesAMin: 2, seriesAMax: 10,
    dealsYr: 30, gradRate: 30, dilution: 18, timeNext: 22, markup: 2.5,
    tvpi: "N/A", irr: "N/A",
    founded: 2006, hq: "New York, NY",
    sectors: ["Consumer", "Media", "Commerce", "Fintech", "Healthcare"],
    sectorConvictions: [
      { name: "Consumer", conviction: "Primary", dealShare: 38 },
      { name: "Media / Creator Economy", conviction: "Primary", dealShare: 28 },
      { name: "Fintech", conviction: "Active", dealShare: 20 },
      { name: "Healthcare", conviction: "Active", dealShare: 10 },
      { name: "Enterprise SaaS", conviction: "Adjacent", dealShare: 4 },
    ],
    stages: ["Seed", "Series A", "Series B"], type: "Early-Stage", geo: "US",
    differentiator: "NYC-based early-stage firm with strong consumer and media expertise.",
    notable: "Exits: Bumble, Venmo, Braintree, Huffington Post.",
    fundPerformance: [],
    founderFit: {
      leadsRounds: true, boardSeat: "Usually",
      ownershipTargetMin: 10, ownershipTargetMax: 18,
      decisionWeeks: 3,
      valueAdd: ["GTM", "PR / Brand", "Recruiting", "Business Development"],
      proRataFriendly: true,
    },
  },
];

export const INDUSTRY_BENCHMARKS = {
  seedMedianRound: 3.5,
  seriesAMedianRound: 15.0,
  seedMedianValuation: 15,
  seriesAMedianValuation: 55,
  seedGradRate: 25,
  medianTimeToSeriesA: 25,
  medianStepUp: 2.5,
  topQuartileIRR: 25,
  medianTVPI: 1.5,
  medianDPI: 0.4,
};

export const FIRM_TYPES = Array.from(new Set(VC_DATA.map(f => f.type)));
export const ALL_SECTORS = Array.from(new Set(VC_DATA.flatMap(f => f.sectors))).sort();
export const ALL_STAGES = ["Pre-Seed", "Seed", "Series A", "Series B", "Growth", "Buyout"];
export const GEO_OPTIONS = Array.from(new Set(VC_DATA.map(f => f.geo))).sort();

// ─── Historical Time-Series Data (2020–2026) ───────────────────────────────
export interface YearlySnapshot {
  year: number;
  seedMax: number;
  seriesAMax: number;
  dealsYr: number;
  timeNext: number;
  aum: number;
}

export interface FirmTimeline {
  short: string;
  firm: string;
  type: string;
  snapshots: YearlySnapshot[];
}

export const FIRM_TIMELINES: FirmTimeline[] = [
  { short: "a16z", firm: "Andreessen Horowitz", type: "Mega-Fund", snapshots: [
    { year: 2020, seedMax: 3, seriesAMax: 25, dealsYr: 55, timeNext: 18, aum: 16500 },
    { year: 2021, seedMax: 5, seriesAMax: 35, dealsYr: 95, timeNext: 14, aum: 28000 },
    { year: 2022, seedMax: 5, seriesAMax: 40, dealsYr: 85, timeNext: 15, aum: 35000 },
    { year: 2023, seedMax: 4, seriesAMax: 30, dealsYr: 60, timeNext: 18, aum: 35000 },
    { year: 2024, seedMax: 5, seriesAMax: 38, dealsYr: 75, timeNext: 16, aum: 42000 },
    { year: 2025, seedMax: 5, seriesAMax: 40, dealsYr: 80, timeNext: 16, aum: 50000 },
    { year: 2026, seedMax: 6, seriesAMax: 45, dealsYr: 85, timeNext: 15, aum: 55000 },
  ]},
  { short: "Sequoia", firm: "Sequoia Capital", type: "Mega-Fund", snapshots: [
    { year: 2020, seedMax: 2, seriesAMax: 20, dealsYr: 38, timeNext: 17, aum: 19000 },
    { year: 2021, seedMax: 3, seriesAMax: 28, dealsYr: 55, timeNext: 13, aum: 28000 },
    { year: 2022, seedMax: 3, seriesAMax: 30, dealsYr: 50, timeNext: 14, aum: 30000 },
    { year: 2023, seedMax: 2.5, seriesAMax: 25, dealsYr: 38, timeNext: 16, aum: 28000 },
    { year: 2024, seedMax: 3, seriesAMax: 28, dealsYr: 42, timeNext: 15, aum: 30000 },
    { year: 2025, seedMax: 3, seriesAMax: 30, dealsYr: 45, timeNext: 15, aum: 30000 },
    { year: 2026, seedMax: 3.5, seriesAMax: 32, dealsYr: 48, timeNext: 14, aum: 32000 },
  ]},
  { short: "HongShan", firm: "HongShan Capital", type: "Mega-Fund", snapshots: [
    { year: 2020, seedMax: 3, seriesAMax: 20, dealsYr: 80, timeNext: 18, aum: 45000 },
    { year: 2021, seedMax: 5, seriesAMax: 30, dealsYr: 90, timeNext: 16, aum: 56000 },
    { year: 2022, seedMax: 4, seriesAMax: 25, dealsYr: 60, timeNext: 22, aum: 56000 },
    { year: 2023, seedMax: 3, seriesAMax: 20, dealsYr: 40, timeNext: 24, aum: 55000 },
    { year: 2024, seedMax: 4, seriesAMax: 25, dealsYr: 45, timeNext: 22, aum: 56000 },
    { year: 2025, seedMax: 5, seriesAMax: 30, dealsYr: 50, timeNext: 21, aum: 56000 },
    { year: 2026, seedMax: 5, seriesAMax: 30, dealsYr: 50, timeNext: 20, aum: 58000 },
  ]},
  { short: "YC", firm: "Y Combinator", type: "Accelerator", snapshots: [
    { year: 2020, seedMax: 0.15, seriesAMax: 0, dealsYr: 250, timeNext: 24, aum: 3000 },
    { year: 2021, seedMax: 0.5, seriesAMax: 0, dealsYr: 380, timeNext: 20, aum: 4500 },
    { year: 2022, seedMax: 0.5, seriesAMax: 0, dealsYr: 400, timeNext: 22, aum: 5000 },
    { year: 2023, seedMax: 0.5, seriesAMax: 0, dealsYr: 350, timeNext: 22, aum: 5500 },
    { year: 2024, seedMax: 0.5, seriesAMax: 0, dealsYr: 380, timeNext: 21, aum: 5800 },
    { year: 2025, seedMax: 0.5, seriesAMax: 0, dealsYr: 400, timeNext: 21, aum: 6000 },
    { year: 2026, seedMax: 0.5, seriesAMax: 0, dealsYr: 420, timeNext: 20, aum: 6500 },
  ]},
  { short: "Benchmark", firm: "Benchmark", type: "Equal Partnership", snapshots: [
    { year: 2020, seedMax: 10, seriesAMax: 20, dealsYr: 8, timeNext: 18, aum: 3500 },
    { year: 2021, seedMax: 12, seriesAMax: 25, dealsYr: 12, timeNext: 15, aum: 4000 },
    { year: 2022, seedMax: 15, seriesAMax: 30, dealsYr: 10, timeNext: 16, aum: 4500 },
    { year: 2023, seedMax: 12, seriesAMax: 25, dealsYr: 8, timeNext: 17, aum: 4500 },
    { year: 2024, seedMax: 13, seriesAMax: 28, dealsYr: 9, timeNext: 16, aum: 4800 },
    { year: 2025, seedMax: 15, seriesAMax: 30, dealsYr: 10, timeNext: 16, aum: 5000 },
    { year: 2026, seedMax: 15, seriesAMax: 32, dealsYr: 10, timeNext: 15, aum: 5200 },
  ]},
  { short: "Khosla", firm: "Khosla Ventures", type: "Multi-Stage", snapshots: [
    { year: 2020, seedMax: 2, seriesAMax: 8, dealsYr: 30, timeNext: 26, aum: 9000 },
    { year: 2021, seedMax: 3, seriesAMax: 10, dealsYr: 45, timeNext: 22, aum: 12000 },
    { year: 2022, seedMax: 3, seriesAMax: 10, dealsYr: 40, timeNext: 24, aum: 14000 },
    { year: 2023, seedMax: 2.5, seriesAMax: 8, dealsYr: 32, timeNext: 25, aum: 14000 },
    { year: 2024, seedMax: 3, seriesAMax: 10, dealsYr: 38, timeNext: 24, aum: 15000 },
    { year: 2025, seedMax: 3, seriesAMax: 10, dealsYr: 40, timeNext: 24, aum: 15000 },
    { year: 2026, seedMax: 3.5, seriesAMax: 12, dealsYr: 42, timeNext: 23, aum: 16000 },
  ]},
  { short: "Accel", firm: "Accel", type: "Multi-Stage", snapshots: [
    { year: 2020, seedMax: 5, seriesAMax: 30, dealsYr: 50, timeNext: 20, aum: 7000 },
    { year: 2021, seedMax: 8, seriesAMax: 45, dealsYr: 75, timeNext: 17, aum: 8500 },
    { year: 2022, seedMax: 10, seriesAMax: 50, dealsYr: 65, timeNext: 18, aum: 9500 },
    { year: 2023, seedMax: 8, seriesAMax: 40, dealsYr: 55, timeNext: 19, aum: 9500 },
    { year: 2024, seedMax: 9, seriesAMax: 45, dealsYr: 60, timeNext: 18, aum: 9600 },
    { year: 2025, seedMax: 10, seriesAMax: 50, dealsYr: 65, timeNext: 18, aum: 9600 },
    { year: 2026, seedMax: 10, seriesAMax: 50, dealsYr: 68, timeNext: 17, aum: 10000 },
  ]},
  { short: "Thrive", firm: "Thrive Capital", type: "Multi-Stage", snapshots: [
    { year: 2020, seedMax: 2, seriesAMax: 12, dealsYr: 18, timeNext: 18, aum: 5000 },
    { year: 2021, seedMax: 3, seriesAMax: 20, dealsYr: 30, timeNext: 15, aum: 8000 },
    { year: 2022, seedMax: 4, seriesAMax: 22, dealsYr: 28, timeNext: 16, aum: 10000 },
    { year: 2023, seedMax: 3.5, seriesAMax: 20, dealsYr: 22, timeNext: 17, aum: 12000 },
    { year: 2024, seedMax: 4, seriesAMax: 22, dealsYr: 26, timeNext: 16, aum: 14000 },
    { year: 2025, seedMax: 5, seriesAMax: 25, dealsYr: 30, timeNext: 16, aum: 16000 },
    { year: 2026, seedMax: 6, seriesAMax: 28, dealsYr: 33, timeNext: 15, aum: 18000 },
  ]},
  { short: "GC", firm: "General Catalyst", type: "Mega-Fund", snapshots: [
    { year: 2020, seedMax: 1, seriesAMax: 15, dealsYr: 90, timeNext: 26, aum: 12000 },
    { year: 2021, seedMax: 1.5, seriesAMax: 25, dealsYr: 160, timeNext: 23, aum: 25000 },
    { year: 2022, seedMax: 2, seriesAMax: 30, dealsYr: 180, timeNext: 24, aum: 35000 },
    { year: 2023, seedMax: 1.5, seriesAMax: 25, dealsYr: 150, timeNext: 25, aum: 38000 },
    { year: 2024, seedMax: 2, seriesAMax: 28, dealsYr: 165, timeNext: 24, aum: 40000 },
    { year: 2025, seedMax: 2, seriesAMax: 30, dealsYr: 179, timeNext: 24, aum: 43000 },
    { year: 2026, seedMax: 2.5, seriesAMax: 32, dealsYr: 185, timeNext: 23, aum: 46000 },
  ]},
  { short: "Greylock", firm: "Greylock Partners", type: "Early-Stage", snapshots: [
    { year: 2020, seedMax: 1.5, seriesAMax: 6, dealsYr: 8, timeNext: 20, aum: 2500 },
    { year: 2021, seedMax: 2.5, seriesAMax: 10, dealsYr: 14, timeNext: 17, aum: 3000 },
    { year: 2022, seedMax: 3, seriesAMax: 10, dealsYr: 10, timeNext: 18, aum: 3500 },
    { year: 2023, seedMax: 2.5, seriesAMax: 8, dealsYr: 8, timeNext: 19, aum: 3500 },
    { year: 2024, seedMax: 3, seriesAMax: 9, dealsYr: 9, timeNext: 18, aum: 3500 },
    { year: 2025, seedMax: 3, seriesAMax: 10, dealsYr: 10, timeNext: 18, aum: 3500 },
    { year: 2026, seedMax: 3.5, seriesAMax: 11, dealsYr: 11, timeNext: 17, aum: 3700 },
  ]},
  { short: "KP", firm: "Kleiner Perkins", type: "Multi-Stage", snapshots: [
    { year: 2020, seedMax: 3, seriesAMax: 12, dealsYr: 22, timeNext: 20, aum: 15000 },
    { year: 2021, seedMax: 4, seriesAMax: 18, dealsYr: 32, timeNext: 17, aum: 18000 },
    { year: 2022, seedMax: 5, seriesAMax: 20, dealsYr: 28, timeNext: 18, aum: 20000 },
    { year: 2023, seedMax: 4, seriesAMax: 16, dealsYr: 22, timeNext: 19, aum: 20000 },
    { year: 2024, seedMax: 4.5, seriesAMax: 18, dealsYr: 25, timeNext: 18, aum: 21000 },
    { year: 2025, seedMax: 5, seriesAMax: 20, dealsYr: 28, timeNext: 18, aum: 21000 },
    { year: 2026, seedMax: 5, seriesAMax: 22, dealsYr: 30, timeNext: 17, aum: 22000 },
  ]},
  { short: "Lightspeed", firm: "Lightspeed Venture Partners", type: "Mega-Fund", snapshots: [
    { year: 2020, seedMax: 1, seriesAMax: 12, dealsYr: 45, timeNext: 20, aum: 18000 },
    { year: 2021, seedMax: 1.5, seriesAMax: 18, dealsYr: 75, timeNext: 17, aum: 30000 },
    { year: 2022, seedMax: 2, seriesAMax: 20, dealsYr: 65, timeNext: 18, aum: 40000 },
    { year: 2023, seedMax: 1.5, seriesAMax: 16, dealsYr: 50, timeNext: 19, aum: 42000 },
    { year: 2024, seedMax: 2, seriesAMax: 18, dealsYr: 58, timeNext: 18, aum: 44000 },
    { year: 2025, seedMax: 2, seriesAMax: 20, dealsYr: 64, timeNext: 18, aum: 44000 },
    { year: 2026, seedMax: 2.5, seriesAMax: 22, dealsYr: 68, timeNext: 17, aum: 46000 },
  ]},
];

export interface IndustrySnapshot {
  year: number;
  seedMax: number;
  seriesAMax: number;
  timeNext: number;
}

export const INDUSTRY_TIMELINE: IndustrySnapshot[] = [
  { year: 2020, seedMax: 2.5, seriesAMax: 12, timeNext: 24 },
  { year: 2021, seedMax: 4.0, seriesAMax: 18, timeNext: 20 },
  { year: 2022, seedMax: 3.5, seriesAMax: 16, timeNext: 22 },
  { year: 2023, seedMax: 3.0, seriesAMax: 14, timeNext: 25 },
  { year: 2024, seedMax: 3.5, seriesAMax: 15, timeNext: 24 },
  { year: 2025, seedMax: 4.0, seriesAMax: 16, timeNext: 23 },
  { year: 2026, seedMax: 4.5, seriesAMax: 18, timeNext: 22 },
];
