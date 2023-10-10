import { computed } from "vue"
import { isLogin } from "@/store/user"
import {
  AgentStrategy,
  ChatGptAgentController,
  ChatGptCanvasAgent,
} from "@/package/ChatgptAgentController"
import { order } from "@/store/order"
import { Tool } from "@/package/ChatgptAgentController"
import { globalModalContext } from "@/store/global-modal"

// TODO: Dynamic business rule and strategies depend on user status and order status
const systemMessage = computed(
  () => `---rules---
1. If user is not logged in, you must ask user login first. If user is logged in, you can remind that to user.
2. If user is not select any product, you must ask user select a product first.
3. User can do checkout only if user is logged in and user has selected a product. So if user want to checkout:
  1. If user is not logged in, you must ask user login first.
  2. If user is not select any product, you must ask user select a product first.

4. If user ask for checkout, and user can do checkout, you must call 'prepareCheckoutForm' function.

---user status---
- ${isLogin.value ? "User already logged in" : "User not logged in"}
- ${
    order.cart.length
      ? `User already add ${order.cart.length} products to cart`
      : "User not add any product to cart"
  }
- ${
    isLogin.value && !!order.cart.length
      ? "User can checkout now"
      : "User can not checkout now"
  }
`,
)

const strategies: AgentStrategy = (tools) => {
  const result = {
    tools,
    call: undefined,
  }
  if (isLogin.value) {
    result.tools = result.tools.filter((tool) => tool.name !== "openLoginModal")
  }
  if (!isLogin.value || !order.cart.length) {
    result.tools = result.tools.filter(
      (tool) => tool.name !== "prepareCheckoutForm",
    )
  }

  console.log("strategies", tools)

  return result
}

const serviceAgentReplier = new ChatGptCanvasAgent([], systemMessage, [], true)

const prepareProductListTool = new Tool(
  async () => {
    serviceAgentReplier.addComponent({
      component: `RecommendProductList`,
      description:
        "A product card list. The card also has 'add' / 'remove' button for adding/removing product to cart ",
    })

    return "Prepare product list successfully."
  },
  {
    name: "prepareProductList",
    description: "Prepare recommend product list for displaying to user later.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
)

const prepareCheckoutForm = new Tool(
  async () => {
    serviceAgentReplier.addComponent({
      component: `CheckoutForm`,
      description:
        "Form for filling order information. Include user info, payment method, etc.",
      attributes: {},
    })
    return "Checkout form is ready."
  },
  {
    name: "prepareCheckoutForm",
    description: "Prepare checkout form.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
)

const loginTool = new Tool(
  async () => {
    globalModalContext.openModal("LoginModal")
    return "I opened the login modal for you. You can login now."
  },
  {
    name: "openLoginModal",
    description: "Useful when asking user to login.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
)

export const useServiceAgent = () => {
  const serviceAgent = new ChatGptAgentController(
    [],
    systemMessage,
    strategies,
    serviceAgentReplier,
  )

  serviceAgent.addTool(loginTool)
  serviceAgent.addTool(prepareProductListTool)
  serviceAgent.addTool(prepareCheckoutForm)

  serviceAgent.watchAndRun(isLogin, async (newValue: boolean) => {
    return newValue === true
      ? "User is logged in now."
      : "User is logged out now."
  })

  const thinking = computed(() => serviceAgent.thinking.value)
  const conversation = computed(() => serviceAgent.conversation.value)
  return {
    thinking,
    conversation,
    serviceAgent,
  }
}
