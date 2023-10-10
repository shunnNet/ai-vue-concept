<script setup lang="ts">
import { login } from "@/store/user"
import { ref } from "vue"
import { withToggle } from "@/composable/useLoading"
import { ElMessage } from "element-plus"

const emit = defineEmits("success")

const isLoading = ref(false)

const handleSubmit = async ({ Root }) => {
  await withToggle(() => login(Root.username, Root.password), isLoading)
  ElMessage.success("Login success!")
  emit("success")
}
</script>
<template>
  <FormContext
    v-loading="isLoading"
    element-loading-text="Logging in..."
    name="Root"
    label-width="120px"
    @submit-valid="handleSubmit"
  >
    <FormField as="ElInput" field="username" label="Username" />
    <FormField as="ElInput" field="password" label="Password" />
    <ElFormItem>
      <FormSubmit icon="check" type="primary">Login</FormSubmit>
    </ElFormItem>
  </FormContext>
</template>
