import { computed, ref } from "vue"

type Message = {
  role: string
  content: string
  createdAt: string
  name?: string
}

export const _conversation = ref<Message[]>([
  // {
  //   role: "user",
  //   content: "Hello",
  //   createdAt: "2021-08-01 12:00:00",
  // },
  // {
  //   role: "ai",
  //   content: "Hi, I'm a bot",
  //   createdAt: "2021-08-01 12:00:01",
  // },
])

export const conversation = computed<Message[]>(() => {
  return _conversation.value.filter((message) => message.role !== "function")
})

export const addUserMessage = (content: string) => {
  _conversation.value.push({
    content,
    role: "user",
    createdAt: new Date().toISOString(),
  })
}

export const addAiMessage = (content: string) => {
  _conversation.value.push({
    content,
    role: "assistant",
    createdAt: new Date().toISOString(),
  })
}

export const addFunctionMessage = (content: string, name: string) => {
  _conversation.value.push({
    content,
    name,
    role: "function",
    createdAt: new Date().toISOString(),
  })
}
