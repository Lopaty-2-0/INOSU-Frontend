import { a as __nuxt_component_0, _ as _export_sfc } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link.mjs';
import { defineComponent, ref, mergeProps, unref, createSlots, withCtx, createVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { _ as __nuxt_component_2 } from './Alerts.vue.mjs';
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
import './index2.mjs';
import './Loading.vue.mjs';
import './account.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Panel | Uživatelé - role",
      meta: [{ name: "description", content: "Panel Settings User Information" }]
    });
    const numberOfUsers = ref(-1);
    const allRoles = ref(void 0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({
        name: "panel",
        loading: unref(numberOfUsers) < 0 || !unref(allRoles)
      }, _attrs), createSlots({
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Navbar, { links: [{ name: "Uživatelé", path: "/panel/users" }] }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, { links: [{ name: "Uživatelé", path: "/panel/users" }] })
            ];
          }
        }),
        _: 2
      }, [
        unref(allRoles) ? {
          name: "content",
          fn: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div id="users" data-v-6ff59d3c${_scopeId}><div class="content" data-v-6ff59d3c${_scopeId}><div class="line" data-v-6ff59d3c${_scopeId}><div class="section-head" data-v-6ff59d3c${_scopeId}><h3 data-v-6ff59d3c${_scopeId}>Celkem uživatelů: ${ssrInterpolate(unref(numberOfUsers))}</h3><p data-v-6ff59d3c${_scopeId}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p></div></div><div class="roles-section" data-v-6ff59d3c${_scopeId}><div class="section-head" data-v-6ff59d3c${_scopeId}><h4 data-v-6ff59d3c${_scopeId}>Role uživatelů</h4></div><div class="roles" data-v-6ff59d3c${_scopeId}><!--[-->`);
              ssrRenderList(unref(allRoles), (role) => {
                _push2(ssrRenderComponent(_component_NuxtLink, {
                  class: "role",
                  key: role,
                  to: `/panel/users/${role}`
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="section-head" data-v-6ff59d3c${_scopeId2}><span data-v-6ff59d3c${_scopeId2}>${ssrInterpolate(role)}</span></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "section-head" }, [
                          createVNode("span", null, toDisplayString(role), 1)
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]--></div></div></div>`);
              _push2(ssrRenderComponent(__nuxt_component_2, null, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { id: "users" }, [
                  createVNode("div", { class: "content" }, [
                    createVNode("div", { class: "line" }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, "Celkem uživatelů: " + toDisplayString(unref(numberOfUsers)), 1),
                        createVNode("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
                      ])
                    ]),
                    createVNode("div", { class: "roles-section" }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h4", null, "Role uživatelů")
                      ]),
                      createVNode("div", { class: "roles" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(allRoles), (role) => {
                          return openBlock(), createBlock(_component_NuxtLink, {
                            class: "role",
                            key: role,
                            to: `/panel/users/${role}`
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "section-head" }, [
                                createVNode("span", null, toDisplayString(role), 1)
                              ])
                            ]),
                            _: 2
                          }, 1032, ["to"]);
                        }), 128))
                      ])
                    ])
                  ]),
                  createVNode(__nuxt_component_2)
                ])
              ];
            }
          }),
          key: "0"
        } : void 0
      ]), _parent));
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/users/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6ff59d3c"]]);

export { index as default };
//# sourceMappingURL=index.vue2.mjs.map
