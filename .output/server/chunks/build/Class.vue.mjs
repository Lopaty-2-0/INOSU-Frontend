import __nuxt_component_0 from './index2.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Class",
  __ssrInlineRender: true,
  props: {
    classes: {
      type: Array,
      required: true
    },
    oldClassIds: {
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
    const title = computed(() => {
      const numberOfSelectedClasses = selectedClasses.value.length;
      return numberOfSelectedClasses > 0 ? `Vybrané třídy: ${numberOfSelectedClasses}` : "";
    });
    const searchedClasses = computed(() => {
      return props.classes.filter((item) => {
        return item.name.toLocaleLowerCase().includes(searchName.value.toLocaleLowerCase()) && (searchSpecialization.value ? item.specialization.toLocaleLowerCase() === searchSpecialization.value.toLocaleLowerCase() : true) && (searchGrade.value ? item.grade === searchGrade.value : true) && (searchGroup.value ? item.group.toLocaleLowerCase() === searchGroup.value.toLocaleLowerCase() : true);
      });
    });
    const selectedClasses = ref([...props.oldClassIds]);
    const open = ref(false);
    const searchName = ref("");
    const searchGrade = ref(null);
    const searchGroup = ref("");
    const searchSpecialization = ref("");
    const icons = {
      select: "material-symbols:done-rounded",
      selected: "material-symbols:close-rounded",
      open: "material-symbols:arrow-downward-rounded",
      close: "material-symbols:arrow-upward-rounded"
    };
    watch(() => props.reset, (reset) => {
      if (reset) {
        open.value = false;
        selectedClasses.value = [...props.oldClassIds];
        searchName.value = "";
        searchGrade.value = null;
        searchGroup.value = "";
        searchSpecialization.value = "";
      }
    });
    watch(() => props.oldClassIds, (newClassIds) => {
      selectedClasses.value = newClassIds;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))} data-v-662fc588>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<div class="section" data-v-662fc588><div class="content" data-v-662fc588><div class="search" data-v-662fc588><label for="searchName" data-v-662fc588> Název <input id="searchName" placeholder="Vyhledat jméno"${ssrRenderAttr("value", searchName.value)} data-v-662fc588></label><label for="searchSpecialization" data-v-662fc588> Zaměření <input id="searchSpecialization" placeholder="V"${ssrRenderAttr("value", searchSpecialization.value)} data-v-662fc588></label><label for="searchGrade" data-v-662fc588> Ročník <input id="searchGrade" min="1" max="10" placeholder="3" type="number"${ssrRenderAttr("value", searchGrade.value)} data-v-662fc588></label><label for="searchGroup" data-v-662fc588> Skupina <input id="searchGroup" placeholder="B"${ssrRenderAttr("value", searchGroup.value)} data-v-662fc588></label></div><label data-v-662fc588>Výběr tříd</label><div class="dropdown" data-v-662fc588><div class="title" data-v-662fc588><p data-v-662fc588>${ssrInterpolate(unref(title) || "Vyberte třídy")}</p>`);
      _push(ssrRenderComponent(_component_Icon, {
        class: "icon",
        name: open.value ? icons.close : icons.open
      }, null, _parent));
      _push(`</div><div class="dropdown-content" style="${ssrRenderStyle(open.value ? null : { display: "none" })}" data-v-662fc588>`);
      if (unref(searchedClasses).length > 0) {
        _push(`<!--[-->`);
        ssrRenderList(unref(searchedClasses), (item) => {
          _push(`<div class="${ssrRenderClass([{ selected: selectedClasses.value.includes(item.id) }, "section"])}" data-v-662fc588>`);
          _push(ssrRenderComponent(_component_Icon, {
            class: "icon",
            name: selectedClasses.value.includes(item.id) ? icons.select : icons.selected
          }, null, _parent));
          _push(`<span data-v-662fc588>`);
          if (item.name) {
            _push(`<span class="name" data-v-662fc588>${ssrInterpolate(item.name + " - ")}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`${ssrInterpolate(item.specialization)}${ssrInterpolate(item.grade)}${ssrInterpolate(item.group)}</span></div>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<div class="section error" data-v-662fc588><p data-v-662fc588>Žádné třída nebyla nalezena.</p></div>`);
      }
      _push(`</div></div></div></div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/manage/Class.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const EditClass = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-662fc588"]]);

export { EditClass as E };
//# sourceMappingURL=Class.vue.mjs.map
