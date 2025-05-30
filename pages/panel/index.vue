<script setup lang="ts">
import Navbar from "~/components/Navbar.vue";
import { ref } from "vue";
import apiFetch from "~/componsables/apiFetch";
import moment from "moment";
import Navigation from "~/components/basics/Navigation.vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import type {TaskData} from "~/types/tasks";
import { useAccountStore } from "~/stores/account";
import { storeToRefs } from "pinia";

useHead({
  title: "Panel | Domů",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

const accountStore = useAccountStore();
const { getRole: role, getId: userId } = storeToRefs(accountStore);
const cols = ref<{ field: string; title: string; type?: string; width?: string; filter?: boolean; }[]>([
  { field: "id", title: "ID", width: "90px", type: "number" },
  { field: "name", title: "Název", type: "string" },
  { field: "startDate", title: "Začátek", type: "date" },
  { field: "endDate", title: "Konec", type: "date" },
  { field: "task", title: "Zadání", type: "string" },
  { field: "actions", title: "Akce" },
]);
const allTasks = ref<TaskData[] | undefined>(undefined);
const searchInput = ref<string>("");
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
    { name: "Vyhodnocené úkoly", path: `/panel/tasks/${role.value}/evaluated` },
  ];
});
const infoCards = computed<{ title: string; icon: string; value: string | number; }[]>(() =>[
  {
    title: "Počet studentů",
    icon: "material-symbols:supervisor-account-rounded",
    value: numbers.value.students || -1,
  },
  {
    title: "Počet tříd",
    icon: "material-symbols:flight-class-rounded",
    value: numbers.value.classes || -1,
  },
  {
    title: "Počet učitelů",
    icon: "material-symbols:supervisor-account-rounded",
    value: numbers.value.teachers || -1,
  },
]);

const openTask = async (id: number): Promise<void> => {
  if (!id) return;

  await navigateTo(`/panel/tasks/${role.value}/${id}`);
};

onMounted(async (): Promise<void> => {
  await apiFetch("/user/get/count/by-role?role=student", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }) {
      const count: number = response._data.data.count;

      numbers.value.students = count || null;
    },
  });

  await apiFetch("/user/get/count/by-role?role=teacher", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }) {
      const count: number = response._data.data.count;

      numbers.value.teachers = count || null;
    },
  });

  await apiFetch("/class/count", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }) {
      const count: number = response._data.data.count;

      numbers.value.classes = count || null;
    },
  });

  if (["admin", "teacher"].includes(role.value)) {
    await apiFetch(`/task/get/guarantor?idUser=${userId.value}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      ignoreResponseError: true,
      onResponse({ response }) {
        const tasks: TaskData[] = response._data.data.tasks.slice(0, 5) || [];

        allTasks.value = tasks || [];
      },
    });
    return;
  }

  await apiFetch(`/user_task/get/status?status=${encodeURIComponent(JSON.stringify(["approved"]))}&which=1`, {
    method: "get",
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }) {
      const tasks: TaskData[] = (response._data.data.elaboratingTasks || [])
          .filter((task: any) => !task.review)
          .slice(0, 5)
          .map((task: any) => ({
            ...task,
            id: task.idTask
          })) || [];

      allTasks.value = tasks || [];
    },
  });
})
</script>

<template>
  <NuxtLayout name="panel" :loading="!numbers.students || !numbers.classes || !numbers.teachers || !allTasks">
    <template #header>
      <Navbar
        :links="[
          { name: 'Domů', path: '/panel'},
        ]"
      />
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
            <li class="card" v-for="(data, index) in infoCards" :key="index">
              <div class="content">
                <div class="data">
                  <h6>{{ data.title }}</h6>
                  <p>{{ data.value }}</p>
                </div>

                <Icon class="icon" :name="data.icon"></Icon>
              </div>
            </li>
          </ul>
        </div>

        <div class="line">
          <Navigation class="navigation" title="Rychlé odkazy" :active-link-id="-1" :links="navigationLinks" />

          <div class="line">
            <div class="line">
              <div class="section-head">
                <h3>{{ ["admin", "teacher"].includes(role) ? "Vytvořené úkoly" : "Rozpracované úkoly" }}</h3>
                <p>{{ ["admin", "teacher"].includes(role) ? "Rychlý přístup do vašich vytvořených úkolů." : "Rychlý přístup do vašich rozpracovaných úkolů." }}</p>
              </div>

              <div class="search">
                <input
                  type="text"
                  name="searchInput"
                  placeholder="Hledat úkol"
                  v-model="searchInput"
                />
                <Icon class="icon" name="material-symbols:search-rounded"></Icon>
              </div>
            </div>

            <Vue3Datatable :pageSize="5" :sortable="true" :search="searchInput" :pagination="false" :rows="allTasks" :columns="cols">
              <template #task="data">
                <a :href="`http://89.203.248.163/uploads/tasks/${data.value.id}/${data.value.task}`" class="link" download target="_blank">
                  {{ data.value.task }}
                </a>
              </template>

              <template #startDate="data">
                <p>{{ moment(data.value.startDate).format("DD.MM. YYYY HH:MM") }}</p>
              </template>

              <template #endDate="data">
                <p>{{ moment(data.value.endDate).format("DD.MM. YYYY HH:MM") }}</p>
              </template>

              <template #approve="data">
                <p>{{ data.value.approve ? "Ano" : "Ne" }}</p>
              </template>

              <template #actions="data">
                <div class="actions">
                  <button type="button" class="primary" @click="openTask(data.value.id)">Otevřít</button>
                </div>
              </template>
            </Vue3Datatable>
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
@use "../../assets/style/datatable";

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
        border-radius: var(--normal-border-radius);
        display: flex;
        flex: 1;
        gap: 30px;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        border: var(--border-width) solid rgba(var(--border-color), 0.5);
        padding: 30px;
        transition: 0.2s;
        cursor: pointer;
        min-width: 200px;
        background: var(--card-1-background);

        .icon {
          font-size: 40px;
        }

        &:hover,
        &.active {
          background: var(--card-1-hover-background);
        }

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
        }
      }
    }
  }
}

@media (max-width: 1250px) {
  #home .navigation {
    flex: 1;
  }
}

@media (max-width: 400px) {
  #home .info .cards .card .content .data {
    order: 2;
  }
}
</style>
