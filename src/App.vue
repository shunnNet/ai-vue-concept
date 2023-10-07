<script setup lang="ts">
import AiCanvas from "./package/AiCanvas.vue"
import {
  store,
  toggle,
  useCanvasContext,
  systemMessage,
  slotContents,
} from "./package/canvas"

useCanvasContext()

const logCanvas = () => {
  console.log(store.elements)
  console.log(systemMessage)
  console.log(slotContents)
}
</script>

<template>
  <ElButton type="primary" @click="toggle(true)">Toggle Canvas</ElButton>
  <div>
    <RouterLink :to="{ name: 'Index' }"> Home </RouterLink>
    <RouterLink :to="{ name: 'Service' }"> Service </RouterLink>
  </div>
  <RouterView></RouterView>

  <ElDialog v-model="store.show">
    <ElButton @click="logCanvas"> LogCanvas </ElButton>

    <AiCanvas />
  </ElDialog>
</template>
