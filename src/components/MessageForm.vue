<script setup lang="ts">
import { ref, defineExpose, onMounted } from "vue"

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["submit"])

const onKeyDown = (e: KeyboardEvent) => {
  if (
    e.key === "Enter" &&
    !e.shiftKey &&
    !e.isComposing // prevent 中文輸入法
  ) {
    e.preventDefault()
    formRef.value.handleSubmit()
  }
}

const formRef = ref(null)

const handleSubmit = ({ form }) => {
  if (!canSubmit(form)) {
    return
  }
  emit("submit", {
    message: form.message,
  })
  formRef.value.resetFields()
}

const canSubmit = (form) => {
  return form.message && form.message.trim().length > 0 && !props.disabled
}
const InputRef = ref(null)
const focus = () => {
  InputRef.value.fieldRef.focus()
}

defineExpose({
  focus,
})

onMounted(() => {
  focus()
})

const rules = {
  message: [
    {
      message: "max length 100",
      max: 100,
    },
  ],
}
</script>
<template>
  <FormContext
    v-slot="{ form }"
    name="form"
    ref="formRef"
    :rules="rules"
    @submit-valid="handleSubmit"
    @keydown="onKeyDown"
  >
    <div class="flex space-x-4">
      <FormField
        ref="InputRef"
        as="ElInput"
        field="message"
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 4 }"
        resize="none"
        placeholder="type something"
        class="flex-grow"
      />
      <FormSubmit icon="promotion" type="primary" :disabled="!canSubmit(form)">
        Send
      </FormSubmit>
    </div>
  </FormContext>
</template>
