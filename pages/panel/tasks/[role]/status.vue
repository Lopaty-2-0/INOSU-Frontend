<script setup lang="ts">
import Navbar from "~/components/Navbar.vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import ActionBar from "~/components/basics/ActionBar.vue";
import apiFetch from "~/componsables/apiFetch";
import {ref, onMounted} from "vue";
import {useRoute} from "#vue-router";
import {useAccountStore} from "~/stores/account";
import type {TaskData} from "~/types/tasks";
import moment from "moment/moment";
import Navigation from "~/components/basics/Navigation.vue";

useHead({
  title: "Panel | Stavy přijatých úkolů",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["student"],
});

const route = useRoute();
const role = route.params.role as string;

const cols = ref<{ field: string; title: string; type?: string; width?: string; filter?: boolean; }[]>([
  { field: "id", title: "ID", width: "90px", type: "number" },
  { field: "name", title: "Název", type: "string" },
  { field: "startDate", title: "Začátek", type: "date" },
  { field: "endDate", title: "Konec", type: "date" },
  { field: "task", title: "Zadání", type: "string" },
  { field: "status", title: "Stav", type: "string" },
]);
const allTasks = ref<TaskData[] | undefined>(undefined);
const searchInput = ref<string>("");

onMounted(async (): Promise<void> => {
  await apiFetch(`/user_task/get/status?status=${encodeURIComponent(JSON.stringify(["rejected", "pending"]))}&which=1`, {
    method: "get",
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }) {
      const tasks: TaskData[] = (response._data.data.elaboratingTasks || []).filter((task: any) => !task.review).map((task: any) => {
        return {
          ...task,
          id: task.idTask
        };
      }) || [];

      allTasks.value = tasks || [];
    },
  });
});
</script>

<template>
  <NuxtLayout name="panel" :loading="!allTasks">
    <template #header>
      <Navbar
          :links="[
          { name: 'Úkoly', path: `/panel/tasks/${role}` },
          { name: 'Stavy úkolů', path: `/panel/tasks/${role}/status` },
        ]"
      />
    </template>

    <template #content v-if="allTasks">
      <div id="tasks">
        <div class="content">
          <div class="line">
            <Navigation class="navigation" title="Úkoly" :active-link-id="2" :links="[
              { name: 'Aktivní', path: `/panel/tasks/${role}` },
              { name: 'Dostupné', path: `/panel/tasks/${role}/available` },
              { name: 'Stav úkolů', path: `/panel/tasks/${role}/status` },
              { name: 'Vyhodnocené', path: `/panel/tasks/${role}/evaluated` },
            ]" />

            <div class="line">
              <div class="line">
                <div class="section-head">
                  <h3>Stavy přijatých úkolů</h3>
                  <p>Zde vidíte seznam úkolů, které čekají na schválení nebo byly zamítnuty.</p>
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

              <Vue3Datatable :rows="allTasks" :columns="cols" :pageSize="10" :sortable="true" :search="searchInput">
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
                <template #status="data">
                  <p :class="{[data.value.status]: true}">
                    {{
                      data.value.status === "rejected" ? "Zamítnuto" : data.value.status === "pending" ? "Čeká na schválení" : data.value.status
                    }}
                  </p>
                </template>
              </Vue3Datatable>
            </div>
          </div>
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

  .pending {
    color: rgba(var(--main-color), 1);
    font-weight: 600;
  }

  .rejected {
    color: rgba(var(--error-color), 1);
    font-weight: 600;
  }

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
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 30px;
      width: 100%;
      flex: 1;
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
