<script setup lang="ts">
defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
})
</script>
<template>
  <RouterLink :to="to" class="h-[50px] px-2 leading-[50px]">
    <slot></slot>
  </RouterLink>
</template>
