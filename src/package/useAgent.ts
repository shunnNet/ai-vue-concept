import { useRouter } from "vue-router"
import { ChatGptAgent } from "@/package/agent"
import { openaiClient } from "@/package/fetch"
import { store } from "@/package/vAi"
import { ref } from "vue"
import { ElMessage } from "element-plus"
import router from "@/router"
console.log(router)

const useTools = (agent: ChatGptAgent) => {
  const functions = [
    // {
    //   name: "answer",
    //   description: "回答使用者的問題",
    //   parameters: {
    //     type: "object",
    //     properties: {},
    //   },
    // },
    {
      name: "Done",
      description: "Useful when you think the conversation is done.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
    // {
    //   name: "Notification",
    //   description: "Useful when you want to show notification.",
    //   parameters: {
    //     type: "object",
    //     properties: {
    //       message: {
    //         type: "string",
    //         description: "The message to show",
    //       },
    //     },
    //     required: ["message"],
    //   },
    // },
    // {
    //   name: "introduce",
    //   description: "Useful when introducing specific element on the page",
    //   parameters: {
    //     type: "object",
    //     properties: {
    //       id: {
    //         type: "string",
    //         description: "element id",
    //       },
    //       message: {
    //         type: "string",
    //         description: "The message to introduce the element",
    //       },
    //     },
    //     required: ["id", "message"],
    //   },
    // },
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
        },
        required: ["id"],
      },
    },
    // {
    //   name: "goToPage",
    //   description: "Useful when navigating to another page",
    //   parameters: {
    //     type: "object",
    //     properties: {
    //       id: {
    //         type: "string",
    //         description: "Page id",
    //       },
    //     },
    //     required: ["id"],
    //   },
    // },
    {
      name: "getAllPagesInfo",
      description: "Useful when checking other pages info in the website",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  ]

  const goToPage = {
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
  }

  const introduceTool = async (
    _: ChatGptAgent,
    params: Record<string, any>,
  ) => {
    const item = agent.store.items.get(params.id)
    if (item) {
      await navigate(item.el, params.message)
      return `Show element ${item.name} to user successfully. No need to do again.`
    } else {
      return `The Element id ${params.id} is not on this page, please check another page info.`
    }
  }
  // const router = useRouter()
  const goToPageTool = async (_: ChatGptAgent, params: Record<string, any>) => {
    const pageName = params.id
    if (pageName) {
      console.log("go to page", pageName)
      await router.push({ name: pageName })

      // await new Promise((resolve) => setTimeout(resolve, 1500))
      // await agent.store.navigating
      console.log("navigating done")
      const f = functions.findIndex((f) => f.name === "goToPage")
      if (f > -1) {
        functions.splice(f, 1)
      }
      return `Go to ${pageName} successfully.`
    } else {
      return `The parameter id ${params.id} is not found.`
    }
  }
  const notificationTool = async (
    _: ChatGptAgent,
    params: Record<string, any>,
  ) => {
    if (params.message) {
      return ElMessage.success(params.message)
    }
  }

  const visible = ref(false)
  const introduceMessage = ref("")
  const elementRef = ref<HTMLElement | null>(null)
  const navigate = (el: HTMLElement, message: string) => {
    return new Promise((resolve, reject) => {
      visible.value = false
      introduceMessage.value = message
      setTimeout(() => {
        visible.value = true
        elementRef.value = el

        window.scrollTo({
          top: elementRef.value?.offsetTop,
          behavior: "smooth",
        })
        resolve(true)
      }, 1000)
    })
  }
  const getAllPagesInfo = async (agent: ChatGptAgent, _: any) => {
    functions.push(goToPage)
    return agent.store.getRoutesPrompt()
  }

  agent.tools["introduce"] = introduceTool
  agent.tools["showElement"] = introduceTool
  agent.tools["goToPage"] = goToPageTool
  agent.tools["getAllPagesInfo"] = getAllPagesInfo
  agent.tools["notification"] = notificationTool

  return { functions, introduceMessage, elementRef, visible }
}

export const useAgent = () => {
  const agent = new ChatGptAgent(openaiClient, store)
  const { functions, introduceMessage, elementRef, visible } = useTools(agent)

  const execute = async (message = "") => {
    return await agent.run(
      [{ role: "user", content: message || "請簡單告訴我該如何預約" }],
      functions,
      // { name: "introduce" },
    )
  }

  return {
    execute,
    introduceMessage,
    elementRef,
    visible,
    agent,
    store,
  }
}
