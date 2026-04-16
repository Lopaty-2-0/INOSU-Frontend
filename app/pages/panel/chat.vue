<script setup lang="ts">
import {computed, ref, watchEffect} from "vue";
import Navbar from "~/components/layout/Navbar.vue";
import {useLoadingStore} from "~/stores/loading";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import Chat from "~/components/layout/Chat.vue";
import Pagination from "~/components/ui/Pagination.vue";
import InputMenu from "~/components/ui/InputMenu.vue";
import Image from "~/components/ui/Image.vue";
import type {AccountData} from "~/types/account";
import type {ConversationData} from "~/types/chat";
import Loading from "~/components/ui/Loading.vue";
import { useAlertsStore } from "~/stores/alerts";
import { useI18n } from "#imports";

const { t } = useI18n();

useHead({
  title: t('pages.chat.title'),
  meta: [{ name: "description", content: t('pages.chat.description') }],
});

const config = useRuntimeConfig();
const alertsStore = useAlertsStore();
const usersDropdown = ref<InstanceType<typeof InputMenu> | null>(null);
const amountForUsersPaging: number = 5;
const amountForConversationsPaging: number = 10;
const selectedConversation = ref<ConversationData | undefined>(undefined);
const conversations = ref<ConversationData[] | undefined>(undefined);
const conversationsCount = ref<number>(0);
const currentConversationsPage = ref<number>(1);
const numberOfConversationsPages = computed<number>((): number => {
  return Math.ceil(conversationsCount.value / amountForConversationsPaging);
});

const usersSearchInput = ref<string>("");
const currentUsersPage = ref<number>(1);
const usersCount = ref<number>(0);
const conversationsLoading = ref<boolean>(false);
const users = ref<AccountData[]>([]);
const numberOfUsersPages = computed<number>((): number => {
  return Math.ceil(usersCount.value / amountForUsersPaging);
});
const dropDownUsers = computed(() => {
  return users.value.map((user: AccountData) => {
    return {
      label: user.name + " " + user.surname + " - " + user.email,
      value: user.id.toString(),
    };
  });
});

const selectConversation = (conversation: ConversationData | undefined): void => {
  selectedConversation.value = conversation;
};

const onUsersSearchInputChange = (input: string): void => {
  currentUsersPage.value = 1;

  usersSearchInput.value = input;
};

const removeConversation = async (conversation: ConversationData): Promise<void> => {
  if (!conversation) return;

  await $fetch("/api/conversation/delete", {
    method: "delete",
    body: {
      idConversation: conversation.idConversation,
      idUser: conversation.user.id
    },
    credentials: "include",
    ignoreResponseError: true,
    async onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "87010":
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.removeConversation.title'), message: t('chat.alerts.removeConversation.noId') });
          break;

        case "87020":
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.removeConversation.title'), message: t('chat.alerts.removeConversation.invalidId') });
          break;

        case "87030":
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.removeConversation.title'), message: t('chat.alerts.removeConversation.invalidId') });
          break;

        case "87040":
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.removeConversation.title'), message: t('chat.alerts.removeConversation.noUserId') });
          break;

        case "87050":
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.removeConversation.title'), message: t('chat.alerts.removeConversation.invalidUserId') });
          break;

        case "87060":
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.removeConversation.title'), message: t('chat.alerts.removeConversation.invalidUserId') });
          break;

        case "87070":
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.removeConversation.title'), message: t('chat.alerts.removeConversation.notFound') });
          break;

        case "87081":
          await refreshConversations();
          alertsStore.addAlert({ type: "success", title: t('chat.alerts.removeConversation.title'), message: t('chat.alerts.removeConversation.success') });
          break;

        case "E10100":
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.removeConversation.title'), message: t('errors.E10100') });
          break;

        default:
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.removeConversation.title'), message: t('chat.alerts.removeConversation.unknown') });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: t('chat.alerts.removeConversation.title'), message: t('chat.alerts.removeConversation.unknown') });
    },
  }).finally((): void => {
    conversationsLoading.value = false;

    selectConversation(undefined);
  });
};

const createNewConversation = async (userId: string[]): Promise<void> => {
  if (!userId[0]) return;

  conversationsLoading.value = true;

  await $fetch("/api/conversation/add", {
    method: "post",
    body: {
      idUser: userId[0],
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

        case "E10100":
          alertsStore.addAlert({ type: "error", title: t('chat.alerts.createConversation.title'), message: t('errors.E10100') });
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
    conversationsLoading.value = false;
    selectConversation(undefined);

    if (usersDropdown.value) usersDropdown.value.resetSelection();
  });
};

const { data: conversationsData, error: conversationsError, pending: conversationsPending, refresh: refreshConversations } = useFetch("/api/conversation/get", {
  query: {
    amountForPaging: amountForConversationsPaging,
    pageNumber: currentConversationsPage,
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
});

const { data: usersData, error: usersError, pending: usersPending } = useFetch("/api/user/get", {
  query: {
    amountForPaging: amountForUsersPaging,
    pageNumber: currentUsersPage,
    searchQuery: usersSearchInput,
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
});

watch([usersData, usersError], (): void => {
  if (usersError.value) {
    if (usersError.value?.data?.resCode?.toString() === "E10100") {
      useLoadingStore().setHasRateLimit(true);
      return;
    }
    users.value = [];
    usersCount.value = 0;
    return;
  }

  if (!usersData.value) return;

  users.value = usersData.value.data.users;
  usersCount.value = usersData.value.data.count;
}, { immediate: true });

watch([conversationsData, conversationsError], (): void => {
  if (conversationsError.value) {
    if (conversationsError.value?.data?.resCode?.toString() === "E10100") {
      useLoadingStore().setHasRateLimit(true);
      return;
    }
    conversations.value = [];
    conversationsCount.value = 0;
    return;
  }

  if (!conversationsData.value) return;

  conversations.value = conversationsData.value.data.conversations;
  conversationsCount.value = conversationsData.value.data.count;
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !conversations.value && !conversationsError.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: t('chat.title'), to: `/panel/chat`, icon: 'material-symbols:mark-chat-unread-rounded', active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="chat" v-if="conversations">
        <div class="conversations">
          <div class="head">
            <h3>{{ t('chat.title') }}</h3>

            <InputMenu ref="usersDropdown" v-if="dropDownUsers" :items="dropDownUsers" hide-icons disable-item-filtering :placeholder="t('chat.newConversationPlaceholder')" :loading="usersPending" @search:change="onUsersSearchInputChange" @update:model-value="createNewConversation">
              <template #row-extra v-if="numberOfUsersPages > 1">
                <Pagination v-model="currentUsersPage" :number-of-pages="numberOfUsersPages" :chunk-size="1" />
              </template>
            </InputMenu>
          </div>
          <div class="users" :class="{ isLoading: conversationsPending || conversationsLoading }" v-if="conversations && conversations.length > 0">
            <Loading class="loading" v-if="conversationsPending || conversationsLoading" size="20px" color="rgba(var(--description-color), 1)"/>

            <div class="user" v-for="conversation in conversations" :key="conversation.idConversation" @click="selectConversation(conversation)" :class="{ active: selectedConversation?.idConversation === conversation.idConversation && selectedConversation.user === conversation.user }">
              <div class="profile">
                <Image :src="config.public.originUrl + '/api/file/pfp/' + conversation.user.profilePicture" alt="profile-photo" draggable="false"/>

                <div class="data">
                  <p class="account-name no-wrap">
                    {{ conversation.user.name }} {{ conversation.user.surname }}
                  </p>

                  <p class="abbreviation no-wrap">
                    {{ conversation.user.abbreviation || t('chat.unknown') }}
                  </p>
                </div>
              </div>

              <button class="remove-btn" @click="removeConversation(conversation)"><Icon class="icon" name="material-symbols:delete-rounded"></Icon></button>
            </div>
          </div>

          <div class="users" v-else>
            <div class="user no-hover">
              <p class="no-conversations">
                {{ t('chat.noConversations') }}
              </p>
            </div>
          </div>

          <Pagination class="pagination" v-model="currentConversationsPage" :number-of-pages="numberOfConversationsPages" :chunk-size="1" />
        </div>

        <div class="content">
          <Chat class="chat" :conversation="selectedConversation" v-if="selectedConversation"  />

          <div class="card" v-else>
            <p class="error">{{ t('chat.noConversationSelected') }}</p>
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
#chat {
  display: flex;
  flex-direction: row;
  gap: 30px;
  position: relative;
  height: calc(100dvh - 140px);

  .conversations {
    position: relative;
    flex: 0.5;
    display: flex;
    flex-direction: column;
    gap: 30px;
    z-index: 10;

    .head {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 20px;

      h3 {
        font-weight: 600;
        font-size: 20px;
        color: var(--title-color);
      }

      .add-new-conversation {
        min-width: 150px;
        flex: 1;
      }
    }

    .users {
      display: flex;
      flex-direction: column;
      border: var(--border-width) solid rgba(var(--border-color), 0.5);
      border-radius: var(--normal-border-radius);
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;

      &.isLoading {
        .user {
          opacity: var(--disabled-opacity);
          pointer-events: none;
        }

        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }

      &::-webkit-scrollbar {
        width: 5px;
      }

      .user {
        display: flex;
        flex-direction: row;
        gap: 20px;
        padding: 20px;
        align-items: center;
        justify-content: space-between;
        transition: 0.2s;
        background: var(--card-1-background-hover);

        &:not(.no-hover) {
          &:hover, &.active {
            cursor: pointer;
            background: var(--card-1-background);

            .remove-btn {
              opacity: 1;
            }
          }
        }

        &:last-child {
          border-bottom-right-radius: var(--normal-border-radius);
          border-bottom-left-radius: var(--normal-border-radius);
        }

        &:first-child {
          border-top-right-radius: var(--normal-border-radius);
          border-top-left-radius: var(--normal-border-radius);
        }

        &:not(:last-child) {
          border-bottom: var(--border-width) solid rgba(var(--border-color), 0.5);
        }

        .remove-btn {
          padding: 10px;
          border-radius: var(--small-border-radius);
          transition: 0.2s;
          font-size: 18px;
          background: var(--btn-2-background);
          color: var(--btn-2-color);
          border: var(--border-width) solid rgba(var(--border-color), 0.5);
          cursor: pointer;
          line-height: 0;
          opacity: 0;

          &:hover {
            background: rgba(var(--actionBar-actions-remove-background), 1);
            color: var(--actionBar-actions-remove-color);
            border-color: transparent;
          }
        }

        .no-conversations {
          color: var(--mini-title-color);
          font-size: 16px;
        }

        .profile {
          display: flex;
          gap: 10px;
          align-items: center;

          .data {
            display: flex;
            flex-direction: column;
            gap: 5px;

            .account-name {
              color: var(--mini-title-color);
              font-size: 16px;
            }

            .abbreviation {
              color: rgba(var(--description-color), 1);
              font-size: 16px;
            }
          }

          ::v-deep(img) {
            width: 45px;
            height: 45px;
            border-radius: var(--small-border-radius);
            object-fit: cover;
          }
        }
      }
    }

    .pagination {
      margin-top: auto;
    }
  }

  .content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 35px;
    position: relative;
    overflow-x: auto;

    .chat {
      height: 100%;
      min-height: 400px;
    }

    .card {
      border: var(--border-width) solid rgba(var(--border-color), 0.5);
      border-radius: var(--normal-border-radius);
      background: var(--card-1-background);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 30px;
      height: 100%;
      text-align: center;
      flex: 1;
    }

    .error {
      color: rgba(var(--error-color), 1);
      font-size: 16px;
    }
  }
}

@media (max-height: 555px) {
  #chat {
    height: fit-content;

    .conversations .users {
      max-height: 200px;
    }

    .content .chat {
      max-height: 400px;
    }
  }
}

@media (max-width: 1055px) {
  #chat {
    flex-direction: column-reverse;
    min-height: fit-content;
    gap: 60px;

    .content .chat {
      max-height: 500px;
    }

    .conversations .users {
      max-height: 400px;
    }
  }
}
</style>