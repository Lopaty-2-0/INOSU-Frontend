<script setup lang="ts">
import { useRoute } from "vue-router";
import Navbar from "../../../../components/layout/Navbar.vue";
import type { AccountData } from "~/types/account";
import {ref, onMounted, watchEffect, computed} from "vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import UsersGrid from "../../../../components/users/Grid.vue";
import Pagination from "../../../../components/ui/Pagination.vue";
import { useAlertsStore } from "~/stores/alerts";
import Loading from "~/components/ui/Loading.vue";
import SearchInput from "~/components/ui/SearchInput.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import {useLoadingStore} from "~/stores/loading";
import {useFetch} from "nuxt/app";

definePageMeta({
  roles: ["admin"],
});

const route = useRoute();
const role = route.params.role as string;

useHead({
  title: "Panel | Odstranění uživatelů - " + role,
  meta: [{ name: "description", content: "Panel Settings User Information" }],
});

const loading = ref<boolean>(false);
const alertsStore = useAlertsStore();
const selectedUsers = ref<AccountData[]>([]);
const usersGrid = ref<InstanceType<typeof UsersGrid> | null>(null);
const amountForPaging: number = 12;
const currentPage = ref<number>(1);
const users = ref<AccountData[] | undefined>(undefined);
const searchInput = ref<string>("");
const usersCount = ref<number>(0);
const numberOfPages = computed<number>((): number => {
  return Math.ceil(usersCount.value / amountForPaging);
});

const resetSelectedUsers = (): void => {
  if (usersGrid.value) usersGrid.value.reset();
};

const removeUsers = async (): Promise<void> => {
  if (!users.value || !selectedUsers.value) return;

  loading.value = true;

  await $fetch("/api/user/delete", {
    method: "delete",
    body: {
      idUser: selectedUsers.value.map((user: AccountData) => user.id),
    },
    ignoreResponseError: true,
    credentials: "include",
    onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "3010":
          alertsStore.addAlert({type: "error", title: "Odstranění uživatelů", message: "Nedostatečné oprávnění pro odstranění uživatelů."});
          break;
        case "3020":
          alertsStore.addAlert({type: "warning", title: "Odstranění uživatelů", message: "Žádný uživatel nebyl vybrán."});
          break;
        case "3030":
          alertsStore.addAlert({type: "warning", title: "Odstranění uživatelů", message: "Nemůžete odstranit sám sebe."});
          break;
        case "3040":
          alertsStore.addAlert({type: "warning", title: "Odstranění uživatelů", message: "Žádný uživatel nebyl odstraněn."});
          break;
        case "3051":
          alertsStore.addAlert({type: "success", title: "Odstranění uživatelů", message: `Uživatelé byli úspěšně odstraněni. (${response._data.data.deletedIds.length}/${selectedUsers.value.length})`});
          if (users.value) {
            users.value = users.value.filter((user: AccountData) => {
              return !selectedUsers.value.some(
                  (selectedUser: AccountData) => selectedUser.id === user.id
              );
            });

            resetSelectedUsers();
          }
          break;
        default:
          alertsStore.addAlert({type: "error", title: "Odstranění uživatelů", message: "Nastala neznámá chyba."});
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({type: "error", title: "Odstranění uživatelů", message: "Nastala neznámá chyba.",});
    },
  }).finally((): void => {
    loading.value = false;
  });
};

const onSearchInputChange = (input: string): void => {
  currentPage.value = 1;

  searchInput.value = input;
};

const onUsersSelect = (usersList: AccountData[]): void => {
  selectedUsers.value = usersList;
};

const updateActivePage = (pageNumber: number): void => {
  currentPage.value = pageNumber + 1;

  if (usersGrid.value) usersGrid.value.updateSelectedUsers(selectedUsers.value);
};

const { data: usersData, error: usersError, pending: usersPending } = await useFetch("/api/user/get/role", {
  query: {
    role: role,
    amountForPaging: amountForPaging,
    pageNumber: currentPage,
    searchQuery: searchInput,
  },
  method: "get",
  server: true,
  credentials: "include",
});

watchEffect((): void => {
  if ((usersError.value?.data.resCode || "").toString() === "23070") {
    users.value = undefined;
    return;
  }

  if (!usersData.value) return;

  users.value = usersData.value.data.users;
  usersCount.value = usersData.value.data.count;
});

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !users.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Uživatelé', to: '/panel/users', icon: 'material-symbols:supervisor-account-rounded' },
            { label: role, to: '/panel/users/' + role },
            { label: 'Odstranění', to: '/panel/users/' + role + '/remove', active: true }
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="users">
        <div class="content">
          <ActionBar
            class="action-bar"
            description="Správa uživatelů"
            :active="2"
            :texts="['Přidat', 'Upravit', 'Odebrat']"
            :icons="[
              'material-symbols:add-rounded',
              'material-symbols:edit-rounded',
              'material-symbols:delete-rounded',
            ]"
            :navigate-to="[
              `/panel/users/add`,
              `/panel/users/${role}/edit`,
              `/panel/users/${role}/remove`,
            ]"
          />

          <div class="line">
            <div class="section-head">
              <h3>
                Vybraní uživatelé: {{ selectedUsers.length }}
              </h3>
              <p>Vyberte uživatele, které chcete odstranit, nebo použijte vyhledávání pro zúžení výběru.</p>
            </div>

            <SearchInput @change="onSearchInputChange" placeholder="Hledat uživatele" />
          </div>

          <div class="buttons">
            <button class="remove" @click="removeUsers">
              Odstranit
              <Loading
                v-show="loading"
                size="5px"
                color="var(--actionBar-actions-remove-color)"
              />
            </button>
            <button class="reset" @click="resetSelectedUsers">
              Zrušit vše
            </button>
          </div>

          <div class="users">
            <UsersGrid
              ref="usersGrid"
              :users="users"
              :action="'remove'"
              :loading="usersPending"
              :reset="resetSelectedUsers"
              :selected-users="selectedUsers"
              @get:selected-users="onUsersSelect"
            />
            <Pagination
              class="users-navigation"
              :number-of-pages="numberOfPages"
              @get:active-page="updateActivePage"
            />
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
.action-bar {
  height: 80px;
}

#users {
  display: flex;
  flex-direction: row;
  gap: 30px;
  position: relative;
  min-height: calc(100vh - 140px);
  height: 100%;

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

    .users {
      display: flex;
      flex-direction: column;
      gap: 30px;
      justify-content: space-between;
      height: 100%;
    }

    .page-section {
      border-bottom: 1px solid rgba(var(--border-color), 0.5);
      padding-bottom: 35px;
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

      h4 {
        font-weight: 600;
        font-size: 16px;
        color: var(--title-color);
      }

      p {
        color: rgba(var(--description-color), 1);
        font-size: 16px;
      }
    }
  }
}

@media (max-width: 545px) {
  .action-bar {
    height: auto;
  }
}
</style>
