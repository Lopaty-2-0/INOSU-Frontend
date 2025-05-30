<script lang="ts" setup>
import EditFormFooter from "~/components/manage/Footer.vue";
import EditName from "~/components/manage/Name.vue";
import EditNeedApprove from "~/components/manage/NeedApprove.vue";
import EditTaskFile from "~/components/manage/TaskFile.vue";
import EditDateTime from "~/components/manage/DateTime.vue";
import Alerts from "~/components/Alerts.vue";
import Navbar from "~/components/Navbar.vue";
import { ref, computed } from "vue";
import {useRoute} from "#vue-router";
import ActionBar from "~/components/basics/ActionBar.vue";
import apiFetch from "~/componsables/apiFetch";
import { useAlertsStore } from "~/stores/alerts";
import {useAccountStore} from "~/stores/account";

definePageMeta({
});

useHead({
  title: "Panel | Úkol - Přidání",
  meta: [
    { name: "description", content: "Panel Settings User Information" }
  ],
});

definePageMeta({
  roles: ["admin"],
});

const alertsStore = useAlertsStore();
const triggerReset = ref<boolean>(false);
const loading = ref<boolean>(false);
const oldData = computed<{ name: string, needApprove: boolean | null, taskFile: string, startDate: Date | null, endDate: Date | null }>(() => ({
  name: "",
  needApprove: null,
  taskFile: "",
  startDate: null,
  endDate: null
}));
const newData = ref<{ name: string | undefined, needApprove: boolean | undefined, taskFile: File | undefined, startDate: Date | undefined, endDate: Date | undefined }>({
  name: undefined,
  needApprove: undefined,
  taskFile: undefined,
  startDate: undefined,
  endDate: undefined,
});

const onNameUpdate = (name: string): void => {
  newData.value.name = name;
};

const onNeedApproveUpdate = (needApprove: boolean): void => {
  newData.value.needApprove = needApprove;
};

const onTaskFileUpdate = (taskFile: File | undefined): void => {
  newData.value.taskFile = taskFile;
};

const onStartDateUpdate = (startDate: Date | undefined): void => {
  newData.value.startDate = startDate;
};

const onEndDateUpdate = (endDate: Date | undefined): void => {
  newData.value.endDate = endDate;
};

const resetUserData = (): void => {
  newData.value = {
    name: undefined,
    needApprove: undefined,
    taskFile: undefined,
    startDate: undefined,
    endDate: undefined,
  };

  triggerReset.value = true;

  setTimeout((): void => {
    triggerReset.value = false;
  }, 100);
};

const addTask = async (): Promise<void> => {
  if (!newData.value.name || !newData.value.startDate || !newData.value.endDate || !newData.value.taskFile || newData.value.needApprove === undefined) {
    alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Vyplňte všechna povinná pole." });
    return;
  }

  loading.value = true;

  const formData = new FormData();
  formData.append("name", newData.value.name || "");
  formData.append("startDate", newData.value.startDate?.getTime().toString() || "");
  formData.append("endDate", newData.value.endDate?.getTime().toString() || "");
  formData.append("task", newData.value.taskFile || "");
  formData.append("guarantor", useAccountStore().getId || "");
  formData.append("approve", newData.value.needApprove ? "true" : "false");

  await apiFetch("/task/add", {
    method: "post",
    headers: {
      "Accept": "application/json",
    },
    body: formData,
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "26091":
          alertsStore.addAlert({ type: "success", title: "Přidání úkolu", message: "Úkol byl úspěšně vytvořen." });

          resetUserData();

          break;
        case "26010":
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Studenti nemohou vytvářet úkoly." });
          break;
        case "26020":
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Název úkolu nebyl zadán." });
          break;
        case "26030":
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Datum ukončení nebylo zadáno." });
          break;
        case "26040":
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Datum ukončení je neplatné." });
          break;
        case "26050":
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Datum ukončení je před datem začátku." });
          break;
        case "26060":
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Soubor úkolu nebyl zadán." });
          break;
        case "26070":
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Neplatný formát souboru." });
          break;
        case "26080":
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Nebyla zadána hodnota schválení." });
          break;
        default:
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Nastala neznámá chyba." });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Nastala neznámá chyba při odesílání požadavku." });
    },
  }).finally((): void => {
    loading.value = false;
  });
};
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar :links="[
        { name: 'Úkoly', path: `/panel/tasks/admin` },
        { name: 'Přidání', path: `/panel/tasks/admin/add` },
      ]" />
    </template>

    <template #content>
      <div id="tasks">
        <div class="content">
          <ActionBar
            class="action-bar"
            description="Správa úkolů"
            :texts="['Přidat', 'Odebrat']"
            :actions="['add', 'remove']"
            :icons="[
              'material-symbols:add-rounded',
              'material-symbols:delete-rounded',
            ]"
            :active="0"
            :navigate-to="[
              `/panel/tasks/admin/add`,
              `/panel/tasks/admin/remove`,
            ]"
          />

          <div class="line page-section">
            <EditName :old-name="oldData.name" :reset="triggerReset" @update="onNameUpdate">
              <div class="section-head">
                <h3>Název * <span class="update" v-show="newData.name">(aktualizováno)</span></h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquam consequatur mollitia officiis placeat!</p>
              </div>
            </EditName>
          </div>

          <div class="line page-section">
            <EditTaskFile @update="onTaskFileUpdate" :reset="triggerReset" :old-check="oldData.taskFile">
              <div class="section-head">
                <h3>Zadání * <span class="update" v-show="newData.taskFile">(aktualizováno)</span></h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquam consequatur mollitia officiis placeat!</p>
              </div>
            </EditTaskFile>
          </div>

          <div class="line page-section">
            <div class="section-head">
              <h3>Časové rozmezí úkolu *</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquam consequatur mollitia officiis placeat!</p>
            </div>

            <div class="line">
              <EditDateTime @update="onStartDateUpdate" :reset="triggerReset" :old-date="oldData.startDate" label="Začátek úkolu" />
              <EditDateTime @update="onEndDateUpdate" :reset="triggerReset" :old-date="oldData.endDate" label="Konec úkolu" />
            </div>
          </div>

          <div class="line page-section">
            <EditNeedApprove @update="onNeedApproveUpdate" :reset="triggerReset" :old-check="oldData.needApprove">
              <div class="section-head">
                <h3>Nutné schválení * <span class="update" v-show="newData.needApprove !== undefined">(aktualizováno)</span></h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquam consequatur mollitia officiis placeat!</p>
              </div>
            </EditNeedApprove>
          </div>

          <EditFormFooter :is-loading="loading" :reset-function="resetUserData" :submit-function="addTask">
            Pole označená * jsou povinná
          </EditFormFooter>
        </div>

        <Alerts/>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
#tasks {
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

    .error {
      color: rgba(var(--error-color), 1);
      font-size: 16px;
    }

    .page-section {
      border-bottom: 1px solid rgba(var(--border-color), 0.5);
      padding-bottom: 35px;
      display: flex;
      flex-direction: column;
      gap: 30px;

      .line {
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 35px;
        flex-wrap: wrap;

        ::v-deep(.section) {
          flex: 1;
        }
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

    .password-rules {
      display: flex;
      flex-direction: column;
      gap: 10px;

      h4 {
        font-weight: 600;
        font-size: 16px;
        color: var(--title-color);
        margin-top: 10px;
      }

      ul {
        list-style: none;

        li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          color: rgba(var(--description-color), 1);
          margin-bottom: 10px;

          .icon {
            color: rgba(var(--main-color), 1);
            line-height: 0;
          }
        }

        p {
          display: flex;
          align-items: center;
          gap: 5px;

          .icon {
            padding-left: 5px;
            color: rgba(var(--success-color), 1);
          }
        }
      }
    }
  }
}

@media (max-width: 1055px) {
  #tasks {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
