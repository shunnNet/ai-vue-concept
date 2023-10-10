<script setup lang="ts">
import { Product } from "@/types"
import ProductActionAdd from "./ProductActionAdd.vue"
import ProductActionRemove from "./ProductActionRemove.vue"
import ProductActionDetail from "./ProductActionDetail.vue"

type Props = {
  product: Product
  remove?: boolean
}

withDefaults(defineProps<Props>(), {
  remove: true,
})
</script>
<template>
  <div class="flex rounded-lg ring-1 ring-gray-300 overflow-hidden shadow-md">
    <img
      class="w-[150px] h-[150px] object-cover block"
      width="300"
      height="200"
      src="https://picsum.photos/seed/picsum/300/200"
      alt="fake img"
    />
    <div class="flex flex-col flex-grow">
      <div class="p-4 flex-grow">
        <div class="flex justify-between mb-2">
          <div>{{ product.name }}</div>
          <div>${{ product.price }}</div>
        </div>

        <div class="text-gray-400">{{ product.description }}</div>
      </div>
      <div class="flex py-2 px-4 gap-2">
        <ProductActionAdd :product="product" />
        <ProductActionRemove :product="product" v-if="remove" />
        <ProductActionDetail :product="product" class="flex-grow" />
      </div>
    </div>
  </div>
</template>
