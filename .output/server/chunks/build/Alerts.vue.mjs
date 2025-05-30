import __nuxt_component_0 from './index2.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { defineStore, storeToRefs } from 'pinia';
import { _ as _export_sfc } from './server.mjs';

const useAlertsStore = defineStore("alerts", {
  state: () => ({
    alerts: [],
    defaultAlertTimeout: 5e3
  }),
  getters: {
    getAlerts() {
      return this.alerts;
    }
  },
  actions: {
    addAlert(alert) {
      let maxIndex = 0;
      this.alerts.map((alert2) => {
        if (alert2.index && alert2.index > maxIndex) maxIndex = alert2.index;
      });
      this.alerts = [...this.alerts, { index: maxIndex + 1, ...alert }];
      setTimeout(() => {
        this.removeAlert(maxIndex + 1);
      }, this.defaultAlertTimeout);
    },
    removeAlert(alertIndex) {
      const index = this.alerts.findIndex((alert) => alert.index === alertIndex);
      if (index !== -1) {
        const updatedAlerts = [...this.alerts];
        updatedAlerts.splice(index, 1);
        this.alerts = updatedAlerts;
      }
    }
  }
});

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Alerts",
  __ssrInlineRender: true,
  setup(__props) {
    const alertsStore = useAlertsStore();
    const { getAlerts: alerts } = storeToRefs(alertsStore);
    const removeAlert = (index) => {
      if (index) alertsStore.removeAlert(index);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "alerts" }, _attrs))} data-v-07d3a835><!--[-->`);
      ssrRenderList(unref(alerts), (alert, index) => {
        _push(`<div class="${ssrRenderClass([alert.type, "alert"])}" data-v-07d3a835><div class="content" data-v-07d3a835><span data-v-07d3a835>${ssrInterpolate(alert.title)}</span><p data-v-07d3a835>${ssrInterpolate(alert.message)}</p></div>`);
        _push(ssrRenderComponent(_component_Icon, {
          class: "icon",
          size: "24px",
          name: "material-symbols:close-rounded",
          onClick: ($event) => removeAlert(alert.index)
        }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Alerts.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-07d3a835"]]);

export { __nuxt_component_2 as _, useAlertsStore as u };
//# sourceMappingURL=Alerts.vue.mjs.map
