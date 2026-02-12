<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import {computed, ref, useTemplateRef, watchEffect} from "vue";
import checkPermissions from "~/componsables/checkPermissions";
import SearchInput from "~/components/ui/SearchInput.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import {useFetch} from "nuxt/app";
import { useLoadingStore } from "~/stores/loading";
import Pagination from "~/components/ui/Pagination.vue";
import type {TopicData} from "~/types/maturita";
import Loading from "~/components/ui/Loading.vue";
import TopicsTable from "~/components/tables/Topics.vue";
import { useAlertsStore } from "~/stores/alerts";

useHead({
  title: "Panel | Témata maturitních prací - Odstranění",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin", "techer"],
});

const route = useRoute();
const role = route.params.role as string;

const alertsStore = useAlertsStore();
const allTopics = ref<TopicData[] | undefined>(undefined);
const searchInput = ref<string>("");
const currentPage = ref<number>(1);
const amountForPaging: number = 10;
const topicsCount = ref<number>(0);
const selectedTopics = ref<number[]>([]);
const datatable = useTemplateRef<InstanceType<typeof TopicsTable>>("datatable");
const loading = ref<boolean>(false);
const numberOfPages = computed<number>((): number => {
  return Math.ceil(topicsCount.value / amountForPaging);
});

const onSearchInputChange = (input: string): void => {
  currentPage.value = 1;

  searchInput.value = input;
};

const onRowClicked = (topic: TopicData): void => {
  if (!datatable.value) return;

  if (!selectedTopics.value.includes(topic.id)) {
    selectedTopics.value.push(topic.id);
  } else {
    selectedTopics.value = selectedTopics.value.filter((id: number) => id !== topic.id);
  }
};

const resetSelectedTopics = (): void => {
  if (!datatable.value) return;

  selectedTopics.value = [];
  datatable.value.clearSelection();
};

const removeTopics = async (): Promise<void> => {
  loading.value = true;

  await $fetch("/api/topic/delete", {
    method: "delete",
    body: {
      id: selectedTopics.value,
    },
    ignoreResponseError: true,
    credentials: "include",

    onResponse({ response }: any) {
      const resCode = response?._data?.resCode?.toString();

      switch (resCode) {
        case "64010":
          alertsStore.addAlert({ type: "error", title: "Odstranění témat", message: "Nemáte oprávnění k této akci." });
          break;

        case "64020":
          alertsStore.addAlert({ type: "error", title: "Odstranění témat", message: "Nebyla vybrána žádná témata." });
          break;

        case "64030":
          alertsStore.addAlert({ type: "error", title: "Odstranění témat", message: "Žádné téma nebylo odstraněno." });
          break;

        case "64041":
          alertsStore.addAlert({ type: "success", title: "Odstranění témat", message: "Témata byla úspěšně odstraněna." });
          refreshTopic();
          resetSelectedTopics();
          break;

        default:
          alertsStore.addAlert({ type: "error", title: "Odstranění témat", message: "Nastala neznámá chyba." });
          break;
      }
    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Odstranění témat", message: "Nastala chyba při komunikaci se serverem." });
    },
  }).finally(() => {
    loading.value = false;
  });
};

const { data: topicData, pending: topicTablePending, error: topicError, refresh: refreshTopic } = useFetch("/api/topic/get", {
  query: {
    amountForPaging: amountForPaging,
    pageNumber: currentPage,
    searchQuery: searchInput,
  },
  method: "get",
  server: true,
  credentials: "include",
  lazy: true
});

watch([topicData, topicError], (): void => {
  if (topicError.value) {
    allTopics.value = [];
    topicsCount.value = 0;
    return;
  }

  if (!topicData.value) return;

  allTopics.value = topicData.value.data.topics;
  topicsCount.value = topicData.value.data.count;
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !allTopics.value && !topicError.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Maturity', to: `/panel/maturita/${role}/topics`, icon: 'material-symbols:topic' },
            { label: 'Témata', to: `/panel/maturita/${role}/topics` },
            { label: 'Odstranění', to: `/panel/maturita/${role}/topics/remove`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="topics" v-if="allTopics">
        <div class="content">
          <ActionBar
              class="action-bar"
              description="Správa maturitních témat"
              :texts="['Přidat', 'Odebrat']"
              :actions="['add', 'remove']"
              :active="1"
              :icons="[
              'material-symbols:add-rounded',
              'material-symbols:delete-rounded',
            ]"
              :navigate-to="[
              `/panel/maturita/${role}/topics/add`,
              `/panel/maturita/${role}/topics/remove`,
            ]"
          />

          <div class="line">
            <div class="section-head">
              <h3>Vybraná maturitní témata: {{ selectedTopics.length }}</h3>
              <p>Zde najdete seznam všech zaměření (oborů) na škole dostupných v systému.</p>
            </div>

            <SearchInput @change="onSearchInputChange" placeholder="Hledat témata" />
          </div>

          <div class="buttons">
            <button class="remove" @click="removeTopics">
              Odstranit
              <Loading
                  v-show="loading"
                  size="5px"
                  color="var(--actionBar-actions-remove-color)"
              />
            </button>
            <button class="reset" @click="resetSelectedTopics">
              Zrušit vše
            </button>
          </div>

          <TopicsTable :selected-ids="selectedTopics" ref="datatable" :loading="topicTablePending" :topics="allTopics" has-checkbox @row-clicked="onRowClicked" />

          <Pagination :number-of-pages="numberOfPages" v-model="currentPage" />
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
#topics {
  display: flex;
  flex-direction: row;
  gap: 30px;
  position: relative;

  .actions {
    display: flex;
    flex-direction: row;
    gap: 10px;

    button {
      padding: 10px 15px;
      border-radius: var(--small-border-radius);
      transition: 0.2s;
      font-size: 16px;
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

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 35px;
    position: relative;

    .line {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 30px;
      width: 100%;
    }

    .buttons {
      display: flex;
      gap: 10px;

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 5px;
        padding: 10px 15px;
        border-radius: var(--small-border-radius);
        border: var(--border-width) solid transparent;
        transition: 0.2s;
        font-size: 16px;
        cursor: pointer;

        &.remove {
          color: var(--actionBar-actions-remove-color);
          background: rgba(var(--actionBar-actions-remove-background), 1);
          border-color: rgba(var(--actionBar-actions-remove-border), 1);

          &:hover {
            background: rgba(var(--actionBar-actions-remove-background), 0.8);
          }
        }

        &.reset {
          background: var(--btn-2-background);
          color: var(--btn-2-color);
          border-color: rgba(var(--border-color), 0.5);

          &:hover {
            background: var(--btn-2-hover-background);
          }
        }

        .icon {
          font-size: 16px;
        }
      }
    }

    .error {
      color: rgba(var(--error-color), 1);
      font-size: 16px;
    }

    .page-section {
      border-bottom: 1px solid rgba(var(--border-color), 0.5);
      padding-bottom: 35px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .section-head {
      display: flex;
      flex-direction: column;
      gap: 10px;

      h3 {
        font-weight: 600;
        font-size: 20px;
        color: var(--title-color);
      }

      p {
        color: rgba(var(--description-color), 1);
        font-size: 16px;
      }

      .update {
        color: rgba(var(--error-color), 1);
      }
    }
  }
}

@media (max-width: 1055px) {
  #topics {
    flex-direction: column;
    gap: 30px;
  }
}
</style>