"use client"

import { Navbar } from "@/components/navbar"
import { CustomCursor } from "@/components/custom-cursor"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Footer } from "@/components/footer"
import { ServicesHero } from "@/components/services-hero"
import { ServiceGrid } from "@/components/service-grid"

export default function ServicesPage() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Navbar />
      <main>
        <ServicesHero />
        <ServiceGrid />
        <Footer />
      </main>
    </SmoothScroll>
  )
}
