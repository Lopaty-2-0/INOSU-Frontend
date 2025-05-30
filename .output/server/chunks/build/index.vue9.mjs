import { a as __nuxt_component_0, _ as _export_sfc } from './server.mjs';
import { N as Navbar } from './Navbar.vue.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link.mjs';
import { defineComponent, ref, mergeProps, unref, createSlots, withCtx, createVNode, createBlock, createCommentVNode, createTextVNode, openBlock, toDisplayString, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { _ as __nuxt_component_2 } from './Alerts.vue.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import './Loading.vue.mjs';
import './account.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Panel | Uživatelé - student",
      meta: [{ name: "description", content: "Panel Settings User Information" }]
    });
    const allClasses = ref(void 0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_Navbar = Navbar;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({
        name: "panel",
        loading: !unref(allClasses)
      }, _attrs), createSlots({
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Navbar, { links: [{ name: "Uživatelé", path: "/panel/users" }, { name: "student", path: "/panel/users/student" }] }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Navbar, { links: [{ name: "Uživatelé", path: "/panel/users" }, { name: "student", path: "/panel/users/student" }] })
            ];
          }
        }),
        _: 2
      }, [
        unref(allClasses) ? {
          name: "content",
          fn: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div id="specializations" data-v-f456f6bf${_scopeId}><div class="content" data-v-f456f6bf${_scopeId}><div class="line" data-v-f456f6bf${_scopeId}><div class="section-head" data-v-f456f6bf${_scopeId}><h3 data-v-f456f6bf${_scopeId}>Celkem tříd: ${ssrInterpolate(unref(allClasses).length)}</h3><p data-v-f456f6bf${_scopeId}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p></div></div><div class="classes-section" data-v-f456f6bf${_scopeId}><div class="section-head" data-v-f456f6bf${_scopeId}><h4 data-v-f456f6bf${_scopeId}>Třídy</h4>`);
              if (unref(allClasses).length <= 0) {
                _push2(`<p class="error message" data-v-f456f6bf${_scopeId}>Žádná třída nebyla nalezena!</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="classes" data-v-f456f6bf${_scopeId}><!--[-->`);
              ssrRenderList(unref(allClasses), (oneClass) => {
                _push2(ssrRenderComponent(_component_NuxtLink, {
                  class: "class",
                  key: oneClass.id,
                  to: `/panel/users/student/${oneClass.id}`
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="section-head" data-v-f456f6bf${_scopeId2}><span data-v-f456f6bf${_scopeId2}>`);
                      if (oneClass.name) {
                        _push3(`<span class="name" data-v-f456f6bf${_scopeId2}>${ssrInterpolate(oneClass.name + " - ")}</span>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`${ssrInterpolate(oneClass.specialization)}${ssrInterpolate(oneClass.grade)}${ssrInterpolate(oneClass.group)}</span></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "section-head" }, [
                          createVNode("span", null, [
                            oneClass.name ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "name"
                            }, toDisplayString(oneClass.name + " - "), 1)) : createCommentVNode("", true),
                            createTextVNode(toDisplayString(oneClass.specialization) + toDisplayString(oneClass.grade) + toDisplayString(oneClass.group), 1)
                          ])
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
              _push2(ssrRenderComponent(_component_NuxtLink, {
                class: "class",
                to: `/panel/users/student/undefined`
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="section-head" data-v-f456f6bf${_scopeId2}><span data-v-f456f6bf${_scopeId2}>Nezařazené</span></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("span", null, "Nezařazené")
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div></div>`);
              _push2(ssrRenderComponent(__nuxt_component_2, null, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { id: "specializations" }, [
                  createVNode("div", { class: "content" }, [
                    createVNode("div", { class: "line" }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, "Celkem tříd: " + toDisplayString(unref(allClasses).length), 1),
                        createVNode("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
                      ])
                    ]),
                    createVNode("div", { class: "classes-section" }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h4", null, "Třídy"),
                        unref(allClasses).length <= 0 ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "error message"
                        }, "Žádná třída nebyla nalezena!")) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "classes" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(allClasses), (oneClass) => {
                          return openBlock(), createBlock(_component_NuxtLink, {
                            class: "class",
                            key: oneClass.id,
                            to: `/panel/users/student/${oneClass.id}`
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "section-head" }, [
                                createVNode("span", null, [
                                  oneClass.name ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    class: "name"
                                  }, toDisplayString(oneClass.name + " - "), 1)) : createCommentVNode("", true),
                                  createTextVNode(toDisplayString(oneClass.specialization) + toDisplayString(oneClass.grade) + toDisplayString(oneClass.group), 1)
                                ])
                              ])
                            ]),
                            _: 2
                          }, 1032, ["to"]);
                        }), 128)),
                        createVNode(_component_NuxtLink, {
                          class: "class",
                          to: `/panel/users/student/undefined`
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "section-head" }, [
                              createVNode("span", null, "Nezařazené")
                            ])
                          ]),
                          _: 1
                        })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/users/student/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f456f6bf"]]);

export { index as default };
//# sourceMappingURL=index.vue9.mjs.map
