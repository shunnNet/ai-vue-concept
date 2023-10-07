export type Store = {
  page: {
    title: string
    description: string
  } | null
  items: Map<
    string,
    {
      el: HTMLElement
      name: string
      description: string
    }
  >
  pageStatus?: string
  setPageStatus: (history: string) => void
  routes?: { id: string; title: string; desc: string }[]
  getRoutesPrompt: () => string
}

export const store: Store = {
  page: null,
  items: new Map(),
  pageStatus: "",
  setPageStatus: (status: string) => {
    store.pageStatus = status
  },
  routes: [],
  getRoutesPrompt: () => {
    const currentContext = []
    store.routes.forEach((r, index) => {
      currentContext.push(
        [`---available page: ${index + 1}---`],
        [
          `Id: ${r.id}` +
            "\n" +
            `Title: ${r.title}` +
            "\n" +
            `Description: ${r.desc}`,
        ],
        [],
      )
    })

    return currentContext.map((c) => c.join("\n")).join("\n")
  },
}

export const vAi = {
  beforeMount(el, binding, vnode) {
    Object.entries(binding.value).forEach(([key, value]) => {
      const attr = key[0].toUpperCase() + key.slice(1)
      el.dataset[`ai${attr}`] = value
    })
    const id = binding.value.name
    el.dataset["aiId"] = id
    store.items.set(id, { ...binding.value, el })
  },
  beforeUpdate(el, binding, vnode) {
    Object.entries(binding.value).forEach(([key, value]) => {
      const attr = key[0].toUpperCase() + key.slice(1)
      el.dataset[`ai${attr}`] = value
    })
    const id = el.dataset["aiId"]
    store.items.set(id, { ...binding.value, el })
  },
  beforeUnmount(el) {
    const id = el.dataset["aiId"]
    store.items.delete(id)
  },
}
