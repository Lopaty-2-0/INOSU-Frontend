<script setup lang="ts">
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import {ref, watchEffect} from "vue";
import moment from "moment/moment";
import { storeToRefs } from "pinia";
import Navbar from "~/components/layout/Navbar.vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import SearchInput from "~/components/ui/SearchInput.vue";
import type { TaskData } from "~/types/task";
import { useAccountStore } from "~/stores/account";
import {useLoadingStore} from "~/stores/loading";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import TasksTable from "~/components/tables/Tasks.vue";

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

const cols = ref<{ field: string; title: string; type?: string; width?: string; filter?: boolean; }[]>([
  { field: "id", title: "ID", width: "90px", type: "number" },
  { field: "name", title: "Název", type: "string" },
  { field: "startDate", title: "Začátek", type: "date" },
  { field: "endDate", title: "Konec", type: "date" },
  { field: "approve", title: "Nutné potvrzení", type: "boolean" },
  { field: "task", title: "Zadání", type: "string" },
  { field: "actions", title: "Akce" },
]);
const allTasks = ref<TaskData[] | undefined>(undefined);
const searchInput = ref<string>("");

const assignTask = async (id: number): Promise<void> => {
  if (!id) return;

  await navigateTo(`/panel/tasks/admin/${id}/assign`);
};

const openTask = async (id: number): Promise<void> => {
  if (!id) return;

  await navigateTo(`/panel/tasks/admin/${id}`);
};

useFetch(`/api/task/get/guarantor?idUser=${userId.value}`, {
  method: "get",
  server: false,
  credentials: "include",
  ignoreResponseError: true,
  onResponse({ response }: any) {
    const tasks: TaskData[] = response._data.data.tasks || [];

    allTasks.value = tasks || [];
  },
});

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !allTasks.value);
})
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
              `/panel/tasks/admin/add`,
              `/panel/tasks/admin/remove`,
            ]"
          />

          <div class="line">
            <div class="line">
              <div class="line">
                <div class="section-head">
                  <h3>Vytvořené úkoly</h3>
                  <p>Seznam vašich vytvořených úkolů, s kterými můžete pracovat.</p>
                </div>

                <SearchInput v-model="searchInput" placeholder="Hledat úkol" />
              </div>

              <TasksTable :tasks="allTasks" :search="searchInput" :page-size="10">
                <template #actions="data">
                  <div class="actions">
                    <button type="button" class="default" @click="openTask(data.row.id)">Otevřít</button>
                    <button type="button" class="assign" @click="assignTask(data.row.id)">Přiřadit</button>
                  </div>
                </template>
              </TasksTable>
            </div>
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
@use "../../../../assets/style/datatable";

::v-deep(.bh-datatable .bh-table-responsive tr td p) {
  text-transform: uppercase;
}

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
      align-items: flex-start;
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