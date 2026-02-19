<script lang="ts" setup>
import Textarea from "~/components/ui/Textarea.vue";
import Loading from "~/components/ui/Loading.vue";
import {useFetch} from "nuxt/app";
import {computed, watch,} from "vue";
import moment from "moment/moment";
import {useAlertsStore} from "~/stores/alerts";
import type {ConversationData, ConversationMessageData} from "~/types/chat";
import {useAccountStore} from "~/stores/account";
import {storeToRefs} from "pinia";

const props = defineProps({
  conversation: {
    type: Object as () => ConversationData,
    required: true
  },
  pagesPerFetch: {
    type: Number,
    required: false,
    default: 10
  }
});

const alertsStore = useAlertsStore();
const accountStore = useAccountStore();
const { getId: userId } = storeToRefs(accountStore);
const conversation = computed<ConversationData>(() => props.conversation);
const archived = computed<boolean>(() => conversation.value.isArchived);
const conversationUserId = computed<number>(() => conversation.value.user.id);
const conversationId = computed<number>(() => conversation.value.idConversation);
const currentPage = ref<number>(1);
const messageLoadingId = ref<number | null>(null);
const replyingToMessage = ref<ConversationMessageData | null>(null);
const textMessage = ref<string>("");
const messages = ref<ConversationMessageData[]>([]);
const isRefreshed = ref<boolean>(false);
const allMessagesCount = ref<number>(0);
const messagesCount = computed<number>((): number => messages.value.length);
const sendLoading = ref<boolean>(false);

const setReplyMessage = (message: ConversationMessageData | null) => {
  if (replyingToMessage.value?.idMessage === message?.idMessage) {
    replyingToMessage.value = null;
    return;
  }

  replyingToMessage.value = message;
};

const isCurrentUser = (authorId?: number | null): boolean => {
  if (!authorId) return false;

  return authorId === userId.value;
};

const isMessageSentByCurrentUser = (message: ConversationMessageData): boolean => {
  return message.sender.id === userId.value;
};

const getMessageStyles = (authorId?: number | null) => {
  if (isCurrentUser(authorId)) {
    return {
      "--message-bg": "var(--btn-1-background)",
      "--message-color": "var(--btn-1-color)"
    };
  }
  return {
    "--message-bg": "var(--card-2-background)",
    "--message-color": "rgba(var(--description-color), 1)"
  };
};

const removeMessage = async (message: ConversationMessageData): Promise<void> => {
  if (!isMessageSentByCurrentUser(message)) return;

  messageLoadingId.value = message.idMessage;

  await $fetch("/api/message/delete", {
    method: "DELETE",
    body: {
      idConversation: conversationId.value,
      idMessage: message.idMessage,
      idUser: conversationUserId.value
    },
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "88010":
          alertsStore.addAlert({ type: "error", title: "Smazání zprávy", message: "ID konverzace nebylo zadáno." });
          break;

        case "88020":
          alertsStore.addAlert({ type: "error", title: "Smazání zprávy", message: "ID zprávy nebylo zadáno." });
          break;

        case "88030":
          alertsStore.addAlert({ type: "error", title: "Smazání zprávy", message: "ID uživatele nebylo zadáno." });
          break;

        case "88040":
          alertsStore.addAlert({ type: "error", title: "Smazání zprávy", message: "ID konverzace musí být číslo." });
          break;

        case "88050":
          alertsStore.addAlert({ type: "error", title: "Smazání zprávy", message: "ID konverzace je neplatné." });
          break;

        case "88060":
          alertsStore.addAlert({ type: "error", title: "Smazání zprávy", message: "ID zprávy musí být číslo." });
          break;

        case "88070":
          alertsStore.addAlert({ type: "error", title: "Smazání zprávy", message: "ID zprávy je neplatné." });
          break;

        case "88080":
          alertsStore.addAlert({ type: "error", title: "Smazání zprávy", message: "ID uživatele musí být číslo." });
          break;

        case "88090":
          alertsStore.addAlert({ type: "error", title: "Smazání zprávy", message: "ID uživatele je neplatné." });
          break;

        case "88110":
          alertsStore.addAlert({ type: "error", title: "Smazání zprávy", message: "Konverzace nebyla nalezena." });
          break;

        case "88120":
          alertsStore.addAlert({ type: "error", title: "Smazání zprávy", message: "V této archivované konverzaci nelze mazat zprávy." });
          break;

        case "88130":
          alertsStore.addAlert({ type: "error", title: "Smazání zprávy", message: "Zpráva nebyla nalezena." });
          break;

        case "88140":
          alertsStore.addAlert({ type: "error", title: "Smazání zprávy", message: "Tuto zprávu nelze smazat." });
          break;

        case "88151":
          messages.value = messages.value.filter((m: ConversationMessageData) => m.idMessage !== message.idMessage);
          messages.value = messages.value.map((m: ConversationMessageData) => {
            if (m.replyToMessage?.idMessage === message.idMessage) {
              return { ...m, replyToMessage: undefined };
            }
            return m;
          });

          alertsStore.addAlert({ type: "success", title: "Smazání zprávy", message: "Zpráva byla úspěšně smazána." });
          break;

        default:
          alertsStore.addAlert({ type: "error", title: "Smazání zprávy", message: "Nastala neznámá chyba." });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Smazání zprávy", message: "Nastala neznámá chyba." });
    },
  }).finally((): void => {
    messageLoadingId.value = null;
  });
};

const addMessage = async (): Promise<void> => {
  if (!textMessage.value || !conversation.value) return;

  sendLoading.value = true;

  await $fetch("/api/message/add", {
    method: "post",
    body: {
      idConversation: conversationId.value,
      idUser: conversationUserId.value,
      message: textMessage.value,
      replyToMessage: replyingToMessage.value?.idMessage || null,
    },
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "87010":
          alertsStore.addAlert({ type: "error", title: "Odeslání zprávy", message: "ID konverzace nebylo zadáno." });
          break;

        case "87020":
          alertsStore.addAlert({ type: "error", title: "Odeslání zprávy", message: "ID uživatele nebylo zadáno." });
          break;

        case "87030":
          alertsStore.addAlert({ type: "error", title: "Odeslání zprávy", message: "ID konverzace musí být číslo." });
          break;

        case "87040":
          alertsStore.addAlert({ type: "error", title: "Odeslání zprávy", message: "ID konverzace je neplatné." });
          break;

        case "87050":
          alertsStore.addAlert({ type: "error", title: "Odeslání zprávy", message: "ID uživatele musí být číslo." });
          break;

        case "87060":
          alertsStore.addAlert({ type: "error", title: "Odeslání zprávy", message: "ID uživatele je neplatné." });
          break;

        case "87070":
          alertsStore.addAlert({ type: "error", title: "Odeslání zprávy", message: "Zpráva nebyla zadána." });
          break;

        case "87080":
          alertsStore.addAlert({ type: "error", title: "Odeslání zprávy", message: "Zpráva je příliš dlouhá." });
          break;

        case "87090":
          alertsStore.addAlert({ type: "error", title: "Odeslání zprávy", message: "Konverzace nebyla nalezena." });
          break;

        case "87100":
          alertsStore.addAlert({ type: "error", title: "Odeslání zprávy", message: "Do této konverzace nelze psát (je archivovaná)." });
          break;

        case "87110":
          alertsStore.addAlert({ type: "error", title: "Odeslání zprávy", message: "Odpovídaná zpráva musí být číslo." });
          break;

        case "87120":
          alertsStore.addAlert({ type: "error", title: "Odeslání zprávy", message: "Odpovídaná zpráva je neplatná." });
          break;

        case "87130":
          alertsStore.addAlert({ type: "error", title: "Odeslání zprávy", message: "Zpráva, na kterou odpovídáte, neexistuje." });
          break;

        case "87141":
          const newMessage: any = response._data.data.newMessage;
          messages.value = [...messages.value, newMessage];
          textMessage.value = "";
          replyingToMessage.value = null;
          alertsStore.addAlert({ type: "success", title: "Odeslání zprávy", message: "Zpráva byla úspěšně odeslána." });
          break;

        default:
          alertsStore.addAlert({ type: "error", title: "Odeslání zprávy", message: "Nastala neznámá chyba." });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Odeslání zprávy", message: "Nastala neznámá chyba." });
    },
  }).finally((): void => {
    sendLoading.value = false;
  });
};

const loadNextPage = (): void => {
  if (allMessagesCount.value <= messagesCount.value || messagesPending.value) return;

  currentPage.value += 1;
};

const refreshMessagesAndReset = (): void => {
  isRefreshed.value = true;
  currentPage.value = 1;
  refreshMessages();
};

const { data: messagesData, error: messagesError, pending: messagesPending, refresh: refreshMessages } = useFetch("/api/message/get", {
  query: {
    idUser: conversationUserId,
    idConversation: conversationId,
    amountForPaging: props.pagesPerFetch,
    pageNumber: currentPage,
  },
  method: "get",
  server: true,
  credentials: "include",
  lazy: true,
});

watch([messagesData, messagesError], (): void => {
  if (messagesError.value) {
    messages.value = [];
    return;
  }

  if (!messagesData.value) return;

  if (isRefreshed.value) {
    textMessage.value = "";
    replyingToMessage.value = null;
    isRefreshed.value = false;
    messages.value = messagesData.value.data.messages;
    allMessagesCount.value = messagesData.value.data.count;
    return;
  }

  messages.value = [messagesData.value.data.messages, ...messages.value].flat();
  allMessagesCount.value = messagesData.value.data.count;
}, { immediate: true });

watch(conversation, (): void => {
  currentPage.value = 1;
  messages.value = [];
  textMessage.value = "";
  replyingToMessage.value = null;
  allMessagesCount.value = 0;
});
</script>

<template>
  <div class="chat" :class="{ archived: archived, isLoading: messagesPending }">
    <div class="loading" v-if="messagesPending">
      <Loading size="20px" color="rgba(var(--description-color), 1)" />
    </div>

    <button type="button" class="load-messages-btn" @click="loadNextPage" v-if="allMessagesCount > messagesCount">
      Načíst starší
    </button>

    <div class="messages" v-if="messages.length > 0">
      <div v-for="message in messages" :key="message.idMessage" :class="['message', { right: isCurrentUser(message.sender?.id) }]" :style="getMessageStyles(message.sender?.id)">
        <p class="reply" v-if="message.replyToMessage">
          <span>Odpověď na:</span> {{ message.replyToMessage.message.substring(0, 50) }}{{ message.replyToMessage.message.length > 50 ? "..." : "" }}
        </p>

        <p class="text" v-if="message.idMessage !== messageLoadingId">
          {{ message.message }}
        </p>

        <p class="text" v-else>
          <Loading color="var(--message-color)" size="5px" />
        </p>

        <div class="info">
          <span class="time">{{ moment(message.createdAt).format("HH:mm DD.MM. YYYY") }}</span>

          <div class="actions">
            <Icon class="icon" name="material-symbols:reply-rounded" @click="setReplyMessage(message)"></Icon>
            <Icon class="icon" name="material-symbols:delete-rounded" v-if="isCurrentUser(message.sender?.id)" @click="removeMessage(message)"></Icon>
          </div>
        </div>
      </div>
    </div>

    <div class="messages center" v-else>
      <p class="description">Zatím nebyly poslány žádné zprávy.</p>
    </div>

    <div class="bottom">
      <div class="reply" v-if="replyingToMessage">
        <p><span>Odpověď na:</span> {{ replyingToMessage.message.substring(0, 30) }}{{ replyingToMessage.message.length > 30 ? "..." : "" }}</p>
        <div class="icon">
          <Icon name="material-symbols:close-rounded" @click="setReplyMessage(null)"></Icon>
        </div>
      </div>

      <div class="input">
        <button type="button" @click="refreshMessagesAndReset"><Icon class="icon" name="material-symbols:refresh-rounded"></Icon></button>

        <Textarea class="textarea" placeholder="Napište zprávu..." v-model.trim="textMessage" />

        <div class="send-message">
          <button type="button" class="primary" @click="addMessage"><Icon class="icon" name="material-symbols:send-rounded"></Icon></button>

          <Loading size="5px" color="var(--btn-1-color)" v-show="sendLoading" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;

  &.isLoading {
    opacity: var(--disabled-opacity);
    pointer-events: none;
  }

  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }

  &.archived {
    .bottom {
      display: none;
    }

    .messages {
      opacity: var(--disabled-opacity);
      pointer-events: none;
    }
  }

  .load-messages-btn {
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

  .messages {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    position: relative;
    background: var(--card-1-background);
    border: var(--border-width) solid rgba(var(--border-color), 0.5);
    border-radius: var(--normal-border-radius);
    padding: 30px;
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &.center {
      align-items: center;
      justify-content: center;

      .description {
        color: rgba(var(--description-color), 1);
        font-size: 16px;
        text-align: center;
      }
    }

    .message {
      max-width: 90%;
      width: fit-content;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;

      .info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        gap: 20px;

        .time {
          font-size: 16px;
          color: rgba(var(--description-color), 1);
          text-wrap: nowrap;
        }

        .actions {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;
          opacity: 0;
          transition: 0.2s;

          .icon {
            color: rgba(var(--description-color), 1);
            font-size: 20px;
            cursor: pointer;
            transition: 0.2s;

            &:hover {
              color: var(--mini-title-color);
            }
          }
        }
      }

      &:hover {
        .actions {
          opacity: 1;
        }
      }

      &.right {
        align-self: flex-end;
        align-items: flex-end;

        .info {
          flex-direction: row-reverse;
        }
      }

      .reply {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 10px 15px;
        border-radius: var(--small-border-radius);
        background: var(--card-2-background);
        color: rgba(var(--description-color), 1);
        font-size: 16px;

        span {
          color: var(--title-color);
        }
      }

      .text {
        width: fit-content;
        padding: 15px 20px;
        border-radius: var(--small-border-radius);
        background: var(--message-bg);
        color: var(--message-color);
        white-space: pre-wrap;
        max-width: 100%;
        word-wrap: break-word;
      }
    }
  }

  .bottom {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    margin-top: auto;

    .reply {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px 15px;
      border-radius: var(--small-border-radius);
      background: var(--card-2-background);
      color: rgba(var(--description-color), 1);

      p {
        font-size: 16px;

        span {
          color: var(--title-color);
        }
      }

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(var(--description-color), 1);
        font-size: 20px;
        cursor: pointer;
        transition: 0.2s;

        &:hover {
          color: var(--mini-title-color);
        }
      }
    }

    .input {
      display: flex;
      flex-direction: row;
      gap: 15px;
      flex-wrap: wrap;

      .textarea {
        resize: none;
        flex: 1;
      }

      .send-message {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 10px;
      }

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        line-height: 0;
        height: fit-content;
        border-radius: var(--small-border-radius);
        transition: 0.2s;
        font-size: 25px;
        background: var(--btn-2-background);
        color: var(--btn-2-color);
        border: var(--border-width) solid rgba(var(--border-color), 0.5);
        cursor: pointer;

        &:hover {
          background: var(--btn-2-hover-background);
        }

        &.primary {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
          background: var(--btn-1-background);
          color: var(--btn-1-color);

          &:hover {
            background: var(--btn-1-hover-background);
          }
        }
      }
    }
  }
}
</style>
