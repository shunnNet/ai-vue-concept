<script setup lang="ts">
import { computed } from "vue"
const props = defineProps({
  level: {
    type: [Number, String],
    default: 1,
  },
})

const tag = computed(() => `h${props.level}`)
const levelClass = computed(() => {
  const levelDiction = { 1: `text-2xl`, 2: `text-lg` }

  return levelDiction[props.level.value] || ""
})
</script>

<template>
  <component :is="tag" :class="levelClass + 'text-center'">
    <slot></slot>
  </component>
</template>
