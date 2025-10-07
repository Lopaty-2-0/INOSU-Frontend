import type { NitroFetchOptions } from "nitropack";
import type { $Fetch } from "ohmyfetch";
import type { RuntimeConfig } from "nuxt/schema";
import { useRuntimeConfig } from "nuxt/app";

const apiFetch = async (endpoint: string, options: NitroFetchOptions<string>): Promise<any> => {
    const appConfig: RuntimeConfig = useRuntimeConfig();
    const url: string = appConfig.public.apiUrl + endpoint;

    return $fetch(url, options);
};

export default apiFetch;
