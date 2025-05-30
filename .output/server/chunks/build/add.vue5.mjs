import { a as __nuxt_component_0, _ as _export_sfc } from './server.mjs';
import { defineComponent, ref, mergeProps, withCtx, createVNode, withDirectives, createBlock, createCommentVNode, vModelText, openBlock, toDisplayString, createTextVNode, vShow, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { N as Navbar } from './Navbar.vue.mjs';
import { u as useAlertsStore, _ as __nuxt_component_2 } from './Alerts.vue.mjs';
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
import './index2.mjs';
import './nuxt-link.mjs';
import './account.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "add",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Panel | Zaměření - Přidání",
      meta: [{ name: "description", content: "Panel Homepage" }]
    });
    const alertsStore = useAlertsStore();
    const loading = ref(false);
    const specializationData = ref({
      name: "",
      lengthOfStudy: null,
      abbreviation: ""
    });
    const errors = ref({
      name: "",
      lengthOfStudy: "",
      abbreviation: ""
    });
    ref([]);
    const checkForErrors = () => {
      errors.value.name = "";
      errors.value.lengthOfStudy = "";
      errors.value.abbreviation = "";
      if (specializationData.value.name.length < 1) {
        errors.value.name = "Název třídy je povinný.";
      }
      if (specializationData.value.lengthOfStudy === null) {
        errors.value.lengthOfStudy = "Délka studia je povinná.";
      } else if (specializationData.value.lengthOfStudy < 1) {
        errors.value.lengthOfStudy = "Délka studia musí být větší než 0.";
      }
      if (specializationData.value.abbreviation.length < 1) {
        errors.value.abbreviation = "Zkratka zaměření je povinná.";
      } else if (specializationData.value.abbreviation.length > 1) {
        errors.value.abbreviation = "Zkratka zaměření může mít maximálně 1 znak.";
      }
    };
    const resetInputs = () => {
      specializationData.value.name = "";
      specializationData.value.lengthOfStudy = null;
      specializationData.value.abbreviation = "";
      errors.value.name = "";
      errors.value.lengthOfStudy = "";
      errors.value.abbreviation = "";
    };
    const addSpecialization = async () => {
      if (specializationData.value.name.length < 1 || specializationData.value.lengthOfStudy === null || specializationData.value.abbreviation.length < 1) {
        alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Vyplňte všechna povinná pole." });
        return;
      }
      if (errors.value.name.length > 0 || errors.value.lengthOfStudy.length > 0 || errors.value.abbreviation.length > 0) {
        alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Opravte chyby ve formuláři." });
        return;
      }
      loading.value = true;
      await apiFetch("/specialization/add", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          name: specializationData.value.name,
          lengthOfStudy: specializationData.value.lengthOfStudy,
          abbreviation: specializationData.value.abbreviation
        },
        ignoreResponseError: true,
        credentials: "include",
        onResponse({ response }) {
          const resCode = response._data.resCode.toString();
          switch (resCode) {
            case "4010":
              alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Nemáte oprávnění k této akci." });
              break;
            case "4020":
              alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Délka studia chybí." });
              break;
            case "4030":
              alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Délka studia musí být celé číslo." });
              break;
            case "4040":
              alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Zkratka zaměření chybí." });
              break;
            case "4050":
              alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Zkratka zaměření je příliš dlouhá." });
              break;
            case "4060":
              alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Zkratka zaměření je již používána." });
              break;
            case "4070":
              alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Název zaměření chybí." });
              break;
            case "4080":
              alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Název zaměření je příliš dlouhý." });
              break;
            case "4090":
              alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Název zaměření je již používán." });
              break;
            case "4101":
              alertsStore.addAlert({ type: "success", title: "Přidání zaměření", message: "Zaměření bylo úspěšně vytvořeno." });
              resetInputs();
              break;
            default:
              alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Nastala neznámá chyba." });
              break;
          }
        },
        onRequestError() {
          alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Nastala neznámá chyba." });
        }
      }).finally(() => {
        loading.value = false;
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "panel" }, _attrs), {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Navbar, { links: [
              { name: "Zaměření", path: "/panel/specializations" },
              { name: "Vytvoření", path: "/panel/specializations/add" }
            ] }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, { links: [
                { name: "Zaměření", path: "/panel/specializations" },
                { name: "Vytvoření", path: "/panel/specializations/add" }
              ] })
            ];
          }
        }),
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div id="specializations" data-v-8710508d${_scopeId}><div class="content" data-v-8710508d${_scopeId}>`);
            _push2(ssrRenderComponent(ActionBar, {
              class: "action-bar",
              description: "Správa zaměření",
              texts: ["Přidat", "Odebrat"],
              actions: ["add", "remove"],
              icons: [
                "material-symbols:add-rounded",
                "material-symbols:delete-rounded"
              ],
              active: 0,
              "navigate-to": [
                `/panel/specializations/add`,
                `/panel/specializations/remove`
              ]
            }, null, _parent2, _scopeId));
            _push2(`<div class="form" data-v-8710508d${_scopeId}><div class="section" data-v-8710508d${_scopeId}><div class="section-head" data-v-8710508d${_scopeId}><h3 data-v-8710508d${_scopeId}>Název</h3><p data-v-8710508d${_scopeId}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p></div><div class="content" data-v-8710508d${_scopeId}><label for="name" data-v-8710508d${_scopeId}>Název</label><input type="text" id="name" placeholder="Informační technologie"${ssrRenderAttr("value", specializationData.value.name)} data-v-8710508d${_scopeId}>`);
            if (errors.value.name.length > 0) {
              _push2(`<p class="input-error" data-v-8710508d${_scopeId}>${ssrInterpolate(errors.value.name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="section" data-v-8710508d${_scopeId}><div class="section-head" data-v-8710508d${_scopeId}><h3 data-v-8710508d${_scopeId}>Zkratka</h3><p data-v-8710508d${_scopeId}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p></div><div class="content" data-v-8710508d${_scopeId}><label for="abbreviation" data-v-8710508d${_scopeId}>Zkratka</label><input type="text" id="abbreviation" placeholder="V"${ssrRenderAttr("value", specializationData.value.abbreviation)} data-v-8710508d${_scopeId}>`);
            if (errors.value.abbreviation.length > 0) {
              _push2(`<p class="input-error" data-v-8710508d${_scopeId}>${ssrInterpolate(errors.value.abbreviation)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="section" data-v-8710508d${_scopeId}><div class="section-head" data-v-8710508d${_scopeId}><h3 data-v-8710508d${_scopeId}>Délka studia</h3><p data-v-8710508d${_scopeId}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p></div><div class="content" data-v-8710508d${_scopeId}><label for="lengthOfStudy" data-v-8710508d${_scopeId}>Délka studia</label><input type="number" id="lengthOfStudy" placeholder="1" min="1"${ssrRenderAttr("value", specializationData.value.lengthOfStudy)} data-v-8710508d${_scopeId}>`);
            if (errors.value.lengthOfStudy.length > 0) {
              _push2(`<p class="input-error" data-v-8710508d${_scopeId}>${ssrInterpolate(errors.value.lengthOfStudy)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div><div class="buttons" data-v-8710508d${_scopeId}><button type="submit" data-v-8710508d${_scopeId}> Uložit změny `);
            _push2(ssrRenderComponent(Loading, {
              style: loading.value ? null : { display: "none" },
              size: "5px",
              color: "var(--actionBar-actions-remove-color)"
            }, null, _parent2, _scopeId));
            _push2(`</button><button type="reset" data-v-8710508d${_scopeId}> Resetovat změny </button></div></div></div>`);
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
                    active: 0,
                    "navigate-to": [
                      `/panel/specializations/add`,
                      `/panel/specializations/remove`
                    ]
                  }),
                  createVNode("div", { class: "form" }, [
                    createVNode("div", { class: "section" }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, "Název"),
                        createVNode("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
                      ]),
                      createVNode("div", { class: "content" }, [
                        createVNode("label", { for: "name" }, "Název"),
                        withDirectives(createVNode("input", {
                          type: "text",
                          id: "name",
                          placeholder: "Informační technologie",
                          "onUpdate:modelValue": ($event) => specializationData.value.name = $event,
                          onInput: checkForErrors
                        }, null, 40, ["onUpdate:modelValue"]), [
                          [vModelText, specializationData.value.name]
                        ]),
                        errors.value.name.length > 0 ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "input-error"
                        }, toDisplayString(errors.value.name), 1)) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "section" }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, "Zkratka"),
                        createVNode("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
                      ]),
                      createVNode("div", { class: "content" }, [
                        createVNode("label", { for: "abbreviation" }, "Zkratka"),
                        withDirectives(createVNode("input", {
                          type: "text",
                          id: "abbreviation",
                          placeholder: "V",
                          "onUpdate:modelValue": ($event) => specializationData.value.abbreviation = $event,
                          onInput: checkForErrors
                        }, null, 40, ["onUpdate:modelValue"]), [
                          [vModelText, specializationData.value.abbreviation]
                        ]),
                        errors.value.abbreviation.length > 0 ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "input-error"
                        }, toDisplayString(errors.value.abbreviation), 1)) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "section" }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, "Délka studia"),
                        createVNode("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
                      ]),
                      createVNode("div", { class: "content" }, [
                        createVNode("label", { for: "lengthOfStudy" }, "Délka studia"),
                        withDirectives(createVNode("input", {
                          type: "number",
                          id: "lengthOfStudy",
                          placeholder: "1",
                          min: "1",
                          "onUpdate:modelValue": ($event) => specializationData.value.lengthOfStudy = $event,
                          onInput: checkForErrors
                        }, null, 40, ["onUpdate:modelValue"]), [
                          [vModelText, specializationData.value.lengthOfStudy]
                        ]),
                        errors.value.lengthOfStudy.length > 0 ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "input-error"
                        }, toDisplayString(errors.value.lengthOfStudy), 1)) : createCommentVNode("", true)
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "buttons" }, [
                    createVNode("button", {
                      type: "submit",
                      onClick: addSpecialization
                    }, [
                      createTextVNode(" Uložit změny "),
                      withDirectives(createVNode(Loading, {
                        size: "5px",
                        color: "var(--actionBar-actions-remove-color)"
                      }, null, 512), [
                        [vShow, loading.value]
                      ])
                    ]),
                    createVNode("button", {
                      type: "reset",
                      onClick: resetInputs
                    }, " Resetovat změny ")
                  ])
                ])
              ]),
              createVNode(__nuxt_component_2)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/specializations/add.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const add = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8710508d"]]);

export { add as default };
//# sourceMappingURL=add.vue5.mjs.map
