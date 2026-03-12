<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import {computed, ref, useTemplateRef, watchEffect} from "vue";
import {useAccountStore} from "~/stores/account";
import { storeToRefs } from "pinia";
import { useAlertsStore } from "~/stores/alerts";
import type { TaskData } from "~/types/tasks";
import SearchInput from "~/components/ui/SearchInput.vue";
import {useFetch} from "nuxt/app";
import {useLoadingStore} from "~/stores/loading";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import TasksTable from "~/components/tables/Tasks.vue";
import Loading from "~/components/ui/Loading.vue";
import Pagination from "~/components/ui/Pagination.vue";

useHead({
  title: "Panel | Úkoly - Odstranění",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const route = useRoute();
const role = route.params.role as string;

const alertsStore = useAlertsStore();
const datatable = useTemplateRef<InstanceType<typeof TasksTable>>("datatable");
const allTasks = ref<TaskData[] | undefined>(undefined);
const searchInput = ref<string>("");
const currentPage = ref<number>(1);
const amountForPaging: number = 10;
const tasksCount = ref<number>(0);
const loading = ref<boolean>(false);
const selectedTaskIds = ref<number[]>([]);
const numberOfPages = computed<number>((): number => {
  return Math.ceil(tasksCount.value / amountForPaging);
});

const onSearchInputChange = (input: string): void => {
  currentPage.value = 1;

  searchInput.value = input;
};

const resetSelectedTasks = (): void => {
  if (!datatable.value) return;

  selectedTaskIds.value = [];
  datatable.value.clearSelection();
};

const onRowClicked = (tasks: TaskData): void => {
  if (!datatable.value) return;

  if (!selectedTaskIds.value.includes(tasks.id)) {
    selectedTaskIds.value.push(tasks.id);
  } else {
    selectedTaskIds.value = selectedTaskIds.value.filter((id: number) => id !== tasks.id);
  }
};

const removeTasks = async (): Promise<void> => {
  loading.value = true;

  await $fetch("/api/task/delete", {
    method: "delete",
    body: {
      id: selectedTaskIds.value
    },
    ignoreResponseError: true,
    credentials: "include",

    onResponse({ response }: any) {
      const resCode: string = response._data.resCode?.toString();
      const badIds: any[] = response._data.data?.badIds || [];

      switch (resCode) {
        case "28010":
          alertsStore.addAlert({ type: "error", title: "Odstranění úkolů", message: "Studenti nemohou mazat úkoly." });
          break;

        case "28020":
          alertsStore.addAlert({ type: "error", title: "Odstranění úkolů", message: "Chybí ID úkolu." });
          break;

        case "28031":
          if (badIds.length > 0) {
            alertsStore.addAlert({ type: "warning", title: "Odstranění úkolů", message: `Některé úkoly se nepodařilo odstranit.` });
          }
          alertsStore.addAlert({ type: "success", title: "Odstranění úkolů", message: `Úkoly byly úspěšně odstraněny.` });

          tasksRefresh();
          resetSelectedTasks();
          break;

        default:
          alertsStore.addAlert({ type: "error", title: "Odstranění úkolů", message: "Nastala neznámá chyba." });
          break;
      }
    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Odstranění úkolů", message: "Nastala neznámá chyba." });
    },
  }).finally(() => {
    loading.value = false;
  });
};

const { data: tasksData, error: tasksError, pending: tasksPending, refresh: tasksRefresh } = useFetch("/api/task/get/task", {
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

watch([tasksData, tasksError], (): void => {
  if (tasksError.value) {
    allTasks.value = [];
    tasksCount.value = 0;
    return;
  }

  if (!tasksData.value) return;

  allTasks.value = tasksData.value.data.tasks;
  tasksCount.value = tasksData.value.data.count;
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !allTasks.value && !tasksError.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Úkoly', to: `/panel/tasks/${role}`, active: false, icon: 'material-symbols:folder-copy-rounded' },
            { label: 'Odstranění', to: `/panel/tasks/${role}/remove`, active: true }
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="tasks" v-if="allTasks">
        <div class="content">
          <ActionBar
            class="action-bar"
            description="Správa úkolů"
            :texts="['Přidat', 'Odebrat']"
            :actions="['add', 'remove']"
            :icons="[
              'material-symbols:add-rounded',
              'material-symbols:delete-rounded',
            ]"
              :active="1"
              :navigate-to="[
              `/panel/tasks/${role}/add`,
              `/panel/tasks/${role}/remove`,
            ]"
          />

          <div class="line">
            <div class="section-head">
              <h3>Vybrané úkoly: {{ selectedTaskIds.length }}</h3>
              <p>Zde můžete odstranit úkoly, které jste vytvořili. Vyberte úkol ze seznamu a klikněte na tlačítko Odebrat.</p>
            </div>

            <SearchInput @change="onSearchInputChange" placeholder="Hledat úkol" />
          </div>


          <div class="buttons">
            <button class="remove" @click="removeTasks">
              Odstranit
              <Loading v-show="loading" size="5px" color="var(--actionBar-actions-remove-color)"/>
            </button>
            <button class="reset" @click="resetSelectedTasks">
              Zrušit vše
            </button>
          </div>

          <TasksTable ref="datatable" :selected-ids="selectedTaskIds" :tasks="allTasks" :loading="tasksPending" :has-checkbox="true"  @row-clicked="onRowClicked" />

          <Pagination :number-of-pages="numberOfPages" v-model="currentPage" />
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
#tasks {
  display: flex;
  flex-direction: row;
  gap: 30px;
  position: relative;


  .link {
    color: rgba(var(--main-color), 1);
    text-decoration: none;
    transition: 0.2s;

    &:hover {
      color: rgba(var(--main-color), 0.8);
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
      cursor: pointer;

      &.remove {
        color: var(--actionBar-actions-remove-color);
        background: rgba(var(--actionBar-actions-remove-background), 1);
        border-color: rgba(var(--actionBar-actions-remove-border), 1);

        &:hover {
          background: rgba(var(--actionBar-actions-remove-background), 0.8);
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
  #tasks {
    flex-direction: column;
    gap: 30px;
  }
}
</style>