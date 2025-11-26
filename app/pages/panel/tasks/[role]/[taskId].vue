<script setup lang="ts">
import moment from "moment";
import {watchEffect} from "vue";
import Navbar from "~/components/layout/Navbar.vue";
import {useLoadingStore} from "~/stores/loading";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import type {TaskData} from "~/types/tasks";

const route = useRoute();
const router = useRouter();
const role = route.params.role as string;
const taskId = route.params.taskId as string;

useHead({
  title: "Panel | Úkoly - " + taskId,
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const task = ref<TaskData | undefined>(undefined);

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
    router.push(`/panel/tasks/${role}`);
    return;
  }

  task.value = taskData.value.data.task;
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
            { label: `Úkol ID: ${taskId}`, to: `/panel/tasks/${role}/${taskId}`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content v-if="task">
      <div id="task">
        <div class="section-head">
          <h3>Úkol: {{ task.name }}</h3>
          <p>Úkol ID: {{ task.id }}</p>
          <p>Garant ID: {{ task.guarantor.id }}</p>
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
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
#task {
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
}
</style>