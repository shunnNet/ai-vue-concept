import { order } from "@/store/order"
import { isLogin } from "@/store/user"
import { ElMessage } from "element-plus"
import { createRouter, createWebHistory } from "vue-router"

const routes = [
  {
    path: "/",
    component: () => import("@/views/ViewIndex.vue"),
    name: "Index",
    meta: {
      ai: {
        title: "Index",
        description:
          "This is the index page. Include the chatbot interface which is the main function of this website. The chatbot interface is at the top of the page.",
      },
    },
  },
  {
    path: "/render-completion",
    component: () => import("@/views/ViewRenderCompletion.vue"),
    name: "RenderCompletion",
    meta: {
      ai: {
        title: "Demostration",
        description:
          "This is the demostration page. Show a RenderCompletion component result.",
      },
    },
  },
  {
    path: "/service",
    component: () => import("@/views/ViewService.vue"),
    name: "Service",
    meta: {
      ai: {
        title: "預約服務頁",
        description:
          "這個頁面可以預約我們的服務，你可以選擇服務日期、時間、服務人員，並且送出訂單。",
        // "有客服的聯絡方式。",
      },
    },
  },
  {
    path: "/products",
    component: () => import("@/views/ViewSearchProduct.vue"),
    name: "ProductList",
    meta: {
      ai: {
        title: "商品列表",
        description:
          "這個頁面可以查看我們所有的商品，並且可以透過搜尋功能找到你想要的商品。",
      },
    },
  },
  {
    path: "/product/:id",
    component: () => import("@/views/ViewProduct.vue"),
    name: "Product",
    meta: {
      // ai: {
      //   title: "商品詳細頁面",
      //   description: "這個頁面可以查看特定商品的資訊",
      // },
    },
  },
  {
    path: "/payment",
    component: () => import("@/views/ViewPayment.vue"),
    name: "Payment",
    meta: {
      // ai: {
      //   title: "訂單付款",
      //   description: "這個頁面可以結帳、填寫客戶資料、付款資料，並且送出訂單",
      // },
    },
    beforeEnter: (to, from, next) => {
      if (!isLogin.value) {
        ElMessage.warning("Please login first")
        return next(false)
      }
      if (order.cart.length === 0) {
        ElMessage.warning("Please select product first")
        return next({ name: "ProductList" })
      }
      return next()
    },
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
