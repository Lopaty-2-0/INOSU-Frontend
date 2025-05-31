import __nuxt_component_0 from './index2.mjs';
import { defineComponent, ref, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderClass, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TaskFile",
  __ssrInlineRender: true,
  props: {
    oldTaskFile: {
      type: String,
      required: false
    },
    reset: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const errors = ref({ file: "" });
    const taskFile = ref(null);
    ref(null);
    const taskTitle = ref(props.oldTaskFile || "");
    watch(() => props.oldTaskFile, (newVal) => {
      if (newVal) {
        taskTitle.value = newVal;
      } else {
        taskTitle.value = "";
      }
    });
    watch(() => props.reset, (reset) => {
      if (reset) {
        errors.value.file = "";
        taskFile.value = null;
        taskTitle.value = props.oldTaskFile || "";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))} data-v-49a99524>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<div class="items taskFile" data-v-49a99524><div class="section" data-v-49a99524><div class="content file" data-v-49a99524><div class="${ssrRenderClass([{ error: errors.value.file }, "content upload-file"])}" data-v-49a99524>`);
      if (errors.value.file) {
        _push(`<p data-v-49a99524>`);
        _push(ssrRenderComponent(_component_Icon, {
          class: "icon",
          name: "material-symbols:error-rounded"
        }, null, _parent));
        _push(` ${ssrInterpolate(errors.value.file)}</p>`);
      } else {
        _push(`<p data-v-49a99524>`);
        _push(ssrRenderComponent(_component_Icon, {
          class: "icon",
          name: "material-symbols:cloud-upload"
        }, null, _parent));
        _push(` ${ssrInterpolate(taskFile.value || taskTitle.value ? "Soubor: " + taskTitle.value : "Klikni pro nahrání souboru z počítače")}</p>`);
      }
      _push(`<input type="file" size="2097152" placeholder="Nahrát soubor" accept=".pdf,.docx,.odt,.html,.zip" data-v-49a99524></div></div></div></div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/manage/TaskFile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const EditTaskFile = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-49a99524"]]);

export { EditTaskFile as E };
//# sourceMappingURL=TaskFile.vue.mjs.map
