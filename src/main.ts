import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

//Styles
import "./assets/scss/styles.scss";

//Bootstrap
import "bootstrap";

//PrimeVue
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";

const app = createApp(App);
app
  .use(createPinia())
  .use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  })
  .use(ConfirmationService)
  .use(ToastService)
  .use(router)
  .mount("#app");
