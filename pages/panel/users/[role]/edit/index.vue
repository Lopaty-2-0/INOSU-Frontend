<script setup lang="ts">
import { useRoute } from "vue-router";
import {onMounted, ref} from "vue";
import ActionBar from "~/components/basics/ActionBar.vue";
import Navbar from "~/components/Navbar.vue";
import UsersGrid from "~/components/users/Grid.vue";
import GridNavigation from "~/components/users/Navigation.vue";
import Alerts from "~/components/Alerts.vue";
import apiFetch from "~/componsables/apiFetch";
import type { AccountData } from "~/types/account";

definePageMeta({
  roles: ["admin"],
});

const route = useRoute();
const role = route.params.role as string;

useHead({
  title: "Panel | Upravení uživatelů - " + role,
  meta: [{ name: "description", content: "Panel Settings User Information" }],
});

const users = ref<AccountData[] | null>(null);
const numberOfPages = ref<number>(0);
const activePage = ref<number>(0);
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

onMounted(async (): Promise<void> => {
  await apiFetch(`/user/get/role?role=${encodeURIComponent(role)}`, {
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
          { name: role, path: '/panel/users/' + role },
          { name: 'Upravení', path: '/panel/users/' + role + '/edit' },
        ]"
      />
    </template>

    <template #content v-if="users">
      <div id="users">
        <div class="content">
          <ActionBar
              class="action-bar"
              description="Správa uživatelů"
              :active="1"
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
              <h3>Upravení uživatelů</h3>
              <p>Zde si můžete vybrat uživatele, kterého chcete upravit.</p>
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

          <div class="users">
            <UsersGrid
              :users="searchedUsers"
              :users-per-page="12"
              :action="'edit'"
              :active-page="activePage"
              @get:number-of-pages="(value: any) => (numberOfPages = value)"
            />
            <GridNavigation
                class="users-navigation"
                :number-of-pages="numberOfPages"
                @get:active-page="(value: any) => (activePage = value)"
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
