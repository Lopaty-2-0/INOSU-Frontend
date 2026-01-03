<script lang="ts" setup>
import Navbar from "../../../components/layout/Navbar.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import checkPermissions from "~/componsables/checkPermissions";
import ActionBar from "~/components/ui/ActionBar.vue";
import {useFetch} from "nuxt/app";
import {watchEffect} from "vue";
import {useLoadingStore} from "~/stores/loading";
import Card from "~/components/ui/Card.vue";

useHead({
  title: "Panel | Uživatelé - role",
  meta: [{name: "description", content: "Panel Settings User Information"}],
});

const numberOfUsers = ref<number>(-1);
const allRoles = ref<string[] | undefined>(undefined);

const {data: usersData} = useFetch("/api/user/get/number", {
  method: "get",
  server: true,
  credentials: "include",
  lazy: true
});

const {data: rolesData, error: rolesError} = useFetch("/api/user/get/roles", {
  method: "get",
  credentials: "include",
  server: true,
  lazy: true
});

watchEffect((): void => {
  if (!rolesData.value) return;
  allRoles.value = rolesData.value.data.roles || [];

  if (!usersData.value) return;
  numberOfUsers.value = usersData.value.data.count || 0;

  useLoadingStore().setLoading("dataLoading", !allRoles.value && !rolesError.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Uživatelé', to: '/panel/users', active: true, icon: 'material-symbols:supervisor-account-rounded' }
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
            :texts="['Přidat']"
            :icons="[
              'material-symbols:add-rounded',
            ]"
              :navigate-to="[
              `/panel/users/add`,
            ]"
              v-if="checkPermissions(['admin'])"
          />

          <div class="line">
            <div class="section-head">
              <h3>Celkem uživatelů: {{ numberOfUsers < 0 ? "nenačteno" : numberOfUsers }}</h3>
              <p>Zde najdete souhrn všech registrovaných uživatelů v systému.</p>
            </div>
          </div>

          <div class="roles-section">
            <div class="section-head">
              <h4>Role uživatelů</h4>
            </div>

            <div class="roles">
              <Card
                  class="role"
                  v-for="role in allRoles"
                  :key="role"
              >
                <NuxtLink :to="`/panel/users/${role}`">
                  <div class="section-head">
                  <span>
                    {{
                      role === "admin" ? "Administrátoři" : role === "teacher" ? "Učitelé" : role === "student" ? "Studenti" : role.charAt(0).toUpperCase() + role.slice(1)
                    }}
                  </span>
                  </div>
                </NuxtLink>
              </Card>
            </div>
          </div>
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
            flex: 1;
            transition: 0.2s;
            cursor: pointer;
            min-width: 200px;

            a {
              padding: 60px 30px;
              display: flex;
              text-decoration: none;
              flex: 1;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }

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
