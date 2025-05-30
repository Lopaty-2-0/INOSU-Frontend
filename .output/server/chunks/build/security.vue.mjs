import { a as __nuxt_component_0, _ as _export_sfc } from './server.mjs';
import __nuxt_component_0$1 from './index2.mjs';
import { defineComponent, ref, mergeProps, withCtx, createVNode, createTextVNode, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { E as EditPassword } from './Password.vue.mjs';
import { E as EditFormFooter } from './Footer.vue.mjs';
import { N as Navigation } from './Navigation.vue.mjs';
import { u as useAlertsStore, _ as __nuxt_component_2 } from './Alerts.vue.mjs';
import { N as Navbar } from './Navbar.vue.mjs';
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
import './nuxt-link.mjs';
import './account.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "security",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Panel | Nastavení - Zabezpečení",
      meta: [
        { name: "description", content: "Panel Settings User Information" }
      ]
    });
    const alertsStore = useAlertsStore();
    const submitLoading = ref(false);
    const triggerReset = ref(false);
    const passwordRulesCheck = ref([false, false, false, false]);
    const userData = ref({
      passwords: {
        old: "",
        new: ""
      }
    });
    const checkPasswordRules = () => {
      passwordRulesCheck.value[0] = userData.value.passwords.new.length >= 5;
      if (!passwordRulesCheck.value[0]) {
        passwordRulesCheck.value = [false, false, false, false];
        return;
      }
      passwordRulesCheck.value[1] = !!(userData.value.passwords.new.match(/[A-Z]/g) && userData.value.passwords.new.match(/[a-z]/g) && userData.value.passwords.new.match(/[0-9]/g));
      passwordRulesCheck.value[2] = !!userData.value.passwords.new.match(/[@#$%&*+=]/g);
      passwordRulesCheck.value[3] = !userData.value.passwords.new.match(/\s/g);
    };
    const onPasswordsUpdate = (passwordsInputs) => {
      if (!passwordsInputs.old || !passwordsInputs.new) {
        userData.value.passwords.old = "";
        userData.value.passwords.new = "";
        return;
      }
      userData.value.passwords = {
        old: passwordsInputs.old,
        new: passwordsInputs.new
      };
      checkPasswordRules();
    };
    const resetUserData = () => {
      userData.value = {
        passwords: {
          old: "",
          new: ""
        }
      };
      passwordRulesCheck.value = [false, false, false, false];
      triggerReset.value = true;
      setTimeout(() => {
        triggerReset.value = false;
      }, 100);
    };
    const updateUserData = async () => {
      submitLoading.value = true;
      if (userData.value.passwords.old && userData.value.passwords.new) {
        await apiFetch("/user/update/password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: {
            oldPassword: userData.value.passwords.old,
            newPassword: userData.value.passwords.new
          },
          credentials: "include",
          ignoreResponseError: true,
          async onResponse({ response }) {
            const resCode = response._data.resCode.toString();
            switch (resCode) {
              case "11010":
                alertsStore.addAlert({ type: "error", title: "Změna hesla", message: "Staré heslo nebylo zadáno." });
                break;
              case "11020":
                alertsStore.addAlert({ type: "error", title: "Změna hesla", message: "Nové heslo nebylo zadáno." });
                break;
              case "11030":
                alertsStore.addAlert({ type: "error", title: "Změna hesla", message: "Nesprávné staré heslo." });
                break;
              case "11040":
                alertsStore.addAlert({ type: "error", title: "Změna hesla", message: "Nové heslo musí mít minimálně 5 znaků." });
                break;
              case "11051":
                alertsStore.addAlert({ type: "success", title: "Změna hesla", message: "Heslo bylo úspěšně změněno." });
                break;
              default:
                alertsStore.addAlert({ type: "error", title: "Změna hesla", message: "Nastala neznámá chyba." });
                break;
            }
          },
          async onRequestError() {
            alertsStore.addAlert({ type: "error", title: "Změna hesla", message: "Nastala neznámá chyba." });
          }
        });
      }
      submitLoading.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_Icon = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "panel" }, _attrs), {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Navbar, { links: [
              { name: "Nastavení", path: "/panel/settings" },
              { name: "Zabezpečení", path: "/panel/settings/security" }
            ] }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, { links: [
                { name: "Nastavení", path: "/panel/settings" },
                { name: "Zabezpečení", path: "/panel/settings/security" }
              ] })
            ];
          }
        }),
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div id="settings" data-v-d8367ca6${_scopeId}>`);
            _push2(ssrRenderComponent(Navigation, {
              class: "navigation",
              title: "Nastavení",
              "active-link-id": 1,
              links: [
                { name: "Profil", path: "/panel/settings" },
                { name: "Zabezpečení", path: "/panel/settings/security" },
                { name: "Přizpůsobení", path: "/panel/settings/customization" }
              ]
            }, null, _parent2, _scopeId));
            _push2(`<div class="content" data-v-d8367ca6${_scopeId}>`);
            _push2(ssrRenderComponent(EditPassword, {
              class: "page-section",
              onUpdate: onPasswordsUpdate,
              reset: triggerReset.value
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-head" data-v-d8367ca6${_scopeId2}><h3 data-v-d8367ca6${_scopeId2}>Resetování hesla `);
                  if (userData.value.passwords.new !== userData.value.passwords.old && passwordRulesCheck.value[0] && userData.value.passwords.old !== "") {
                    _push3(`<span class="update" data-v-d8367ca6${_scopeId2}>(aktualizováno)</span>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</h3><p data-v-d8367ca6${_scopeId2}>Jednoduše změňte své heslo na jiné</p><div class="password-rules" data-v-d8367ca6${_scopeId2}><h4 data-v-d8367ca6${_scopeId2}>Doporučená pravidla hesla</h4><ul data-v-d8367ca6${_scopeId2}><li data-v-d8367ca6${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Icon, {
                    class: "icon",
                    size: "16px",
                    name: "material-symbols:play-arrow-rounded"
                  }, null, _parent3, _scopeId2));
                  _push3(` <p data-v-d8367ca6${_scopeId2}>Obsahuje minimálně 5 znaků `);
                  if (passwordRulesCheck.value[0]) {
                    _push3(ssrRenderComponent(_component_Icon, {
                      size: "16px",
                      name: "material-symbols:check-rounded",
                      class: "icon"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</p></li><li data-v-d8367ca6${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Icon, {
                    class: "icon",
                    size: "16px",
                    name: "material-symbols:play-arrow-rounded"
                  }, null, _parent3, _scopeId2));
                  _push3(` <p data-v-d8367ca6${_scopeId2}>Obsahuje 2 až 3 znaky: velké, malé, čísla `);
                  if (passwordRulesCheck.value[1]) {
                    _push3(ssrRenderComponent(_component_Icon, {
                      size: "16px",
                      name: "material-symbols:check-rounded",
                      class: "icon"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</p></li><li data-v-d8367ca6${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Icon, {
                    class: "icon",
                    size: "16px",
                    name: "material-symbols:play-arrow-rounded"
                  }, null, _parent3, _scopeId2));
                  _push3(` <p data-v-d8367ca6${_scopeId2}>Obsahuje aspoň 1 speciální znak: @, #, $, %, &amp;, *, +, = `);
                  if (passwordRulesCheck.value[2]) {
                    _push3(ssrRenderComponent(_component_Icon, {
                      size: "16px",
                      name: "material-symbols:check-rounded",
                      class: "icon"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</p></li><li data-v-d8367ca6${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Icon, {
                    class: "icon",
                    size: "16px",
                    name: "material-symbols:play-arrow-rounded"
                  }, null, _parent3, _scopeId2));
                  _push3(` <p data-v-d8367ca6${_scopeId2}>Neobsahuje žádné mezery `);
                  if (passwordRulesCheck.value[3]) {
                    _push3(ssrRenderComponent(_component_Icon, {
                      size: "16px",
                      name: "material-symbols:check-rounded",
                      class: "icon"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</p></li><li data-v-d8367ca6${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Icon, {
                    class: "icon",
                    size: "16px",
                    name: "material-symbols:play-arrow-rounded"
                  }, null, _parent3, _scopeId2));
                  _push3(` <p data-v-d8367ca6${_scopeId2}>Neobsahuje žádné osobní informace</p></li></ul></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "section-head" }, [
                      createVNode("h3", null, [
                        createTextVNode("Resetování hesla "),
                        userData.value.passwords.new !== userData.value.passwords.old && passwordRulesCheck.value[0] && userData.value.passwords.old !== "" ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "update"
                        }, "(aktualizováno)")) : createCommentVNode("", true)
                      ]),
                      createVNode("p", null, "Jednoduše změňte své heslo na jiné"),
                      createVNode("div", { class: "password-rules" }, [
                        createVNode("h4", null, "Doporučená pravidla hesla"),
                        createVNode("ul", null, [
                          createVNode("li", null, [
                            createVNode(_component_Icon, {
                              class: "icon",
                              size: "16px",
                              name: "material-symbols:play-arrow-rounded"
                            }),
                            createTextVNode(),
                            createVNode("p", null, [
                              createTextVNode("Obsahuje minimálně 5 znaků "),
                              passwordRulesCheck.value[0] ? (openBlock(), createBlock(_component_Icon, {
                                key: 0,
                                size: "16px",
                                name: "material-symbols:check-rounded",
                                class: "icon"
                              })) : createCommentVNode("", true)
                            ])
                          ]),
                          createVNode("li", null, [
                            createVNode(_component_Icon, {
                              class: "icon",
                              size: "16px",
                              name: "material-symbols:play-arrow-rounded"
                            }),
                            createTextVNode(),
                            createVNode("p", null, [
                              createTextVNode("Obsahuje 2 až 3 znaky: velké, malé, čísla "),
                              passwordRulesCheck.value[1] ? (openBlock(), createBlock(_component_Icon, {
                                key: 0,
                                size: "16px",
                                name: "material-symbols:check-rounded",
                                class: "icon"
                              })) : createCommentVNode("", true)
                            ])
                          ]),
                          createVNode("li", null, [
                            createVNode(_component_Icon, {
                              class: "icon",
                              size: "16px",
                              name: "material-symbols:play-arrow-rounded"
                            }),
                            createTextVNode(),
                            createVNode("p", null, [
                              createTextVNode("Obsahuje aspoň 1 speciální znak: @, #, $, %, &, *, +, = "),
                              passwordRulesCheck.value[2] ? (openBlock(), createBlock(_component_Icon, {
                                key: 0,
                                size: "16px",
                                name: "material-symbols:check-rounded",
                                class: "icon"
                              })) : createCommentVNode("", true)
                            ])
                          ]),
                          createVNode("li", null, [
                            createVNode(_component_Icon, {
                              class: "icon",
                              size: "16px",
                              name: "material-symbols:play-arrow-rounded"
                            }),
                            createTextVNode(),
                            createVNode("p", null, [
                              createTextVNode("Neobsahuje žádné mezery "),
                              passwordRulesCheck.value[3] ? (openBlock(), createBlock(_component_Icon, {
                                key: 0,
                                size: "16px",
                                name: "material-symbols:check-rounded",
                                class: "icon"
                              })) : createCommentVNode("", true)
                            ])
                          ]),
                          createVNode("li", null, [
                            createVNode(_component_Icon, {
                              class: "icon",
                              size: "16px",
                              name: "material-symbols:play-arrow-rounded"
                            }),
                            createTextVNode(),
                            createVNode("p", null, "Neobsahuje žádné osobní informace")
                          ])
                        ])
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(EditFormFooter, {
              "submit-function": updateUserData,
              "reset-function": resetUserData,
              "is-loading": submitLoading.value
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(__nuxt_component_2, null, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { id: "settings" }, [
                createVNode(Navigation, {
                  class: "navigation",
                  title: "Nastavení",
                  "active-link-id": 1,
                  links: [
                    { name: "Profil", path: "/panel/settings" },
                    { name: "Zabezpečení", path: "/panel/settings/security" },
                    { name: "Přizpůsobení", path: "/panel/settings/customization" }
                  ]
                }),
                createVNode("div", { class: "content" }, [
                  createVNode(EditPassword, {
                    class: "page-section",
                    onUpdate: onPasswordsUpdate,
                    reset: triggerReset.value
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, [
                          createTextVNode("Resetování hesla "),
                          userData.value.passwords.new !== userData.value.passwords.old && passwordRulesCheck.value[0] && userData.value.passwords.old !== "" ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "update"
                          }, "(aktualizováno)")) : createCommentVNode("", true)
                        ]),
                        createVNode("p", null, "Jednoduše změňte své heslo na jiné"),
                        createVNode("div", { class: "password-rules" }, [
                          createVNode("h4", null, "Doporučená pravidla hesla"),
                          createVNode("ul", null, [
                            createVNode("li", null, [
                              createVNode(_component_Icon, {
                                class: "icon",
                                size: "16px",
                                name: "material-symbols:play-arrow-rounded"
                              }),
                              createTextVNode(),
                              createVNode("p", null, [
                                createTextVNode("Obsahuje minimálně 5 znaků "),
                                passwordRulesCheck.value[0] ? (openBlock(), createBlock(_component_Icon, {
                                  key: 0,
                                  size: "16px",
                                  name: "material-symbols:check-rounded",
                                  class: "icon"
                                })) : createCommentVNode("", true)
                              ])
                            ]),
                            createVNode("li", null, [
                              createVNode(_component_Icon, {
                                class: "icon",
                                size: "16px",
                                name: "material-symbols:play-arrow-rounded"
                              }),
                              createTextVNode(),
                              createVNode("p", null, [
                                createTextVNode("Obsahuje 2 až 3 znaky: velké, malé, čísla "),
                                passwordRulesCheck.value[1] ? (openBlock(), createBlock(_component_Icon, {
                                  key: 0,
                                  size: "16px",
                                  name: "material-symbols:check-rounded",
                                  class: "icon"
                                })) : createCommentVNode("", true)
                              ])
                            ]),
                            createVNode("li", null, [
                              createVNode(_component_Icon, {
                                class: "icon",
                                size: "16px",
                                name: "material-symbols:play-arrow-rounded"
                              }),
                              createTextVNode(),
                              createVNode("p", null, [
                                createTextVNode("Obsahuje aspoň 1 speciální znak: @, #, $, %, &, *, +, = "),
                                passwordRulesCheck.value[2] ? (openBlock(), createBlock(_component_Icon, {
                                  key: 0,
                                  size: "16px",
                                  name: "material-symbols:check-rounded",
                                  class: "icon"
                                })) : createCommentVNode("", true)
                              ])
                            ]),
                            createVNode("li", null, [
                              createVNode(_component_Icon, {
                                class: "icon",
                                size: "16px",
                                name: "material-symbols:play-arrow-rounded"
                              }),
                              createTextVNode(),
                              createVNode("p", null, [
                                createTextVNode("Neobsahuje žádné mezery "),
                                passwordRulesCheck.value[3] ? (openBlock(), createBlock(_component_Icon, {
                                  key: 0,
                                  size: "16px",
                                  name: "material-symbols:check-rounded",
                                  class: "icon"
                                })) : createCommentVNode("", true)
                              ])
                            ]),
                            createVNode("li", null, [
                              createVNode(_component_Icon, {
                                class: "icon",
                                size: "16px",
                                name: "material-symbols:play-arrow-rounded"
                              }),
                              createTextVNode(),
                              createVNode("p", null, "Neobsahuje žádné osobní informace")
                            ])
                          ])
                        ])
                      ])
                    ]),
                    _: 1
                  }, 8, ["reset"]),
                  createVNode(EditFormFooter, {
                    "submit-function": updateUserData,
                    "reset-function": resetUserData,
                    "is-loading": submitLoading.value
                  }, null, 8, ["is-loading"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/settings/security.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const security = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d8367ca6"]]);

export { security as default };
//# sourceMappingURL=security.vue.mjs.map
