import { defineComponent, h, inject, ref, Teleport } from "vue"

export default defineComponent({
  props: {
    desc: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots, emit }) {
    const canvasContext = inject("canvasContext")
    const activate = ref(false)
    const id = Date.now() + Math.random().toString(36).substr(2, 9)

    return () => {
      const vnodes = slots && slots.default?.()
      if (!vnodes) return () => null
      canvasContext.elements[id] = {
        vnodes,
        activate,
        description: props.desc,
      }
      // return activate.value
      //   ? h(
      //       Teleport,
      //       {
      //         to: "#ai-canvas",
      //         // disabled:
      //       },
      //       {
      //         default: () => vnodes,
      //       },
      //     )
      //   : vnodes

      return vnodes
    }
  },
})
