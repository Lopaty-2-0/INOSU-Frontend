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
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "forgetPassword-new" }, _attrs))} data-v-c170f29b><div class="container" data-v-c170f29b><div class="head" data-v-c170f29b><h2 data-v-c170f29b>Zapomenuté heslo</h2><p data-v-c170f29b>Zadejte e-mail pro zaslání odkazu pro resetování.</p></div><form data-v-c170f29b><div class="section" data-v-c170f29b><label for="email" data-v-c170f29b>E-mail</label><input type="text" id="email" name="email" placeholder="test@test.com"${ssrRenderAttr("value", email.value)} data-v-c170f29b>`);
      if (messages.value.email) {
        _push(`<p class="error" data-v-c170f29b>${ssrInterpolate(messages.value.email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="footer" data-v-c170f29b><button type="submit" data-v-c170f29b>Zaslat e-mail</button>`);
      if (messages.value.form.message) {
        _push(`<p class="${ssrRenderClass({
          error: messages.value.form.type === "error",
          success: messages.value.form.type === "success"
        })}" data-v-c170f29b>${ssrInterpolate(messages.value.form.message)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (loading.value) {
        _push(`<div class="loading" data-v-c170f29b>`);
        _push(ssrRenderComponent(Loading, {
          color: "rgba(var(--description-color), 1)",
          size: "6px"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<a href="/" data-v-c170f29b>Vzpomněli jste si?</a></form></div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/password/forget/new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _new = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c170f29b"]]);

export { _new as default };
//# sourceMappingURL=new.vue.mjs.map
