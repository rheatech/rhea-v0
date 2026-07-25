"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertCircle } from "lucide-react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    service: "",
    message: "",
  })

  const [focusedField, setFocusedField] = useState<string | null>(null)
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
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField(null)}
          >
            <label htmlFor="name" className="block font-mono text-xs tracking-widest text-muted-foreground mb-3 uppercase">
              Full Name *
            </label>
            <motion.div
              animate={{
                borderColor: focusedField === "name" ? "rgba(37, 99, 235, 0.5)" : "rgba(255, 255, 255, 0.1)",
              }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                required
                className="w-full px-4 py-3 bg-transparent border border-white/10 rounded text-foreground focus:border-accent/50 outline-none transition-colors placeholder-muted-foreground font-mono text-sm"
                placeholder="Your name"
              />
              <motion.div
                initial={false}
                animate={{
                  scaleX: focusedField === "name" ? 1 : 0,
                }}
                className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent origin-left"
              />
            </motion.div>
          </motion.div>

          {/* Email */}
          <motion.div
            variants={formVariants}
            transition={{ delay: 0.15 }}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
          >
            <label htmlFor="email" className="block font-mono text-xs tracking-widest text-muted-foreground mb-3 uppercase">
              Email Address *
            </label>
            <motion.div
              animate={{
                borderColor: focusedField === "email" ? "rgba(37, 99, 235, 0.5)" : "rgba(255, 255, 255, 0.1)",
              }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                required
                className="w-full px-4 py-3 bg-transparent border border-white/10 rounded text-foreground focus:border-accent/50 outline-none transition-colors placeholder-muted-foreground font-mono text-sm"
                placeholder="you@company.com"
              />
              <motion.div
                initial={false}
                animate={{
                  scaleX: focusedField === "email" ? 1 : 0,
                }}
                className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent origin-left"
              />
            </motion.div>
          </motion.div>

          {/* Organization */}
          <motion.div
            variants={formVariants}
            transition={{ delay: 0.2 }}
            onFocus={() => setFocusedField("organization")}
            onBlur={() => setFocusedField(null)}
          >
            <label htmlFor="organization" className="block font-mono text-xs tracking-widest text-muted-foreground mb-3 uppercase">
              Organization
            </label>
            <motion.div
              animate={{
                borderColor: focusedField === "organization" ? "rgba(37, 99, 235, 0.5)" : "rgba(255, 255, 255, 0.1)",
              }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <input
                id="organization"
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                onFocus={() => setFocusedField("organization")}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 py-3 bg-transparent border border-white/10 rounded text-foreground focus:border-accent/50 outline-none transition-colors placeholder-muted-foreground font-mono text-sm"
                placeholder="Your organization"
              />
              <motion.div
                initial={false}
                animate={{
                  scaleX: focusedField === "organization" ? 1 : 0,
                }}
                className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent origin-left"
              />
            </motion.div>
          </motion.div>

          {/* Service Interest */}
          <motion.div
            variants={formVariants}
            transition={{ delay: 0.25 }}
            onFocus={() => setFocusedField("service")}
            onBlur={() => setFocusedField(null)}
          >
            <label htmlFor="service" className="block font-mono text-xs tracking-widest text-muted-foreground mb-3 uppercase">
              Service of Interest
            </label>
            <motion.div
              animate={{
                borderColor: focusedField === "service" ? "rgba(37, 99, 235, 0.5)" : "rgba(255, 255, 255, 0.1)",
              }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                onFocus={() => setFocusedField("service")}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 py-3 bg-transparent border border-white/10 rounded text-foreground focus:border-accent/50 outline-none transition-colors font-mono text-sm cursor-pointer"
              >
                <option value="">Select a service...</option>
                <option value="enterprise">Enterprise Infrastructure</option>
                <option value="governance">Governance AI Platform</option>
                <option value="ngo">NGO Impact Analytics</option>
                <option value="ai">Advanced AI Inference Engine</option>
                <option value="other">Other</option>
              </select>
              <motion.div
                initial={false}
                animate={{
                  scaleX: focusedField === "service" ? 1 : 0,
                }}
                className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent origin-left"
              />
            </motion.div>
          </motion.div>

          {/* Message */}
          <motion.div
            variants={formVariants}
            transition={{ delay: 0.3 }}
            onFocus={() => setFocusedField("message")}
            onBlur={() => setFocusedField(null)}
          >
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="message" className="block font-mono text-xs tracking-widest text-muted-foreground uppercase">
                Message *
              </label>
              <span className="font-mono text-xs text-muted-foreground">
                {formData.message.length}/500
              </span>
            </div>
            <motion.div
              animate={{
                borderColor: focusedField === "message" ? "rgba(37, 99, 235, 0.5)" : "rgba(255, 255, 255, 0.1)",
              }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    handleChange(e)
                  }
                }}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                required
                rows={6}
                className="w-full px-4 py-3 bg-transparent border border-white/10 rounded text-foreground focus:border-accent/50 outline-none transition-colors placeholder-muted-foreground font-mono text-sm resize-none"
                placeholder="Tell us about your project..."
              />
              <motion.div
                initial={false}
                animate={{
                  scaleX: focusedField === "message" ? 1 : 0,
                }}
                className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent origin-left"
              />
            </motion.div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            variants={formVariants}
            transition={{ delay: 0.35 }}
          >
            <motion.button
              type="submit"
              disabled={isSubmitting || submitStatus === "success"}
              whileHover={{ scale: isSubmitting || submitStatus === "success" ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting || submitStatus === "success" ? 1 : 0.98 }}
              className="relative w-full px-6 py-4 border border-white/20 rounded font-mono text-xs tracking-widest uppercase bg-transparent hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{
                  x: isSubmitting ? ["-100%", "100%"] : "0%",
                }}
                transition={{
                  duration: 1.5,
                  repeat: isSubmitting ? Number.POSITIVE_INFINITY : 0,
                  ease: "linear",
                }}
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting && (
                  <motion.div
                    className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                )}
                {isSubmitting ? "Sending..." : submitStatus === "success" ? "Message Sent!" : "Send Message"}
              </span>
            </motion.button>
          </motion.div>

          {/* Status Messages */}
          <AnimatePresence>
            {submitStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="p-4 border border-green-500/30 bg-green-500/10 rounded flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-mono text-sm text-green-500 font-semibold">Message sent successfully!</p>
                  <p className="font-mono text-xs text-green-400 mt-1">We'll get back to you within 24 hours.</p>
                </div>
              </motion.div>
            )}
            {submitStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="p-4 border border-red-500/30 bg-red-500/10 rounded flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="font-mono text-sm text-red-500 font-semibold">Failed to send</p>
                  <p className="font-mono text-xs text-red-400 mt-1">Please try again or email us directly.</p>
                </div>
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
