import { _ as _export_sfc, a as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, ref, watch, mergeProps, useSSRContext, withCtx, createTextVNode, toDisplayString, createVNode, withDirectives, vShow } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
import { _ as __nuxt_component_2 } from './Alerts.vue.mjs';
import { N as Navigation } from './Navigation.vue.mjs';
import __nuxt_component_0 from './index2.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link.mjs';
import { E as EditFormFooter } from './Footer.vue.mjs';
import { N as Navbar } from './Navbar.vue.mjs';
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
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import './Loading.vue.mjs';

const _imports_0 = "data:image/svg+xml,%3csvg%20width='568'%20height='403'%20viewBox='0%200%20568%20403'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_246_4)'%3e%3crect%20width='568'%20height='403'%20fill='%23F3F3F3'/%3e%3cmask%20id='path-1-inside-1_246_4'%20fill='white'%3e%3cpath%20d='M202%20137C202%20125.954%20210.954%20117%20222%20117H641V425H202V137Z'/%3e%3c/mask%3e%3cpath%20d='M202%20137C202%20125.954%20210.954%20117%20222%20117H641V425H202V137Z'%20fill='white'/%3e%3cpath%20d='M200%20137C200%20124.85%20209.85%20115%20222%20115H641V119H222C212.059%20119%20204%20127.059%20204%20137H200ZM641%20425H202H641ZM200%20425V137C200%20124.85%20209.85%20115%20222%20115V119C212.059%20119%20204%20127.059%20204%20137V425H200ZM641%20117V425V117Z'%20fill='%23E5E7EB'%20mask='url(%23path-1-inside-1_246_4)'/%3e%3cpath%20d='M243.148%20191H230.364L244.767%20147.364H260.96L275.364%20191H262.58L253.034%20159.381H252.693L243.148%20191ZM240.761%20173.784H264.795V182.648H240.761V173.784ZM288.856%20191.511C286.768%20191.511%20284.922%20191.17%20283.316%20190.489C281.725%20189.793%20280.475%20188.741%20279.566%20187.335C278.657%20185.929%20278.203%20184.139%20278.203%20181.966C278.203%20180.176%20278.508%20178.649%20279.119%20177.385C279.73%20176.107%20280.582%20175.062%20281.676%20174.253C282.77%20173.443%20284.041%20172.825%20285.49%20172.399C286.953%20171.973%20288.529%20171.696%20290.22%20171.568C292.052%20171.426%20293.522%20171.256%20294.63%20171.057C295.752%20170.844%20296.562%20170.553%20297.059%20170.183C297.556%20169.8%20297.805%20169.295%20297.805%20168.67V168.585C297.805%20167.733%20297.478%20167.08%20296.825%20166.625C296.172%20166.17%20295.333%20165.943%20294.311%20165.943C293.189%20165.943%20292.272%20166.192%20291.562%20166.689C290.866%20167.172%20290.447%20167.918%20290.305%20168.926H279.481C279.623%20166.937%20280.255%20165.105%20281.377%20163.429C282.514%20161.739%20284.169%20160.389%20286.342%20159.381C288.515%20158.358%20291.228%20157.847%20294.481%20157.847C296.825%20157.847%20298.927%20158.124%20300.788%20158.678C302.649%20159.217%20304.233%20159.977%20305.539%20160.957C306.846%20161.923%20307.841%20163.06%20308.522%20164.366C309.218%20165.659%20309.566%20167.065%20309.566%20168.585V191H298.572V186.398H298.316C297.663%20187.619%20296.868%20188.607%20295.93%20189.359C295.007%20190.112%20293.949%20190.659%20292.755%20191C291.576%20191.341%20290.277%20191.511%20288.856%20191.511ZM292.691%20184.097C293.586%20184.097%20294.424%20183.912%20295.206%20183.543C296.001%20183.173%20296.647%20182.641%20297.145%20181.945C297.642%20181.249%20297.89%20180.403%20297.89%20179.409V176.682C297.578%20176.81%20297.244%20176.93%20296.889%20177.044C296.548%20177.158%20296.179%20177.264%20295.781%20177.364C295.397%20177.463%20294.985%20177.555%20294.545%20177.641C294.119%20177.726%20293.672%20177.804%20293.203%20177.875C292.294%20178.017%20291.548%20178.251%20290.966%20178.578C290.397%20178.891%20289.971%20179.281%20289.687%20179.75C289.417%20180.205%20289.282%20180.716%20289.282%20181.284C289.282%20182.193%20289.602%20182.889%20290.241%20183.372C290.88%20183.855%20291.697%20184.097%20292.691%20184.097Z'%20fill='black'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_246_4'%3e%3crect%20width='568'%20height='403'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";

const _imports_1 = "data:image/svg+xml,%3csvg%20width='568'%20height='403'%20viewBox='0%200%20568%20403'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_246_9)'%3e%3crect%20width='568'%20height='403'%20fill='%231F1F1F'/%3e%3cmask%20id='path-1-inside-1_246_9'%20fill='white'%3e%3cpath%20d='M202%20137C202%20125.954%20210.954%20117%20222%20117H641V425H202V137Z'/%3e%3c/mask%3e%3cpath%20d='M202%20137C202%20125.954%20210.954%20117%20222%20117H641V425H202V137Z'%20fill='%23121212'/%3e%3cpath%20d='M200%20137C200%20124.85%20209.85%20115%20222%20115H641V119H222C212.059%20119%20204%20127.059%20204%20137H200ZM641%20425H202H641ZM200%20425V137C200%20124.85%20209.85%20115%20222%20115V119C212.059%20119%20204%20127.059%20204%20137V425H200ZM641%20117V425V117Z'%20fill='%23E5E7EB'%20fill-opacity='0.1'%20mask='url(%23path-1-inside-1_246_9)'/%3e%3cpath%20d='M243.148%20191H230.364L244.767%20147.364H260.96L275.364%20191H262.58L253.034%20159.381H252.693L243.148%20191ZM240.761%20173.784H264.795V182.648H240.761V173.784ZM288.856%20191.511C286.768%20191.511%20284.922%20191.17%20283.316%20190.489C281.725%20189.793%20280.475%20188.741%20279.566%20187.335C278.657%20185.929%20278.203%20184.139%20278.203%20181.966C278.203%20180.176%20278.508%20178.649%20279.119%20177.385C279.73%20176.107%20280.582%20175.062%20281.676%20174.253C282.77%20173.443%20284.041%20172.825%20285.49%20172.399C286.953%20171.973%20288.529%20171.696%20290.22%20171.568C292.052%20171.426%20293.522%20171.256%20294.63%20171.057C295.752%20170.844%20296.562%20170.553%20297.059%20170.183C297.556%20169.8%20297.805%20169.295%20297.805%20168.67V168.585C297.805%20167.733%20297.478%20167.08%20296.825%20166.625C296.172%20166.17%20295.333%20165.943%20294.311%20165.943C293.189%20165.943%20292.272%20166.192%20291.562%20166.689C290.866%20167.172%20290.447%20167.918%20290.305%20168.926H279.481C279.623%20166.937%20280.255%20165.105%20281.377%20163.429C282.514%20161.739%20284.169%20160.389%20286.342%20159.381C288.515%20158.358%20291.228%20157.847%20294.481%20157.847C296.825%20157.847%20298.927%20158.124%20300.788%20158.678C302.649%20159.217%20304.233%20159.977%20305.539%20160.957C306.846%20161.923%20307.841%20163.06%20308.522%20164.366C309.218%20165.659%20309.566%20167.065%20309.566%20168.585V191H298.572V186.398H298.316C297.663%20187.619%20296.868%20188.607%20295.93%20189.359C295.007%20190.112%20293.949%20190.659%20292.755%20191C291.576%20191.341%20290.277%20191.511%20288.856%20191.511ZM292.691%20184.097C293.586%20184.097%20294.424%20183.912%20295.206%20183.543C296.001%20183.173%20296.647%20182.641%20297.145%20181.945C297.642%20181.249%20297.89%20180.403%20297.89%20179.409V176.682C297.578%20176.81%20297.244%20176.93%20296.889%20177.044C296.548%20177.158%20296.179%20177.264%20295.781%20177.364C295.397%20177.463%20294.985%20177.555%20294.545%20177.641C294.119%20177.726%20293.672%20177.804%20293.203%20177.875C292.294%20178.017%20291.548%20178.251%20290.966%20178.578C290.397%20178.891%20289.971%20179.281%20289.687%20179.75C289.417%20180.205%20289.282%20180.716%20289.282%20181.284C289.282%20182.193%20289.602%20182.889%20290.241%20183.372C290.88%20183.855%20291.697%20184.097%20292.691%20184.097Z'%20fill='white'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_246_9'%3e%3crect%20width='568'%20height='403'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";

const _imports_2 = "" + __buildAssetsURL("theme-system.ByrzfaLA.svg");

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ThemeMode",
  __ssrInlineRender: true,
  props: {
    oldTheme: {
      type: String,
      required: true
    },
    reset: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const activeTheme = ref(props.oldTheme);
    watch(
      () => props.reset,
      (reset) => {
        if (reset) activeTheme.value = props.oldTheme;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))} data-v-d3f3f743>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<ul class="items" data-v-d3f3f743><li class="${ssrRenderClass({ active: activeTheme.value === "light" })}" data-v-d3f3f743><div class="info" data-v-d3f3f743><h4 data-v-d3f3f743>Světlý</h4><p data-v-d3f3f743>Váš panel bude mít světlý motiv</p></div><img${ssrRenderAttr("src", _imports_0)} alt="Světlý režim" data-v-d3f3f743></li><li class="${ssrRenderClass({ active: activeTheme.value === "dark" })}" data-v-d3f3f743><div class="info" data-v-d3f3f743><h4 data-v-d3f3f743>Tmavý</h4><p data-v-d3f3f743>Váš panel bude mít tmavý motiv</p></div><img${ssrRenderAttr("src", _imports_1)} alt="Tmavý režim" data-v-d3f3f743></li><li class="${ssrRenderClass({ active: activeTheme.value === "system" })}" data-v-d3f3f743><div class="info" data-v-d3f3f743><h4 data-v-d3f3f743>Systém</h4><p data-v-d3f3f743>Motiv bude podle systému vašeho zařízení</p></div><img${ssrRenderAttr("src", _imports_2)} alt="Systémový režim" data-v-d3f3f743></li></ul></div>`);
    };
  }
});

const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/manage/ThemeMode.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const EditThemeMode = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-d3f3f743"]]);

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CustomLinks",
  __ssrInlineRender: true,
  props: {
    oldCustomLinks: {
      type: Array,
      required: true
    },
    reset: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const accountCustomLinks = ref([...props.oldCustomLinks]);
    const editLinkId = ref(null);
    const textInputValue = ref([]);
    const hrefInputValue = ref([]);
    watch(
      () => props.reset,
      (value) => {
        if (value) {
          accountCustomLinks.value = [...props.oldCustomLinks];
          editLinkId.value = null;
          textInputValue.value = [];
          hrefInputValue.value = [];
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))} data-v-7bed9e0f>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<div data-v-7bed9e0f><div class="number-of-links" data-v-7bed9e0f><h4 data-v-7bed9e0f>Počet odkazů</h4><div data-v-7bed9e0f><p data-v-7bed9e0f>${ssrInterpolate(accountCustomLinks.value.length)} / 5</p><div class="icon-div" data-v-7bed9e0f>`);
      _push(ssrRenderComponent(_component_Icon, {
        class: "icon",
        name: "material-symbols:add-rounded"
      }, null, _parent));
      _push(`</div></div></div><ul class="items" data-v-7bed9e0f>`);
      if (accountCustomLinks.value.length) {
        _push(`<!--[-->`);
        ssrRenderList(accountCustomLinks.value, (link, index) => {
          _push(`<li class="${ssrRenderClass({ open: editLinkId.value === index })}" data-v-7bed9e0f><div class="link" data-v-7bed9e0f><div class="head" data-v-7bed9e0f><h4 data-v-7bed9e0f>${ssrInterpolate(link.text)}</h4>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            target: "_blank",
            to: link.href
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(link.href)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(link.href), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div><hr data-v-7bed9e0f><div class="body" data-v-7bed9e0f><div class="input" data-v-7bed9e0f><label${ssrRenderAttr("for", "text-input-" + index)} data-v-7bed9e0f>Text</label><input type="text"${ssrRenderAttr("id", "text-input-" + index)} name="linkText" placeholder="YouTube"${ssrRenderAttr("value", textInputValue.value[editLinkId.value])} data-v-7bed9e0f></div><div class="input" data-v-7bed9e0f><label${ssrRenderAttr("for", "url-input-" + index)} data-v-7bed9e0f>Odkaz</label><input type="text"${ssrRenderAttr("id", "url-input-" + index)} name="linkUrl" placeholder="https://www.youtube.com/"${ssrRenderAttr("value", hrefInputValue.value[editLinkId.value])} data-v-7bed9e0f></div></div></div><div class="actions" data-v-7bed9e0f><div class="icon-div edit" data-v-7bed9e0f>`);
          _push(ssrRenderComponent(_component_Icon, {
            class: "icon",
            name: "material-symbols:edit-rounded"
          }, null, _parent));
          _push(`</div><div class="icon-div remove" data-v-7bed9e0f>`);
          _push(ssrRenderComponent(_component_Icon, {
            class: "icon",
            name: "material-symbols:delete-rounded"
          }, null, _parent));
          _push(`</div></div></li>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<li data-v-7bed9e0f>Nemáte vytvořené žádné vlastní odkazy.</li>`);
      }
      _push(`</ul></div></div>`);
    };
  }
});

const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/manage/CustomLinks.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const EditCustomLinks = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-7bed9e0f"]]);

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "customization",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Panel | Nastavení - Přizpůsobení",
      meta: [
        { name: "description", content: "Panel Customization Page" }
      ]
    });
    const accountStore = useAccountStore();
    const submitLoading = ref(false);
    const triggerReset = ref(false);
    const oldUserData = ref({
      themeMode: accountStore.getTheme,
      customLinks: accountStore.getLinks
    });
    const newUserData = ref({
      themeMode: void 0,
      customLinks: void 0
    });
    const onThemeModeUpdate = (themeId) => {
      newUserData.value.themeMode = themeId;
    };
    const onCustomLinksUpdate = (customLinks) => {
      newUserData.value.customLinks = customLinks;
    };
    const resetUserData = () => {
      newUserData.value = {
        themeMode: void 0,
        customLinks: void 0
      };
      triggerReset.value = true;
      setTimeout(() => {
        triggerReset.value = false;
      }, 100);
    };
    const updateUserData = () => {
      submitLoading.value = true;
      if (newUserData.value.themeMode) {
        localStorage.setItem("theme", newUserData.value.themeMode);
        accountStore.setTheme(newUserData.value.themeMode);
        (void 0).location.reload();
      }
      if (newUserData.value.customLinks) {
        accountStore.setLinks(JSON.parse(JSON.stringify(newUserData.value.customLinks)));
        oldUserData.value.customLinks = JSON.parse(JSON.stringify(newUserData.value.customLinks));
      }
      submitLoading.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0$2;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "panel" }, _attrs), {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Navbar, { links: [
              { name: "Nastavení", path: "/panel/settings" },
              { name: "Přizpůsobení", path: "/panel/settings/customization" }
            ] }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, { links: [
                { name: "Nastavení", path: "/panel/settings" },
                { name: "Přizpůsobení", path: "/panel/settings/customization" }
              ] })
            ];
          }
        }),
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div id="settings" data-v-7a3a858d${_scopeId}>`);
            _push2(ssrRenderComponent(Navigation, {
              class: "navigation",
              title: "Nastavení účtu",
              "active-link-id": 2,
              links: [
                { name: "Profil", path: "/panel/settings" },
                { name: "Zabezpečení", path: "/panel/settings/security" },
                { name: "Přizpůsobení", path: "/panel/settings/customization" }
              ]
            }, null, _parent2, _scopeId));
            _push2(`<div class="content" data-v-7a3a858d${_scopeId}>`);
            _push2(ssrRenderComponent(EditThemeMode, {
              class: "page-section",
              "old-theme": oldUserData.value.themeMode,
              onUpdate: onThemeModeUpdate,
              reset: triggerReset.value
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-head" data-v-7a3a858d${_scopeId2}><h3 data-v-7a3a858d${_scopeId2}> Tématický režim <span class="update" style="${ssrRenderStyle(newUserData.value.themeMode !== void 0 && oldUserData.value.themeMode !== newUserData.value.themeMode ? null : { display: "none" })}" data-v-7a3a858d${_scopeId2}>(aktualizováno)</span></h3><p data-v-7a3a858d${_scopeId2}>Nastavte si motiv vašeho panelu</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "section-head" }, [
                      createVNode("h3", null, [
                        createTextVNode(" Tématický režim "),
                        withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                          [vShow, newUserData.value.themeMode !== void 0 && oldUserData.value.themeMode !== newUserData.value.themeMode]
                        ])
                      ]),
                      createVNode("p", null, "Nastavte si motiv vašeho panelu")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(EditCustomLinks, {
              class: "page-section",
              "old-custom-links": oldUserData.value.customLinks,
              onUpdate: onCustomLinksUpdate,
              reset: triggerReset.value
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="section-head" data-v-7a3a858d${_scopeId2}><h3 data-v-7a3a858d${_scopeId2}> Vlastní odkazy <span class="update" style="${ssrRenderStyle(newUserData.value.customLinks && JSON.stringify(oldUserData.value.customLinks) !== JSON.stringify(newUserData.value.customLinks) ? null : { display: "none" })}" data-v-7a3a858d${_scopeId2}>(aktualizováno)</span></h3><p data-v-7a3a858d${_scopeId2}>Přidejte vlastní odkazy pro rychlejší přístup z panelu</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "section-head" }, [
                      createVNode("h3", null, [
                        createTextVNode(" Vlastní odkazy "),
                        withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                          [vShow, newUserData.value.customLinks && JSON.stringify(oldUserData.value.customLinks) !== JSON.stringify(newUserData.value.customLinks)]
                        ])
                      ]),
                      createVNode("p", null, "Přidejte vlastní odkazy pro rychlejší přístup z panelu")
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
                  title: "Nastavení účtu",
                  "active-link-id": 2,
                  links: [
                    { name: "Profil", path: "/panel/settings" },
                    { name: "Zabezpečení", path: "/panel/settings/security" },
                    { name: "Přizpůsobení", path: "/panel/settings/customization" }
                  ]
                }),
                createVNode("div", { class: "content" }, [
                  createVNode(EditThemeMode, {
                    class: "page-section",
                    "old-theme": oldUserData.value.themeMode,
                    onUpdate: onThemeModeUpdate,
                    reset: triggerReset.value
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, [
                          createTextVNode(" Tématický režim "),
                          withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                            [vShow, newUserData.value.themeMode !== void 0 && oldUserData.value.themeMode !== newUserData.value.themeMode]
                          ])
                        ]),
                        createVNode("p", null, "Nastavte si motiv vašeho panelu")
                      ])
                    ]),
                    _: 1
                  }, 8, ["old-theme", "reset"]),
                  createVNode(EditCustomLinks, {
                    class: "page-section",
                    "old-custom-links": oldUserData.value.customLinks,
                    onUpdate: onCustomLinksUpdate,
                    reset: triggerReset.value
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, [
                          createTextVNode(" Vlastní odkazy "),
                          withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                            [vShow, newUserData.value.customLinks && JSON.stringify(oldUserData.value.customLinks) !== JSON.stringify(newUserData.value.customLinks)]
                          ])
                        ]),
                        createVNode("p", null, "Přidejte vlastní odkazy pro rychlejší přístup z panelu")
                      ])
                    ]),
                    _: 1
                  }, 8, ["old-custom-links", "reset"]),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/settings/customization.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const customization = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7a3a858d"]]);

export { customization as default };
//# sourceMappingURL=customization.vue.mjs.map
