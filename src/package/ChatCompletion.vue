<script lang="ts">
import {
  ComputedRef,
  Ref,
  computed,
  defineComponent,
  inject,
  onMounted,
  provide,
  ref,
} from "vue"
import { Tool } from "./ChatgptAgentController"
import { OpenAIMessage, chatCompletion } from "./openai"

export default defineComponent({
  name: "ChatCompletion",
  props: {
    message: {
      type: String,
      default: "",
    },
    systemMessage: {
      type: String,
      default: "",
    },
  },
  setup(props, { slots }) {
    const previousConversation =
      inject<ComputedRef<OpenAIMessage[]>>("conversation")
    const previousSystemMessage = inject<Ref<string>>("systemMessage")

    const conversation = computed<OpenAIMessage[]>(() => {
      const systemMessage: OpenAIMessage[] = props.systemMessage
        ? [{ role: "system", content: props.systemMessage }]
        : previousSystemMessage?.value
        ? [{ role: "system", content: previousSystemMessage.value }]
        : []

      const conversation = previousConversation?.value ?? []
      if (props.message) {
        conversation.push({ role: "user", content: props.message })
      }
      if (aiResponse.value) {
        conversation.push({ role: "assistant", content: aiResponse.value })
      }

      if (conversation.length === 0) {
        throw new Error(
          "props.message is required or previous conversation is required",
        )
      }
      return [...systemMessage, ...conversation]
    })
    provide("conversation", conversation)
    const tools: Ref<Record<string, Tool>> = ref({})
    const availableFunctions = computed(() =>
      Object.values(tools.value).map((tool) => tool.schema),
    )
    const callFunction = ref("")
    const callFunctionArgs = ref({})
    const aiResponse = ref("")
    const thinking = ref(false)
    const errorMessage = ref("")

    provide("addTool", (tool: Tool) => {
      console.log("addTool", tool)
      tools.value = { ...tools.value, [tool.name]: tool }
    })
    provide("callFunctionArgs", callFunctionArgs)
    provide("callFunction", callFunction)

    onMounted(async () => {
      thinking.value = true
      console.log(availableFunctions.value)
      try {
        const { func, args, message } = await chatCompletion({
          model: "gpt-3.5-turbo",
          temperature: 0,
          messages: conversation.value,
          functions: availableFunctions.value.length
            ? availableFunctions.value
            : undefined,
          // function_call: props.functionCall ? { name: props.functionCall } : undefined,
        })
        if (func) {
          callFunction.value = func
          callFunctionArgs.value = args
        } else {
          aiResponse.value = message
        }
      } catch (e) {
        errorMessage.value = e.message
      }

      thinking.value = false
    })

    return () => {
      const functionSlot =
        typeof slots["function"] === "function" ? slots["function"]() : []

      if (thinking.value) {
        const thinking = slots["thinking"]?.() ?? []

        return [...thinking, ...functionSlot]
      } else {
        if (callFunction.value && typeof slots["function"] === "function") {
          return functionSlot
        } else if (aiResponse.value) {
          return typeof slots["default"] === "function"
            ? slots["default"]({ message: aiResponse.value })
            : aiResponse.value
        } else if (errorMessage.value) {
          return typeof slots["error"] === "function"
            ? slots["error"]({ message: errorMessage.value })
            : errorMessage.value
        } else {
          return functionSlot
        }
      }
    }
  },
})
</script>
