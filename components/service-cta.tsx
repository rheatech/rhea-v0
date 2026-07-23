"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export function ServiceCallToAction() {
  return (
    <section className="relative py-24 md:py-32 px-8 md:px-12 bg-[#050505] border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-accent mb-6">READY TO TRANSFORM</p>
          <h2 className="font-sans text-4xl md:text-6xl font-light tracking-tight text-balance mb-8">
            Let's Build the <span className="italic">Future Together</span>
          </h2>
          <p className="font-mono text-sm text-muted-foreground mb-12 max-w-2xl mx-auto">
            Connect with our team to explore how our solutions can accelerate your mission and create global impact.
          </p>

          <motion.div
            className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-white/20 rounded-full font-mono text-sm tracking-widest uppercase bg-transparent backdrop-blur-sm hover:bg-white hover:text-black transition-colors duration-300"
              >
                Get in Touch
              </motion.button>
            </Link>
            <Link href="/services">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-white/20 rounded-full font-mono text-sm tracking-widest uppercase bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300"
              >
                Explore More
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
