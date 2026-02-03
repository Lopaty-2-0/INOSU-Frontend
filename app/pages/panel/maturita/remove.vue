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
import type {MaturitaData} from "~/types/maturita";
import MaturitasTable from "~/components/tables/Maturitas.vue";
import type {ClassData} from "~/types/classes";
import Loading from "~/components/ui/Loading.vue";
import { useAlertsStore } from "~/stores/alerts";

useHead({
  title: "Panel | Maturitní ročníky",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin", "techer"],
});

const alertsStore = useAlertsStore();
const allMaturitas = ref<MaturitaData[] | undefined>(undefined);
const searchInput = ref<string>("");
const currentPage = ref<number>(1);
const amountForPaging: number = 10;
const maturitasCount = ref<number>(0);
const selectedMaturitas = ref<number[]>([]);
const datatable = useTemplateRef<InstanceType<typeof MaturitasTable>>("datatable");
const loading = ref<boolean>(false);
const numberOfPages = computed<number>((): number => {
  return Math.ceil(maturitasCount.value / amountForPaging);
});

const onSearchInputChange = (input: string): void => {
  currentPage.value = 1;

  searchInput.value = input;
};

const onRowClicked = (classes: ClassData): void => {
  if (!datatable.value) return;

  if (!selectedMaturitas.value.includes(classes.id)) {
    selectedMaturitas.value.push(classes.id);
  } else {
    selectedMaturitas.value = selectedMaturitas.value.filter((id: number) => id !== classes.id);
  }
};

const resetSelectedMaturitas = (): void => {
  if (!datatable.value) return;

  selectedMaturitas.value = [];
  datatable.value.clearSelection();
};

const removeMaturitas = async (): Promise<void> => {
  loading.value = true;

  await $fetch("/api/maturita/delete", {
    method: "delete",
    body: {
      id: selectedMaturitas.value,
    },
    ignoreResponseError: true,
    credentials: "include",

    onResponse({ response }: any) {
      const resCode = response?._data?.resCode?.toString();

      switch (resCode) {
        case "71010":
          alertsStore.addAlert({ type: "error", title: "Odstranění maturit", message: "Nemáte oprávnění k této akci." });
          break;

        case "71020":
          alertsStore.addAlert({ type: "error", title: "Odstranění maturit", message: "Nebyla vybrána maturita." });
          break;

        case "71030":
          alertsStore.addAlert({ type: "error", title: "Odstranění maturit", message: "ID maturity není číslo." });
          break;

        case "71040":
          alertsStore.addAlert({ type: "error", title: "Odstranění maturit", message: "ID maturity není platné." });
          break;

        case "71050":
          alertsStore.addAlert({ type: "error", title: "Odstranění maturit", message: "Maturita neexistuje." });
          break;

        case "71061":
          alertsStore.addAlert({ type: "success", title: "Odstranění maturit", message: "Maturita byla úspěšně odstraněna." });
          refreshMaturitas();
          resetSelectedMaturitas();
          break;

        default:
          alertsStore.addAlert({ type: "error", title: "Odstranění maturit", message: "Nastala neznámá chyba." });
          break;
      }
    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Odstranění maturity", message: "Nastala neznámá chyba." })
    },
  }).finally(() => {
    loading.value = false;
  });
};

const { data: maturitaData, pending: maturitaTablePending, error: maturitaError, refresh: refreshMaturitas } = useFetch("/api/maturita/get", {
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

watch([maturitaData, maturitaError], (): void => {
  if (maturitaError.value) {
    allMaturitas.value = [];
    maturitasCount.value = 0;
    return;
  }

  if (!maturitaData.value) return;

  allMaturitas.value = maturitaData.value.data.maturita;
  maturitasCount.value = maturitaData.value.data.count;
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", maturitaData.value === undefined);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Maturity', to: '/panel/maturita', icon: 'material-symbols:architecture-rounded' },
            { label: 'Odstranění', to: '/panel/maturita/remove', active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content v-if="allMaturitas">
      <div id="maturitas">
        <div class="content">
          <ActionBar
              class="action-bar"
              description="Správa maturitních ročníků"
              :texts="['Přidat', 'Odebrat']"
              :actions="['add', 'remove']"
              :active="1"
              :icons="[
              'material-symbols:add-rounded',
              'material-symbols:delete-rounded',
            ]"
              :navigate-to="[
              `/panel/maturita/add`,
              `/panel/maturita/remove`,
            ]"
              v-if="checkPermissions(['admin'])"
          />

          <div class="line">
            <div class="section-head">
              <h3>Vybrané ročníky: {{ selectedMaturitas.length }}</h3>
              <p>Zde najdete seznam všech zaměření (oborů) na škole dostupných v systému.</p>
            </div>

            <SearchInput @change="onSearchInputChange" placeholder="Hledat maturity" />
          </div>

          <div class="buttons">
            <button class="remove" @click="removeMaturitas">
              Odstranit
              <Loading
                  v-show="loading"
                  size="5px"
                  color="var(--actionBar-actions-remove-color)"
              />
            </button>
            <button class="reset" @click="resetSelectedMaturitas">
              Zrušit vše
            </button>
          </div>

          <MaturitasTable :selected-ids="selectedMaturitas" ref="datatable" :loading="maturitaTablePending" :maturitas="allMaturitas" has-checkbox @row-clicked="onRowClicked" />

          <Pagination :number-of-pages="numberOfPages" v-model="currentPage" />
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
#maturitas {
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
  #maturitas {
    flex-direction: column;
    gap: 30px;
  }
}
</style>