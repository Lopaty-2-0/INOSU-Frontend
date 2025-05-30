import { a as __nuxt_component_0, _ as _export_sfc } from './server.mjs';
import __nuxt_component_0$1 from './index2.mjs';
import { u as useAlertsStore, _ as __nuxt_component_2 } from './Alerts.vue.mjs';
import { defineComponent, ref, mergeProps, createSlots, withCtx, unref, createVNode, toDisplayString, createTextVNode, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { N as Navbar } from './Navbar.vue.mjs';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import { A as ActionBar } from './ActionBar.vue.mjs';
import { a as apiFetch } from './apiFetch.mjs';
import { useRoute, useRouter } from 'vue-router';
import moment from 'moment/moment.js';
import { N as Navigation } from './Navigation.vue.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const taskId = route.params.taskId;
    useHead({
      title: "Panel | Žádosti o úkol - " + taskId,
      meta: [{ name: "description", content: "Panel Homepage" }]
    });
    const alertsStore = useAlertsStore();
    const task = ref(void 0);
    const loading = ref(false);
    const cols = ref([
      { field: "id", title: "ID", width: "90px", type: "number" },
      { field: "name", title: "Žadatel", type: "string" },
      { field: "abbreviation", title: "Zkratka", type: "date" },
      { field: "email", title: "E-mail", type: "string" },
      { field: "actions", title: "Akce" }
    ]);
    const pendingUsers = ref(void 0);
    const searchInput = ref("");
    const acceptTask = async (id) => {
      loading.value = true;
      const formData = new FormData();
      formData.append("idTask", taskId);
      formData.append("idUser", id.toString());
      formData.append("status", "approved");
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
              alertsStore.addAlert({ type: "error", title: "Potvrzení úkolu", message: "Nebyl zadán id úkolu." });
              break;
            case "38020":
              alertsStore.addAlert({ type: "error", title: "Potvrzení úkolu", message: "Uživatel neexistuje." });
              break;
            case "38030":
              alertsStore.addAlert({ type: "error", title: "Potvrzení úkolu", message: "Úkol neexistuje." });
              break;
            case "38040":
              alertsStore.addAlert({ type: "error", title: "Potvrzení úkolu", message: "Záznam s uživatelem a úkolem neexistuje." });
              break;
            case "38050":
              alertsStore.addAlert({ type: "error", title: "Potvrzení úkolu", message: "Špatný formát souboru (review)." });
              break;
            case "38060":
              alertsStore.addAlert({ type: "error", title: "Potvrzení úkolu", message: "Nelze provést tuto akci (review lze nahrát jen u schváleného úkolu)." });
              break;
            case "38070":
              alertsStore.addAlert({ type: "error", title: "Potvrzení úkolu", message: "Název souboru (review) je příliš dlouhý." });
              break;
            case "38100":
              alertsStore.addAlert({ type: "error", title: "Potvrzení úkolu", message: "Nemáte oprávnění." });
              break;
            case "38111":
              alertsStore.addAlert({ type: "success", title: "Potvrzení úkolu", message: "Úkol byl úspěšně potvrzen." });
              pendingUsers.value = (_b = pendingUsers.value) == null ? void 0 : _b.filter((user) => Number(user.id) !== id);
              break;
            default:
              alertsStore.addAlert({ type: "error", title: "Potvrzení úkolu", message: "Nastala neznámá chyba." });
              break;
          }
        },
        onRequestError() {
          alertsStore.addAlert({ type: "error", title: "Potvrzení úkolu", message: "Nastala neznámá chyba při odesílání požadavku." });
        }
      }).finally(() => {
        loading.value = false;
      });
    };
    const denyTask = async (id) => {
      loading.value = true;
      const formData = new FormData();
      formData.append("idTask", taskId);
      formData.append("idUser", id.toString());
      formData.append("status", "rejected");
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
              alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Nebyl zadán id úkolu." });
              break;
            case "38020":
              alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Uživatel neexistuje." });
              break;
            case "38030":
              alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Úkol neexistuje." });
              break;
            case "38040":
              alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Záznam user_task neexistuje." });
              break;
            case "38050":
              alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Špatný formát souboru (review)." });
              break;
            case "38060":
              alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Nelze provést tuto akci (review lze nahrát jen u schváleného úkolu)." });
              break;
            case "38070":
              alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Název souboru (review) je příliš dlouhý." });
              break;
            case "38080":
              alertsStore.addAlert({ type: "error", title: "Vypracování", message: "Špatný formát souboru (elaboration)." });
              break;
            case "38090":
              alertsStore.addAlert({ type: "error", title: "Vypracování", message: "Název souboru (elaboration) je příliš dlouhý." });
              break;
            case "38100":
              alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Nemáte oprávnění." });
              break;
            case "38111":
              alertsStore.addAlert({ type: "success", title: "Hodnocení", message: "Hodnocení bylo úspěšně aktualizováno." });
              pendingUsers.value = (_b = pendingUsers.value) == null ? void 0 : _b.filter((user) => Number(user.id) !== id);
              break;
            default:
              alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Nastala neznámá chyba." });
              break;
          }
        },
        onRequestError() {
          alertsStore.addAlert({ type: "error", title: "Zamítnutí úkolu", message: "Nastala neznámá chyba při odesílání požadavku." });
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
        loading: !pendingUsers.value || !task.value
      }, _attrs), createSlots({
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Navbar, {
              links: [
                { name: "Úkoly", path: `/panel/tasks/admin` },
                { name: "Žádosti", path: `/panel/tasks/admin/${unref(taskId)}` }
              ]
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, {
                links: [
                  { name: "Úkoly", path: `/panel/tasks/admin` },
                  { name: "Žádosti", path: `/panel/tasks/admin/${unref(taskId)}` }
                ]
              }, null, 8, ["links"])
            ];
          }
        }),
        _: 2
      }, [
        pendingUsers.value && task.value ? {
          name: "content",
          fn: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div id="tasks" data-v-3ba40ac1${_scopeId}><div class="content" data-v-3ba40ac1${_scopeId}>`);
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
              _push2(`<div class="line" data-v-3ba40ac1${_scopeId}>`);
              _push2(ssrRenderComponent(Navigation, {
                class: "navigation",
                title: "Úkoly",
                "active-link-id": 0,
                links: [
                  { name: "Žádosti", path: `/panel/tasks/admin/${unref(taskId)}` },
                  { name: "Rozpracované", path: `/panel/tasks/admin/${unref(taskId)}/inProgress` },
                  { name: "Vypracované", path: `/panel/tasks/admin/${unref(taskId)}/done` }
                ]
              }, null, _parent2, _scopeId));
              _push2(`<div class="line" data-v-3ba40ac1${_scopeId}><div class="line" data-v-3ba40ac1${_scopeId}><div class="section-head" data-v-3ba40ac1${_scopeId}><div class="section-head" data-v-3ba40ac1${_scopeId}><h3 data-v-3ba40ac1${_scopeId}>Žádosti o úkol</h3><p data-v-3ba40ac1${_scopeId}>Úkol ID: ${ssrInterpolate(task.value.id)}</p><p data-v-3ba40ac1${_scopeId}>Název: ${ssrInterpolate(task.value.name)}</p><p data-v-3ba40ac1${_scopeId}>Garant ID: ${ssrInterpolate(task.value.guarantor)}</p><p data-v-3ba40ac1${_scopeId}>Začátek: ${ssrInterpolate(unref(moment)(task.value.startDate).format("DD.MM. YYYY HH:MM"))}</p><p data-v-3ba40ac1${_scopeId}>Konec: ${ssrInterpolate(unref(moment)(task.value.endDate).format("DD.MM. YYYY HH:MM"))}</p><p data-v-3ba40ac1${_scopeId}>Nutné potvrzení: ${ssrInterpolate(task.value.approve ? "Ano" : "Ne")}</p><p data-v-3ba40ac1${_scopeId}> Zadání: <a${ssrRenderAttr("href", `http://89.203.248.163/uploads/tasks/${task.value.id}/${task.value.task}`)} class="link" download target="_blank" data-v-3ba40ac1${_scopeId}>${ssrInterpolate(task.value.task)}</a></p></div></div><div class="search" data-v-3ba40ac1${_scopeId}><input type="text" name="searchInput" placeholder="Hledat uživatele"${ssrRenderAttr("value", searchInput.value)} data-v-3ba40ac1${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                class: "icon",
                name: "material-symbols:search-rounded"
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
              _push2(ssrRenderComponent(unref(Vue3Datatable), {
                loading: loading.value,
                rows: pendingUsers.value,
                columns: cols.value,
                pageSize: 10,
                sortable: true,
                search: searchInput.value
              }, {
                name: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="profile" data-v-3ba40ac1${_scopeId2}><img${ssrRenderAttr("src", "http://89.203.248.163/uploads/profilePictures/" + data.value.profilePicture)} alt="User profile photo" loading="lazy" data-v-3ba40ac1${_scopeId2}><p data-v-3ba40ac1${_scopeId2}>${ssrInterpolate(data.value.name)} ${ssrInterpolate(data.value.surname)}</p></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "profile" }, [
                        createVNode("img", {
                          src: "http://89.203.248.163/uploads/profilePictures/" + data.value.profilePicture,
                          alt: "User profile photo",
                          loading: "lazy"
                        }, null, 8, ["src"]),
                        createVNode("p", null, toDisplayString(data.value.name) + " " + toDisplayString(data.value.surname), 1)
                      ])
                    ];
                  }
                }),
                abbreviation: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p class="uppercase" data-v-3ba40ac1${_scopeId2}>${ssrInterpolate(data.value.abbreviation || "Není")}</p>`);
                  } else {
                    return [
                      createVNode("p", { class: "uppercase" }, toDisplayString(data.value.abbreviation || "Není"), 1)
                    ];
                  }
                }),
                actions: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="actions" data-v-3ba40ac1${_scopeId2}><button type="button" class="accept" data-v-3ba40ac1${_scopeId2}>Přijmout</button><button type="button" class="deny" data-v-3ba40ac1${_scopeId2}>Zamítnout</button></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "actions" }, [
                        createVNode("button", {
                          type: "button",
                          class: "accept",
                          onClick: ($event) => acceptTask(data.value.id)
                        }, "Přijmout", 8, ["onClick"]),
                        createVNode("button", {
                          type: "button",
                          class: "deny",
                          onClick: ($event) => denyTask(data.value.id)
                        }, "Zamítnout", 8, ["onClick"])
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
                      createVNode(Navigation, {
                        class: "navigation",
                        title: "Úkoly",
                        "active-link-id": 0,
                        links: [
                          { name: "Žádosti", path: `/panel/tasks/admin/${unref(taskId)}` },
                          { name: "Rozpracované", path: `/panel/tasks/admin/${unref(taskId)}/inProgress` },
                          { name: "Vypracované", path: `/panel/tasks/admin/${unref(taskId)}/done` }
                        ]
                      }, null, 8, ["links"]),
                      createVNode("div", { class: "line" }, [
                        createVNode("div", { class: "line" }, [
                          createVNode("div", { class: "section-head" }, [
                            createVNode("div", { class: "section-head" }, [
                              createVNode("h3", null, "Žádosti o úkol"),
                              createVNode("p", null, "Úkol ID: " + toDisplayString(task.value.id), 1),
                              createVNode("p", null, "Název: " + toDisplayString(task.value.name), 1),
                              createVNode("p", null, "Garant ID: " + toDisplayString(task.value.guarantor), 1),
                              createVNode("p", null, "Začátek: " + toDisplayString(unref(moment)(task.value.startDate).format("DD.MM. YYYY HH:MM")), 1),
                              createVNode("p", null, "Konec: " + toDisplayString(unref(moment)(task.value.endDate).format("DD.MM. YYYY HH:MM")), 1),
                              createVNode("p", null, "Nutné potvrzení: " + toDisplayString(task.value.approve ? "Ano" : "Ne"), 1),
                              createVNode("p", null, [
                                createTextVNode(" Zadání: "),
                                createVNode("a", {
                                  href: `http://89.203.248.163/uploads/tasks/${task.value.id}/${task.value.task}`,
                                  class: "link",
                                  download: "",
                                  target: "_blank"
                                }, toDisplayString(task.value.task), 9, ["href"])
                              ])
                            ])
                          ]),
                          createVNode("div", { class: "search" }, [
                            withDirectives(createVNode("input", {
                              type: "text",
                              name: "searchInput",
                              placeholder: "Hledat uživatele",
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
                          rows: pendingUsers.value,
                          columns: cols.value,
                          pageSize: 10,
                          sortable: true,
                          search: searchInput.value
                        }, {
                          name: withCtx((data) => [
                            createVNode("div", { class: "profile" }, [
                              createVNode("img", {
                                src: "http://89.203.248.163/uploads/profilePictures/" + data.value.profilePicture,
                                alt: "User profile photo",
                                loading: "lazy"
                              }, null, 8, ["src"]),
                              createVNode("p", null, toDisplayString(data.value.name) + " " + toDisplayString(data.value.surname), 1)
                            ])
                          ]),
                          abbreviation: withCtx((data) => [
                            createVNode("p", { class: "uppercase" }, toDisplayString(data.value.abbreviation || "Není"), 1)
                          ]),
                          actions: withCtx((data) => [
                            createVNode("div", { class: "actions" }, [
                              createVNode("button", {
                                type: "button",
                                class: "accept",
                                onClick: ($event) => acceptTask(data.value.id)
                              }, "Přijmout", 8, ["onClick"]),
                              createVNode("button", {
                                type: "button",
                                class: "deny",
                                onClick: ($event) => denyTask(data.value.id)
                              }, "Zamítnout", 8, ["onClick"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/tasks/admin/[taskId]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3ba40ac1"]]);

export { index as default };
//# sourceMappingURL=index.vue12.mjs.map
