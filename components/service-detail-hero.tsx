"use client"

import { useRef, useMemo } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const serviceDetails: Record<string, { title: string; subtitle: string; description: string; color: string }> = {
  "enterprise-infrastructure": {
    title: "Enterprise Infrastructure",
    subtitle: "Engineered for Scale",
    description: "Robust, secure infrastructure solutions built to support your organization's growth",
    color: "rgba(37, 99, 235, 0.1)",
  },
  "governance-ai": {
    title: "Governance AI Platform",
    subtitle: "Intelligent Decision Making",
    description: "Advanced AI systems designed for governance, compliance, and strategic decision support",
    color: "rgba(59, 130, 246, 0.1)",
  },
  "ngo-analytics": {
    title: "NGO Impact Analytics",
    subtitle: "Measure What Matters",
    description: "Comprehensive analytics platform for measuring and reporting social impact",
    color: "rgba(99, 102, 241, 0.1)",
  },
  "ai-inference": {
    title: "Advanced AI Inference Engine",
    subtitle: "Real-Time Intelligence",
    description: "Edge computing platform for deploying and running advanced AI models in real-time",
    color: "rgba(139, 92, 246, 0.1)",
  },
}

export function ServiceDetailHero({ slug }: { slug: string }) {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end center"],
  })

  const service = serviceDetails[slug] || serviceDetails["enterprise-infrastructure"]

  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.3])
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95])
  const blur = useTransform(scrollYProgress, [0, 0.4], [0, 10])

  // Animated text stagger
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
      },
    }),
  }

  return (
    <section ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-[#050505] flex items-center justify-center pt-24 md:pt-32">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${service.color}, transparent 70%)`,
            opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]),
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 text-center px-8 md:px-12 max-w-5xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.p
            className="font-mono text-xs tracking-[0.3em] text-accent mb-6"
            custom={0}
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            {service.subtitle.toUpperCase()}
          </motion.p>

          <motion.h1
            className="font-sans text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-balance mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {service.title}
          </motion.h1>

          <motion.p
            className="max-w-3xl mx-auto font-mono text-sm md:text-base text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {service.description}
          </motion.p>
        </motion.div>

        {/* Vertical Line Animation */}
        <motion.div
          className="mt-16 md:mt-20 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className="w-px h-16 bg-gradient-to-b from-white/50 to-transparent"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          />
        </motion.div>
      </motion.div>

      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-white/20"
        style={{
          scaleX: scrollYProgress,
          transformOrigin: "left",
        }}
      />
    </section>
  )
}
