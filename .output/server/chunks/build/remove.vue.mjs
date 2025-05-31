import { a as __nuxt_component_0, _ as _export_sfc } from './server.mjs';
import __nuxt_component_0$1 from './index2.mjs';
import { defineComponent, ref, mergeProps, createSlots, withCtx, createVNode, unref, toDisplayString, withDirectives, vModelText, createTextVNode, vShow, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { N as Navbar } from './Navbar.vue.mjs';
import { u as useAlertsStore, _ as __nuxt_component_2 } from './Alerts.vue.mjs';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import { A as ActionBar } from './ActionBar.vue.mjs';
import { a as apiFetch } from './apiFetch.mjs';
import { L as Loading } from './Loading.vue.mjs';
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
import './nuxt-link.mjs';
import './account.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "remove",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Panel | Třídy - Odstranění",
      meta: [{ name: "description", content: "Panel Homepage" }]
    });
    const alertsStore = useAlertsStore();
    const cols = ref([
      { field: "id", title: "ID", width: "90px", type: "number" },
      { field: "name", title: "Název", type: "string" },
      { field: "class", title: "Třída", type: "string" },
      { field: "grade", title: "Ročník", type: "number" },
      { field: "group", title: "Skupina", type: "string" },
      { field: "specialization", title: "Zaměření", type: "string" }
    ]);
    const datatable = ref(null);
    const allClasses = ref(void 0);
    const selectedClasses = ref([]);
    const loading = ref(false);
    const searchInput = ref("");
    const pingResetSelectedClasses = () => {
      datatable.value.clearSelectedRows();
      selectedClasses.value = [];
    };
    const onCheckboxSelect = () => {
      if (!datatable.value) return;
      setTimeout(() => {
        selectedClasses.value = datatable.value.getSelectedRows();
      }, 0);
    };
    const removeClasses = async () => {
      loading.value = true;
      await apiFetch("/class/delete", {
        method: "delete",
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          idClass: selectedClasses.value.map((oneClass) => oneClass.id)
        },
        ignoreResponseError: true,
        credentials: "include",
        onResponse({ response }) {
          var _a;
          const resCode = response._data.resCode.toString();
          switch (resCode) {
            case "9010":
              alertsStore.addAlert({ type: "error", title: "Odstranění tříd", message: "Nedostatečné oprávnění pro odstranění tříd." });
              break;
            case "9020":
              alertsStore.addAlert({ type: "warning", title: "Odstranění tříd", message: "Žádná třída nebyla vybrána." });
              break;
            case "9031":
              if ((response._data.data.taskIds || []).length >= 1) {
                alertsStore.addAlert({ type: "warning", title: "Odstranění tříd", message: `Některé třídy nebyly odstraněny. Tyto třídy jsou přiřazeny k nějakému úkolu: ${response._data.data.taskIds.join(", ")}` });
              } else if ((response._data.data.userIds || []).length >= 1) {
                alertsStore.addAlert({ type: "warning", title: "Odstranění tříd", message: `Některé třídy nebyly odstraněny. Tyto třídy obsahují nějaké uživatele: ${response._data.data.userIds.join(", ")}` });
              } else {
                alertsStore.addAlert({ type: "success", title: "Odstranění tříd", message: `Třídy byly úspěšně odstraněny. (${response._data.data.goodIds.length}/${selectedClasses.value.length})` });
              }
              allClasses.value = (_a = allClasses.value) == null ? void 0 : _a.filter((oneClass) => !response._data.data.goodIds.includes(oneClass.id));
              pingResetSelectedClasses();
              break;
            default:
              alertsStore.addAlert({ type: "error", title: "Odstranění tříd", message: "Nastala neznámá chyba." });
              break;
          }
        },
        onRequestError() {
          alertsStore.addAlert({ type: "error", title: "Odstranění tříd", message: "Nastala neznámá chyba." });
        }
      }).finally(() => {
        loading.value = false;
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_Icon = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({
        name: "panel",
        loading: !allClasses.value
      }, _attrs), createSlots({
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Navbar, { links: [
              { name: "Třídy", path: "/panel/classes" },
              { name: "Odstranění", path: "/panel/classes/remove" }
            ] }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, { links: [
                { name: "Třídy", path: "/panel/classes" },
                { name: "Odstranění", path: "/panel/classes/remove" }
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
              _push2(`<div id="classes" data-v-bc337021${_scopeId}><div class="content" data-v-bc337021${_scopeId}>`);
              _push2(ssrRenderComponent(ActionBar, {
                class: "action-bar",
                description: "Správa tříd",
                texts: ["Přidat", "Odebrat"],
                actions: ["add", "remove"],
                icons: [
                  "material-symbols:add-rounded",
                  "material-symbols:delete-rounded"
                ],
                active: 1,
                "navigate-to": [
                  `/panel/classes/add`,
                  `/panel/classes/remove`
                ]
              }, null, _parent2, _scopeId));
              _push2(`<div class="line" data-v-bc337021${_scopeId}><div class="section-head" data-v-bc337021${_scopeId}><h3 data-v-bc337021${_scopeId}>Třídy: ${ssrInterpolate(selectedClasses.value.length)} / ${ssrInterpolate(allClasses.value.length)}</h3><p data-v-bc337021${_scopeId}>Vyberte třídy, které chcete trvale odstranit ze systému.</p></div><div class="search" data-v-bc337021${_scopeId}><input type="text" name="searchInput" placeholder="Hledat třídy"${ssrRenderAttr("value", searchInput.value)} data-v-bc337021${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                class: "icon",
                name: "material-symbols:search-rounded"
              }, null, _parent2, _scopeId));
              _push2(`</div></div><div class="buttons" data-v-bc337021${_scopeId}><button class="remove" data-v-bc337021${_scopeId}> Odstranit `);
              _push2(ssrRenderComponent(Loading, {
                style: loading.value ? null : { display: "none" },
                size: "5px",
                color: "var(--actionBar-actions-remove-color)"
              }, null, _parent2, _scopeId));
              _push2(`</button><button class="reset" data-v-bc337021${_scopeId}> Zrušit vše </button></div>`);
              _push2(ssrRenderComponent(unref(Vue3Datatable), {
                ref_key: "datatable",
                ref: datatable,
                rows: allClasses.value,
                columns: cols.value,
                hasCheckbox: true,
                pageSize: 10,
                sortable: true,
                search: searchInput.value,
                onInput: onCheckboxSelect
              }, {
                group: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p data-v-bc337021${_scopeId2}>${ssrInterpolate(data.value.group)}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(data.value.group), 1)
                    ];
                  }
                }),
                specialization: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p data-v-bc337021${_scopeId2}>${ssrInterpolate(data.value.specialization)}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(data.value.specialization), 1)
                    ];
                  }
                }),
                class: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p data-v-bc337021${_scopeId2}>${ssrInterpolate(data.value.specialization)}${ssrInterpolate(data.value.grade)}${ssrInterpolate(data.value.group)}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(data.value.specialization) + toDisplayString(data.value.grade) + toDisplayString(data.value.group), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
              _push2(ssrRenderComponent(__nuxt_component_2, null, null, _parent2, _scopeId));
            } else {
              return [
                createVNode("div", { id: "classes" }, [
                  createVNode("div", { class: "content" }, [
                    createVNode(ActionBar, {
                      class: "action-bar",
                      description: "Správa tříd",
                      texts: ["Přidat", "Odebrat"],
                      actions: ["add", "remove"],
                      icons: [
                        "material-symbols:add-rounded",
                        "material-symbols:delete-rounded"
                      ],
                      active: 1,
                      "navigate-to": [
                        `/panel/classes/add`,
                        `/panel/classes/remove`
                      ]
                    }),
                    createVNode("div", { class: "line" }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, "Třídy: " + toDisplayString(selectedClasses.value.length) + " / " + toDisplayString(allClasses.value.length), 1),
                        createVNode("p", null, "Vyberte třídy, které chcete trvale odstranit ze systému.")
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
                    createVNode("div", { class: "buttons" }, [
                      createVNode("button", {
                        class: "remove",
                        onClick: removeClasses
                      }, [
                        createTextVNode(" Odstranit "),
                        withDirectives(createVNode(Loading, {
                          size: "5px",
                          color: "var(--actionBar-actions-remove-color)"
                        }, null, 512), [
                          [vShow, loading.value]
                        ])
                      ]),
                      createVNode("button", {
                        class: "reset",
                        onClick: pingResetSelectedClasses
                      }, " Zrušit vše ")
                    ]),
                    createVNode(unref(Vue3Datatable), {
                      ref_key: "datatable",
                      ref: datatable,
                      rows: allClasses.value,
                      columns: cols.value,
                      hasCheckbox: true,
                      pageSize: 10,
                      sortable: true,
                      search: searchInput.value,
                      onInput: onCheckboxSelect
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
                createVNode(__nuxt_component_2)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/classes/remove.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const remove = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-bc337021"]]);

export { remove as default };
//# sourceMappingURL=remove.vue.mjs.map
