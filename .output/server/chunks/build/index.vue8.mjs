import { a as __nuxt_component_0, n as navigateTo, _ as _export_sfc } from './server.mjs';
import __nuxt_component_0$1 from './index2.mjs';
import { _ as __nuxt_component_2 } from './Alerts.vue.mjs';
import { defineComponent, ref, mergeProps, createSlots, withCtx, createVNode, unref, toDisplayString, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { N as Navbar } from './Navbar.vue.mjs';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import { A as ActionBar } from './ActionBar.vue.mjs';
import { u as useHead } from './v3.mjs';
import { u as useAccountStore } from './account.mjs';
import moment from 'moment/moment.js';
import { storeToRefs } from 'pinia';
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
import 'vue-router';
import './nuxt-link.mjs';
import './Loading.vue.mjs';
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
      title: "Panel | Úkoly",
      meta: [{ name: "description", content: "Panel Homepage" }]
    });
    const accountStore = useAccountStore();
    const { getId: userId } = storeToRefs(accountStore);
    const cols = ref([
      { field: "id", title: "ID", width: "90px", type: "number" },
      { field: "name", title: "Název", type: "string" },
      { field: "startDate", title: "Začátek", type: "date" },
      { field: "endDate", title: "Konec", type: "date" },
      { field: "approve", title: "Nutné potvrzení", type: "boolean" },
      { field: "task", title: "Zadání", type: "string" },
      { field: "actions", title: "Akce" }
    ]);
    const allTasks = ref(void 0);
    const searchInput = ref("");
    const assignTask = async (id) => {
      if (!id) return;
      await navigateTo(`/panel/tasks/admin/${id}/assign`);
    };
    const openTask = async (id) => {
      if (!id) return;
      await navigateTo(`/panel/tasks/admin/${id}`);
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
            _push2(ssrRenderComponent(Navbar, { links: [
              { name: "Úkoly", path: `/panel/tasks/admin` }
            ] }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, { links: [
                { name: "Úkoly", path: `/panel/tasks/admin` }
              ] })
            ];
          }
        }),
        _: 2
      }, [
        allTasks.value ? {
          name: "content",
          fn: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div id="tasks" data-v-00279ddf${_scopeId}><div class="content" data-v-00279ddf${_scopeId}>`);
              _push2(ssrRenderComponent(ActionBar, {
                class: "action-bar",
                description: "Správa úkolů",
                texts: ["Přidat", "Odebrat"],
                actions: ["add", "remove"],
                icons: [
                  "material-symbols:add-rounded",
                  "material-symbols:delete-rounded"
                ],
                "navigate-to": [
                  `/panel/tasks/admin/add`,
                  `/panel/tasks/admin/remove`
                ]
              }, null, _parent2, _scopeId));
              _push2(`<div class="line" data-v-00279ddf${_scopeId}><div class="line" data-v-00279ddf${_scopeId}><div class="line" data-v-00279ddf${_scopeId}><div class="section-head" data-v-00279ddf${_scopeId}><h3 data-v-00279ddf${_scopeId}>Vytvořené úkoly</h3><p data-v-00279ddf${_scopeId}>Seznam vašich vytvořených úkolů, s kterými můžete pracovat.</p></div><div class="search" data-v-00279ddf${_scopeId}><input type="text" name="searchInput" placeholder="Hledat úkol"${ssrRenderAttr("value", searchInput.value)} data-v-00279ddf${_scopeId}>`);
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
                    _push3(`<a${ssrRenderAttr("href", `http://89.203.248.163/uploads/tasks/${data.value.id}/${data.value.task}`)} class="link" download target="_blank" data-v-00279ddf${_scopeId2}>${ssrInterpolate(data.value.task)}</a>`);
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
                    _push3(`<p data-v-00279ddf${_scopeId2}>${ssrInterpolate(unref(moment)(data.value.startDate).format("DD.MM. YYYY HH:MM"))}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(unref(moment)(data.value.startDate).format("DD.MM. YYYY HH:MM")), 1)
                    ];
                  }
                }),
                endDate: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p data-v-00279ddf${_scopeId2}>${ssrInterpolate(unref(moment)(data.value.endDate).format("DD.MM. YYYY HH:MM"))}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(unref(moment)(data.value.endDate).format("DD.MM. YYYY HH:MM")), 1)
                    ];
                  }
                }),
                approve: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p data-v-00279ddf${_scopeId2}>${ssrInterpolate(data.value.approve ? "Ano" : "Ne")}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(data.value.approve ? "Ano" : "Ne"), 1)
                    ];
                  }
                }),
                actions: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="actions" data-v-00279ddf${_scopeId2}><button type="button" class="default" data-v-00279ddf${_scopeId2}>Otevřít</button><button type="button" class="assign" data-v-00279ddf${_scopeId2}>Přiřadit</button></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "actions" }, [
                        createVNode("button", {
                          type: "button",
                          class: "default",
                          onClick: ($event) => openTask(data.value.id)
                        }, "Otevřít", 8, ["onClick"]),
                        createVNode("button", {
                          type: "button",
                          class: "assign",
                          onClick: ($event) => assignTask(data.value.id)
                        }, "Přiřadit", 8, ["onClick"])
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
                    createVNode(ActionBar, {
                      class: "action-bar",
                      description: "Správa úkolů",
                      texts: ["Přidat", "Odebrat"],
                      actions: ["add", "remove"],
                      icons: [
                        "material-symbols:add-rounded",
                        "material-symbols:delete-rounded"
                      ],
                      "navigate-to": [
                        `/panel/tasks/admin/add`,
                        `/panel/tasks/admin/remove`
                      ]
                    }),
                    createVNode("div", { class: "line" }, [
                      createVNode("div", { class: "line" }, [
                        createVNode("div", { class: "line" }, [
                          createVNode("div", { class: "section-head" }, [
                            createVNode("h3", null, "Vytvořené úkoly"),
                            createVNode("p", null, "Seznam vašich vytvořených úkolů, s kterými můžete pracovat.")
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
                                class: "default",
                                onClick: ($event) => openTask(data.value.id)
                              }, "Otevřít", 8, ["onClick"]),
                              createVNode("button", {
                                type: "button",
                                class: "assign",
                                onClick: ($event) => assignTask(data.value.id)
                              }, "Přiřadit", 8, ["onClick"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/tasks/teacher/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-00279ddf"]]);

export { index as default };
//# sourceMappingURL=index.vue8.mjs.map
