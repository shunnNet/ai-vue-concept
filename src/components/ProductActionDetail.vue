<script setup lang="ts">
import { Product } from "@/types"
import ElButtonLink from "@/components/ElButtonLink.vue"

type Props = {
  product: Product
}

defineProps<Props>()
</script>
<template>
  <ElButtonLink
    :to="{ name: 'Product', params: { id: product.id } }"
    class="flex-grow"
    type="primary"
    icon="plus"
  >
    Detail
  </ElButtonLink>
</template>
