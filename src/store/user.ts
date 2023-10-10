import { computed, reactive, watch } from "vue"
import { useStorage } from "@vueuse/core"
import { sleep } from "../utils/utils"
import { historyOrder } from "./order"

const _userToken = useStorage("token", "")
export const isLogin = computed(() => !!_userToken.value)
export const userOrder = computed(() => historyOrder.value)

export const userInfo = reactive({
  name: "",
  email: "",
  phone: "",
  address: "",
})

export const login = async () => {
  await sleep(1500)

  _userToken.value = "OK"
  userInfo.name = "John Doe"
  userInfo.email = "user@email.com"
}

export const logout = () => {
  _userToken.value = ""
  userInfo.name = ""
  userInfo.email = ""
}
