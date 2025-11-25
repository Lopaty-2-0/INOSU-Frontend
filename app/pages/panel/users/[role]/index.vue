<script setup lang="ts">
import {useRoute} from "#app";
import Navbar from "../../../../components/layout/Navbar.vue";
import type {AccountData} from "~/types/account";
import {computed, ref, watchEffect} from "vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import UsersGrid from "../../../../components/users/Grid.vue";
import Pagination from "../../../../components/ui/Pagination.vue";
import checkPermissions from "~/componsables/checkPermissions";
import SearchInput from "~/components/ui/SearchInput.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import {useLoadingStore} from "~/stores/loading";
import {useFetch} from "nuxt/app";

const route = useRoute();
const role = route.params.role as string;

useHead({
  title: "Panel | Uživatelé - " + role,
  meta: [{ name: "description", content: "Panel Settings User Information" }],
});

const amountForPaging: number = 12;
const currentPage = ref<number>(1);
const users = ref<AccountData[] | undefined>(undefined);
const searchInput = ref<string>("");
const usersCount = ref<number>(0);
const numberOfPages = computed<number>((): number => {
  return Math.ceil(usersCount.value / amountForPaging);
});

const onSearchInputChange = (input: string): void => {
  currentPage.value = 1;

  searchInput.value = input;
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
  if (usersError.value) {
    users.value = undefined;
    return;
  }

  if (!usersData.value) return;

  users.value = usersData.value.data.users;
  usersCount.value = usersData.value.data.count;
});

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !users.value && !usersError.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Uživatelé', to: '/panel/users', icon: 'material-symbols:supervisor-account-rounded' },
            { label: role, to: '/panel/users/' + role, active: true },
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
            v-if="checkPermissions(['admin'])"
          />

          <div class="line">
            <div class="section-head">
              <h3>Celkem uživatelů: {{ usersCount }}</h3>
              <p>Zde vidíte uživatele dané role. Použijte vyhledávání pro rychlé filtrování seznamu.</p>
            </div>

            <SearchInput @change="onSearchInputChange" placeholder="Hledat uživatele" />
          </div>

          <div class="users">
            <UsersGrid
              :users="users"
              :action="'edit'"
              :loading="usersPending"
            />
            <Pagination
              class="users-navigation"
              :number-of-pages="numberOfPages"
              v-model="currentPage"
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
