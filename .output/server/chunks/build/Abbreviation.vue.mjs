import { defineComponent, ref, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import __nuxt_component_0 from './index2.mjs';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "FullName",
  __ssrInlineRender: true,
  props: {
    oldFullName: {
      type: Object,
      required: true
    },
    reset: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update"],
  setup(__props, { emit: __emit }) {
    var _a, _b;
    const props = __props;
    const inputData = ref({
      name: { updated: false, input: (_a = props.oldFullName) == null ? void 0 : _a.name },
      surname: { updated: false, input: (_b = props.oldFullName) == null ? void 0 : _b.surname }
    });
    watch(() => props.reset, (reset) => {
      var _a2, _b2;
      if (reset) {
        inputData.value.name.updated = false;
        inputData.value.surname.updated = false;
        inputData.value.name.input = (_a2 = props.oldFullName) == null ? void 0 : _a2.name;
        inputData.value.surname.input = (_b2 = props.oldFullName) == null ? void 0 : _b2.surname;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b2, _c, _d;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))} data-v-efab029c>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<div class="items full-name" data-v-efab029c><div class="section" data-v-efab029c><div class="content" data-v-efab029c><label for="firstName" data-v-efab029c>Jméno `);
      if (inputData.value.name.updated) {
        _push(`<span class="update" data-v-efab029c>(aktualizováno)</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><input type="text" id="firstName" name="firstName"${ssrRenderAttr("placeholder", ((_a2 = props.oldFullName) == null ? void 0 : _a2.name) ? (_b2 = props.oldFullName) == null ? void 0 : _b2.name : "Jan")}${ssrRenderAttr("value", inputData.value.name.input)} data-v-efab029c></div></div><div class="section" data-v-efab029c><div class="content" data-v-efab029c><label for="secondName" data-v-efab029c>Příjmení `);
      if (inputData.value.surname.updated) {
        _push(`<span class="update" data-v-efab029c>(aktualizováno)</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><input type="text" id="secondName" name="secondName"${ssrRenderAttr("placeholder", ((_c = props.oldFullName) == null ? void 0 : _c.surname) ? (_d = props.oldFullName) == null ? void 0 : _d.surname : "Novák")}${ssrRenderAttr("value", inputData.value.surname.input)} data-v-efab029c></div></div></div></div>`);
    };
  }
});

const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/manage/FullName.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const EditFullName = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-efab029c"]]);

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Email",
  __ssrInlineRender: true,
  props: {
    oldEmail: {
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
    const email = ref({
      input: props.oldEmail,
      error: ""
    });
    watch(() => props.reset, (reset) => {
      if (reset) {
        email.value.error = "";
        email.value.input = props.oldEmail;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))} data-v-586c06bb>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<div class="section url" data-v-586c06bb><div class="content" data-v-586c06bb><label for="email" data-v-586c06bb>E-mail</label><div class="line" data-v-586c06bb><input class="${ssrRenderClass({ error: email.value.error })}" type="email" id="email" placeholder="example.email@gmail.com"${ssrRenderAttr("value", email.value.input)} data-v-586c06bb><div class="icon-div" data-v-586c06bb>`);
      _push(ssrRenderComponent(_component_Icon, {
        class: "icon",
        name: "material-symbols:content-paste"
      }, null, _parent));
      _push(`</div></div>`);
      if (email.value.error) {
        _push(`<p class="input-error" data-v-586c06bb>${ssrInterpolate(email.value.error)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});

const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/manage/Email.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const EditEmail = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-586c06bb"]]);

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Role",
  __ssrInlineRender: true,
  props: {
    roles: {
      type: Array,
      required: true
    },
    oldRole: {
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
    const open = ref(false);
    const role = ref({ input: props.oldRole, error: "" });
    const icons = {
      select: "material-symbols:done-rounded",
      selected: "material-symbols:close-rounded",
      open: "material-symbols:arrow-downward-rounded",
      close: "material-symbols:arrow-upward-rounded"
    };
    watch(() => props.reset, (reset) => {
      if (reset) {
        role.value.error = "";
        role.value.input = props.oldRole;
        open.value = false;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))} data-v-43f7caa4>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<div class="section" data-v-43f7caa4><div class="content" data-v-43f7caa4><label for="roleInput" data-v-43f7caa4>Role</label><div class="${ssrRenderClass([{ open: open.value, error: role.value.error }, "dropdown"])}" data-v-43f7caa4><div class="title" data-v-43f7caa4><input id="roleInput" placeholder="Vyberte / Vytvořte roli"${ssrRenderAttr("value", role.value.input)} data-v-43f7caa4><div class="icon-div" data-v-43f7caa4>`);
      _push(ssrRenderComponent(_component_Icon, {
        class: "icon",
        name: open.value ? icons.close : icons.open
      }, null, _parent));
      _push(`</div></div><div class="dropdown-content" style="${ssrRenderStyle(open.value ? null : { display: "none" })}" data-v-43f7caa4><!--[-->`);
      ssrRenderList(props.roles, (item, index) => {
        _push(`<div class="${ssrRenderClass([{ selected: role.value.input === item }, "section"])}" data-v-43f7caa4>`);
        _push(ssrRenderComponent(_component_Icon, {
          class: "icon",
          name: role.value.input === item ? icons.select : icons.selected
        }, null, _parent));
        _push(`<span data-v-43f7caa4>${ssrInterpolate(item)}</span></div>`);
      });
      _push(`<!--]--></div></div>`);
      if (role.value.error) {
        _push(`<p class="input-error" data-v-43f7caa4>${ssrInterpolate(role.value.error)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});

const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/manage/Role.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const EditRole = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-43f7caa4"]]);

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Abbreviation",
  __ssrInlineRender: true,
  props: {
    fullName: {
      type: Object,
      required: false
    },
    oldAbbreviation: {
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
    const abbreviation = ref({ input: props.oldAbbreviation, error: "" });
    watch(() => props.reset, (reset) => {
      if (reset) {
        abbreviation.value.error = "";
        abbreviation.value.input = props.oldAbbreviation;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))} data-v-f732e05a>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<div class="section url" data-v-f732e05a><div class="content" data-v-f732e05a><label for="abbreviation" data-v-f732e05a>Přezdívka</label><div class="line" data-v-f732e05a><input class="${ssrRenderClass({ error: abbreviation.value.error })}" type="text" id="abbreviation" placeholder="JANO"${ssrRenderAttr("value", abbreviation.value.input)} data-v-f732e05a><div class="icon-div" data-v-f732e05a>`);
      _push(ssrRenderComponent(_component_Icon, {
        class: "icon",
        name: "material-symbols:wand-stars-rounded"
      }, null, _parent));
      _push(`</div></div>`);
      if (abbreviation.value.error) {
        _push(`<p class="input-error" data-v-f732e05a>${ssrInterpolate(abbreviation.value.error)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/manage/Abbreviation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const EditAbbreviation = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f732e05a"]]);

export { EditFullName as E, EditEmail as a, EditRole as b, EditAbbreviation as c };
//# sourceMappingURL=Abbreviation.vue.mjs.map
