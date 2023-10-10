<script setup lang="ts">
import AiCanvasElement from "./package/AiCanvasElement"
import { useCanvasContext } from "./package/canvas"
import MenuLink from "./components/MenuLink.vue"
import LoginForm from "./components/LoginForm.vue"
import ProductCardLine from "./components/ProductCardLine.vue"
import {
  useModalContext,
  provideModalContextGlobal,
} from "vue-use-modal-context"
import { isLogin, logout } from "@/store/user"
import { order } from "@/store/order"
import { useRouter } from "vue-router"
import AgentNavItem from "@/components/AgentNavItem.vue"
import { globalModalContext } from "@/store/global-modal"
import { focusingElement } from "@/business/navigation-agent"

useCanvasContext()
provideModalContextGlobal(globalModalContext)

const { openModal: openGlobalModal } = globalModalContext

const router = useRouter()
const { openModal, closeModal } = useModalContext()
const handlePayment = () => {
  router.push({ name: "Payment" })
  closeModal("CartModal")
}
</script>

<template>
  <div
    class="flex justify-between h-[50px] px-4 shadow-md sticky top-0 bg-white z-50"
  >
    <div>
      <MenuLink :to="{ name: 'Index' }"> Home </MenuLink>
      <MenuLink :to="{ name: 'Service' }"> Service </MenuLink>
      <MenuLink :to="{ name: 'ProductList' }"> Products </MenuLink>
      <MenuLink :to="{ name: 'RenderCompletion' }"> RenderCompletion </MenuLink>
    </div>
    <div class="flex items-center">
      <AgentNavItem />
      <ElButton icon="shopping-cart" @click="openModal('CartModal')"
        >Cart({{ order.cart.length }})</ElButton
      >
      <ElButton
        v-if="!isLogin"
        icon="user"
        @click="openGlobalModal('LoginModal')"
        >Login</ElButton
      >
      <ElButton v-else icon="user" @click="logout">Logout</ElButton>
    </div>
  </div>
  <main class="py-4">
    <RouterView></RouterView>
  </main>
  <footer class="shadow- bg-white py-6 border-t-gray-300 border-t-[1px]">
    <div class="container">
      <div>
        <AiCanvasElement
          desc="Clicking this button can access customer service support."
        >
          <ElButton
            v-ai="{
              name: 'customer service',
              description:
                'Clicking this button can access customer service support.',
            }"
            icon="headset"
            @click="openModal('CustomerServiceModal')"
            >Customer Service</ElButton
          >
        </AiCanvasElement>
      </div>
      <div
        class="mt-2"
        v-ai="{
          name: 'customer service info',
          description:
            'The contact information for customer service, as well as the service hours.',
        }"
      >
        <div>Service Hours: 10:00 AM to 10:00 PM</div>
        <div>Email: email@email.com</div>
      </div>
    </div>
  </footer>
  <ModalProvider v-slot="{ modal }" name="CustomerServiceModal">
    <ElDialog v-model="modal.show">
      <div>Hello</div>
    </ElDialog>
  </ModalProvider>
  <ModalProvider v-slot="{ modal }" name="LoginModal" global>
    <ElDialog
      v-model="modal.show"
      title="Login Account"
      class="max-w-[500px] w-full"
    >
      <LoginForm @success="modal.close()" />
    </ElDialog>
  </ModalProvider>
  <ModalProvider v-slot="{ modal }" name="CartModal">
    <ElDialog
      v-model="modal.show"
      title="Selected Product"
      class="max-w-[600px] w-full"
    >
      <div class="grid gap-3 justify-center">
        <ProductCardLine
          class="max-w-[400px]"
          v-for="p in order.cart"
          :product="p"
          :key="p.id"
        />
      </div>
      <template #footer>
        <ElButton
          icon="shopping-cart-full"
          type="success"
          @click="handlePayment"
        >
          Checkout</ElButton
        >
      </template>
    </ElDialog>
  </ModalProvider>
</template>
