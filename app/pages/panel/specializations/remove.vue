<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import {computed, nextTick, ref, useTemplateRef, watchEffect} from "vue";
import Loading from "~/components/ui/Loading.vue";
import { useAlertsStore } from "~/stores/alerts";
import type {SpecializationData} from "~/types/specialization";
import SearchInput from "~/components/ui/SearchInput.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import {useLoadingStore} from "~/stores/loading";
import {useFetch} from "nuxt/app";
import SpecializationsTable from "~/components/tables/Specializations.vue";
import Pagination from "~/components/ui/Pagination.vue";

useHead({
  title: "Panel | Zaměření - Odstranění",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin"],
});

const alertsStore = useAlertsStore();
const amountForPaging: number = 10;
const datatable = useTemplateRef<InstanceType<typeof SpecializationsTable>>("datatable");
const allSpecializations = ref<SpecializationData[] | undefined>(undefined);
const selectedSpecializationIds = ref<number[]>([]);
const loading = ref<boolean>(false);
const searchInput = ref<string>("");
const specializationsCount = ref<number>(0);
const currentPage = ref<number>(1);
const numberOfPages = computed<number>((): number => {
  return Math.ceil(specializationsCount.value / amountForPaging);
});

const resetSelectedSpecializations = (): void => {
  if (!datatable.value) return;

  selectedSpecializationIds.value = [];
  datatable.value.clearSelection();
};

const onRowClicked = (specializations: SpecializationData): void => {
  if (!datatable.value) return;

  if (!selectedSpecializationIds.value.includes(specializations.id)) {
    selectedSpecializationIds.value.push(specializations.id);
  } else {
    selectedSpecializationIds.value = selectedSpecializationIds.value.filter((id: number) => id !== specializations.id);
  }
};

const removeSpecializations = async (): Promise<void> => {
  loading.value = true;

  await $fetch("/api/specialization/delete", {
    method: "delete",
    body: {
      idSpecialization: selectedSpecializationIds.value,
    },
    ignoreResponseError: true,
    credentials: "include",
    onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "5010":
          alertsStore.addAlert({ type: "error", title: "Odstranění zaměření", message: "Nemáte oprávnění k této akci." });
          break;
        case "5020":
          alertsStore.addAlert({ type: "error", title: "Odstranění zaměření", message: "Chybí ID zaměření." });
          break;
        case "5030":
          alertsStore.addAlert({ type: "warning", title: "Odstranění zaměření", message: "Neproběhlo žádné odstranění." });
          break;
        case "5041":
          if ((response._data.data.classIds || []).length >= 1) {
            alertsStore.addAlert({type: "warning", title: "Odstranění zaměření", message: `Některé zaměření nebyly odstraněny. Tyto zaměření používají některé třídy: ${response._data.data.classIds.join(", ")}`});
          } else {
            alertsStore.addAlert({ type: "success", title: "Odstranění zaměření", message: `Zaměření byly úspěšně odstraněny. (${response._data.data.goodIds.length})`});
          }

          allSpecializations.value = allSpecializations.value?.filter((specialization: SpecializationData) => !response._data.data.goodIds.includes(specialization.id));

          resetSelectedSpecializations();
          break;
        default:
          alertsStore.addAlert({ type: "error", title: "Odstranění zaměření", message: "Nastala neznámá chyba." });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Odstranění zaměření", message: "Nastala neznámá chyba." });
    },
  }).finally((): void => {
    loading.value = false;
  });
};

const updateActivePage = (pageNumber: number): void => {
  currentPage.value = pageNumber + 1;
};

const onSearchInputChange = (input: string): void => {
  currentPage.value = 1;

  searchInput.value = input;
};

const { data: specializationData, pending: specializationTablePending, error: specializationError } = await useFetch("/api/specialization/get", {
  query: {
    amountForPaging: amountForPaging,
    pageNumber: currentPage,
    searchQuery: searchInput,
  },
  method: "get",
  server: true,
  credentials: "include",
});

watchEffect((): void => {
  if ((specializationError.value?.data.resCode || "").toString() === "23070") {
    allSpecializations.value = [];
    specializationsCount.value = 0;
    return;
  }

  if (!specializationData.value) return;

  allSpecializations.value = specializationData.value.data.specializations;
  specializationsCount.value = specializationData.value.data.count;
});

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", specializationData.value === undefined);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Zaměření', to: '/panel/specializations', icon: 'material-symbols:school' },
            { label: 'Odstranění', to: '/panel/specializations/remove', active: true }
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content v-if="allSpecializations">
      <div id="specializations">
        <div class="content">
          <ActionBar
            class="action-bar"
            description="Správa zaměření"
            :texts="['Přidat', 'Odebrat']"
            :actions="['add', 'remove']"
            :icons="[
              'material-symbols:add-rounded',
              'material-symbols:delete-rounded',
            ]"
            :active="1"
            :navigate-to="[
              `/panel/specializations/add`,
              `/panel/specializations/remove`,
            ]"
          />

          <div class="line">
            <div class="section-head">
              <h3>Vybraná zaměření: {{ selectedSpecializationIds.length }}</h3>
              <p>Vyberte zaměření, která chcete odstranit ze systému. Po potvrzení budou vybraná zaměření trvale smazána.</p>
            </div>

            <SearchInput @change="onSearchInputChange" placeholder="Hledat zaměření" />
          </div>

          <div class="buttons">
            <button class="remove" @click="removeSpecializations">
              Odstranit
              <Loading
                v-show="loading"
                size="5px"
                color="var(--actionBar-actions-remove-color)"
              />
            </button>
            <button class="reset" @click="resetSelectedSpecializations">
              Zrušit vše
            </button>
          </div>

          <SpecializationsTable :selected-ids="selectedSpecializationIds" :loading="specializationTablePending" ref="datatable" :specializations="allSpecializations" :has-checkbox="true" @row-clicked="onRowClicked" />

          <Pagination :number-of-pages="numberOfPages" @get:active-page="updateActivePage" />
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
#specializations {
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

    .error {
      color: rgba(var(--error-color), 1);
      font-size: 16px;
    }

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
      flex-wrap: wrap;

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
  #specializations {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
