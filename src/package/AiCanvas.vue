<script setup lang="ts">
import { reactive, ref } from "vue"
import { openaiClient } from "./fetch"
import { ElLoading, ElMessage } from "element-plus"
import { systemMessage } from "./canvas"
import AiCanvasRenderer from "./AiCanvasRenderer"
import { ChatGptAgentController } from "./AgentController"

const content = ref("")
const form = reactive({
  message: "",
})
const agent = new ChatGptAgentController()
const handleSubmit = async () => {
  const loading = ElLoading.service()
  try {
    // console.log("test")
    const response = await agent.run(form.message)
    // const response = await openaiClient("/chat/completions")
    //   .post({
    //     model: "gpt-3.5-turbo",
    //     temperature: 0,
    //     messages: [
    //       { role: "system", content: systemMessage.value },
    //       { role: "user", content: form.message },
    //     ],
    //   })
    //   .json()

    // console.log(response.data.value)
    content.value = response
    // if (response.data.value && response.data.value.choices[0].message.content) {
    // } else {
    //   throw new Error("Response Error")
    // }
  } catch (e) {
    ElMessage.error(e.message)
  }
  loading.close()
}
</script>
<template>
  <div class="ai-canvas">
    <ElForm @submit.prevent="handleSubmit">
      <div class="d-flex">
        <ElInput
          v-model="form.message"
          placeholder="有什麼需要協助的呢？"
        ></ElInput>
        <ElButton type="primary" native-type="submit">Submit</ElButton>
      </div>
    </ElForm>
    <AiCanvasRenderer :content="content" />
  </div>
</template>
<style>
.d-flex {
  display: flex;
}
</style>
