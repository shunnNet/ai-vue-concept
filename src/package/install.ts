import { Plugin } from "vue"
import { vAi, store } from "./vAi"
import { Router } from "vue-router"

export default {
  install(app) {
    app.directive("ai", vAi)
  },
} as Plugin

export const useVueRouter = (router: Router) => {
  store.routes = router.getRoutes().map((r) => ({
    id: r.name,
    title: r.meta.ai.title,
    desc: r.meta.ai.description,
  }))
  router.beforeEach((to, from, next) => {
    console.log("before each", to.meta.ai)

    next()
  })
  router.afterEach((to, from) => {
    console.log("after each", to.meta.ai)
    store.page = to.meta.ai
  })
}
