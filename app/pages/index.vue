<script setup lang="ts">
/**
 * Skeleton landing page — the section order is the argument:
 * what it is → prove it (code) → what it does → why us → what it costs → sign up.
 *
 * Each section is a self-contained component so any of them can be replaced,
 * reordered or dropped without touching the others.
 */
</script>

<template>
  <div>
    <SiteNav />
    <main>
      <SiteHero />
      <CapabilityGrid />
      <OpenSourceBand />
      <PricingTable />
      <ClosingCta />
    </main>
    <SiteFooter />
  </div>
</template>
