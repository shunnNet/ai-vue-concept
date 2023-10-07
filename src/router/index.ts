import { createRouter, createWebHistory } from "vue-router"

const routes = [
  {
    path: "/",
    component: () => import("@/views/ViewIndex.vue"),
    name: "Index",
    meta: {
      ai: {
        title: "首頁",
        description: "這個頁面找到我們所有頁面的入口，以及我們的最新優惠活動",
      },
    },
  },
  {
    path: "/product",
    component: () => import("@/views/ViewProduct.vue"),
    name: "Service",
    meta: {
      ai: {
        title: "預約服務頁",
        description:
          // "這個頁面可以預約我們的服務，你可以選擇服務日期、時間、服務人員，並且送出訂單。並且有客服的聯絡方式。",
          "有客服的聯絡方式。",
      },
    },
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
