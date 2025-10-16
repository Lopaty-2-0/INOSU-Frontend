<script lang="ts" setup>
import EditFormFooter from "~/components/manage/Footer.vue";
import Navbar from "~/components/layout/Navbar.vue";
import {onMounted, ref} from "vue";
import type {ClassData} from "~/types/classes";
import apiFetch from "~/componsables/apiFetch";
import EditClass from "~/components/manage/Class.vue";
import {useRoute, useRouter} from "#app";
import type {TaskData} from "~/types/tasks";
import moment from "moment/moment";
import type {AccountData} from "~/types/account";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import { useAlertsStore } from "~/stores/alerts";
import InputMenu, {type InputMenuItem} from "~/components/ui/InputMenu.vue";

definePageMeta({
  roles: ["teacher"],
});

useHead({
  title: "Panel | Úkoly - Přiřazení",
  meta: [
    { name: "description", content: "Panel Settings User Information" }
  ],
});

const emits = defineEmits(["update"]);

const route = useRoute();
const router = useRouter();
const taskId = route.params.taskId as string;
const alertsStore = useAlertsStore();
const submitLoading = ref<boolean>(false);
const datatable = ref<any>(null);
const allClasses = ref<ClassData[]>([]);
const selectedClasses = ref<number[] | undefined>(undefined);
const selectedUsers = ref<string[]>([]);
const oldSelectedClasses = ref<number[]>([]);
const oldSelectedUsers = ref<string[]>([]);
const task = ref<TaskData | undefined>(undefined);
const editClassComponent = ref<InstanceType<typeof EditClass> | null>(null);
const dropdownItems = ref<InputMenuItem[]>([
  { label: "Třídy", name: "class" },
  { label: "Žáci", name: "student" },
]);
const selectedDropdown = ref<string[]>([]);
const title = computed<string>(() => {
  return dropdownItems.value.find((item: InputMenuItem) => item.name === selectedDropdown.value[0])?.label || "Třídy";
});
const editClass = ref<boolean>(false);
const allStudents = ref<AccountData[] | undefined>(undefined);
const searchInput = ref<string>("");
const cols = ref<{ field: string; title: string; type?: string; width?: string; filter?: boolean; }[]>([
  { field: "id", title: "ID", width: "90px", type: "number" },
  { field: "name", title: "Jméno a přijmení", type: "string" },
  { field: "email", title: "E-mail", type: "string" },
  { field: "abbreviation", title: "Zkratka", type: "date" },
  { field: "createdAt", title: "Vytvořen", type: "string" },
]);

const onClassUpdate = (data: { classes: number[] | undefined }): void => {
  selectedClasses.value = data.classes;
};

const resetSelection = (): void => {
  selectedClasses.value = [...oldSelectedClasses.value];
  selectedUsers.value = [...oldSelectedUsers.value];

  if (editClassComponent.value) editClassComponent.value.reset();
};

const onCheckboxSelect = (): void => {
  if (!datatable.value) return;

  setTimeout((): void => {
    selectedUsers.value = (datatable.value.getSelectedRows() as AccountData[]).map((user: AccountData) => user.id);
  }, 0);
};

const selectUsersInTable = (): void => {
  if (!datatable.value || !allStudents.value) return;

  const selectedIndexes: number[] = allStudents.value.map((user: AccountData, idx: number) => selectedUsers.value.includes(user.id) ? idx : -1).filter(idx => idx !== -1);

  selectedIndexes.forEach((index: number): void => {
    datatable.value.selectRow(index);
  });
};

const assignToTask = async (): Promise<void> => {
  if (selectedDropdown.value[0] && selectedDropdown.value[0] === "class") {
    submitLoading.value = true;

    await apiFetch("/task_class/update", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        idTask: taskId,
        idClass: selectedClasses.value || [],
      }),
      credentials: "include",
      ignoreResponseError: true,
      onResponse({ response }: any) {
        const resCode: string = response._data.resCode?.toString();

        switch (resCode) {
          case "32010":
            alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nebyl zadán id úkolu." });
            break;
          case "32020":
            alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Úkol neexistuje." });
            break;
          case "32030":
            alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nemáte oprávnění." });
            break;
          case "32040":
            alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nebylo nic aktualizováno." });
            break;
          case "32051":
            const badClassIds = response._data.data.badIds || [];
            const goodClassIds = response._data.data.goodIds || [];
            const removedClassIds = response._data.data.removedIds || [];

            if (badClassIds.length > 0) {
              alertsStore.addAlert({
                type: "warning",
                title: "Přiřazení úkolu",
                message: `Úkol byl přiřazen ${goodClassIds.length} třídám. Některé třídy nebylo možné přiřadit. ID tříd: ${badClassIds.join(", ")}`
              });
            } else if (removedClassIds.length > 0) {
              alertsStore.addAlert({
                type: "success",
                title: "Přiřazení úkolu",
                message: `Úkol byl odebrán ${removedClassIds.length} třídám a přiřazen ${goodClassIds.length} třídám.`
              });
            } else {
              alertsStore.addAlert({
                type: "success",
                title: "Přiřazení úkolu",
                message: `Úkol byl úspěšně přiřazen třídám. (${goodClassIds.length})`
              });
            }

            oldSelectedClasses.value = [...(selectedClasses.value || [])];
            resetSelection();
            break;
          default:
            alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nastala neznámá chyba." });
            break;
        }
      },
      onRequestError() {
        alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nastala neznámá chyba při odesílání požadavku." });
      },
    }).finally((): void => {
      submitLoading.value = false;
      return;
    });
  }

  else {
    submitLoading.value = true;

    await apiFetch("/user_task/change", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        idTask: taskId,
        idUser: selectedUsers.value || [],
      }),
      credentials: "include",
      ignoreResponseError: true,
      onResponse({ response }: any) {
        const resCode: string = response._data.resCode?.toString();

        switch (resCode) {
          case "43010":
            alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nebyl zadán id úkolu." });
            break;
          case "43020":
            alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Úkol neexistuje." });
            break;
          case "43030":
            alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Úkol je pouze pro třídy." });
            break;
          case "43040":
            alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nemáte oprávnění." });
            break;
          case "43050":
            alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nebylo nic aktualizováno." });
            break;
          case "43061":
            const badIds = response._data.data.badIds || [];
            const goodIds = response._data.data.goodIds || [];
            const removedIds = response._data.data.removedIds || [];

            if (badIds.length > 0) {
              alertsStore.addAlert({
                type: "warning",
                title: "Přiřazení úkolu",
                message: `Úkol byl přiřazen ${goodIds.length} uživatelům. Někteří uživatelé nebyli nalezeni. ID uživatelů: ${badIds.join(", ")}`
              });
            } else if (removedIds.length > 0) {
              alertsStore.addAlert({
                type: "success",
                title: "Přiřazení úkolu",
                message: `Úkol byl odebrán ${removedIds.length} uživatelům a přiřazen ${goodIds.length} uživatelům.`
              });
            } else {
              alertsStore.addAlert({
                type: "success",
                title: "Přiřazení úkolu",
                message: `Úkol byl úspěšně přiřazen uživatelům. (${goodIds.length})`
              });
            }

            oldSelectedUsers.value = [...(selectedUsers.value || [])];
            resetSelection();
            break;
          default:
            alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nastala neznámá chyba." });
            break;
        }
      },
      onRequestError() {
        alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nastala neznámá chyba při odesílání požadavku." });
      },
    }).finally((): void => {
      submitLoading.value = false;
      return;
    });
  }
};

onMounted(async (): Promise<void> => {
  try {
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

    const taskResponse = await apiFetch(`/task/get/id?idTask=${taskId}`, {
      method: "get",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const taskData = taskResponse.data.task;

    if (!taskData) {
      await router.push(`/panel/tasks/admin`);
      return;
    }

    const classResponse = await apiFetch(`/task_class/get?idTask=${taskId}`, {
      method: "get",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const classData = classResponse.data.classes || [];

    if (classData.length > 0) editClass.value = true;

    const userTaskResponse = await apiFetch(`/user_task/get/idTask?idTask=${taskId}`, {
      method: "get",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const userTaskData = userTaskResponse.data.users || [];

    let studentData: AccountData[];
    if (classData.length <= 0 && !editClass.value) {
      const usersResponse = await apiFetch(`/user/get/role?role=student`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        ignoreResponseError: true,
      });
      studentData = usersResponse.data.users || [];
    } else {
      const classIds: string = JSON.stringify(classData);
      const usersResponse = await apiFetch(`/user_class/get/users?idClass=${classIds}`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        ignoreResponseError: true,
      });
      studentData = usersResponse.data.users || [];
    }

    task.value = taskData;
    selectedClasses.value = classData;
    oldSelectedClasses.value = [...classData];
    selectedUsers.value = userTaskData;
    oldSelectedUsers.value = [...userTaskData];
    allStudents.value = studentData;
  } catch (error) {
    alertsStore.addAlert({ type: "error", title: "Přiřazení úkolu", message: "Nastala neznámá chyba při načítání dat." });
    await router.push(`/panel/tasks/admin`);
  }

  selectUsersInTable();
});

watch(datatable, (val: any): void => {
  if (val) {
    selectUsersInTable();
  }
}, { immediate: true });
</script>

<template>
  <NuxtLayout name="panel" :loading="!allClasses || !task || !allStudents">
    <template #header>
      <Navbar :links="[
        { name: 'Úkoly', path: `/panel/tasks/admin` },
        { name: 'Přiřazení', path: `/panel/tasks/admin/${taskId}/assign` },
      ]" />
    </template>

    <template #content v-if="allClasses && task && allStudents">
      <div id="tasks">
        <div class="content">
          <div class="line page-section">
            <div class="section-head">
              <h3>{{ task.name }}</h3>
              <p>Úkol ID: {{ task.id }}</p>
              <p>Garant ID: {{ task.guarantor }}</p>
              <p>Začátek: {{ moment(task.startDate).format("DD.MM. YYYY HH:MM") }}</p>
              <p>Konec: {{ moment(task.endDate).format("DD.MM. YYYY HH:MM") }}</p>
              <p>Nutné potvrzení: {{ task.approve ? "Ano" : "Ne" }}</p>
              <p>
                Zadání:
                <a :href="`http://89.203.248.163/uploads/tasks/${task.id}/${task.task}`" class="link" download target="_blank">
                  {{ task.task }}
                </a>
              </p>
            </div>
          </div>

          <div class="line page-section" v-if="oldSelectedClasses.length <= 0 && oldSelectedUsers.length <= 0">
            <div class="section-head">
              <h3>Přiřazení pro (třídy/žáky)</h3>
              <p>Zde můžete přiřadit úkol buď celé třídě, nebo jednotlivým žákům. Vyberte požadovanou možnost v rozbalovacím menu níže.</p>
            </div>

            <InputMenu
                :items="dropdownItems"
                :createItem="false"
                :title="title"
                v-model="selectedDropdown"
                placeholder="Vyberte možnost"
            />
          </div>

          <div class="line page-section" v-show="editClass">
            <div class="section-head">
              <h3>
                Třídy
                <span class="update" v-show="JSON.stringify([...(selectedClasses || [])].sort()) !== JSON.stringify([...(oldSelectedClasses || [])].sort())">(aktualizováno)</span>
              </h3>
              <p>Zde můžete upravit přiřazení tříd, kterým bude úkol zadán. Vyberte požadované třídy a potvrďte změny.</p>
            </div>

            <EditClass ref="editClassComponent" :old-class-ids="selectedClasses || []" :classes="allClasses || []" @update="onClassUpdate" />
          </div>

          <div class="line page-section" v-show="!editClass">
            <div class="section-head">
              <h3>
                Žáci
                <span class="update" v-show="JSON.stringify([...(selectedUsers || [])].sort()) !== JSON.stringify([...(oldSelectedUsers || [])].sort())">(aktualizováno)</span>
              </h3>
              <p>Vyberte žáky, kterým chcete úkol přiřadit, a potvrďte změny.</p>
            </div>

            <Vue3Datatable :rows="allStudents" ref="datatable" :columns="cols" :pageSize="10" :sortable="true" :search="searchInput" :hasCheckbox="true" @input="onCheckboxSelect" no-data-content="Žádná data k dispozici">
              <template #name="data">
                <div class="profile">
                  <img :src="'http://89.203.248.163/uploads/profilePictures/' + data.value.profilePicture" alt="User profile photo" loading="lazy"/>
                  <p>{{ data.value.name }} {{ data.value.surname }}</p>
                </div>
              </template>

              <template #abbreviation="data">
                <p class="uppercase">{{ data.value.abbreviation || "Není" }}</p>
              </template>

              <template #createdAt="data">
                <p>{{ moment(data.value.createdAt).format("DD.MM. YYYY HH:MM") }}</p>
              </template>
            </Vue3Datatable>
          </div>

          <EditFormFooter :is-loading="submitLoading" :reset-function="resetSelection" :submit-function="assignToTask">
            Pole označená * jsou povinná
          </EditFormFooter>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
@use "../../../../../assets/style/datatable";

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

    .uppercase {
      text-transform: uppercase;
    }

    .link {
      color: rgba(var(--main-color), 1);
      text-decoration: none;
      transition: 0.2s;

      &:hover {
        color: rgba(var(--main-color), 0.8);
      }
    }

    .profile {
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

      p {
        font-size: 16px;
        color: rgba(var(--description-color), 1);
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

    ::v-deep(.reset-password) {
      flex-direction: column;
    }

    ::v-deep(.section) {
      width: 100%;
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