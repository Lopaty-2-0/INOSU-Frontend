import { a as __nuxt_component_0, _ as _export_sfc } from './server.mjs';
import __nuxt_component_0$1 from './index2.mjs';
import { defineComponent, ref, watch, mergeProps, createSlots, withCtx, unref, createVNode, toDisplayString, createTextVNode, createBlock, createCommentVNode, withDirectives, openBlock, Fragment, renderList, vShow, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderStyle, ssrRenderList } from 'vue/server-renderer';
import { E as EditFormFooter } from './Footer.vue.mjs';
import { u as useAlertsStore, _ as __nuxt_component_2 } from './Alerts.vue.mjs';
import { N as Navbar } from './Navbar.vue.mjs';
import { a as apiFetch } from './apiFetch.mjs';
import { E as EditClass } from './Class.vue.mjs';
import { useRoute, useRouter } from 'vue-router';
import moment from 'moment/moment.js';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import { u as useHead } from './v3.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'node:path';
import 'node:crypto';
import 'pinia';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import './Loading.vue.mjs';
import './nuxt-link.mjs';
import './account.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "assign",
  __ssrInlineRender: true,
  emits: ["update"],
  setup(__props, { emit: __emit }) {
    useHead({
      title: "Panel | Úkoly - Přiřazení",
      meta: [
        { name: "description", content: "Panel Settings User Information" }
      ]
    });
    const route = useRoute();
    useRouter();
    const taskId = route.params.taskId;
    const alertsStore = useAlertsStore();
    const submitLoading = ref(false);
    const datatable = ref(null);
    const triggerReset = ref(false);
    const allClasses = ref([]);
    const selectedClasses = ref(void 0);
    const selectedUsers = ref([]);
    const oldSelectedClasses = ref([]);
    const oldSelectedUsers = ref([]);
    const task = ref(void 0);
    const dropdownItems = ref(["Třídy", "Žáci"]);
    const title = ref("Třídy");
    const selectedDropdown = ref(0);
    const open = ref(false);
    const icons = {
      select: "material-symbols:done-rounded",
      selected: "material-symbols:close-rounded",
      open: "material-symbols:arrow-downward-rounded",
      close: "material-symbols:arrow-upward-rounded"
    };
    const editClass = ref(false);
    const allStudents = ref(void 0);
    const searchInput = ref("");
    const cols = ref([
      { field: "id", title: "ID", width: "90px", type: "number" },
      { field: "name", title: "Jméno a přijmení", type: "string" },
      { field: "email", title: "E-mail", type: "string" },
      { field: "abbreviation", title: "Zkratka", type: "date" },
      { field: "createdAt", title: "Vytvořen", type: "string" }
    ]);
    const onClassUpdate = (data) => {
      selectedClasses.value = data.classes;
    };
    const onDropdownSelect = (index) => {
      selectedDropdown.value = index;
      title.value = dropdownItems.value[index];
      if (index === 0) editClass.value = true;
      else if (index === 1) editClass.value = false;
      open.value = false;
    };
    const resetSelection = () => {
      triggerReset.value = true;
      selectedClasses.value = [...oldSelectedClasses.value];
      selectedUsers.value = [...oldSelectedUsers.value];
      setTimeout(() => {
        triggerReset.value = false;
      }, 100);
    };
    const toggleDropdown = () => {
      open.value = !open.value;
    };
    const onCheckboxSelect = () => {
      if (!datatable.value) return;
      setTimeout(() => {
        selectedUsers.value = datatable.value.getSelectedRows().map((user) => user.id);
      }, 0);
    };
    const selectUsersInTable = () => {
      if (!datatable.value || !allStudents.value) return;
      const selectedIndexes = allStudents.value.map((user, idx) => selectedUsers.value.includes(user.id) ? idx : -1).filter((idx) => idx !== -1);
      selectedIndexes.forEach((index) => {
        datatable.value.selectRow(index);
      });
    };
    const assignToTask = async () => {
      if (selectedDropdown.value === 0) {
        submitLoading.value = true;
        await apiFetch("/task_class/update", {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            idTask: taskId,
            idClass: selectedClasses.value || []
          }),
          credentials: "include",
          ignoreResponseError: true,
          onResponse({ response }) {
            var _a;
            const resCode = (_a = response._data.resCode) == null ? void 0 : _a.toString();
            switch (resCode) {
              case "32010":
                alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nebyl zadán id úkolu." });
                break;
              case "32020":
                alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Úkol neexistuje." });
                break;
              case "32030":
                alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nemáte oprávnění." });
                break;
              case "32040":
                alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nebylo nic aktualizováno." });
                break;
              case "32051":
                const badClassIds = response._data.data.badIds || [];
                const goodClassIds = response._data.data.goodIds || [];
                const removedClassIds = response._data.data.removedIds || [];
                if (badClassIds.length > 0) {
                  alertsStore.addAlert({
                    type: "warning",
                    title: "Přiřazení úkolu",
                    message: `Úkol byl přiřazen ${goodClassIds.length} třídám. Některé třídy nebylo možné přiřadit. ID tříd: ${badClassIds.join(", ")}`
                  });
                } else if (removedClassIds.length > 0) {
                  alertsStore.addAlert({
                    type: "success",
                    title: "Přiřazení úkolu",
                    message: `Úkol byl odebrán ${removedClassIds.length} třídám a přiřazen ${goodClassIds.length} třídám.`
                  });
                } else {
                  alertsStore.addAlert({
                    type: "success",
                    title: "Přiřazení úkolu",
                    message: `Úkol byl úspěšně přiřazen třídám. (${goodClassIds.length})`
                  });
                }
                oldSelectedClasses.value = [...selectedClasses.value || []];
                resetSelection();
                break;
              default:
                alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nastala neznámá chyba." });
                break;
            }
          },
          onRequestError() {
            alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nastala neznámá chyba při odesílání požadavku." });
          }
        }).finally(() => {
          submitLoading.value = false;
          return;
        });
      }
      if (selectedDropdown.value === 1) {
        submitLoading.value = true;
        await apiFetch("/user_task/change", {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            idTask: taskId,
            idUser: selectedUsers.value || []
          }),
          credentials: "include",
          ignoreResponseError: true,
          onResponse({ response }) {
            var _a;
            const resCode = (_a = response._data.resCode) == null ? void 0 : _a.toString();
            switch (resCode) {
              case "43010":
                alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nebyl zadán id úkolu." });
                break;
              case "43020":
                alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Úkol neexistuje." });
                break;
              case "43030":
                alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Úkol je pouze pro třídy." });
                break;
              case "43040":
                alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nemáte oprávnění." });
                break;
              case "43050":
                alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nebylo nic aktualizováno." });
                break;
              case "43061":
                const badIds = response._data.data.badIds || [];
                const goodIds = response._data.data.goodIds || [];
                const removedIds = response._data.data.removedIds || [];
                if (badIds.length > 0) {
                  alertsStore.addAlert({
                    type: "warning",
                    title: "Přiřazení úkolu",
                    message: `Úkol byl přiřazen ${goodIds.length} uživatelům. Někteří uživatelé nebyli nalezeni. ID uživatelů: ${badIds.join(", ")}`
                  });
                } else if (removedIds.length > 0) {
                  alertsStore.addAlert({
                    type: "success",
                    title: "Přiřazení úkolu",
                    message: `Úkol byl odebrán ${removedIds.length} uživatelům a přiřazen ${goodIds.length} uživatelům.`
                  });
                } else {
                  alertsStore.addAlert({
                    type: "success",
                    title: "Přiřazení úkolu",
                    message: `Úkol byl úspěšně přiřazen uživatelům. (${goodIds.length})`
                  });
                }
                oldSelectedUsers.value = [...selectedUsers.value || []];
                resetSelection();
                break;
              default:
                alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nastala neznámá chyba." });
                break;
            }
          },
          onRequestError() {
            alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nastala neznámá chyba při odesílání požadavku." });
          }
        }).finally(() => {
          submitLoading.value = false;
          return;
        });
      }
    };
    watch(datatable, (val) => {
      if (val) {
        selectUsersInTable();
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_Icon = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({
        name: "panel",
        loading: !allClasses.value || !task.value || !allStudents.value
      }, _attrs), createSlots({
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Navbar, {
              links: [
                { name: "Úkoly", path: `/panel/tasks/teacher` },
                { name: "Přiřazení", path: `/panel/tasks/teacher/${unref(taskId)}/assign` }
              ]
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, {
                links: [
                  { name: "Úkoly", path: `/panel/tasks/teacher` },
                  { name: "Přiřazení", path: `/panel/tasks/teacher/${unref(taskId)}/assign` }
                ]
              }, null, 8, ["links"])
            ];
          }
        }),
        _: 2
      }, [
        allClasses.value && task.value && allStudents.value ? {
          name: "content",
          fn: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div id="tasks" data-v-098b60e9${_scopeId}><div class="content" data-v-098b60e9${_scopeId}><div class="line page-section" data-v-098b60e9${_scopeId}><div class="section-head" data-v-098b60e9${_scopeId}><h3 data-v-098b60e9${_scopeId}>${ssrInterpolate(task.value.name)}</h3><p data-v-098b60e9${_scopeId}>Úkol ID: ${ssrInterpolate(task.value.id)}</p><p data-v-098b60e9${_scopeId}>Garant ID: ${ssrInterpolate(task.value.guarantor)}</p><p data-v-098b60e9${_scopeId}>Začátek: ${ssrInterpolate(unref(moment)(task.value.startDate).format("DD.MM. YYYY HH:MM"))}</p><p data-v-098b60e9${_scopeId}>Konec: ${ssrInterpolate(unref(moment)(task.value.endDate).format("DD.MM. YYYY HH:MM"))}</p><p data-v-098b60e9${_scopeId}>Nutné potvrzení: ${ssrInterpolate(task.value.approve ? "Ano" : "Ne")}</p><p data-v-098b60e9${_scopeId}> Zadání: <a${ssrRenderAttr("href", `http://89.203.248.163/uploads/tasks/${task.value.id}/${task.value.task}`)} class="link" download target="_blank" data-v-098b60e9${_scopeId}>${ssrInterpolate(task.value.task)}</a></p></div></div>`);
              if (oldSelectedClasses.value.length <= 0 && oldSelectedUsers.value.length <= 0) {
                _push2(`<div class="line page-section" data-v-098b60e9${_scopeId}><div class="section-head" data-v-098b60e9${_scopeId}><h3 data-v-098b60e9${_scopeId}>Přiřazení pro (třídy/žáky)</h3><p data-v-098b60e9${_scopeId}>Zde můžete přiřadit úkol buď celé třídě, nebo jednotlivým žákům. Vyberte požadovanou možnost v rozbalovacím menu níže.</p></div><div class="${ssrRenderClass([{ open: open.value }, "dropdown"])}" data-v-098b60e9${_scopeId}><div class="title" data-v-098b60e9${_scopeId}><span data-v-098b60e9${_scopeId}>${ssrInterpolate(title.value)}</span><div class="icon-div" data-v-098b60e9${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  class: "icon",
                  name: open.value ? icons.close : icons.open
                }, null, _parent2, _scopeId));
                _push2(`</div></div><div class="dropdown-content" style="${ssrRenderStyle(open.value ? null : { display: "none" })}" data-v-098b60e9${_scopeId}><!--[-->`);
                ssrRenderList(dropdownItems.value, (item, index) => {
                  _push2(`<div class="${ssrRenderClass([{ selected: selectedDropdown.value === index }, "section"])}" data-v-098b60e9${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_Icon, {
                    class: "icon",
                    name: selectedDropdown.value === index ? icons.select : icons.selected
                  }, null, _parent2, _scopeId));
                  _push2(`<span data-v-098b60e9${_scopeId}>${ssrInterpolate(item)}</span></div>`);
                });
                _push2(`<!--]--></div></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="line page-section" style="${ssrRenderStyle(editClass.value ? null : { display: "none" })}" data-v-098b60e9${_scopeId}><div class="section-head" data-v-098b60e9${_scopeId}><h3 data-v-098b60e9${_scopeId}> Třídy <span class="update" style="${ssrRenderStyle(JSON.stringify([...selectedClasses.value || []].sort()) !== JSON.stringify([...oldSelectedClasses.value || []].sort()) ? null : { display: "none" })}" data-v-098b60e9${_scopeId}>(aktualizováno)</span></h3><p data-v-098b60e9${_scopeId}>Zde můžete upravit přiřazení tříd, kterým bude úkol zadán. Vyberte požadované třídy a potvrďte změny.</p></div>`);
              _push2(ssrRenderComponent(EditClass, {
                "old-class-ids": selectedClasses.value || [],
                classes: allClasses.value || [],
                reset: triggerReset.value,
                onUpdate: onClassUpdate
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="line page-section" style="${ssrRenderStyle(!editClass.value ? null : { display: "none" })}" data-v-098b60e9${_scopeId}><div class="section-head" data-v-098b60e9${_scopeId}><h3 data-v-098b60e9${_scopeId}> Žáci <span class="update" style="${ssrRenderStyle(JSON.stringify([...selectedUsers.value || []].sort()) !== JSON.stringify([...oldSelectedUsers.value || []].sort()) ? null : { display: "none" })}" data-v-098b60e9${_scopeId}>(aktualizováno)</span></h3><p data-v-098b60e9${_scopeId}>Vyberte žáky, kterým chcete úkol přiřadit, a potvrďte změny.</p></div>`);
              _push2(ssrRenderComponent(unref(Vue3Datatable), {
                rows: allStudents.value,
                ref_key: "datatable",
                ref: datatable,
                columns: cols.value,
                pageSize: 10,
                sortable: true,
                search: searchInput.value,
                hasCheckbox: true,
                onInput: onCheckboxSelect
              }, {
                name: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="profile" data-v-098b60e9${_scopeId2}><img${ssrRenderAttr("src", "http://89.203.248.163/uploads/profilePictures/" + data.value.profilePicture)} alt="User profile photo" loading="lazy" data-v-098b60e9${_scopeId2}><p data-v-098b60e9${_scopeId2}>${ssrInterpolate(data.value.name)} ${ssrInterpolate(data.value.surname)}</p></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "profile" }, [
                        createVNode("img", {
                          src: "http://89.203.248.163/uploads/profilePictures/" + data.value.profilePicture,
                          alt: "User profile photo",
                          loading: "lazy"
                        }, null, 8, ["src"]),
                        createVNode("p", null, toDisplayString(data.value.name) + " " + toDisplayString(data.value.surname), 1)
                      ])
                    ];
                  }
                }),
                abbreviation: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p class="uppercase" data-v-098b60e9${_scopeId2}>${ssrInterpolate(data.value.abbreviation || "Není")}</p>`);
                  } else {
                    return [
                      createVNode("p", { class: "uppercase" }, toDisplayString(data.value.abbreviation || "Není"), 1)
                    ];
                  }
                }),
                createdAt: withCtx((data, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p data-v-098b60e9${_scopeId2}>${ssrInterpolate(unref(moment)(data.value.createdAt).format("DD.MM. YYYY HH:MM"))}</p>`);
                  } else {
                    return [
                      createVNode("p", null, toDisplayString(unref(moment)(data.value.createdAt).format("DD.MM. YYYY HH:MM")), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(ssrRenderComponent(EditFormFooter, {
                "is-loading": submitLoading.value,
                "reset-function": resetSelection,
                "submit-function": assignToTask
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Pole označená * jsou povinná `);
                  } else {
                    return [
                      createTextVNode(" Pole označená * jsou povinná ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(ssrRenderComponent(__nuxt_component_2, null, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { id: "tasks" }, [
                  createVNode("div", { class: "content" }, [
                    createVNode("div", { class: "line page-section" }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, toDisplayString(task.value.name), 1),
                        createVNode("p", null, "Úkol ID: " + toDisplayString(task.value.id), 1),
                        createVNode("p", null, "Garant ID: " + toDisplayString(task.value.guarantor), 1),
                        createVNode("p", null, "Začátek: " + toDisplayString(unref(moment)(task.value.startDate).format("DD.MM. YYYY HH:MM")), 1),
                        createVNode("p", null, "Konec: " + toDisplayString(unref(moment)(task.value.endDate).format("DD.MM. YYYY HH:MM")), 1),
                        createVNode("p", null, "Nutné potvrzení: " + toDisplayString(task.value.approve ? "Ano" : "Ne"), 1),
                        createVNode("p", null, [
                          createTextVNode(" Zadání: "),
                          createVNode("a", {
                            href: `http://89.203.248.163/uploads/tasks/${task.value.id}/${task.value.task}`,
                            class: "link",
                            download: "",
                            target: "_blank"
                          }, toDisplayString(task.value.task), 9, ["href"])
                        ])
                      ])
                    ]),
                    oldSelectedClasses.value.length <= 0 && oldSelectedUsers.value.length <= 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "line page-section"
                    }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, "Přiřazení pro (třídy/žáky)"),
                        createVNode("p", null, "Zde můžete přiřadit úkol buď celé třídě, nebo jednotlivým žákům. Vyberte požadovanou možnost v rozbalovacím menu níže.")
                      ]),
                      createVNode("div", {
                        class: ["dropdown", { open: open.value }]
                      }, [
                        createVNode("div", {
                          class: "title",
                          onClick: toggleDropdown
                        }, [
                          createVNode("span", null, toDisplayString(title.value), 1),
                          createVNode("div", { class: "icon-div" }, [
                            createVNode(_component_Icon, {
                              class: "icon",
                              name: open.value ? icons.close : icons.open
                            }, null, 8, ["name"])
                          ])
                        ]),
                        withDirectives(createVNode("div", { class: "dropdown-content" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(dropdownItems.value, (item, index) => {
                            return openBlock(), createBlock("div", {
                              key: index,
                              class: [{ selected: selectedDropdown.value === index }, "section"],
                              onClick: ($event) => onDropdownSelect(index)
                            }, [
                              createVNode(_component_Icon, {
                                class: "icon",
                                name: selectedDropdown.value === index ? icons.select : icons.selected
                              }, null, 8, ["name"]),
                              createVNode("span", null, toDisplayString(item), 1)
                            ], 10, ["onClick"]);
                          }), 128))
                        ], 512), [
                          [vShow, open.value]
                        ])
                      ], 2)
                    ])) : createCommentVNode("", true),
                    withDirectives(createVNode("div", { class: "line page-section" }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, [
                          createTextVNode(" Třídy "),
                          withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                            [vShow, JSON.stringify([...selectedClasses.value || []].sort()) !== JSON.stringify([...oldSelectedClasses.value || []].sort())]
                          ])
                        ]),
                        createVNode("p", null, "Zde můžete upravit přiřazení tříd, kterým bude úkol zadán. Vyberte požadované třídy a potvrďte změny.")
                      ]),
                      createVNode(EditClass, {
                        "old-class-ids": selectedClasses.value || [],
                        classes: allClasses.value || [],
                        reset: triggerReset.value,
                        onUpdate: onClassUpdate
                      }, null, 8, ["old-class-ids", "classes", "reset"])
                    ], 512), [
                      [vShow, editClass.value]
                    ]),
                    withDirectives(createVNode("div", { class: "line page-section" }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, [
                          createTextVNode(" Žáci "),
                          withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                            [vShow, JSON.stringify([...selectedUsers.value || []].sort()) !== JSON.stringify([...oldSelectedUsers.value || []].sort())]
                          ])
                        ]),
                        createVNode("p", null, "Vyberte žáky, kterým chcete úkol přiřadit, a potvrďte změny.")
                      ]),
                      createVNode(unref(Vue3Datatable), {
                        rows: allStudents.value,
                        ref_key: "datatable",
                        ref: datatable,
                        columns: cols.value,
                        pageSize: 10,
                        sortable: true,
                        search: searchInput.value,
                        hasCheckbox: true,
                        onInput: onCheckboxSelect
                      }, {
                        name: withCtx((data) => [
                          createVNode("div", { class: "profile" }, [
                            createVNode("img", {
                              src: "http://89.203.248.163/uploads/profilePictures/" + data.value.profilePicture,
                              alt: "User profile photo",
                              loading: "lazy"
                            }, null, 8, ["src"]),
                            createVNode("p", null, toDisplayString(data.value.name) + " " + toDisplayString(data.value.surname), 1)
                          ])
                        ]),
                        abbreviation: withCtx((data) => [
                          createVNode("p", { class: "uppercase" }, toDisplayString(data.value.abbreviation || "Není"), 1)
                        ]),
                        createdAt: withCtx((data) => [
                          createVNode("p", null, toDisplayString(unref(moment)(data.value.createdAt).format("DD.MM. YYYY HH:MM")), 1)
                        ]),
                        _: 1
                      }, 8, ["rows", "columns", "search"])
                    ], 512), [
                      [vShow, !editClass.value]
                    ]),
                    createVNode(EditFormFooter, {
                      "is-loading": submitLoading.value,
                      "reset-function": resetSelection,
                      "submit-function": assignToTask
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Pole označená * jsou povinná ")
                      ]),
                      _: 1
                    }, 8, ["is-loading"])
                  ]),
                  createVNode(__nuxt_component_2)
                ])
              ];
            }
          }),
          key: "0"
        } : void 0
      ]), _parent));
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/tasks/teacher/[taskId]/assign.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const assign = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-098b60e9"]]);

export { assign as default };
//# sourceMappingURL=assign.vue2.mjs.map
