"use client"

import { Navbar } from "@/components/navbar"
import { CustomCursor } from "@/components/custom-cursor"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Footer } from "@/components/footer"
import { ServiceDetailHero } from "@/components/service-detail-hero"
import { ServiceContent } from "@/components/service-content"
import { ServiceCallToAction } from "@/components/service-cta"

interface ServiceDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params

  return (
    <SmoothScroll>
      <CustomCursor />
      <Navbar />
      <main>
        <ServiceDetailHero slug={slug} />
        <ServiceContent slug={slug} />
        <ServiceCallToAction />
        <Footer />
      </main>
    </SmoothScroll>
  )
}
