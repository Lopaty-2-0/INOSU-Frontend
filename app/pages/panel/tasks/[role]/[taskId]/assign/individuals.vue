<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import Navigation from "~/components/ui/Navigation.vue";
import moment from "moment/moment";
import type {TaskData} from "~/types/tasks";
import {computed, ref, useTemplateRef, watch, watchEffect} from "vue";
import {navigateTo, useFetch} from "nuxt/app";
import {useLoadingStore} from "~/stores/loading";
import { useAlertsStore } from "~/stores/alerts";
import ActionFooter from "~/components/manage/Footer.vue";
import EditClass from "~/components/manage/Class.vue";
import type {AccountData} from "~/types/account";
import Pagination from "~/components/ui/Pagination.vue";
import UsersTable from "~/components/tables/Users.vue";
import SearchInput from "~/components/ui/SearchInput.vue";
import {useAccountStore} from "~/stores/account";
import {storeToRefs} from "pinia";

const route = useRoute();
const role = route.params.role as string;
const taskId = route.params.taskId as string;

useHead({
  title: "Panel | Úkol - " + taskId + " - Přiřazení - Jednotlivci",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const amountForUsersPaging: number = 5;
const alertsStore = useAlertsStore();
const accountStore = useAccountStore();
const { getAccountData: accountData } = storeToRefs(accountStore);
const usersDatatable = useTemplateRef<InstanceType<typeof UsersTable>>("usersDatatable");
const task = ref<TaskData | undefined>(undefined);
const submitLoading = ref<boolean>(false);
const selectedClass = ref<number | undefined>(undefined);
const selectedUsers = ref<number[]>([]);
const currentUsersPage = ref<number>(1);
const users = ref<AccountData[] | undefined>(undefined);
const usersCount = ref<number>(0);
const searchUsersInput = ref<string>("");
const requestUrls = computed<string>(() => {
  return selectedClass.value ? "/api/user_class/get/users" : "/api/user/get/noClass"
});
const numberOfUsersPages = computed<number>((): number => {
  return Math.ceil(usersCount.value / amountForUsersPaging);
});

const resetSelection = (): void => {
  selectedUsers.value = [];
  if (usersDatatable.value) usersDatatable.value.clearSelection();
};

const assignToTask = async (): Promise<void> => {
  if (!selectedUsers.value) {
    alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Vyplňte všechna povinná pole." });
    return;
  }

  submitLoading.value = true;

  await $fetch("/api/user_team/add", {
    method: "post",
    body: {
      idTask: taskId,
      idUser: selectedUsers.value
    },
    ignoreResponseError: true,
    credentials: "include",
    onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();
      const badIds: any[] = response._data.data?.badIds || [];
      const differentTeam: any[] = response._data.data?.differentTeam || [];

      switch (resCode) {
        case "36010":
        case "36030":
        case "36040":
          alertsStore.addAlert({ type: "error", title: "Přiřazení k úkolu", message: "ID úkolu je neplatné." });
          break;

        case "36020":
          alertsStore.addAlert({ type: "warning", title: "Přiřazení k úkolu", message: "Nebyl vybrán žádný uživatel ani třída." });
          break;

        case "36050":
          alertsStore.addAlert({ type: "error", title: "Přiřazení k úkolu", message: "Úkol neexistuje nebo nejste jeho garant." });
          break;

        case "36060":
          alertsStore.addAlert({ type: "error", title: "Přiřazení k úkolu", message: "Tento endpoint nelze použít pro maturitní úkol." });
          break;

        case "36070":
          alertsStore.addAlert({ type: "warning", title: "Přiřazení k úkolu", message: "Nikomu nebyl úkol přiřazen." });
          break;

        case "36081":
          if (differentTeam.length > 0)
            alertsStore.addAlert({ type: "warning", title: "Přiřazení k úkolu", message: `Někteří uživatelé již byli přiřazeni k jinému týmu.` });

          if (badIds.length > 0)
            alertsStore.addAlert({ type: "warning", title: "Přiřazení k úkolu", message: `Některé uživatele nebylo možné přiřadit.` });

          alertsStore.addAlert({ type: "success", title: "Přiřazení k úkolu", message: `Přiřazení úkolu bylo úspěšně aktualizováno.` });

          resetSelection();
          break;

        default:
          alertsStore.addAlert({ type: "error", title: "Přiřazení k úkolu", message: "Nastala neznámá chyba." });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Přiřazení k úkolu", message: "Nastala neznámá chyba." });
    },
  }).finally((): void => {
    submitLoading.value = false;
  });
};

const onClassUpdate = (payload: { classes: number[] }): void => {
  selectedClass.value = payload.classes[0] || undefined;
};

const onUsersSearchInputChange = (input: string): void => {
  currentUsersPage.value = 1;

  searchUsersInput.value = input;
};

const onUsersRowClicked = (user: AccountData): void => {
  if (!selectedUsers.value.includes(user.id)) {
    selectedUsers.value.push(user.id);
  } else {
    selectedUsers.value = selectedUsers.value.filter((id: number) => id !== user.id);
  }
};

const { data: taskData, error: taskError } = useFetch("/api/task/get/id", {
  query: {
    id: taskId,
    guarantor: accountData.value.id,
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
});

const { data: usersData, error: usersError, pending: usersPending } = useFetch(requestUrls, {
  query: {
    amountForPaging: amountForUsersPaging,
    pageNumber: currentUsersPage,
    searchQuery: searchUsersInput,
    idClass: selectedClass,
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
});

watch([taskData, taskError], (): void => {
  if (taskError.value) {
    task.value = undefined;
    return;
  }

  if (!taskData.value) return;

  task.value = taskData.value.data.task;
}, { immediate: true });

watch([usersData, usersError], (): void => {
  if (usersError.value) {
    users.value = undefined;
    return;
  }

  if (!usersData.value) return;

  users.value = usersData.value.data.users;
  usersCount.value = usersData.value.data.count;
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !task.value && !taskError.value || !users.value && !usersError.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Úkoly', to: `/panel/tasks/${role}`, icon: 'material-symbols:folder-copy-rounded' },
            { label: `Úkol ID: ${taskId}`, to: `/panel/tasks/${role}/${taskId}` },
            { label: 'Přiřazení', to: `/panel/tasks/${role}/${taskId}/assign` },
            { label: 'Jednotlivci', to: `/panel/tasks/${role}/${taskId}/assign/individuals`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="task-assign">
        <Navigation class="page-navigation" title="Přiřazení" :active-link-id="1" :links="[
          { name: 'Třídy', path: `/panel/tasks/${role}/${taskId}/assign` },
          { name: 'Jednotlivci', path: `/panel/tasks/${role}/${taskId}/assign/individuals` },
          { name: 'Týmy', path: `/panel/tasks/${role}/${taskId}/assign/teams` },
        ]" />

        <div class="content" v-if="task">
          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>{{ task.name }}</h3>
              <p>Úkol ID: {{ task.id }}</p>
              <p>Garant: {{ task.guarantor.name }} {{ task.guarantor.surname }}</p>
              <p>Začátek: {{ moment(task.startDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p>Konec: {{ moment(task.endDate).format("HH:mm DD.MM. YYYY") }}</p>
              <p v-if="task.deadline">Uzávěrka: {{ moment(task.deadline).format("HH:mm DD.MM. YYYY") }}</p>
              <p>Max bodů: {{ task.points ?? "neurčeno" }}</p>
              <p>
                Zadání:
                <a :href="task.task ? `/api/file/task/${task.guarantor.id}/${task.id}/${task.task}` : '#'" class="link" download target="_blank">
                  {{ task.task || "Žádné zadání" }}
                </a>
              </p>
            </div>
          </div>

          <div class="page-section">
            <div class="section-head">
              <h3>Filtrace třídy</h3>
              <p>Vyberte třídy, do kterých bude nový uživatel (student) zařazen. Toto pole je volitelné.</p>
            </div>

            <EditClass ref="editClass" :multiple="false" :old-class-ids="selectedClass ? [selectedClass] : []" @update="onClassUpdate" />
          </div>

          <div class="page-section bottom-line">
            <div class="line">
              <div class="section-head users">
                <h3>Vybraní žáci: {{ selectedUsers.length }}</h3>
              </div>

              <SearchInput @change="onUsersSearchInputChange" placeholder="Hledat uživatele" />
            </div>

            <UsersTable ref="usersDatatable" @row-clicked="onUsersRowClicked" :has-checkbox="true" :selected-ids="selectedUsers"  :users="users || []" :loading="usersPending" />

            <Pagination
                class="users-navigation"
                :number-of-pages="numberOfUsersPages"
                v-model="currentUsersPage"
            />
          </div>

          <div class="page-section">
            <ActionFooter :submit-function="assignToTask" :reset-function="resetSelection" :is-loading="submitLoading" />
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
#task-assign {
  display: flex;
  flex-direction: row;
  gap: 30px;
  position: relative;

  .page-navigation {
    height: fit-content;
    position: sticky;
    top: 110px;
    min-width: 300px;
    padding: 30px;
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

    .link {
      color: rgba(var(--main-color), 1);
      text-decoration: none;
      transition: 0.2s;

      &:hover {
        color: rgba(var(--main-color), 0.8);
      }
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

    .page-section {
      border-bottom: none;
      display: flex;
      flex-direction: column;
      gap: 30px;

      &.bottom-line {
        padding-bottom: 35px;
        border-bottom: 1px solid rgba(var(--border-color), 0.5);
      }
    }

    .classes {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 30px;

      .class {
        display: flex;
        flex: 1;
        cursor: pointer;
        min-width: 200px;
        text-decoration: none;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        padding: 60px 30px;
        transition: 0.2s;
        border-radius: var(--normal-border-radius);

        span {
          font-weight: 600;
          font-size: 16px;
          color: var(--title-color);
          text-transform: uppercase;

          .name {
            text-transform: none;
          }
        }

        &:hover,
        &.active {
          background: var(--card-1-hover-background);
        }
      }
    }
  }
}

@media (max-width: 1200px) {
  #task-assign {
    flex-direction: column;
    gap: 30px;

    .page-navigation {
      width: 100%;
      position: relative;
      top: 0;
      min-width: 200px;
    }
  }
}
</style>