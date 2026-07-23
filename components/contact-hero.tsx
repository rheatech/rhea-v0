"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function ContactHero() {
  const containerRef = useRef<HTMLSection>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9])

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#050505] flex items-center justify-center">
      {/* Animated Lines Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        >
          <line x1="0" y1="0" x2="1000" y2="1000" stroke="rgba(37, 99, 235, 0.1)" strokeWidth="2" />
          <line x1="1000" y1="0" x2="0" y2="1000" stroke="rgba(37, 99, 235, 0.1)" strokeWidth="2" />
          <line x1="500" y1="0" x2="500" y2="1000" stroke="rgba(37, 99, 235, 0.05)" strokeWidth="1" />
          <line x1="0" y1="500" x2="1000" y2="500" stroke="rgba(37, 99, 235, 0.05)" strokeWidth="1" />
        </motion.svg>
      </div>

      {/* Content */}
      <motion.div style={{ opacity, scale }} className="relative z-10 text-center px-8 md:px-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <p className="font-mono text-xs tracking-[0.3em] text-accent mb-6">LET'S CONNECT</p>
          <h1 className="font-sans text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-balance mb-8">
            Transform Your
            <br />
            <span className="italic">Organization</span>
          </h1>
          <p className="font-mono text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Have a question or ready to start your transformation? Our team is here to help you explore how Rhea can accelerate your mission.
          </p>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="p-6 border border-white/10 rounded-lg hover:border-white/30 transition-colors">
            <p className="font-mono text-xs tracking-widest text-accent mb-2 uppercase">Email</p>
            <a href="mailto:hello@rhea.tech" className="font-sans text-lg hover:text-accent transition-colors">
              hello@rhea.tech
            </a>
          </div>
          <div className="p-6 border border-white/10 rounded-lg hover:border-white/30 transition-colors">
            <p className="font-mono text-xs tracking-widest text-accent mb-2 uppercase">Response Time</p>
            <p className="font-sans text-lg">Within 24 Hours</p>
          </div>
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
