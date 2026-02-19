<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import {computed, ref, watchEffect} from "vue";
import checkPermissions from "~/componsables/checkPermissions";
import SearchInput from "~/components/ui/SearchInput.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import {useFetch} from "nuxt/app";
import { useLoadingStore } from "~/stores/loading";
import Pagination from "~/components/ui/Pagination.vue";
import TopicsTable from "~/components/tables/Topics.vue";
import type {TopicData} from "~/types/maturita";

useHead({
  title: "Panel | Témata maturitních prací",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

const route = useRoute();
const role = route.params.role as string;

const allTopics = ref<TopicData[] | undefined>(undefined);
const searchInput = ref<string>("");
const currentPage = ref<number>(1);
const amountForPaging: number = 10;
const topicsCount = ref<number>(0);
const numberOfPages = computed<number>((): number => {
  return Math.ceil(topicsCount.value / amountForPaging);
});

const onSearchInputChange = (input: string): void => {
  currentPage.value = 1;

  searchInput.value = input;
};

const { data: topicData, pending: topicTablePending, error: topicError } = useFetch("/api/topic/get", {
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
            { label: 'Témata', to: `/panel/maturita/${role}/topics`, active: true },
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
            :icons="[
              'material-symbols:add-rounded',
              'material-symbols:delete-rounded',
            ]"
            :navigate-to="[
              `/panel/maturita/${role}/topics/add`,
              `/panel/maturita/${role}/topics/remove`,
            ]"
            v-if="checkPermissions(['admin', 'teacher'])"
          />

          <div class="line">
            <div class="section-head">
              <h3>Všechny maturitní témata</h3>
              <p>Zde najdete seznam všech zaměření (oborů) na škole dostupných v systému.</p>
            </div>

            <SearchInput @change="onSearchInputChange" placeholder="Hledat témata" />
          </div>

          <TopicsTable :loading="topicTablePending" :topics="allTopics" />

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
