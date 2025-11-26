<script lang="ts" setup>
import EditFormFooter from "~/components/manage/Footer.vue";
import EditName from "~/components/manage/Name.vue";
import EditTaskFile from "~/components/manage/TaskFile.vue";
import EditDateTime from "~/components/manage/DateTime.vue";
import Navbar from "~/components/layout/Navbar.vue";
import { ref, computed } from "vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import { useAlertsStore } from "~/stores/alerts";
import {useAccountStore} from "~/stores/account";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import NumberInput from "~/components/ui/NumberInput.vue";

useHead({
  title: "Panel | Úkol - Přidání",
  meta: [
    { name: "description", content: "Panel Settings User Information" }
  ],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const route = useRoute();
const role = route.params.role as string;

const alertsStore = useAlertsStore();
const editName = ref<InstanceType<typeof EditName> | null>(null);
const editTaskFile = ref<InstanceType<typeof EditTaskFile> | null>(null);
const editDeadlineDate = ref<InstanceType<typeof EditDateTime> | null>(null);
const editEndDate = ref<InstanceType<typeof EditDateTime> | null>(null);
const loading = ref<boolean>(false);
const oldData = computed<{ name: string, needApprove: boolean | null, taskFile: string, endDate: Date | null, deadline: Date | null, maxPoints: number | null }>(() => ({
  name: "",
  needApprove: null,
  taskFile: "",
  endDate: null,
  deadline: null,
  maxPoints: null,
}));
const newData = ref<{ name: string | undefined, needApprove: boolean | undefined, taskFile: File | undefined, endDate: Date | undefined, deadline: Date | undefined, maxPoints: number | null }>({
  name: undefined,
  needApprove: undefined,
  taskFile: undefined,
  endDate: undefined,
  deadline: undefined,
  maxPoints: null,
});

const onNameUpdate = (name: string): void => {
  newData.value.name = name;
};

const onTaskFileUpdate = (taskFile: File | undefined): void => {
  newData.value.taskFile = taskFile;
};

const onDeadlineDateUpdate = (deadlineDate: Date | undefined): void => {
  newData.value.deadline = deadlineDate;
};

const onEndDateUpdate = (endDate: Date | undefined): void => {
  newData.value.endDate = endDate;
};

const resetUserData = (): void => {
  newData.value = {
    name: undefined,
    needApprove: undefined,
    taskFile: undefined,
    deadline: undefined,
    endDate: undefined,
    maxPoints: null,
  };

  if (editName.value) editName.value.reset();
  if (editTaskFile.value) editTaskFile.value.reset();
  if (editDeadlineDate.value) editDeadlineDate.value.reset();
  if (editEndDate.value) editEndDate.value.reset();
  if (newData.value.maxPoints !== null) newData.value.maxPoints = null;
};

const addTask = async (): Promise<void> => {
  if (!newData.value.name || !newData.value.endDate || !newData.value.taskFile) {
    alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Vyplňte všechna povinná pole." });
    return;
  }

  loading.value = true;

  const formData = new FormData();
  formData.append("name", newData.value.name || "");
  if (newData.value.deadline) formData.append("deadline", newData.value.deadline.getTime().toString());
  formData.append("endDate", newData.value.endDate?.getTime().toString() || "");
  formData.append("task", newData.value.taskFile || "");
  formData.append("guarantor", useAccountStore().getId || "");
  if (newData.value.maxPoints) formData.append("points", newData.value.maxPoints.toString());

  await $fetch("/api/task/add", {
    method: "post",
    body: formData,
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "26131":
          alertsStore.addAlert({ type: "success", title: "Přidání úkolu", message: "Úkol byl úspěšně vytvořen." });

          resetUserData();

          break;
        case "26010":
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Název úkolu nebyl zadán." });
          break;
        case "26020":
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Datum ukončení nebylo zadáno." });
          break;
        case "26030":
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Datum ukončení je neplatné." });
          break;
        case "26040":
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Datum ukončení je před datem začátku." });
          break;
        case "26050":
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Soubor úkolu nebyl zadán." });
          break;
        case "26060":
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Neplatný formát souboru." });
          break;
        case "26070":
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Garant úkolu nebyl zadán." });
          break;
        case "26080":
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Garant úkolu neexistuje nebo nemůže být garant." });
          break;
        case "26090":
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Uzávěrka je před datem začátku." });
          break;
        case "26100":
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Uzávěrka je před datem ukončení." });
          break;
        case "26110":
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Uzávěrka je neplatná." });
          break;
        case "26120":
          alertsStore.addAlert({ type: "error", title: "Přidání úkolu", message: "Maximální počet bodů je neplatný." });
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
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Úkoly', to: `/panel/tasks/${role}`, active: false, icon: 'material-symbols:folder-copy-rounded' },
            { label: 'Přidání', to: `/panel/tasks/${role}/add`, active: true },
          ]"/>
        </template>
      </Navbar>
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
            <EditName ref="editName" :old-name="oldData.name" @update="onNameUpdate">
              <div class="section-head">
                <h3>Název * <span class="update" v-show="newData.name">(aktualizováno)</span></h3>
                <p>Zadejte název úkolu, který bude jasně vystihovat jeho obsah a účel.</p>
              </div>
            </EditName>
          </div>

          <div class="line page-section">
            <EditTaskFile ref="editTaskFile" @update="onTaskFileUpdate" :old-check="oldData.taskFile">
              <div class="section-head">
                <h3>Zadání * <span class="update" v-show="newData.taskFile">(aktualizováno)</span></h3>
                <p>Vyberte soubor se zadáním úkolu, který budou studenti stahovat a podle něj úkol plnit. Povolené formáty: PDF, DOCX, ODT, HTML nebo ZIP.</p>
              </div>
            </EditTaskFile>
          </div>

          <div class="line page-section">
            <div class="section-head">
              <h3>Časové rozmezí úkolu</h3>
              <p>Zadejte časové rozmezí, ve kterém bude úkol aktivní. Studenti budou moci úkol odevzdávat pouze v tomto období. Uzávěrka určuje termín, do kterého lze přiložit vypracování úkolu.</p>
            </div>

            <div class="line">
              <EditDateTime ref="editEndDate" @update="onEndDateUpdate" :old-date="oldData.endDate" label="Konec úkolu *" />
              <EditDateTime ref="editDeadlineDate" @update="onDeadlineDateUpdate" :old-date="oldData.deadline" label="Uzávěrka" />
            </div>
          </div>

          <div class="line page-section">
            <div class="section-head">
              <h3>Maximální počet bodů <span class="update" v-show="newData.maxPoints">(aktualizováno)</span></h3>
              <p>Zadejte maximální počet bodů, které lze za úkol získat. Tento počet bude použit při hodnocení úkolu.</p>
            </div>

            <NumberInput v-model="newData.maxPoints" :min="1" placeholder="Bez bodů" />
          </div>

          <EditFormFooter :is-loading="loading" :reset-function="resetUserData" :submit-function="addTask">
            Pole označená * jsou povinná
          </EditFormFooter>
        </div>
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