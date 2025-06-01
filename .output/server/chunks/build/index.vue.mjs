import { a as __nuxt_component_0, n as navigateTo, _ as _export_sfc } from './server.mjs';
import __nuxt_component_0$1 from './index2.mjs';
import { defineComponent, ref, computed, mergeProps, createSlots, withCtx, createVNode, unref, toDisplayString, createBlock, openBlock, Fragment, renderList, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { N as Navbar } from './Navbar.vue.mjs';
import { u as useHead } from './v3.mjs';
import moment from 'moment';
import { N as Navigation } from './Navigation.vue.mjs';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import { u as useAccountStore } from './account.mjs';
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
      title: "Panel | Domů",
      meta: [{ name: "description", content: "Panel Homepage" }]
    });
    const accountStore = useAccountStore();
    const { getRole: role, getId: userId } = storeToRefs(accountStore);
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
    const numbers = ref({
      students: null,
      classes: null,
      teachers: null
    });
    const navigationLinks = computed(() => {
      if (["admin", "teacher"].includes(role.value)) {
        return [
          { name: "Vytvořené úkoly", path: `/panel/tasks/${role.value}` },
          { name: "Žáci", path: `/panel/users/student` },
          { name: "Změna hesla", path: `/panel/settings/security` }
        ];
      }
      return [
        { name: "Aktivní úkoly", path: `/panel/tasks/${role.value}` },
        { name: "Učitelé", path: `/panel/users/teacher` },
        { name: "Změna hesla", path: `/panel/settings/security` },
        { name: "Vyhodnocené úkoly", path: `/panel/tasks/${role.value}/evaluated` }
      ];
    });
    const infoCards = computed(() => [
      {
        title: "Počet studentů",
        icon: "material-symbols:supervisor-account-rounded",
        value: numbers.value.students || 0
      },
      {
        title: "Počet tříd",
        icon: "material-symbols:flight-class-rounded",
        value: numbers.value.classes || 0
      },
      {
        title: "Počet učitelů",
        icon: "material-symbols:supervisor-account-rounded",
        value: numbers.value.teachers || 0
      }
    ]);
    const openTask = async (id) => {
      if (!id) return;
      await navigateTo(`/panel/tasks/${role.value}/${id}`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_Icon = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({
        name: "panel",
        loading: numbers.value.students === null || !numbers.value.classes === null || numbers.value.teachers === null || !allTasks.value
      }, _attrs), createSlots({
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Navbar, { links: [
              { name: "Domů", path: "/panel" }
            ] }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, { links: [
                { name: "Domů", path: "/panel" }
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
              _push2(`<div id="home" data-v-acaad1c5${_scopeId}><div class="info" data-v-acaad1c5${_scopeId}><div class="line" data-v-acaad1c5${_scopeId}><div class="section-head" data-v-acaad1c5${_scopeId}><h3 data-v-acaad1c5${_scopeId}>Informativní karty</h3><p data-v-acaad1c5${_scopeId}>Informativní karty slouží k rychlému nalezení zajímavých údajů z panelu.</p></div></div><ul class="cards" data-v-acaad1c5${_scopeId}><!--[-->`);
              ssrRenderList(unref(infoCards), (data, index) => {
                _push2(`<li class="card" data-v-acaad1c5${_scopeId}><div class="content" data-v-acaad1c5${_scopeId}><div class="data" data-v-acaad1c5${_scopeId}><h6 data-v-acaad1c5${_scopeId}>${ssrInterpolate(data.title)}</h6><p data-v-acaad1c5${_scopeId}>${ssrInterpolate(data.value)}</p></div>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  class: "icon",
                  name: data.icon
                }, null, _parent2, _scopeId));
                _push2(`</div></li>`);
              });
              _push2(`<!--]--></ul></div><div class="line" data-v-acaad1c5${_scopeId}>`);
              _push2(ssrRenderComponent(Navigation, {
                class: "navigation",
                title: "Rychlé odkazy",
                "active-link-id": -1,
                links: unref(navigationLinks)
              }, null, _parent2, _scopeId));
              _push2(`<div class="line" data-v-acaad1c5${_scopeId}><div class="line" data-v-acaad1c5${_scopeId}><div class="section-head" data-v-acaad1c5${_scopeId}><h3 data-v-acaad1c5${_scopeId}>${ssrInterpolate(["admin", "teacher"].includes(unref(role)) ? "Vytvořené úkoly" : "Rozpracované úkoly")}</h3><p data-v-acaad1c5${_scopeId}>${ssrInterpolate(["admin", "teacher"].includes(unref(role)) ? "Rychlý přístup do vašich vytvořených úkolů." : "Rychlý přístup do vašich rozpracovaných úkolů.")}</p></div><div class="search" data-v-acaad1c5${_scopeId}><input type="text" name="searchInput" placeholder="Hledat úkol"${ssrRenderAttr("value", searchInput.value)} data-v-acaad1c5${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                class: "icon",
                name: "material-symbols:search-rounded"
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
              _push2(ssrRenderComponent(unref(Vue3Datatable), {
                pageSize: 5,
                sortable: true,
                search: searchInput.value,
                pagination: false,
                rows: allTasks.value,
                columns: cols.value
              }, {
                task: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<a${ssrRenderAttr("href", `http://89.203.248.163/uploads/tasks/${data.value.id}/${data.value.task}`)} class="link" download target="_blank" data-v-acaad1c5${_scopeId2}>${ssrInterpolate(data.value.task)}</a>`);
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
                    _push3(`<p data-v-acaad1c5${_scopeId2}>${ssrInterpolate(unref(moment)(data.value.startDate).format("DD.MM. YYYY HH:MM"))}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(unref(moment)(data.value.startDate).format("DD.MM. YYYY HH:MM")), 1)
                    ];
                  }
                }),
                endDate: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p data-v-acaad1c5${_scopeId2}>${ssrInterpolate(unref(moment)(data.value.endDate).format("DD.MM. YYYY HH:MM"))}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(unref(moment)(data.value.endDate).format("DD.MM. YYYY HH:MM")), 1)
                    ];
                  }
                }),
                approve: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p data-v-acaad1c5${_scopeId2}>${ssrInterpolate(data.value.approve ? "Ano" : "Ne")}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(data.value.approve ? "Ano" : "Ne"), 1)
                    ];
                  }
                }),
                actions: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="actions" data-v-acaad1c5${_scopeId2}><button type="button" class="primary" data-v-acaad1c5${_scopeId2}>Otevřít</button></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "actions" }, [
                        createVNode("button", {
                          type: "button",
                          class: "primary",
                          onClick: ($event) => openTask(data.value.id)
                        }, "Otevřít", 8, ["onClick"])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div></div>`);
            } else {
              return [
                createVNode("div", { id: "home" }, [
                  createVNode("div", { class: "info" }, [
                    createVNode("div", { class: "line" }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, "Informativní karty"),
                        createVNode("p", null, "Informativní karty slouží k rychlému nalezení zajímavých údajů z panelu.")
                      ])
                    ]),
                    createVNode("ul", { class: "cards" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(infoCards), (data, index) => {
                        return openBlock(), createBlock("li", {
                          class: "card",
                          key: index
                        }, [
                          createVNode("div", { class: "content" }, [
                            createVNode("div", { class: "data" }, [
                              createVNode("h6", null, toDisplayString(data.title), 1),
                              createVNode("p", null, toDisplayString(data.value), 1)
                            ]),
                            createVNode(_component_Icon, {
                              class: "icon",
                              name: data.icon
                            }, null, 8, ["name"])
                          ])
                        ]);
                      }), 128))
                    ])
                  ]),
                  createVNode("div", { class: "line" }, [
                    createVNode(Navigation, {
                      class: "navigation",
                      title: "Rychlé odkazy",
                      "active-link-id": -1,
                      links: unref(navigationLinks)
                    }, null, 8, ["links"]),
                    createVNode("div", { class: "line" }, [
                      createVNode("div", { class: "line" }, [
                        createVNode("div", { class: "section-head" }, [
                          createVNode("h3", null, toDisplayString(["admin", "teacher"].includes(unref(role)) ? "Vytvořené úkoly" : "Rozpracované úkoly"), 1),
                          createVNode("p", null, toDisplayString(["admin", "teacher"].includes(unref(role)) ? "Rychlý přístup do vašich vytvořených úkolů." : "Rychlý přístup do vašich rozpracovaných úkolů."), 1)
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
                        pageSize: 5,
                        sortable: true,
                        search: searchInput.value,
                        pagination: false,
                        rows: allTasks.value,
                        columns: cols.value
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
                              onClick: ($event) => openTask(data.value.id)
                            }, "Otevřít", 8, ["onClick"])
                          ])
                        ]),
                        _: 1
                      }, 8, ["search", "rows", "columns"])
                    ])
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-acaad1c5"]]);

export { index as default };
//# sourceMappingURL=index.vue.mjs.map
