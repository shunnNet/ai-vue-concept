# ai.vue concept demo
This repository is a demo showcasing the integration of `Vue.js` with `OpenAI ChatGPT (LLM)`, creating a unique user experience on the web: accomplishing tasks through conversation.

The demo implements a simple business logic:
1. It is a shopping website.
2. Users need to select products.
3. To proceed to checkout, users must log in.
4. After selecting products and logging in, they can proceed to the checkout page.

In this demo, AI capabilities through Vue include:
1. Completing a shopping process through chat.
2. Displaying appropriate interfaces or calling specific functions based on business logic.
3. Understanding the website's pages and elements, guiding users to navigate and providing explanations.

The goal is to develop this into a package in the future.

## Play with demo
1. Clone this repo

2. Install dependencies

> Require `Node.js 16+` and `pnpm` installed
```sh
pnpm install
```

3. Setup OpenAI API Key
Create a `.env` file in root folder, and put your API KEY there

```env
VITE_OPENAI_API_KEY=your-api-key
```

4. Run demo
```sh
pnpm dev
```

## Concept
Here, I will provide explanations and demonstrations for several key functionalities.

- Service Agent
- Navigator Agent
- Page Agent
- Render Completion

### Service Agent
On the `/` page, the chatbot enables users to complete the entire shopping process. I've incorporated business logic and user states into the prompt, and implemented it using `OpenAI` `function_call`.

The chatbot can dynamically decide whether to display the list of products or prompt the user to log in, based on the context. If the conditions are met, it will display the checkout form.

### Navigator Agent
You can invoke the `Navigator Agent` by clicking on the input box in the upper right corner of the website and selecting the chatbot on the `Find something` page from the popup.

This agent is aware of the pages present on the website and the elements on those pages. It can respond to your requests by navigating to different pages, scrolling the window to specific elements, and providing explanations as needed.

### Page Agent
You can invoke the this Agent by clicking on the input box in the upper right corner of the website and selecting the chatbot on the `Explain this page` tab from the popup.

This agent is aware of the elements present on the current page. It can provide explanations for these elements and, when necessary, display the specific elements for a more detailed explanation.

### Render Completion
Referring to the chatbot on the `RenderCompletion` page, the emphasis here is on the display of Vue components.

This structure is similar to the effect demonstrated in [ai.jsx](https://docs.ai-jsx.com/aboutAIJSX), essentially following a similar approach.

The current components are primarily conceptual in their display. 

The advantage lies in the convenience of utilizing the results of `function_call` for component rendering, along with the ability to visualize decision trees. This approach makes interaction with components more straightforward compared to implementing `function_call` directly in JavaScript.

I think this writing style quite enjoyable and interesting.

```vue
<template>
  <MessageForm @submit="handleSubmit" />
   <!-- The <ChatCompletion> compoent will call chatCompletion in compoent, and provide it result to slots according to result-->
  <ChatCompletion v-if="msg" :message="msg">
    <template #default="{ message }">
      <!-- If the agent dont use function then show message-->
      <div>Ai: {{ message }}</div>
    </template>
    <template #function>
      <!-- Now the agent can choose this function or not-->
      <ChatCompletionTool
        :func="showProductTool.func"
        :schema="showProductTool.schema"
        message="Successfully show a product."
      >
        <template #loading>
          <div>showProductTool: Loading.....</div>
        </template>
        <template #error>
          <div>showProductTool: Error.....</div>
        </template>

        <!-- After execute function, render default slot-->
        <template #default="{ result, message }">
          <div>Agent: {{ message }}</div>
          <div class="max-w-[500px]">
            <ProductCardLine :product="result" />
          </div>

          <!-- In default slot, we call ChatCompletion again, which will start new ChatCompletion, base on previous completion result-->
          <ChatCompletion message="Thanks for show me product">
            <template #default="{ message }">
              <div>Ai: {{ message }}</div>
            </template>
            <template #thinking>
              <div>Ai: Thinking.....</div>
            </template>
          </ChatCompletion>
        </template>
      </ChatCompletionTool>
    </template>
    <template #thinking>
      <div>Ai: Thinking.....</div>
    </template>
  </ChatCompletion>
</template>
```

## Thinking
1. The functionality of using `LLM` to analyze web page information is expanding, as seen in the new AI feature, [arc-max](https://arc.net/max), introduced by the `arc` browser. This feature allows for a preview of the content summary on links. For similar reasons, I attempted to use the `v-ai` directive to add `data-ai-*` attributes to the DOM nodes, providing more information about the DOM nodes (and also for accessing and manipulating them). However, browsers already have accessibility feature, so it might be worth considering using that standard directly.

2. I believe there is a need for a dedicated AI Agent on the browser side. If rendering components with LLM, displaying interface logic, or calling WebAPIs using LLM on the browser side is required, having a dedicated solution in the browser seems like a good choice. If concerns arise about running your own LLM, setting up a proxy server or serverless solution should suffice.

3. Building on point 2, the tasks performed by an agent on the browser side differ from those on the server side. Browser-side tasks are more specific, providing an enhanced UX with added AI capabilities. In such cases, [LangChain](https://www.langchain.com/) might not be necessary. While comprehensive and valuable to learn, it seems a bit too complex for my needs. If possible, I would prefer a simpler and more straightforward LLM package.

## Reference
- [ai.jsx](https://docs.ai-jsx.com/aboutAIJSX)
- [langchain](https://www.langchain.com/)
