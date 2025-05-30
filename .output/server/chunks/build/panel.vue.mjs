import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import __nuxt_component_0 from './index2.mjs';
import { j as useRoute, _ as _export_sfc } from './server.mjs';
import { u as useAccountStore, a as useState } from './account.mjs';
import { storeToRefs } from 'pinia';
import { L as Loading } from './Loading.vue.mjs';
import './v3.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
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
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Sidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { getLinks: accountLinks, getRole: role } = storeToRefs(useAccountStore());
    const getStyledNumber = (number) => {
      if (number >= 1e3) return "1K+";
      return number.toString();
    };
    const loading = ref(true);
    const logoutLoading = ref(false);
    const numberOfActiveTasks = ref(null);
    const sidebarLinks = computed(() => [
      {
        name: "Hlavní",
        links: [
          {
            text: "Domů",
            href: "/panel",
            iconClass: "material-symbols:home-rounded",
            notify: false
          },
          {
            text: "Úkoly",
            href: `/panel/tasks/${role.value}`,
            activeHrefs: [
              `/panel/tasks/${role.value}`,
              `/panel/tasks/${role.value}/add`,
              `/panel/tasks/${role.value}/remove`
            ],
            iconClass: "material-symbols:folder-copy-rounded",
            notify: !["admin", "teacher"].includes(role.value) ? numberOfActiveTasks.value !== null ? getStyledNumber(numberOfActiveTasks.value) : "?" : false
          },
          {
            text: "Zaměření",
            href: "/panel/specializations",
            activeHrefs: [
              "/panel/specializations",
              "/panel/specializations/add",
              "/panel/specializations/remove"
            ],
            iconClass: "material-symbols:school",
            notify: false
          },
          {
            text: "Třídy",
            href: "/panel/classes",
            activeHrefs: [
              "/panel/classes",
              "/panel/classes/add",
              "/panel/classes/remove"
            ],
            iconClass: "material-symbols:flight-class-rounded",
            notify: false
          },
          {
            text: "Uživatelé",
            href: "/panel/users",
            activeHrefs: [
              "/panel/users",
              "/panel/users/add",
              "/panel/users/remove",
              "/panel/users/edit"
            ],
            iconClass: "material-symbols:supervisor-account-rounded",
            notify: false
          }
        ]
      },
      {
        name: "Ostatní",
        links: [
          {
            text: "Nastavení",
            href: "/panel/settings",
            activeHrefs: [
              "/panel/settings",
              "/panel/settings/security",
              "/panel/settings/customization"
            ],
            iconClass: "material-symbols:settings-rounded",
            notify: false
          }
        ]
      }
    ]);
    const checkIfLinkIsActive = (link) => {
      const activePath = route.path;
      if (Array.isArray(link))
        return link.includes(activePath) || link.some((href) => activePath.includes(href));
      return activePath === link;
    };
    const isHamburgerClicked = useState("isHamburgerClicked");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        id: "sidebar",
        class: { "active-sidebar": unref(isHamburgerClicked) }
      }, _attrs))} data-v-a907c916><div class="header" data-v-a907c916><div class="sidebar-logo" data-v-a907c916><h2 data-v-a907c916>INOSU</h2><p data-v-a907c916>INformační a Organizační Systém Úloh</p></div><div class="items" data-v-a907c916><!--[-->`);
      ssrRenderList(sidebarLinks.value, (item, itemIndex) => {
        _push(`<div class="section" data-v-a907c916><p class="name" data-v-a907c916>${ssrInterpolate(item.name)}</p><ul class="links" data-v-a907c916><!--[-->`);
        ssrRenderList(item.links, (link, linkIndex) => {
          _push(`<li data-v-a907c916>`);
          if (!link.notify) {
            _push(`<a${ssrRenderAttr("href", link.href)} class="${ssrRenderClass({
              active: checkIfLinkIsActive(
                link.activeHrefs ? link.activeHrefs : link.href
              ),
              link: true
            })}" data-v-a907c916>`);
            _push(ssrRenderComponent(_component_Icon, {
              size: "16px",
              class: "icon",
              name: link.iconClass
            }, null, _parent));
            _push(`${ssrInterpolate(link.text)}</a>`);
          } else {
            _push(`<a${ssrRenderAttr("href", link.href)} class="${ssrRenderClass({
              active: checkIfLinkIsActive(
                link.activeHrefs ? link.activeHrefs : link.href
              ),
              link: true,
              notify: true
            })}" data-v-a907c916>`);
            _push(ssrRenderComponent(_component_Icon, {
              class: "icon",
              name: link.iconClass
            }, null, _parent));
            _push(`${ssrInterpolate(link.text)} <div class="number" data-v-a907c916>${ssrInterpolate(link.notify)}</div></a>`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul></div>`);
      });
      _push(`<!--]-->`);
      if (!loading.value) {
        _push(`<div class="section custom-links" data-v-a907c916><ul class="links" data-v-a907c916><!--[-->`);
        ssrRenderList(unref(accountLinks), (link, linkIndex) => {
          _push(`<li data-v-a907c916><a${ssrRenderAttr("href", link.href)} class="link" target="_blank" data-v-a907c916>`);
          _push(ssrRenderComponent(_component_Icon, {
            size: "16px",
            class: "icon",
            name: "material-symbols:link-rounded"
          }, null, _parent));
          _push(` ${ssrInterpolate(link.text)}</a></li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="footer" data-v-a907c916><ul data-v-a907c916><li class="log-out" data-v-a907c916>`);
      if (!logoutLoading.value) {
        _push(`<button data-v-a907c916>`);
        _push(ssrRenderComponent(_component_Icon, {
          size: "16px",
          class: "icon",
          name: "material-symbols:logout-rounded"
        }, null, _parent));
        _push(` Odhlásit se </button>`);
      } else {
        _push(`<button class="loading" data-v-a907c916>`);
        _push(ssrRenderComponent(Loading, {
          color: "rgba(var(--description-color), 1)",
          size: "6px"
        }, null, _parent));
        _push(`</button>`);
      }
      _push(`</li></ul></div></div>`);
    };
  }
});

const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sidebar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Sidebar = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-a907c916"]]);

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "panel",
  __ssrInlineRender: true,
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const { getLoading: accountLoading } = storeToRefs(useAccountStore());
    const loading = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      if (loading.value || unref(accountLoading) || props.loading) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "loading" }, _attrs))} data-v-5f3f760d>`);
        _push(ssrRenderComponent(Loading, { color: "rgba(var(--description-color), 1)" }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(_attrs)} data-v-5f3f760d><div class="header" data-v-5f3f760d>`);
        _push(ssrRenderComponent(Sidebar, null, null, _parent));
        ssrRenderSlot(_ctx.$slots, "header", {}, null, _push, _parent);
        _push(`</div><div class="page" data-v-5f3f760d>`);
        ssrRenderSlot(_ctx.$slots, "content", {}, null, _push, _parent);
        _push(`</div></div>`);
      }
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/panel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const panel = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5f3f760d"]]);

export { panel as default };
//# sourceMappingURL=panel.vue.mjs.map
