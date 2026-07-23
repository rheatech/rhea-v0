"use client"

import { motion } from "framer-motion"

export function AboutContent() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  }

  const items = [
    {
      title: "Our Mission",
      description: "To democratize advanced technology and make it accessible to enterprises, governments, and organizations driving global change.",
    },
    {
      title: "Our Vision",
      description: "A world where cutting-edge infrastructure and AI are used responsibly and equitably to solve humanity's greatest challenges.",
    },
    {
      title: "Our Values",
      description: "Integrity, innovation, and impact. We build with purpose, operate transparently, and measure success by the positive change we enable.",
    },
  ]

  const teamValues = [
    "We invest in people and foster continuous learning",
    "We believe in the power of collaborative innovation",
    "We prioritize security, privacy, and ethical practices",
    "We embrace diversity and inclusive perspectives",
  ]

  return (
    <section className="relative py-24 md:py-32 px-8 md:px-12 bg-[#050505]">
      <div className="max-w-6xl mx-auto">
        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-24">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={sectionVariants}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="font-sans text-2xl font-light mb-4 text-balance">{item.title}</h3>
              <p className="font-mono text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="h-px bg-white/10 mb-24 origin-left"
        />

        {/* Why Rhea */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="mb-24"
        >
          <h2 className="font-sans text-4xl md:text-5xl font-light mb-8 text-balance">
            Why Choose <span className="italic">Rhea</span>
          </h2>
          <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-12 max-w-3xl">
            We don't just build technology—we partner with visionary organizations to scale their impact. Our team brings decades of combined experience in enterprise infrastructure, AI/ML, cloud architecture, and public sector technology.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamValues.map((value, index) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4 items-start"
              >
                <div className="h-2 w-2 rounded-full bg-accent flex-shrink-0 mt-2" />
                <p className="font-mono text-sm text-muted-foreground">{value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="p-12 md:p-16 border border-white/10 rounded-lg text-center"
        >
          <h3 className="font-sans text-3xl font-light mb-4">Join Our Community</h3>
          <p className="font-mono text-sm text-muted-foreground mb-8">
            If you're passionate about building transformative technology, let's talk.
          </p>
          <a
            href="mailto:hello@rhea.tech"
            className="inline-block px-8 py-3 border border-white/20 rounded-full font-mono text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  )
}
