import type { AsyncData, UseFetchOptions } from "nuxt/app";
import { useFetch, useRuntimeConfig } from "nuxt/app";
import type { RuntimeConfig } from "nuxt/schema";

const apiUseFetch = async <T>(endpoint: string | (() => string), options?: UseFetchOptions<T>): Promise<AsyncData<any, any>> => {
    const appConfig: RuntimeConfig = useRuntimeConfig();
    const url: string = appConfig.public.apiUrl + endpoint;

    return useFetch(url, {
        ...options,
    });
}

export default apiUseFetch;