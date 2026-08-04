<script setup lang="ts">
/**
 * A tabbed request/response sample.
 *
 * Hand-highlighted with spans rather than a syntax-highlighting dependency:
 * three short snippets do not justify shipping a tokenizer, and the point here
 * is the shape of the API, not perfect grammar colouring.
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
  <div class="surface-card overflow-hidden shadow-2xl shadow-black/40">
    <!-- Title bar -->
    <div class="flex items-center gap-3 border-b border-border bg-surface-raised px-4 py-2.5">
      <div class="flex gap-1.5" aria-hidden="true">
        <span class="size-2.5 rounded-full bg-border-strong" />
        <span class="size-2.5 rounded-full bg-border-strong" />
        <span class="size-2.5 rounded-full bg-border-strong" />
      </div>

      <div class="ml-2 flex gap-1">
        <button
          v-for="sample in samples"
          :key="sample.id"
          class="rounded-md px-2.5 py-1 font-mono text-xs transition-colors"
          :class="
            active === sample.id
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          "
          @click="active = sample.id"
        >
          {{ sample.label }}
        </button>
      </div>

      <button
        class="ml-auto rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
        :aria-label="copied ? 'Copied' : 'Copy request'"
        @click="copy"
      >
        <Check v-if="copied" class="size-3.5 text-[var(--success)]" />
        <Copy v-else class="size-3.5" />
      </button>
    </div>

    <div class="grid gap-px bg-border md:grid-cols-2">
      <pre class="overflow-x-auto bg-surface p-4 font-mono text-[13px] leading-relaxed"><code>{{ current().command }}</code></pre>
      <pre class="overflow-x-auto bg-surface p-4 font-mono text-[13px] leading-relaxed text-muted-foreground"><code>{{ current().response }}</code></pre>
    </div>

    <div class="flex items-center justify-between border-t border-border bg-surface-raised px-4 py-2">
      <span class="font-mono text-xs text-muted-foreground">
        {{ current().credits }} credit{{ current().credits === 1 ? '' : 's' }} per request
      </span>
      <span class="font-mono text-xs text-muted-foreground">
        {{ Math.floor(1_000_000 / current().credits).toLocaleString() }} of these on Developer
      </span>
    </div>
  </div>
</template>
