<script>
import { h, resolveComponent, computed } from "vue"
export default {
  inheritAttrs: false,
  props: {
    to: {
      type: [Object, String],
      default: () => ({}),
    },
    buttonClass: {
      type: [String, Array, Object],
      default: "",
    },
    native: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { attrs, slots }) {
    const rootComponent = computed(() =>
      props.native ? "a" : resolveComponent("RouterLink"),
    )
    const rootBaseAttrs = computed(() => (props.native ? {} : { to: props.to }))

    const elButton = resolveComponent("ElButton")
    const mapSlots = () => {
      const result = {}
      Object.entries(slots).forEach(([key, value]) => {
        result[key] = (scoped) => value(scoped)
      })
      return result
    }

    return () => {
      const buttonAttrs = { ...attrs }
      const rootAttrs = { ...rootBaseAttrs.value }
      const preserveRootAttrs = ["id", "target", "href", "class"]
      preserveRootAttrs.forEach((attr) => {
        rootAttrs[attr] = attrs[attr]
        delete buttonAttrs[attr]
      })
      rootAttrs.class = [
        "inline-block",
        Array.isArray(rootAttrs.class)
          ? rootAttrs.class.join(" ")
          : rootAttrs.class,
      ]

      const renderedElButton = h(
        elButton,
        {
          ...buttonAttrs,
          class: [
            "flex",
            "w-full",
            Array.isArray(props.buttonClass)
              ? props.buttonClass.join(" ")
              : props.buttonClass,
          ],
        },
        mapSlots(),
      )

      if (props.native) {
        return h(rootComponent.value, rootAttrs, [renderedElButton])
      } else {
        return h(rootComponent.value, rootAttrs, {
          default: () => renderedElButton,
        })
      }
    }
  },
}
</script>
