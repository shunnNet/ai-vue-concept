import { openaiClient } from "./fetch"
import { systemMessage } from "./canvas"

export class ChatgptCanvasAgent {
  async run(userMessage: string, agentMessage: string) {
    const messages = [{ role: "system", content: systemMessage.value }]
    if (agentMessage) {
      messages.push({
        role: "function",
        name: "Agent",
        content: agentMessage,
      })
    }
    messages.push({ role: "user", content: userMessage })
    const response = await openaiClient("/chat/completions")
      .post({
        model: "gpt-3.5-turbo",
        temperature: 0,
        messages,
      })
      .json()

    console.log(response.data.value)
    if (response.data.value && response.data.value.choices[0].message.content) {
      return response.data.value.choices[0].message.content
    } else {
      throw new Error("Response Error")
    }
  }
}
