import { a as __nuxt_component_0, _ as _export_sfc } from './server.mjs';
import { defineComponent, ref, mergeProps, withCtx, createVNode, createTextVNode, withDirectives, vShow, createBlock, openBlock, unref, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { E as EditFormFooter } from './Footer.vue.mjs';
import { u as useAlertsStore, _ as __nuxt_component_2 } from './Alerts.vue.mjs';
import { N as Navbar } from './Navbar.vue.mjs';
import { a as apiFetch } from './apiFetch.mjs';
import { E as EditFullName, a as EditEmail, b as EditRole, c as EditAbbreviation } from './Abbreviation.vue.mjs';
import { E as EditPassword } from './Password.vue.mjs';
import { E as EditClass } from './Class.vue.mjs';
import { useRoute, useRouter } from 'vue-router';
import { E as EditProfilePicture } from './ProfilePicture.vue.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import './nuxt-link.mjs';
import './account.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const id = route.params.id;
    const role = route.params.role;
    useHead({
      title: "Panel | Upravení uživatele - " + id,
      meta: [
        { name: "description", content: "Panel Settings User Information" }
      ]
    });
    const alertsStore = useAlertsStore();
    const submitLoading = ref(false);
    const triggerReset = ref(false);
    const allRoles = ref(void 0);
    const allClasses = ref(void 0);
    const oldUserData = ref({
      loaded: false,
      profilePicture: "",
      name: "",
      surname: "",
      email: "",
      password: "",
      abbreviation: "",
      role: "",
      classes: []
    });
    const newUserData = ref({
      profilePicture: void 0,
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
    const onProfilePictureUpdate = (updatedUserData) => {
      newUserData.value.profilePicture = updatedUserData.profilePicture;
    };
    const resetUserData = () => {
      newUserData.value = {
        profilePicture: void 0,
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
    const updateUser = async () => {
      submitLoading.value = true;
      const updateUserForm = new FormData();
      if (newUserData.value.profilePicture) updateUserForm.append("profilePicture", newUserData.value.profilePicture);
      if (newUserData.value.name) updateUserForm.append("name", newUserData.value.name);
      if (newUserData.value.surname) updateUserForm.append("surname", newUserData.value.surname);
      if (newUserData.value.email) updateUserForm.append("email", newUserData.value.email);
      if (newUserData.value.abbreviation) updateUserForm.append("abbreviation", newUserData.value.abbreviation);
      if (newUserData.value.role) updateUserForm.append("role", newUserData.value.role);
      if (newUserData.value.classes) updateUserForm.append("idClass", JSON.stringify(newUserData.value.classes));
      updateUserForm.append("idUser", id);
      await apiFetch("/user/update", {
        method: "PUT",
        body: updateUserForm,
        credentials: "include",
        ignoreResponseError: true,
        async onResponse({ response }) {
          const resCode = response._data.resCode.toString();
          switch (resCode) {
            case "2040":
              alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Nemáte oprávnění k této akci." });
              break;
            case "2050":
              alertsStore.addAlert({ type: "warning", title: "Úprava uživatele", message: "Nic nebylo zadáno ke změně." });
              break;
            case "2060":
              alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Špatné ID uživatele." });
              break;
            case "2070":
              alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Zkratka je již používána." });
              break;
            case "2080":
              alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Zkratka je příliš dlouhá." });
              break;
            case "2090":
              alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Špatný formát e-mailu." });
              break;
            case "2100":
              alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "E-mail je již používán." });
              break;
            case "2110":
              alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "E-mail je příliš dlouhý." });
              break;
            case "2120":
              alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Špatný formát souboru." });
              break;
            case "2131":
              alertsStore.addAlert({ type: "success", title: "Úprava uživatele", message: "Uživatel byl úspěšně upraven." });
              if (newUserData.value.name) oldUserData.value.name = newUserData.value.name;
              if (newUserData.value.surname) oldUserData.value.surname = newUserData.value.surname;
              if (newUserData.value.email) oldUserData.value.email = newUserData.value.email;
              if (newUserData.value.abbreviation) oldUserData.value.abbreviation = newUserData.value.abbreviation;
              if (newUserData.value.role) oldUserData.value.role = newUserData.value.role;
              if (newUserData.value.classes) oldUserData.value.classes = newUserData.value.classes;
              if (newUserData.value.profilePicture) {
                oldUserData.value.profilePicture = URL.createObjectURL(newUserData.value.profilePicture);
              }
              resetUserData();
              break;
            default:
              alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Nastala neznámá chyba." });
              break;
          }
        },
        async onRequestError() {
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Nastala neznámá chyba." });
        }
      }).finally(() => {
        submitLoading.value = false;
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({
        name: "panel",
        loading: !allRoles.value || !allClasses.value || !oldUserData.value.loaded
      }, _attrs), {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Navbar, {
              links: [
                { name: "Uživatelé", path: "/panel/users" },
                { name: unref(role), path: "/panel/users/" + unref(role) },
                { name: "Upravení", path: "/panel/users/" + unref(role) + "/edit" },
                { name: unref(id), path: "/panel/users/" + unref(role) + "/edit/" + unref(id) }
              ]
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, {
                links: [
                  { name: "Uživatelé", path: "/panel/users" },
                  { name: unref(role), path: "/panel/users/" + unref(role) },
                  { name: "Upravení", path: "/panel/users/" + unref(role) + "/edit" },
                  { name: unref(id), path: "/panel/users/" + unref(role) + "/edit/" + unref(id) }
                ]
              }, null, 8, ["links"])
            ];
          }
        }),
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div id="settings" data-v-f8966587${_scopeId}><div class="content" data-v-f8966587${_scopeId}><div class="line page-section no-border" data-v-f8966587${_scopeId}>`);
            _push2(ssrRenderComponent(EditProfilePicture, {
              class: "page-section",
              "old-profile-picture": oldUserData.value.profilePicture,
              onUpdate: onProfilePictureUpdate,
              reset: triggerReset.value
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-head" data-v-f8966587${_scopeId2}><h3 data-v-f8966587${_scopeId2}> Profilová fotka <span class="update" style="${ssrRenderStyle(newUserData.value.profilePicture ? null : { display: "none" })}" data-v-f8966587${_scopeId2}>(aktualizováno)</span></h3><p data-v-f8966587${_scopeId2}>Zde můžete změnit profilovou fotku uživatele. Nahrajte novou fotku, pokud si přejete aktualizovat stávající obrázek.</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "section-head" }, [
                      createVNode("h3", null, [
                        createTextVNode(" Profilová fotka "),
                        withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                          [vShow, newUserData.value.profilePicture]
                        ])
                      ]),
                      createVNode("p", null, "Zde můžete změnit profilovou fotku uživatele. Nahrajte novou fotku, pokud si přejete aktualizovat stávající obrázek.")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="line page-section" data-v-f8966587${_scopeId}>`);
            _push2(ssrRenderComponent(EditFullName, {
              "old-full-name": { name: oldUserData.value.name, surname: oldUserData.value.surname },
              reset: triggerReset.value,
              onUpdate: onFullNameUpdate
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-head" data-v-f8966587${_scopeId2}><h3 data-v-f8966587${_scopeId2}>Jméno a příjmení</h3><p data-v-f8966587${_scopeId2}>Zadejte nové jméno a příjmení uživatele, pokud je chcete změnit.</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "section-head" }, [
                      createVNode("h3", null, "Jméno a příjmení"),
                      createVNode("p", null, "Zadejte nové jméno a příjmení uživatele, pokud je chcete změnit.")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="line page-section" data-v-f8966587${_scopeId}>`);
            _push2(ssrRenderComponent(EditEmail, {
              "old-email": oldUserData.value.email,
              reset: triggerReset.value,
              onUpdate: onEmailUpdate
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-head" data-v-f8966587${_scopeId2}><h3 data-v-f8966587${_scopeId2}>E-mail <span class="update" style="${ssrRenderStyle(newUserData.value.email ? null : { display: "none" })}" data-v-f8966587${_scopeId2}>(aktualizováno)</span></h3><p data-v-f8966587${_scopeId2}>Zadejte novou e-mailovou adresu uživatele, pokud ji chcete změnit.</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "section-head" }, [
                      createVNode("h3", null, [
                        createTextVNode("E-mail "),
                        withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                          [vShow, newUserData.value.email]
                        ])
                      ]),
                      createVNode("p", null, "Zadejte novou e-mailovou adresu uživatele, pokud ji chcete změnit.")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="line page-section" data-v-f8966587${_scopeId}>`);
            _push2(ssrRenderComponent(EditPassword, {
              type: "new",
              reset: triggerReset.value,
              onUpdate: onPasswordUpdate
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-head" data-v-f8966587${_scopeId2}><h3 data-v-f8966587${_scopeId2}>Heslo k účtu <span class="update" style="${ssrRenderStyle(newUserData.value.password ? null : { display: "none" })}" data-v-f8966587${_scopeId2}>(aktualizováno)</span></h3><p data-v-f8966587${_scopeId2}>Zadejte nové heslo, pokud chcete uživateli změnit přístupové údaje. Heslo musí splňovat bezpečnostní požadavky.</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "section-head" }, [
                      createVNode("h3", null, [
                        createTextVNode("Heslo k účtu "),
                        withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                          [vShow, newUserData.value.password]
                        ])
                      ]),
                      createVNode("p", null, "Zadejte nové heslo, pokud chcete uživateli změnit přístupové údaje. Heslo musí splňovat bezpečnostní požadavky.")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="line page-section" data-v-f8966587${_scopeId}>`);
            _push2(ssrRenderComponent(EditRole, {
              roles: allRoles.value || [],
              "old-role": oldUserData.value.role,
              reset: triggerReset.value,
              onUpdate: onRoleUpdate
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-head" data-v-f8966587${_scopeId2}><h3 data-v-f8966587${_scopeId2}>Role <span class="update" style="${ssrRenderStyle(newUserData.value.role ? null : { display: "none" })}" data-v-f8966587${_scopeId2}>(aktualizováno)</span></h3><p data-v-f8966587${_scopeId2}>Zvolte roli, kterou má uživatel mít. Role určuje oprávnění a možnosti uživatele v systému.</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "section-head" }, [
                      createVNode("h3", null, [
                        createTextVNode("Role "),
                        withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                          [vShow, newUserData.value.role]
                        ])
                      ]),
                      createVNode("p", null, "Zvolte roli, kterou má uživatel mít. Role určuje oprávnění a možnosti uživatele v systému.")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="line page-section" data-v-f8966587${_scopeId}>`);
            _push2(ssrRenderComponent(EditAbbreviation, {
              "full-name": { name: newUserData.value.name ? newUserData.value.name : oldUserData.value.name, surname: newUserData.value.surname ? newUserData.value.surname : oldUserData.value.surname },
              "old-abbreviation": oldUserData.value.abbreviation,
              reset: triggerReset.value,
              onUpdate: onAbbreviationUpdate
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-head" data-v-f8966587${_scopeId2}><h3 data-v-f8966587${_scopeId2}>Přezdívka <span class="update" style="${ssrRenderStyle(newUserData.value.abbreviation ? null : { display: "none" })}" data-v-f8966587${_scopeId2}>(aktualizováno)</span></h3><p data-v-f8966587${_scopeId2}>Zadejte novou přezdívku uživatele, pokud ji chcete změnit. Přezdívka slouží jako zkratka jména například pro rychlou identifikaci.</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "section-head" }, [
                      createVNode("h3", null, [
                        createTextVNode("Přezdívka "),
                        withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                          [vShow, newUserData.value.abbreviation]
                        ])
                      ]),
                      createVNode("p", null, "Zadejte novou přezdívku uživatele, pokud ji chcete změnit. Přezdívka slouží jako zkratka jména například pro rychlou identifikaci.")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="line page-section" data-v-f8966587${_scopeId}><div class="section-head" data-v-f8966587${_scopeId}><h3 data-v-f8966587${_scopeId}>Třída <span class="update" style="${ssrRenderStyle(newUserData.value.classes ? null : { display: "none" })}" data-v-f8966587${_scopeId}>(aktualizováno)</span></h3><p data-v-f8966587${_scopeId}>Vyberte třídu nebo více tříd, které chcete uživateli přiřadit.</p></div>`);
            if (newUserData.value.role ? newUserData.value.role === "student" : oldUserData.value.role === "student") {
              _push2(ssrRenderComponent(EditClass, {
                "old-class-ids": oldUserData.value.classes,
                classes: allClasses.value || [],
                reset: triggerReset.value,
                onUpdate: onClassUpdate
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<p class="error" data-v-f8966587${_scopeId}> Třídy můžete vybírat pouze pokud role uživatele je <strong data-v-f8966587${_scopeId}>student</strong>. </p>`);
            }
            _push2(`</div>`);
            _push2(ssrRenderComponent(EditFormFooter, {
              "is-loading": submitLoading.value,
              "reset-function": resetUserData,
              "submit-function": updateUser
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(__nuxt_component_2, null, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { id: "settings" }, [
                createVNode("div", { class: "content" }, [
                  createVNode("div", { class: "line page-section no-border" }, [
                    createVNode(EditProfilePicture, {
                      class: "page-section",
                      "old-profile-picture": oldUserData.value.profilePicture,
                      onUpdate: onProfilePictureUpdate,
                      reset: triggerReset.value
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "section-head" }, [
                          createVNode("h3", null, [
                            createTextVNode(" Profilová fotka "),
                            withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                              [vShow, newUserData.value.profilePicture]
                            ])
                          ]),
                          createVNode("p", null, "Zde můžete změnit profilovou fotku uživatele. Nahrajte novou fotku, pokud si přejete aktualizovat stávající obrázek.")
                        ])
                      ]),
                      _: 1
                    }, 8, ["old-profile-picture", "reset"])
                  ]),
                  createVNode("div", { class: "line page-section" }, [
                    createVNode(EditFullName, {
                      "old-full-name": { name: oldUserData.value.name, surname: oldUserData.value.surname },
                      reset: triggerReset.value,
                      onUpdate: onFullNameUpdate
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "section-head" }, [
                          createVNode("h3", null, "Jméno a příjmení"),
                          createVNode("p", null, "Zadejte nové jméno a příjmení uživatele, pokud je chcete změnit.")
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
                            createTextVNode("E-mail "),
                            withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                              [vShow, newUserData.value.email]
                            ])
                          ]),
                          createVNode("p", null, "Zadejte novou e-mailovou adresu uživatele, pokud ji chcete změnit.")
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
                            createTextVNode("Heslo k účtu "),
                            withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                              [vShow, newUserData.value.password]
                            ])
                          ]),
                          createVNode("p", null, "Zadejte nové heslo, pokud chcete uživateli změnit přístupové údaje. Heslo musí splňovat bezpečnostní požadavky.")
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
                            createTextVNode("Role "),
                            withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                              [vShow, newUserData.value.role]
                            ])
                          ]),
                          createVNode("p", null, "Zvolte roli, kterou má uživatel mít. Role určuje oprávnění a možnosti uživatele v systému.")
                        ])
                      ]),
                      _: 1
                    }, 8, ["roles", "old-role", "reset"])
                  ]),
                  createVNode("div", { class: "line page-section" }, [
                    createVNode(EditAbbreviation, {
                      "full-name": { name: newUserData.value.name ? newUserData.value.name : oldUserData.value.name, surname: newUserData.value.surname ? newUserData.value.surname : oldUserData.value.surname },
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
                          createVNode("p", null, "Zadejte novou přezdívku uživatele, pokud ji chcete změnit. Přezdívka slouží jako zkratka jména například pro rychlou identifikaci.")
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
                      createVNode("p", null, "Vyberte třídu nebo více tříd, které chcete uživateli přiřadit.")
                    ]),
                    (newUserData.value.role ? newUserData.value.role === "student" : oldUserData.value.role === "student") ? (openBlock(), createBlock(EditClass, {
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
                    "submit-function": updateUser
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/users/[role]/edit/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f8966587"]]);

export { _id_ as default };
//# sourceMappingURL=_id_.vue.mjs.map
