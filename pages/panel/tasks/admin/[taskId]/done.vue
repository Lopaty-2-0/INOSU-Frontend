<script setup lang="ts">
import Navbar from "~/components/Navbar.vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import ActionBar from "~/components/basics/ActionBar.vue";
import apiFetch from "~/componsables/apiFetch";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "#vue-router";
import type {TaskData} from "~/types/tasks";
import moment from "moment/moment";
import Navigation from "~/components/basics/Navigation.vue";
import type {AccountData} from "~/types/account";

const route = useRoute();
const router = useRouter();
const taskId = route.params.taskId as string;

definePageMeta({
  roles: ["admin"],
});

useHead({
  title: "Panel | Vypracované - " + taskId,
  meta: [{ name: "description", content: "Panel Homepage" }],
});

const task = ref<TaskData | undefined>(undefined);
const loading = ref<boolean>(false);
const cols = ref<{ field: string; title: string; type?: string; width?: string; filter?: boolean; }[]>([
  { field: "id", title: "ID", width: "90px", type: "number" },
  { field: "name", title: "Autor", type: "string" },
  { field: "abbreviation", title: "Zkratka", type: "date" },
  { field: "email", title: "E-mail", type: "string" },
  { field: "actions", title: "Akce" },
]);
const pendingUsers = ref<AccountData[] | undefined>(undefined);
const searchInput = ref<string>("");

const openUserTask = async (id: number): Promise<void> => {
  if (!id) return;

  await navigateTo(`/panel/tasks/admin/${taskId}/${id}`);
};

onMounted(async (): Promise<void> => {
  await apiFetch(`/task/get/id?idTask=${taskId}`, {
    method: "get",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ignoreResponseError: true,
    async onResponse({ response }) {
      const taskData = response._data.data.task;

      if (!taskData) {
        await router.push(`/panel/tasks/admin`);
        return;
      }

      task.value = taskData;
    },
  });

  await apiFetch(`/user_task/get/status/idTask?idTask=${taskId}&status=${encodeURIComponent(JSON.stringify(["approved"]))}`, {
    method: "get",
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }) {
      pendingUsers.value = (response._data.data.tasks || []).filter((task: any) => task.elaboration).map((task: any) => task.elaborator) || [];
    }
  });
});
</script>

<template>
  <NuxtLayout name="panel" :loading="!pendingUsers || !task">
    <template #header>
      <Navbar
          :links="[
          { name: 'Úkoly', path: `/panel/tasks/admin` },
          { name: 'Vypracované', path: `/panel/tasks/admin/${taskId}/inProgress` },
        ]"
      />
    </template>

    <template #content v-if="pendingUsers && task">
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
            <Navigation class="navigation" title="Úkoly" :active-link-id="2" :links="[
              { name: 'Žádosti', path: `/panel/tasks/admin/${taskId}` },
              { name: 'Rozpracované', path: `/panel/tasks/admin/${taskId}/inProgress` },
              { name: 'Vypracované', path: `/panel/tasks/admin/${taskId}/done` },
            ]" />

            <div class="line">
              <div class="line">
                <div class="section-head">
                  <div class="section-head">
                    <h3>Vypracovaný úkol</h3>
                    <p>Úkol ID: {{ task.id }}</p>
                    <p>Název: {{ task.name }}</p>
                    <p>Garant ID: {{ task.guarantor }}</p>
                    <p>Začátek: {{ moment(task.startDate).format("DD.MM. YYYY HH:MM") }}</p>
                    <p>Konec: {{ moment(task.endDate).format("DD.MM. YYYY HH:MM") }}</p>
                    <p>Nutné potvrzení: {{ task.approve ? "Ano" : "Ne" }}</p>
                    <p>
                      Zadání:
                      <a :href="`http://89.203.248.163/uploads/tasks/${task.id}/${task.task}`" class="link" download target="_blank">
                        {{ task.task }}
                      </a>
                    </p>
                  </div>
                </div>

                <div class="search">
                  <input
                      type="text"
                      name="searchInput"
                      placeholder="Hledat uživatele"
                      v-model="searchInput"
                  />
                  <Icon class="icon" name="material-symbols:search-rounded"></Icon>
                </div>
              </div>

              <Vue3Datatable :loading="loading" :rows="pendingUsers" :columns="cols" :pageSize="10" :sortable="true" :search="searchInput">
                <template #name="data">
                  <div class="profile">
                    <img :src="'http://89.203.248.163/uploads/profilePictures/' + data.value.profilePicture" alt="User profile photo" loading="lazy"/>
                    <p>{{ data.value.name }} {{ data.value.surname }}</p>
                  </div>
                </template>

                <template #abbreviation="data">
                  <p class="uppercase">{{ data.value.abbreviation || "Není" }}</p>
                </template>

                <template #actions="data">
                  <div class="actions">
                    <button type="button" class="primary" @click="openUserTask(data.value.id)">Otevřít</button>
                  </div>
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
@use "../../../../../assets/style/datatable";

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

  .uppercase {
    text-transform: uppercase;
  }

  .profile {
    display: flex;
    align-items: center;
    gap: 10px;

    img {
      min-width: 45px;
      min-height: 45px;
      width: 45px;
      height: 45px;
      border-radius: var(--small-border-radius);
      object-fit: cover;
    }

    p {
      font-size: 16px;
      color: rgba(var(--description-color), 1);
    }
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

      &.accept {
        color: var(--actionBar-actions-add-color);
        background: rgba(var(--actionBar-actions-add-background), 1);
        border-color: rgba(var(--actionBar-actions-add-border), 1);

        &:hover {
          background: rgba(var(--actionBar-actions-add-background), 0.8);
        }
      }

      &.deny {
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