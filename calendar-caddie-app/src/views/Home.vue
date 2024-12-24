<template>
  <div class="min-h-screen bg-gray-900 text-white p-4 md:p-8">
    <div class="max-w-3xl mx-auto space-y-6">
      <h1 class="text-3xl font-bold text-center mb-8">Time Zone Converter</h1>
      <DateTimePicker />
      <TimeZoneSelector />
      <TimeZoneList />
    </div>
  </div>
</template>

<script setup lang="ts">
import DateTimePicker from '@/components/DateTimePicker.vue'
import TimeZoneSelector from '@/components/TimeZoneSelector.vue'
import TimeZoneList from '@/components/TimeZoneList.vue'
</script>