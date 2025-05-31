import { a as __nuxt_component_0, n as navigateTo, _ as _export_sfc } from './server.mjs';
import __nuxt_component_0$1 from './index2.mjs';
import { _ as __nuxt_component_2 } from './Alerts.vue.mjs';
import { defineComponent, ref, mergeProps, createSlots, withCtx, unref, createVNode, toDisplayString, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { N as Navbar } from './Navbar.vue.mjs';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import { u as useHead } from './v3.mjs';
import { useRoute } from 'vue-router';
import moment from 'moment/moment.js';
import { N as Navigation } from './Navigation.vue.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import './nuxt-link.mjs';
import './Loading.vue.mjs';
import './account.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "evaluated",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Panel | Vyhodnocené úkoly",
      meta: [{ name: "description", content: "Panel Homepage" }]
    });
    const route = useRoute();
    const role = route.params.role;
    const cols = ref([
      { field: "id", title: "ID", width: "90px", type: "number" },
      { field: "name", title: "Název", type: "string" },
      { field: "startDate", title: "Začátek", type: "date" },
      { field: "endDate", title: "Konec", type: "date" },
      { field: "task", title: "Zadání", type: "string" },
      { field: "actions", title: "Akce" }
    ]);
    const allTasks = ref(void 0);
    const searchInput = ref("");
    const openUserTask = async (id) => {
      if (!id) return;
      await navigateTo(`/panel/tasks/${role}/${id}`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_Icon = __nuxt_component_0$1;
      const _component_Alerts = __nuxt_component_2;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({
        name: "panel",
        loading: !allTasks.value
      }, _attrs), createSlots({
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Navbar, {
              links: [
                { name: "Úkoly", path: `/panel/tasks/${unref(role)}` },
                { name: "Vyhodnocené", path: `/panel/tasks/${unref(role)}/evaluated` }
              ]
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, {
                links: [
                  { name: "Úkoly", path: `/panel/tasks/${unref(role)}` },
                  { name: "Vyhodnocené", path: `/panel/tasks/${unref(role)}/evaluated` }
                ]
              }, null, 8, ["links"])
            ];
          }
        }),
        _: 2
      }, [
        allTasks.value ? {
          name: "content",
          fn: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div id="tasks" data-v-d1f4d0d0${_scopeId}><div class="content" data-v-d1f4d0d0${_scopeId}><div class="line" data-v-d1f4d0d0${_scopeId}>`);
              _push2(ssrRenderComponent(Navigation, {
                class: "navigation",
                title: "Úkoly",
                "active-link-id": 3,
                links: [
                  { name: "Aktivní", path: `/panel/tasks/${unref(role)}` },
                  { name: "Dostupné", path: `/panel/tasks/${unref(role)}/available` },
                  { name: "Stav úkolů", path: `/panel/tasks/${unref(role)}/status` },
                  { name: "Vyhodnocené", path: `/panel/tasks/${unref(role)}/evaluated` }
                ]
              }, null, _parent2, _scopeId));
              _push2(`<div class="line" data-v-d1f4d0d0${_scopeId}><div class="line" data-v-d1f4d0d0${_scopeId}><div class="section-head" data-v-d1f4d0d0${_scopeId}><h3 data-v-d1f4d0d0${_scopeId}>Vyhodnocené úkoly</h3><p data-v-d1f4d0d0${_scopeId}>Zde naleznete seznam všech úkolů, které již byly vyhodnoceny.</p></div><div class="search" data-v-d1f4d0d0${_scopeId}><input type="text" name="searchInput" placeholder="Hledat úkol"${ssrRenderAttr("value", searchInput.value)} data-v-d1f4d0d0${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                class: "icon",
                name: "material-symbols:search-rounded"
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
              _push2(ssrRenderComponent(unref(Vue3Datatable), {
                rows: allTasks.value,
                columns: cols.value,
                pageSize: 10,
                sortable: true,
                search: searchInput.value
              }, {
                task: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<a${ssrRenderAttr("href", `http://89.203.248.163/uploads/tasks/${data.value.id}/${data.value.task}`)} class="link" download target="_blank" data-v-d1f4d0d0${_scopeId2}>${ssrInterpolate(data.value.task)}</a>`);
                  } else {
                    return [
                      createVNode("a", {
                        href: `http://89.203.248.163/uploads/tasks/${data.value.id}/${data.value.task}`,
                        class: "link",
                        download: "",
                        target: "_blank"
                      }, toDisplayString(data.value.task), 9, ["href"])
                    ];
                  }
                }),
                startDate: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p data-v-d1f4d0d0${_scopeId2}>${ssrInterpolate(unref(moment)(data.value.startDate).format("DD.MM. YYYY HH:MM"))}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(unref(moment)(data.value.startDate).format("DD.MM. YYYY HH:MM")), 1)
                    ];
                  }
                }),
                endDate: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p data-v-d1f4d0d0${_scopeId2}>${ssrInterpolate(unref(moment)(data.value.endDate).format("DD.MM. YYYY HH:MM"))}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(unref(moment)(data.value.endDate).format("DD.MM. YYYY HH:MM")), 1)
                    ];
                  }
                }),
                approve: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p data-v-d1f4d0d0${_scopeId2}>${ssrInterpolate(data.value.approve ? "Ano" : "Ne")}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(data.value.approve ? "Ano" : "Ne"), 1)
                    ];
                  }
                }),
                actions: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="actions" data-v-d1f4d0d0${_scopeId2}><button type="button" class="primary" data-v-d1f4d0d0${_scopeId2}>Otevřít</button></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "actions" }, [
                        createVNode("button", {
                          type: "button",
                          class: "primary",
                          onClick: ($event) => openUserTask(data.value.id)
                        }, "Otevřít", 8, ["onClick"])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div></div></div>`);
              _push2(ssrRenderComponent(_component_Alerts, null, null, _parent2, _scopeId));
            } else {
              return [
                createVNode("div", { id: "tasks" }, [
                  createVNode("div", { class: "content" }, [
                    createVNode("div", { class: "line" }, [
                      createVNode(Navigation, {
                        class: "navigation",
                        title: "Úkoly",
                        "active-link-id": 3,
                        links: [
                          { name: "Aktivní", path: `/panel/tasks/${unref(role)}` },
                          { name: "Dostupné", path: `/panel/tasks/${unref(role)}/available` },
                          { name: "Stav úkolů", path: `/panel/tasks/${unref(role)}/status` },
                          { name: "Vyhodnocené", path: `/panel/tasks/${unref(role)}/evaluated` }
                        ]
                      }, null, 8, ["links"]),
                      createVNode("div", { class: "line" }, [
                        createVNode("div", { class: "line" }, [
                          createVNode("div", { class: "section-head" }, [
                            createVNode("h3", null, "Vyhodnocené úkoly"),
                            createVNode("p", null, "Zde naleznete seznam všech úkolů, které již byly vyhodnoceny.")
                          ]),
                          createVNode("div", { class: "search" }, [
                            withDirectives(createVNode("input", {
                              type: "text",
                              name: "searchInput",
                              placeholder: "Hledat úkol",
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
                          rows: allTasks.value,
                          columns: cols.value,
                          pageSize: 10,
                          sortable: true,
                          search: searchInput.value
                        }, {
                          task: withCtx((data) => [
                            createVNode("a", {
                              href: `http://89.203.248.163/uploads/tasks/${data.value.id}/${data.value.task}`,
                              class: "link",
                              download: "",
                              target: "_blank"
                            }, toDisplayString(data.value.task), 9, ["href"])
                          ]),
                          startDate: withCtx((data) => [
                            createVNode("p", null, toDisplayString(unref(moment)(data.value.startDate).format("DD.MM. YYYY HH:MM")), 1)
                          ]),
                          endDate: withCtx((data) => [
                            createVNode("p", null, toDisplayString(unref(moment)(data.value.endDate).format("DD.MM. YYYY HH:MM")), 1)
                          ]),
                          approve: withCtx((data) => [
                            createVNode("p", null, toDisplayString(data.value.approve ? "Ano" : "Ne"), 1)
                          ]),
                          actions: withCtx((data) => [
                            createVNode("div", { class: "actions" }, [
                              createVNode("button", {
                                type: "button",
                                class: "primary",
                                onClick: ($event) => openUserTask(data.value.id)
                              }, "Otevřít", 8, ["onClick"])
                            ])
                          ]),
                          _: 1
                        }, 8, ["rows", "columns", "search"])
                      ])
                    ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/tasks/[role]/evaluated.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const evaluated = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d1f4d0d0"]]);

export { evaluated as default };
//# sourceMappingURL=evaluated.vue.mjs.map
