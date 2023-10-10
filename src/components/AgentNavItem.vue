<script setup lang="ts">
import { onKeyDown } from "@vueuse/core"
import { Search } from "@element-plus/icons-vue"
import { computed, ref, watch } from "vue"
import { useGlobalModal } from "vue-use-modal-context"
import MessageForm from "./MessageForm.vue"
import { navigatorAgent } from "@/business/navigator-agent"
import { pageAgent } from "@/business/page-agent"
import AiCanvasRenderer from "@/package/AiCanvasRenderer.vue"
import AiConversation from "./AiConversation.vue"

const { openGlobalModal } = useGlobalModal()
const handleSearchFocus = () => {
  openGlobalModal("AgentModal")
}

onKeyDown("k", (e) => {
  if (e.ctrlKey || e.metaKey) {
    openGlobalModal("AgentModal")
  }
})
const handleBeforeClose = (done) => {
  if (navigatorAgentThinking.value || pageAgentThinking.value) {
    return
  } else {
    done()
  }
}
const navigatorAgentThinking = computed(() => navigatorAgent.thinking.value)
const pageAgentThinking = computed(() => pageAgent.thinking.value)
const handleNavigatorSubmit = async ({ message }) => {
  await navigatorAgent.run(message)
}
const handlePageAgentSubmit = async ({ message }) => {
  await pageAgent.run(message)
}

const activeName = ref("Find")

const navigatorConversation = computed(() => navigatorAgent.conversation.value)
const pageConversation = computed(() => pageAgent.conversation.value)
</script>
<template>
  <ElInput
    :prefix-icon="Search"
    placeholder="Agent (Ctrl/Cmd + k)"
    class="mr-2"
    @focus="handleSearchFocus"
  />

  <ModalProvider v-slot="{ modal }" name="AgentModal" global>
    <ElDialog
      v-model="modal.show"
      :before-close="handleBeforeClose"
      class="max-w-[800px] w-full"
    >
      <div
        v-loading="navigatorAgentThinking || pageAgentThinking"
        element-loading-text="Thinking..."
      >
        <ElTabs v-model="activeName">
          <ElTabPane label="Find something" name="Find">
            <MessageForm @submit="handleNavigatorSubmit" />
            <AiConversation
              class="mt-4"
              :conversation="navigatorConversation"
              :thinking="navigatorAgentThinking"
            >
              <template #canvas="{ message }">
                <AiCanvasRenderer :content="message.content" />
              </template>
            </AiConversation>
          </ElTabPane>
          <ElTabPane label="Explain this page" name="Explain"
            ><MessageForm @submit="handlePageAgentSubmit" />
            <AiConversation
              class="mt-4"
              :conversation="pageConversation"
              :thinking="pageAgentThinking"
            >
              <template #canvas="{ message }">
                <AiCanvasRenderer :content="message.content" />
              </template>
            </AiConversation>
          </ElTabPane>
        </ElTabs>
      </div>
    </ElDialog>
  </ModalProvider>
</template>
