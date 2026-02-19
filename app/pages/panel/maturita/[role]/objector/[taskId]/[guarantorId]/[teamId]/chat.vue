<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import {ref, watchEffect} from "vue";
import {navigateTo, useFetch} from "nuxt/app";
import {useLoadingStore} from "~/stores/loading";
import { useAlertsStore } from "~/stores/alerts";
import moment from "moment";
import Image from "~/components/ui/Image.vue";
import type {MaturitaTaskData} from "~/types/maturita";
import type { ConversationData} from "~/types/chat";
import Chat from "~/components/layout/Chat.vue";
import Loading from "~/components/ui/Loading.vue";

const route = useRoute();
const teamId = route.params.teamId as string;
const role = route.params.role as string;
const taskId = route.params.taskId as string;
const guarantorId = route.params.guarantorId as string;

useHead({
  title: "Panel | Oponentura zadání - " + taskId + " - Chat",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const config = useRuntimeConfig();
const alertsStore = useAlertsStore();
const task = ref<MaturitaTaskData | undefined>(undefined);
const conversation = ref<ConversationData | undefined>(undefined);
const conversationLoading = ref<boolean>( false);

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
  conversationLoading.value = true;

  await $fetch("/api/conversation/add", {
    method: "post",
    body: {
      idTask: taskId,
      idUser: guarantorId,
      guarantor: guarantorId,
    },
    credentials: "include",
    ignoreResponseError: true,
    async onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "86010":
          alertsStore.addAlert({ type: "error", title: "Vytvoření konverzace", message: "ID uživatele nebylo zadáno." });
          break;
        case "86020":
        case "86030":
          alertsStore.addAlert({ type: "error", title: "Vytvoření konverzace", message: "ID uživatele je neplatné." });
          break;
        case "86040":
          alertsStore.addAlert({ type: "error", title: "Vytvoření konverzace", message: "Uživatel nebyl nalezen." });
          break;
        case "86050":
          alertsStore.addAlert({ type: "error", title: "Vytvoření konverzace", message: "Nelze vytvořit konverzaci se sebou samým." });
          break;

        case "86060":
        case "86070":
          alertsStore.addAlert({ type: "error", title: "Vytvoření konverzace", message: "ID úkolu je neplatné." });
          break;
        case "86080":
        case "86090":
          alertsStore.addAlert({ type: "error", title: "Vytvoření konverzace", message: "Garant je neplatný." });
          break;

        case "86100":
          alertsStore.addAlert({ type: "error", title: "Vytvoření konverzace", message: "Úkol nebyl nalezen." });
          break;
        case "86110":
          alertsStore.addAlert({ type: "error", title: "Vytvoření konverzace", message: "Konverzaci lze vytvořit pouze pro maturitní úkol." });
          break;
        case "86120":
          alertsStore.addAlert({ type: "error", title: "Vytvoření konverzace", message: "Nelze vytvořit konverzaci k ukončenému zadání." });
          break;
        case "86130":
          alertsStore.addAlert({ type: "error", title: "Vytvoření konverzace", message: "Tito uživatelé nemohou vytvořit konverzaci pro tento úkol." });
          break;
        case "86140":
          alertsStore.addAlert({ type: "error", title: "Vytvoření konverzace", message: "Tito uživatelé již mezi sebou konverzaci mají." });
          break;

        case "86151":
          await refreshConversations();
          alertsStore.addAlert({ type: "success", title: "Vytvoření konverzace", message: "Konverzace byla úspěšně vytvořena." });
          break;

        default:
          alertsStore.addAlert({ type: "error", title: "Vytvoření konverzace", message: "Nastala neznámá chyba." });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Vytvoření konverzace", message: "Nastala neznámá chyba." });
    },
  }).finally((): void => {
    conversationLoading.value = false;
  });
};

const { data: conversationsData, error: conversationsError, refresh: refreshConversations } = useFetch("/api/conversation/get/participant", {
  query: {
    idTask: taskId,
    guarantor: guarantorId,
  },
  method: "get",
  server: true,
  credentials: "include",
  lazy: true
});

const { data: taskData, error: taskError } = useFetch("/api/task/get/id", {
  query: {
    id: taskId,
    guarantor: guarantorId,
  },
  method: "get",
  server: true,
  credentials: "include",
  lazy: true
});

watch([conversationsData, conversationsError], (): void => {
  if (!conversationsData.value || conversationsError.value) return;

  conversation.value = conversationsData.value.data.conversation;
}, { immediate: true });

watch([taskData, taskError], (): void => {
  if (taskError.value) {
    navigateTo(`/panel/maturita/${role}/objector`);
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
            { label: 'Maturity', to: `/panel/maturita/${role}/objector`, icon: 'material-symbols:search-rounded' },
            { label: 'Oponentura', to: `/panel/maturita/${role}/objector` },
            { label: `Zadání ID: ${taskId}`, to: `/panel/maturita/${role}/objector/${taskId}/${guarantorId}/${teamId}/` },
            { label: `Vypracování ID: ${teamId}`, to: `/panel/maturita/${role}/objector/${taskId}/${guarantorId}/${teamId}` },
            { label: `Chat`, to: `/panel/maturita/${role}/tasks/${taskId}/${teamId}/chat`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="maturita-task-chat" v-if="task">
        <div class="content">
          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>Chat - {{ task.name }}</h3>
              <p>Úkol ID: {{ task.id }}</p>
              <p>Začátek: {{ moment(task.startDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p>Konec: {{ moment(task.endDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p v-if="task.deadline">Uzávěrka: {{ moment(task.deadline).format("HH:mm DD.MM. YYYY") }}</p>
            </div>

            <div class="user section-head">
              <span>Student:</span>
              <div class="profile" v-if="task.userData && task.userData.id">
                <Image :src="config.public.originUrl + '/api/file/pfp/' + task.userData.profilePicture" alt="profile-photo" draggable="false" />

                <p class="account-name">
                  {{ task.userData.name + " " + task.userData.surname }}
                </p>
              </div>

              <div v-else>
                Neurčeno
              </div>
            </div>
          </div>

          <div class="chats">
            <div class="student card">
              <div class="head">
                <div class="info">
                  <span class="dot" :style="getDotColor(conversation?.isArchived)"></span>
                  <h3>Garant {{ conversation && (conversation.isArchived ? "- Archivováno" : "- Otevřený") }}</h3>
                </div>

                <div class="profile" v-if="task.guarantor">
                  <Image :src="config.public.originUrl + '/api/file/pfp/' + task.guarantor.profilePicture" alt="profile-photo" draggable="false" />

                  <p class="account-name">
                    {{ task.guarantor.name + " " + task.guarantor.surname }}
                  </p>
                </div>

                <p v-else>Neurčeno</p>
              </div>

              <Chat class="chat" :conversation="conversation" v-if="!conversationLoading && conversation" />

              <div class="chat-box" v-if="!conversation && !conversationLoading">
                <button @click="createNewConversation()">Založit konverzaci</button>
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
  height: calc(100vh - 140px);

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
    display: flex;
    flex-direction: column;
    gap: 35px;
    position: relative;

    .chats {
      display: flex;
      flex-direction: row;
      gap: 30px;
      flex: 1;
      min-height: 500px;
      padding-bottom: 30px;

      .card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        flex: 1;
        gap: 20px;

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

@media (max-width: 900px) {
  #maturita-task-chat {
    height: 100%;

    .content {
      .chats {
        flex-direction: column;
        padding-bottom: 0;

        .chat, .card {
          min-height: 400px;
        }
      }
    }
  }
}
</style>