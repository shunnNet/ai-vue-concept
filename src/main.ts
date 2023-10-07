import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { useVueRouter } from "./package/install"
import elementPlusPlugin from "./element-plus"

useVueRouter(router)

createApp(App).use(router).use(elementPlusPlugin).mount("#app")
