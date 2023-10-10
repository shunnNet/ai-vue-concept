<script setup lang="ts"></script>
<template>
  <h1>Ask</h1>
  <div
    v-ai="{
      name: 'Step1: 開始預約',
      description: '點擊這個按鈕可以開始預約居家清潔服務',
    }"
  >
    開始預約
  </div>
  <div class="placeholder-800"></div>
  <div
    v-ai="{
      name: 'Step2: 選擇服務日期',
      description:
        '這個區塊有可以預約的日期，請點選想預約的日期。如果日期是灰色的，表示預約已額滿。',
    }"
  >
    選擇服務日期
  </div>
  <div
    v-ai="{
      name: 'Step3: 選擇服務時間',
      description: '這個區塊有選擇日期當日的可預約時段，點選時間已選擇',
    }"
  >
    選擇服務時間
  </div>
  <div
    v-ai="{
      name: 'Step4: 選擇服務人員',
      description:
        '這個區塊可以選擇可以預約的清潔人員，並且有顯示每個清潔人員的價位、評價、自我介紹、經歷等資訊，選擇清潔人員後，即可填寫表單',
    }"
  >
    選擇服務人員
  </div>
  <div
    v-ai="{
      name: 'Step5: 填寫表單',
      description: '填寫完基本資訊，送出表單後，即可預約成功',
    }"
  >
    表單
  </div>
  <div
    v-ai="{
      name: 'FormErrorMessage:Phone',
      description: '必須填寫電話號碼，格式範例是 0912345678',
    }"
  >
    電話號碼必填
  </div>
  <div class="placeholder-800"></div>
  <div class="placeholder-800"></div>
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
