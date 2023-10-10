import { ElLoading } from "element-plus"
import { watch } from "vue"

export const withLoading = async (fn, loadingOptions = {}) => {
  const options = {
    fullscreen: true,
    text: "",
    ...loadingOptions,
  }

  const loadingInstance = ElLoading.service(options)
  return fn()
    .then((r) => {
      loadingInstance.close()
      return r
    })
    .catch((r) => {
      loadingInstance.close()
      return Promise.reject(r)
    })
}

export const withToggle = (fn, boolRef) => {
  boolRef.value = true
  return fn()
    .then((r) => {
      boolRef.value = false
      return r
    })
    .catch((r) => {
      boolRef.value = false
      return Promise.reject(r)
    })
}

export const withToggleLoading = (boolRef, loadingOptions = {}) => {
  const options = {
    fullscreen: true,
    text: "",
    ...loadingOptions,
  }

  let loadingInstance = null
  if (boolRef.value) {
    loadingInstance = ElLoading.service(options)
  }
  watch(boolRef, (v) => {
    if (v) {
      loadingInstance = ElLoading.service(options)
    } else {
      loadingInstance.close()
    }
  })
}
