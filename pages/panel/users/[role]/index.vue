<script setup lang="ts">
import { useRoute } from "vue-router";
import Navbar from "../../../../components/Navbar.vue";
import type { AccountData } from "../../../../types/account";
import { ref, onMounted } from "vue";
import apiFetch from "../../../../componsables/apiFetch";
import ActionBar from "~/components/basics/ActionBar.vue";
import UsersGrid from "../../../../components/users/Grid.vue";
import GridNavigation from "../../../../components/users/Navigation.vue";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const role = route.params.role as string;

useHead({
  title: "Panel | Uživatelé - " + role,
  meta: [{ name: "description", content: "Panel Settings User Information" }],
});

const users = ref<AccountData[] | null>(null);
const numberOfPages = ref<number>(0);
const activePage = ref<number>(0);

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
  },
});
</script>

<template>
  <NuxtLayout name="panel" :loading="!users">
    <template #header>
      <Navbar
        :links="[
          { name: 'Uživatelé', path: '/panel/users' },
          { name: role, path: '/panel/users/' + role },
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
              `/panel/users/${role}/edit`,
              `/panel/users/${role}/remove`,
            ]"
          />

          <div class="line">
            <div class="section-head">
              <h3>Celkem uživatelů: {{ users.length }}</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            </div>
          </div>

          <div class="users">
            <UsersGrid
              :users="users"
              :users-per-page="12"
              :action="'list'"
              :active-page="activePage"
              @get:number-of-pages="(value) => (numberOfPages = value)"
            />
            <GridNavigation
              class="users-navigation"
              :number-of-pages="numberOfPages"
              @get:active-page="(value) => (activePage = value)"
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
</style>
