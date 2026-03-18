<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import "@bhplugin/vue3-datatable/dist/style.css";
import ActionBar from "~/components/ui/ActionBar.vue";
import type {ClassData} from "~/types/classes";
import {computed, ref, useTemplateRef, watchEffect} from "vue";
import Loading from "~/components/ui/Loading.vue";
import { useAlertsStore } from "~/stores/alerts";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import {useFetch} from "nuxt/app";
import {useLoadingStore} from "~/stores/loading";
import ClassesTable from "~/components/tables/Classes.vue";
import SearchInput from "~/components/ui/SearchInput.vue";
import Pagination from "~/components/ui/Pagination.vue";

useHead({
  title: "Panel | Třídy - Odstranění",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin"],
});

const alertsStore = useAlertsStore();
const amountForPaging: number = 10;
const datatable = useTemplateRef<InstanceType<typeof ClassesTable>>("datatable");
const allClasses = ref<ClassData[] | undefined>(undefined);
const selectedClasses = ref<number[]>([]);
const loading = ref<boolean>(false);
const searchInput = ref<string>("");
const currentPage = ref<number>(1);
const classesCount = ref<number>(0);
const numberOfPages = computed<number>((): number => {
  return Math.ceil(classesCount.value / amountForPaging);
});

const onRowClicked = (classes: ClassData): void => {
  if (!datatable.value) return;

  if (!selectedClasses.value.includes(classes.id)) {
    selectedClasses.value.push(classes.id);
  } else {
    selectedClasses.value = selectedClasses.value.filter((id: number) => id !== classes.id);
  }
};

const resetSelectedClasses = (): void => {
  if (!datatable.value) return;

  selectedClasses.value = [];
  datatable.value.clearSelection();
};

const onSearchInputChange = (input: string): void => {
  currentPage.value = 1;

  searchInput.value = input;
};

const removeClasses = async (): Promise<void> => {
  loading.value = true;

  await $fetch("/api/class/delete", {
    method: "delete",
    body: {
      id: selectedClasses.value,
    },
    ignoreResponseError: true,
    credentials: "include",

    onResponse({ response }: any) {
      const resCode = response?._data?.resCode?.toString();
      const data = response?._data?.data;

      switch (resCode) {
        case "9010":
          alertsStore.addAlert({ type: "error", title: "Odstranění tříd", message: "Nemáte oprávnění k této akci." });
          break;

        case "9020":
          alertsStore.addAlert({ type: "warning", title: "Odstranění tříd", message: "Žádná třída nebyla vybrána." });
          break;

        case "9031":
          if ((data?.badIds || []).length > 0) {
            alertsStore.addAlert({ type: "warning", title: "Odstranění tříd", message: `Některé třídy nebyly odstraněny. Neplatná ID: ${data.badIds.join(", ")}.` });
          } else {
            alertsStore.addAlert({ type: "success", title: "Odstranění tříd", message: `Třídy byly úspěšně odstraněny.` });
          }

          classesRefresh();
          resetSelectedClasses();
          break;

        default:
          alertsStore.addAlert({ type: "error", title: "Odstranění tříd", message: "Nastala neznámá chyba." });
      }
    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Odstranění tříd", message: "Nastala neznámá chyba." });
    },
  }).finally(() => {
    loading.value = false;
  });
};

const { data: classesData, pending: classesTablePending, error: classesError, refresh: classesRefresh } = useFetch("/api/class/get", {
  query: {
    amountForPaging: amountForPaging,
    pageNumber: currentPage,
    searchQuery: searchInput,
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
});

watch([classesData, classesError], (): void => {
  if (classesError.value) {
    allClasses.value = [];
    classesCount.value = 0;
    return;
  }

  if (!classesData.value) return;

  allClasses.value = classesData.value.data.classes;
  classesCount.value = classesData.value.data.count;
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", allClasses.value === undefined);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Třídy', to: '/panel/classes', icon: 'material-symbols:flight-class-rounded' },
            { label: 'Odstranění', to: '/panel/classes/remove', active: true }
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="classes" v-if="allClasses">
        <div class="content">
          <ActionBar
            class="action-bar"
            description="Správa tříd"
            :texts="['Přidat', 'Odebrat']"
            :actions="['add', 'remove']"
            :icons="[
              'material-symbols:add-rounded',
              'material-symbols:delete-rounded',
            ]"
            :active="1"
            :navigate-to="[
              `/panel/classes/add`,
              `/panel/classes/remove`,
            ]"
          />

          <div class="line">
            <div class="section-head">
              <h3>Vybrané třídy: {{ selectedClasses.length }}</h3>
              <p>Vyberte třídy, které chcete trvale odstranit ze systému.</p>
            </div>

            <SearchInput @change="onSearchInputChange" placeholder="Hledat třídy" />
          </div>

          <div class="buttons">
            <button class="remove" @click="removeClasses">
              Odstranit
              <Loading
                v-show="loading"
                size="5px"
                color="var(--actionBar-actions-remove-color)"
              />
            </button>
            <button class="reset" @click="resetSelectedClasses">
              Zrušit vše
            </button>
          </div>

          <ClassesTable :selected-ids="selectedClasses" :loading="classesTablePending" ref="datatable" :classes="allClasses" :has-checkbox="true" @row-clicked="onRowClicked" />

          <Pagination :number-of-pages="numberOfPages" v-model="currentPage" />
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
#classes {
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
  #classes {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
