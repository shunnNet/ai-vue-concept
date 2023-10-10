<script setup lang="ts">
import ChatCompletion from "@/package/ChatCompletion.vue"
import ChatCompletionTool from "@/package/ChatCompletionTool.vue"
import ProductCardLine from "@/components/ProductCardLine.vue"
import { Tool } from "@/package/ChatgptAgentController"
import { sleep } from "@/utils/utils"
import MessageForm from "@/components/MessageForm.vue"
import { ref } from "vue"

const showProductTool = new Tool(
  async () => {
    await sleep(2000)

    return {
      id: 1,
      name: "Laptop",
      price: 1499.99,
      description: "A high-performance laptop with a sleek design.",
      detail: "Intel Core i7, 16GB RAM, 512GB SSD, 15.6-inch display",
    }
  },
  {
    name: "showProduct",
    description: "Prepare recommend product list for displaying to user later.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
)
const msg = ref("")

const handleSubmit = ({ message }) => {
  msg.value = message
}
</script>
<template>
  <MessageForm @submit="handleSubmit" />
  <ChatCompletion v-if="msg" :message="msg">
    <template #default="{ message }">
      <div>Ai: {{ message }}</div>
    </template>
    <template #function>
      <!-- <div>Please show me a product.</div> -->
      <ChatCompletionTool
        :func="showProductTool.func"
        :schema="showProductTool.schema"
        message="Successfully show a product."
      >
        <template #loading>
          <div>showProductTool: Loading.....</div>
        </template>
        <template #error>
          <div>showProductTool: Error.....</div>
        </template>
        <template #default="{ result, message }">
          <div>Agent: {{ message }}</div>
          <div class="max-w-[500px]">
            <ProductCardLine :product="result" />
          </div>
          <ChatCompletion message="Thanks for show me product">
            <template #default="{ message }">
              <div>Ai: {{ message }}</div>
            </template>
            <template #thinking>
              <div>Ai: Thinking.....</div>
            </template>
          </ChatCompletion>
        </template>
      </ChatCompletionTool>
    </template>
    <template #thinking>
      <div>Ai: Thinking.....</div>
    </template>
  </ChatCompletion>
</template>
<!-- <style lang='scss'></style> -->
