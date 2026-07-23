"use client"

import { motion } from "framer-motion"

const serviceContent: Record<
  string,
  {
    features: string[]
    benefits: string[]
    use_cases: string[]
  }
> = {
  "enterprise-infrastructure": {
    features: [
      "99.99% uptime SLA",
      "Multi-region deployment",
      "End-to-end encryption",
      "Advanced monitoring & alerting",
      "Automated scaling",
      "DDoS protection",
    ],
    benefits: [
      "Reduced operational costs",
      "Improved system reliability",
      "Enhanced security posture",
      "Faster time-to-market",
      "Global reach",
      "Compliance readiness",
    ],
    use_cases: ["Fortune 500 companies", "FinTech platforms", "Healthcare systems", "E-commerce infrastructure"],
  },
  "governance-ai": {
    features: [
      "Predictive analytics",
      "Compliance automation",
      "Real-time dashboards",
      "Policy optimization",
      "Risk assessment",
      "Audit trails",
    ],
    benefits: [
      "Faster decision-making",
      "Regulatory compliance",
      "Risk mitigation",
      "Transparency & accountability",
      "Cost optimization",
      "Stakeholder confidence",
    ],
    use_cases: ["Government agencies", "Regulatory bodies", "Public institutions", "Policy think tanks"],
  },
  "ngo-analytics": {
    features: [
      "Custom KPI tracking",
      "Impact visualization",
      "Automated reporting",
      "Stakeholder dashboards",
      "Data collaboration",
      "Grant compliance",
    ],
    benefits: [
      "Demonstrate impact",
      "Secure funding",
      "Improve programs",
      "Efficient resource allocation",
      "Transparency",
      "Evidence-based decisions",
    ],
    use_cases: ["Development organizations", "Charities", "Social enterprises", "Community groups"],
  },
  "ai-inference": {
    features: [
      "Sub-millisecond latency",
      "GPU acceleration",
      "Model optimization",
      "Multi-model deployment",
      "Auto-scaling",
      "API management",
    ],
    benefits: [
      "Real-time AI applications",
      "Reduced infrastructure costs",
      "Improved user experience",
      "Privacy by design",
      "Enterprise reliability",
      "Easy integration",
    ],
    use_cases: ["Computer vision", "Natural language processing", "Recommendation engines", "Real-time analytics"],
  },
}

export function ServiceContent({ slug }: { slug: string }) {
  const content = serviceContent[slug] || serviceContent["enterprise-infrastructure"]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section className="relative py-24 md:py-32 px-8 md:px-12 bg-[#050505]">
      <div className="max-w-6xl mx-auto">
        {/* Features */}
        <motion.div
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 className="font-sans text-3xl md:text-5xl font-light mb-12 text-balance" variants={itemVariants}>
            Core <span className="italic">Features</span>
          </motion.h2>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants}>
            {content.features.map((feature, i) => (
              <motion.div key={i} variants={itemVariants} className="p-6 border border-white/10 rounded-lg hover:border-white/30 transition-colors">
                <p className="font-mono text-sm text-muted-foreground">{feature}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 className="font-sans text-3xl md:text-5xl font-light mb-12 text-balance" variants={itemVariants}>
            Key <span className="italic">Benefits</span>
          </motion.h2>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" variants={containerVariants}>
            {content.benefits.map((benefit, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex gap-4 group cursor-pointer"
              >
                <div className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0 group-hover:scale-150 transition-transform" />
                <p className="font-mono text-sm text-muted-foreground group-hover:text-white transition-colors">{benefit}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Use Cases */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 className="font-sans text-3xl md:text-5xl font-light mb-12 text-balance" variants={itemVariants}>
            Ideal <span className="italic">For</span>
          </motion.h2>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants}>
            {content.use_cases.map((useCase, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="p-8 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
              >
                <p className="font-sans text-lg font-light">{useCase}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
