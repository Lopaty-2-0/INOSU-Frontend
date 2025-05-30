import { a as __nuxt_component_0, _ as _export_sfc } from './server.mjs';
import __nuxt_component_0$1 from './index2.mjs';
import { defineComponent, ref, mergeProps, createSlots, withCtx, unref, createVNode, createTextVNode, withDirectives, vShow, toDisplayString, createBlock, openBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { N as Navbar } from './Navbar.vue.mjs';
import { a as apiFetch } from './apiFetch.mjs';
import { useRoute, useRouter } from 'vue-router';
import moment from 'moment/moment.js';
import { u as useAlertsStore, _ as __nuxt_component_2 } from './Alerts.vue.mjs';
import { u as useHead } from './v3.mjs';
import { E as EditTaskFile } from './TaskFile.vue.mjs';
import { E as EditFormFooter } from './Footer.vue.mjs';
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
import './nuxt-link.mjs';
import './Loading.vue.mjs';
import './account.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[userId]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const taskId = route.params.taskId;
    const userId = route.params.userId;
    useHead({
      title: "Panel | Vypracování úkolu: " + taskId + " - uživatelem: " + userId,
      meta: [{ name: "description", content: "Panel Homepage" }]
    });
    const alertsStore = useAlertsStore();
    const task = ref(void 0);
    const elaborator = ref(void 0);
    const guarantor = ref(void 0);
    const taskReviewFile = ref(void 0);
    const loading = ref(false);
    const lastUploadedReviewFileName = ref(void 0);
    const firstFileName = ref(void 0);
    const triggerReset = ref(false);
    const reset = () => {
      if (task.value) task.value.review = firstFileName.value;
      taskReviewFile.value = void 0;
    };
    const removeFile = () => {
      lastUploadedReviewFileName.value = void 0;
      taskReviewFile.value = void 0;
      if (task.value) {
        task.value.review = void 0;
      }
      triggerReset.value = true;
      setTimeout(() => {
        triggerReset.value = false;
      }, 100);
    };
    const submit = async () => {
      loading.value = true;
      const formData = new FormData();
      formData.append("idTask", taskId);
      formData.append("idUser", userId);
      formData.append("review", taskReviewFile.value || "");
      await apiFetch("/user_task/update", {
        method: "put",
        body: formData,
        credentials: "include",
        ignoreResponseError: true,
        async onResponse({ response }) {
          var _a, _b, _c;
          const resCode = (_a = response._data.resCode) == null ? void 0 : _a.toString();
          switch (resCode) {
            case "38010":
              alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Nebyl zadán id úkolu." });
              break;
            case "38020":
              alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Uživatel neexistuje." });
              break;
            case "38030":
              alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Úkol neexistuje." });
              break;
            case "38040":
              alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Záznam user_task neexistuje." });
              break;
            case "38050":
              alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Špatný formát souboru (review)." });
              break;
            case "38060":
              alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Nelze provést tuto akci (review lze nahrát jen u schváleného úkolu)." });
              break;
            case "38070":
              alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Název souboru (review) je příliš dlouhý." });
              break;
            case "38080":
              alertsStore.addAlert({ type: "error", title: "Vypracování", message: "Špatný formát souboru (elaboration)." });
              break;
            case "38090":
              alertsStore.addAlert({ type: "error", title: "Vypracování", message: "Název souboru (elaboration) je příliš dlouhý." });
              break;
            case "38100":
              alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Nemáte oprávnění." });
              break;
            case "38111":
              alertsStore.addAlert({ type: "success", title: "Hodnocení", message: "Hodnocení bylo úspěšně aktualizováno." });
              if (task.value) {
                task.value.review = ((_b = taskReviewFile.value) == null ? void 0 : _b.name) || void 0;
                lastUploadedReviewFileName.value = ((_c = taskReviewFile.value) == null ? void 0 : _c.name) || void 0;
              }
              taskReviewFile.value = void 0;
              break;
            default:
              alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Nastala neznámá chyba." });
              break;
          }
        },
        onRequestError() {
          alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Nastala chyba při odesílání požadavku." });
        }
      }).finally(() => {
        loading.value = false;
      });
    };
    const onTaskFileUpdate = (taskFile) => {
      taskReviewFile.value = taskFile;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_Icon = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({
        name: "panel",
        loading: !task.value || !elaborator.value || !guarantor.value
      }, _attrs), createSlots({
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Navbar, {
              links: [
                { name: "Úkoly", path: `/panel/tasks/teacher` },
                { name: `Úkol: ${unref(taskId)}`, path: `/panel/tasks/teacher/${unref(taskId)}` },
                { name: `Uživatel: ${unref(userId)}`, path: `/panel/tasks/teacher/${unref(taskId)}/${unref(userId)}` }
              ]
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Navbar, {
                links: [
                  { name: "Úkoly", path: `/panel/tasks/teacher` },
                  { name: `Úkol: ${unref(taskId)}`, path: `/panel/tasks/teacher/${unref(taskId)}` },
                  { name: `Uživatel: ${unref(userId)}`, path: `/panel/tasks/teacher/${unref(taskId)}/${unref(userId)}` }
                ]
              }, null, 8, ["links"])
            ];
          }
        }),
        _: 2
      }, [
        task.value && elaborator.value && guarantor.value ? {
          name: "content",
          fn: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div id="task" data-v-ed7a9c9b${_scopeId}><div class="content" data-v-ed7a9c9b${_scopeId}><div class="line page-section" data-v-ed7a9c9b${_scopeId}><div class="section-head" data-v-ed7a9c9b${_scopeId}><h3 data-v-ed7a9c9b${_scopeId}>${ssrInterpolate(task.value.name)}</h3><p data-v-ed7a9c9b${_scopeId}>Úkol ID: ${ssrInterpolate(task.value.id)}</p><p data-v-ed7a9c9b${_scopeId}>Garant: ${ssrInterpolate(guarantor.value.name)} ${ssrInterpolate(guarantor.value.surname)}</p><p data-v-ed7a9c9b${_scopeId}>Začátek: ${ssrInterpolate(unref(moment)(task.value.startDate).format("DD.MM. YYYY HH:MM"))}</p><p data-v-ed7a9c9b${_scopeId}>Konec: ${ssrInterpolate(unref(moment)(task.value.endDate).format("DD.MM. YYYY HH:MM"))}</p><p data-v-ed7a9c9b${_scopeId}>Nutné potvrzení: ${ssrInterpolate(task.value.approve ? "Ano" : "Ne")}</p><div class="profile" data-v-ed7a9c9b${_scopeId}><p data-v-ed7a9c9b${_scopeId}>Vypracovává:</p><div class="data" data-v-ed7a9c9b${_scopeId}><img${ssrRenderAttr("src", "http://89.203.248.163/uploads/profilePictures/" + elaborator.value.profilePicture)} alt="User profile photo" loading="lazy" data-v-ed7a9c9b${_scopeId}><span data-v-ed7a9c9b${_scopeId}>${ssrInterpolate(elaborator.value.name)} ${ssrInterpolate(elaborator.value.surname)}</span></div></div></div></div><div class="line page-section" data-v-ed7a9c9b${_scopeId}><div class="section-head" data-v-ed7a9c9b${_scopeId}><h3 data-v-ed7a9c9b${_scopeId}>Materiály</h3><div class="line file" data-v-ed7a9c9b${_scopeId}><a${ssrRenderAttr("href", `http://89.203.248.163/uploads/tasks/${task.value.id}/${task.value.task}`)} class="link" download target="_blank" data-v-ed7a9c9b${_scopeId}>${ssrInterpolate(task.value.task)}</a><a class="icon-div"${ssrRenderAttr("href", `http://89.203.248.163/uploads/tasks/${task.value.id}/${task.value.task}`)} download target="_blank" data-v-ed7a9c9b${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                class: "icon",
                name: "material-symbols:download-2-rounded"
              }, null, _parent2, _scopeId));
              _push2(`</a></div></div></div><div class="line page-section" data-v-ed7a9c9b${_scopeId}><div class="section-head" data-v-ed7a9c9b${_scopeId}><h3 data-v-ed7a9c9b${_scopeId}>Vypracování</h3>`);
              if (task.value.elaboration) {
                _push2(`<div class="line file" data-v-ed7a9c9b${_scopeId}><a${ssrRenderAttr("href", `http://89.203.248.163/uploads/tasks/${task.value.id}/${elaborator.value.id}/elaboration/${task.value.elaboration}`)} class="link" download target="_blank" data-v-ed7a9c9b${_scopeId}>${ssrInterpolate(task.value.elaboration)}</a><a class="icon-div"${ssrRenderAttr("href", `http://89.203.248.163/uploads/tasks/${task.value.id}/${elaborator.value.id}/elaboration/${task.value.elaboration}`)} download target="_blank" data-v-ed7a9c9b${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  class: "icon",
                  name: "material-symbols:download-2-rounded"
                }, null, _parent2, _scopeId));
                _push2(`</a></div>`);
              } else {
                _push2(`<p data-v-ed7a9c9b${_scopeId}><span class="error" data-v-ed7a9c9b${_scopeId}>Uživatel ještě nevypracoval tento úkol.</span></p>`);
              }
              _push2(`</div></div><div class="line page-section review" data-v-ed7a9c9b${_scopeId}>`);
              _push2(ssrRenderComponent(EditTaskFile, {
                reset: triggerReset.value,
                "old-task-file": task.value.review,
                onUpdate: onTaskFileUpdate
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="section-head" data-v-ed7a9c9b${_scopeId2}><h3 data-v-ed7a9c9b${_scopeId2}>Hodnocení <span class="update" style="${ssrRenderStyle(taskReviewFile.value !== void 0 ? null : { display: "none" })}" data-v-ed7a9c9b${_scopeId2}>(aktualizováno)</span></h3><p data-v-ed7a9c9b${_scopeId2}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquam consequatur mollitia officiis placeat!</p></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, [
                          createTextVNode("Hodnocení "),
                          withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                            [vShow, taskReviewFile.value !== void 0]
                          ])
                        ]),
                        createVNode("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquam consequatur mollitia officiis placeat!")
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div class="column" data-v-ed7a9c9b${_scopeId}><button class="icon-div" data-v-ed7a9c9b${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                class: "icon",
                name: "material-symbols:delete"
              }, null, _parent2, _scopeId));
              _push2(`</button>`);
              if (lastUploadedReviewFileName.value || task.value.review) {
                _push2(`<a class="icon-div"${ssrRenderAttr("href", `http://89.203.248.163/uploads/tasks/${task.value.id}/${elaborator.value.id}/review/${lastUploadedReviewFileName.value || task.value.review}`)} download target="_blank" data-v-ed7a9c9b${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  class: "icon",
                  name: "material-symbols:download-2-rounded"
                }, null, _parent2, _scopeId));
                _push2(`</a>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
              _push2(ssrRenderComponent(EditFormFooter, {
                "is-loading": loading.value,
                "reset-function": reset,
                "submit-function": submit
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
              _push2(`</div></div>`);
              _push2(ssrRenderComponent(__nuxt_component_2, null, null, _parent2, _scopeId));
            } else {
              return [
                createVNode("div", { id: "task" }, [
                  createVNode("div", { class: "content" }, [
                    createVNode("div", { class: "line page-section" }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, toDisplayString(task.value.name), 1),
                        createVNode("p", null, "Úkol ID: " + toDisplayString(task.value.id), 1),
                        createVNode("p", null, "Garant: " + toDisplayString(guarantor.value.name) + " " + toDisplayString(guarantor.value.surname), 1),
                        createVNode("p", null, "Začátek: " + toDisplayString(unref(moment)(task.value.startDate).format("DD.MM. YYYY HH:MM")), 1),
                        createVNode("p", null, "Konec: " + toDisplayString(unref(moment)(task.value.endDate).format("DD.MM. YYYY HH:MM")), 1),
                        createVNode("p", null, "Nutné potvrzení: " + toDisplayString(task.value.approve ? "Ano" : "Ne"), 1),
                        createVNode("div", { class: "profile" }, [
                          createVNode("p", null, "Vypracovává:"),
                          createVNode("div", { class: "data" }, [
                            createVNode("img", {
                              src: "http://89.203.248.163/uploads/profilePictures/" + elaborator.value.profilePicture,
                              alt: "User profile photo",
                              loading: "lazy"
                            }, null, 8, ["src"]),
                            createVNode("span", null, toDisplayString(elaborator.value.name) + " " + toDisplayString(elaborator.value.surname), 1)
                          ])
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "line page-section" }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, "Materiály"),
                        createVNode("div", { class: "line file" }, [
                          createVNode("a", {
                            href: `http://89.203.248.163/uploads/tasks/${task.value.id}/${task.value.task}`,
                            class: "link",
                            download: "",
                            target: "_blank"
                          }, toDisplayString(task.value.task), 9, ["href"]),
                          createVNode("a", {
                            class: "icon-div",
                            href: `http://89.203.248.163/uploads/tasks/${task.value.id}/${task.value.task}`,
                            download: "",
                            target: "_blank"
                          }, [
                            createVNode(_component_Icon, {
                              class: "icon",
                              name: "material-symbols:download-2-rounded"
                            })
                          ], 8, ["href"])
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "line page-section" }, [
                      createVNode("div", { class: "section-head" }, [
                        createVNode("h3", null, "Vypracování"),
                        task.value.elaboration ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "line file"
                        }, [
                          createVNode("a", {
                            href: `http://89.203.248.163/uploads/tasks/${task.value.id}/${elaborator.value.id}/elaboration/${task.value.elaboration}`,
                            class: "link",
                            download: "",
                            target: "_blank"
                          }, toDisplayString(task.value.elaboration), 9, ["href"]),
                          createVNode("a", {
                            class: "icon-div",
                            href: `http://89.203.248.163/uploads/tasks/${task.value.id}/${elaborator.value.id}/elaboration/${task.value.elaboration}`,
                            download: "",
                            target: "_blank"
                          }, [
                            createVNode(_component_Icon, {
                              class: "icon",
                              name: "material-symbols:download-2-rounded"
                            })
                          ], 8, ["href"])
                        ])) : (openBlock(), createBlock("p", { key: 1 }, [
                          createVNode("span", { class: "error" }, "Uživatel ještě nevypracoval tento úkol.")
                        ]))
                      ])
                    ]),
                    createVNode("div", { class: "line page-section review" }, [
                      createVNode(EditTaskFile, {
                        reset: triggerReset.value,
                        "old-task-file": task.value.review,
                        onUpdate: onTaskFileUpdate
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "section-head" }, [
                            createVNode("h3", null, [
                              createTextVNode("Hodnocení "),
                              withDirectives(createVNode("span", { class: "update" }, "(aktualizováno)", 512), [
                                [vShow, taskReviewFile.value !== void 0]
                              ])
                            ]),
                            createVNode("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquam consequatur mollitia officiis placeat!")
                          ])
                        ]),
                        _: 1
                      }, 8, ["reset", "old-task-file"]),
                      createVNode("div", { class: "column" }, [
                        createVNode("button", {
                          class: "icon-div",
                          onClick: removeFile
                        }, [
                          createVNode(_component_Icon, {
                            class: "icon",
                            name: "material-symbols:delete"
                          })
                        ]),
                        lastUploadedReviewFileName.value || task.value.review ? (openBlock(), createBlock("a", {
                          key: 0,
                          class: "icon-div",
                          href: `http://89.203.248.163/uploads/tasks/${task.value.id}/${elaborator.value.id}/review/${lastUploadedReviewFileName.value || task.value.review}`,
                          download: "",
                          target: "_blank"
                        }, [
                          createVNode(_component_Icon, {
                            class: "icon",
                            name: "material-symbols:download-2-rounded"
                          })
                        ], 8, ["href"])) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode(EditFormFooter, {
                      "is-loading": loading.value,
                      "reset-function": reset,
                      "submit-function": submit
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Pole označená * jsou povinná ")
                      ]),
                      _: 1
                    }, 8, ["is-loading"])
                  ])
                ]),
                createVNode(__nuxt_component_2)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panel/tasks/teacher/[taskId]/[userId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _userId_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ed7a9c9b"]]);

export { _userId_ as default };
//# sourceMappingURL=_userId_.vue2.mjs.map
