import {
  AgentStrategy,
  ChatGptAgentController,
  Tool,
} from "@/package/ChatgptAgentController"
import { currentPagePrompt, routeStatus } from "@/package/routeStatus"
import { elementStorePrompt, elementStore } from "@/package/vAi"
import { routesPrompt } from "@/package/routeStatus"
import router from "@/router"
import { computed, ref } from "vue"

enum NavigatorStep {
  AT_PAGE = "AT_PAGE",
  READY_TO_OTHER_PAGE = "READY_TO_OTHER_PAGE",
  ALREADY_AT_OTHER_PAGE = "ALREADY_AT_OTHER_PAGE",
  FOCUS_ELEMENT = "FOCUS_ELEMENT",
}

export const focusingElement = ref<any>(null)
const focusingElementPrompt = computed(() => {
  return `
You must introduce the focusing element to user.

---Focusing element---
Id: ${focusingElement.value.el.dataset.aiId}
Description: ${focusingElement.value.description}
`
})
const navigatorStep = ref(NavigatorStep.AT_PAGE)

const systemMessage = computed(
  () => `You are a helper on a website. User want to find something on website, so you must use functions to help user to find element related to user's message on webpage. Use functions whenever possible. If the element is on the page, use 'showElement'. If the element is not available on current page, use 'getAllPagesInfo', and if you don't have suitable function, please directly reply message.

${currentPagePrompt.value}

${
  !focusingElement.value
    ? elementStorePrompt.value
    : focusingElementPrompt.value
}

${
  navigatorStep.value === NavigatorStep.READY_TO_OTHER_PAGE
    ? routesPrompt.value
    : ""
}
`,
)

const visible = ref(false)
const introduceMessage = ref("")
const elementRef = ref<HTMLElement | null>(null)
const navigate = (el: HTMLElement, message: string) => {
  return new Promise((resolve) => {
    visible.value = false
    introduceMessage.value = message
    setTimeout(() => {
      visible.value = true
      elementRef.value = el

      window.scrollTo({
        top: elementRef.value?.offsetTop - 60,
        behavior: "smooth",
      })
      resolve(true)
    }, 1000)
  })
}

const showElementTool: Tool = new Tool(
  async ({ args }) => {
    const element = elementStore[args.id]
    if (element) {
      await navigate(element.el, args.message)
      navigatorStep.value = NavigatorStep.FOCUS_ELEMENT
      focusingElement.value = element
      return `Show element ${args.id} to user successfully. No need to do again.`
    } else {
      return `The Element id ${args.id} is not on this page, please check another page info.`
    }
  },
  {
    name: "showElement",
    description: "Useful when show the specific element in the page to user",
    parameters: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "element id",
        },
        // message: {
        //   type: "string",
        //   description: "Introduce message for user.",
        // },
      },
      required: ["id", "string"],
    },
  },
)

const goToPageTool: Tool = new Tool(
  async ({ args }) => {
    const pageName = args.id

    if (pageName) {
      await router.push({ name: pageName })
      console.log("go to page complete")
      await routeStatus.wait
      navigatorStep.value = NavigatorStep.ALREADY_AT_OTHER_PAGE
      return `Go to ${pageName} successfully.`
    } else {
      return `The parameter id ${pageName} is not found.`
    }
  },
  {
    name: "goToPage",
    description: "Useful when navigating to another page",
    parameters: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Page id",
        },
      },
      required: ["id"],
    },
  },
)
const getAllPagesInfoTool: Tool = new Tool(
  async () => {
    navigatorStep.value = NavigatorStep.READY_TO_OTHER_PAGE
    return "Please go to a proper page for user."
  },
  {
    name: "getAllPagesInfo",
    description: "Useful when checking other pages info in the website",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
)

const strategy: AgentStrategy = (tools, records) => {
  let finalTools: Tool[] = [...tools]

  const lastAction = records.at(-1)
  if (!lastAction) {
    navigatorStep.value = NavigatorStep.AT_PAGE
    focusingElement.value = null
    console.log("no last action, set to AT_PAGE")
  }

  // should not show goToPageTool if last step is not getAllPagesInfo
  if (!lastAction || lastAction[0] !== getAllPagesInfoTool.name) {
    console.log("1")
    finalTools = finalTools.filter((t) => t.name !== goToPageTool.name)
  }

  // only allow goToPage if last step is getAllPagesInfo
  if (lastAction && lastAction[0] === getAllPagesInfoTool.name) {
    console.log("2")
    finalTools = finalTools.filter((t) => t.name === goToPageTool.name)
  }

  // only allow showElement if last step is goToPage
  if (lastAction && lastAction[0] === goToPageTool.name) {
    console.log("3")
    finalTools = finalTools.filter((t) => t.name === showElementTool.name)
  }

  console.log("finalTools", finalTools)

  return { tools: finalTools, call: undefined }
}

export const navigatorAgent = new ChatGptAgentController(
  [getAllPagesInfoTool, goToPageTool, showElementTool],
  systemMessage,
  strategy,
)
