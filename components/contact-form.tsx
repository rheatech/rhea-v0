"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    service: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Replace with your actual form submission logic
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitStatus("success")
      setFormData({ name: "", email: "", organization: "", service: "", message: "" })
      setTimeout(() => setSubmitStatus("idle"), 3000)
    } catch (error) {
      setSubmitStatus("error")
      setTimeout(() => setSubmitStatus("idle"), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  }

  return (
    <section className="relative py-24 md:py-32 px-8 md:px-12 bg-[#050505]">
      <div className="max-w-2xl mx-auto">
        <motion.form
          onSubmit={handleSubmit}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={formVariants}
          className="space-y-8"
        >
          {/* Name */}
          <motion.div
            variants={formVariants}
            transition={{ delay: 0.1 }}
          >
            <label htmlFor="name" className="block font-mono text-xs tracking-widest text-muted-foreground mb-3 uppercase">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-transparent border border-white/10 rounded text-foreground focus:border-white/30 outline-none transition-colors placeholder-muted-foreground font-mono text-sm"
              placeholder="Your name"
            />
          </motion.div>

          {/* Email */}
          <motion.div
            variants={formVariants}
            transition={{ delay: 0.15 }}
          >
            <label htmlFor="email" className="block font-mono text-xs tracking-widest text-muted-foreground mb-3 uppercase">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-transparent border border-white/10 rounded text-foreground focus:border-white/30 outline-none transition-colors placeholder-muted-foreground font-mono text-sm"
              placeholder="you@company.com"
            />
          </motion.div>

          {/* Organization */}
          <motion.div
            variants={formVariants}
            transition={{ delay: 0.2 }}
          >
            <label htmlFor="organization" className="block font-mono text-xs tracking-widest text-muted-foreground mb-3 uppercase">
              Organization
            </label>
            <input
              id="organization"
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-transparent border border-white/10 rounded text-foreground focus:border-white/30 outline-none transition-colors placeholder-muted-foreground font-mono text-sm"
              placeholder="Your organization"
            />
          </motion.div>

          {/* Service Interest */}
          <motion.div
            variants={formVariants}
            transition={{ delay: 0.25 }}
          >
            <label htmlFor="service" className="block font-mono text-xs tracking-widest text-muted-foreground mb-3 uppercase">
              Service of Interest
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-transparent border border-white/10 rounded text-foreground focus:border-white/30 outline-none transition-colors font-mono text-sm cursor-pointer"
            >
              <option value="">Select a service...</option>
              <option value="enterprise">Enterprise Infrastructure</option>
              <option value="governance">Governance AI Platform</option>
              <option value="ngo">NGO Impact Analytics</option>
              <option value="ai">Advanced AI Inference Engine</option>
              <option value="other">Other</option>
            </select>
          </motion.div>

          {/* Message */}
          <motion.div
            variants={formVariants}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="message" className="block font-mono text-xs tracking-widest text-muted-foreground mb-3 uppercase">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 bg-transparent border border-white/10 rounded text-foreground focus:border-white/30 outline-none transition-colors placeholder-muted-foreground font-mono text-sm resize-none"
              placeholder="Tell us about your project..."
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div
            variants={formVariants}
            transition={{ delay: 0.35 }}
          >
            <motion.button
              type="submit"
              disabled={isSubmitting || submitStatus === "success"}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-4 border border-white/20 rounded font-mono text-xs tracking-widest uppercase bg-transparent hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isSubmitting ? "Sending..." : submitStatus === "success" ? "Message Sent!" : "Send Message"}
            </motion.button>
          </motion.div>

          {/* Status Messages */}
          <AnimatePresence>
            {submitStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 border border-green-500/30 bg-green-500/10 rounded text-green-500 font-mono text-sm text-center"
              >
                Thank you! We'll get back to you within 24 hours.
              </motion.div>
            )}
            {submitStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 border border-red-500/30 bg-red-500/10 rounded text-red-500 font-mono text-sm text-center"
              >
                Something went wrong. Please try again.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 pt-16 border-t border-white/10"
        >
          <p className="font-mono text-sm text-muted-foreground text-center mb-8">
            Prefer direct communication? Reach out to us at{" "}
            <a href="mailto:hello@rhea.tech" className="text-white hover:text-accent transition-colors">
              hello@rhea.tech
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
