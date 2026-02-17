<script setup lang="ts">
import {computed, ref, watchEffect} from "vue";
import { storeToRefs } from "pinia";
import { useAccountStore } from "~/stores/account";
import Navbar from "~/components/layout/Navbar.vue";
import SearchInput from "~/components/ui/SearchInput.vue";
import type {TaskData} from "~/types/tasks";
import {useLoadingStore} from "~/stores/loading";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import TasksTable from "~/components/tables/Tasks.vue";
import Pagination from "~/components/ui/Pagination.vue";
import type {TaskTeam} from "~/types/team";
import Image from "~/components/ui/Image.vue";
import type {AccountData} from "~/types/account";

useHead({
  title: "Panel | Úkoly",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["student"],
});

const config = useRuntimeConfig();
const allTasks = ref<(TaskData & { team: TaskTeam, guarantor: AccountData })[] | undefined>(undefined);
const searchInput = ref<string>("");
const currentPage = ref<number>(1);
const amountForPaging: number = 10;
const tasksCount = ref<number>(0);
const numberOfPages = computed<number>((): number => {
  return Math.ceil(tasksCount.value / amountForPaging);
});

const updateActivePage = (pageNumber: number): void => {
  currentPage.value = pageNumber + 1;
};

const onSearchInputChange = (input: string): void => {
  currentPage.value = 1;

  searchInput.value = input;
};

const downloadTask = async (guarantorId: number, id: number, task: string | null): Promise<void> => {
  if (!guarantorId || !id || !task) return;

  await navigateTo(`/api/file/task/${guarantorId}/${id}/${task}`, { external: true, open: { target: "_blank" } });
};

const openTask = async (taskId: number, teamId: number, guarantorId: number): Promise<void> => {
  await navigateTo(`/panel/tasks/student/${taskId}/${guarantorId}/${teamId}`);
};

const { data: tasksData, error: tasksError, pending: tasksPending } = useFetch("/api/user_team/get", {
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

  allTasks.value = tasksData.value.data.user_teams.map((task: any) => {
    return {
      id: task.idTask,
      ...task,
    }
  });

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
            { label: 'Úkoly', to: `/panel/tasks/student`, active: true, icon: 'material-symbols:folder-copy-rounded' },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="tasks" v-if="allTasks">
        <div class="content">
          <div class="line">
            <div class="line">
              <div class="line">
                <div class="section-head">
                  <h3>Vaše úkoly</h3>
                  <p>Seznam vašich vytvořených úkolů, s kterými můžete pracovat.</p>
                </div>

                <SearchInput @change="onSearchInputChange" placeholder="Hledat úkol" />
              </div>

              <TasksTable class="datatable" :tasks="allTasks" :loading="tasksPending" :extra-columns="[
                  { field: 'guarantor', title: 'Garant' }
              ]">
                <template #task="data">
                  <span class="link limit" @click="downloadTask(data.value.guarantor.id, data.value.id, data.value.task)">
                    {{ data.value.task || "Žádné zadání" }}
                  </span>
                </template>

                <template #points="data">
                  {{ data.value.points ? `${data.value.team.points ?? "-"} / ${data.value.points}` : "Neurčeno" }}
                </template>

                <template #guarantor="data">
                  <div class="profile">
                    <Image
                        :src="config.public.originUrl + '/api/file/pfp/' + data.value.guarantor.profilePicture"
                        alt="profile-photo"
                        draggable="false"
                    />

                    <p class="account-name">
                      {{ data.value.guarantor.name }} {{ data.value.guarantor.surname }}
                    </p>
                  </div>
                </template>

                <template #actions="data">
                  <div class="actions">
                    <button type="button" class="primary" @click="openTask(data.value.id, data.value.team.idTeam, data.value.guarantor.id)">Otevřít</button>
                  </div>
                </template>
              </TasksTable>

              <Pagination v-model="currentPage" :number-of-pages="numberOfPages" @get:active-page="updateActivePage" />
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

  .profile {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-direction: row;

    .account-name {
      color: var(--mini-title-color);
      font-size: 16px;
      text-wrap: nowrap;
    }

    ::v-deep(img) {
      width: 45px;
      height: 45px;
      border-radius: var(--small-border-radius);
      object-fit: cover;
    }
  }

  .datatable {
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

    .limit {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .link {
      color: rgba(var(--main-color), 1);
      text-decoration: none;
      transition: 0.2s;
      cursor: pointer;

      &:hover {
        color: rgba(var(--main-color), 0.8);
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