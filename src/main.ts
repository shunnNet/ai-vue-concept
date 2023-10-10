import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { useVueRouter } from "./package/install"
import "./style.css"
import elementPlusPlugin from "./element-plus"
import { ModalContextPlugin } from "vue-use-modal-context"
import { FormContextPlugin } from "./modules/form"
import ContentPlugin from "./modules/content/install"
import { vAi } from "./package/vAi"

if (import.meta.env.DEV) {
  const { worker } = await import("../mocks/handlers")
  worker.start({ onUnhandledRequest: "bypass" })
}

useVueRouter(router)

const app = createApp(App)
  .use(router)
  .use(elementPlusPlugin)
  .use(ModalContextPlugin)
  .use(FormContextPlugin)
  .use(ContentPlugin)
app.directive("ai", vAi)

app.mount("#app")
