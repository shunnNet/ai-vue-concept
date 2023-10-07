<script setup lang="ts">
import { vAi } from "@/package/vAi"
import { useAgent } from "@/package/useAgent"
import { ref } from "vue"

const { introduceMessage, elementRef, visible, execute } = useAgent()
const prompt = ref("哪邊可以聯絡客服？")
</script>
<template>
  <div v-ai="{ name: 'Welcome message', description: 'Hello AI' }">Hello</div>
  <ElButton @click="execute(prompt)">{{ prompt }}</ElButton>
</template>
