"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ScrollytellingProps {
  title: string
  subtitle?: string
  description?: string
  sections: Array<{
    heading: string
    content: React.ReactNode
  }>
  background?: string
}

export function ScrollytellingSection({
  title,
  subtitle,
  description,
  sections,
  background = "bg-[#050505]",
}: ScrollytellingProps) {
  const containerRef = useRef<HTMLSection>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  return (
    <section ref={containerRef} className={`relative py-24 md:py-48 px-8 md:px-12 ${background}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header with scroll-triggered reveal */}
        <motion.div
          className="mb-32"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {subtitle && (
            <motion.p className="font-mono text-xs tracking-[0.3em] text-accent mb-4">
              {subtitle.toUpperCase()}
            </motion.p>
          )}
          <motion.h2 className="font-sans text-4xl md:text-6xl font-light tracking-tight mb-6 text-balance">
            {title}
          </motion.h2>
          {description && (
            <motion.p className="max-w-3xl font-mono text-sm md:text-base text-muted-foreground leading-relaxed">
              {description}
            </motion.p>
          )}
        </motion.div>

        {/* Scrollytelling sections */}
        <div className="space-y-32">
          {sections.map((section, index) => {
            // Create individual scroll progress for each section
            const sectionRef = useRef<HTMLDivElement>(null)
            const { scrollYProgress: sectionProgress } = useScroll({
              target: sectionRef,
              offset: ["start 80%", "start 20%"],
            })

            const opacity = useTransform(sectionProgress, [0, 0.5, 1], [0.4, 1, 0.4])
            const y = useTransform(sectionProgress, [0, 0.5, 1], [40, 0, -40])

            return (
              <motion.div
                key={index}
                ref={sectionRef}
                style={{ opacity, y }}
                className="relative"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                  {/* Content on left/right alternating */}
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className={`md:col-span-5 ${index % 2 === 0 ? "md:col-start-1" : "md:col-start-8"}`}
                  >
                    <h3 className="font-sans text-3xl md:text-4xl font-light mb-6 text-balance">
                      {section.heading}
                    </h3>
                    {section.content}
                  </motion.div>

                  {/* Visual accent */}
                  <motion.div
                    className={`md:col-span-5 h-80 md:h-96 ${index % 2 === 0 ? "md:col-start-8" : "md:col-start-1"}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="w-full h-full border-2 border-white/10 rounded-lg"
                      animate={{
                        borderColor: ["rgba(255,255,255,0.1)", "rgba(37, 99, 235, 0.3)", "rgba(255,255,255,0.1)"],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom scroll indicator */}
        <motion.div
          className="mt-32 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="h-24 w-px bg-gradient-to-b from-white/20 to-transparent"
            animate={{ scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </motion.div>
      </div>
    </section>
  )
}
