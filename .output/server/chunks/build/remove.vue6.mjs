import { a as __nuxt_component_0, _ as _export_sfc } from './server.mjs';
import __nuxt_component_0$1 from './index2.mjs';
import { defineComponent, ref, mergeProps, createSlots, withCtx, unref, createVNode, toDisplayString, withDirectives, vModelText, createTextVNode, vShow, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { A as ActionBar } from './ActionBar.vue.mjs';
import { N as Navbar } from './Navbar.vue.mjs';
import { U as UsersGrid, G as GridNavigation } from './Navigation.vue2.mjs';
import { u as useAlertsStore, _ as __nuxt_component_2 } from './Alerts.vue.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import './nuxt-link.mjs';
import './account.mjs';
import 'moment';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "remove",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const classId = route.params.class;
    useHead({
      title: "Panel | Odstranění uživatelů -  Třída: " + classId,
      meta: [{ name: "description", content: "Panel Settings User Information" }]
    });
    const loading = ref(false);
    const alertsStore = useAlertsStore();
    const users = ref(null);
    const numberOfPages = ref(0);
    const activePage = ref(0);
    const selectedUsers = ref([]);
    const resetSelectedUsers = ref(false);
    const searchInput = ref("");
    const searchedUsers = ref([]);
    const searchUsers = () => {
      const inputToArray = searchInput.value.split(" ");
      const allSearchedUsers = [];
      if (!users.value) return;
      users.value.forEach((user) => {
        const searchResult = [
          user.name,
          user.surname,
          user.email,
          user.abbreviation || ""
        ].some((word) => {
          let result = false;
          inputToArray.forEach((inputWord) => {
            result = word.toLowerCase().includes(inputWord.toLowerCase());
          });
          return result;
        });
        if (searchResult) allSearchedUsers.push(user);
      });
      searchedUsers.value = allSearchedUsers;
    };
    const pingResetSelectedUsers = () => {
      resetSelectedUsers.value = false;
      setTimeout(() => {
        resetSelectedUsers.value = true;
      }, 10);
    };
    const removeUsers = async () => {
      if (!users.value || !selectedUsers.value) return;
      loading.value = true;
      await apiFetch("/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          idUser: selectedUsers.value.map((user) => user.id)
        },
        ignoreResponseError: true,
        credentials: "include",
        onResponse({ response }) {
          const resCode = response._data.resCode.toString();
          switch (resCode) {
            case "3010":
              alertsStore.addAlert({ type: "error", title: "Odstranění uživatelů", message: "Nedostatečné oprávnění pro odstranění uživatelů." });
              break;
            case "3020":
              alertsStore.addAlert({ type: "warning", title: "Odstranění uživatelů", message: "Žádný uživatel nebyl vybrán." });
              break;
            case "3030":
              alertsStore.addAlert({ type: "warning", title: "Odstranění uživatelů", message: "Nemůžete odstranit sami sebe." });
              break;
            case "3040":
              alertsStore.addAlert({ type: "warning", title: "Odstranění uživatelů", message: "Nebyl odstraněn žádný uživatel." });
              break;
            case "3051":
              alertsStore.addAlert({ type: "success", title: "Odstranění uživatelů", message: "Uživatelé byli úspěšně odstraněni." });
              if (users.value) {
                users.value = users.value.filter((user) => {
                  return !selectedUsers.value.some(
                    (selectedUser) => selectedUser.id === user.id
                  );
                });
                searchedUsers.value = [...users.value];
                pingResetSelectedUsers();
              }
              break;
            default:
              alertsStore.addAlert({ type: "error", title: "Odstranění uživatelů", message: "Nastala neznámá chyba." });
              break;
          }
        },
        onRequestError() {
          alertsStore.addAlert({ type: "error", title: "Odstranění uživatelů", message: "Nastala neznámá chyba." });
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
        loading: !users.value
      }, _attrs), createSlots({
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Navbar, {
              links: [
                { name: "Uživatelé", path: "/panel/users" },
                { name: "student", path: "/panel/users/student" },
                { name: "Třída: " + unref(classId), path: "/panel/users/student/" + unref(classId) },
                { name: "Odstranění", path: "/panel/users/student/" + unref(classId) + "/remove" }
              ]
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, {
                links: [
                  { name: "Uživatelé", path: "/panel/users" },
                  { name: "student", path: "/panel/users/student" },
                  { name: "Třída: " + unref(classId), path: "/panel/users/student/" + unref(classId) },
                  { name: "Odstranění", path: "/panel/users/student/" + unref(classId) + "/remove" }
                ]
              }, null, 8, ["links"])
            ];
          }
        }),
        _: 2
      }, [
        users.value ? {
          name: "content",
          fn: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div id="users" data-v-255263fc${_scopeId}><div class="content" data-v-255263fc${_scopeId}>`);
              _push2(ssrRenderComponent(ActionBar, {
                class: "action-bar",
                description: "Správa uživatelů",
                active: 2,
                texts: ["Přidat", "Upravit", "Odebrat"],
                icons: [
                  "material-symbols:add-rounded",
                  "material-symbols:edit-rounded",
                  "material-symbols:delete-rounded"
                ],
                "navigate-to": [
                  `/panel/users/add`,
                  `/panel/users/student/${unref(classId)}/edit`,
                  `/panel/users/student/${unref(classId)}/remove`
                ]
              }, null, _parent2, _scopeId));
              _push2(`<div class="line" data-v-255263fc${_scopeId}><div class="section-head" data-v-255263fc${_scopeId}><h3 data-v-255263fc${_scopeId}> Uživatelé: ${ssrInterpolate(selectedUsers.value.length)} / ${ssrInterpolate(searchedUsers.value.length)}</h3><p data-v-255263fc${_scopeId}>Vyberte uživatele, které chcete odstranit, nebo použijte vyhledávání pro zúžení výběru.</p></div><div class="search" data-v-255263fc${_scopeId}><input type="text" name="searchInput" placeholder="Hledat uživatele"${ssrRenderAttr("value", searchInput.value)} data-v-255263fc${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                class: "icon",
                name: "material-symbols:search-rounded"
              }, null, _parent2, _scopeId));
              _push2(`</div></div><div class="buttons" data-v-255263fc${_scopeId}><button class="remove" data-v-255263fc${_scopeId}> Odstranit `);
              _push2(ssrRenderComponent(Loading, {
                style: loading.value ? null : { display: "none" },
                size: "5px",
                color: "var(--actionBar-actions-remove-color)"
              }, null, _parent2, _scopeId));
              _push2(`</button><button class="reset" data-v-255263fc${_scopeId}> Zrušit vše </button></div><div class="users" data-v-255263fc${_scopeId}>`);
              _push2(ssrRenderComponent(UsersGrid, {
                users: searchedUsers.value,
                "users-per-page": 12,
                action: "remove",
                "active-page": activePage.value,
                reset: resetSelectedUsers.value,
                "onGet:numberOfPages": (value) => numberOfPages.value = value,
                "onGet:selectedUsers": (value) => selectedUsers.value = value
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(GridNavigation, {
                class: "users-navigation",
                "number-of-pages": numberOfPages.value,
                "onGet:activePage": (value) => activePage.value = value
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
              _push2(ssrRenderComponent(__nuxt_component_2, null, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { id: "users" }, [
                  createVNode("div", { class: "content" }, [
                    createVNode(ActionBar, {
                      class: "action-bar",
                      description: "Správa uživatelů",
                      active: 2,
                      texts: ["Přidat", "Upravit", "Odebrat"],
                      icons: [
                        "material-symbols:add-rounded",
                        "material-symbols:edit-rounded",
                        "material-symbols:delete-rounded"
                      ],
                      "navigate-to": [
                        `/panel/users/add`,
                        `/panel/users/student/${unref(classId)}/edit`,
                        `/panel/users/student/${unref(classId)}/remove`
                      ]
                    }, null, 8, ["navigate-to"]),
                    createVNode("div", { class: "line" }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, " Uživatelé: " + toDisplayString(selectedUsers.value.length) + " / " + toDisplayString(searchedUsers.value.length), 1),
                        createVNode("p", null, "Vyberte uživatele, které chcete odstranit, nebo použijte vyhledávání pro zúžení výběru.")
                      ]),
                      createVNode("div", { class: "search" }, [
                        withDirectives(createVNode("input", {
                          type: "text",
                          name: "searchInput",
                          placeholder: "Hledat uživatele",
                          onInput: searchUsers,
                          "onUpdate:modelValue": ($event) => searchInput.value = $event
                        }, null, 40, ["onUpdate:modelValue"]), [
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
                        onClick: removeUsers
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
                        onClick: pingResetSelectedUsers
                      }, " Zrušit vše ")
                    ]),
                    createVNode("div", { class: "users" }, [
                      createVNode(UsersGrid, {
                        users: searchedUsers.value,
                        "users-per-page": 12,
                        action: "remove",
                        "active-page": activePage.value,
                        reset: resetSelectedUsers.value,
                        "onGet:numberOfPages": (value) => numberOfPages.value = value,
                        "onGet:selectedUsers": (value) => selectedUsers.value = value
                      }, null, 8, ["users", "active-page", "reset", "onGet:numberOfPages", "onGet:selectedUsers"]),
                      createVNode(GridNavigation, {
                        class: "users-navigation",
                        "number-of-pages": numberOfPages.value,
                        "onGet:activePage": (value) => activePage.value = value
                      }, null, 8, ["number-of-pages", "onGet:activePage"])
                    ])
                  ]),
                  createVNode(__nuxt_component_2)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/users/student/[class]/remove.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const remove = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-255263fc"]]);

export { remove as default };
//# sourceMappingURL=remove.vue6.mjs.map
