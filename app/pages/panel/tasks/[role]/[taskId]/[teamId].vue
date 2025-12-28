<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import {ref, watchEffect} from "vue";
import {navigateTo, useFetch} from "nuxt/app";
import {useLoadingStore} from "~/stores/loading";
import { useAlertsStore } from "~/stores/alerts";
import ActionFooter from "~/components/manage/Footer.vue";
import type {TaskTeam} from "~/types/team";
import type {TaskData} from "~/types/tasks";
import moment from "moment";
import Card from "~/components/ui/Card.vue";
import type {AccountData} from "~/types/account";
import Image from "~/components/ui/Image.vue";
import FileInput from "~/components/ui/FileInput.vue";
import NumberInput from "~/components/ui/NumberInput.vue";
import Pagination from "~/components/ui/Pagination.vue";
import Loading from "~/components/ui/Loading.vue";
import Textarea from "~/components/ui/Textarea.vue";
import Editor from "~/components/ui/Editor.vue";

const route = useRoute();
const teamId = route.params.teamId as string;
const role = route.params.role as string;
const taskId = route.params.taskId as string;

useHead({
  title: "Panel | Úkol - " + taskId + " - Přiřazení - Jednotlivci",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const config = useRuntimeConfig();
const alertsStore = useAlertsStore();
const submitLoading = ref<boolean>(false);
const teamTaskData = ref<TaskTeam | undefined>(undefined);
const task = ref<TaskData | undefined>(undefined);
const userData = ref<AccountData | undefined>(undefined);
const teamTaskPoints = ref<number | null>(null);
const versionsLoading = ref<boolean>(false);
const isGuarantorCommentEnabled = ref<boolean>(false);
const guarantorComment = ref<string>("");
const editorEnabledTools = ref<string[]>([
  "bold",
  "underline",
  "strike",
  "italic",
  "blockquote",
  "code-block",
  "link",
  "header",
  "list-ordered",
  "list-bullet",
  "list-check",
  "indentUp",
  "indentDown",
  "align",
  "color",
  "background",
  "clean",
]);

const checkForErrors = (): void => {
};

const updateContent = (content: { html: string }): void => {
  console.log(content.html);
  guarantorComment.value = content.html;
};

const resetInputs = (): void => {
};

const toggleGuarantorCommentEnabled = (): void => {
  isGuarantorCommentEnabled.value = !isGuarantorCommentEnabled.value;
};

const downloadMaterials = async (): Promise<void> => {
  if (!task.value || !task.value.task) {
    alertsStore.addAlert({ type: "error", title: "Stahování souborů", message: "Chyba při stahování materiálů úkolu." });
    return;
  }

  await navigateTo(`${config.public.originUrl}/api/file/task/${task.value.id}/${task.value.task}`, { external: true });
}

const fetchUserData = async (userId: number): Promise<void> => {
  try {
    const response = await $fetch("/api/user/get/id", {
      query: {
        id: userId,
      },
      method: "get",
      credentials: "include",
    });

    if (response && response.data) {
      userData.value = response.data.user;
    }
  } catch (_) {
    userData.value = undefined;
  }
};

const { data: teamData, error: teamError } = await useFetch("/api/team/get/info", {
  query: {
    idTask: taskId,
    idTeam: teamId,
  },
  method: "get",
  server: true,
  credentials: "include",
});

const { data: taskData, error: taskError } = await useFetch("/api/task/get/id", {
  query: {
    idTask: taskId,
  },
  method: "get",
  server: true,
  credentials: "include",
});

watchEffect(async (): Promise<void> => {
  if (taskError.value || !taskData.value) {
    navigateTo(`/panel/tasks/${role}/${taskId}`);
    return;
  }

  task.value = taskData.value.data.task;

  if (teamError.value || !teamData.value) {
    navigateTo(`/panel/tasks/${role}/${taskId}`);
    return;
  }
});

watch(teamData, async (newValue: any): Promise<void> => {
  if (!newValue) return;

  teamTaskData.value = {
    ...newValue.data.team,
    users: newValue.data.users,
  }

  if (newValue.data.users && newValue.data.users.length === 1) {
    await fetchUserData(newValue.data.users[0]);
  }

  if (newValue && typeof newValue.points === "number") {
    teamTaskPoints.value = newValue.points;
  } else {
    teamTaskPoints.value = null;
  }
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !task.value && !taskError.value && !teamError.value && !teamTaskData.value);
});

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", false);
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
            { label: `${teamId}`, to: `/panel/tasks/${role}/${taskId}/${teamId}`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content v-if="teamTaskData && task">
      <div id="team-task">
        <div class="content">
          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>{{ task.name }}</h3>
              <p>Úkol ID: {{ task.id }}</p>
              <p>Garant: {{ task.guarantor.name }} {{ task.guarantor.surname }}</p>
              <p>Začátek: {{ moment(task.startDate).format("DD.MM. YYYY HH:MM") }}</p>
              <p>Konec: {{ moment(task.endDate).format("DD.MM. YYYY HH:MM") }}</p>
              <p v-if="task.deadline">Uzávěrka: {{ moment(task.deadline).format("DD.MM. YYYY HH:MM") }}</p>
              <p v-if="task.points">
                <br>
                Body: {{ teamTaskData.points || "-" }} / {{ task.points }}
              </p>
            </div>

            <Card class="team-card section-head" variant="outlined" v-if="!userData">
              <div class="content">
                <p class="name"><span>{{ teamTaskData.name || "Neurčeno" }}</span></p>
                <p><span>ID:</span> {{ teamTaskData.idTeam }}</p>
                <p><span>Počet členů:</span> {{ (teamTaskData.users || []).length }}</p>
                <p></p>
              </div>
            </Card>

            <div class="user section-head" v-else>
              <span>Student:</span>
              <div class="profile">
                <Image
                  :src="config.public.originUrl + '/api/file/pfp/' + userData.profilePicture"
                  alt="profile-photo"
                  draggable="false"
                />

                <p class="account-name">
                  {{ userData.name + " " + userData.surname }}
                </p>
              </div>
            </div>
          </div>

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>Materiály</h3>
              <p>Zde můžete upravit informace o týmu přiřazeném k úkolu.</p>
            </div>

            <div class="download-input">
              <div class="line">
                <div class="input">
                  {{ task.task }}
                </div>
                <div class="icon-div" @click="downloadMaterials">
                  <Icon class="icon" name="material-symbols:download"/>
                </div>
              </div>
            </div>
          </div>

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>Verze vypracování</h3>
              <p>Zde můžete upravit informace o týmu přiřazeném k úkolu.</p>
            </div>

            <div class="versions" v-show="!versionsLoading">
              <div class="download-input" v-for="i in 3" :key="i">
                <div class="input-div">
                  <span class="label">14:22 27. 10. 2025</span>

                  <div class="line">
                    <div class="input">
                      {{ task.task }}
                    </div>
                    <div class="icon-div" @click="downloadMaterials">
                      <Icon class="icon" name="material-symbols:download"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="versions loading" v-show="versionsLoading">
              <Loading color="rgba(var(--description-color), 1)" size="16px" />
            </div>

            <Pagination :number-of-pages="3" />
          </div>

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>Počet bodů <span class="update" v-if="teamTaskData.points !== teamTaskPoints">(aktualizováno)</span></h3>
              <p>Zde můžete upravit informace o týmu přiřazeném k úkolu.</p>
            </div>

            <div class="content">
              <label for="teamTaskPoints">{{ task.points ? `Maximální počet bodů: ${task.points}` : "Maximální počet bodů není určen." }}</label>
              <NumberInput id="teamTaskPoints" :enable-null="true" placeholder="Zadejte počet bodů" v-model="teamTaskPoints" :min="0" :max="task.points || 0" :disabled="!task.points"  />
            </div>
          </div>

          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>Komentář garanta <span class="update" v-if="guarantorComment && teamTaskData.review !== guarantorComment">(aktualizováno)</span></h3>
              <p>Zde můžete upravit informace o týmu přiřazeném k úkolu.</p>
            </div>

            <div class="guarantor-comment download-input">
              <div class="input-div">
                <span class="label">Poslední úprava: 14:30 27. 10. 2025</span>

                <div class="line">
                  <Editor
                    class="editor"
                    @update:content="updateContent"
                    :content="guarantorComment"
                    :enable="isGuarantorCommentEnabled"
                    placeholder="Zadejte komentář garanta"
                    :enabled-tools="editorEnabledTools"
                  />
                  <div class="icon-div" @click="toggleGuarantorCommentEnabled">
                    <Icon class="icon" name="material-symbols:edit"/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="page-section">
            <ActionFooter :submit-function="() => {}" :reset-function="resetInputs" :is-loading="submitLoading" />
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
#team-task {
  display: flex;
  flex-direction: row;
  gap: 30px;
  position: relative;

  .page-navigation {
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

    .versions {
      display: flex;
      flex-direction: column;
      gap: 20px;

      &.loading {
        justify-content: center;
        align-items: center;
        min-height: 100px;
      }
    }

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

    .download-input {
      &.guarantor-comment {
        .line {
          align-items: flex-start;

          ::v-deep(.editor) {
            flex: 1;
          }
        }
      }

      .input-div {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 10px;

        .label {
          color: var(--mini-title-color);
          font-size: 16px;
        }
      }

      .line {
        gap: 10px;

        .input {
          border-radius: var(--normal-border-radius);
          border: var(--border-width) solid rgba(var(--border-color), 0.5);
          padding: 15px;
          font-size: 16px;
          outline: none;
          background: var(--input-background);
          color: var(--input-color);
          flex: 1;
        }

        .icon-div {
          padding: 15px;
          border: var(--border-width) solid rgba(var(--border-color), 0.5);
          color: var(--btn-2-color);
          background: var(--btn-2-background);
          border-radius: var(--normal-border-radius);
          cursor: pointer;
          transition: 0.2s;
          line-height: 0;
          display: flex;
          justify-content: center;
          align-items: center;

          .icon {
            font-size: 16px;
          }

          &:hover {
            background: var(--btn-2-hover-background);
          }
        }
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

    .team-card {
      padding: 30px;

      .content {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .name {
          font-weight: 800;
        }
      }
    }

    .section-head {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .profile {
        display: flex;
        gap: 10px;
        align-items: center;

        .account-name {
          color: rgba(var(--description-color), 1);
          font-size: 16px;
        }

        ::v-deep(img) {
          width: 45px;
          height: 45px;
          border-radius: var(--small-border-radius);
          object-fit: cover;
        }
      }

      h3 {
        font-weight: 600;
        font-size: 20px;
        color: var(--title-color);
      }

      span {
        color: var(--mini-title-color);
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

      &.bottom-line {
        padding-bottom: 35px;
        border-bottom: 1px solid rgba(var(--border-color), 0.5);
      }

      .content {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .input-error {
          font-size: 16px;
          color: rgba(var(--error-color), 1);
        }

        label {
          color: var(--mini-title-color);
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
        }

        input {
          border-radius: var(--normal-border-radius);
          font-size: 16px;
          outline: none;
          padding: 15px;
          border: var(--border-width) solid rgba(var(--border-color), 0.5);
          min-width: 150px;
          background: var(--input-background);
          color: var(--input-color);

          &:focus {
            border-color: rgba(var(--main-color), 1);
          }

          &.error {
            border-color: rgba(var(--error-color), 1);
          }
        }
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

@media (max-width: 1200px) {
  #task-assign {
    flex-direction: column;
    gap: 30px;

    .page-navigation {
      width: 100%;
      position: relative;
      top: 0;
      min-width: 200px;
    }
  }
}
</style>