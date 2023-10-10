<script>
import {
  ref,
  inject,
  provide,
  reactive,
  computed,
  onBeforeUnmount,
  onMounted,
  watch,
} from "vue"

export default {
  props: {
    validate: {
      type: Boolean,
      default: true,
    },
    validateAll: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      default: "",
    },
    pipe: {
      type: Object,
      default: () => null,
    },
  },
  emits: ["submit-valid", "submit"],
  setup(props, { emit }) {
    const form = reactive({})

    const registered = new Map()

    const registerContext = (context) => {
      registered.set(context, context)
    }
    const removeContext = (context) => {
      registered.delete(context)
    }

    provide("form", form)
    provide("registerContext", registerContext)
    provide("removeContext", removeContext)

    onMounted(() => {
      if (props.pipe) {
        Object.keys(props.pipe).forEach((key) => {
          form[key] = props.pipe[key]
        })
      }
    })
    watch(
      () => props.pipe,
      (val) => {
        if (val) {
          Object.keys(val).forEach((key) => {
            form[key] = val[key]
          })
        }
      },
      { deep: true },
    )

    const root = ref(null)

    const validate = () => {
      if (props.validateAll) {
        const validateResults = [root.value.validate()]

        registered.forEach((ctx) => {
          validateResults.push(ctx.value.validate())
        })

        return Promise.all(validateResults).then((res) => res.every(Boolean))
      } else {
        return root.value.validate()
      }
    }

    const doValidate = async () => {
      if (props.validate) {
        try {
          const isValid = await validate()
          if (!isValid) {
            return false
          }
        } catch (e) {
          console.error(e)
          return false
        }
      }
      return true
    }

    const handleSubmit = async (e) => {
      console.log("submit")
      const allForms = {
        [props.name || "root"]: form,
        ...Array.from(registered.values())
          .map((ctx) => ctx.value.form)
          .reduce((acc, cur) => ({ ...acc, [cur.name]: cur.value }), {}),
      }

      emit("submit", { ...allForms })
      const isValid = await doValidate()
      if (isValid) {
        emit("submit-valid", {
          ...allForms,
        })
      } else {
        // Fix element form scroll to error field
        // `scroll-to-error` attribute should work, but it doesn't.
        setTimeout(() => {
          const nav = document.querySelector(".top-menu")
          const offset = nav ? nav.scrollHeight + 50 : 0

          const scrollTop = document
            .querySelector(".el-form-item.is-error")
            ?.getBoundingClientRect()
          if (scrollTop) {
            window.scrollTo(0, window.pageYOffset + scrollTop.top - offset)
          }
        }, 100)
      }
    }

    const resetFields = () => {
      root.value.resetFields()
    }

    const registerSelf = inject("registerContext", null)
    const removeSelf = inject("removeContext", null)
    const selfContext = computed(() => ({
      validate,
      resetFields,
      form: {
        name: props.name,
        value: form,
      },
    }))
    if (typeof registerSelf === "function") {
      registerSelf(selfContext)
    }
    onBeforeUnmount(() => {
      if (typeof removeSelf === "function") {
        removeSelf(selfContext)
      }
    })

    return {
      root,
      doValidate,
      resetFields,
      handleSubmit,
      form,
    }
  },
}
</script>
<template>
  <ElForm
    ref="root"
    size="large"
    :model="form"
    autocomplete="off"
    status-icon
    @submit.prevent="handleSubmit"
  >
    <slot :validate="doValidate" :submit="handleSubmit" :form="form" />
  </ElForm>
</template>
<style></style>
