import { computed, provide, reactive } from "vue"
import { computeFormatHint } from "@crazydos/vue-llm-rich-message"

export const store = reactive({
  elements: {},
})

export const useCanvasContext = () => {
  provide("canvasContext", store)
}

export const getById = (id) => {
  return store.elements[id]
}

export const slotContentsPrompt = computed(() => {
  const components = Object.entries(store.elements).map(([id, element]) => {
    return {
      component: id,
      description: element.description,
    }
  })

  return components.length ? computeFormatHint(components) : ""
})
