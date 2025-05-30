<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref } from "vue";
import ActionBar from "~/components/basics/ActionBar.vue";
import Navbar from "~/components/Navbar.vue";
import UsersGrid from "~/components/users/Grid.vue";
import GridNavigation from "~/components/users/Navigation.vue";
import Alerts from "~/components/Alerts.vue";
import { useAlertsStore } from "~/stores/alerts";
import apiFetch from "~/componsables/apiFetch";
import type { AccountData } from "~/types/account";
import Loading from "~/components/basics/Loading.vue";

definePageMeta({
  roles: ["admin"],
});

const route = useRoute();
const classId = route.params.class as string;

useHead({
  title: "Panel | Odstranění uživatelů -  Třída: " + classId,
  meta: [{ name: "description", content: "Panel Settings User Information" }],
});

const loading = ref<boolean>(false);
const alertsStore = useAlertsStore();
const users = ref<AccountData[] | null>(null);
const numberOfPages = ref<number>(0);
const activePage = ref<number>(0);
const selectedUsers = ref<AccountData[]>([]);
const resetSelectedUsers = ref<boolean>(false);
const searchInput = ref<string>("");
const searchedUsers = ref<AccountData[]>([]);

const searchUsers = (): void => {
  const inputToArray: string[] = searchInput.value.split(" ");
  const allSearchedUsers: AccountData[] = [];

  if (!users.value) return;

  users.value.forEach((user: AccountData) => {
    const searchResult = [
      user.name,
      user.surname,
      user.email,
      user.abbreviation || "",
    ].some((word: string) => {
      let result: boolean = false;

      inputToArray.forEach((inputWord: string) => {
        result = word.toLowerCase().includes(inputWord.toLowerCase());
      });

      return result;
    });

    if (searchResult) allSearchedUsers.push(user);
  });

  searchedUsers.value = allSearchedUsers;
};

const pingResetSelectedUsers = (): void => {
  resetSelectedUsers.value = false;

  setTimeout((): void => {
    resetSelectedUsers.value = true;
  }, 10);
};

const removeUsers = async (): Promise<void> => {
  if (!users.value || !selectedUsers.value) return;

  loading.value = true;

  await apiFetch("/user/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      idUser: selectedUsers.value.map((user: AccountData) => user.id),
    },
    ignoreResponseError: true,
    credentials: "include",
    onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "3010":
          alertsStore.addAlert({type: "error", title: "Odstranění uživatelů", message: "Nedostatečné oprávnění pro odstranění uživatelů.",});
          break;
        case "3020":
          alertsStore.addAlert({type: "warning", title: "Odstranění uživatelů", message: "Žádný uživatel nebyl vybrán.",});
          break;
        case "3030":
          alertsStore.addAlert({type: "warning", title: "Odstranění uživatelů", message: "Nemůžete odstranit sám sebe.",});
          break;
        case "3040":
          alertsStore.addAlert({type: "warning", title: "Odstranění uživatelů", message: "Nemůžete odstranit sám sebe.",});
          break;
        case "3051":
          alertsStore.addAlert({type: "success", title: "Odstranění uživatelů", message: "Uživatelé byli úspěšně odstraněni.",});

          if (users.value) {
            users.value = users.value.filter((user: AccountData) => {
              return !selectedUsers.value.some(
                (selectedUser: AccountData) => selectedUser.id === user.id
              );
            });

            searchedUsers.value = [...users.value];
            pingResetSelectedUsers();
          }

          break;
        default:
          alertsStore.addAlert({type: "error", title: "Odstranění uživatelů", message: "Nastala neznámá chyba.",});
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

onMounted(async (): Promise<void> => {
  await apiFetch(classId !== "undefined" ? `/user_class/get/users?idClass=${encodeURIComponent(classId)}` : `/user/get/noClass`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }: any) {
      const usersData: AccountData[] = response._data?.data?.users || [];

      users.value = usersData;
      searchedUsers.value = [...usersData];
    },
  });
});
</script>

<template>
  <NuxtLayout name="panel" :loading="!users">
    <template #header>
      <Navbar
        :links="[
          { name: 'Uživatelé', path: '/panel/users' },
          { name: 'student', path: '/panel/users/student' },
          { name: 'Třída: ' + classId, path: '/panel/users/student/' + classId },
          { name: 'Odstranění', path: '/panel/users/student/' + classId + '/remove' },
        ]"
      />
    </template>

    <template #content v-if="users">
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
              `/panel/users/student/${classId}/edit`,
              `/panel/users/student/${classId}/remove`,
            ]"
          />

          <div class="line">
            <div class="section-head">
              <h3>
                Uživatelé: {{ selectedUsers.length }} /
                {{ searchedUsers.length }}
              </h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            </div>

            <div class="search">
              <input
                type="text"
                name="searchInput"
                placeholder="Hledat uživatele"
                @input="searchUsers"
                v-model="searchInput"
              />
              <Icon class="icon" name="material-symbols:search-rounded"></Icon>
            </div>
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
            <button class="reset" @click="pingResetSelectedUsers">
              Zrušit vše
            </button>
          </div>

          <div class="users">
            <UsersGrid
              :users="searchedUsers"
              :users-per-page="12"
              :action="'remove'"
              :active-page="activePage"
              :reset="resetSelectedUsers"
              @get:number-of-pages="(value) => (numberOfPages = value)"
              @get:selected-users="(value) => (selectedUsers = value)"
            />
            <GridNavigation
              class="users-navigation"
              :number-of-pages="numberOfPages"
              @get:active-page="(value) => (activePage = value)"
            />
          </div>
        </div>

        <Alerts />
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
