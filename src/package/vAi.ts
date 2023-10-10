import { computed, shallowReactive } from "vue"
import { store } from "./canvas"

export const elementStore = shallowReactive({})

export const elementStorePrompt = computed(() => {
  if (!Object.keys(elementStore).length) {
    return ""
  } else {
    let i = 0
    const currentContext: string[] = []
    Object.values(elementStore).forEach((item) => {
      i++
      currentContext.push(`---Element ${i}---        
Id: ${item.el.dataset.aiId}
Description: ${item.description}
`)
    })
    return currentContext.join("\n\n")
  }
})

export const vAi = {
  beforeMount(el, binding, vnode) {
    Object.entries(binding.value).forEach(([key, value]) => {
      const attr = key[0].toUpperCase() + key.slice(1)
      el.dataset[`ai${attr}`] = value
    })
    const id = binding.value.name
    el.dataset["aiId"] = id
    elementStore[id] = { ...binding.value, el }
    store.elements[id] = {
      description: binding.value.description,
      vnode,
    }
    console.log("add Element to store with id: ", id)
  },
  beforeUpdate(el, binding, vnode) {
    Object.entries(binding.value).forEach(([key, value]) => {
      const attr = key[0].toUpperCase() + key.slice(1)
      el.dataset[`ai${attr}`] = value
    })
    const id = el.dataset["aiId"]
    elementStore[id] = { ...binding.value, el }
    store.elements[id] = {
      description: binding.value.description,
      vnode,
    }
    console.log("update Element to store with id: ", id)
  },
  beforeUnmount(el) {
    const id = el.dataset["aiId"]
    delete elementStore[id]
    delete store.elements[id]
  },
}
