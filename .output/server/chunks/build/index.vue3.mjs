import { a as __nuxt_component_0, _ as _export_sfc } from './server.mjs';
import __nuxt_component_0$1 from './index2.mjs';
import { _ as __nuxt_component_2 } from './Alerts.vue.mjs';
import { defineComponent, ref, mergeProps, createSlots, withCtx, createVNode, unref, toDisplayString, createBlock, createCommentVNode, openBlock, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { N as Navbar } from './Navbar.vue.mjs';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import { A as ActionBar } from './ActionBar.vue.mjs';
import { u as useHead } from './v3.mjs';
import { c as checkPermissions } from './checkPermissions.mjs';
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
import './nuxt-link.mjs';
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
      title: "Panel | Třídy",
      meta: [{ name: "description", content: "Panel Homepage" }]
    });
    const cols = ref([
      { field: "id", title: "ID", width: "90px", type: "number" },
      { field: "name", title: "Název", type: "string" },
      { field: "class", title: "Třída", type: "string" },
      { field: "grade", title: "Ročník", type: "number" },
      { field: "group", title: "Skupina", type: "string" },
      { field: "specialization", title: "Zaměření (zkratka)", type: "string" }
    ]);
    const allClasses = ref(void 0);
    const searchInput = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_Icon = __nuxt_component_0$1;
      const _component_Alerts = __nuxt_component_2;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({
        name: "panel",
        loading: !allClasses.value
      }, _attrs), createSlots({
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Navbar, { links: [
              { name: "Třídy", path: "/panel/classes" }
            ] }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, { links: [
                { name: "Třídy", path: "/panel/classes" }
              ] })
            ];
          }
        }),
        _: 2
      }, [
        allClasses.value ? {
          name: "content",
          fn: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div id="classes" data-v-7d60a524${_scopeId}><div class="content" data-v-7d60a524${_scopeId}>`);
              if (unref(checkPermissions)(["admin"])) {
                _push2(ssrRenderComponent(ActionBar, {
                  class: "action-bar",
                  description: "Správa tříd",
                  texts: ["Přidat", "Odebrat"],
                  actions: ["add", "remove"],
                  icons: [
                    "material-symbols:add-rounded",
                    "material-symbols:delete-rounded"
                  ],
                  "navigate-to": [
                    `/panel/classes/add`,
                    `/panel/classes/remove`
                  ]
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="line" data-v-7d60a524${_scopeId}><div class="section-head" data-v-7d60a524${_scopeId}><h3 data-v-7d60a524${_scopeId}>Všechny třídy</h3><p data-v-7d60a524${_scopeId}>Zde najdete seznam všech tříd v systému.</p></div><div class="search" data-v-7d60a524${_scopeId}><input type="text" name="searchInput" placeholder="Hledat třídy"${ssrRenderAttr("value", searchInput.value)} data-v-7d60a524${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                class: "icon",
                name: "material-symbols:search-rounded"
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
              _push2(ssrRenderComponent(unref(Vue3Datatable), {
                rows: allClasses.value,
                columns: cols.value,
                pageSize: 10,
                sortable: true,
                search: searchInput.value
              }, {
                group: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p data-v-7d60a524${_scopeId2}>${ssrInterpolate(data.value.group)}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(data.value.group), 1)
                    ];
                  }
                }),
                specialization: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p data-v-7d60a524${_scopeId2}>${ssrInterpolate(data.value.specialization)}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(data.value.specialization), 1)
                    ];
                  }
                }),
                class: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p data-v-7d60a524${_scopeId2}>${ssrInterpolate(data.value.specialization)}${ssrInterpolate(data.value.grade)}${ssrInterpolate(data.value.group)}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(data.value.specialization) + toDisplayString(data.value.grade) + toDisplayString(data.value.group), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
              _push2(ssrRenderComponent(_component_Alerts, null, null, _parent2, _scopeId));
            } else {
              return [
                createVNode("div", { id: "classes" }, [
                  createVNode("div", { class: "content" }, [
                    unref(checkPermissions)(["admin"]) ? (openBlock(), createBlock(ActionBar, {
                      key: 0,
                      class: "action-bar",
                      description: "Správa tříd",
                      texts: ["Přidat", "Odebrat"],
                      actions: ["add", "remove"],
                      icons: [
                        "material-symbols:add-rounded",
                        "material-symbols:delete-rounded"
                      ],
                      "navigate-to": [
                        `/panel/classes/add`,
                        `/panel/classes/remove`
                      ]
                    })) : createCommentVNode("", true),
                    createVNode("div", { class: "line" }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, "Všechny třídy"),
                        createVNode("p", null, "Zde najdete seznam všech tříd v systému.")
                      ]),
                      createVNode("div", { class: "search" }, [
                        withDirectives(createVNode("input", {
                          type: "text",
                          name: "searchInput",
                          placeholder: "Hledat třídy",
                          "onUpdate:modelValue": ($event) => searchInput.value = $event
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, searchInput.value]
                        ]),
                        createVNode(_component_Icon, {
                          class: "icon",
                          name: "material-symbols:search-rounded"
                        })
                      ])
                    ]),
                    createVNode(unref(Vue3Datatable), {
                      rows: allClasses.value,
                      columns: cols.value,
                      pageSize: 10,
                      sortable: true,
                      search: searchInput.value
                    }, {
                      group: withCtx((data) => [
                        createVNode("p", null, toDisplayString(data.value.group), 1)
                      ]),
                      specialization: withCtx((data) => [
                        createVNode("p", null, toDisplayString(data.value.specialization), 1)
                      ]),
                      class: withCtx((data) => [
                        createVNode("p", null, toDisplayString(data.value.specialization) + toDisplayString(data.value.grade) + toDisplayString(data.value.group), 1)
                      ]),
                      _: 1
                    }, 8, ["rows", "columns", "search"])
                  ])
                ]),
                createVNode(_component_Alerts)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/classes/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7d60a524"]]);

export { index as default };
//# sourceMappingURL=index.vue3.mjs.map
