<script setup lang="ts">
import Navbar from "~/components/Navbar.vue";
import apiFetch from "~/componsables/apiFetch";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "#vue-router";
import type {TaskData} from "~/types/tasks";
import moment from "moment/moment";
import type {AccountData} from "~/types/account";
import Alerts from "~/components/Alerts.vue";
import { navigateTo } from "nuxt/app";
import EditTaskFile from "~/components/manage/TaskFile.vue";
import EditFormFooter from "~/components/manage/Footer.vue";
import { useAlertsStore } from "~/stores/alerts";

const route = useRoute();
const router = useRouter();
const taskId = route.params.taskId as string;
const userId = route.params.userId as string;

useHead({
  title: "Panel | Vypracování úkolu: " + taskId + " - uživatelem: " + userId,
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin"],
});

const alertsStore = useAlertsStore();
const task = ref<TaskData & { review?: string } | undefined>(undefined);
const elaborator = ref<AccountData | undefined>(undefined);
const guarantor = ref<AccountData | undefined>(undefined);
const taskReviewFile = ref<File | undefined>(undefined);
const loading = ref<boolean>(false);
const lastUploadedReviewFileName = ref<string | undefined>(undefined);
const firstFileName = ref<string | undefined>(undefined);
const triggerReset = ref<boolean>(false);

const reset = (): void => {
  if (task.value) task.value.review = firstFileName.value;
  taskReviewFile.value = undefined;
};

const removeFile = (): void => {
  lastUploadedReviewFileName.value = undefined;
  taskReviewFile.value = undefined;

  if (task.value) {
    task.value.review = undefined;
  }

  triggerReset.value = true;

  setTimeout((): void => {
    triggerReset.value = false;
  }, 100);
};

const submit = async (): Promise<void> => {
  loading.value = true;

  const formData = new FormData();
  formData.append("idTask", taskId);
  formData.append("idUser", userId);
  formData.append("review", taskReviewFile.value || "");

  await apiFetch("/user_task/update", {
    method: "put",
    body: formData,
    credentials: "include",
    ignoreResponseError: true,
    async onResponse({ response }: any) {
      const resCode: string = response._data.resCode?.toString();

      switch (resCode) {
        case "38010":
          alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Nebyl zadán id úkolu." });
          break;
        case "38020":
          alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Uživatel neexistuje." });
          break;
        case "38030":
          alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Úkol neexistuje." });
          break;
        case "38040":
          alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Záznam user_task neexistuje." });
          break;
        case "38050":
          alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Špatný formát souboru (review)." });
          break;
        case "38060":
          alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Nelze provést tuto akci (review lze nahrát jen u schváleného úkolu)." });
          break;
        case "38070":
          alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Název souboru (review) je příliš dlouhý." });
          break;
        case "38080":
          alertsStore.addAlert({ type: "error", title: "Vypracování", message: "Špatný formát souboru (elaboration)." });
          break;
        case "38090":
          alertsStore.addAlert({ type: "error", title: "Vypracování", message: "Název souboru (elaboration) je příliš dlouhý." });
          break;
        case "38100":
          alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Nemáte oprávnění." });
          break;
        case "38111":
          alertsStore.addAlert({ type: "success", title: "Hodnocení", message: "Hodnocení bylo úspěšně aktualizováno." });

          if (task.value) {
            task.value.review = taskReviewFile.value?.name || undefined;
            lastUploadedReviewFileName.value = taskReviewFile.value?.name || undefined;
          }

          taskReviewFile.value = undefined;
          break;
        default:
          alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Nastala neznámá chyba." });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Hodnocení", message: "Nastala chyba při odesílání požadavku." });
    },
  }).finally(() => {
    loading.value = false;
  });
};

const onTaskFileUpdate = (taskFile: File | undefined): void => {
  taskReviewFile.value = taskFile;
};

onMounted(async (): Promise<void> => {
  try {
    await apiFetch(`/user_task/get/idUser/idTask?idTask=${taskId}&idUser=${userId}`, {
      method: "get",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      async onResponse({ response }) {
        const taskData = response._data.data.task;
        const elaboratorData = response._data.data.task.elaborator as AccountData;
        const guarantorData = response._data.data.task.guarantor as AccountData;

        if (!taskData || !elaboratorData || !guarantorData) {
          await router.push(`/panel/tasks/admin`);
          return;
        }

        task.value = {
          ...taskData,
          id: taskData.idTask,
          review: taskData.review,
        };
        firstFileName.value = task.value?.review;
        elaborator.value = elaboratorData;
        guarantor.value = guarantorData;
      }
    });
  } catch {
    await router.push(`/panel/tasks/admin`);
    return;
  }
});
</script>

<template>
  <NuxtLayout name="panel" :loading="!task || !elaborator || !guarantor">
    <template #header>
      <Navbar
          :links="[
          { name: 'Úkoly', path: `/panel/tasks/admin` },
          { name: `Úkol: ${taskId}`, path: `/panel/tasks/admin/${taskId}` },
          { name: `Uživatel: ${userId}`, path: `/panel/tasks/admin/${taskId}/${userId}` },
        ]"
      />
    </template>

    <template #content v-if="task && elaborator && guarantor">
      <div id="task">
        <div class="content">
          <div class="line page-section">
            <div class="section-head">
              <h3>{{ task.name }}</h3>
              <p>Úkol ID: {{ task.id }}</p>
              <p>Garant: {{ guarantor.name }} {{ guarantor.surname }}</p>
              <p>Začátek: {{ moment(task.startDate).format("DD.MM. YYYY HH:MM") }}</p>
              <p>Konec: {{ moment(task.endDate).format("DD.MM. YYYY HH:MM") }}</p>
              <p>Nutné potvrzení: {{ task.approve ? "Ano" : "Ne" }}</p>

              <div class="profile">
                <p>Vypracovává:</p>

                <div class="data">
                  <img :src="'http://89.203.248.163/uploads/profilePictures/' + elaborator.profilePicture" alt="User profile photo" loading="lazy"/>
                  <span>{{ elaborator.name }} {{ elaborator.surname }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="line page-section">
            <div class="section-head">
              <h3>Materiály</h3>
              <div class="line file">
                <a :href="`http://89.203.248.163/uploads/tasks/${task.id}/${task.task}`" class="link" download target="_blank">
                  {{ task.task }}
                </a>
                <a class="icon-div" :href="`http://89.203.248.163/uploads/tasks/${task.id}/${task.task}`" download target="_blank"><Icon class="icon" name="material-symbols:download-2-rounded"></Icon></a>
              </div>
            </div>
          </div>

          <div class="line page-section">
            <div class="section-head">
              <h3>Vypracování</h3>
                <div class="line file" v-if="(task as any).elaboration">
                <a :href="`http://89.203.248.163/uploads/tasks/${task.id}/${elaborator.id}/elaboration/${(task as any).elaboration}`" class="link" download target="_blank">
                  {{ (task as any).elaboration }}
                </a>
                <a class="icon-div" :href="`http://89.203.248.163/uploads/tasks/${task.id}/${elaborator.id}/elaboration/${(task as any).elaboration}`" download target="_blank"><Icon class="icon" name="material-symbols:download-2-rounded"></Icon></a>
              </div>
              <p v-else>
                <span class="error">Uživatel ještě nevypracoval tento úkol.</span>
              </p>
            </div>
          </div>

          <div class="line page-section review">
            <EditTaskFile :reset="triggerReset" :old-task-file="task.review" @update="onTaskFileUpdate">
              <div class="section-head">
                <h3>Hodnocení <span class="update" v-show="taskReviewFile !== undefined">(aktualizováno)</span></h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquam consequatur mollitia officiis placeat!</p>
              </div>
            </EditTaskFile>
            <div class="column">
              <button class="icon-div" @click="removeFile"><Icon class="icon" name="material-symbols:delete"></Icon></button>
              <a v-if="lastUploadedReviewFileName || task.review" class="icon-div" :href="`http://89.203.248.163/uploads/tasks/${task.id}/${elaborator.id}/review/${lastUploadedReviewFileName || task.review}`" download target="_blank">
                <Icon class="icon" name="material-symbols:download-2-rounded"></Icon>
              </a>
            </div>
          </div>

          <EditFormFooter :is-loading="loading" :reset-function="reset" :submit-function="submit">
            Pole označená * jsou povinná
          </EditFormFooter>
        </div>
      </div>
      <Alerts />
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
#task {
  display: flex;
  flex-direction: row;
  gap: 30px;
  position: relative;

  .link {
    padding: 15px;
    border: var(--border-width) solid rgba(var(--border-color), 0.5);
    color: var(--btn-2-color);
    background: var(--btn-2-background);
    border-radius: var(--normal-border-radius);
    text-decoration: none;
    transition: 0.2s;
    font-size: 16px;
    flex: 1;

    &:hover {
      color: rgba(var(--main-color), 0.8);
    }
  }

  .icon-div {
    padding: 15px;
    border-radius: var(--small-border-radius);
    transition: 0.2s;
    font-size: 18px;
    background: var(--btn-2-background);
    color: var(--btn-2-color);
    border: var(--border-width) solid rgba(var(--border-color), 0.5);
    cursor: pointer;
    line-height: 0;

    &:hover {
      background: var(--btn-2-hover-background);
    }
  }

  .uppercase {
    text-transform: uppercase;
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

      &.accept {
        color: var(--actionBar-actions-add-color);
        background: rgba(var(--actionBar-actions-add-background), 1);
        border-color: rgba(var(--actionBar-actions-add-border), 1);

        &:hover {
          background: rgba(var(--actionBar-actions-add-background), 0.8);
        }
      }

      &.deny {
        color: var(--actionBar-actions-remove-color);
        background: rgba(var(--actionBar-actions-remove-background), 1);
        border-color: rgba(var(--actionBar-actions-remove-border), 1);

        &:hover {
          background: rgba(var(--actionBar-actions-remove-background), 0.8);
        }
      }
    }
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
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 30px;
      flex: 1;

      .file {
        gap: 10px;
      }
    }

    .buttons {
      display: flex;
      gap: 10px;

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 5px;
        padding: 10px 15px;
        border-radius: var(--small-border-radius);
        border: var(--border-width) solid transparent;
        transition: 0.2s;
        font-size: 16px;

        &.remove {
          color: var(--actionBar-actions-remove-color);
          background: rgba(var(--actionBar-actions-remove-background), 1);
          border-color: rgba(var(--actionBar-actions-remove-border), 1);

          &:hover {
            background: rgba(var(--actionBar-actions-remove-background), 0.8);
          }
        }

        &.reset {
          background: var(--btn-2-background);
          color: var(--btn-2-color);
          border-color: rgba(var(--border-color), 0.5);

          &:hover {
            background: var(--btn-2-hover-background);
          }
        }

        .icon {
          font-size: 16px;
        }
      }
    }

    .error {
      color: rgba(var(--error-color), 1);
      font-size: 16px;
    }

    .page-section {
      border-bottom: 1px solid rgba(var(--border-color), 0.5);
      padding-bottom: 35px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .section-head {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;

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

    .profile {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;

      p {
        font-size: 16px;
        color: var(--mini-title-color);
        font-weight: 600;
      }

      .data {
        display: flex;
        align-items: center;
        gap: 10px;

        img {
          min-width: 45px;
          min-height: 45px;
          width: 45px;
          height: 45px;
          border-radius: var(--small-border-radius);
          object-fit: cover;
        }

        span {
          font-size: 16px;
          color: rgba(var(--description-color), 1);
        }
      }
    }

    .review {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;

      ::v-deep(.section) {
        flex: 1;
        width: auto;
      }
    }

    .column {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }
}

@media (max-width: 1055px) {
  #task {
    flex-direction: column;
    gap: 30px;
  }
}
</style>