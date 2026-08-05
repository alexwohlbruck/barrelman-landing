<script setup lang="ts">
/**
 * The section order is the argument:
 * what it is → prove it (log) → what it does → why us → what it costs → sign up.
 *
 * Each section is a self-contained component so any of them can be replaced,
 * reordered or dropped without touching the others.
 *
 * The paper sections are wrapped so the neatline can be drawn around them as
 * one sheet; the night band and the footer fall outside it, past the edge of
 * the chart.
 */
</script>

<template>
  <div>
    <SiteNav />
    <main>
      <div class="relative">
        <div class="neatline" aria-hidden="true" />
        <SiteHero />
        <CapabilityGrid />
        <OpenStreetMapBand />
        <!-- Retired in favour of the OpenStreetMap band above; kept in case the
             open-source differentiator earns its own section again. -->
        <!-- <OpenSourceBand /> -->
        <PricingTable />
      </div>
      <ClosingCta />
    </main>
    <SiteFooter />
  </div>
</template>
