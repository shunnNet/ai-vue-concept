import { createFetch } from "@vueuse/core"

export const openaiClient = createFetch({
  baseUrl: "https://api.openai.com/v1",
  combination: "chain",
  options: {
    beforeFetch({ options }) {
      options.headers = {
        ...options.headers,
        authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      }

      return { options }
    },
  },
  fetchOptions: {
    mode: "cors",
  },
})

export const jsonplaceholderClient = createFetch({
  baseUrl: "https://jsonplaceholder.typicode.com",
  combination: "chain",
})
