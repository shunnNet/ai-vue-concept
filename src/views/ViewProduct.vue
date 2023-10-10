<script setup lang="ts">
import { Product } from "@/types"
import { useFetch } from "@vueuse/core"
import { computed } from "vue"
import { useRoute } from "vue-router"
import ProductActionAdd from "@/components/ProductActionAdd.vue"
import ProductActionRemove from "@/components/ProductActionRemove.vue"
import { usePendingAgentNavigator } from "@/package/routeStatus"

const route = useRoute()
const controller = usePendingAgentNavigator()

controller.pending()
const { data, onFetchFinally } = useFetch(`/product/${route.params.id}`, {
  initialData: null,
})
  .get()
  .json()

onFetchFinally(() => {
  controller.release()
})

const product = computed<Product | null>(() => data.value && data.value.data)
</script>
<template>
  <div class="container" v-if="product">
    <PageTitle level="1" class="mb-6"> {{ product.name }} </PageTitle>
    <div class="max-w-[800px] mx-auto">
      <div class="grid gap-4 grid-cols-2">
        <img
          class="w-full h-auto block"
          width="300"
          height="200"
          src="https://picsum.photos/seed/picsum/300/200"
          alt="fake img"
        />
        <div class="flex flex-col justify-between">
          <div>
            <div>
              {{ product.name }}
            </div>
            <div class="text-gray-400">{{ product.description }}</div>
            <div class="text-gray-400">${{ product.price }}</div>
          </div>
          <div class="flex gap-4">
            <ProductActionAdd :product="product" />
            <ProductActionRemove :product="product" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
