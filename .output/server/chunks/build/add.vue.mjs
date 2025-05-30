import { a as __nuxt_component_0, _ as _export_sfc } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createVNode, createTextVNode, withDirectives, vShow, createBlock, openBlock, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { E as EditFormFooter } from './Footer.vue.mjs';
import { u as useAlertsStore, _ as __nuxt_component_2 } from './Alerts.vue.mjs';
import { N as Navbar } from './Navbar.vue.mjs';
import { E as EditFullName, a as EditEmail, b as EditRole, c as EditAbbreviation } from './Abbreviation.vue.mjs';
import { E as EditPassword } from './Password.vue.mjs';
import { E as EditClass } from './Class.vue.mjs';
import { a as apiFetch } from './apiFetch.mjs';
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
import './Loading.vue.mjs';
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
      title: "Panel | Uživatelé - Přidání",
      meta: [
        { name: "description", content: "Panel Settings User Information" }
      ]
    });
    const alertsStore = useAlertsStore();
    const submitLoading = ref(false);
    const triggerReset = ref(false);
    const allRoles = ref(void 0);
    const allClasses = ref(void 0);
    const oldUserData = computed(() => ({
      name: "",
      surname: "",
      email: "",
      password: "",
      abbreviation: "",
      role: "",
      classes: []
    }));
    const newUserData = ref({
      name: void 0,
      surname: void 0,
      email: void 0,
      password: void 0,
      abbreviation: void 0,
      role: void 0,
      classes: void 0
    });
    const onFullNameUpdate = (fullName) => {
      newUserData.value.name = fullName.name;
      newUserData.value.surname = fullName.surname;
    };
    const onEmailUpdate = (data) => {
      newUserData.value.email = data.email;
    };
    const onPasswordUpdate = (data) => {
      newUserData.value.password = data.password;
    };
    const onAbbreviationUpdate = (data) => {
      newUserData.value.abbreviation = data.abbreviation;
    };
    const onRoleUpdate = (data) => {
      newUserData.value.role = data.role;
    };
    const onClassUpdate = (data) => {
      newUserData.value.classes = data.classes;
    };
    const resetUserData = () => {
      newUserData.value = {
        name: void 0,
        surname: void 0,
        email: void 0,
        password: void 0,
        abbreviation: void 0,
        role: void 0,
        classes: void 0
      };
      triggerReset.value = true;
      setTimeout(() => {
        triggerReset.value = false;
      }, 100);
    };
    const createNewUser = async () => {
      if (!newUserData.value.name || !newUserData.value.surname || !newUserData.value.email || !newUserData.value.password || !newUserData.value.role) {
        alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Vyplňte všechna povinná pole." });
        return;
      }
      submitLoading.value = true;
      await apiFetch("/user/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          name: newUserData.value.name,
          surname: newUserData.value.surname,
          email: newUserData.value.email,
          password: newUserData.value.password,
          abbreviation: newUserData.value.abbreviation,
          role: newUserData.value.role,
          classes: newUserData.value.classes
        },
        credentials: "include",
        ignoreResponseError: true,
        async onResponse({ response }) {
          const resCode = response._data.resCode.toString();
          switch (resCode) {
            case "1020":
              alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Jméno nebylo zadáno." });
              break;
            case "1030":
              alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Jméno je příliš dlouhé." });
              break;
            case "1040":
              alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Příjmení nebylo zadáno." });
              break;
            case "1050":
              alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Příjmení je příliš dlouhé." });
              break;
            case "1060":
              alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Role nebyla zadána." });
              break;
            case "1070":
              alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Role je příliš dlouhá." });
              break;
            case "1080":
              alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Heslo nebylo zadáno." });
              break;
            case "1090":
              alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Heslo je příliš krátké." });
              break;
            case "1100":
              alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "E-mail nebyl zadán." });
              break;
            case "1110":
              alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Špatný formát e-mailu." });
              break;
            case "1120":
              alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "E-mail je příliš dlouhý." });
              break;
            case "1130":
              alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "E-mail je již používán." });
              break;
            case "1140":
              alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Zkratka je již používána." });
              break;
            case "1150":
              alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Zkratka je příliš dlouhá." });
              break;
            case "1161":
              alertsStore.addAlert({ type: "success", title: "Přidání uživatele", message: "Uživatel byl úspěšně přidán." });
              resetUserData();
              break;
            default:
              alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Nastala neznámá chyba." });
              break;
          }
        },
        async onRequestError() {
          alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Nastala neznámá chyba." });
        }
      }).finally(() => {
        submitLoading.value = false;
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({
        name: "panel",
        loading: !allRoles.value || !allClasses.value
      }, _attrs), {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Navbar, { links: [
              { name: "Uživatelé", path: "/panel/users" },
              { name: "Přidání", path: "/panel/users/add" }
            ] }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, { links: [
                { name: "Uživatelé", path: "/panel/users" },
                { name: "Přidání", path: "/panel/users/add" }
              ] })
            ];
          }
        }),
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div id="settings" data-v-829b50c3${_scopeId}><div class="content" data-v-829b50c3${_scopeId}><div class="line page-section" data-v-829b50c3${_scopeId}>`);
            _push2(ssrRenderComponent(EditFullName, {
              "old-full-name": { name: oldUserData.value.name, surname: oldUserData.value.surname },
              reset: triggerReset.value,
              onUpdate: onFullNameUpdate
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-head" data-v-829b50c3${_scopeId2}><h3 data-v-829b50c3${_scopeId2}>Jméno a příjmení *</h3><p data-v-829b50c3${_scopeId2}>Změňte své jméno a příjmení</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "section-head" }, [
                      createVNode("h3", null, "Jméno a příjmení *"),
                      createVNode("p", null, "Změňte své jméno a příjmení")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="line page-section" data-v-829b50c3${_scopeId}>`);
            _push2(ssrRenderComponent(EditEmail, {
              "old-email": oldUserData.value.email,
              reset: triggerReset.value,
              onUpdate: onEmailUpdate
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-head" data-v-829b50c3${_scopeId2}><h3 data-v-829b50c3${_scopeId2}>E-mail * <span class="update" style="${ssrRenderStyle(newUserData.value.email ? null : { display: "none" })}" data-v-829b50c3${_scopeId2}>(aktualizováno)</span></h3><p data-v-829b50c3${_scopeId2}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "section-head" }, [
                      createVNode("h3", null, [
                        createTextVNode("E-mail * "),
                        withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                          [vShow, newUserData.value.email]
                        ])
                      ]),
                      createVNode("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="line page-section" data-v-829b50c3${_scopeId}>`);
            _push2(ssrRenderComponent(EditPassword, {
              type: "new",
              reset: triggerReset.value,
              onUpdate: onPasswordUpdate
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-head" data-v-829b50c3${_scopeId2}><h3 data-v-829b50c3${_scopeId2}>Heslo k účtu * <span class="update" style="${ssrRenderStyle(newUserData.value.password ? null : { display: "none" })}" data-v-829b50c3${_scopeId2}>(aktualizováno)</span></h3><p data-v-829b50c3${_scopeId2}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "section-head" }, [
                      createVNode("h3", null, [
                        createTextVNode("Heslo k účtu * "),
                        withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                          [vShow, newUserData.value.password]
                        ])
                      ]),
                      createVNode("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="line page-section" data-v-829b50c3${_scopeId}>`);
            _push2(ssrRenderComponent(EditRole, {
              roles: allRoles.value || [],
              "old-role": oldUserData.value.role,
              reset: triggerReset.value,
              onUpdate: onRoleUpdate
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-head" data-v-829b50c3${_scopeId2}><h3 data-v-829b50c3${_scopeId2}>Role * <span class="update" style="${ssrRenderStyle(newUserData.value.role ? null : { display: "none" })}" data-v-829b50c3${_scopeId2}>(aktualizováno)</span></h3><p data-v-829b50c3${_scopeId2}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "section-head" }, [
                      createVNode("h3", null, [
                        createTextVNode("Role * "),
                        withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                          [vShow, newUserData.value.role]
                        ])
                      ]),
                      createVNode("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="line page-section" data-v-829b50c3${_scopeId}>`);
            _push2(ssrRenderComponent(EditAbbreviation, {
              "full-name": { name: newUserData.value.name, surname: newUserData.value.surname },
              "old-abbreviation": oldUserData.value.abbreviation,
              reset: triggerReset.value,
              onUpdate: onAbbreviationUpdate
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-head" data-v-829b50c3${_scopeId2}><h3 data-v-829b50c3${_scopeId2}>Přezdívka <span class="update" style="${ssrRenderStyle(newUserData.value.abbreviation ? null : { display: "none" })}" data-v-829b50c3${_scopeId2}>(aktualizováno)</span></h3><p data-v-829b50c3${_scopeId2}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "section-head" }, [
                      createVNode("h3", null, [
                        createTextVNode("Přezdívka "),
                        withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                          [vShow, newUserData.value.abbreviation]
                        ])
                      ]),
                      createVNode("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="line page-section" data-v-829b50c3${_scopeId}><div class="section-head" data-v-829b50c3${_scopeId}><h3 data-v-829b50c3${_scopeId}>Třída <span class="update" style="${ssrRenderStyle(newUserData.value.classes ? null : { display: "none" })}" data-v-829b50c3${_scopeId}>(aktualizováno)</span></h3><p data-v-829b50c3${_scopeId}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p></div>`);
            if (newUserData.value.role === "student") {
              _push2(ssrRenderComponent(EditClass, {
                "old-class-ids": oldUserData.value.classes,
                classes: allClasses.value || [],
                reset: triggerReset.value,
                onUpdate: onClassUpdate
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<p class="error" data-v-829b50c3${_scopeId}> Třídy můžete vybírat pouze pokud role uživatele je <strong data-v-829b50c3${_scopeId}>student</strong>. </p>`);
            }
            _push2(`</div>`);
            _push2(ssrRenderComponent(EditFormFooter, {
              "is-loading": submitLoading.value,
              "reset-function": resetUserData,
              "submit-function": createNewUser
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
              createVNode("div", { id: "settings" }, [
                createVNode("div", { class: "content" }, [
                  createVNode("div", { class: "line page-section" }, [
                    createVNode(EditFullName, {
                      "old-full-name": { name: oldUserData.value.name, surname: oldUserData.value.surname },
                      reset: triggerReset.value,
                      onUpdate: onFullNameUpdate
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "section-head" }, [
                          createVNode("h3", null, "Jméno a příjmení *"),
                          createVNode("p", null, "Změňte své jméno a příjmení")
                        ])
                      ]),
                      _: 1
                    }, 8, ["old-full-name", "reset"])
                  ]),
                  createVNode("div", { class: "line page-section" }, [
                    createVNode(EditEmail, {
                      "old-email": oldUserData.value.email,
                      reset: triggerReset.value,
                      onUpdate: onEmailUpdate
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "section-head" }, [
                          createVNode("h3", null, [
                            createTextVNode("E-mail * "),
                            withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                              [vShow, newUserData.value.email]
                            ])
                          ]),
                          createVNode("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
                        ])
                      ]),
                      _: 1
                    }, 8, ["old-email", "reset"])
                  ]),
                  createVNode("div", { class: "line page-section" }, [
                    createVNode(EditPassword, {
                      type: "new",
                      reset: triggerReset.value,
                      onUpdate: onPasswordUpdate
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "section-head" }, [
                          createVNode("h3", null, [
                            createTextVNode("Heslo k účtu * "),
                            withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                              [vShow, newUserData.value.password]
                            ])
                          ]),
                          createVNode("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
                        ])
                      ]),
                      _: 1
                    }, 8, ["reset"])
                  ]),
                  createVNode("div", { class: "line page-section" }, [
                    createVNode(EditRole, {
                      roles: allRoles.value || [],
                      "old-role": oldUserData.value.role,
                      reset: triggerReset.value,
                      onUpdate: onRoleUpdate
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "section-head" }, [
                          createVNode("h3", null, [
                            createTextVNode("Role * "),
                            withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                              [vShow, newUserData.value.role]
                            ])
                          ]),
                          createVNode("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
                        ])
                      ]),
                      _: 1
                    }, 8, ["roles", "old-role", "reset"])
                  ]),
                  createVNode("div", { class: "line page-section" }, [
                    createVNode(EditAbbreviation, {
                      "full-name": { name: newUserData.value.name, surname: newUserData.value.surname },
                      "old-abbreviation": oldUserData.value.abbreviation,
                      reset: triggerReset.value,
                      onUpdate: onAbbreviationUpdate
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "section-head" }, [
                          createVNode("h3", null, [
                            createTextVNode("Přezdívka "),
                            withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                              [vShow, newUserData.value.abbreviation]
                            ])
                          ]),
                          createVNode("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
                        ])
                      ]),
                      _: 1
                    }, 8, ["full-name", "old-abbreviation", "reset"])
                  ]),
                  createVNode("div", { class: "line page-section" }, [
                    createVNode("div", { class: "section-head" }, [
                      createVNode("h3", null, [
                        createTextVNode("Třída "),
                        withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                          [vShow, newUserData.value.classes]
                        ])
                      ]),
                      createVNode("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.")
                    ]),
                    newUserData.value.role === "student" ? (openBlock(), createBlock(EditClass, {
                      key: 0,
                      "old-class-ids": oldUserData.value.classes,
                      classes: allClasses.value || [],
                      reset: triggerReset.value,
                      onUpdate: onClassUpdate
                    }, null, 8, ["old-class-ids", "classes", "reset"])) : (openBlock(), createBlock("p", {
                      key: 1,
                      class: "error"
                    }, [
                      createTextVNode(" Třídy můžete vybírat pouze pokud role uživatele je "),
                      createVNode("strong", null, "student"),
                      createTextVNode(". ")
                    ]))
                  ]),
                  createVNode(EditFormFooter, {
                    "is-loading": submitLoading.value,
                    "reset-function": resetUserData,
                    "submit-function": createNewUser
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/users/add.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const add = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-829b50c3"]]);

export { add as default };
//# sourceMappingURL=add.vue.mjs.map
