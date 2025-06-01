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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import './nuxt-link.mjs';
import './account.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "remove",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Panel | Zaměření - Odstranění",
      meta: [{ name: "description", content: "Panel Homepage" }]
    });
    const alertsStore = useAlertsStore();
    const cols = ref([
      { field: "id", title: "ID", width: "90px", type: "number" },
      { field: "name", title: "Název", type: "string" },
      { field: "abbreviation", title: "Zkratka", type: "string" },
      { field: "lengthOfStudy", title: "Délka studia (roky)", type: "number" }
    ]);
    const datatable = ref(null);
    const allSpecializations = ref(void 0);
    const selectedSpecializations = ref([]);
    const loading = ref(false);
    const searchInput = ref("");
    const pingResetSelectedSpecializations = () => {
      datatable.value.clearSelectedRows();
      selectedSpecializations.value = [];
    };
    const onCheckboxSelect = () => {
      if (!datatable.value) return;
      setTimeout(() => {
        selectedSpecializations.value = datatable.value.getSelectedRows();
      }, 0);
    };
    const removeSpecializations = async () => {
      loading.value = true;
      await apiFetch("/specialization/delete", {
        method: "delete",
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          idSpecialization: selectedSpecializations.value.map((specialization) => specialization.id)
        },
        ignoreResponseError: true,
        credentials: "include",
        onResponse({ response }) {
          var _a;
          const resCode = response._data.resCode.toString();
          switch (resCode) {
            case "5010":
              alertsStore.addAlert({ type: "error", title: "Odstranění zaměření", message: "Nemáte oprávnění k této akci." });
              break;
            case "5020":
              alertsStore.addAlert({ type: "error", title: "Odstranění zaměření", message: "Chybí ID zaměření." });
              break;
            case "5030":
              alertsStore.addAlert({ type: "error", title: "Odstranění zaměření", message: "Neproběhlo žádné odstranění." });
              break;
            case "5041":
              if ((response._data.data.classIds || []).length >= 1) {
                alertsStore.addAlert({ type: "warning", title: "Odstranění zaměření", message: `Některé zaměření nebyly odstraněny. Tyto zaměření používají některé třídy: ${response._data.data.classIds.join(", ")}` });
              } else {
                alertsStore.addAlert({ type: "success", title: "Odstranění zaměření", message: `Zaměření byly úspěšně odstraněny. (${response._data.data.goodIds.length}/${selectedSpecializations.value.length})` });
              }
              allSpecializations.value = (_a = allSpecializations.value) == null ? void 0 : _a.filter((specialization) => !response._data.data.goodIds.includes(specialization.id));
              pingResetSelectedSpecializations();
              break;
            default:
              alertsStore.addAlert({ type: "error", title: "Odstranění zaměření", message: "Nastala neznámá chyba." });
              break;
          }
        },
        onRequestError() {
          alertsStore.addAlert({ type: "error", title: "Odstranění zaměření", message: "Nastala neznámá chyba." });
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
        loading: !allSpecializations.value
      }, _attrs), createSlots({
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Navbar, { links: [
              { name: "Zaměření", path: "/panel/specializations" },
              { name: "Odstranění", path: "/panel/specializations/remove" }
            ] }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, { links: [
                { name: "Zaměření", path: "/panel/specializations" },
                { name: "Odstranění", path: "/panel/specializations/remove" }
              ] })
            ];
          }
        }),
        _: 2
      }, [
        allSpecializations.value ? {
          name: "content",
          fn: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div id="specializations" data-v-f792ce46${_scopeId}><div class="content" data-v-f792ce46${_scopeId}>`);
              _push2(ssrRenderComponent(ActionBar, {
                class: "action-bar",
                description: "Správa zaměření",
                texts: ["Přidat", "Odebrat"],
                actions: ["add", "remove"],
                icons: [
                  "material-symbols:add-rounded",
                  "material-symbols:delete-rounded"
                ],
                active: 1,
                "navigate-to": [
                  `/panel/specializations/add`,
                  `/panel/specializations/remove`
                ]
              }, null, _parent2, _scopeId));
              _push2(`<div class="line" data-v-f792ce46${_scopeId}><div class="section-head" data-v-f792ce46${_scopeId}><h3 data-v-f792ce46${_scopeId}>Zaměření: ${ssrInterpolate(selectedSpecializations.value.length)} / ${ssrInterpolate(allSpecializations.value.length)}</h3><p data-v-f792ce46${_scopeId}>Vyberte zaměření, která chcete odstranit ze systému. Po potvrzení budou vybraná zaměření trvale smazána.</p></div><div class="search" data-v-f792ce46${_scopeId}><input type="text" name="searchInput" placeholder="Hledat zaměření"${ssrRenderAttr("value", searchInput.value)} data-v-f792ce46${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                class: "icon",
                name: "material-symbols:search-rounded"
              }, null, _parent2, _scopeId));
              _push2(`</div></div><div class="buttons" data-v-f792ce46${_scopeId}><button class="remove" data-v-f792ce46${_scopeId}> Odstranit `);
              _push2(ssrRenderComponent(Loading, {
                style: loading.value ? null : { display: "none" },
                size: "5px",
                color: "var(--actionBar-actions-remove-color)"
              }, null, _parent2, _scopeId));
              _push2(`</button><button class="reset" data-v-f792ce46${_scopeId}> Zrušit vše </button></div>`);
              _push2(ssrRenderComponent(unref(Vue3Datatable), {
                ref_key: "datatable",
                ref: datatable,
                rows: allSpecializations.value,
                columns: cols.value,
                hasCheckbox: true,
                pageSize: 10,
                sortable: true,
                search: searchInput.value,
                onInput: onCheckboxSelect
              }, {
                abbreviation: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p data-v-f792ce46${_scopeId2}>${ssrInterpolate(data.value.abbreviation)}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(data.value.abbreviation), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
              _push2(ssrRenderComponent(__nuxt_component_2, null, null, _parent2, _scopeId));
            } else {
              return [
                createVNode("div", { id: "specializations" }, [
                  createVNode("div", { class: "content" }, [
                    createVNode(ActionBar, {
                      class: "action-bar",
                      description: "Správa zaměření",
                      texts: ["Přidat", "Odebrat"],
                      actions: ["add", "remove"],
                      icons: [
                        "material-symbols:add-rounded",
                        "material-symbols:delete-rounded"
                      ],
                      active: 1,
                      "navigate-to": [
                        `/panel/specializations/add`,
                        `/panel/specializations/remove`
                      ]
                    }),
                    createVNode("div", { class: "line" }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, "Zaměření: " + toDisplayString(selectedSpecializations.value.length) + " / " + toDisplayString(allSpecializations.value.length), 1),
                        createVNode("p", null, "Vyberte zaměření, která chcete odstranit ze systému. Po potvrzení budou vybraná zaměření trvale smazána.")
                      ]),
                      createVNode("div", { class: "search" }, [
                        withDirectives(createVNode("input", {
                          type: "text",
                          name: "searchInput",
                          placeholder: "Hledat zaměření",
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
                        onClick: removeSpecializations
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
                        onClick: pingResetSelectedSpecializations
                      }, " Zrušit vše ")
                    ]),
                    createVNode(unref(Vue3Datatable), {
                      ref_key: "datatable",
                      ref: datatable,
                      rows: allSpecializations.value,
                      columns: cols.value,
                      hasCheckbox: true,
                      pageSize: 10,
                      sortable: true,
                      search: searchInput.value,
                      onInput: onCheckboxSelect
                    }, {
                      abbreviation: withCtx((data) => [
                        createVNode("p", null, toDisplayString(data.value.abbreviation), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/specializations/remove.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const remove = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f792ce46"]]);

export { remove as default };
//# sourceMappingURL=remove.vue5.mjs.map
