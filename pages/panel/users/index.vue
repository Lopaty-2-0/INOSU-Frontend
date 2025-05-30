<script lang="ts" setup>
import Alerts from "../../../components/Alerts.vue";
import Navbar from "../../../components/Navbar.vue";
import apiFetch from "~/componsables/apiFetch";

useHead({
  title: "Panel | Uživatelé - role",
  meta: [{name: "description", content: "Panel Settings User Information"}],
});

const numberOfUsers = ref<number>(-1);
const allRoles = ref<string[] | undefined>(undefined);

onMounted(async (): Promise<void> => {
  await apiFetch("/user/get/number", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ignoreResponseError: true,
    onResponse({response}) {
      const users: number = response._data.data.users;

      numberOfUsers.value = users || 0;
    },
  });

  await apiFetch("/user/get/roles", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ignoreResponseError: true,
    onResponse({response}) {
      const roles: string[] = response._data.data.roles;

      allRoles.value = roles || [];
    },
  });
});
</script>

<template>
  <NuxtLayout name="panel" :loading="numberOfUsers < 0 || !allRoles">
    <template #header>
      <Navbar :links="[{ name: 'Uživatelé', path: '/panel/users' }]"/>
    </template>

    <template #content v-if="allRoles">
      <div id="users">
        <div class="content">
          <div class="line">
            <div class="section-head">
              <h3>Celkem uživatelů: {{ numberOfUsers }}</h3>
              <p>Zde najdete souhrn všech registrovaných uživatelů v systému.</p>
            </div>
          </div>

          <div class="roles-section">
            <div class="section-head">
              <h4>Role uživatelů</h4>
            </div>

            <div class="roles">
              <NuxtLink
                  class="role"
                  v-for="role in allRoles"
                  :key="role"
                  :to="`/panel/users/${role}`"
              >
                <div class="section-head">
                  <span>{{
                    role === "admin" ? "Administrátoři" : role === "teacher" ? "Učitelé" : role === "student" ? "Studenti" : role.charAt(0).toUpperCase() + role.slice(1)
                  }}</span>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <Alerts/>
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

      .roles-section {
        display: flex;
        flex-direction: column;
        gap: 20px;

        .roles {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 30px;

          .role {
            border-radius: var(--normal-border-radius);
            display: flex;
            flex: 1;
            gap: 30px;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: var(--border-width) solid rgba(var(--border-color), 0.5);
            padding: 60px 30px;
            transition: 0.2s;
            cursor: pointer;
            min-width: 200px;
            background: var(--card-1-background);

            span {
              font-weight: 600;
              font-size: 16px;
              color: var(--title-color);
            }

            &:hover,
            &.active {
              background: var(--card-1-hover-background);
            }
          }
        }
      }

      ::v-deep(.section) {
        width: 100%;
      }
    }
  }
</style>