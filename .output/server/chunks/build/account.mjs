import { toRef, isRef, ref } from 'vue';
import { b as useNuxtApp } from './server.mjs';
import { defineStore } from 'pinia';
import { d as destr, A as klona, E as parse, F as getRequestHeader, G as isEqual, H as setCookie, I as getCookie, J as deleteCookie } from '../_/nitro.mjs';

const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}

function useRequestEvent(nuxtApp) {
  var _a;
  nuxtApp || (nuxtApp = useNuxtApp());
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}

const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  var _a;
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ?? (opts.filter = (key) => key === name);
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? ((_a = opts.default) == null ? void 0 : _a.call(opts)));
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies || (nuxtApp._cookies = {});
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}

const useAccountStore = defineStore("account", {
  state: () => ({
    id: "",
    name: "",
    surname: "",
    abbreviation: null,
    email: "",
    role: "",
    profilePicture: "default.jpg",
    idClass: [],
    createdAt: /* @__PURE__ */ new Date(),
    links: [],
    theme: "",
    loading: true
  }),
  getters: {
    getAccountData() {
      return {
        id: this.id,
        name: this.name,
        surname: this.surname,
        abbreviation: this.abbreviation,
        email: this.email,
        role: this.role,
        profilePicture: this.profilePicture,
        idClass: this.idClass,
        createdAt: this.createdAt
      };
    },
    getTheme() {
      return this.theme;
    },
    getLinks() {
      return this.links;
    },
    getLoading() {
      return this.loading;
    },
    getRole() {
      return this.role;
    },
    getId() {
      return this.id;
    }
  },
  actions: {
    setAccountData(accountData) {
      this.id = accountData.id;
      this.name = accountData.name;
      this.surname = accountData.surname;
      this.abbreviation = accountData.abbreviation;
      this.email = accountData.email;
      this.role = accountData.role;
      this.profilePicture = accountData.profilePicture;
      this.idClass = accountData.idClass;
      this.createdAt = accountData.createdAt;
    },
    setId(id) {
      this.id = id;
    },
    updateAccountDataCookie(accountData) {
      useCookie("accountData").value = JSON.stringify(accountData);
    },
    updateProfilePicture(profilePicture) {
      this.profilePicture = profilePicture;
      this.updateAccountDataCookie({
        ...this.getAccountData,
        profilePicture
      });
    },
    setTheme(theme) {
      this.theme = theme;
    },
    setRole(role) {
      this.role = role;
    },
    setLinks(links) {
      this.links = links;
      localStorage.setItem("links", JSON.stringify(links));
    },
    setLoading(value) {
      this.loading = value;
    }
  }
});

export { useState as a, useAccountStore as u };
//# sourceMappingURL=account.mjs.map
