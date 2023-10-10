import { reactive, computed } from "vue"

export const routeStatus = reactive({
  page: null,
  routes: [],
  wait: Promise.resolve(),
})

export const currentPagePrompt = computed(() => {
  if (!routeStatus.page) {
    return ""
  } else {
    return `---current page content---
Page: ${routeStatus.page.title}
Description: ${routeStatus.page.description}
`
  }
})

export const routesPrompt = computed(() => {
  const currentContext = []
  routeStatus.routes.forEach((r, index) => {
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
})

export const usePendingAgentNavigator = () => {
  const controller = {
    release: () => {},
    pending: () => {},
  }

  controller.pending = () => {
    console.log("pending agent navigator")
    routeStatus.wait = new Promise((res) => {
      controller.release = res
    })
  }

  return controller
}
