import { ComputedRef, Ref, computed, isRef, ref, watch } from "vue"
import { OpenAIMessage, chatCompletion } from "./openai"
import { withToggle } from "@/composable/useLoading"
import { computeFormatHint } from "@crazydos/vue-llm-rich-message"

type ToolFunction = (params: {
  userMessage: string
  args: Record<string, any>
  conversation: OpenAIMessage[]
}) => Promise<string>

type ToolSchema = {
  name: string
  description: string
  parameters: any
}

export class Tool {
  public name: string
  public description: string

  constructor(
    public func: ToolFunction,
    public schema: ToolSchema,
  ) {
    this.func = func
    this.schema = schema
    this.name = schema.name
    this.description = schema.description
  }
}

type AgentRecords = [string, Record<string, any>][]
export type AgentStrategy = (
  tools: Tool[],
  records: AgentRecords,
) => { tools: Tool[]; call: string | undefined }

interface Replier {
  anwser(conversation: OpenAIMessage[]): Promise<string>
}

type SystemMessage = string | Ref<string> | ComputedRef<string>

export class ChatGptAgentController implements Replier {
  public tools: Record<string, Tool>
  public thinking: Ref<boolean>
  public systemMessage: SystemMessage
  public strategies: AgentStrategy
  protected agentRecords: AgentRecords
  protected replier: Replier | null
  public conversation: Ref<OpenAIMessage[]>

  constructor(
    tools: Tool[],
    systemMessage: SystemMessage = "",
    strategies?: AgentStrategy,
    replier?: Replier,
  ) {
    this.tools = tools.reduce<Record<string, Tool>>((acc, tool) => {
      acc[tool.name] = tool
      return acc
    }, {})
    this.systemMessage = systemMessage
    this.thinking = ref(false)
    this.agentRecords = []
    this.strategies = strategies
      ? strategies
      : () => ({ tools: Object.values(this.tools), call: undefined })
    this.replier = replier ? replier : this
    this.conversation = ref([])
  }

  withSystemMessage(conversation: OpenAIMessage[]) {
    const systemMessage = isRef(this.systemMessage)
      ? this.systemMessage.value
      : this.systemMessage

    return [
      {
        role: "system",
        content: systemMessage,
      },
      ...conversation,
    ]
  }

  forget() {
    this.conversation.value = []
  }

  addTool(tool: Tool) {
    this.tools[tool.name] = tool
  }

  removeTool(name: string) {
    delete this.tools[name]
  }

  watchAndAnswer(source: any, callback: any) {
    return watch(source, async (newValue, oldValue) => {
      const message = await callback(newValue, oldValue)
      this.conversation.value.push({
        role: "function",
        name: "observer",
        content: message,
      })
      await this.anwser(this.conversation.value)
    })
  }

  notifyAndAnswer(message: string) {
    this.conversation.value.push({
      role: "function",
      name: "notifier",
      content: message,
    })
    return this.anwser(this.conversation.value)
  }

  watchAndRun(source: any, callback: any) {
    return watch(source, async (newValue, oldValue) => {
      const message = await callback(newValue, oldValue)
      this.conversation.value.push({
        role: "function",
        name: "observer",
        content: message,
      })
      await this.run()
    })
  }

  async anwser(conversation: OpenAIMessage[]): Promise<string> {
    console.log("answer")
    const { message } = await withToggle(
      () =>
        chatCompletion({
          model: "gpt-3.5-turbo",
          temperature: 0,
          messages: this.withSystemMessage(conversation),
        }),
      this.thinking,
    )
    this.conversation.value.push({
      role: "assistant",
      content: message,
    })

    return message
  }
  async run(
    userMessage?: string,
    max?: number,
    onFunction?: (func: string, arg: any, result: any) => Promise<void>,
  ): Promise<string> {
    const result = await withToggle(
      () => this._run(userMessage, max, onFunction),
      this.thinking,
    )

    return result
  }

  async _run(
    userMessage?: string,
    max?: number,
    onFunction?: (func: string, arg: any, result: any) => Promise<void>,
  ): Promise<string> {
    let count = max ? max : 3
    if (userMessage) {
      this.conversation.value.push({
        role: "user",
        content: userMessage,
      })
    }
    let lastReply: string | undefined = ""

    while (count > 0) {
      count--

      const strategies = this.strategies(
        Object.values(this.tools),
        this.agentRecords,
      )
      const availableFunctions = strategies.tools.map((tool) => tool.schema)
      console.log("Available functions", availableFunctions)

      const { func, args, message } = await chatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0,
        messages: this.withSystemMessage(this.conversation.value),
        functions: availableFunctions.length ? availableFunctions : undefined,
        function_call: strategies.call ? { name: strategies.call } : undefined,
      })
      lastReply = message

      // Run function and continue
      if (this.tools[func]) {
        console.log(`Controller: run ${func}`)
        this.agentRecords.push([func, args])
        const result = await this.tools[func].func({
          userMessage,
          args,
          conversation: this.conversation.value,
        })
        onFunction && (await onFunction(func, args, result))
        console.log("Tool run result", result)
        this.conversation.value.push({
          role: "function",
          name: func,
          content: result,
        })
      } else {
        break
      }
    }
    this.agentRecords = []
    // Reply if didn't call function

    if (this.replier === this) {
      if (lastReply) {
        this.conversation.value.push({
          role: "assistant",
          content: lastReply,
        })

        return lastReply
      } else {
        const message = await this.anwser([])
        return message
      }
    } else {
      const message = await this.replier.anwser(this.conversation.value)
      this.conversation.value.push({
        role: "assistant",
        content: message,
      })

      return message
    }
  }
}

export class ChatGptCanvasAgent extends ChatGptAgentController {
  public components: Ref<any[]>
  public resetComponents: boolean

  constructor(
    tools: Tool[],
    systemMessage: SystemMessage = "",
    components: any[],
    resetComponents: boolean = true,
    strategies?: AgentStrategy,
    replier?: Replier,
  ) {
    super(tools, systemMessage, strategies, replier)
    this.components = ref(components)
    this.resetComponents = resetComponents
    this.systemMessage = computed(
      () => `${isRef(systemMessage) ? systemMessage.value : systemMessage}

${computeFormatHint(this.components.value)}
`,
    )
  }

  addComponent(component: any) {
    if (!this.components.value.find((c) => c.name === component.component)) {
      this.components.value.push(component)
    }
  }

  removeComponent(name: string) {
    const index = this.components.value.findIndex((c) => c.name === name)
    if (index > -1) {
      this.components.value.splice(index, 1)
    }
  }

  clearComponents() {
    this.components.value = []
  }

  async anwser(conversation: OpenAIMessage[]): Promise<string> {
    const result = super.anwser(conversation)
    if (this.resetComponents) {
      this.components.value = []
    }
    return result
  }

  async run(
    userMessage: string,
    max?: number,
    onFunction?: (func: string, arg: any, result: any) => Promise<void>,
  ): Promise<string> {
    const result = await super.run(userMessage, max, onFunction)
    if (this.resetComponents) {
      this.components.value = []
    }
    return result
  }
}
