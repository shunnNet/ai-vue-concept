import FormContext from "./FormContext.vue"
import FormField from "./FormField.vue"
import FormSubmit from "./FormSubmit.vue"

export default {
  install(app) {
    app.component("FormContext", FormContext)
    app.component("FormField", FormField)
    app.component("FormSubmit", FormSubmit)
  },
}
