"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ServiceHeroVariantProps {
  service: {
    title: string
    subtitle: string
    description: string
    color: string
  }
  variant: "enterprise" | "governance" | "ngo" | "ai"
}

export function ServiceHeroVariant({ service, variant }: ServiceHeroVariantProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Base transforms
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.3])
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95])
  const titleY = useTransform(scrollYProgress, [0, 0.5], [0, -120])

  // Variant-specific scrollytelling patterns
  let bgGradient = "from-blue-500/20"
  let accentColor = "#2563eb"
  let scrollEffect = null

  if (variant === "enterprise") {
    bgGradient = "from-blue-500/20"
    accentColor = "#2563eb"
    scrollEffect = useTransform(scrollYProgress, [0, 1], [0, 360])
  } else if (variant === "governance") {
    bgGradient = "from-purple-500/20"
    accentColor = "#9333ea"
    scrollEffect = useTransform(scrollYProgress, [0, 0.5], [0, 100])
  } else if (variant === "ngo") {
    bgGradient = "from-emerald-500/20"
    accentColor = "#10b981"
    scrollEffect = useTransform(scrollYProgress, [0, 1], [0, -50])
  } else if (variant === "ai") {
    bgGradient = "from-cyan-500/20"
    accentColor = "#06b6d4"
    scrollEffect = useTransform(scrollYProgress, [0, 0.6], [0, 200])
  }

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#050505] flex items-center justify-center">
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-radial ${bgGradient} to-transparent opacity-30`} />

      {/* Variant-specific animated elements */}
      {variant === "enterprise" && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.05) 0%, transparent 70%)`,
            rotate: scrollEffect,
          }}
        />
      )}

      {variant === "governance" && (
        <motion.svg
          className="absolute inset-0 w-full h-full opacity-5"
          viewBox="0 0 1000 1000"
          style={{ y: scrollEffect }}
        >
          <defs>
            <pattern id="grid-governance" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(147, 51, 234, 0.1)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1000" height="1000" fill="url(#grid-governance)" />
        </motion.svg>
      )}

      {variant === "ngo" && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 30% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 60%)`,
            y: scrollEffect,
          }}
        />
      )}

      {variant === "ai" && (
        <motion.svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          style={{ y: scrollEffect }}
        >
          <line x1="0" y1="500" x2="1000" y2="500" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="2" />
          <line x1="500" y1="0" x2="500" y2="1000" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="2" />
          <circle cx="500" cy="500" r="300" fill="none" stroke="rgba(6, 182, 212, 0.05)" strokeWidth="1" />
          <circle cx="500" cy="500" r="200" fill="none" stroke="rgba(6, 182, 212, 0.05)" strokeWidth="1" />
        </motion.svg>
      )}

      {/* Content */}
      <motion.div style={{ opacity, scale }} className="relative z-10 text-center px-8 md:px-12 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.p
            style={{ y: titleY, color: accentColor }}
            className="font-mono text-xs tracking-[0.3em] mb-6"
          >
            {service.subtitle.toUpperCase()}
          </motion.p>

          <motion.h1
            style={{ y: titleY }}
            className="font-sans text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-balance mb-8 text-white"
          >
            {service.title}
          </motion.h1>

          <motion.p
            style={{ y: useTransform(scrollYProgress, [0, 0.5], [0, -60]) }}
            className="max-w-3xl mx-auto font-mono text-sm md:text-base text-muted-foreground leading-relaxed"
          >
            {service.description}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Progress indicator */}
      <motion.div
        className="absolute bottom-8 left-8 right-8 h-1 bg-white/10 rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full"
          style={{
            width: "100%",
            background: `linear-gradient(90deg, ${accentColor} 0%, transparent 100%)`,
            scaleX: scrollYProgress,
            transformOrigin: "left",
          }}
        />
      </motion.div>
    </div>
  )
}
