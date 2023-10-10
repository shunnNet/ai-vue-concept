import PageTitle from "./PageTitle.vue"
import { Plugin } from "vue"

export default {
  install(app) {
    app.component("PageTitle", PageTitle)
  },
} as Plugin
