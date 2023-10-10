<script setup lang="ts">
import ProductCardLine from "@/components/ProductCardLine.vue"
import { order, fee } from "@/store/order"
import { useRouter } from "vue-router"
import { useNeedLogin } from "@/composable/useNeedLogin"
import CheckoutForm from "@/components/CheckoutForm.vue"

useNeedLogin({ name: "ProductList" })

const router = useRouter()
const handleCheckoutSuccess = () => {
  router.push({ name: "Index" })
}
</script>
<template>
  <div class="container p-6">
    <h1 class="text-2xl text-center">Payment</h1>
    <ElDivider />
    <section class="my-4">
      <h2 class="text-lg text-center mb-4">Cart</h2>
      <div class="max-w-[500px] mx-auto w-full">
        <div class="grid gap-4">
          <ProductCardLine
            v-for="product in order.cart"
            :key="product.id"
            :product="product"
            :remove="false"
          />
        </div>
        <ElDivider />
        <div class="mt-3 text-end italic underline">Total: {{ fee }}</div>
      </div>
    </section>
    <section class="my-4">
      <h2 class="text-lg text-center mb-4">Order</h2>
      <div class="max-w-[500px] mx-auto w-full">
        <CheckoutForm @success="handleCheckoutSuccess" />
      </div>
    </section>
  </div>
</template>
