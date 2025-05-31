import __nuxt_component_0 from './index2.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createBlock, openBlock, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { L as Loading } from './Loading.vue.mjs';
import { u as useAccountStore, a as useState } from './account.mjs';
import { storeToRefs } from 'pinia';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Navbar",
  __ssrInlineRender: true,
  props: {
    links: {
      type: Array,
      required: true
    },
    updated: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const { getAccountData: accountData } = storeToRefs(useAccountStore());
    const isHamburgerClicked = useState("isHamburgerClicked", () => false);
    const loading = ref(true);
    const profileData = computed(() => ({
      name: accountData.value.name,
      surname: accountData.value.surname,
      profilePhoto: "http://89.203.248.163/uploads/profilePictures/" + accountData.value.profilePicture
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<nav${ssrRenderAttrs(mergeProps({
        id: "navbar",
        class: { "active-hamburger": unref(isHamburgerClicked) }
      }, _attrs))} data-v-089b0b2a><div class="right" data-v-089b0b2a><div class="hamburger" data-v-089b0b2a>`);
      _push(ssrRenderComponent(_component_Icon, {
        class: "icon",
        size: "30px",
        name: "material-symbols:menu-rounded"
      }, null, _parent));
      _push(`</div><div class="full-path" data-v-089b0b2a><!--[-->`);
      ssrRenderList(props.links, (link, index) => {
        var _a;
        _push(`<div class="path-item" data-v-089b0b2a>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: link.path
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (index === 0) {
                _push2(`<p data-v-089b0b2a${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  class: "icon",
                  size: "20px",
                  name: "material-symbols:square-rounded"
                }, null, _parent2, _scopeId));
                _push2(`<span data-v-089b0b2a${_scopeId}>${ssrInterpolate(link.name)}</span></p>`);
              } else {
                _push2(`<p data-v-089b0b2a${_scopeId}>${ssrInterpolate(link.name)}</p>`);
              }
            } else {
              return [
                index === 0 ? (openBlock(), createBlock("p", { key: 0 }, [
                  createVNode(_component_Icon, {
                    class: "icon",
                    size: "20px",
                    name: "material-symbols:square-rounded"
                  }),
                  createVNode("span", null, toDisplayString(link.name), 1)
                ])) : (openBlock(), createBlock("p", { key: 1 }, toDisplayString(link.name), 1))
              ];
            }
          }),
          _: 2
        }, _parent));
        if (index !== ((_a = props.links) == null ? void 0 : _a.length) - 1) {
          _push(`<p data-v-089b0b2a>/</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div><div class="left" data-v-089b0b2a><div class="account" data-v-089b0b2a>`);
      if (loading.value) {
        _push(ssrRenderComponent(Loading, {
          color: "rgba(var(--description-color), 1)",
          size: "8px"
        }, null, _parent));
      } else {
        _push(`<img${ssrRenderAttr("src", unref(profileData).profilePhoto)} alt="profile-photo" draggable="false" loading="lazy" data-v-089b0b2a>`);
      }
      _push(`<div class="name" data-v-089b0b2a><p class="welcome" data-v-089b0b2a>Přihlášen jako</p>`);
      if (loading.value) {
        _push(`<p class="account-name" data-v-089b0b2a>Načítání</p>`);
      } else {
        _push(`<p class="account-name" data-v-089b0b2a>${ssrInterpolate(unref(profileData).name + " " + unref(profileData).surname)}</p>`);
      }
      _push(`</div></div></div></nav>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Navbar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Navbar = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-089b0b2a"]]);

export { Navbar as N };
//# sourceMappingURL=Navbar.vue.mjs.map
