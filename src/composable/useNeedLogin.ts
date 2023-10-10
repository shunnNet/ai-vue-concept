import { isLogin } from "@/store/user"
import { watch } from "vue"
import { useRouter } from "vue-router"

export const useNeedLogin = (route) => {
  const router = useRouter()
  watch(isLogin, (value) => {
    if (!value) {
      router.push(route)
    }
  })
}
