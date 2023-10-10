import { computed, reactive } from "vue"
import type { Product } from "@/types"
import { sleep } from "@/utils/utils"
import { useStorage } from "@vueuse/core"

type Order = {
  cart: Product[]
  name: string
  email: string
  address: string
  phone: string
  payment: string
  note: string
}
export const historyOrder = useStorage<Order[]>("order", [])

export const order: Order = reactive({
  cart: [],
  name: "",
  email: "",
  address: "",
  phone: "",
  payment: "",
  note: "",
})

export const addProduct = (product: Product) => {
  order.cart.push(product)
}
export const removeProduct = (product: Product) => {
  const index = order.cart.findIndex((p) => p.id === product.id)
  if (index > -1) {
    order.cart.splice(index, 1)
  }
}

export const isProductInCart = (product: Product) => {
  return order.cart.some((p) => p.id === product.id)
}
export const fee = computed(() => {
  return order.cart.reduce((a, b) => a + b.price, 0)
})

export const PAYMENT_METHODS = ["Cash", "Credit Card", "Paypal"]

export const checkout = async (order: Order) => {
  await sleep(1500).then(() => {
    historyOrder.value.push(order)
  })
}
