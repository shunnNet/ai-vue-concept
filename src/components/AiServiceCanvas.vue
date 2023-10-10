<script setup lang="ts">
import RecommendProductList from "@/components/RecommendProductList.vue"
import CheckoutForm from "./CheckoutForm.vue"
import { ComponentMessage } from "@crazydos/vue-llm-rich-message"

defineProps({
  message: {
    type: String,
    required: true,
  },
  serviceAgent: {
    type: Object,
    required: true,
  },
})
</script>
<template>
  <ComponentMessage :message="message">
    <template #RecommendProductList>
      <RecommendProductList />
    </template>
    <template #CheckoutForm>
      <div class="p-4 grid gap-4">
        <CheckoutForm
          @success="
            serviceAgent.notifyAndAnswer(
              'User checkout successfully, please remind user to check the email for checking order.',
            )
          "
        />
      </div>
    </template>
  </ComponentMessage>
</template>
<style lang="scss"></style>
