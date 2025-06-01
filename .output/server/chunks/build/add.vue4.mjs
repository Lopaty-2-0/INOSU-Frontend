import { a as __nuxt_component_0, _ as _export_sfc } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createVNode, createTextVNode, withDirectives, vShow, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { E as EditFormFooter } from './Footer.vue.mjs';
import { E as EditName, a as EditDateTime, b as EditNeedApprove } from './DateTime.vue.mjs';
import { E as EditTaskFile } from './TaskFile.vue.mjs';
import { u as useAlertsStore, _ as __nuxt_component_2 } from './Alerts.vue.mjs';
import { N as Navbar } from './Navbar.vue.mjs';
import { useRoute } from 'vue-router';
import { A as ActionBar } from './ActionBar.vue.mjs';
import { a as apiFetch } from './apiFetch.mjs';
import { u as useAccountStore } from './account.mjs';
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
import './Loading.vue.mjs';
import './index2.mjs';
import './nuxt-link.mjs';
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
      title: "Panel | Úkol - Přidání",
      meta: [
        { name: "description", content: "Panel Settings User Information" }
      ]
    });
    useRoute();
    const alertsStore = useAlertsStore();
    const triggerReset = ref(false);
    const loading = ref(false);
    const oldData = computed(() => ({
      name: "",
      needApprove: null,
      taskFile: "",
      startDate: null,
      endDate: null
    }));
    const newData = ref({
      name: void 0,
      needApprove: void 0,
      taskFile: void 0,
      startDate: void 0,
      endDate: void 0
    });
    const onNameUpdate = (name) => {
      newData.value.name = name;
    };
    const onNeedApproveUpdate = (needApprove) => {
      newData.value.needApprove = needApprove;
    };
    const onTaskFileUpdate = (taskFile) => {
      newData.value.taskFile = taskFile;
    };
    const onStartDateUpdate = (startDate) => {
      newData.value.startDate = startDate;
    };
    const onEndDateUpdate = (endDate) => {
      newData.value.endDate = endDate;
    };
    const resetUserData = () => {
      newData.value = {
        name: void 0,
        needApprove: void 0,
        taskFile: void 0,
        startDate: void 0,
        endDate: void 0
      };
      triggerReset.value = true;
      setTimeout(() => {
        triggerReset.value = false;
      }, 100);
    };
    const addTask = async () => {
      var _a, _b;
      if (!newData.value.name || !newData.value.startDate || !newData.value.endDate || !newData.value.taskFile || newData.value.needApprove === void 0) {
        alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Vyplňte všechna povinná pole." });
        return;
      }
      loading.value = true;
      const formData = new FormData();
      formData.append("name", newData.value.name || "");
      formData.append("startDate", ((_a = newData.value.startDate) == null ? void 0 : _a.getTime().toString()) || "");
      formData.append("endDate", ((_b = newData.value.endDate) == null ? void 0 : _b.getTime().toString()) || "");
      formData.append("task", newData.value.taskFile || "");
      formData.append("guarantor", useAccountStore().getId || "");
      formData.append("approve", newData.value.needApprove ? "true" : "false");
      await apiFetch("/task/add", {
        method: "post",
        headers: {
          "Accept": "application/json"
        },
        body: formData,
        credentials: "include",
        ignoreResponseError: true,
        onResponse({ response }) {
          const resCode = response._data.resCode.toString();
          switch (resCode) {
            case "26091":
              alertsStore.addAlert({ type: "success", title: "Přidání úkolu", message: "Úkol byl úspěšně vytvořen." });
              resetUserData();
              break;
            case "26010":
              alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Studenti nemohou vytvářet úkoly." });
              break;
            case "26020":
              alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Název úkolu nebyl zadán." });
              break;
            case "26030":
              alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Datum ukončení nebylo zadáno." });
              break;
            case "26040":
              alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Datum ukončení je neplatné." });
              break;
            case "26050":
              alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Datum ukončení je před datem začátku." });
              break;
            case "26060":
              alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Soubor úkolu nebyl zadán." });
              break;
            case "26070":
              alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Neplatný formát souboru." });
              break;
            case "26080":
              alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Nebyla zadána hodnota schválení." });
              break;
            default:
              alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Nastala neznámá chyba." });
              break;
          }
        },
        onRequestError() {
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Nastala neznámá chyba při odesílání požadavku." });
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
              { name: "Úkoly", path: `/panel/tasks/teacher` },
              { name: "Přidání", path: `/panel/tasks/teacher/add` }
            ] }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, { links: [
                { name: "Úkoly", path: `/panel/tasks/teacher` },
                { name: "Přidání", path: `/panel/tasks/teacher/add` }
              ] })
            ];
          }
        }),
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div id="tasks" data-v-0614c505${_scopeId}><div class="content" data-v-0614c505${_scopeId}>`);
            _push2(ssrRenderComponent(ActionBar, {
              class: "action-bar",
              description: "Správa úkolů",
              texts: ["Přidat", "Odebrat"],
              actions: ["add", "remove"],
              icons: [
                "material-symbols:add-rounded",
                "material-symbols:delete-rounded"
              ],
              active: 0,
              "navigate-to": [
                `/panel/tasks/teacher/add`,
                `/panel/tasks/teacher/remove`
              ]
            }, null, _parent2, _scopeId));
            _push2(`<div class="line page-section" data-v-0614c505${_scopeId}>`);
            _push2(ssrRenderComponent(EditName, {
              "old-name": oldData.value.name,
              reset: triggerReset.value,
              onUpdate: onNameUpdate
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-head" data-v-0614c505${_scopeId2}><h3 data-v-0614c505${_scopeId2}>Název * <span class="update" style="${ssrRenderStyle(newData.value.name ? null : { display: "none" })}" data-v-0614c505${_scopeId2}>(aktualizováno)</span></h3><p data-v-0614c505${_scopeId2}>Zadejte název úkolu, který bude jasně vystihovat jeho obsah a účel.</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "section-head" }, [
                      createVNode("h3", null, [
                        createTextVNode("Název * "),
                        withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                          [vShow, newData.value.name]
                        ])
                      ]),
                      createVNode("p", null, "Zadejte název úkolu, který bude jasně vystihovat jeho obsah a účel.")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="line page-section" data-v-0614c505${_scopeId}>`);
            _push2(ssrRenderComponent(EditTaskFile, {
              onUpdate: onTaskFileUpdate,
              reset: triggerReset.value,
              "old-check": oldData.value.taskFile
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-head" data-v-0614c505${_scopeId2}><h3 data-v-0614c505${_scopeId2}>Zadání * <span class="update" style="${ssrRenderStyle(newData.value.taskFile ? null : { display: "none" })}" data-v-0614c505${_scopeId2}>(aktualizováno)</span></h3><p data-v-0614c505${_scopeId2}>Vyberte soubor se zadáním úkolu, který budou studenti stahovat a podle něj úkol plnit. Povolené formáty: PDF, DOCX, ODT, HTML nebo ZIP.</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "section-head" }, [
                      createVNode("h3", null, [
                        createTextVNode("Zadání * "),
                        withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                          [vShow, newData.value.taskFile]
                        ])
                      ]),
                      createVNode("p", null, "Vyberte soubor se zadáním úkolu, který budou studenti stahovat a podle něj úkol plnit. Povolené formáty: PDF, DOCX, ODT, HTML nebo ZIP.")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="line page-section" data-v-0614c505${_scopeId}><div class="section-head" data-v-0614c505${_scopeId}><h3 data-v-0614c505${_scopeId}>Časové rozmezí úkolu *</h3><p data-v-0614c505${_scopeId}>Zadejte časové rozmezí, ve kterém bude úkol aktivní. Studenti budou moci úkol odevzdávat pouze v tomto období.</p></div><div class="line" data-v-0614c505${_scopeId}>`);
            _push2(ssrRenderComponent(EditDateTime, {
              onUpdate: onStartDateUpdate,
              reset: triggerReset.value,
              "old-date": oldData.value.startDate,
              label: "Začátek úkolu"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(EditDateTime, {
              onUpdate: onEndDateUpdate,
              reset: triggerReset.value,
              "old-date": oldData.value.endDate,
              label: "Konec úkolu"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="line page-section" data-v-0614c505${_scopeId}>`);
            _push2(ssrRenderComponent(EditNeedApprove, {
              onUpdate: onNeedApproveUpdate,
              reset: triggerReset.value,
              "old-check": oldData.value.needApprove
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-head" data-v-0614c505${_scopeId2}><h3 data-v-0614c505${_scopeId2}>Nutné schválení * <span class="update" style="${ssrRenderStyle(newData.value.needApprove !== void 0 ? null : { display: "none" })}" data-v-0614c505${_scopeId2}>(aktualizováno)</span></h3><p data-v-0614c505${_scopeId2}>Pokud je tato možnost aktivní, bude přijetí úkolu nejprve muset projít schválením garantem před jeho přidělením.</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "section-head" }, [
                      createVNode("h3", null, [
                        createTextVNode("Nutné schválení * "),
                        withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                          [vShow, newData.value.needApprove !== void 0]
                        ])
                      ]),
                      createVNode("p", null, "Pokud je tato možnost aktivní, bude přijetí úkolu nejprve muset projít schválením garantem před jeho přidělením.")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(EditFormFooter, {
              "is-loading": loading.value,
              "reset-function": resetUserData,
              "submit-function": addTask
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Pole označená * jsou povinná `);
                } else {
                  return [
                    createTextVNode(" Pole označená * jsou povinná ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(__nuxt_component_2, null, null, _parent2, _scopeId));
            _push2(`</div>`);
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
                    active: 0,
                    "navigate-to": [
                      `/panel/tasks/teacher/add`,
                      `/panel/tasks/teacher/remove`
                    ]
                  }),
                  createVNode("div", { class: "line page-section" }, [
                    createVNode(EditName, {
                      "old-name": oldData.value.name,
                      reset: triggerReset.value,
                      onUpdate: onNameUpdate
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "section-head" }, [
                          createVNode("h3", null, [
                            createTextVNode("Název * "),
                            withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                              [vShow, newData.value.name]
                            ])
                          ]),
                          createVNode("p", null, "Zadejte název úkolu, který bude jasně vystihovat jeho obsah a účel.")
                        ])
                      ]),
                      _: 1
                    }, 8, ["old-name", "reset"])
                  ]),
                  createVNode("div", { class: "line page-section" }, [
                    createVNode(EditTaskFile, {
                      onUpdate: onTaskFileUpdate,
                      reset: triggerReset.value,
                      "old-check": oldData.value.taskFile
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "section-head" }, [
                          createVNode("h3", null, [
                            createTextVNode("Zadání * "),
                            withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                              [vShow, newData.value.taskFile]
                            ])
                          ]),
                          createVNode("p", null, "Vyberte soubor se zadáním úkolu, který budou studenti stahovat a podle něj úkol plnit. Povolené formáty: PDF, DOCX, ODT, HTML nebo ZIP.")
                        ])
                      ]),
                      _: 1
                    }, 8, ["reset", "old-check"])
                  ]),
                  createVNode("div", { class: "line page-section" }, [
                    createVNode("div", { class: "section-head" }, [
                      createVNode("h3", null, "Časové rozmezí úkolu *"),
                      createVNode("p", null, "Zadejte časové rozmezí, ve kterém bude úkol aktivní. Studenti budou moci úkol odevzdávat pouze v tomto období.")
                    ]),
                    createVNode("div", { class: "line" }, [
                      createVNode(EditDateTime, {
                        onUpdate: onStartDateUpdate,
                        reset: triggerReset.value,
                        "old-date": oldData.value.startDate,
                        label: "Začátek úkolu"
                      }, null, 8, ["reset", "old-date"]),
                      createVNode(EditDateTime, {
                        onUpdate: onEndDateUpdate,
                        reset: triggerReset.value,
                        "old-date": oldData.value.endDate,
                        label: "Konec úkolu"
                      }, null, 8, ["reset", "old-date"])
                    ])
                  ]),
                  createVNode("div", { class: "line page-section" }, [
                    createVNode(EditNeedApprove, {
                      onUpdate: onNeedApproveUpdate,
                      reset: triggerReset.value,
                      "old-check": oldData.value.needApprove
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "section-head" }, [
                          createVNode("h3", null, [
                            createTextVNode("Nutné schválení * "),
                            withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                              [vShow, newData.value.needApprove !== void 0]
                            ])
                          ]),
                          createVNode("p", null, "Pokud je tato možnost aktivní, bude přijetí úkolu nejprve muset projít schválením garantem před jeho přidělením.")
                        ])
                      ]),
                      _: 1
                    }, 8, ["reset", "old-check"])
                  ]),
                  createVNode(EditFormFooter, {
                    "is-loading": loading.value,
                    "reset-function": resetUserData,
                    "submit-function": addTask
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Pole označená * jsou povinná ")
                    ]),
                    _: 1
                  }, 8, ["is-loading"])
                ]),
                createVNode(__nuxt_component_2)
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/tasks/teacher/add.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const add = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0614c505"]]);

export { add as default };
//# sourceMappingURL=add.vue4.mjs.map
