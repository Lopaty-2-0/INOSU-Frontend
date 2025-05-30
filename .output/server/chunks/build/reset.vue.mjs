import { defineComponent, ref, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
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
  __name: "reset",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Panel | Resetování hesla",
      meta: [{ name: "description", content: "Resetování hesla" }]
    });
    const messages = ref({
      password: null,
      passwordAgain: null,
      form: { message: null, type: null }
    });
    const loading = ref(true);
    const tokenEmail = ref(null);
    const formData = ref({
      password: "",
      passwordAgain: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      if (!tokenEmail.value) {
        _push(`<div id="forgetPassword-reset-error" data-v-8d38d3fe>`);
        if (loading.value) {
          _push(`<div class="loading-big" data-v-8d38d3fe>`);
          _push(ssrRenderComponent(Loading, {
            color: "rgba(var(--description-color), 1)",
            size: "24px"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (!loading.value) {
          _push(`<div class="container card" data-v-8d38d3fe><div class="head" data-v-8d38d3fe><h2 data-v-8d38d3fe>Token je neplatný</h2><p data-v-8d38d3fe> Token pro resetování hesla je neplatný nebo vypršel, je potřeba vytvořit nový token a zkusit to znovu </p></div><div class="footer" data-v-8d38d3fe><a href="/password/forget/new" data-v-8d38d3fe><button type="submit" data-v-8d38d3fe>Zkusit znovu</button></a></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (tokenEmail.value) {
        _push(`<div id="forgetPassword-reset" data-v-8d38d3fe><div class="container" data-v-8d38d3fe><div class="head" data-v-8d38d3fe><h2 data-v-8d38d3fe>Změna hesla</h2><p data-v-8d38d3fe>Resetujte si heslo k vašemu účtu zadáním nového hesla</p></div><form data-v-8d38d3fe><div class="section" data-v-8d38d3fe><label for="password" data-v-8d38d3fe>Nové heslo</label><input type="password" id="password" name="password" placeholder="*****"${ssrRenderAttr("value", formData.value.password)} data-v-8d38d3fe>`);
        if (messages.value.password) {
          _push(`<p class="error" data-v-8d38d3fe>${ssrInterpolate(messages.value.password)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="section" data-v-8d38d3fe><label for="passwordAgain" data-v-8d38d3fe>Heslo znovu</label><input type="password" id="passwordAgain" name="passwordAgain" placeholder="*****"${ssrRenderAttr("value", formData.value.passwordAgain)} data-v-8d38d3fe>`);
        if (messages.value.passwordAgain) {
          _push(`<p class="error" data-v-8d38d3fe>${ssrInterpolate(messages.value.passwordAgain)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="footer" data-v-8d38d3fe><button type="submit" data-v-8d38d3fe>Změnit heslo</button>`);
        if (messages.value.form.message) {
          _push(`<p class="${ssrRenderClass({
            error: messages.value.form.type === "error",
            success: messages.value.form.type === "success"
          })}" data-v-8d38d3fe>${ssrInterpolate(messages.value.form.message)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (loading.value) {
          _push(`<div class="loading" data-v-8d38d3fe>`);
          _push(ssrRenderComponent(Loading, {
            color: "rgba(var(--description-color), 1)",
            size: "6px"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<a href="/" data-v-8d38d3fe>Máte změněno?</a></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/password/forget/reset.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const reset = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8d38d3fe"]]);

export { reset as default };
//# sourceMappingURL=reset.vue.mjs.map
