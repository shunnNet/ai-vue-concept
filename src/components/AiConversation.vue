<script setup lang="ts">
import { ref, watch } from "vue"
import MikuImageUrl from "@/assets/miku.jpg"

const props = defineProps({
  conversation: {
    type: Array,
    default: () => [],
  },
  thinking: {
    type: Boolean,
    default: false,
  },
})

const scrollRef = ref(null)
const scrollChatToBottom = () => {
  setTimeout(() => {
    scrollRef.value.scrollTo(0, scrollRef.value.scrollHeight)
  }, 0)
}
watch(() => props.conversation.length, scrollChatToBottom)
</script>
<template>
  <div class="h-[400px] overflow-y-auto" ref="scrollRef">
    <div v-for="message in conversation" :key="message.content">
      <ElDivider />
      <template v-if="message.role === 'assistant'">
        <div class="flex py-4">
          <ElAvatar
            class="h-[36px] w-[36px] text-center leading-[30px] shadow-md mr-3 shrink-0"
            >AI</ElAvatar
          >
          <div class="flex-grow">
            <slot name="canvas" :message="message"></slot>
          </div>
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
</template>
