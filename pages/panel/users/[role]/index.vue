<script setup lang="ts">
import { useRoute } from "vue-router";
import Navbar from "../../../../components/Navbar.vue";
import type {AccountData} from "../../../../types/account";
import { ref, onMounted } from "vue";
import apiFetch from "../../../../componsables/apiFetch";

definePageMeta({
  middleware: ["auth"]
});

const route = useRoute();
const role = route.params.role as string;

useHead({
  title: "Panel | Uživatelé - " + role,
  meta: [
    { name: "description", content: "Panel Settings User Information" }
  ],
});

const users = ref<AccountData[]>([]);

onMounted(async () => {
  await apiFetch(`/user/get/role?role=${encodeURIComponent(role)}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }) {
      console.log(response);
      const usersData: AccountData[] = response._data.data.users;

      users.value = usersData || [];
    },
  });
})
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar :links="[
        { name: 'Uživatelé', path: '/panel/users' },
        { name: role, path: '/panel/users/' + role },
      ]" />
    </template>

    <template #content>
      <div id="users">
        <div class="content">
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
#users {
  display: flex;
  flex-direction: row;
  gap: 30px;
  position: relative;

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 35px;
    position: relative;

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