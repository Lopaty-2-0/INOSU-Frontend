<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import Navigation from "~/components/ui/Navigation.vue";
import moment from "moment/moment";
import type {TaskData} from "~/types/tasks";
import {computed, ref, watchEffect} from "vue";
import {navigateTo, useFetch} from "nuxt/app";
import {useLoadingStore} from "~/stores/loading";
import { useAlertsStore } from "~/stores/alerts";
import type {ClassData} from "~/types/classes";
import SearchInput from "~/components/ui/SearchInput.vue";
import Pagination from "~/components/ui/Pagination.vue";
import CardsGrid from "~/components/ui/CardsGrid.vue";
import ActionFooter from "~/components/manage/Footer.vue";

const route = useRoute();
const role = route.params.role as string;
const taskId = route.params.taskId as string;

useHead({
  title: "Panel | Úkol - " + taskId + " - Přiřazení",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const alertsStore = useAlertsStore();
const amountForPaging: number = 6;
const task = ref<TaskData | undefined>(undefined);
const allClasses = ref<ClassData[] | undefined>(undefined);
const selectedClasses = ref<ClassData[]>([]);
const searchInput = ref<string>("");
const currentPage = ref<number>(1);
const classesCount = ref<number>(0);
const submitLoading = ref<boolean>(false);
const numberOfPages = computed<number>((): number => {
  return Math.ceil(classesCount.value / amountForPaging);
});

const onSearchInputChange = (input: string): void => {
  currentPage.value = 1;

  searchInput.value = input;
};

const onItemSelect = (items: ClassData[]): void => {
  selectedClasses.value = items;
};

const resetSelection = (): void => {
  selectedClasses.value = [];
};

const assignToClasses = async (): Promise<void> => {
  if (!selectedClasses.value) {
    alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Vyplňte všechna povinná pole." });
    return;
  }

  submitLoading.value = true;

  await $fetch("/api/user_team/add", {
    method: "post",
    body: {
      idTask: taskId,
      idClass: selectedClasses.value.map((classData: ClassData) => classData.id)
    },
    ignoreResponseError: true,
    credentials: "include",
    onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "36010":
        case "36030":
        case "36040":
          alertsStore.addAlert({ type: "error", title: "Přiřazení k úkolu", message: "ID úkolu je špatné." });
          break;
        case "36020":
          alertsStore.addAlert({ type: "error", title: "Přiřazení k úkolu", message: "Žádná třída nebyla vybrána." });
          break;
        case "36050":
          alertsStore.addAlert({ type: "error", title: "Přiřazení k úkolu", message: "Zadaný úkol neexistuje." });
          break;
        case "36060":
          alertsStore.addAlert({ type: "error", title: "Přiřazení k úkolu", message: "Uživatel není garant úkolu." });
          break;
        case "36070":
          alertsStore.addAlert({ type: "warning", title: "Přiřazení k úkolu", message: "Žádnému žákovi nebyl přidělen tento úkol." });
          break;
        case "36081":
          alertsStore.addAlert({ type: "success", title: "Přiřazení k úkolu", message: `Úkol byl přidělen ${response._data.data.goodIds.length} žákům.` });

          resetSelection();
          break;
        default:
          alertsStore.addAlert({ type: "error", title: "Přiřazení k úkolu", message: "Nastala neznámá chyba." });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Přiřazení k úkolu", message: "Nastala neznámá chyba." });
    },
  }).finally((): void => {
    submitLoading.value = false;
  });
};

const { data: classesData, pending: classesPending, error: classesError } = await useFetch("/api/class/get", {
  query: {
    amountForPaging: amountForPaging,
    pageNumber: currentPage,
    searchQuery: searchInput,
  },
  method: "get",
  server: true,
  credentials: "include",
  lazy: true
});

const { data: taskData, error: taskError } = await useFetch("/api/task/get/id", {
  query: {
    idTask: taskId,
  },
  method: "get",
  server: true,
  credentials: "include",
});

watchEffect((): void => {
  if (taskError.value || !taskData.value) {
    navigateTo(`/panel/tasks/${role}`);
    return;
  }

  task.value = taskData.value.data.task;

  if (classesError.value) {
    allClasses.value = [];
    classesCount.value = 0;
    return;
  }

  if (!classesData.value) return;

  allClasses.value = classesData.value.data.classes;
  classesCount.value = classesData.value.data.count;
});

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !task.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Úkoly', to: `/panel/tasks/${role}`, icon: 'material-symbols:folder-copy-rounded' },
            { label: `Úkol ID: ${taskId}`, to: `/panel/tasks/${role}/${taskId}` },
            { label: 'Přiřazení', to: `/panel/tasks/${role}/${taskId}/assign`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content v-if="task">
      <div id="task-assign">
        <Navigation class="navigation" title="Přiřazení" :active-link-id="0" :links="[
          { name: 'Třídy', path: `/panel/tasks/${role}/${taskId}/assign` },
          { name: 'Jednotlivci', path: `/panel/tasks/${role}/${taskId}/assign/individuals` },
          { name: 'Týmy', path: `/panel/tasks/${role}/${taskId}/assign/teams` },
        ]" />

        <div class="content">
          <div class="page-section head">
            <div class="section-head">
              <h3>{{ task.name }}</h3>
              <p>Úkol ID: {{ task.id }}</p>
              <p>Garant: {{ task.guarantor.name }} {{ task.guarantor.surname }}</p>
              <p>Začátek: {{ moment(task.startDate).format("DD.MM. YYYY HH:MM") }}</p>
              <p>Konec: {{ moment(task.endDate).format("DD.MM. YYYY HH:MM") }}</p>
              <p v-if="task.deadline">Uzávěrka: {{ moment(task.deadline).format("DD.MM. YYYY HH:MM") }}</p>
              <p>Max bodů: {{ task.points || "neurčeno" }}</p>
              <p>
                Zadání:
                <a :href="`/api/file/task/${task.id}/${task.task}`" class="link" download target="_blank">
                  {{ task.task }}
                </a>
              </p>
            </div>
          </div>

          <div class="page-section">
            <div class="line">
              <div class="section-head">
                <h3>Vybrané třídy: {{ selectedClasses.length }}</h3>
                <p>Vyberte třídy, kterým chcete úkol přiřadit, a potvrďte změny.</p>
              </div>

              <SearchInput @change="onSearchInputChange" placeholder="Hledat třídy" />
            </div>

            <div class="classes">
              <CardsGrid
                  :items="allClasses || []"
                  :selected-items="selectedClasses"
                  :loading="classesPending"
                  @get:selected-items="onItemSelect"
                  :enable-selection="true"
              >
                <template #content="item">
                  <div class="class">
                    <div class="section-head">
                      <span><span class="name" v-if="item.data.name">{{ item.data.name + " - " }}</span>{{ item.data.specialization }}{{ item.data.grade }}{{ item.data.group }}</span>
                    </div>
                  </div>
                </template>
              </CardsGrid>
            </div>

            <Pagination :number-of-pages="numberOfPages" v-model="currentPage" />
          </div>

          <div class="page-section">
            <ActionFooter :submit-function="assignToClasses" :reset-function="resetSelection" :is-loading="submitLoading" />
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
#task-assign {
  display: flex;
  flex-direction: row;
  gap: 30px;
  position: relative;

  .navigation {
    height: fit-content;
    position: sticky;
    top: 110px;
    min-width: 300px;
    padding: 30px;
  }

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
      flex: 1;
    }

    .link {
      color: rgba(var(--main-color), 1);
      text-decoration: none;
      transition: 0.2s;

      &:hover {
        color: rgba(var(--main-color), 0.8);
      }
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

      p {
        color: rgba(var(--description-color), 1);
        font-size: 16px;
      }

      .update {
        color: rgba(var(--error-color), 1);
      }
    }

    .page-section {
      border-bottom: none;
      display: flex;
      flex-direction: column;
      gap: 30px;

      &.head {
        padding-bottom: 35px;
        border-bottom: 1px solid rgba(var(--border-color), 0.5);
      }
    }

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
        text-decoration: none;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        padding: 60px 30px;
        transition: 0.2s;
        border-radius: var(--normal-border-radius);

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
          background: var(--card-1-hover-background);
        }
      }
    }
  }
}
</style>