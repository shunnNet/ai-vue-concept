import { Plugin } from "vue"
import { vAi } from "./vAi"
import { routeStatus } from "./routeStatus"
import { Router } from "vue-router"

export default {
  install(app) {
    app.directive("ai", vAi)
  },
} as Plugin

export const useVueRouter = (router: Router) => {
  routeStatus.routes = router
    .getRoutes()
    .map((r) => {
      return r.meta.ai
        ? {
            id: r.name,
            title: r.meta.ai.title,
            desc: r.meta.ai.description,
          }
        : null
    })
    .filter((r) => r)
  router.beforeEach((to, from, next) => {
    console.log("before each", to.meta.ai)

    next()
  })
  router.afterEach((to) => {
    console.log("after each", to.meta.ai)
    routeStatus.page = to.meta.ai
  })
}
