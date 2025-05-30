import { a as __nuxt_component_0, _ as _export_sfc } from './server.mjs';
import __nuxt_component_0$1 from './index2.mjs';
import { u as useAlertsStore, _ as __nuxt_component_2 } from './Alerts.vue.mjs';
import { defineComponent, ref, mergeProps, createSlots, withCtx, unref, createVNode, toDisplayString, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { N as Navbar } from './Navbar.vue.mjs';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import { a as apiFetch } from './apiFetch.mjs';
import { useRoute } from 'vue-router';
import moment from 'moment/moment.js';
import { N as Navigation } from './Navigation.vue.mjs';
import { u as useAccountStore } from './account.mjs';
import { u as useHead } from './v3.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import './nuxt-link.mjs';
import './Loading.vue.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "available",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Panel | Dostupné úkoly",
      meta: [{ name: "description", content: "Panel Homepage" }]
    });
    const route = useRoute();
    const role = route.params.role;
    const usersStore = useAccountStore();
    const alertsStore = useAlertsStore();
    const { getId: userId } = storeToRefs(usersStore);
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
    const loading = ref(false);
    const acceptTask = async (id, from) => {
      loading.value = true;
      if (from === "classTask") {
        await apiFetch("/user_task/add", {
          method: "post",
          body: {
            idTask: id,
            idUser: userId.value
          },
          credentials: "include",
          ignoreResponseError: true,
          headers: { "Content-Type": "application/json" },
          onResponse({ response }) {
            var _a, _b;
            const resCode = (_a = response._data.resCode) == null ? void 0 : _a.toString();
            switch (resCode) {
              case "36010":
                alertsStore.addAlert({ type: "error", title: "Přijetí úkolu", message: "Nebyl zadán id úkolu." });
                break;
              case "36020":
                alertsStore.addAlert({ type: "error", title: "Přijetí úkolu", message: "Nebyl zadán id uživatele." });
                break;
              case "36030":
                alertsStore.addAlert({ type: "error", title: "Přijetí úkolu", message: "Úkol neexistuje." });
                break;
              case "36040":
                alertsStore.addAlert({ type: "error", title: "Přijetí úkolu", message: "Záznam nebyl vytvořen." });
                break;
              case "36051":
                alertsStore.addAlert({ type: "success", title: "Přijetí úkolu", message: "Úkol byl úspěšně přijat a čeká na schválení." });
                allTasks.value = (_b = allTasks.value) == null ? void 0 : _b.filter((task) => task.id !== id);
                break;
              default:
                alertsStore.addAlert({ type: "error", title: "Přijetí úkolu", message: "Nastala neznámá chyba." });
                break;
            }
          },
          onRequestError() {
            alertsStore.addAlert({ type: "error", title: "Přijetí úkolu", message: "Nastala neznámá chyba." });
          }
        }).finally(() => {
          loading.value = false;
        });
        return;
      }
      if (from === "waitingTask") {
        const formData = new FormData();
        formData.append("idTask", id.toString());
        formData.append("idUser", userId.value);
        formData.append("status", "pending");
        await apiFetch("/user_task/update", {
          method: "put",
          body: formData,
          credentials: "include",
          ignoreResponseError: true,
          onResponse({ response }) {
            var _a, _b;
            const resCode = (_a = response._data.resCode) == null ? void 0 : _a.toString();
            switch (resCode) {
              case "38010":
                alertsStore.addAlert({ type: "error", title: "Přijetí úkolu", message: "Nebyl zadán id úkolu." });
                break;
              case "38020":
                alertsStore.addAlert({ type: "error", title: "Přijetí úkolu", message: "Uživatel neexistuje." });
                break;
              case "38030":
                alertsStore.addAlert({ type: "error", title: "Přijetí úkolu", message: "Úkol neexistuje." });
                break;
              case "38040":
                alertsStore.addAlert({ type: "error", title: "Přijetí úkolu", message: "Záznam s uživatelem a úkolem neexistuje." });
                break;
              case "38050":
                alertsStore.addAlert({ type: "error", title: "Přijetí úkolu", message: "Špatný formát souboru (review)." });
                break;
              case "38060":
                alertsStore.addAlert({ type: "error", title: "Přijetí úkolu", message: "Nelze provést tuto akci (review není povoleno)." });
                break;
              case "38070":
                alertsStore.addAlert({ type: "error", title: "Přijetí úkolu", message: "Název souboru (review) je příliš dlouhý." });
                break;
              case "38080":
                alertsStore.addAlert({ type: "error", title: "Přijetí úkolu", message: "Špatný formát souboru (elaboration)." });
                break;
              case "38090":
                alertsStore.addAlert({ type: "error", title: "Přijetí úkolu", message: "Název souboru (elaboration) je příliš dlouhý." });
                break;
              case "38100":
                alertsStore.addAlert({ type: "error", title: "Přijetí úkolu", message: "Nedostatečná oprávnění." });
                break;
              case "38111":
                alertsStore.addAlert({ type: "success", title: "Přijetí úkolu", message: "Úkol byl úspěšně přijat a čeká na schválení." });
                allTasks.value = (_b = allTasks.value) == null ? void 0 : _b.filter((task) => task.id !== id);
                break;
              default:
                alertsStore.addAlert({ type: "error", title: "Přijetí úkolu", message: "Nastala neznámá chyba." });
                break;
            }
          },
          onRequestError() {
            alertsStore.addAlert({ type: "error", title: "Přijetí úkolu", message: "Nastala neznámá chyba." });
          }
        }).finally(() => {
          loading.value = false;
        });
        return;
      }
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
                { name: "Úkoly", path: `/panel/tasks/${unref(role)}` }
              ]
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, {
                links: [
                  { name: "Úkoly", path: `/panel/tasks/${unref(role)}` }
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
              _push2(`<div id="tasks" data-v-734f5e7f${_scopeId}><div class="content" data-v-734f5e7f${_scopeId}><div class="line" data-v-734f5e7f${_scopeId}>`);
              _push2(ssrRenderComponent(Navigation, {
                class: "navigation",
                title: "Úkoly",
                "active-link-id": 1,
                links: [
                  { name: "Aktivní", path: `/panel/tasks/${unref(role)}` },
                  { name: "Dostupné", path: `/panel/tasks/${unref(role)}/available` },
                  { name: "Stav úkolů", path: `/panel/tasks/${unref(role)}/status` },
                  { name: "Vyhodnocené", path: `/panel/tasks/${unref(role)}/evaluated` }
                ]
              }, null, _parent2, _scopeId));
              _push2(`<div class="line" data-v-734f5e7f${_scopeId}><div class="line" data-v-734f5e7f${_scopeId}><div class="section-head" data-v-734f5e7f${_scopeId}><h3 data-v-734f5e7f${_scopeId}>Dostupné úkoly</h3><p data-v-734f5e7f${_scopeId}>tyto úkoly vyžadují potvrzení tvůrce úkolu</p></div><div class="search" data-v-734f5e7f${_scopeId}><input type="text" name="searchInput" placeholder="Hledat úkol"${ssrRenderAttr("value", searchInput.value)} data-v-734f5e7f${_scopeId}>`);
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
                    _push3(`<a${ssrRenderAttr("href", `http://89.203.248.163/uploads/tasks/${data.value.id}/${data.value.task}`)} class="link" download target="_blank" data-v-734f5e7f${_scopeId2}>${ssrInterpolate(data.value.task)}</a>`);
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
                    _push3(`<p data-v-734f5e7f${_scopeId2}>${ssrInterpolate(unref(moment)(data.value.startDate).format("DD.MM. YYYY HH:MM"))}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(unref(moment)(data.value.startDate).format("DD.MM. YYYY HH:MM")), 1)
                    ];
                  }
                }),
                endDate: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p data-v-734f5e7f${_scopeId2}>${ssrInterpolate(unref(moment)(data.value.endDate).format("DD.MM. YYYY HH:MM"))}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(unref(moment)(data.value.endDate).format("DD.MM. YYYY HH:MM")), 1)
                    ];
                  }
                }),
                approve: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p data-v-734f5e7f${_scopeId2}>${ssrInterpolate(data.value.approve ? "Ano" : "Ne")}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(data.value.approve ? "Ano" : "Ne"), 1)
                    ];
                  }
                }),
                actions: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="actions" data-v-734f5e7f${_scopeId2}><button type="button" class="add" data-v-734f5e7f${_scopeId2}>Přijmout</button></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "actions" }, [
                        createVNode("button", {
                          type: "button",
                          class: "add",
                          onClick: ($event) => acceptTask(data.value.id, data.value.from)
                        }, "Přijmout", 8, ["onClick"])
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
                        "active-link-id": 1,
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
                            createVNode("h3", null, "Dostupné úkoly"),
                            createVNode("p", null, "tyto úkoly vyžadují potvrzení tvůrce úkolu")
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
                                class: "add",
                                onClick: ($event) => acceptTask(data.value.id, data.value.from)
                              }, "Přijmout", 8, ["onClick"])
                            ])
                          ]),
                          _: 1
                        }, 8, ["loading", "rows", "columns", "search"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/tasks/[role]/available.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const available = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-734f5e7f"]]);

export { available as default };
//# sourceMappingURL=available.vue.mjs.map
