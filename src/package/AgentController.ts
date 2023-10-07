import { openaiClient } from "./fetch"
import { useAgent } from "./useAgent"
import { ChatgptCanvasAgent } from "./CanvasAgent"

const systemMessage = `
You are a customer service, you are talking to a customer.
You must follow the steps below to help the customer.

1. Navigate user to the right place on the website by using "navigate".
2. explain something to user by using "explain".
`

const navigationAgent = useAgent()
const canvasAgent = new ChatgptCanvasAgent()
const tools = {
  navigate: navigationAgent.execute,
  explain: canvasAgent.run,
}

const functions = [
  {
    name: "navigate",
    description: "Useful for navigating user to content may help him/her",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "explain",
    description: "Useful for explaining something to user",
    parameters: {
      type: "object",
      properties: {},
    },
  },
]

export class ChatGptAgentController {
  async run(userMessage: string) {
    let max = 2
    const agentMessage = []
    while (max > 0) {
      max--
      const messages = [{ role: "system", content: systemMessage }]
      agentMessage.forEach((m) => {
        messages.push({
          role: "function",
          name: "Agent",
          content: m,
        })
      })

      messages.push({
        role: "user",
        content: userMessage,
      })
      const response = await openaiClient("/chat/completions")
        .post({
          model: "gpt-3.5-turbo",
          temperature: 0,
          messages,
          functions,
        })
        .json()

      const func =
        response.data.value &&
        response.data.value.choices[0].message.function_call &&
        response.data.value.choices[0].message.function_call.name

      const args =
        response.data.value &&
        response.data.value.choices[0].message.function_call &&
        response.data.value.choices[0].message.function_call.arguments

      if (tools[func]) {
        console.log(`Controller: run ${func}`)
        if (func === "navigate") {
          const result = await tools[func](userMessage)
          console.log("navigate result", result)
          agentMessage.push(result)
        } else {
          return tools.explain(userMessage, "")
        }
      } else {
        return tools.explain(userMessage, "")
      }
    }
  }
}
