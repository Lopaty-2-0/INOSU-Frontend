import type { NitroFetchOptions } from "nitropack";
import type {$Fetch} from "ohmyfetch";

const customFetch = async (endpoint: string, options: NitroFetchOptions<string>): Promise<$Fetch> => {
    const url: string = `http://89.203.248.163/api/${endpoint}`;

    return $fetch(url, options);
};

export default customFetch;
