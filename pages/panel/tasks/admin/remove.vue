<script setup lang="ts">
import Navbar from "~/components/Navbar.vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import ActionBar from "~/components/basics/ActionBar.vue";
import apiFetch from "~/componsables/apiFetch";
import {onMounted, ref} from "vue";
import {useRoute} from "#vue-router";
import {useAccountStore} from "~/stores/account";
import { storeToRefs } from "pinia";
import { useAlertsStore } from "~/stores/alerts";
import type { TaskData } from "~/types/tasks";
import moment from "moment";

useHead({
  title: "Panel | Úkoly - Odstranění",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin"],
});

const accountStore = useAccountStore();
const alertsStore = useAlertsStore();
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
const loading = ref<boolean>(false);

const removeTask = async (id: number): Promise<void> => {
  if (!id) return;

  loading.value = true;

  await apiFetch("/task/delete", {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      id: id,
    },
    ignoreResponseError: true,
    credentials: "include",
    onResponse({ response }: any) {
      const resCode: string = response._data.resCode?.toString();

      switch (resCode) {
        case "28010":
          alertsStore.addAlert({ type: "error", title: "Odstranění úkolu", message: "Studenti nemohou mazat úkoly." });
          break;
        case "28020":
          alertsStore.addAlert({ type: "error", title: "Odstranění úkolu", message: "Chybí ID úkolu." });
          break;
        case "28030":
          alertsStore.addAlert({ type: "error", title: "Odstranění úkolu", message: "Nemáte oprávnění k této akci." });
          break;
        case "28040":
          alertsStore.addAlert({ type: "error", title: "Odstranění úkolu", message: "Úkol nebyl nalezen." });
          break;
        case "28051":
          alertsStore.addAlert({ type: "success", title: "Odstranění úkolu", message: "Úkol byl úspěšně odstraněn." });
          allTasks.value = allTasks.value?.filter((task: TaskData) => task.id !== id);
          break;
        default:
          alertsStore.addAlert({ type: "error", title: "Odstranění úkolu", message: "Nastala neznámá chyba." });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Odstranění úkolu", message: "Nastala neznámá chyba." });
    },
  }).finally((): void => {
    loading.value = false;
  });
};

onMounted(async (): Promise<void> => {
  await apiFetch(`/task/get/guarantor?idUser=${userId.value}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }) {
      const tasks: TaskData[] = response._data.data.tasks || [];

      allTasks.value = tasks || [];
    },
  });
})
</script>

<template>
  <NuxtLayout name="panel" :loading="!allTasks">
    <template #header>
      <Navbar
          :links="[
          { name: 'Úkoly', path: `/panel/tasks/admin` },
          { name: 'Odstranění', path: `/panel/tasks/admin/remove` },
        ]"
      />
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
              :active="1"
              :navigate-to="[
              `/panel/tasks/admin/add`,
              `/panel/tasks/admin/remove`,
            ]"
          />

          <div class="line">
            <div class="section-head">
              <h3>Odstranění vašich úkolů</h3>
              <p>Zde můžete odstranit úkoly, které jste vytvořili. Vyberte úkol ze seznamu a klikněte na tlačítko Odebrat.</p>
            </div>

            <div class="search">
              <input
                  type="text"
                  name="searchInput"
                  placeholder="Hledat úkol"
                  v-model="searchInput"
              />
              <Icon class="icon" name="material-symbols:search-rounded"></Icon>
            </div>
          </div>

          <Vue3Datatable :loading="loading" :rows="allTasks" :columns="cols" :pageSize="10" :sortable="true" :search="searchInput">
            <template #task="data">
              <a :href="`http://89.203.248.163/uploads/tasks/${data.value.id}/${data.value.task}`" class="link" download target="_blank">
                {{ data.value.task }}
              </a>
            </template>

            <template #startDate="data">
              <p>{{ moment(data.value.startDate).format("DD.MM. YYYY HH:MM") }}</p>
            </template>

            <template #endDate="data">
              <p>{{ moment(data.value.endDate).format("DD.MM. YYYY HH:MM") }}</p>
            </template>

            <template #approve="data">
              <p>{{ data.value.approve ? "Ano" : "Ne" }}</p>
            </template>

            <template #actions="data">
              <div class="actions">
                <button type="button" class="remove" @click="removeTask(data.value.id)">Odebrat</button>
              </div>
            </template>
          </Vue3Datatable>
        </div>
      </div>
      <Alerts />
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

    .search {
      min-width: 150px;
      display: flex;
      align-items: center;

      input {
        border: var(--border-width) solid rgba(var(--border-color), 0.5);
        border-radius: var(--normal-border-radius);
        font-size: 16px;
        outline: none;
        padding: 15px 40px 15px 15px;
        width: 100%;
        background: var(--input-background);
        color: var(--input-color);

        &:focus {
          border-color: rgba(var(--main-color), 1);
        }
      }

      .icon {
        margin-left: -30px;
        cursor: pointer;
        color: rgba(var(--description-color), 1);
        transition: 0.2s;
        font-size: 16px;

        &:hover {
          color: var(--mini-title-color);
        }
      }
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
  #tasks {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
