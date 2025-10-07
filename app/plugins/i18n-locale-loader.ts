export default defineNuxtPlugin(async (nuxtApp) => {
    if (process.server) return;

    const storageLocale: string | null = localStorage.getItem("locale");
    const i18n: any = nuxtApp.$i18n;
    const locales = i18n.locales;
    const locale = i18n.locale;
    const setLocale = i18n.setLocale;

    type AvailableLocale = (typeof i18n.locales.value[number])["code"];

    const availableLocales = locales.value
        .map((l: any) => l.code)
        .filter((code: any): code is AvailableLocale => code !== locale.value);

    if (storageLocale) {
        if ((availableLocales as string[]).includes(storageLocale)) {
            await setLocale(storageLocale as AvailableLocale);
        }
    }
});