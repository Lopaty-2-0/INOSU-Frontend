import type { NitroFetchOptions } from "nitropack";
import type {$Fetch} from "ohmyfetch";
import type {RuntimeConfig} from "nuxt/schema";
import { useRuntimeConfig } from "nuxt/app";

const apiFetch = async (endpoint: string, options: NitroFetchOptions<string>): Promise<$Fetch> => {
    const appConfig: RuntimeConfig = useRuntimeConfig();
    const url: string = appConfig.public.serverUrl + "/api" + endpoint;

    return $fetch(url, options);
};

export default apiFetch;
