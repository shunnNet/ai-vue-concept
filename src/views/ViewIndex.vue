<script setup lang="ts">
import AiService from "@/components/AiService.vue"
</script>
<template>
  <div class="container">
    <div class="p-6">
      <div class="mb-[60px]">
        <h1 class="text-4xl text-center">AI Vue</h1>
        <p class="text-xl text-center text-gray-400">
          E-commerce site with AI Vue navigator example
        </p>
      </div>
      <div
        class="max-w-[800px] mx-auto"
        v-ai="{
          name: 'Ai Service',
          description:
            'This is a chatbot interface, you can complete the order with this chatbot. No need go to the other page.',
        }"
      >
        <AiService />
      </div>
    </div>
  </div>
</template>
