<script lang="ts">
import {
  ComputedRef,
  computed,
  defineComponent,
  inject,
  onMounted,
  provide,
  ref,
  watch,
} from "vue"
import { Tool } from "@/package/ChatgptAgentController"
import { OpenAIMessage } from "./openai"

export default defineComponent({
  name: "ChatCompletionTool",
  props: {
    func: {
      type: Function,
      required: true,
    },
    schema: {
      type: Object,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
  },
  setup(props, { slots }) {
    const previousConversation =
      inject<ComputedRef<OpenAIMessage[]>>("conversation")

    const tool = new Tool(props.func, props.schema)

    const addTool = inject("addTool")
    const callFunction = inject("callFunction")
    const callFunctionArgs = inject("callFunctionArgs")
    const isLoading = ref(false)
    const beCalled = computed(() => callFunction.value === tool.name)
    const callFunctionResult = ref<any>("")
    const errorMessage = ref("")
    addTool(tool)

    const conversation = computed(() => {
      const result = []
      result.push(...previousConversation.value)
      if (props.message) {
        result.push({
          role: "function",
          name: tool.name,
          content: props.message,
        })
      }
      return result
    })

    provide("conversation", conversation)

    watch(beCalled, async (value, oldValue) => {
      if (oldValue === false) {
        try {
          if (beCalled.value) {
            isLoading.value = true
            callFunctionResult.value = await tool.func(callFunctionArgs.value)
            isLoading.value = false
          }
        } catch (e) {
          errorMessage.value = e.message
        }
      }
    })

    return () => {
      if (!beCalled.value) {
        return null
      } else {
        if (isLoading.value) {
          return typeof slots.loading === "function"
            ? slots.loading({
                func: callFunction.value,
                args: callFunctionArgs.value,
              })
            : null
        } else {
          if (!errorMessage.value) {
            return typeof slots.default === "function"
              ? slots.default({
                  func: callFunction.value,
                  args: callFunctionArgs.value,
                  result: callFunctionResult.value,
                  message: props.message,
                })
              : null
          } else {
            return typeof slots.error === "function"
              ? slots.error({
                  func: callFunction.value,
                  args: callFunctionArgs.value,
                  error: errorMessage.value,
                })
              : errorMessage.value
          }
        }
      }
    }
  },
})
</script>
