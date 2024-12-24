# components/TimeZoneSelector.vue
<template>
  <div class="space-y-4">
    <!-- Preset buttons -->
    <div class="flex gap-2 flex-wrap">
      <button
        v-for="preset in store.presets"
        :key="preset.name"
        @click="store.loadPreset(preset.name)"
        class="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
      >
        {{ preset.name }}
      </button>
    </div>

    <!-- Timezone selector -->
    <div class="p-4 bg-gray-800 rounded-lg">
      <select
        v-model="selectedZone"
        @change="addZone"
        class="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Add a timezone...</option>
        <option v-for="zone in availableZones" :key="zone" :value="zone">
          {{ zone.replace(/_/g, ' ') }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTimeZoneStore } from '@/stores/timeZone'

const store = useTimeZoneStore()
const selectedZone = ref('')

const availableZones = computed(() => {
  return Intl.supportedValuesOf('timeZone').filter(
    zone => !store.timeZones.some(tz => tz.id === zone)
  )
})

const addZone = () => {
  if (selectedZone.value) {
    store.addTimeZone(selectedZone.value)
    selectedZone.value = ''
  }
}
</script>