<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import {onMounted, ref, watchEffect} from "vue";
import Navigation from "~/components/ui/Navigation.vue";
import type {TaskData} from "~/types/tasks";
import {useAccountStore} from "~/stores/account";
import {storeToRefs} from "pinia";
import {computed} from "vue";
import {useFetch} from "nuxt/app";
import Editor from "~/components/ui/Editor.vue";
import Card from "~/components/ui/Card.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import TasksTable from "~/components/tables/Tasks.vue";
import { useLoadingStore } from "~/stores/loading";

useHead({
  title: "Panel | Domů",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

const router = useRouter();
const accountStore = useAccountStore();
const { getRole: role, getId: userId } = storeToRefs(accountStore);
const allTasks = ref<TaskData[] | undefined>(undefined);
const numbers = ref<{ students: number | null; classes: number | null; teachers: number | null }>({
  students: null,
  classes: null,
  teachers: null,
});

const navigationLinks = computed<{
  name: string;
  path?: string | undefined;
  action?: Function | undefined;
}[]>(() => {
  if (["admin", "teacher"].includes(role.value)) {
    return [
      { name: "Vytvořené úkoly", path: `/panel/tasks/${role.value}` },
      { name: "Žáci", path: `/panel/users/student` },
      { name: "Změna hesla", path: `/panel/settings/security` },
    ];
  }

  return [
    { name: "Aktivní úkoly", path: `/panel/tasks/${role.value}` },
    { name: "Učitelé", path: `/panel/users/teacher` },
    { name: "Změna hesla", path: `/panel/settings/security` },
  ];
});
const infoCards = computed<{ title: string; icon: string; value: string | number; }[]>(() =>[
  {
    title: "Počet studentů",
    icon: "material-symbols:supervisor-account-rounded",
    value: numbers.value.students || 0,
  },
  {
    title: "Počet tříd",
    icon: "material-symbols:flight-class-rounded",
    value: numbers.value.classes || 0,
  },
  {
    title: "Počet učitelů",
    icon: "material-symbols:supervisor-account-rounded",
    value: numbers.value.teachers || 0,
  },
]);

const openTask = async (id: number): Promise<void> => {
  if (!id) return;

  await router.push(`/panel/tasks/${role.value}/${id}`);
};

const {data: studentsCount} = useFetch("/api/user/get/count/byRole?role=student", {
  method: "get",
  credentials: "include",
  ignoreResponseError: true,
  lazy: true
});

const {data: teachersCount} = useFetch("/api/user/get/count/byRole?role=teacher", {
  method: "get",
  credentials: "include",
  ignoreResponseError: true,
  lazy: true
});

const {data: classesCount} = useFetch("/api/class/count", {
  method: "get",
  credentials: "include",
  ignoreResponseError: true,
  lazy: true
});

watchEffect((): void => {
  numbers.value = {
    students: studentsCount.value?.data.count ?? null,
    classes: classesCount.value?.data.count ?? null,
    teachers: teachersCount.value?.data.count ?? null,
  };

  useLoadingStore().setLoading("dataLoading", !allTasks.value || numbers.value.students === null || numbers.value.classes === null || numbers.value.teachers === null);
});

onMounted(async (): Promise<void> => {
  if (["admin", "teacher"].includes(role.value)) {
    await $fetch(" /api/task/get/task", {
      query: {
        idUser: userId.value,
        amountForPaging: 5,
        pageNumber: 1,
      },
      method: "get",
      credentials: "include",
      ignoreResponseError: true,
      lazy: true,
      onResponse({response}: any) {
        const tasks: TaskData[] = response._data.data.tasks.slice(0, 5) || [];

        allTasks.value = tasks || [];
      },
    });
  } else {
    await $fetch("/api/user_team/get", {
      query: {
        idUser: userId.value,
        amountForPaging: 5,
        pageNumber: 1,
      },
      method: "get",
      credentials: "include",
      ignoreResponseError: true,
      lazy: true,
      onResponse({response}: any) {
        const userTeams: TaskData[] = response._data.data.user_teams;

        if (!userTeams) return;

        const tasks: TaskData[] = (userTeams.slice(0, 5) || []).map((task: any) => {
          return {
            id: task.idTask,
            ...task
          }
        });

        allTasks.value = tasks || [];
      }
    });
  }
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Domů', to: '/panel', active: true, icon: 'material-symbols:home-rounded' }
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content v-if="allTasks">
      <div id="home">
        <div class="info">
          <div class="line">
            <div class="section-head">
              <h3>Informativní karty</h3>
              <p>Informativní karty slouží k rychlému nalezení zajímavých údajů z panelu.</p>
            </div>
          </div>
          <ul class="cards">
            <Card class="card" v-for="(data, index) in infoCards" :key="index">
              <div class="body">
                <div class="content">
                  <div class="data">
                    <h6>{{ data.title }}</h6>
                    <p>{{ data.value }}</p>
                  </div>

                  <div class="icon-div">
                    <Icon class="icon" :name="data.icon"></Icon>
                  </div>
                </div>
              </div>
            </Card>
          </ul>
        </div>

        <div class="line">
          <Navigation class="navigation" title="Rychlé odkazy" :active-link-id="-1" :links="navigationLinks" />

          <div class="column tasks">
            <div class="line">
              <div class="section-head">
                <h3>{{ ["admin", "teacher"].includes(role) ? "Vytvořené úkoly" : "Rozpracované úkoly" }}</h3>
                <p>{{ ["admin", "teacher"].includes(role) ? "Rychlý přístup do vašich vytvořených úkolů." : "Rychlý přístup do vašich rozpracovaných úkolů." }}</p>
              </div>
            </div>

            <TasksTable :tasks="allTasks" :loading="!allTasks" :page-size="5" :pagination="false">
              <template #actions="data">
                <div class="actions">
                  <button type="button" class="primary" @click="openTask(data.value.id)">Otevřít</button>
                </div>
              </template>
            </TasksTable>
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
#home {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 60px;
  position: relative;

  .section-head {
    display: flex;
    flex-direction: column;
    gap: 10px;

    h3 {
      font-weight: 700;
      font-size: 20px;
      color: var(--title-color);
    }

    p {
      color: rgba(var(--description-color), 1);
      font-size: 16px;
    }
  }

  .link {
    color: rgba(var(--main-color), 1);
    text-decoration: none;
    transition: 0.2s;

    &:hover {
      color: rgba(var(--main-color), 0.8);
    }
  }

  .navigation {
    height: fit-content;
    min-width: 250px;
    padding: 30px;
  }

  .actions {
    display: flex;
    flex-direction: row;
    gap: 10px;

    button {
      padding: 10px 15px;
      border-radius: var(--small-border-radius);
      transition: 0.2s;
      font-size: 16px;
      background: var(--btn-2-background);
      color: var(--btn-2-color);
      border: var(--border-width) solid rgba(var(--border-color), 0.5);
      cursor: pointer;

      &:hover {
        background: var(--btn-2-hover-background);
      }

      &.primary {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        background: var(--btn-1-background);
        color: var(--btn-1-color);

        &:hover {
          background: var(--btn-1-hover-background);
        }
      }
    }
  }

  .line {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 30px;
    width: 100%;
    flex: 1;
  }

  .column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 30px;
    width: 100%;
    flex: 1;
  }

  .tasks {
    min-width: 400px;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 30px;

    .cards {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 30px;
      justify-content: flex-start;

      .card {
        display: flex;
        flex: 1;
        transition: 0.2s;
        cursor: pointer;
        min-width: 200px;
        padding: 30px;

        .body {
          width: 100%;
          gap: 30px;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;

          .content {
            display: flex;
            flex-direction: row;
            gap: 20px;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            flex-wrap: wrap;

            .data {
              display: flex;
              flex-direction: column;
              gap: 20px;
              order: 0;

              h6 {
                color: rgba(var(--description-color), 1);
                font-size: 16px;
                font-weight: 600;
              }

              p {
                color: var(--mini-title-color);
                font-weight: 800;
                font-size: 28px;
              }
            }

            span {
              font-size: 40px;
              color: rgba(var(--description-color), 1);
              order: 1;
            }

            .icon-div {
              width: 50px;
              height: 50px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: var(--small-border-radius);
              background: rgba(var(--main-color), 0.1);

              .icon {
                font-size: 40px;
                color: rgba(var(--main-color), 1);
              }
            }
          }
        }

        &:hover,
        &.active {
          background: var(--card-1-hover-background);
        }
      }
    }
  }
}

@media (max-width: 1250px) {
  #home {
    .navigation {
      flex: 1;
    }

    .tasks {
      min-width: 100%;
    }
  }
}

@media (max-width: 400px) {
  #home .info .cards .card .content .data {
    order: 2;
  }
}
</style>
