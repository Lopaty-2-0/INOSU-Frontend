import type {NuxtApp} from "nuxt/app";
import { createPinia, type Pinia } from "pinia";

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
    const pinia: Pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
});
