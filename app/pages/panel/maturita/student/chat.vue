<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import {computed, ref, watchEffect} from "vue";
import {navigateTo, useFetch} from "nuxt/app";
import {useLoadingStore} from "~/stores/loading";
import { useAlertsStore } from "~/stores/alerts";
import moment from "moment";
import Image from "~/components/ui/Image.vue";
import type {MaturitaTaskData} from "~/types/maturita";
import type { ConversationData} from "~/types/chat";
import Chat from "~/components/layout/Chat.vue";
import Loading from "~/components/ui/Loading.vue";
import { useI18n } from "#imports";

const { t } = useI18n();

useHead({
  title: computed(() => t('pages.maturita.studentChat.title')),
  meta: [{ name: "description", content: computed(() => t('pages.maturita.studentChat.description')) }],
});

definePageMeta({
  roles: ["student"],
});

const config = useRuntimeConfig();
const alertsStore = useAlertsStore();
const task = ref<MaturitaTaskData | undefined>(undefined);
const conversation = ref<ConversationData | undefined>(undefined);
const conversationLoading = ref<boolean>( false);
const taskId = computed<number | undefined>(() => task.value?.id);
const conversationsQuery = computed(() => {
  if (!task.value) return null;

  return {
    idTask: task.value.id,
    guarantor: task.value.guarantor?.id,
  };
});

const getDotColor = (isArchived?: boolean | null): string => {
  if (isArchived) {
    return "--dot-color: rgba(var(--warning-color), 1)";
  } else if (isArchived !== undefined && isArchived !== null && !isArchived) {
    return "--dot-color: rgba(var(--success-color), 1)";
  } else {
    return "--dot-color: rgba(var(--description-color), 1)";
  }
};

const createNewConversation = async (): Promise<void> => {
  if (!task.value || !task.value.guarantor) return;

  conversationLoading.value = true;

  await $fetch("/api/conversation/add", {
    method: "post",
    body: {
      idTask: task.value.id,
      idUser: task.value.guarantor.id,
      guarantor: task.value.guarantor.id,
    },
    credentials: "include",
    ignoreResponseError: true,
    async onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "86010":
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.createConversation.title'), message: t('chat.alerts.createConversation.noUserId') });
          break;
        case "86020":
        case "86030":
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.createConversation.title'), message: t('chat.alerts.createConversation.invalidUserId') });
          break;
        case "86040":
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.createConversation.title'), message: t('chat.alerts.createConversation.userNotFound') });
          break;
        case "86050":
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.createConversation.title'), message: t('chat.alerts.createConversation.selfConversation') });
          break;

        case "86060":
        case "86070":
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.createConversation.title'), message: t('chat.alerts.createConversation.invalidTaskId') });
          break;
        case "86080":
        case "86090":
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.createConversation.title'), message: t('chat.alerts.createConversation.invalidGuarantor') });
          break;

        case "86100":
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.createConversation.title'), message: t('chat.alerts.createConversation.taskNotFound') });
          break;
        case "86110":
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.createConversation.title'), message: t('chat.alerts.createConversation.onlyMaturita') });
          break;
        case "86120":
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.createConversation.title'), message: t('chat.alerts.createConversation.archivedTask') });
          break;
        case "86130":
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.createConversation.title'), message: t('chat.alerts.createConversation.forbidden') });
          break;
        case "86140":
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.createConversation.title'), message: t('chat.alerts.createConversation.alreadyExists') });
          break;

        case "86151":
          await refreshConversations();
          alertsStore.addAlert({ type: "success", title: t('chat.alerts.createConversation.title'), message: t('chat.alerts.createConversation.success') });
          break;

        default:
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.createConversation.title'), message: t('chat.alerts.createConversation.unknown') });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: t('chat.alerts.createConversation.title'), message: t('chat.alerts.createConversation.unknown') });
    },
  }).finally((): void => {
    conversationLoading.value = false;
  });
};

const { data: conversationsData, error: conversationsError, refresh: refreshConversations } = useFetch("/api/conversation/get/participant", {
  method: "get",
  server: false,
  lazy: true,
  immediate: false,
  credentials: "include",
  query: conversationsQuery,
});

const { data: taskData, error: taskError } = useFetch("/api/task/get/maturita/student/approved", {
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
});

watch(conversationsQuery, (query): void => {
  if (!query) return;

  refreshConversations();
}, { immediate: true });

watch([conversationsData, conversationsError], (): void => {
  if (!conversationsData.value || conversationsError.value) return;

  conversation.value = conversationsData.value.data.conversation;
}, { immediate: true });

watch([taskData, taskError], (): void => {
  if (taskError.value) {
    navigateTo(`/panel`);
    return;
  }

  if (!taskData.value) return;

  task.value = taskData.value.data.task;
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !task.value && !taskError.value || !conversation.value && !conversationsError.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: t('sidebar.links.maturitas'), to: `/panel/maturita/student`, icon: 'material-symbols:folder-copy-rounded' },
            { label: t('maturita.student.breadcrumb', { taskId: taskId || '-' }), to: `/panel/maturita/student` },
            { label: t('sidebar.links.chat'), to: `/panel/maturita/student/chat`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="maturita-task-chat" v-if="task">
        <div class="content">
          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>{{ t('sidebar.links.chat') }} - {{ task.name }}</h3>
              <p>{{ t('maturita.student.chat.taskIdLabel') }} {{ task.id }}</p>
              <p>{{ t('maturita.student.chat.startLabel') }} {{ moment(task.startDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p>{{ t('maturita.student.chat.endLabel') }} {{ moment(task.endDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p v-if="task.deadline">{{ t('maturita.student.chat.deadlineLabel') }} {{ moment(task.deadline).format("HH:mm DD.MM. YYYY") }}</p>
            </div>

            <div class="user section-head">
              <span>{{ t('maturita.student.chat.objectorLabel') }}</span>
              <div class="profile"  v-if="task.objector && task.objector.id">
                <Image :src="config.public.originUrl + '/api/file/pfp/' + task.objector.profilePicture" alt="profile-photo" draggable="false" />

                <p class="account-name">
                  {{ task.objector.name + " " + task.objector.surname }}
                </p>
              </div>

              <p v-else>
                {{ t('maturita.student.chat.undetermined') }}
              </p>
            </div>
          </div>

          <div class="chats">
            <div class="student card">
              <div class="head">
                <div class="info">
                  <span class="dot" :style="getDotColor(conversation?.isArchived)"></span>
                  <h3>{{ t('maturita.student.chat.guarantorTitle') }} {{ conversation && (conversation.isArchived ? t('maturita.student.chat.archived') : t('maturita.student.chat.open')) }}</h3>
                </div>

                <div class="profile" v-if="task.guarantor">
                  <Image :src="config.public.originUrl + '/api/file/pfp/' + task.guarantor.profilePicture" alt="profile-photo" draggable="false" />

                  <p class="account-name">
                    {{ task.guarantor.name + " " + task.guarantor.surname }}
                  </p>
                </div>

                <p v-else>{{ t('maturita.student.chat.undetermined') }}</p>
              </div>

              <Chat class="chat" :conversation="conversation" v-if="!conversationLoading && conversation" />

              <div class="chat-box" v-if="!conversation && !conversationLoading">
                <button @click="createNewConversation()">{{ t('maturita.student.chat.createConversationBtn') }}</button>
              </div>

              <div class="chat-box" v-if="conversationLoading">
                <Loading size="20px" color="rgba(var(--description-color), 1)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
#maturita-task-chat {
  display: flex;
  flex-direction: column;
  gap: 30px;
  position: relative;
  height: calc(100dvh - 140px);

  .page-navigation {
    height: fit-content;
    position: sticky;
    top: 110px;
    min-width: 300px;
    padding: 30px;
  }

  .content {
    width: 100%;
    height: 100%;
    min-height: 600px;
    display: flex;
    flex-direction: column;
    gap: 35px;
    position: relative;

    .chats {
      display: flex;
      flex-direction: row;
      gap: 30px;
      flex: 1;
      min-height: 0;
      padding-bottom: 0;

      .card {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        height: 100%;
        text-align: center;
        flex: 1;
        gap: 20px;
        min-height: 0;

        .head {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;

          .info {
            display: flex;
            align-items: center;
            gap: 10px;

            .dot {
              display: flex;
              min-width: 10px;
              min-height: 10px;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: var(--dot-color);
            }

            h3 {
              font-size: 18px;
              color: var(--title-color);
            }
          }
        }

        .chat {
          width: 100%;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }

        .chat-box {
          display: flex;
          border: var(--border-width) solid rgba(var(--border-color), 0.5);
          border-radius: var(--normal-border-radius);
          background: var(--card-1-background);
          width: 100%;
          flex: 1;
          padding: 30px;
          align-items: center;
          justify-content: center;
          min-height: 0;
          overflow: auto;

          button {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 10px;
            border-radius: var(--small-border-radius);
            transition: 0.2s;
            font-size: 16px;
            background: var(--btn-2-background);
            color: var(--btn-2-color);
            border: var(--border-width) solid rgba(var(--border-color), 0.5);
            cursor: pointer;
            width: fit-content;
            padding: 10px 20px;

            &:hover {
              background: var(--btn-2-hover-background);
            }
          }
        }
      }
    }

    .profile {
      display: flex;
      gap: 10px;
      align-items: center;

      .account-name {
        color: rgba(var(--description-color), 1);
        font-size: 16px;
      }

      ::v-deep(img) {
        width: 45px;
        height: 45px;
        border-radius: var(--small-border-radius);
        object-fit: cover;
      }
    }

    .line {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 30px;
      width: 100%;
      flex: 1;
    }

    .section-head {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .profile {
        display: flex;
        gap: 10px;
        align-items: center;

        .account-name {
          color: rgba(var(--description-color), 1);
          font-size: 16px;
        }

        ::v-deep(img) {
          width: 45px;
          height: 45px;
          border-radius: var(--small-border-radius);
          object-fit: cover;
        }
      }

      h3 {
        font-weight: 600;
        font-size: 20px;
        color: var(--title-color);
      }

      span {
        color: var(--mini-title-color);
      }

      p {
        color: rgba(var(--description-color), 1);
        font-size: 16px;
      }

      .update {
        color: rgba(var(--error-color), 1);
      }
    }

    .page-section {
      border-bottom: none;
      display: flex;
      flex-direction: column;
      gap: 30px;

      &.bottom-line {
        padding-bottom: 35px;
        border-bottom: 1px solid rgba(var(--border-color), 0.5);
      }

      .content {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .input-error {
          font-size: 16px;
          color: rgba(var(--error-color), 1);
        }

        label {
          color: var(--mini-title-color);
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
        }

        input {
          border-radius: var(--normal-border-radius);
          font-size: 16px;
          outline: none;
          padding: 15px;
          border: var(--border-width) solid rgba(var(--border-color), 0.5);
          min-width: 150px;
          background: var(--input-background);
          color: var(--input-color);

          &:focus {
            border-color: rgba(var(--main-color), 1);
          }

          &.error {
            border-color: rgba(var(--error-color), 1);
          }
        }
      }
    }
  }
}

@media (max-height: 750px) {
  #maturita-task-chat {
    height: 100%;

    .content {
      .chats {
        .chat, .card {
          height: 400px;
        }
      }
    }
  }
}

@media (max-width: 900px) {
  #maturita-task-chat {
    height: 100%;

    .content {
      .chats {
        flex-direction: column;
        padding-bottom: 0;

        .card .chat {
          flex: auto;
          height: 400px;
          min-height: auto;
        }
      }
    }
  }
}
</style>