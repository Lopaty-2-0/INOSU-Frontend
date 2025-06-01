import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Loading",
  __ssrInlineRender: true,
  props: {
    color: {
      type: String,
      default: "#000"
    },
    size: {
      type: String,
      default: "20px"
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({ class: "dot-spinner" }, _attrs))} data-v-4db9bfd3><!--[-->`);
      ssrRenderList(3, (index) => {
        _push(`<span class="${ssrRenderClass(`dot${index}`)}" style="${ssrRenderStyle({
          background: props.color,
          width: props.size,
          height: props.size
        })}" data-v-4db9bfd3></span>`);
      });
      _push(`<!--]--></span>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/basics/Loading.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Loading = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4db9bfd3"]]);

export { Loading as L };
//# sourceMappingURL=Loading.vue.mjs.map
