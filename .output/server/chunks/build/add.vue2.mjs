import { a as __nuxt_component_0, _ as _export_sfc } from './server.mjs';
import __nuxt_component_0$1 from './index2.mjs';
import { defineComponent, ref, computed, mergeProps, createSlots, withCtx, createVNode, unref, createTextVNode, withDirectives, vShow, createBlock, createCommentVNode, vModelText, openBlock, toDisplayString, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
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
      title: "Panel | Třídy - Přidání",
      meta: [{ name: "description", content: "Panel Homepage" }]
    });
    const alertsStore = useAlertsStore();
    const loading = ref(false);
    const classData = ref({
      name: "",
      grade: null,
      group: "",
      specialization: null
    });
    const errors = ref({
      name: "",
      grade: "",
      group: "",
      specialization: ""
    });
    const allSpecializations = ref([]);
    const selectedSpecialization = ref(null);
    const open = ref(false);
    const searchName = ref("");
    const searchLengthOfStudy = ref(null);
    const searchAbbreviation = ref("");
    const icons = {
      select: "material-symbols:done-rounded",
      selected: "material-symbols:close-rounded",
      open: "material-symbols:arrow-downward-rounded",
      close: "material-symbols:arrow-upward-rounded"
    };
    const title = ref("");
    const searchedSpecializations = computed(() => {
      return allSpecializations.value.filter((item) => {
        return item.name.toLocaleLowerCase().includes(searchName.value.toLocaleLowerCase()) && (searchAbbreviation.value ? item.abbreviation.toLocaleLowerCase() === searchAbbreviation.value.toLocaleLowerCase() : true) && (searchLengthOfStudy.value ? item.lengthOfStudy === searchLengthOfStudy.value : true);
      });
    });
    const toggleDropdown = () => {
      open.value = !open.value;
    };
    const pingResetSelectedClasses = () => {
      selectedSpecialization.value = null;
      classData.value = {
        name: "",
        grade: null,
        group: "",
        specialization: null
      };
      errors.value = {
        name: "",
        grade: "",
        group: "",
        specialization: ""
      };
      searchAbbreviation.value = "";
      searchLengthOfStudy.value = null;
      searchName.value = "";
      title.value = "";
      open.value = false;
    };
    const onSpecializationSelect = (specialization) => {
      if (specialization.id === selectedSpecialization.value) {
        selectedSpecialization.value = null;
        classData.value.specialization = null;
        title.value = "";
        return;
      }
      selectedSpecialization.value = specialization.id;
      classData.value.specialization = specialization.id;
      title.value = `${specialization.name} - ${specialization.abbreviation.toUpperCase()} - Délka studia (roky): ${specialization.lengthOfStudy}`;
      checkForErrors();
    };
    const checkForErrors = () => {
      errors.value.name = "";
      errors.value.grade = "";
      errors.value.group = "";
      errors.value.specialization = "";
      if (classData.value.name.length < 1) {
        errors.value.name = "Název třídy je povinný.";
      }
      if (!classData.value.grade || classData.value.grade < 1) {
        errors.value.grade = "Ročník třídy je povinný.";
      } else if (classData.value.grade < 1) {
        errors.value.grade = "Ročník třídy musí být větší než 0.";
      }
      if (classData.value.group.length < 1) {
        errors.value.group = "Skupina třídy je povinná.";
      } else if (classData.value.group.length > 1) {
        errors.value.group = "Skupina třídy musí být maximálně 1 znak.";
      }
      if (classData.value.specialization === null) {
        errors.value.specialization = "Zaměření třídy je povinné.";
      }
    };
    const addClass = async () => {
      if (!classData.value.specialization || !classData.value.group || !classData.value.grade || !classData.value.name) {
        alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Některá pole jsou prázdná." });
        return;
      }
      if (errors.value.name.length > 0 || errors.value.grade.length > 0 || errors.value.group.length > 0 || errors.value.specialization.length > 0) {
        alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Některá pole obsahují chyby." });
        return;
      }
      loading.value = true;
      await apiFetch("/class/add", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: {
          name: classData.value.name,
          grade: classData.value.grade,
          group: classData.value.group,
          idSpecialization: classData.value.specialization
        },
        ignoreResponseError: true,
        credentials: "include",
        onResponse({ response }) {
          const resCode = response._data.resCode.toString();
          switch (resCode) {
            case "8010":
              alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Nemáte oprávnění k této akci." });
              break;
            case "8020":
              alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Ročník chybí." });
              break;
            case "8030":
              alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Skupina chybí." });
              break;
            case "8040":
              alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Zaměření chybí." });
              break;
            case "8050":
              alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Název třídy chybí." });
              break;
            case "8060":
              alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Ročník musí být celé číslo." });
              break;
            case "8070":
              alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Skupina může mít maximálně 1 znak." });
              break;
            case "8080":
              alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Neplatné zaměření." });
              break;
            case "8090":
              alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Ročník přesahuje délku studia zaměření." });
              break;
            case "8100":
              alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Název třídy je již používán." });
              break;
            case "8111":
              alertsStore.addAlert({ type: "success", title: "Vytvoření třídy", message: "Třída byla úspěšně vytvořena." });
              classData.value.name = "";
              classData.value.grade = null;
              classData.value.group = "";
              classData.value.specialization = null;
              selectedSpecialization.value = null;
              title.value = "";
              searchName.value = "";
              searchLengthOfStudy.value = null;
              searchAbbreviation.value = "";
              errors.value.name = "";
              errors.value.grade = "";
              errors.value.group = "";
              errors.value.specialization = "";
              open.value = false;
              break;
            default:
              alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Nastala neznámá chyba." });
              break;
          }
        },
        onRequestError() {
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Nastala neznámá chyba." });
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
              { name: "Třídy", path: "/panel/classes" },
              { name: "Vytvoření", path: "/panel/classes/add" }
            ] }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, { links: [
                { name: "Třídy", path: "/panel/classes" },
                { name: "Vytvoření", path: "/panel/classes/add" }
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
              _push2(`<div id="classes" data-v-4dab8dfb${_scopeId}><div class="content" data-v-4dab8dfb${_scopeId}>`);
              _push2(ssrRenderComponent(ActionBar, {
                class: "action-bar",
                description: "Správa tříd",
                texts: ["Přidat", "Odebrat"],
                actions: ["add", "remove"],
                icons: [
                  "material-symbols:add-rounded",
                  "material-symbols:delete-rounded"
                ],
                active: 0,
                "navigate-to": [
                  `/panel/classes/add`,
                  `/panel/classes/remove`
                ]
              }, null, _parent2, _scopeId));
              _push2(`<div class="form" data-v-4dab8dfb${_scopeId}><div class="section" data-v-4dab8dfb${_scopeId}><div class="section-head" data-v-4dab8dfb${_scopeId}><h3 data-v-4dab8dfb${_scopeId}>Název * <span class="update" style="${ssrRenderStyle(classData.value.name ? null : { display: "none" })}" data-v-4dab8dfb${_scopeId}>(aktualizováno)</span></h3><p data-v-4dab8dfb${_scopeId}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p></div><div class="content" data-v-4dab8dfb${_scopeId}><label for="name" data-v-4dab8dfb${_scopeId}>Název</label><input type="text" id="name" placeholder="V1B-ANJ1"${ssrRenderAttr("value", classData.value.name)} data-v-4dab8dfb${_scopeId}>`);
              if (errors.value.name.length > 0) {
                _push2(`<p class="input-error" data-v-4dab8dfb${_scopeId}>${ssrInterpolate(errors.value.name)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="section" data-v-4dab8dfb${_scopeId}><div class="section-head" data-v-4dab8dfb${_scopeId}><h3 data-v-4dab8dfb${_scopeId}>Zaměření * <span class="update" style="${ssrRenderStyle(classData.value.specialization ? null : { display: "none" })}" data-v-4dab8dfb${_scopeId}>(aktualizováno)</span></h3><p data-v-4dab8dfb${_scopeId}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p></div><div class="content" data-v-4dab8dfb${_scopeId}><div class="search" data-v-4dab8dfb${_scopeId}><label for="searchName" data-v-4dab8dfb${_scopeId}> Název <input id="searchName" placeholder="Vyhledat název"${ssrRenderAttr("value", searchName.value)} data-v-4dab8dfb${_scopeId}></label><label for="searchAbbreviation" data-v-4dab8dfb${_scopeId}> Zkratka <input id="searchAbbreviation" placeholder="V"${ssrRenderAttr("value", searchAbbreviation.value)} data-v-4dab8dfb${_scopeId}></label><label for="searchLengthOfStudy" data-v-4dab8dfb${_scopeId}> Délka studia <input id="searchLengthOfStudy" min="1" max="10" placeholder="3" type="number"${ssrRenderAttr("value", searchLengthOfStudy.value)} data-v-4dab8dfb${_scopeId}></label></div><label data-v-4dab8dfb${_scopeId}>Výběr zaměření</label><div class="dropdown" data-v-4dab8dfb${_scopeId}><div class="title" data-v-4dab8dfb${_scopeId}><p data-v-4dab8dfb${_scopeId}>${ssrInterpolate(title.value || "Vyberte zaměření")}</p>`);
              _push2(ssrRenderComponent(_component_Icon, {
                class: "icon",
                name: open.value ? icons.close : icons.open
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="dropdown-content" style="${ssrRenderStyle(open.value ? null : { display: "none" })}" data-v-4dab8dfb${_scopeId}>`);
              if (unref(searchedSpecializations).length > 0) {
                _push2(`<!--[-->`);
                ssrRenderList(unref(searchedSpecializations), (item) => {
                  _push2(`<div class="${ssrRenderClass([{ selected: selectedSpecialization.value === item.id }, "item"])}" data-v-4dab8dfb${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_Icon, {
                    class: "icon",
                    name: selectedSpecialization.value === item.id ? icons.select : icons.selected
                  }, null, _parent2, _scopeId));
                  _push2(`<span data-v-4dab8dfb${_scopeId}>`);
                  if (item.name) {
                    _push2(`<span class="name" data-v-4dab8dfb${_scopeId}>${ssrInterpolate(item.name + " - ")}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<span class="uppercase" data-v-4dab8dfb${_scopeId}>${ssrInterpolate(item.abbreviation + " - ")}</span><span data-v-4dab8dfb${_scopeId}>Délka studia (roky): ${ssrInterpolate(item.lengthOfStudy)}</span></span></div>`);
                });
                _push2(`<!--]-->`);
              } else {
                _push2(`<div class="item error" data-v-4dab8dfb${_scopeId}><p data-v-4dab8dfb${_scopeId}>Žádné zaměření nebylo nalezeno.</p></div>`);
              }
              _push2(`</div></div>`);
              if (errors.value.specialization.length > 0) {
                _push2(`<p class="input-error" data-v-4dab8dfb${_scopeId}>${ssrInterpolate(errors.value.specialization)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="section" data-v-4dab8dfb${_scopeId}><div class="section-head" data-v-4dab8dfb${_scopeId}><h3 data-v-4dab8dfb${_scopeId}>Ročník * <span class="update" style="${ssrRenderStyle(classData.value.grade ? null : { display: "none" })}" data-v-4dab8dfb${_scopeId}>(aktualizováno)</span></h3><p data-v-4dab8dfb${_scopeId}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p></div><div class="content" data-v-4dab8dfb${_scopeId}><label for="grade" data-v-4dab8dfb${_scopeId}>Ročník</label><input type="number" id="grade" placeholder="1" min="1"${ssrRenderAttr("value", classData.value.grade)} data-v-4dab8dfb${_scopeId}>`);
              if (errors.value.grade.length > 0) {
                _push2(`<p class="input-error" data-v-4dab8dfb${_scopeId}>${ssrInterpolate(errors.value.grade)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="section" data-v-4dab8dfb${_scopeId}><div class="section-head" data-v-4dab8dfb${_scopeId}><h3 data-v-4dab8dfb${_scopeId}>Skupina * <span class="update" style="${ssrRenderStyle(classData.value.group ? null : { display: "none" })}" data-v-4dab8dfb${_scopeId}>(aktualizováno)</span></h3><p data-v-4dab8dfb${_scopeId}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p></div><div class="content" data-v-4dab8dfb${_scopeId}><label for="group" data-v-4dab8dfb${_scopeId}>Skupina</label><input type="text" id="group" placeholder="A"${ssrRenderAttr("value", classData.value.group)} data-v-4dab8dfb${_scopeId}>`);
              if (errors.value.group.length > 0) {
                _push2(`<p class="input-error" data-v-4dab8dfb${_scopeId}>${ssrInterpolate(errors.value.group)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div></div><div class="buttons" data-v-4dab8dfb${_scopeId}><button type="submit" data-v-4dab8dfb${_scopeId}> Uložit změny `);
              _push2(ssrRenderComponent(Loading, {
                style: loading.value ? null : { display: "none" },
                size: "5px",
                color: "var(--actionBar-actions-remove-color)"
              }, null, _parent2, _scopeId));
              _push2(`</button><button type="reset" data-v-4dab8dfb${_scopeId}> Resetovat změny </button></div></div></div>`);
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
                      active: 0,
                      "navigate-to": [
                        `/panel/classes/add`,
                        `/panel/classes/remove`
                      ]
                    }),
                    createVNode("div", { class: "form" }, [
                      createVNode("div", { class: "section" }, [
                        createVNode("div", { class: "section-head" }, [
                          createVNode("h3", null, [
                            createTextVNode("Název * "),
                            withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                              [vShow, classData.value.name]
                            ])
                          ]),
                          createVNode("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
                        ]),
                        createVNode("div", { class: "content" }, [
                          createVNode("label", { for: "name" }, "Název"),
                          withDirectives(createVNode("input", {
                            type: "text",
                            id: "name",
                            placeholder: "V1B-ANJ1",
                            "onUpdate:modelValue": ($event) => classData.value.name = $event,
                            onInput: checkForErrors
                          }, null, 40, ["onUpdate:modelValue"]), [
                            [vModelText, classData.value.name]
                          ]),
                          errors.value.name.length > 0 ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "input-error"
                          }, toDisplayString(errors.value.name), 1)) : createCommentVNode("", true)
                        ])
                      ]),
                      createVNode("div", { class: "section" }, [
                        createVNode("div", { class: "section-head" }, [
                          createVNode("h3", null, [
                            createTextVNode("Zaměření * "),
                            withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                              [vShow, classData.value.specialization]
                            ])
                          ]),
                          createVNode("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
                        ]),
                        createVNode("div", { class: "content" }, [
                          createVNode("div", { class: "search" }, [
                            createVNode("label", { for: "searchName" }, [
                              createTextVNode(" Název "),
                              withDirectives(createVNode("input", {
                                id: "searchName",
                                placeholder: "Vyhledat název",
                                "onUpdate:modelValue": ($event) => searchName.value = $event
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelText, searchName.value]
                              ])
                            ]),
                            createVNode("label", { for: "searchAbbreviation" }, [
                              createTextVNode(" Zkratka "),
                              withDirectives(createVNode("input", {
                                id: "searchAbbreviation",
                                placeholder: "V",
                                "onUpdate:modelValue": ($event) => searchAbbreviation.value = $event
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelText, searchAbbreviation.value]
                              ])
                            ]),
                            createVNode("label", { for: "searchLengthOfStudy" }, [
                              createTextVNode(" Délka studia "),
                              withDirectives(createVNode("input", {
                                id: "searchLengthOfStudy",
                                min: "1",
                                max: "10",
                                placeholder: "3",
                                type: "number",
                                "onUpdate:modelValue": ($event) => searchLengthOfStudy.value = $event
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelText, searchLengthOfStudy.value]
                              ])
                            ])
                          ]),
                          createVNode("label", null, "Výběr zaměření"),
                          createVNode("div", { class: "dropdown" }, [
                            createVNode("div", {
                              class: "title",
                              onClick: toggleDropdown
                            }, [
                              createVNode("p", null, toDisplayString(title.value || "Vyberte zaměření"), 1),
                              createVNode(_component_Icon, {
                                class: "icon",
                                name: open.value ? icons.close : icons.open
                              }, null, 8, ["name"])
                            ]),
                            withDirectives(createVNode("div", { class: "dropdown-content" }, [
                              unref(searchedSpecializations).length > 0 ? (openBlock(true), createBlock(Fragment, { key: 0 }, renderList(unref(searchedSpecializations), (item) => {
                                return openBlock(), createBlock("div", {
                                  key: item.id,
                                  class: ["item", { selected: selectedSpecialization.value === item.id }],
                                  onClick: () => onSpecializationSelect(item)
                                }, [
                                  createVNode(_component_Icon, {
                                    class: "icon",
                                    name: selectedSpecialization.value === item.id ? icons.select : icons.selected
                                  }, null, 8, ["name"]),
                                  createVNode("span", null, [
                                    item.name ? (openBlock(), createBlock("span", {
                                      key: 0,
                                      class: "name"
                                    }, toDisplayString(item.name + " - "), 1)) : createCommentVNode("", true),
                                    createVNode("span", { class: "uppercase" }, toDisplayString(item.abbreviation + " - "), 1),
                                    createVNode("span", null, "Délka studia (roky): " + toDisplayString(item.lengthOfStudy), 1)
                                  ])
                                ], 10, ["onClick"]);
                              }), 128)) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "item error"
                              }, [
                                createVNode("p", null, "Žádné zaměření nebylo nalezeno.")
                              ]))
                            ], 512), [
                              [vShow, open.value]
                            ])
                          ]),
                          errors.value.specialization.length > 0 ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "input-error"
                          }, toDisplayString(errors.value.specialization), 1)) : createCommentVNode("", true)
                        ])
                      ]),
                      createVNode("div", { class: "section" }, [
                        createVNode("div", { class: "section-head" }, [
                          createVNode("h3", null, [
                            createTextVNode("Ročník * "),
                            withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                              [vShow, classData.value.grade]
                            ])
                          ]),
                          createVNode("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
                        ]),
                        createVNode("div", { class: "content" }, [
                          createVNode("label", { for: "grade" }, "Ročník"),
                          withDirectives(createVNode("input", {
                            type: "number",
                            id: "grade",
                            placeholder: "1",
                            min: "1",
                            "onUpdate:modelValue": ($event) => classData.value.grade = $event,
                            onInput: checkForErrors
                          }, null, 40, ["onUpdate:modelValue"]), [
                            [vModelText, classData.value.grade]
                          ]),
                          errors.value.grade.length > 0 ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "input-error"
                          }, toDisplayString(errors.value.grade), 1)) : createCommentVNode("", true)
                        ])
                      ]),
                      createVNode("div", { class: "section" }, [
                        createVNode("div", { class: "section-head" }, [
                          createVNode("h3", null, [
                            createTextVNode("Skupina * "),
                            withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                              [vShow, classData.value.group]
                            ])
                          ]),
                          createVNode("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
                        ]),
                        createVNode("div", { class: "content" }, [
                          createVNode("label", { for: "group" }, "Skupina"),
                          withDirectives(createVNode("input", {
                            type: "text",
                            id: "group",
                            placeholder: "A",
                            "onUpdate:modelValue": ($event) => classData.value.group = $event,
                            onInput: checkForErrors
                          }, null, 40, ["onUpdate:modelValue"]), [
                            [vModelText, classData.value.group]
                          ]),
                          errors.value.group.length > 0 ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "input-error"
                          }, toDisplayString(errors.value.group), 1)) : createCommentVNode("", true)
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "buttons" }, [
                      createVNode("button", {
                        type: "submit",
                        onClick: addClass
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
                        onClick: pingResetSelectedClasses
                      }, " Resetovat změny ")
                    ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/classes/add.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const add = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4dab8dfb"]]);

export { add as default };
//# sourceMappingURL=add.vue2.mjs.map
