import { computed, provide, reactive } from "vue"
import { computeFormatHint } from "@crazydos/vue-llm-rich-message"

export const store = reactive({
  show: false,
  elements: {},
})

export const toggle = (val) => {
  store.show = val
}
export const useCanvasContext = () => {
  provide("canvasContext", store)
}

export const getById = (id) => {
  return store.elements[id]
}

export const slotContents = computed(() => {
  return Object.entries(store.elements).map(([id, element]) => {
    return {
      component: id,
      description: element.description,
    }
  })
})

export const systemMessage = computed(() => {
  return `You are a customer service, you are talking to a customer who wants to reserve a service, please help him to reserve a service.

${computeFormatHint(slotContents.value)}
`
})
