<script setup lang="ts">
import { Product } from "@/types"
import { addProduct, isProductInCart } from "@/store/order"
import { ElMessage } from "element-plus"

type Props = {
  product: Product
}

defineProps<Props>()

const handleAddProduct = (product: Product) => {
  addProduct(product)
  ElMessage.success("Add product success")
}
</script>
<template>
  <ElButton
    v-if="!isProductInCart(product)"
    class="flex-grow"
    type="success"
    icon="plus"
    @click="handleAddProduct(product)"
  >
    Add
  </ElButton>
</template>
<style lang="scss"></style>
