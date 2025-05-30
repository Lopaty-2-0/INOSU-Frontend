import { defineComponent, useSlots, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent } from 'vue/server-renderer';
import { L as Loading } from './Loading.vue.mjs';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Footer",
  __ssrInlineRender: true,
  props: {
    resetFunction: {
      type: Function,
      required: true
    },
    submitFunction: {
      type: Function,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const slots = useSlots();
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "footer" }, _attrs))} data-v-15ab6efb>`);
      if (unref(slots).content) {
        _push(`<div class="content" data-v-15ab6efb>`);
        ssrRenderSlot(_ctx.$slots, "content", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="line" data-v-15ab6efb><button type="submit" data-v-15ab6efb> Uložit změny `);
      _push(ssrRenderComponent(Loading, {
        style: props.isLoading ? null : { display: "none" },
        size: "5px",
        color: "var(--btn-1-color)"
      }, null, _parent));
      _push(`</button><button type="reset" data-v-15ab6efb> Resetovat změny </button></div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/manage/Footer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const EditFormFooter = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-15ab6efb"]]);

export { EditFormFooter as E };
//# sourceMappingURL=Footer.vue.mjs.map
