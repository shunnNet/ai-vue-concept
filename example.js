import { ChatOpenAI } from "langchain/chat_models/openai"
import { HumanMessage } from "langchain/schema"
import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

const extractionFunctionZodSchema = z.object({
  tone: z
    .enum(["positive", "negative"])
    .describe("The overall tone of the input"),
  entity: z.string().describe("The entity mentioned in the input"),
  word_count: z.number().describe("The number of words in the input"),
  chat_response: z.string().describe("A response to the human's input"),
  final_punctuation: z
    .optional(z.string())
    .describe("The final punctuation mark in the input, if any."),
})

const model = new ChatOpenAI({
  modelName: "gpt-4",
}).bind({
  functions: [
    {
      name: "extractor",
      description: "Extracts fields from the input.",
      parameters: zodToJsonSchema(extractionFunctionZodSchema),
    },
  ],
  function_call: { name: "extractor" },
})

const result = await model.invoke([new HumanMessage("What a beautiful day!")])

console.log(result)


<script setup lang="ts">
import { ChatOpenAI } from "langchain/chat_models/openai"
// import { onMounted } from "vue"
import { initializeAgentExecutorWithOptions } from "langchain/agents"
import { Calculator } from "langchain/tools/calculator"
// import { DynamicStructuredTool } from "langchain/tools"

// const t = new DynamicStructuredTool(["t"])
const chatModel = new ChatOpenAI({
  openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
})
// const text =
//   "What would be a good company name for a company that makes colorful socks?"

const run = async () => {
  const model = chatModel
  const tools = [new Calculator()]

  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "chat-zero-shot-react-description",
    returnIntermediateSteps: true,
  })
  console.log("Loaded agent.")

  const input = `Who is Olivia Wilde's boyfriend? What is his current age raised to the 0.23 power?`

  console.log(`Executing with input "${input}"...`)

  const result = await executor.call({ input })

  console.log(`Got output ${result.output}`)

  console.log(
    `Got intermediate steps ${JSON.stringify(
      result.intermediateSteps,
      null,
      2,
    )}`,
  )
}
</script>

<template>
  <div>
    <!-- <button
      @click="
        execute(
          '我想要買你們服務，請幫我前往產品購買頁面，然後引導我開始下訂單',
        )
      "
    >
      execute on INDex
    </button> -->
    <RouterLink :to="{ name: 'Index' }"> Home </RouterLink>
    <RouterLink :to="{ name: 'Product' }"> Product </RouterLink>
  </div>
  <RouterView></RouterView>
</template>
