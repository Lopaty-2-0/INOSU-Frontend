import { c as useRuntimeConfig } from './server.mjs';

const apiFetch = async (endpoint, options) => {
  const appConfig = useRuntimeConfig();
  const url = appConfig.public.apiUrl + endpoint;
  return $fetch(url, options);
};

export { apiFetch as a };
//# sourceMappingURL=apiFetch.mjs.map
