# ai.vue concept demo
這個 repository 是一個 demo，展示如何結合 Vue.js 與 OpenAI ChatGPT (LLM)，在網頁端創造一個不同的使用者體驗：用聊天完成所有事。

這個 Demo 製作一個很簡單的商業邏輯：
1. 這是個購物網站
2. 使用者要先挑選商品
3. 若使用者要結帳，必須要先登入
4. 選完商品、並登入，就可以進入結帳頁結帳

而在這個 Demo 中，AI 可以透過 Vue 獲得以下能力：
1. 透過聊天完成一個購物流程
2. 根據商業邏輯，顯示合適的介面，或是呼叫特定的函式
3. 了解網站中有哪些頁面、元素，可以將使用者導航到該處，並進行解說

希望之後可以做成一個 package

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
這裡將會就幾個主要功能進行說明、展示

- Service Agent
- Navigator Agent
- Page Agent
- Render Completion

### Service Agent
[![service-agent](https://i.ytimg.com/vi/T9hUW7oWt-Q/maxresdefault.jpg)](https://www.youtube.com/watch?v=T9hUW7oWt-Q "render-completion") 

是指在 `/` 這個頁面的 chatbot，可以透過他完成整個購物流程。

我在 `prompt` 中加入商業邏輯、使用者狀態等，並且透過 OpenAI `function_call` 實現它。

他可以根據情形決定是否顯示商品清單，或是要求你登入。若條件滿足，就會顯示結帳的表單。

### Navigator Agent
[![find something](https://i.ytimg.com/vi/xzLdwHXStxM/maxresdefault.jpg)](https://www.youtube.com/watch?v=xzLdwHXStxM "render-completion") 

可以透過點選網站右上角的輸入框呼叫，然後在彈窗中選擇 `Find something` 分頁的 chatbot。

這個 Agent 知道網站中有哪些頁面，以及頁面上有什麼元素。

並且可以根據你的需求，切換頁面，將視窗滾動到該元素處，並進行解說

### Page Agent
[![explain-this-page](https://i.ytimg.com/vi/G2G_XLTv9dM/maxresdefault.jpg)](https://www.youtube.com/watch?v=G2G_XLTv9dM "render-completion")  

可以透過點選網站右上角的輸入框呼叫，然後在彈窗中選擇 `Explain this page` 分頁的 chatbot。

這個 Agent 知道當前頁面上有什麼元素，可以對其進行解說，並且在有必要的時候，顯示該元素。

### Render Completion
[![render-completion](https://i.ytimg.com/vi/UrggY_zLBgU/maxresdefault.jpg)](https://www.youtube.com/watch?v=UrggY_zLBgU "render-completion")  

是指在 RenderCompletion 頁面上的 chatbot。這裡的重點是 Vue 元件的展示。

這個東西寫法上類似 [ai.jsx](https://docs.ai-jsx.com/aboutAIJSX) 的效果，其實也是類似模仿他。

當前的元件僅是概念上的展示。他的好處是更方便的將 `function_call` 的呼叫結果用於元件渲染，並且可以將決策樹視覺化。比起在 javascript 中作 function_call ，這個做法更容易跟元件互動。

我覺得這種寫法挺好玩的。

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
1. 使用 LLM 分析網頁資訊的功能越來越多了，比如 `arc` 瀏覽器推出了新的 AI 功能 [arc-max](https://arc.net/max)，可以在連結上預覽網頁內容概要。出於類似這樣的原因，我嘗試透過 `v-ai` directive，讓 dom 加上 `data-ai-*` 屬性提供 DOM 節點更多的資訊（同時也是為了取得、操作他的 DOM 節點）。不過瀏覽器已有無障礙的功能標籤，也許也該考慮直接利用那個標準。

2. 我覺得在瀏覽器端需要有自己的 AI Agent。如果需要用 LLM 在瀏覽器端渲染元件、介面顯示邏輯、或是呼叫 WebAPI，放在瀏覽器端去專門處理，我覺得是個不錯的選擇。如果擔心自己的 LLM 要怎麼跑，我想，架個 proxy server 或是 serverless 應該可以搞定吧。

3. 承 2，在瀏覽器端要執行的 Agent 任務跟 server 端的場景就不同了。瀏覽器端的任務比較特定，提供附加 AI 的 UX。在這種情況下，也許不需要使用到 [LangChain](https://www.langchain.com/)。他很齊全，很值得學習，可是對我來說有點太複雜了。可以的話我希望有一個更簡單粗暴的 LLM 套件可以使用。

## Reference
- [ai.jsx](https://docs.ai-jsx.com/aboutAIJSX)
- [langchain](https://www.langchain.com/)
