<script lang="ts" setup>
import apiFetch from "~/componsables/apiFetch";
import type {ClassData} from "~/types/classes";
import Navbar from "~/components/layout/Navbar.vue";
import Card from "~/components/ui/Card.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import checkPermissions from "~/componsables/checkPermissions";
import ActionBar from "~/components/ui/ActionBar.vue";
import {watchEffect} from "vue";
import {useLoadingStore} from "~/stores/loading";

useHead({
  title: "Panel | Uživatelé - student",
  meta: [{ name: "description", content: "Panel Settings User Information" }],
});

const allClasses = ref<ClassData[] | undefined>(undefined);

onMounted(async (): Promise<void> => {
  await apiFetch("/class/get", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }: any) {
      const classes: ClassData[] = response._data.data.classes;

      allClasses.value = classes || [];
    },
  });
});

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !allClasses.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Uživatelé', to: '/panel/users', icon: 'material-symbols:supervisor-account-rounded' },
            { label: 'student', to: '/panel/users/student', active: true }
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content v-if="allClasses">
      <div id="specializations">
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
              <h3>Celkem tříd: {{ allClasses.length }}</h3>
              <p>Zde vidíte všechny studenty, které můžete filtrovat podle třídy.</p>
            </div>
          </div>

          <div class="classes-section">
            <div class="section-head">
              <h4>Třídy</h4>
              <p class="error message" v-if="allClasses.length <= 0">Žádná třída nebyla nalezena!</p>
            </div>

            <div class="classes">
              <NuxtLink
                class="class"
                v-for="oneClass in allClasses"
                :key="oneClass.id"
                :to="`/panel/users/student/${oneClass.id}`"
              >
                <Card class="card">
                  <div class="section-head">
                    <span><span class="name" v-if="oneClass.name">{{ oneClass.name + " - " }}</span>{{ oneClass.specialization }}{{ oneClass.grade }}{{ oneClass.group }}</span>
                  </div>
                </Card>
              </NuxtLink>

              <NuxtLink class="class" :to="`/panel/users/student/undefined`">
                <Card class="card">
                  <div class="section-head">
                    <span>Nezařazené</span>
                  </div>
                </Card>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
#specializations {
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

      .message {
        font-size: 16px;

        &.error {
          color: rgba(var(--error-color), 1);
        }

        &.success {
          color: rgba(var(--success-color), 1);
        }
      }
    }

    .classes-section {
      display: flex;
      flex-direction: column;
      gap: 20px;

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

          .card {
            width: 100%;
            padding: 30px 0;
            display: flex;
            align-items: center;
            transition: 0.2s;
            justify-content: center;
          }

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
            .card {
              background: var(--card-1-hover-background);
            }
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
