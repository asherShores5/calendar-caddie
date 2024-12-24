# components/TimeZoneList.vue
<template>
  <div class="space-y-4">
    <!-- Format toggle and controls with base timezone indicator -->
    <div class="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
      <div>
        <h2 class="text-lg font-medium text-white">Time Zones</h2>
        <p class="text-sm text-gray-400">Times relative to {{ store.baseZone.replace(/_/g, ' ') }}</p>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-400">Time Format:</span>
        <div class="flex bg-gray-700 rounded-lg p-1">
          <button
            @click="store.timeFormat = '12'"
            :class="[
              'px-3 py-1 rounded transition-colors',
              store.timeFormat === '12'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            ]"
          >
            12h
          </button>
          <button
            @click="store.timeFormat = '24'"
            :class="[
              'px-3 py-1 rounded transition-colors',
              store.timeFormat === '24'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            ]"
          >
            24h
          </button>
        </div>
      </div>
    </div>

    <!-- Timezone list -->
    <div
      v-for="tz in store.timeZones"
      :key="tz.id"
      class="p-4 bg-gray-800 rounded-lg flex justify-between items-center"
    >
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-medium text-white">{{ tz.name }}</h3>
          <span 
            class="text-xs px-2 py-0.5 rounded-full bg-gray-700"
            :class="{
              'text-gray-400': store.getTimeDifference(tz.id) === 'Same time',
              'text-green-400': store.getTimeDifference(tz.id).startsWith('+'),
              'text-red-400': store.getTimeDifference(tz.id).startsWith('-')
            }"
          >
            {{ store.getTimeDifference(tz.id) }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <p class="text-gray-400">
            {{ formatTimeWithZone(store.getTimeIn(tz.id), tz.id).split('(')[0] }}
          </p>
          <span 
            v-if="formatTimeWithZone(store.getTimeIn(tz.id), tz.id).includes('(')"
            class="text-xs px-2 py-1 rounded-full"
            :class="{
              'bg-blue-500/20 text-blue-300': formatTimeWithZone(store.getTimeIn(tz.id), tz.id).includes('Tomorrow'),
              'bg-yellow-500/20 text-yellow-300': formatTimeWithZone(store.getTimeIn(tz.id), tz.id).includes('Yesterday')
            }"
          >
            {{ formatTimeWithZone(store.getTimeIn(tz.id), tz.id).split('(')[1].replace(')', '') }}
          </span>
        </div>
      </div>
      <button
        @click="store.removeTimeZone(tz.id)"
        class="p-2 text-gray-400 hover:text-red-500 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="store.timeZones.length === 0" class="text-center p-8 text-gray-400">
      No time zones added yet. Use the selector above to add some.
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTimeZoneStore } from '@/stores/timeZone'

const store = useTimeZoneStore()

const formatTimeWithZone = (date: Date, timezone: string) => {
  // Get the time in the target timezone
  const targetTime = new Date(date.toLocaleString('en-US', { timeZone: timezone }))
  
  // Get the time in local timezone for comparison
  const localTime = new Date(date.toLocaleString('en-US', { timeZone: store.baseZone }))
  
  // Calculate day difference
  const targetDay = new Date(targetTime.toLocaleString('en-US', { timeZone: timezone })).getDate()
  const localDay = new Date(localTime.toLocaleString('en-US', { timeZone: store.baseZone })).getDate()
  
  // Format the time
  const timeStr = targetTime.toLocaleString('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: store.timeFormat === '12',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  // Add day indicator if date is different
  const dayDiff = targetDay - localDay
  let dayIndicator = ''
  if (dayDiff === 1 || (dayDiff < -27)) { // Handle month boundaries
    dayIndicator = ' (Tomorrow)'
  } else if (dayDiff === -1 || (dayDiff > 27)) { // Handle month boundaries
    dayIndicator = ' (Yesterday)'
  }

  return timeStr + dayIndicator
}
</script>