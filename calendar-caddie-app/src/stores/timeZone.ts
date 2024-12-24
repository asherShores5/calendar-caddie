// stores/timeZone.ts
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

interface TimeZoneEntry {
  id: string
  name: string
  offset: number
  selected: boolean
}

interface TimeZonePreset {
  name: string
  zones: string[]
}

export const useTimeZoneStore = defineStore('timezone', () => {
  // Initialize from localStorage if available
  const initialDate = localStorage.getItem('selectedDate') 
    ? new Date(localStorage.getItem('selectedDate')!)
    : new Date()

  const selectedDate = ref(initialDate)
  const timeZones = ref<TimeZoneEntry[]>(
    JSON.parse(localStorage.getItem('timeZones') || '[]')
  )
  const baseZone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const timeFormat = ref(localStorage.getItem('timeFormat') || '12')

// Watch for format changes and persist them
watch(timeFormat, (newFormat) => {
  localStorage.setItem('timeFormat', newFormat)
})

  // Preset definitions
  const presets: TimeZonePreset[] = [
    {
      name: 'US Coasts',
      zones: ['America/New_York', 'America/Los_Angeles']
    },
    {
      name: 'APAC + US',
      zones: ['America/Los_Angeles', 'Asia/Singapore', 'Asia/Tokyo']
    },
    {
      name: 'Europe + US',
      zones: ['America/New_York', 'Europe/London', 'Europe/Berlin']
    }
  ]

  // Persistence with localStorage
  watch(selectedDate, (newDate) => {
    localStorage.setItem('selectedDate', newDate.toISOString())
  })

  watch(timeZones, (newZones) => {
    localStorage.setItem('timeZones', JSON.stringify(newZones))
  }, { deep: true })

  watch(timeFormat, (newFormat) => {
    localStorage.setItem('timeFormat', newFormat)
  })

  const addTimeZone = (timezone: string) => {
    if (timeZones.value.some(tz => tz.id === timezone)) return
    
    const date = new Date()
    const offset = new Date(date.toLocaleString('en-US', { timeZone: timezone })).getTime() -
      new Date(date.toLocaleString('en-US', { timeZone: 'UTC' })).getTime()
    
    timeZones.value.push({
      id: timezone,
      name: timezone.replace(/_/g, ' '),
      offset: offset / (60 * 1000),
      selected: true
    })
  }

  const removeTimeZone = (timezone: string) => {
    timeZones.value = timeZones.value.filter(tz => tz.id !== timezone)
  }

  const setDate = (date: Date) => {
    selectedDate.value = date
  }

  const getTimeIn = (timezone: string) => {
    return new Date(selectedDate.value.toLocaleString('en-US', { timeZone: timezone }))
  }

  const getTimeDifference = (timezone: string) => {
    // Get current time in milliseconds for both timezones
    const date = new Date()
    const tzTime = new Date(date.toLocaleString('en-US', { timeZone: timezone }))
    const baseTime = new Date(date.toLocaleString('en-US', { timeZone: baseZone.value }))
    
    // Convert both to same UTC date to compare just the time difference
    const tzUTC = new Date(Date.UTC(
      tzTime.getFullYear(),
      tzTime.getMonth(),
      tzTime.getDate(),
      tzTime.getHours(),
      tzTime.getMinutes()
    ))
    
    const baseUTC = new Date(Date.UTC(
      baseTime.getFullYear(),
      baseTime.getMonth(),
      baseTime.getDate(),
      baseTime.getHours(),
      baseTime.getMinutes()
    ))
    
    // Calculate hour difference
    const diffHours = (tzUTC.getTime() - baseUTC.getTime()) / (1000 * 60 * 60)
    
    // Round to nearest 0.5 to handle 30-minute timezone offsets
    const roundedDiff = Math.round(diffHours * 2) / 2
    
    if (roundedDiff === 0) return 'Same time'
    const sign = roundedDiff > 0 ? '+' : ''
    return `${sign}${roundedDiff}h`
  }

  const loadPreset = (presetName: string) => {
    const preset = presets.find(p => p.name === presetName)
    if (preset) {
      timeZones.value = [] // Clear existing
      preset.zones.forEach(zone => addTimeZone(zone))
    }
  }

  const toggleTimeFormat = () => {
    timeFormat.value = timeFormat.value === '12' ? '24' : '12'
  }

  const formatTime = (date: Date, timezone: string) => {
    return date.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: timeFormat.value === '12'
    })
  }

  return {
    selectedDate,
    timeZones,
    baseZone,
    timeFormat,
    presets,
    addTimeZone,
    removeTimeZone,
    setDate,
    getTimeIn,
    loadPreset,
    toggleTimeFormat,
    formatTime,
    getTimeDifference
  }
})