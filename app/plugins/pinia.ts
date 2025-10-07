import { createPinia, type Pinia } from "pinia";

export default defineNuxtPlugin((nuxtApp) => {
    const pinia: Pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
});
