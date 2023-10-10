import { ChatGptAgentController } from "@/package/ChatgptAgentController"
import { pageStatusPrompt } from "@/package/pageStatus"
import { computed } from "vue"
import { slotContentsPrompt } from "@/package/canvas"

// TODO: systemMessage on condition: answer or run or replier
const systemMessage = computed(() => {
  return `You are a helper of a website, I need you explain or show the element on page to user base on user's need.  

${pageStatusPrompt.value}

${slotContentsPrompt.value}
`
})

export const pageAgent = new ChatGptAgentController([], systemMessage)
