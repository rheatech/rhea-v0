export type ServiceVariant = "enterprise" | "governance" | "ngo" | "ai"

export interface ServiceData {
  title: string
  subtitle: string
  description: string
  color: string
  variant: ServiceVariant
}

export const serviceMap: Record<string, ServiceData> = {
  "enterprise-infrastructure": {
    title: "Enterprise Infrastructure",
    subtitle: "Infrastructure",
    description:
      "Scalable, secure infrastructure solutions engineered for enterprise demands. Deploy globally with 99.99% uptime guarantees and advanced monitoring.",
    color: "#2563eb",
    variant: "enterprise",
  },
  "governance-ai": {
    title: "Governance AI Platform",
    subtitle: "Governance",
    description:
      "Advanced AI systems designed for government compliance and decision-making. Enable policy optimization with predictive analytics and real-time dashboards.",
    color: "#9333ea",
    variant: "governance",
  },
  "ngo-analytics": {
    title: "NGO Impact Analytics",
    subtitle: "Social Impact",
    description:
      "Measurement and reporting tools for social impact organizations. Track KPIs, demonstrate impact, and secure funding with data-driven insights.",
    color: "#10b981",
    variant: "ngo",
  },
  "ai-inference": {
    title: "Advanced AI Inference Engine",
    subtitle: "AI & ML",
    description:
      "Real-time edge computing for advanced AI model deployment. Sub-millisecond latency with GPU acceleration and auto-scaling capabilities.",
    color: "#06b6d4",
    variant: "ai",
  },
}

export function getServiceData(slug: string): ServiceData {
  return serviceMap[slug] || serviceMap["enterprise-infrastructure"]
}
