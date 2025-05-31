import { defineComponent, ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import moment from 'moment';
import { _ as _export_sfc } from './server.mjs';
import __nuxt_component_0 from './index2.mjs';

const useArrayChunks = (array, chunkLength) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkLength) {
    result.push(array.slice(i, i + chunkLength));
  }
  return result;
};

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Grid",
  __ssrInlineRender: true,
  props: {
    users: {
      type: Array,
      default: () => []
    },
    action: {
      type: String,
      default: "list"
    },
    activePage: {
      type: Number,
      default: 0,
      required: true
    },
    usersPerPage: {
      type: Number,
      default: 12,
      required: true
    },
    reset: {
      type: Boolean,
      default: false
    }
  },
  emits: ["get:numberOfPages", "get:selectedUsers"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const numberOfPages = ref(0);
    const allUsersPages = ref([]);
    const selectedUsers = ref([]);
    watch(
      () => props.users,
      (newValue) => {
        allUsersPages.value = useArrayChunks(newValue, props.usersPerPage);
        numberOfPages.value = Math.ceil(newValue.length / props.usersPerPage);
        emits("get:numberOfPages", numberOfPages.value);
      },
      { immediate: true }
    );
    watch(
      () => props.reset,
      (newValue) => {
        if (newValue) {
          selectedUsers.value = [];
          emits("get:selectedUsers", selectedUsers.value);
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "users-grid" }, _attrs))} data-v-df309793>`);
      if (__props.users.length > 0) {
        _push(`<div class="all-users" data-v-df309793><!--[-->`);
        ssrRenderList(allUsersPages.value[props.activePage], (user) => {
          _push(`<div class="${ssrRenderClass([{
            [props.action]: true,
            selected: selectedUsers.value.includes(user)
          }, "card"])}" data-v-df309793><div class="user" data-v-df309793><div class="head" data-v-df309793><img${ssrRenderAttr(
            "src",
            "http://89.203.248.163/uploads/profilePictures/" + user.profilePicture
          )} alt="User profile photo" loading="lazy" data-v-df309793><h3 data-v-df309793>${ssrInterpolate(user.name)} ${ssrInterpolate(user.surname)}</h3></div><div class="info" data-v-df309793><p data-v-df309793> E-mail: <span data-v-df309793>${ssrInterpolate(user.email)}</span></p><p data-v-df309793> Přezdívka: <span data-v-df309793>${ssrInterpolate(user.abbreviation || "Není")}</span></p><p data-v-df309793> Vytvořen: <span data-v-df309793>${ssrInterpolate(unref(moment)(user.createdAt).format("DD. MM. YYYY"))}</span></p></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<p class="error message" data-v-df309793>Žádný uživatel nebyl zobrazen!</p>`);
      }
      _push(`</div>`);
    };
  }
});

const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/users/Grid.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const UsersGrid = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-df309793"]]);

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Navigation",
  __ssrInlineRender: true,
  props: {
    numberOfPages: {
      type: Number,
      required: true,
      default: 0
    }
  },
  emits: ["get:activePage"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const activePage = ref(0);
    const activePagesIndex = ref(0);
    const pagesArray = ref([]);
    const navigationPages = ref([]);
    const setActivePagesIndex = (index) => {
      activePagesIndex.value = index;
    };
    const setActivePage = (index) => {
      activePage.value = index;
      emits("get:activePage", activePage.value);
    };
    watch(
      () => props.numberOfPages,
      (newCount) => {
        if (newCount) {
          pagesArray.value = Array.from(
            { length: Math.ceil(props.numberOfPages) },
            (_, index) => index
          );
          navigationPages.value = useArrayChunks(pagesArray.value, 3);
          setActivePagesIndex(0);
          setActivePage(0);
        } else {
          pagesArray.value = [];
          navigationPages.value = [];
          activePage.value = 0;
          activePagesIndex.value = 0;
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "navigation" }, _attrs))} data-v-de607765><button class="back" data-v-de607765>`);
      _push(ssrRenderComponent(_component_Icon, {
        class: "icon",
        name: "material-symbols:arrow-left-alt-rounded"
      }, null, _parent));
      _push(` Zpět </button><ul class="pages" data-v-de607765>`);
      if (activePagesIndex.value > 0) {
        _push(`<li class="page" data-v-de607765> ... </li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(navigationPages.value[activePagesIndex.value], (pageNumber) => {
        _push(`<li class="${ssrRenderClass({ page: true, active: pageNumber === activePage.value })}" data-v-de607765>${ssrInterpolate(pageNumber + 1)}</li>`);
      });
      _push(`<!--]-->`);
      if (activePagesIndex.value < navigationPages.value.length - 1) {
        _push(`<li class="page" data-v-de607765> ... </li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</ul><button class="next" data-v-de607765> Další `);
      _push(ssrRenderComponent(_component_Icon, {
        class: "icon",
        name: "material-symbols:arrow-right-alt-rounded"
      }, null, _parent));
      _push(`</button></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/users/Navigation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const GridNavigation = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-de607765"]]);

export { GridNavigation as G, UsersGrid as U };
//# sourceMappingURL=Navigation.vue2.mjs.map
