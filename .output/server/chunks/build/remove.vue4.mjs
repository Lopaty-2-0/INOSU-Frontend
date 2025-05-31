import { a as __nuxt_component_0, _ as _export_sfc } from './server.mjs';
import __nuxt_component_0$1 from './index2.mjs';
import { u as useAlertsStore, _ as __nuxt_component_2 } from './Alerts.vue.mjs';
import { defineComponent, ref, mergeProps, createSlots, withCtx, createVNode, unref, toDisplayString, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { N as Navbar } from './Navbar.vue.mjs';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import { A as ActionBar } from './ActionBar.vue.mjs';
import { a as apiFetch } from './apiFetch.mjs';
import { u as useAccountStore } from './account.mjs';
import { storeToRefs } from 'pinia';
import moment from 'moment';
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
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import './nuxt-link.mjs';
import './Loading.vue.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "remove",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Panel | Úkoly - Odstranění",
      meta: [{ name: "description", content: "Panel Homepage" }]
    });
    const accountStore = useAccountStore();
    const alertsStore = useAlertsStore();
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
    const loading = ref(false);
    const removeTask = async (id) => {
      if (!id) return;
      loading.value = true;
      await apiFetch("/task/delete", {
        method: "delete",
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          id
        },
        ignoreResponseError: true,
        credentials: "include",
        onResponse({ response }) {
          var _a, _b;
          const resCode = (_a = response._data.resCode) == null ? void 0 : _a.toString();
          switch (resCode) {
            case "28010":
              alertsStore.addAlert({ type: "error", title: "Odstranění úkolu", message: "Studenti nemohou mazat úkoly." });
              break;
            case "28020":
              alertsStore.addAlert({ type: "error", title: "Odstranění úkolu", message: "Chybí ID úkolu." });
              break;
            case "28030":
              alertsStore.addAlert({ type: "error", title: "Odstranění úkolu", message: "Nemáte oprávnění k této akci." });
              break;
            case "28040":
              alertsStore.addAlert({ type: "error", title: "Odstranění úkolu", message: "Úkol nebyl nalezen." });
              break;
            case "28051":
              alertsStore.addAlert({ type: "success", title: "Odstranění úkolu", message: "Úkol byl úspěšně odstraněn." });
              allTasks.value = (_b = allTasks.value) == null ? void 0 : _b.filter((task) => task.id !== id);
              break;
            default:
              alertsStore.addAlert({ type: "error", title: "Odstranění úkolu", message: "Nastala neznámá chyba." });
              break;
          }
        },
        onRequestError() {
          alertsStore.addAlert({ type: "error", title: "Odstranění úkolu", message: "Nastala neznámá chyba." });
        }
      }).finally(() => {
        loading.value = false;
      });
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
              { name: "Úkoly", path: `/panel/tasks/admin` },
              { name: "Odstranění", path: `/panel/tasks/admin/remove` }
            ] }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, { links: [
                { name: "Úkoly", path: `/panel/tasks/admin` },
                { name: "Odstranění", path: `/panel/tasks/admin/remove` }
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
              _push2(`<div id="tasks" data-v-0630a8a3${_scopeId}><div class="content" data-v-0630a8a3${_scopeId}>`);
              _push2(ssrRenderComponent(ActionBar, {
                class: "action-bar",
                description: "Správa úkolů",
                texts: ["Přidat", "Odebrat"],
                actions: ["add", "remove"],
                icons: [
                  "material-symbols:add-rounded",
                  "material-symbols:delete-rounded"
                ],
                active: 1,
                "navigate-to": [
                  `/panel/tasks/admin/add`,
                  `/panel/tasks/admin/remove`
                ]
              }, null, _parent2, _scopeId));
              _push2(`<div class="line" data-v-0630a8a3${_scopeId}><div class="section-head" data-v-0630a8a3${_scopeId}><h3 data-v-0630a8a3${_scopeId}>Odstranění vašich úkolů</h3><p data-v-0630a8a3${_scopeId}>Zde můžete odstranit úkoly, které jste vytvořili. Vyberte úkol ze seznamu a klikněte na tlačítko Odebrat.</p></div><div class="search" data-v-0630a8a3${_scopeId}><input type="text" name="searchInput" placeholder="Hledat úkol"${ssrRenderAttr("value", searchInput.value)} data-v-0630a8a3${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                class: "icon",
                name: "material-symbols:search-rounded"
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
              _push2(ssrRenderComponent(unref(Vue3Datatable), {
                loading: loading.value,
                rows: allTasks.value,
                columns: cols.value,
                pageSize: 10,
                sortable: true,
                search: searchInput.value
              }, {
                task: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<a${ssrRenderAttr("href", `http://89.203.248.163/uploads/tasks/${data.value.id}/${data.value.task}`)} class="link" download target="_blank" data-v-0630a8a3${_scopeId2}>${ssrInterpolate(data.value.task)}</a>`);
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
                    _push3(`<p data-v-0630a8a3${_scopeId2}>${ssrInterpolate(unref(moment)(data.value.startDate).format("DD.MM. YYYY HH:MM"))}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(unref(moment)(data.value.startDate).format("DD.MM. YYYY HH:MM")), 1)
                    ];
                  }
                }),
                endDate: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p data-v-0630a8a3${_scopeId2}>${ssrInterpolate(unref(moment)(data.value.endDate).format("DD.MM. YYYY HH:MM"))}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(unref(moment)(data.value.endDate).format("DD.MM. YYYY HH:MM")), 1)
                    ];
                  }
                }),
                approve: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p data-v-0630a8a3${_scopeId2}>${ssrInterpolate(data.value.approve ? "Ano" : "Ne")}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(data.value.approve ? "Ano" : "Ne"), 1)
                    ];
                  }
                }),
                actions: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="actions" data-v-0630a8a3${_scopeId2}><button type="button" class="remove" data-v-0630a8a3${_scopeId2}>Odebrat</button></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "actions" }, [
                        createVNode("button", {
                          type: "button",
                          class: "remove",
                          onClick: ($event) => removeTask(data.value.id)
                        }, "Odebrat", 8, ["onClick"])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
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
                      active: 1,
                      "navigate-to": [
                        `/panel/tasks/admin/add`,
                        `/panel/tasks/admin/remove`
                      ]
                    }),
                    createVNode("div", { class: "line" }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, "Odstranění vašich úkolů"),
                        createVNode("p", null, "Zde můžete odstranit úkoly, které jste vytvořili. Vyberte úkol ze seznamu a klikněte na tlačítko Odebrat.")
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
                      loading: loading.value,
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
                            class: "remove",
                            onClick: ($event) => removeTask(data.value.id)
                          }, "Odebrat", 8, ["onClick"])
                        ])
                      ]),
                      _: 1
                    }, 8, ["loading", "rows", "columns", "search"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/tasks/teacher/remove.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const remove = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0630a8a3"]]);

export { remove as default };
//# sourceMappingURL=remove.vue4.mjs.map
