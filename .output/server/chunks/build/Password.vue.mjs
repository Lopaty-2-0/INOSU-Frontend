import __nuxt_component_0 from './index2.mjs';
import { defineComponent, ref, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderDynamicModel, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Password",
  __ssrInlineRender: true,
  props: {
    type: {
      type: String,
      default: "reset"
    },
    reset: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const passwords = ref({
      old: { input: "", error: "" },
      new: { input: "", error: "" }
    });
    const isPasswordVisible = ref(false);
    const resetErrors = () => {
      passwords.value.old.error = "";
      passwords.value.new.error = "";
    };
    watch(
      () => props.reset,
      (reset) => {
        if (reset) {
          resetErrors();
          passwords.value.old.input = "";
          passwords.value.new.input = "";
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))} data-v-9c8eb832>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<div class="items reset-password" data-v-9c8eb832><div class="section old-password" data-v-9c8eb832><div class="content" data-v-9c8eb832><label for="oldPassword" data-v-9c8eb832>${ssrInterpolate(props.type === "new" ? "Heslo" : "Staré heslo")}</label><div class="line" data-v-9c8eb832><input${ssrRenderAttr("type", isPasswordVisible.value ? "text" : "password")} id="oldPassword" class="${ssrRenderClass({ error: passwords.value.old.error })}" name="oldPassword" placeholder="******"${ssrRenderDynamicModel(isPasswordVisible.value ? "text" : "password", passwords.value.old.input, null)} data-v-9c8eb832>`);
      if (!isPasswordVisible.value) {
        _push(`<div class="icon-div" data-v-9c8eb832>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "material-symbols:visibility-rounded",
          class: "icon",
          size: "16px"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="icon-div" data-v-9c8eb832>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "material-symbols:visibility-off-rounded",
          class: "icon",
          size: "16px"
        }, null, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
      if (passwords.value.old.error) {
        _push(`<p class="input-error" data-v-9c8eb832>${ssrInterpolate(passwords.value.old.error)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (props.type !== "new") {
        _push(`<div class="section" data-v-9c8eb832><div class="content" data-v-9c8eb832><label for="newPassword" data-v-9c8eb832>Nové heslo</label><input type="password" id="newPassword" class="${ssrRenderClass({ error: passwords.value.new.error })}" name="newPassword" placeholder="******"${ssrRenderAttr("value", passwords.value.new.input)} data-v-9c8eb832>`);
        if (passwords.value.new.error) {
          _push(`<p class="input-error" data-v-9c8eb832>${ssrInterpolate(passwords.value.new.error)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/manage/Password.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const EditPassword = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9c8eb832"]]);

export { EditPassword as E };
//# sourceMappingURL=Password.vue.mjs.map
