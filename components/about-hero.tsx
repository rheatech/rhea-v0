"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { SentientSphereAbout } from "./sentient-sphere-about"

export function AboutHero() {
  const containerRef = useRef<HTMLSection>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.4], [0, 80])
  
  // Parallax scrollytelling effects
  const titleY = useTransform(scrollYProgress, [0, 0.5], [0, -120])
  const statsScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.85])
  const sphereOpacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 0.15])

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#050505] flex items-center justify-center">
      {/* 3D Sentient Sphere Background - Blended with Scrollytelling */}
      <motion.div 
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={{ opacity: sphereOpacity }}
      >
        <SentientSphereAbout />
      </motion.div>
      
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] pointer-events-none" />

      {/* Content */}
      <motion.div style={{ opacity, y }} className="relative z-10 text-center px-8 md:px-12 max-w-4xl">
        <motion.div
          style={{ y: titleY }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <p className="font-mono text-xs tracking-[0.3em] text-accent mb-6">ABOUT RHEA</p>
          <h1 className="font-sans text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-balance mb-8">
            Advanced Tech for
            <br />
            <span className="italic">Global Impact</span>
          </h1>
          <p className="font-mono text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            At Rhea, we engineer cutting-edge technology solutions for enterprises, governments, NGOs, and innovators who are transforming the world. Our mission is to make advanced infrastructure and AI accessible, scalable, and purposeful.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-16 md:mt-20 grid grid-cols-3 gap-8"
          style={{ scale: statsScale }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {[
            { number: "50+", label: "Enterprise Clients" },
            { number: "100M+", label: "Lives Impacted" },
            { number: "99.99%", label: "Uptime SLA" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-sans text-2xl md:text-4xl font-light mb-2">{stat.number}</p>
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{stat.label}</p>
            </div>
          ))}
        </motion.div>
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
