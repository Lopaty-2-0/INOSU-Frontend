import __nuxt_component_0 from './index2.mjs';
import { defineComponent, ref, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProfilePicture",
  __ssrInlineRender: true,
  props: {
    oldProfilePicture: {
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
    const emits = __emit;
    const profilePictureUrlImage = ref(props.oldProfilePicture);
    ref(null);
    const profilePictureFile = ref(null);
    const urlInput = ref("");
    const errors = ref({ file: "", url: "" });
    const resetErrors = () => {
      errors.value = { file: "", url: "" };
    };
    watch(
      () => profilePictureUrlImage.value,
      () => {
        emits("update", {
          profilePicture: props.oldProfilePicture !== profilePictureUrlImage.value ? profilePictureFile.value : void 0
        });
      }
    );
    watch(
      () => props.reset,
      (reset) => {
        if (reset) {
          resetErrors();
          profilePictureUrlImage.value = props.oldProfilePicture;
          profilePictureFile.value = null;
          urlInput.value = "";
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))} data-v-16c11dc9>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<div class="items" data-v-16c11dc9><div class="section" data-v-16c11dc9><div class="content image" data-v-16c11dc9><img loading="lazy"${ssrRenderAttr("src", profilePictureUrlImage.value)} alt="Profile photo" data-v-16c11dc9><div class="${ssrRenderClass([{ error: errors.value.file }, "content upload-file"])}" data-v-16c11dc9>`);
      if (errors.value.file) {
        _push(`<p data-v-16c11dc9>`);
        _push(ssrRenderComponent(_component_Icon, {
          class: "icon",
          size: "60px",
          name: "material-symbols:error-rounded"
        }, null, _parent));
        _push(` ${ssrInterpolate(errors.value.file)}</p>`);
      } else {
        _push(`<p data-v-16c11dc9>`);
        _push(ssrRenderComponent(_component_Icon, {
          class: "icon",
          size: "60px",
          name: "material-symbols:cloud-upload"
        }, null, _parent));
        _push(` Klikni pro nahrání obrázku z počítače </p>`);
      }
      _push(`<input type="file" size="2097152" placeholder="Profile image file" accept=".png,.jpg,.jpeg,.gif" data-v-16c11dc9></div></div></div><div class="section url" data-v-16c11dc9><div class="content" data-v-16c11dc9><label for="image" data-v-16c11dc9>URL obrázku</label><div class="line" data-v-16c11dc9><input class="${ssrRenderClass({ error: errors.value.url })}" type="text" id="image" name="image" placeholder="https://example.image/image.png"${ssrRenderAttr("value", urlInput.value)} data-v-16c11dc9><div class="icon-div" data-v-16c11dc9>`);
      _push(ssrRenderComponent(_component_Icon, {
        class: "icon",
        size: "16px",
        name: "material-symbols:content-paste"
      }, null, _parent));
      _push(`</div></div>`);
      if (errors.value.url) {
        _push(`<p class="input-error" data-v-16c11dc9>${ssrInterpolate(errors.value.url)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/manage/ProfilePicture.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const EditProfilePicture = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-16c11dc9"]]);

export { EditProfilePicture as E };
//# sourceMappingURL=ProfilePicture.vue.mjs.map
