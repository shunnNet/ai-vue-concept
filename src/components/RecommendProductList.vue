<script setup lang="ts">
import { useFetch } from "@vueuse/core"
import ProductCardLine from "@/components/ProductCardLine.vue"

const { data } = useFetch(`/products`, {
  initialData: [],
})
  .get()
  .json()
</script>
<template>
  <div class="p-4 grid gap-4">
    <ProductCardLine
      v-for="product in data.data ? data.data.slice(0, 3) : []"
      :key="product.id"
      :product="product"
    />
  </div>
</template>
