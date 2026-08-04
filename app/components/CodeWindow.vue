<script setup lang="ts">
/**
 * Request and response, kept as a ship's log rather than a terminal window.
 *
 * The traffic-light chrome every developer site uses is the one thing that
 * would have broken the conceit, and it was never carrying meaning anyway. A
 * log book does the same job honestly: ruled feint lines, a rubric margin
 * where the ledger rule would be, index tabs down the top, and the charge
 * entered at the foot the way a purser would.
 *
 * No syntax highlighter. Three short snippets don't justify shipping a
 * tokenizer, and the point here is the shape of the API.
 */
import { ref } from 'vue'
import { Check, Copy } from 'lucide-vue-next'

interface Sample {
  id: string
  label: string
  command: string
  response: string
  credits: number
}

const samples: Sample[] = [
  {
    id: 'search',
    label: 'Search',
    command: `curl "https://api.barrelman.dev/search" \\
  -H "Authorization: Bearer brm_live_..." \\
  -d '{"query":"coffee","lat":35.77,"lng":-78.64}'`,
    response: `{
  "results": [
    {
      "id": "node/4021155832",
      "name": "Jubala Coffee",
      "categories": ["amenity/cafe"],
      "distance_m": 240,
      "open_now": true
    }
  ]
}`,
    credits: 6,
  },
  {
    id: 'geocode',
    label: 'Geocode',
    command: `curl "https://api.barrelman.dev/geocode/reverse\\
?lat=35.7796&lng=-78.6382" \\
  -H "Authorization: Bearer brm_live_..."`,
    response: `{
  "address": {
    "city": "Raleigh",
    "county": "Wake County",
    "state": "North Carolina"
  }
}`,
    credits: 5,
  },
  {
    id: 'tiles',
    label: 'Tiles',
    command: `// MapLibre fetches tiles itself, so the key
// rides in the URL.
map.addSource("barrelman", {
  type: "vector",
  tiles: [
    "https://api.barrelman.dev/tiles/pois/" +
    "{z}/{x}/{y}?api_key=brm_live_..."
  ]
})`,
    response: `HTTP/1.1 200 OK
content-type: application/x-protobuf
x-barrelman-credits-charged: 1`,
    credits: 1,
  },
]

const active = ref(samples[0]!.id)
const copied = ref(false)

function current(): Sample {
  return samples.find((s) => s.id === active.value) ?? samples[0]!
}

async function copy() {
  try {
    await navigator.clipboard.writeText(current().command)
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  } catch {
    // Clipboard is unavailable over plain HTTP and in some embedded browsers;
    // the snippet is selectable, so there is nothing to recover from.
  }
}
</script>

<template>
  <div>
    <!--
      Index tabs, sitting on the top edge of the book.

      `-mb-px` with the row raised above the panel is what makes the active tab
      read as continuous with the page below it: the tab's own opaque fill
      covers the panel's top rule for exactly its own width. Without it the
      rule ran straight under the active tab and the whole thing looked like
      buttons parked above a box.
    -->
    <div class="relative z-10 -mb-px flex items-end gap-1 pl-5">
      <button
        v-for="sample in samples"
        :key="sample.id"
        class="rounded-t-md border px-4 pb-2 font-mono text-fine transition-colors"
        :class="
          active === sample.id
            ? 'border-b-0 border-rule-strong bg-paper-aged pt-2 text-ink'
            : 'border-rule bg-paper-deep/60 pt-1.5 text-ink-soft hover:bg-paper-deep hover:text-ink'
        "
        :aria-pressed="active === sample.id"
        @click="active = sample.id"
      >
        {{ sample.label }}
      </button>
    </div>

    <div class="depth overflow-hidden rounded-lg border border-rule-strong bg-paper-aged">
      <!-- Head of the page -->
      <div class="flex items-center justify-between border-b border-rule px-5 py-2">
        <span class="caption">
          Request &amp; reply, entered as made
        </span>
        <button
          class="p-1 text-ink-soft transition-colors hover:text-ink"
          :aria-label="copied ? 'Copied' : 'Copy request'"
          @click="copy"
        >
          <Check v-if="copied" class="size-3.5 text-verdigris" stroke-width="1.5" />
          <Copy v-else class="size-3.5" stroke-width="1.5" />
        </button>
      </div>

      <!-- The ruled leaves. The rubric rule between them is the margin. -->
      <div class="grid md:grid-cols-2">
        <pre
          class="ruled overflow-x-auto border-b border-rubric/30 px-5 font-mono text-[12px] leading-[22px] text-ink md:border-b-0 md:border-r"
          style="padding-top: 14px; padding-bottom: 14px; background-position: 0 14px"
        ><code>{{ current().command }}</code></pre>
        <pre
          class="ruled overflow-x-auto px-5 font-mono text-[12px] leading-[22px] text-ink-soft"
          style="padding-top: 14px; padding-bottom: 14px; background-position: 0 14px"
        ><code>{{ current().response }}</code></pre>
      </div>

      <!-- Foot of the page: the charge, entered like a purser's sounding. -->
      <div
        class="flex flex-wrap items-center justify-between gap-2 border-t border-rule px-5 py-2.5"
      >
        <span class="sounding">
          {{ current().credits }} credit{{ current().credits === 1 ? '' : 's' }} per request
        </span>
        <span class="caption">
          {{ Math.floor(1_000_000 / current().credits).toLocaleString() }} of these on Developer
        </span>
      </div>
    </div>
  </div>
</template>
