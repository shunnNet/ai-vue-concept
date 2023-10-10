<script lang="ts">
import { defineComponent, h } from "vue"
import { ComponentMessage } from "@crazydos/vue-llm-rich-message"
import { store } from "./canvas"

export default defineComponent({
  props: {
    content: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    // const canvasContext = inject("canvasContext")

    return () => {
      return h(
        ComponentMessage,
        {
          message: props.content,
        },
        Object.entries(store.elements).reduce((acc, [id, ele]) => {
          acc[id] = () => ele.vnodes
          return acc
        }, {}),
      )
    }
  },
})
</script>
