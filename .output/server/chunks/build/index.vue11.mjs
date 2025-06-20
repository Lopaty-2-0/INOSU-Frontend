import { a as __nuxt_component_0, _ as _export_sfc } from './server.mjs';
import __nuxt_component_0$1 from './index2.mjs';
import { defineComponent, ref, mergeProps, createSlots, withCtx, unref, createVNode, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { A as ActionBar } from './ActionBar.vue.mjs';
import { N as Navbar } from './Navbar.vue.mjs';
import { U as UsersGrid, G as GridNavigation } from './Navigation.vue2.mjs';
import { _ as __nuxt_component_2 } from './Alerts.vue.mjs';
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
import './Loading.vue.mjs';
import './account.mjs';
import 'moment';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const role = route.params.role;
    useHead({
      title: "Panel | Upravení uživatelů - " + role,
      meta: [{ name: "description", content: "Panel Settings User Information" }]
    });
    const users = ref(null);
    const numberOfPages = ref(0);
    const activePage = ref(0);
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
                { name: unref(role), path: "/panel/users/" + unref(role) },
                { name: "Upravení", path: "/panel/users/" + unref(role) + "/edit" }
              ]
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, {
                links: [
                  { name: "Uživatelé", path: "/panel/users" },
                  { name: unref(role), path: "/panel/users/" + unref(role) },
                  { name: "Upravení", path: "/panel/users/" + unref(role) + "/edit" }
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
              _push2(`<div id="users" data-v-c98d05d6${_scopeId}><div class="content" data-v-c98d05d6${_scopeId}>`);
              _push2(ssrRenderComponent(ActionBar, {
                class: "action-bar",
                description: "Správa uživatelů",
                active: 1,
                texts: ["Přidat", "Upravit", "Odebrat"],
                icons: [
                  "material-symbols:add-rounded",
                  "material-symbols:edit-rounded",
                  "material-symbols:delete-rounded"
                ],
                "navigate-to": [
                  `/panel/users/add`,
                  `/panel/users/${unref(role)}/edit`,
                  `/panel/users/${unref(role)}/remove`
                ]
              }, null, _parent2, _scopeId));
              _push2(`<div class="line" data-v-c98d05d6${_scopeId}><div class="section-head" data-v-c98d05d6${_scopeId}><h3 data-v-c98d05d6${_scopeId}>Upravení uživatelů</h3><p data-v-c98d05d6${_scopeId}>Zde si můžete vybrat uživatele, kterého chcete upravit.</p></div><div class="search" data-v-c98d05d6${_scopeId}><input type="text" name="searchInput" placeholder="Hledat uživatele"${ssrRenderAttr("value", searchInput.value)} data-v-c98d05d6${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                class: "icon",
                name: "material-symbols:search-rounded"
              }, null, _parent2, _scopeId));
              _push2(`</div></div><div class="users" data-v-c98d05d6${_scopeId}>`);
              _push2(ssrRenderComponent(UsersGrid, {
                users: searchedUsers.value,
                "users-per-page": 12,
                action: "edit",
                "active-page": activePage.value,
                "onGet:numberOfPages": (value) => numberOfPages.value = value
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
                      active: 1,
                      texts: ["Přidat", "Upravit", "Odebrat"],
                      icons: [
                        "material-symbols:add-rounded",
                        "material-symbols:edit-rounded",
                        "material-symbols:delete-rounded"
                      ],
                      "navigate-to": [
                        `/panel/users/add`,
                        `/panel/users/${unref(role)}/edit`,
                        `/panel/users/${unref(role)}/remove`
                      ]
                    }, null, 8, ["navigate-to"]),
                    createVNode("div", { class: "line" }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, "Upravení uživatelů"),
                        createVNode("p", null, "Zde si můžete vybrat uživatele, kterého chcete upravit.")
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
                    createVNode("div", { class: "users" }, [
                      createVNode(UsersGrid, {
                        users: searchedUsers.value,
                        "users-per-page": 12,
                        action: "edit",
                        "active-page": activePage.value,
                        "onGet:numberOfPages": (value) => numberOfPages.value = value
                      }, null, 8, ["users", "active-page", "onGet:numberOfPages"]),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/users/[role]/edit/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c98d05d6"]]);

export { index as default };
//# sourceMappingURL=index.vue11.mjs.map
