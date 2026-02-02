<script setup lang="ts">
import {computed, ref, watchEffect} from "vue";
import { storeToRefs } from "pinia";
import Navbar from "~/components/layout/Navbar.vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import SearchInput from "~/components/ui/SearchInput.vue";
import type { TaskData } from "~/types/tasks";
import { useAccountStore } from "~/stores/account";
import {useLoadingStore} from "~/stores/loading";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import TasksTable from "~/components/tables/Tasks.vue";
import Pagination from "~/components/ui/Pagination.vue";

useHead({
  title: "Panel | Úkoly",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const route = useRoute();
const role = route.params.role as string;

const accountStore = useAccountStore();
const { getId: userId } = storeToRefs(accountStore);
const allTasks = ref<TaskData[] | undefined>(undefined);
const searchInput = ref<string>("");
const currentPage = ref<number>(1);
const amountForPaging: number = 10;
const tasksCount = ref<number>(0);
const numberOfPages = computed<number>((): number => {
  return Math.ceil(tasksCount.value / amountForPaging);
});

const onSearchInputChange = (input: string): void => {
  currentPage.value = 1;

  searchInput.value = input;
};

const assignTask = async (id: number): Promise<void> => {
  if (!id) return;

  await navigateTo(`/panel/tasks/${role}/${id}/assign`);
};

const openTask = async (id: number): Promise<void> => {
  if (!id) return;

  await navigateTo(`/panel/tasks/${role}/${id}`);
};

const editTask = async (id: number): Promise<void> => {
  if (!id) return;

  await navigateTo(`/panel/tasks/${role}/${id}/edit`);
};

const { data: tasksData, error: tasksError, pending: tasksPending } = useFetch("/api/task/get/task", {
  query: {
    idUser: userId,
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
            { label: 'Úkoly', to: `/panel/tasks/${role}`, active: true, icon: 'material-symbols:folder-copy-rounded' },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content v-if="allTasks">
      <div id="tasks">
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
              :navigate-to="[
              `/panel/tasks/${role}/add`,
              `/panel/tasks/${role}/remove`,
            ]"
          />

          <div class="line">
            <div class="line">
              <div class="line">
                <div class="section-head">
                  <h3>Vytvořené úkoly</h3>
                  <p>Seznam vašich vytvořených úkolů, s kterými můžete pracovat.</p>
                </div>

                <SearchInput @change="onSearchInputChange" placeholder="Hledat úkol" />
              </div>

              <TasksTable :tasks="allTasks" :loading="tasksPending">
                <template #actions="data">
                  <div class="actions">
                    <button type="button" class="default" @click="openTask(data.value.id)">Otevřít</button>
                    <button type="button" class="default" @click="editTask(data.value.id)">Upravit</button>
                    <button type="button" class="assign" @click="assignTask(data.value.id)">Přiřadit</button>
                  </div>
                </template>
              </TasksTable>

              <Pagination v-model="currentPage" :number-of-pages="numberOfPages" />
            </div>
          </div>
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

  .navigation {
    height: fit-content;
    position: sticky;
    min-width: 250px;
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

      &:hover {
        background: var(--btn-2-hover-background);
      }

      &.assign {
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
      flex: 1;
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

@media (max-width: 1420px) {
  #tasks .navigation {
    flex: 1;
  }
}

@media (max-width: 1055px) {
  #tasks {
    flex-direction: column;
    gap: 30px;
  }
}
</style>