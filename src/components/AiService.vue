<script setup lang="ts">
import MessageForm from "./MessageForm.vue"
import MikuImageUrl from "@/assets/miku.jpg"
import AiServiceCanvas from "./AiServiceCanvas.vue"
import { useServiceAgent } from "@/business/service-agent"
import { ref, watch } from "vue"

const { thinking, conversation, serviceAgent } = useServiceAgent()

const handleSubmit = async ({ message }) => {
  await serviceAgent.run(message)
}

const scrollRef = ref(null)
const scrollChatToBottom = () => {
  setTimeout(() => {
    scrollRef.value.scrollTo(0, scrollRef.value.scrollHeight)
  }, 0)
}
watch(() => conversation.value.length, scrollChatToBottom)
</script>
<template>
  <div>
    <div
      class="h-[400px] mt-[20px] overflow-y-auto mb-[30px]"
      ref="scrollRef"
      v-if="conversation.length"
    >
      <div v-for="message in conversation" :key="message.content">
        <ElDivider />
        <template v-if="message.role === 'assistant'">
          <div class="flex py-4">
            <ElAvatar
              class="h-[36px] w-[36px] text-center leading-[30px] shadow-md mr-3 shrink-0"
              >AI</ElAvatar
            >
            <AiServiceCanvas
              :message="message.content"
              :serviceAgent="serviceAgent"
              class="flex-grow"
            />
          </div>
        </template>
        <template v-if="message.role === 'user'">
          <div class="flex py-4">
            <ElAvatar
              :src="MikuImageUrl"
              class="h-[36px] w-[36px] text-center leading-[30px] shadow-md mr-3 shrink-0"
            />
            {{ message.content }}
          </div>
        </template>
        <template v-if="message.role === 'function'">
          <div class="text-center text-gray-400 italic">
            Agent: {{ message.content }}
          </div>
        </template>
      </div>
      <template v-if="thinking">
        <div class="py-4">
          <ElDivider />
          <div class="flex">
            <ElAvatar
              class="h-[36px] w-[36px] text-center leading-[30px] shadow-md mr-3 shrink-0"
              >AI</ElAvatar
            >
            thinking....
          </div>
        </div>
      </template>
    </div>
    <MessageForm @submit="handleSubmit" />
  </div>
</template>
