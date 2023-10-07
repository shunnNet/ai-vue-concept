<script setup lang="ts">
import { ChatGptAgent } from "@/package/agent"
import { openaiClient } from "@/package/fetch"
import { useAgent } from "@/package/useAgent"
import { store, vAi } from "@/package/vAi"
import { store as canvasStore } from "@/package/canvas"
import { onMounted, onUnmounted, ref } from "vue"
import AiCanvasElement from "@/package/AiCanvasElement"

const agent = new ChatGptAgent(openaiClient, store)

const cleanRef = ref<HTMLElement | null>(null)
const aircondRef = ref<HTMLElement | null>(null)

const { introduceMessage, elementRef, visible, execute } = useAgent()

// store.setPageStatus(
//   "User enter the product page, maybe he/she want to buy something.",
// )

// onMounted(() => {
//   store.navigating = Promise.resolve()
// })

// onUnmounted(() => {
//   store.setPageStatus("User leave the product page.")
// })

const checkPrompt = () => {
  console.log(agent.messageFromStore())
}
const show = ref(false)
const openModal = () => {
  show.value = true
}
</script>
<template>
  <button @click="execute()">Exceute</button>

  <!-- <button @click="toggleVisible">toggleVisible</button> -->
  <AiCanvasElement desc="點擊這個按鈕可以獲得客服支援">
    <ElButton
      v-ai="{ name: '客服支援', description: '點擊這個按鈕可以獲得客服支援' }"
      type="warning"
      @click="openModal"
      >聯絡客服</ElButton
    >
  </AiCanvasElement>
  <AiCanvasElement desc="客服的服務時間">
    <div
      v-ai="{
        name: '客服的聯絡資訊',
        description: '客服的聯絡方式，以及服務時間',
      }"
    >
      <div>服務時間：早上10:00 ~ 晚上10:00</div>
      <div>Email: email@email.com</div>
    </div>
  </AiCanvasElement>

  <ElDialog v-model="show">
    <div>妳好，我們是客服團隊</div>
  </ElDialog>
  <div
    ref="cleanRef"
    v-ai="{
      name: 'Step1: 開始預約',
      description: '點擊這個按鈕可以開始預約居家清潔服務',
    }"
  >
    開始預約
  </div>
  <div class="placeholder-800"></div>
  <div
    ref="aircondRef"
    v-ai="{
      name: 'Step2: 選擇服務日期',
      description:
        '這個區塊有可以預約的日期，請點選想預約的日期。如果日期是灰色的，表示預約已額滿。',
    }"
  >
    選擇服務日期
  </div>
  <div
    ref="aircondRef"
    v-ai="{
      name: 'Step3: 選擇服務時間',
      description: '這個區塊有選擇日期當日的可預約時段，點選時間已選擇',
    }"
  >
    選擇服務時間
  </div>
  <div
    ref="aircondRef"
    v-ai="{
      name: 'Step4: 選擇服務人員',
      description:
        '這個區塊可以選擇可以預約的清潔人員，並且有顯示每個清潔人員的價位、評價、自我介紹、經歷等資訊，選擇清潔人員後，即可填寫表單',
    }"
  >
    選擇服務人員
  </div>
  <div
    ref="aircondRef"
    v-ai="{
      name: 'Step5: 填寫表單',
      description: '填寫完基本資訊，送出表單後，即可預約成功',
    }"
  >
    表單
  </div>
  <div
    ref="aircondRef"
    v-ai="{
      name: 'FormErrorMessage:Phone',
      description: '必須填寫電話號碼，格式範例是 0912345678',
    }"
  >
    電話號碼必填
  </div>
  <div class="placeholder-800"></div>
  <div class="placeholder-800"></div>
  <el-popover
    ref="popoverRef"
    :visible="visible"
    :virtual-ref="elementRef"
    trigger="click"
    title="With title"
    virtual-triggering
  >
    <span> {{ introduceMessage }} </span>
  </el-popover>
  <!-- <div class="pin">
    <ElButton type="warning" @click="navigate">Navigate</ElButton>
  </div> -->
</template>
<style>
.placeholder-800 {
  height: 800px;
}

.pin {
  position: fixed;
  bottom: 50px;
  right: 50px;
}
</style>
@/package/AiCanvasElement
