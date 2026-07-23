"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function ServicesHero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  return (
    <section ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-[#050505] flex items-center justify-center">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(37, 99, 235, 0.05) 25%, rgba(37, 99, 235, 0.05) 26%, transparent 27%, transparent 74%, rgba(37, 99, 235, 0.05) 75%, rgba(37, 99, 235, 0.05) 76%, transparent 77%, transparent),
                             linear-gradient(90deg, transparent 24%, rgba(37, 99, 235, 0.05) 25%, rgba(37, 99, 235, 0.05) 26%, transparent 27%, transparent 74%, rgba(37, 99, 235, 0.05) 75%, rgba(37, 99, 235, 0.05) 76%, transparent 77%, transparent)`,
            backgroundSize: "50px 50px",
          }}
          animate={{
            y: [0, 50],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      {/* Content */}
      <motion.div style={{ opacity, y }} className="relative z-10 text-center px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-6">OUR SOLUTIONS</p>
          <h1 className="font-sans text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-balance mb-6">
            Enterprise-Grade
            <br />
            <span className="italic">Infrastructure</span>
          </h1>
          <p className="max-w-2xl mx-auto font-mono text-sm text-muted-foreground leading-relaxed">
            Tailored solutions for enterprises, governments, NGOs, and advanced AI applications. Built for scale, security, and impact.
          </p>
        </motion.div>

        {/* Animated Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12 h-px bg-white/10 origin-center"
        />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  )
}
