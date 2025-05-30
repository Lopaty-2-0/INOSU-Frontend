import { a as __nuxt_component_0, _ as _export_sfc } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createVNode, createTextVNode, withDirectives, vShow, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { E as EditProfilePicture } from './ProfilePicture.vue.mjs';
import { E as EditFormFooter } from './Footer.vue.mjs';
import { N as Navigation } from './Navigation.vue.mjs';
import { u as useAlertsStore, _ as __nuxt_component_2 } from './Alerts.vue.mjs';
import { N as Navbar } from './Navbar.vue.mjs';
import { storeToRefs } from 'pinia';
import { u as useAccountStore } from './account.mjs';
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
import 'vue-router';
import './index2.mjs';
import './Loading.vue.mjs';
import './nuxt-link.mjs';
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
      title: "Panel | Nastavení - Profil",
      meta: [
        { name: "description", content: "Panel Settings User Information" }
      ]
    });
    const alertsStore = useAlertsStore();
    const accountStore = useAccountStore();
    const { getAccountData: accountData } = storeToRefs(accountStore);
    const submitLoading = ref(false);
    const triggerReset = ref(false);
    const oldUserData = computed(() => ({
      profilePicture: "http://89.203.248.163/uploads/profilePictures/" + accountData.value.profilePicture
    }));
    const newUserData = ref({
      profilePicture: void 0
    });
    const onProfilePictureUpdate = (updatedUserData) => {
      newUserData.value.profilePicture = updatedUserData.profilePicture;
    };
    const resetUserData = () => {
      newUserData.value = {
        profilePicture: void 0
      };
      triggerReset.value = true;
      setTimeout(() => {
        triggerReset.value = false;
      }, 100);
    };
    const updateUserData = async () => {
      submitLoading.value = true;
      if (newUserData.value.profilePicture) {
        const updateProfileForm = new FormData();
        updateProfileForm.append("profilePicture", newUserData.value.profilePicture);
        await apiFetch("/user/update", {
          method: "PUT",
          body: updateProfileForm,
          credentials: "include",
          ignoreResponseError: true,
          async onResponse({ response }) {
            const resCode = response._data.resCode.toString();
            const data = response._data.data;
            switch (resCode) {
              case "2010":
                alertsStore.addAlert({ type: "error", title: "Změna profilu", message: "Profilová fotka nebyla zadána." });
                break;
              case "2020":
                alertsStore.addAlert({ type: "error", title: "Změna profilu", message: "Nepodporovaný formát obrázku." });
                break;
              case "2031":
                alertsStore.addAlert({ type: "success", title: "Změna profilu", message: "Profilový obrázek byl aktualizován." });
                accountStore.updateProfilePicture(data.user.profilePicture);
                newUserData.value.profilePicture = void 0;
                break;
              default:
                alertsStore.addAlert({ type: "error", title: "Změna profilu", message: "Nastala neznámá chyba." });
                break;
            }
          },
          async onRequestError() {
            alertsStore.addAlert({ type: "error", title: "Změna profilu", message: "Nastala neznámá chyba." });
          }
        });
      }
      submitLoading.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "panel" }, _attrs), {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Navbar, { links: [
              { name: "Nastavení", path: "/panel/settings" },
              { name: "Profil", path: "/panel/settings" }
            ] }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, { links: [
                { name: "Nastavení", path: "/panel/settings" },
                { name: "Profil", path: "/panel/settings" }
              ] })
            ];
          }
        }),
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div id="settings" data-v-9ed82933${_scopeId}>`);
            _push2(ssrRenderComponent(Navigation, {
              class: "navigation",
              title: "Nastavení",
              "active-link-id": 0,
              links: [
                { name: "Profil", path: "/panel/settings" },
                { name: "Zabezpečení", path: "/panel/settings/security" },
                { name: "Přizpůsobení", path: "/panel/settings/customization" }
              ]
            }, null, _parent2, _scopeId));
            _push2(`<div class="content" data-v-9ed82933${_scopeId}>`);
            _push2(ssrRenderComponent(EditProfilePicture, {
              class: "page-section",
              "old-profile-picture": oldUserData.value.profilePicture,
              onUpdate: onProfilePictureUpdate,
              reset: triggerReset.value
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-head" data-v-9ed82933${_scopeId2}><h3 data-v-9ed82933${_scopeId2}> Profilová fotka <span class="update" style="${ssrRenderStyle(newUserData.value.profilePicture ? null : { display: "none" })}" data-v-9ed82933${_scopeId2}>(aktualizováno)</span></h3><p data-v-9ed82933${_scopeId2}>Změňte svůj profilový obrázek</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "section-head" }, [
                      createVNode("h3", null, [
                        createTextVNode(" Profilová fotka "),
                        withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                          [vShow, newUserData.value.profilePicture]
                        ])
                      ]),
                      createVNode("p", null, "Změňte svůj profilový obrázek")
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
                  "active-link-id": 0,
                  links: [
                    { name: "Profil", path: "/panel/settings" },
                    { name: "Zabezpečení", path: "/panel/settings/security" },
                    { name: "Přizpůsobení", path: "/panel/settings/customization" }
                  ]
                }),
                createVNode("div", { class: "content" }, [
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
                        createVNode("p", null, "Změňte svůj profilový obrázek")
                      ])
                    ]),
                    _: 1
                  }, 8, ["old-profile-picture", "reset"]),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/settings/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9ed82933"]]);

export { index as default };
//# sourceMappingURL=index.vue4.mjs.map
