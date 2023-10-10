import { openaiClient } from "./fetch"

export type OpenAIMessage = {
  role: "user" | "system" | "function" | "assistant"
  content: string
  name?: string
}

export const chatCompletion = async (payload) => {
  const response = await openaiClient("/chat/completions").post(payload).json()

  return {
    message:
      response.data.value && response.data.value.choices[0].message.content,
    choices: response.data.value && response.data.value.choices,
    func:
      response.data.value &&
      response.data.value.choices[0].message.function_call &&
      response.data.value.choices[0].message.function_call.name,
    args:
      response.data.value &&
      response.data.value.choices[0].message.function_call &&
      JSON.parse(
        response.data.value.choices[0].message.function_call.arguments,
      ),
  }
}
