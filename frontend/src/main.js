import { createApp } from "vue";
import App from "./App.vue";
import CarbonComponentsVue from "@carbon/vue";
import ChartsVue from "@carbon/charts-vue";
// eslint-disable-next-line no-unused-vars
import { model } from "@/model.js";

const app = createApp(App);
app.use(CarbonComponentsVue);
app.use(ChartsVue);
app.mount("#app");
