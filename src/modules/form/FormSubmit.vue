<script setup>
defineEmits(["click"])

defineProps({
  justify: {
    type: String,
    default: "end",
  },
})
</script>
<template>
  <div :class="['d-flex', `justify-content-${justify}`]">
    <ElButton v-bind="$attrs" native-type="submit" @click="$emit('click')">
      <slot />
    </ElButton>
  </div>
</template>
