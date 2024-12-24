<template>
  <div class="p-4 bg-gray-800 rounded-lg space-y-4">
    <input
      type="datetime-local"
      :value="formatDateForInput(store.selectedDate)"
      @input="updateDate"
      class="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    />
  </div>
</template>

<script setup lang="ts">
import { useTimeZoneStore } from '@/stores/timeZone'

const store = useTimeZoneStore()

const formatDateForInput = (date: Date) => {
  return date.toISOString().slice(0, 16)
}

const updateDate = (event: Event) => {
  const input = event.target as HTMLInputElement
  store.setDate(new Date(input.value))
}
</script>