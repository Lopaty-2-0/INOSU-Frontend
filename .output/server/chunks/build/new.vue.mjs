import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "new",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Panel | Zapomenuté heslo",
      meta: [{ name: "description", content: "Zapomenuté heslo" }]
    });
    const messages = ref({ email: null, form: { message: null, type: null } });
    const email = ref("");
    const loading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "forgetPassword-new" }, _attrs))} data-v-7dc23eb8><div class="container" data-v-7dc23eb8><div class="head" data-v-7dc23eb8><h2 data-v-7dc23eb8>Zapomenuté heslo</h2><p data-v-7dc23eb8>Zadejte e-mail pro zaslání odkazu pro resetování.</p></div><form data-v-7dc23eb8><div class="section" data-v-7dc23eb8><label for="email" data-v-7dc23eb8>E-mail</label><input type="text" id="email" name="email" placeholder="test@test.com"${ssrRenderAttr("value", email.value)} data-v-7dc23eb8>`);
      if (messages.value.email) {
        _push(`<p class="error" data-v-7dc23eb8>${ssrInterpolate(messages.value.email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="footer" data-v-7dc23eb8><button type="submit" data-v-7dc23eb8>Zaslat e-mail</button>`);
      if (messages.value.form.message) {
        _push(`<p class="${ssrRenderClass({
          error: messages.value.form.type === "error",
          success: messages.value.form.type === "success"
        })}" data-v-7dc23eb8>${ssrInterpolate(messages.value.form.message)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (loading.value) {
        _push(`<div class="loading" data-v-7dc23eb8>`);
        _push(ssrRenderComponent(Loading, {
          color: "rgba(var(--description-color), 1)",
          size: "6px"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<a href="/" data-v-7dc23eb8>Vzpomněli jste si?</a></form></div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/password/forget/new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _new = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7dc23eb8"]]);

export { _new as default };
//# sourceMappingURL=new.vue.mjs.map
