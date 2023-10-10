<script setup lang="ts">
import { Product } from "@/types"
import { removeProduct, isProductInCart } from "@/store/order"
import { ElMessage } from "element-plus"

type Props = {
  product: Product
}

defineProps<Props>()

const handleRemoveProduct = (product: Product) => {
  removeProduct(product)
  ElMessage.success("Remove product success")
}
</script>
<template>
  <ElButton
    v-if="isProductInCart(product)"
    class="flex-grow"
    type="danger"
    icon="minus"
    @click="handleRemoveProduct(product)"
  >
    Remove
  </ElButton>
</template>
