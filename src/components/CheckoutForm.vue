<script setup lang="ts">
import { PAYMENT_METHODS, checkout } from "@/store/order"
import { ElMessage } from "element-plus"
import { withLoading } from "@/composable/useLoading"

const emit = defineEmits(["success"])

const rules = {
  name: [{ required: true, message: "Please input name", trigger: "blur" }],
  email: [
    { required: true, message: "Please input email", trigger: "blur" },
    { type: "email", message: "Please input valid email", trigger: "blur" },
  ],
  address: [
    { required: true, message: "Please input address", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "Please input phone", trigger: "blur" },
    {
      pattern: /^09\d{8}$/,
      message: "Please input valid phone number",
      trigger: "blur",
    },
  ],
  payment: [
    {
      required: true,
      message: "Please selct payment method",
      trigger: "change",
    },
  ],
}
const handleSubmit = async ({ orderForm }) => {
  console.log("submit", orderForm)
  await withLoading(() => checkout(orderForm))
  ElMessage.success("Order submitted")
  emit("success")
}
</script>
<template>
  <FormContext
    name="orderForm"
    label-width="100px"
    :rules="rules"
    @submit="handleSubmit"
  >
    <FormField as="ElInput" name="name" field="name" label="Name" />
    <FormField as="ElInput" name="email" field="email" label="Email" />
    <FormField as="ElInput" name="address" field="address" label="Address" />
    <FormField as="ElInput" name="phone" field="phone" label="Phone" />
    <FormField
      as="ElSelect"
      name="payment"
      field="payment"
      label="Payment"
      class="w-full"
      placeholder="Select your payment method"
    >
      <ElOption
        v-for="payment in PAYMENT_METHODS"
        :key="payment"
        :value="payment"
      >
        {{ payment }}
      </ElOption>
    </FormField>
    <FormField as="ElInput" name="note" field="note" label="Note" />
    <ElFormItem>
      <FormSubmit type="success" icon="shopping-cart" class="w-full"
        >Submit Order</FormSubmit
      >
    </ElFormItem>
  </FormContext>
</template>
