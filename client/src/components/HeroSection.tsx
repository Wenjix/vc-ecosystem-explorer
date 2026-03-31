/*
 * Swiss Data Cartography: Clean hero with topographic bg, data-viz artwork, key stats
 */
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { VC_DATA } from "@/lib/vcData";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663363495483/QPbzCZxS4jnMm4bKZUvB72/hero-bg-7C8qt4NCv4PB4qt6Mx4vyG.webp";
const DATA_VIZ = "https://d2xsxph8kpxj0f.cloudfront.net/310519663363495483/QPbzCZxS4jnMm4bKZUvB72/data-viz-hero-iyYprP46gxswaWJ4prHYee.webp";

const totalAUM = VC_DATA.reduce((s, f) => s + f.aum, 0);
const totalFirms = VC_DATA.length;
const avgSeedCheck = VC_DATA.filter(f => f.seedMax > 0).reduce((s, f) => s + (f.seedMin + f.seedMax) / 2, 0) / VC_DATA.filter(f => f.seedMax > 0).length;

function AnimatedNumber({ target, prefix = "", suffix = "", decimals = 0 }: { target: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, target]);

  return (
    <div ref={ref} className="font-mono text-2xl md:text-3xl font-semibold text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {prefix}{decimals > 0 ? value.toFixed(decimals) : Math.round(value)}<span className="text-teal-600 text-lg">{suffix}</span>
    </div>
  );
}

const stats = [
  { label: "Firms Analyzed", target: totalFirms, prefix: "", suffix: "", decimals: 0 },
  { label: "Combined AUM", target: totalAUM / 1000, prefix: "$", suffix: "B", decimals: 0 },
  { label: "Avg Seed Check", target: avgSeedCheck, prefix: "$", suffix: "M", decimals: 1 },
  { label: "Metrics Tracked", target: 12, prefix: "", suffix: "+", decimals: 0 },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-25"
        style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/40" />

      <div className="container relative z-10 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xs font-mono uppercase tracking-[0.25em] text-teal-600 mb-4"
            >
              Interactive Analysis — 2025/2026
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.08] text-foreground mb-6"
              style={{ fontFamily: "'Instrument Sans', sans-serif" }}
            >
              Tier-1 Venture Capital
              <br />
              <span className="text-teal-700">Ecosystem Explorer</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-base leading-relaxed max-w-lg mb-10"
            >
              An interactive analysis of seed and Series A financing across {totalFirms} leading venture capital firms.
              Compare check sizes, graduation rates, fund performance, and deal pacing against industry benchmarks.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6"
            >
              {stats.map((s, i) => (
                <div key={i} className="border-l-2 border-teal-200 pl-4">
                  <AnimatedNumber target={s.target} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
                  <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-mono">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Data viz artwork */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-8 bg-teal-100/20 rounded-full blur-3xl" />
              <img
                src={DATA_VIZ}
                alt="VC Ecosystem Network Visualization"
                className="relative w-full max-w-md"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
