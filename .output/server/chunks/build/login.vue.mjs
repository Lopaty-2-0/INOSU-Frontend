import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { L as Loading } from './Loading.vue.mjs';
import { u as useHead } from './v3.mjs';
import { _ as _export_sfc } from './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'node:path';
import 'node:crypto';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Panel | Přihlášení",
      meta: [{ name: "description", content: "Panel Login Page" }]
    });
    const loginData = ref({ login: null, password: null, stayLogged: false });
    const errors = ref({ login: null, password: null, req: null });
    const loading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "login-form" }, _attrs))} data-v-2fcd3fee><div class="container" data-v-2fcd3fee><div class="head" data-v-2fcd3fee><h2 data-v-2fcd3fee>INOSU panel</h2><p data-v-2fcd3fee>Přihlaste se do systému pomocí svého účtu</p></div><form data-v-2fcd3fee><div class="section" data-v-2fcd3fee><label for="login" data-v-2fcd3fee>E-mail / Zkratka</label><input id="login"${ssrRenderAttr("value", loginData.value.login)} type="text" name="login" placeholder="test@test.com / JUDE" data-v-2fcd3fee>`);
      if (errors.value.login) {
        _push(`<p class="error" data-v-2fcd3fee>${ssrInterpolate(errors.value.login)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="section" data-v-2fcd3fee><label for="password" data-v-2fcd3fee>Heslo</label><input id="password"${ssrRenderAttr("value", loginData.value.password)} type="password" name="password" placeholder="*****" data-v-2fcd3fee>`);
      if (errors.value.password) {
        _push(`<p class="error" data-v-2fcd3fee>${ssrInterpolate(errors.value.password)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="custom-item" data-v-2fcd3fee><input id="stayLogged" type="checkbox" name="stayLogged" data-v-2fcd3fee><label for="stayLogged" data-v-2fcd3fee>Zůstat přihlášen</label></div><div class="footer" data-v-2fcd3fee><button type="submit" data-v-2fcd3fee>Přihlásit se</button>`);
      if (errors.value.req) {
        _push(`<p class="error" data-v-2fcd3fee>${ssrInterpolate(errors.value.req)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (loading.value) {
        _push(`<div class="loading" data-v-2fcd3fee>`);
        _push(ssrRenderComponent(Loading, {
          color: "rgba(var(--description-color), 1)",
          size: "6px"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<a href="/password/forget/new" data-v-2fcd3fee>Zapomněli jste heslo?</a></form></div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2fcd3fee"]]);

export { login as default };
//# sourceMappingURL=login.vue.mjs.map
