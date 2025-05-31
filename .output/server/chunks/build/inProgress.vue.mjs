import { a as __nuxt_component_0, n as navigateTo, _ as _export_sfc } from './server.mjs';
import __nuxt_component_0$1 from './index2.mjs';
import { _ as __nuxt_component_2 } from './Alerts.vue.mjs';
import { defineComponent, ref, mergeProps, createSlots, withCtx, unref, createVNode, toDisplayString, createTextVNode, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { N as Navbar } from './Navbar.vue.mjs';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import { A as ActionBar } from './ActionBar.vue.mjs';
import { u as useHead } from './v3.mjs';
import { useRoute, useRouter } from 'vue-router';
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
  __name: "inProgress",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const taskId = route.params.taskId;
    useHead({
      title: "Panel | Rozpracované - " + taskId,
      meta: [{ name: "description", content: "Panel Homepage" }]
    });
    const task = ref(void 0);
    const loading = ref(false);
    const cols = ref([
      { field: "id", title: "ID", width: "90px", type: "number" },
      { field: "name", title: "Autor", type: "string" },
      { field: "abbreviation", title: "Zkratka", type: "date" },
      { field: "email", title: "E-mail", type: "string" },
      { field: "actions", title: "Akce" }
    ]);
    const pendingUsers = ref(void 0);
    const searchInput = ref("");
    const openUserTask = async (id) => {
      if (!id) return;
      await navigateTo(`/panel/tasks/admin/${taskId}/${id}`);
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
                { name: "Rozpracované", path: `/panel/tasks/admin/${unref(taskId)}/inProgress` }
              ]
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, {
                links: [
                  { name: "Úkoly", path: `/panel/tasks/admin` },
                  { name: "Rozpracované", path: `/panel/tasks/admin/${unref(taskId)}/inProgress` }
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
              _push2(`<div id="tasks" data-v-294f5c6c${_scopeId}><div class="content" data-v-294f5c6c${_scopeId}>`);
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
              _push2(`<div class="line" data-v-294f5c6c${_scopeId}>`);
              _push2(ssrRenderComponent(Navigation, {
                class: "navigation",
                title: "Úkoly",
                "active-link-id": 1,
                links: [
                  { name: "Žádosti", path: `/panel/tasks/admin/${unref(taskId)}` },
                  { name: "Rozpracované", path: `/panel/tasks/admin/${unref(taskId)}/inProgress` },
                  { name: "Vypracované", path: `/panel/tasks/admin/${unref(taskId)}/done` }
                ]
              }, null, _parent2, _scopeId));
              _push2(`<div class="line" data-v-294f5c6c${_scopeId}><div class="line" data-v-294f5c6c${_scopeId}><div class="section-head" data-v-294f5c6c${_scopeId}><div class="section-head" data-v-294f5c6c${_scopeId}><h3 data-v-294f5c6c${_scopeId}>Rozpracovaný úkol</h3><p data-v-294f5c6c${_scopeId}>Úkol ID: ${ssrInterpolate(task.value.id)}</p><p data-v-294f5c6c${_scopeId}>Název: ${ssrInterpolate(task.value.name)}</p><p data-v-294f5c6c${_scopeId}>Garant ID: ${ssrInterpolate(task.value.guarantor)}</p><p data-v-294f5c6c${_scopeId}>Začátek: ${ssrInterpolate(unref(moment)(task.value.startDate).format("DD.MM. YYYY HH:MM"))}</p><p data-v-294f5c6c${_scopeId}>Konec: ${ssrInterpolate(unref(moment)(task.value.endDate).format("DD.MM. YYYY HH:MM"))}</p><p data-v-294f5c6c${_scopeId}>Nutné potvrzení: ${ssrInterpolate(task.value.approve ? "Ano" : "Ne")}</p><p data-v-294f5c6c${_scopeId}> Zadání: <a${ssrRenderAttr("href", `http://89.203.248.163/uploads/tasks/${task.value.id}/${task.value.task}`)} class="link" download target="_blank" data-v-294f5c6c${_scopeId}>${ssrInterpolate(task.value.task)}</a></p></div></div><div class="search" data-v-294f5c6c${_scopeId}><input type="text" name="searchInput" placeholder="Hledat uživatele"${ssrRenderAttr("value", searchInput.value)} data-v-294f5c6c${_scopeId}>`);
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
                    _push3(`<div class="profile" data-v-294f5c6c${_scopeId2}><img${ssrRenderAttr("src", "http://89.203.248.163/uploads/profilePictures/" + data.value.profilePicture)} alt="User profile photo" loading="lazy" data-v-294f5c6c${_scopeId2}><p data-v-294f5c6c${_scopeId2}>${ssrInterpolate(data.value.name)} ${ssrInterpolate(data.value.surname)}</p></div>`);
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
                    _push3(`<p class="uppercase" data-v-294f5c6c${_scopeId2}>${ssrInterpolate(data.value.abbreviation || "Není")}</p>`);
                  } else {
                    return [
                      createVNode("p", { class: "uppercase" }, toDisplayString(data.value.abbreviation || "Není"), 1)
                    ];
                  }
                }),
                actions: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="actions" data-v-294f5c6c${_scopeId2}><button type="button" class="primary" data-v-294f5c6c${_scopeId2}>Otevřít</button></div>`);
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
                        "active-link-id": 1,
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
                              createVNode("h3", null, "Rozpracovaný úkol"),
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
                                class: "primary",
                                onClick: ($event) => openUserTask(data.value.id)
                              }, "Otevřít", 8, ["onClick"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/tasks/admin/[taskId]/inProgress.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const inProgress = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-294f5c6c"]]);

export { inProgress as default };
//# sourceMappingURL=inProgress.vue.mjs.map
