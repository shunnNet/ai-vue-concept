<script>
import { inject, resolveComponent, h, watch, onBeforeUnmount, ref } from "vue"
export default {
  props: {
    as: {
      type: [String, Object],
      required: true,
    },
    field: {
      type: String,
      required: true,
    },
    initValue: {
      type: [String, Number, Boolean, Object, Array],
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
  },
  setup(props, { slots, attrs, expose }) {
    const form = inject("form")

    /* eslint-disable */
    form[props.field] = props.initValue
    /* eslint-enable */

    watch(
      () => props.field,
      (newField, oldField) => {
        delete form[oldField]
        form[newField] = props.initValue
      },
    )

    onBeforeUnmount(() => {
      delete form[props.field]
    })

    const mapSlots = () => {
      const result = {}
      Object.entries(slots).forEach(([key, value]) => {
        result[key] = (scoped) => value(scoped)
      })
      return result
    }

    const fieldRef = ref(null)

    expose({
      fieldRef,
    })

    return () => {
      const ElFormItem = resolveComponent("ElFormItem")

      const rootComponent = !props.as
        ? null
        : typeof props.as === "string"
        ? resolveComponent(props.as)
        : props.as

      return rootComponent
        ? h(
            ElFormItem,
            {
              prop: props.field,
              label: props.label,
            },
            {
              default: () =>
                h(
                  rootComponent,
                  {
                    ref: fieldRef,
                    modelValue: form[props.field],
                    "onUpdate:modelValue": (value) =>
                      (form[props.field] = value),
                    ...attrs,
                  },
                  mapSlots(),
                ),
            },
          )
        : null
    }
  },
}
</script>
