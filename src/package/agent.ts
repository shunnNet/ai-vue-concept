import { openaiClient } from "./fetch"
import { Store } from "./vAi"

export class ChatGptAgent {
  constructor(
    public client: typeof openaiClient,
    public store: Store,
    public systemMessage: string = "",
    public tools: any = {},
  ) {
    this.client = openaiClient
    this.store = store
    // English version
    // "You are an assistant for a website, you are helping user to . "

    this.systemMessage =
      systemMessage ||
      "You are a helper on a website, and you must use functions to guide users to the correct place on webpage. Use functions whenever possible. If the content is on the page, use 'showElement'. If the content is not available on current page, use 'getAllPagesInfo', and if you don't have suitable function, please use function 'Done'."
    this.tools = tools
  }

  messageFromStore() {
    let currentContext = []

    currentContext.push(["---current page content---"])
    if (this.store.page) {
      currentContext.push([
        `Page: ${this.store.page.title}`,
        `Description: ${this.store.page.description}`,
      ])
    }

    currentContext.push([])

    let i = 0
    this.store.items.forEach((item) => {
      i++
      currentContext.push(
        [`---Element ${i}---`],
        [
          `Id: ${item.el.dataset.aiId}`,
          // `Element: ${item.name}`,
          `Description: ${item.description}`,
        ],
        [],
      )
    })
    if (this.store.pageStatus) {
      currentContext.push([], ["---Page status---"], [this.store.pageStatus])
    }

    return currentContext.map((c) => c.join("\n")).join("\n")
  }

  async decideFunction(
    messages: any[],
    functions: any[],
    functionCall: string | { name: string } = "auto",
  ) {
    const hint = this.systemMessage + "\n" + this.messageFromStore()
    // console.log("hint", hint)
    const response = await this.client("/chat/completions")
      .post({
        model: "gpt-3.5-turbo",
        temperature: 0,
        messages: [
          {
            role: "system",
            content: hint,
          },
          ...messages,
        ],
        functions,
        function_call: functionCall,
      })
      .json()

    return {
      choice: response.data.value.choices[0],
      func:
        response.data.value &&
        response.data.value.choices[0].message.function_call &&
        response.data.value.choices[0].message.function_call.name,
      args:
        response.data.value &&
        response.data.value.choices[0].message.function_call &&
        response.data.value.choices[0].message.function_call.arguments,
    }
  }

  async introduce(messages: any[], condition: string) {
    const systemMessage = `You are an assistant for a website. ${
      condition ? "The other agent already " + condition + "." : ""
    } I need you answer the request from user.`
    const response = await this.client("/chat/completions")
      .post({
        model: "gpt-3.5-turbo",
        temperature: 0,
        messages: [
          {
            role: "system",
            content: systemMessage + "\n" + this.messageFromStore(),
          },
          ...messages,
        ],
      })
      .json()
    return {
      message:
        response.data.value && response.data.value.choices[0].message.content,
    }
  }

  async answer(messages: any[]) {
    const response = this.client("/chat/completions")
      .post({
        model: "gpt-3.5-turbo",
        temperature: 0,
        messages: [
          {
            role: "system",
            content: this.systemMessage + "\n" + this.messageFromStore(),
          },
          ...messages,
        ],
      })
      .json()
    return {
      message:
        response.data.value && response.data.value.choices[0].message.content,
    }
  }

  async run(messages, functions, functionCall?: string) {
    let max = 5
    let result: any = null
    const conversation = [
      ...messages,
      // {
      //   role: "function",
      //   name: "Agent",
      //   content:
      //     "Can not find user request content on this page, please check other pages.",
      // },
    ]
    let condition = ""
    while (max > 0) {
      console.log("decideFunction")
      max--
      const { func, args, choice } = await this.decideFunction(
        conversation,
        functions,
        functionCall || "auto",
      )

      console.log("func", func)
      console.log("args", args)
      // if (choice.message.content) {
      //   console.log(choice.message.content)
      // }

      if (!func || func === "Done") {
        console.log(!func ? "Do nothing" : "Done")
        break
      }
      const r: any = await this.tools[func](this, JSON.parse(args))
      console.log("Function result:", r)
      condition = r
      conversation.push({
        role: "function",
        name: func,
        content: r,
      })
    }
    console.log("Finish")
    // const introduceResponse = await this.introduce(conversation, condition)
    // console.log("Introduce message:", introduceResponse.message)
    return "User at the right place now. No need to navigate."
  }
}

// {
//   "choices": [
//     {
//       "finish_reason": "function_call",
//       "index": 0,
//       "message": {
//         "content": null,
//         "function_call": {
//           "arguments": "{\n  \"location\": \"Boston, MA\"\n}",
//           "name": "get_current_weather"
//         },
//         "role": "assistant"
//       }
//     }
//   ],
//   "created": 1694028367,
//   "model": "gpt-3.5-turbo-0613",
//   "object": "chat.completion",
//   "usage": {
//     "completion_tokens": 18,
//     "prompt_tokens": 82,
//     "total_tokens": 100
//   }
// }
