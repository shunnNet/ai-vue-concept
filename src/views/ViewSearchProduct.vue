<script setup lang="ts">
import ProductCard from "@/components/ProductCard.vue"
import { useFetch } from "@vueuse/core"
import { usePendingAgentNavigator } from "@/package/routeStatus"
import AiCanvasElement from "@/package/AiCanvasElement"

const params = { category: 1 }
const searchParams = new URLSearchParams()
Object.entries(params).forEach(([key, value]) => {
  searchParams.append(key, value)
})
const controller = usePendingAgentNavigator()

controller.pending()
const { data, onFetchFinally } = useFetch(`/products?${searchParams}`, {
  initialData: [],
})
  .get()
  .json()

onFetchFinally(() => {
  console.log("release agent navigator")
  controller.release()
})
</script>
<template>
  <div class="container">
    <div
      class="grid grid-cols-3 gap-7 p-4"
      v-ai="{
        name: 'product list',
        description:
          'This is a list of products, on each product, you can click add button to add it to your cart. or click the remove button to remove it from your cart.',
      }"
    >
      <AiCanvasElement
        v-for="product in data.data"
        :key="product.id"
        :desc="product.description"
      >
        <ProductCard
          v-ai="{
            name: `product: ${product.name}`,
            description: product.description,
          }"
          :product="product"
        />
      </AiCanvasElement>
    </div>
  </div>
</template>
<style></style>
