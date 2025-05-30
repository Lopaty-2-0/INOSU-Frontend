import __nuxt_component_0 from './index2.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Navigation",
  __ssrInlineRender: true,
  props: {
    activeLinkId: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      required: true
    },
    links: {
      type: Array,
      default: []
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "navigation" }, _attrs))} data-v-3273ea40><h3 data-v-3273ea40>${ssrInterpolate(props.title)}</h3><ul data-v-3273ea40><!--[-->`);
      ssrRenderList(props.links, (link, index) => {
        _push(`<li class="${ssrRenderClass({ active: props.activeLinkId === index })}" data-v-3273ea40>`);
        _push(ssrRenderComponent(_component_Icon, {
          class: "icon",
          size: "16px",
          name: "material-symbols:play-arrow-rounded"
        }, null, _parent));
        if (link.path) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: link.path
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(link.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(link.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<p data-v-3273ea40>${ssrInterpolate(link.name)}</p>`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/basics/Navigation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Navigation = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3273ea40"]]);

export { Navigation as N };
//# sourceMappingURL=Navigation.vue.mjs.map
