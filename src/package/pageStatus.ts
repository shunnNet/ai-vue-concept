import { reactive, computed } from "vue"
import { simpleTimeId } from "@/utils/utils"

const pageStatus: Record<string, string> = reactive({})

export const addPageStatus = (status: string, id?: any) => {
  const finalId = id || simpleTimeId()
  pageStatus[finalId] = status

  return finalId
}

export const removePageStatus = (id: string) => {
  delete pageStatus[id]
}

export const pageStatusPrompt = computed(() => {
  return pageStatus
    ? `---Page status---
${Object.values(pageStatus)
  .map((s, i) => `${i + 1}. ${s}`)
  .join("\n")}
`
    : ""
})
