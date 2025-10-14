<script setup lang="ts">
import {useRoute} from "#app";
import {ref} from "vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import Navbar from "~/components/layout/Navbar.vue";
import UsersGrid from "~/components/users/Grid.vue";
import Pagination from "~/components/ui/Pagination.vue";
import apiFetch from "~/componsables/apiFetch";
import type {AccountData} from "~/types/account";
import checkPermissions from "~/componsables/checkPermissions";
import SearchInput from "~/components/ui/SearchInput.vue";

const route = useRoute();
const classId = route.params.class as string;

useHead({
  title: "Panel | Uživatelé - Třída: " + classId,
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
        ]"
      />
    </template>

    <template #content v-if="users">
      <div id="users">
        <div class="content">
          <ActionBar
              class="action-bar"
              description="Správa uživatelů"
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
            v-if="checkPermissions(['admin'])"
          />

          <div class="line">
            <div class="section-head">
              <h3>Celkem uživatelů: {{ searchedUsers.length }}</h3>
              <p>Zde vidíte uživatele dané role a třídě. Použijte vyhledávání pro rychlé filtrování seznamu.</p>
            </div>

            <SearchInput v-model="searchInput" @input="searchUsers" placeholder="Hledat uživatele" />
          </div>

          <div class="users">
            <UsersGrid
              :users="searchedUsers"
              :users-per-page="12"
              :action="'list'"
              :active-page="activePage"
              @get:number-of-pages="(value: number) => (numberOfPages = value)"
            />
            <Pagination
              class="users-navigation"
              :number-of-pages="numberOfPages"
              :chunk-size="3"
              @get:active-page="(value: number) => (activePage = value)"
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
