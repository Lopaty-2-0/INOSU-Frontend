import { a as __nuxt_component_0, _ as _export_sfc } from './server.mjs';
import __nuxt_component_0$1 from './index2.mjs';
import { _ as __nuxt_component_0$2 } from './nuxt-link.mjs';
import { _ as __nuxt_component_2 } from './Alerts.vue.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { N as Navbar } from './Navbar.vue.mjs';
import { u as useHead } from './v3.mjs';
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
import 'pinia';
import 'vue-router';
import './Loading.vue.mjs';
import './account.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "403",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Panel | Přístup odepřen",
      meta: [
        { name: "description", content: "Přistup zamítnut page" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_Icon = __nuxt_component_0$1;
      const _component_NuxtLink = __nuxt_component_0$2;
      const _component_Alerts = __nuxt_component_2;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "panel" }, _attrs), {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Navbar, { links: [
              { name: "Domů", path: "/panel" },
              { name: "Přístup odepřen", path: "/panel/errors/403" }
            ] }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, { links: [
                { name: "Domů", path: "/panel" },
                { name: "Přístup odepřen", path: "/panel/errors/403" }
              ] })
            ];
          }
        }),
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div id="access-denied" data-v-c2fb6274${_scopeId}><div class="content" data-v-c2fb6274${_scopeId}><div class="icon-div" data-v-c2fb6274${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "material-symbols:visibility-lock-rounded",
              class: "icon"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="text" data-v-c2fb6274${_scopeId}><h1 data-v-c2fb6274${_scopeId}>Přístup odepřen</h1><p data-v-c2fb6274${_scopeId}>Nemáte dostatečná oprávnění pro zobrazení této stránky.</p></div><div class="group-btn" data-v-c2fb6274${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              class: "primary",
              href: "/panel"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Vrátit zpět`);
                } else {
                  return [
                    createTextVNode("Vrátit zpět")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_NuxtLink, {
              class: "secondary",
              href: "/panel/support"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Podpora`);
                } else {
                  return [
                    createTextVNode("Podpora")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div>`);
            _push2(ssrRenderComponent(_component_Alerts, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { id: "access-denied" }, [
                createVNode("div", { class: "content" }, [
                  createVNode("div", { class: "icon-div" }, [
                    createVNode(_component_Icon, {
                      name: "material-symbols:visibility-lock-rounded",
                      class: "icon"
                    })
                  ]),
                  createVNode("div", { class: "text" }, [
                    createVNode("h1", null, "Přístup odepřen"),
                    createVNode("p", null, "Nemáte dostatečná oprávnění pro zobrazení této stránky.")
                  ]),
                  createVNode("div", { class: "group-btn" }, [
                    createVNode(_component_NuxtLink, {
                      class: "primary",
                      href: "/panel"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Vrátit zpět")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_NuxtLink, {
                      class: "secondary",
                      href: "/panel/support"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Podpora")
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              createVNode(_component_Alerts)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/errors/403.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _403 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c2fb6274"]]);

export { _403 as default };
//# sourceMappingURL=403.vue.mjs.map
