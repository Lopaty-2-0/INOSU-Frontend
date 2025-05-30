import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import __nuxt_component_0$1 from './index2.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ActionBar",
  __ssrInlineRender: true,
  props: {
    icons: {
      type: Array,
      default: [
        "material-symbols:add-rounded",
        "material-symbols:edit-rounded",
        "material-symbols:delete-rounded"
      ]
    },
    texts: {
      type: Array,
      default: ["Přidat", "Upravit", "Odstranit"]
    },
    actions: {
      type: Array,
      default: ["add", "edit", "remove"]
    },
    description: {
      type: String,
      default: "Akční bar"
    },
    active: {
      type: Number
    },
    navigateTo: {
      type: Array,
      default: ["#", "#", "#"]
    }
  },
  emits: ["selected"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "action-bar" }, _attrs))} data-v-4f9d92d9><p class="description" data-v-4f9d92d9>${ssrInterpolate(props.description)}</p><div class="actions" data-v-4f9d92d9><!--[-->`);
      ssrRenderList(props.texts.length, (_, index) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: index,
          class: {
            action: true,
            active: props.active === index,
            [props.actions[index]]: true
          },
          to: props.navigateTo[index] || "#",
          onClick: ($event) => emits("selected", index)
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Icon, {
                class: "icon",
                name: props.icons[index] || "material-symbols:radio-button-unchecked"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(props.texts[index])}`);
            } else {
              return [
                createVNode(_component_Icon, {
                  class: "icon",
                  name: props.icons[index] || "material-symbols:radio-button-unchecked"
                }, null, 8, ["name"]),
                createTextVNode(" " + toDisplayString(props.texts[index]), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/basics/ActionBar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ActionBar = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4f9d92d9"]]);

export { ActionBar as A };
//# sourceMappingURL=ActionBar.vue.mjs.map
