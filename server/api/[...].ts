import { joinURL } from "ufo";

export default defineEventHandler((event) => {
    const apiUrl: string = useRuntimeConfig().public.apiUrl as string;
    const path: string = event.path.replace(/^\/api/, "");
    const target: string = joinURL(apiUrl, path);

    return proxyRequest(event, target, {
        fetchOptions: {
            redirect: "manual"
        }
    });
});