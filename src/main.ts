import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

//Styles
import "./assets/scss/styles.scss";

//Bootstrap
import "bootstrap";

//Day.js date formatter start
import dayjs from "dayjs";

// Plugins
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import advancedFormat from "dayjs/plugin/advancedFormat";

// Extend dayjs with the plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);
//Day.js date formatter end

//PrimeVue
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";
import { definePreset } from "@primeuix/themes";
const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{orange.50}",
      100: "{orange.100}",
      200: "{orange.200}",
      300: "{orange.300}",
      400: "{orange.400}",
      500: "{orange.500}",
      600: "{orange.600}",
      700: "{orange.700}",
      800: "{orange.800}",
      900: "{orange.900}",
      950: "{orange.950}",
    },
    colorScheme: {
      light: {
        formField: {
          hoverBorderColor: "{primary.color}",
        },
      },
      dark: {
        formField: {
          hoverBorderColor: "{primary.color}",
        },
      },
    },
  },
});

//Create app
const app = createApp(App);
app
  .use(createPinia())
  .use(PrimeVue, {
    theme: {
      preset: MyPreset,
    },
  })
  .use(ConfirmationService)
  .use(ToastService)
  .use(router)
  .mount("#app");
