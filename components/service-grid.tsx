"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"

const services = [
  {
    slug: "enterprise-infrastructure",
    title: "Enterprise Infrastructure",
    description: "Scalable, secure infrastructure solutions engineered for enterprise demands",
    tags: ["Security", "Scalability", "Cloud-Native"],
    number: "01",
  },
  {
    slug: "governance-ai",
    title: "Governance AI Platform",
    description: "Advanced AI systems designed for government compliance and decision-making",
    tags: ["AI/ML", "Compliance", "Analytics"],
    number: "02",
  },
  {
    slug: "ngo-analytics",
    title: "NGO Impact Analytics",
    description: "Measurement and reporting tools for social impact organizations",
    tags: ["Analytics", "Impact", "Reporting"],
    number: "03",
  },
  {
    slug: "ai-inference",
    title: "Advanced AI Inference Engine",
    description: "Real-time edge computing for advanced AI model deployment",
    tags: ["AI/ML", "Edge Computing", "Real-time"],
    number: "04",
  },
]

export function ServiceGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  return (
    <section ref={containerRef} className="relative py-24 md:py-32 px-8 md:px-12 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">SERVICES OVERVIEW</p>
          <h2 className="font-sans text-3xl md:text-5xl font-light tracking-tight">
            Built for <span className="italic">Purpose</span>
          </h2>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/services/${service.slug}`}>
                <div className="group relative p-8 md:p-10 border border-white/10 hover:border-white/30 rounded-lg transition-all duration-500 cursor-pointer overflow-hidden">
                  {/* Hover Background */}
                  <motion.div
                    className="absolute inset-0 bg-white/5"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Number */}
                    <div className="mb-6 flex items-center justify-between">
                      <span className="font-mono text-sm text-accent tracking-widest">{service.number}</span>
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-lg text-muted-foreground group-hover:text-white transition-colors">→</span>
                      </motion.div>
                    </div>

                    {/* Title */}
                    <h3 className="font-sans text-xl md:text-2xl font-light mb-4 text-balance">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="font-mono text-xs leading-relaxed text-muted-foreground mb-6">
                      {service.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 border border-white/10 rounded text-xs font-mono text-muted-foreground group-hover:border-white/20 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
