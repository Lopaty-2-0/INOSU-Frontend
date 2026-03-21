<script setup lang="ts">
import {computed, ref, watchEffect} from "vue";
import Navbar from "~/components/layout/Navbar.vue";
import {useLoadingStore} from "~/stores/loading";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import Pagination from "~/components/ui/Pagination.vue";
import type {MaturitaData} from "~/types/maturita";
import moment from "moment/moment";
import type {MaturitaTableData} from "~/types/maturitaTables";
import MaturitaTable from "~/components/tables/MaturitaTable.vue";
import Navigation from "~/components/ui/Navigation.vue";

const { t } = useI18n();

useHead({
  title: t('pages.maturita.tablesIndex.title'),
  meta: [{ name: "description", content: t('pages.maturita.tablesIndex.description') }],
});

const route = useRoute();
const role = route.params.role as string;

const maturitaNotExists = ref<boolean | undefined>(undefined);
const currentMaturita = ref<MaturitaData | undefined>(undefined);
const allRows = ref<MaturitaTableData[] | undefined>(undefined);
const currentPage = ref<number>(1);
const amountForPaging: number = 10;
const rowsCount = ref<number>(0);
const numberOfPages = computed<number>((): number => {
  return Math.ceil(rowsCount.value / amountForPaging);
});

const { data: tableData, error: tableError, pending: tablePending } = useFetch("/api/maturita_task/get/table", {
  query: {
    amountForPaging: amountForPaging,
    pageNumber: currentPage,
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
});

const { data: maturitaData, error: maturitaError } = useFetch("/api/maturita/get/current", {
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
});

watch([tableData, tableError], (): void => {
  if (tableError.value) {
    allRows.value = [];
    rowsCount.value = 0;
    return;
  }

  if (!tableData.value) return;

  allRows.value = tableData.value.data.tasks;
  rowsCount.value = tableData.value.data.count;
}, { immediate: true });

watch([maturitaData, maturitaError], (): void => {
  if (maturitaError.value) {
    currentMaturita.value = undefined;
    maturitaNotExists.value = true;
    return;
  }

  if (!maturitaData.value) return;

  currentMaturita.value = maturitaData.value.data.maturita;
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !allRows.value && !tableData.value || !currentMaturita.value && !maturitaError.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: t('sidebar.links.maturitas'), to: `/panel/maturita/${role}/tables`, icon: 'material-symbols:table-rows-rounded' },
            { label: t('sidebar.links.tables'), to: `/panel/maturita/${role}/tables` },
            { label: t('maturita.tables.index.heading'), to: `/panel/maturita/${role}/tables`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="maturita-table" v-if="maturitaNotExists !== undefined && (maturitaNotExists)">
        <div class="content">
          <div class="page-section">
            <div class="section-head">
              <h3>{{ t('maturita.tables.index.heading') }}</h3>
              <p>{{ t('maturita.tables.index.description') }}</p>
            </div>

            <p class="error message">{{ t('maturita.tables.index.noMaturita') }}</p>
          </div>
        </div>
      </div>

      <div id="maturita-table" v-else-if="allRows && currentMaturita">
        <Navigation class="navigation" :title="t('sidebar.links.tables')" :active-link-id="0" :links="[
          { name: t('maturita.tables.index.heading'), path: `/panel/maturita/${role}/tables` },
          { name: t('maturita.tables.evaluators.heading'), path: `/panel/maturita/${role}/tables/evaluators` },
        ]" />

        <div class="content">
          <div class="section-head bottom-line">
            <h3>{{ t('maturita.tables.index.heading') }}</h3>
            <p>{{ t('maturita.tables.index.description') }}</p>
            <br>
            <p>{{ t('maturita.grade.add.startLabel').replace(' *', '') }}: {{ currentMaturita.grade }}</p>
            <p>{{ t('maturita.team.endLabel') }} {{ moment(currentMaturita.endDate).format("HH:mm DD.MM. YYYY") }}</p>
          </div>

          <MaturitaTable :role="role" class="datatable" :data-rows="allRows" :loading="tablePending" />

          <Pagination v-model="currentPage" :number-of-pages="numberOfPages" />
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
#maturita-table {
  display: flex;
  flex-direction: row;
  gap: 30px;
  position: relative;

  .message {
    font-size: 16px;
    color: rgba(var(--description-color), 1);

    &.error {
      color: rgba(var(--error-color), 1);
    }
  }

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
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;

      &:hover {
        background: var(--btn-2-hover-background);
      }

      &.rejected {
        color: var(--actionBar-actions-remove-color);
        background: rgba(var(--actionBar-actions-remove-background), 1);
        border-color: rgba(var(--actionBar-actions-remove-border), 1);

        &:hover {
          background: rgba(var(--actionBar-actions-remove-background), 0.8);
        }
      }

      &.approved {
        color: var(--actionBar-actions-add-color);
        background: rgba(var(--actionBar-actions-add-background), 1);
        border-color: rgba(var(--actionBar-actions-add-border), 1);

        &:hover {
          background: rgba(var(--actionBar-actions-add-background), 0.8);
        }
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

  .navigation {
    height: fit-content;
    position: sticky;
    top: 110px;
    min-width: 300px;
    padding: 30px;
  }

  .content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 35px;
    position: relative;
    overflow-x: auto;

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

    .error {
      color: rgba(var(--error-color), 1);
      font-size: 16px;
    }

    .page-section {
      display: flex;
      flex-direction: column;
      gap: 20px;

      &.bottom-line {
        padding-bottom: 35px;
        border-bottom: 1px solid rgba(var(--border-color), 0.5);
      }
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
  #maturita-table {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
