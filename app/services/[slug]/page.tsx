"use client"

import { Navbar } from "@/components/navbar"
import { CustomCursor } from "@/components/custom-cursor"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Footer } from "@/components/footer"
import { ServiceHeroVariant } from "@/components/service-hero-variants"
import { ServiceContent } from "@/components/service-content"
import { ServiceCallToAction } from "@/components/service-cta"
import { getServiceData } from "@/lib/service-data"

interface ServiceDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params
  const serviceData = getServiceData(slug)

  return (
    <SmoothScroll>
      <CustomCursor />
      <Navbar />
      <main>
        <ServiceHeroVariant service={serviceData} variant={serviceData.variant} />
        <ServiceContent slug={slug} />
        <ServiceCallToAction />
        <Footer />
      </main>
    </SmoothScroll>
  )
}
