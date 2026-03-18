<script lang="ts" setup>
import EditFormFooter from "~/components/manage/Footer.vue";
import EditName from "~/components/manage/Name.vue";
import EditTaskFile from "~/components/manage/TaskFile.vue";
import EditDateTime from "~/components/manage/DateTime.vue";
import Navbar from "~/components/layout/Navbar.vue";
import {ref, computed, useTemplateRef, watch, watchEffect} from "vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import { useAlertsStore } from "~/stores/alerts";
import {useAccountStore} from "~/stores/account";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import NumberInput from "~/components/ui/NumberInput.vue";
import checkPermissions from "~/componsables/checkPermissions";
import Input from "~/components/ui/Input.vue";
import Pagination from "~/components/ui/Pagination.vue";
import SearchInput from "~/components/ui/SearchInput.vue";
import UsersTable from "~/components/tables/Users.vue";
import type {AccountData} from "~/types/account";
import {navigateTo, useFetch} from "nuxt/app";
import {useLoadingStore} from "~/stores/loading";
import type {TaskData} from "~/types/tasks";
import type {MaturitaData} from "~/types/maturita";
import InputMenu from "~/components/ui/InputMenu.vue";

const route = useRoute();
const maturitaId = route.params.maturitaId as string;
const role = route.params.role as string;

useHead({
  title: "Panel | Maturitní ročník - " + maturitaId + " - Úpravení",
  meta: [
    { name: "description", content: "Panel Settings User Information" }
  ],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const alertsStore = useAlertsStore();
const usersDatatable = useTemplateRef<InstanceType<typeof UsersTable>>("usersDatatable");
const users = ref<AccountData[] | undefined>(undefined);
const usersCount = ref<number>(0);
const selectedRole = ref<string>("teacher");
const currentUsersPage = ref<number>(1);
const searchUsersInput = ref<string>("");
const amountForUsersPaging: number = 5;
const editName = ref<InstanceType<typeof EditName> | null>(null);
const editStartDate = ref<InstanceType<typeof EditDateTime> | null>(null);
const editEndDate = ref<InstanceType<typeof EditDateTime> | null>(null);
const loading = ref<boolean>(false);
const oldData = ref<{ grade: string, endDate: Date | null, startDate: Date | null, maxPoints: number | null; evaluators: number[], loaded: boolean }>({
  grade: "",
  endDate: null,
  startDate: null,
  maxPoints: 0,
  loaded: false,
  evaluators: []
});
const newData = ref<{ grade: string | undefined, endDate: Date | undefined, startDate: Date | undefined, maxPoints: number | null, evaluators: number[] }>({
  grade: undefined,
  endDate: undefined,
  startDate: undefined,
  maxPoints: 0,
  evaluators: []
});
const errors = ref<{ grade: string; endDate: string; startDate: string; maxPoints: string; }>({
  grade: "",
  endDate: "",
  startDate: "",
  maxPoints: "",
});
const numberOfUsersPages = computed<number>((): number => {
  return Math.ceil(usersCount.value / amountForUsersPaging);
});

const onRoleSelectChange = (role: string[]): void => {
  selectedRole.value = role[0] || "teacher";
  currentUsersPage.value = 1;
};

const isEqual = (array1: number[], array2: number[]): boolean => {
  if (array1.length !== array2.length) return false;

  return array1.every((element: number, index: number) => {
    if (!array2[index]) return false;

    return element === array2[index];
  });
};

const onUsersSearchInputChange = (input: string): void => {
  currentUsersPage.value = 1;

  searchUsersInput.value = input;
};

const onUsersRowClicked = (user: AccountData): void => {
  if (!newData.value.evaluators.includes(user.id)) {
    newData.value.evaluators.push(user.id);
  } else {
    newData.value.evaluators = newData.value.evaluators.filter((id: number) => id !== user.id);
  }
};

const onStartDateUpdate = (startDateDate: Date | undefined): void => {
  newData.value.startDate = startDateDate;

  checkForErrors();
};

const onEndDateUpdate = (endDate: Date | undefined): void => {
  newData.value.endDate = endDate;

  checkForErrors();
};

const checkForErrors = (): void => {
  errors.value.grade = newData.value.grade && newData.value.grade.length > 9 ? "Název maturitního ročníku je příliš dlouhý." : "";
  errors.value.maxPoints = newData.value.maxPoints !== null && (isNaN(newData.value.maxPoints) || newData.value.maxPoints < 0) ? "Maximální počet bodů musí být kladné číslo." : "";
};

const resetUserData = (): void => {
  newData.value = {
    grade: oldData.value.grade,
    startDate: undefined,
    endDate: undefined,
    maxPoints: oldData.value.maxPoints,
    evaluators: [...oldData.value.evaluators]
  };

  if (editName.value) editName.value.reset();
  if (editStartDate.value) editStartDate.value.reset();
  if (editEndDate.value) editEndDate.value.reset();
  if (usersDatatable.value) usersDatatable.value.clearSelection();
};

const updateMaturita = async (): Promise<void> => {
  const body = {
    idMaturita: maturitaId,
    grade: newData.value.grade !== oldData.value.grade ? newData.value.grade : undefined,
    startDate:
        newData.value.startDate?.getTime() !== oldData.value.startDate?.getTime()
            ? newData.value.startDate?.getTime()
            : undefined,
    endDate:
        newData.value.endDate?.getTime() !== oldData.value.endDate?.getTime()
            ? newData.value.endDate?.getTime()
            : undefined,
    maxPoints:
        newData.value.maxPoints !== oldData.value.maxPoints
            ? newData.value.maxPoints
            : undefined,
    evaluators:
        newData.value.evaluators !== oldData.value.evaluators
            ? newData.value.evaluators
            : undefined,
  }

  loading.value = true;

  await $fetch("/api/maturita/update", {
    method: "put",
    body: body,
    credentials: "include",
    ignoreResponseError: true,
    async onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "68010":
          alertsStore.addAlert({ type: "error", title: "Úprava maturity", message: "Nemáte oprávnění k této akci." });
          break;

        case "68020":
          alertsStore.addAlert({ type: "error", title: "Úprava maturity", message: "ID maturity nebylo zadáno." });
          break;

        case "68030":
          alertsStore.addAlert({ type: "error", title: "Úprava maturity", message: "Nebyla zadána žádná hodnota ke změně." });
          break;

        case "68040":
          alertsStore.addAlert({ type: "error", title: "Úprava maturity", message: "ID maturity není číslo." });
          break;

        case "68050":
          alertsStore.addAlert({ type: "error", title: "Úprava maturity", message: "ID maturity není platné." });
          break;

        case "68060":
          alertsStore.addAlert({ type: "error", title: "Úprava maturity", message: "Maturita nebyla nalezena." });
          break;

        case "68070":
          alertsStore.addAlert({ type: "error", title: "Úprava maturity", message: "Ročník je příliš dlouhý." });
          break;

        case "68080":
          alertsStore.addAlert({ type: "error", title: "Úprava maturity", message: "Tento ročník již existuje." });
          break;

        case "68090":
          alertsStore.addAlert({ type: "error", title: "Úprava maturity", message: "Maximální počet bodů není číslo." });
          break;

        case "68100":
          alertsStore.addAlert({ type: "error", title: "Úprava maturity", message: "Maximální počet bodů není platný." });
          break;

        case "68110":
          alertsStore.addAlert({ type: "error", title: "Úprava maturity", message: "Datum začátku je neplatné." });
          break;

        case "68120":
          alertsStore.addAlert({ type: "error", title: "Úprava maturity", message: "Datum ukončení je před datem začátku." });
          break;

        case "68130":
          alertsStore.addAlert({ type: "error", title: "Úprava maturity", message: "Datum ukončení je neplatné." });
          break;

        case "68140":
          alertsStore.addAlert({ type: "error", title: "Úprava maturity", message: "Datum ukončení je před datem začátku." });
          break;

        case "68151":
          alertsStore.addAlert({ type: "success", title: "Úprava maturity", message: "Maturita byla úspěšně upravena." });
          await refreshMaturita();
          resetUserData();
          break;

        default:
          alertsStore.addAlert({ type: "error", title: "Úprava maturity", message: "Nastala neznámá chyba." });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Úprava maturity", message: "Nastala neznámá chyba." });
    },
  }).finally((): void => {
    loading.value = false;
  });
};

const { data: maturitaData, error: maturitaError, refresh: refreshMaturita } = useFetch("/api/maturita/get/id", {
  query: {
    id: maturitaId
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
});

const { data: usersData, error: usersError, pending: usersPending } = useFetch("/api/user/get/role", {
  query: {
    role: selectedRole,
    amountForPaging: amountForUsersPaging,
    pageNumber: currentUsersPage,
    searchQuery: searchUsersInput,
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
});

watch([maturitaData, maturitaError], async (): Promise<void> => {
  if (maturitaError.value) {
    await navigateTo(`/panel/maturita`);
    return;
  }

  if (!maturitaData.value) return;

  const maturita: MaturitaData = maturitaData.value.data.maturita;

  oldData.value.grade = maturita.grade;
  newData.value.grade = maturita.grade;
  oldData.value.startDate = maturita.startDate ? new Date(maturita.startDate) : null;
  oldData.value.endDate = maturita.endDate ? new Date(maturita.endDate) : null;
  oldData.value.maxPoints = maturita.maxPoints ?? null;
  newData.value.maxPoints = maturita.maxPoints ?? null;
  oldData.value.evaluators = [...(maturita.evaluators || [])];
  newData.value.evaluators = [...(maturita.evaluators || [])];
  oldData.value.loaded = true;
}, { immediate: true });

watch([usersData, usersError], (): void => {
  if (usersError.value) {
    users.value = undefined;
    return;
  }

  if (!usersData.value) return;

  users.value = usersData.value.data.users;
  usersCount.value = usersData.value.data.count;
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !users.value && !usersError.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Maturity', to: `/panel/maturita/${role}/grade`, icon: 'material-symbols:book-2-rounded' },
            { label: 'Upravení', to: `/panel/maturita/${role}/grade` },
            { label: `Maturita ID: ${maturitaId}`, to: `/panel/maturita/${role}/grade/${maturitaId}/edit`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="grades" v-if="oldData.loaded && users">
        <div class="content">
          <ActionBar
              class="action-bar"
              description="Správa maturitních ročníků"
              :texts="['Přidat', 'Odebrat']"
              :actions="['add', 'remove']"
              :icons="[
              'material-symbols:add-rounded',
              'material-symbols:delete-rounded',
            ]"
            :navigate-to="[
              `/panel/maturita/${role}/grade/add`,
              `/panel/maturita/${role}/grade/remove`,
            ]"
          />
          <div class="page-section">
            <div class="section-head">
              <h3>Ročník <span class="update" v-show="newData.grade !== oldData.grade && errors.grade.length <= 0">(aktualizováno)</span></h3>
              <p>Zadejte název úkolu, který bude jasně vystihovat jeho obsah a účel.</p>
            </div>

            <div class="section-content">
              <label for="grade">Ročník</label>
              <Input type="text" id="grade" placeholder="2024/2025" v-model.trim="newData.grade" @input="checkForErrors" />

              <p class="input-error" v-if="errors.grade.length > 0">{{ errors.grade }}</p>
            </div>
          </div>

          <div class="page-section">
            <div class="section-head">
              <h3>Časové rozmezí úkolu</h3>
              <p>Zadejte časové rozmezí, ve kterém bude úkol aktivní. Studenti budou moci úkol odevzdávat pouze v tomto období. Uzávěrka určuje termín, do kterého lze přiložit vypracování úkolu.</p>
            </div>

            <div class="line">
              <div class="section-content">
                <EditDateTime ref="editStartDate" @update="onStartDateUpdate" :old-date="oldData.startDate" label="Začátek maturity" />

                <p class="input-error" v-if="errors.startDate.length > 0">{{ errors.startDate }}</p>
              </div>

              <div class="section-content">
                <EditDateTime ref="editEndDate" @update="onEndDateUpdate" :old-date="oldData.endDate" label="Konec maturity" />

                <p class="input-error" v-if="errors.endDate.length > 0">{{ errors.endDate }}</p>
              </div>
            </div>
          </div>

          <div class="page-section">
            <div class="section-head">
              <h3>Maximální počet bodů <span class="update" v-show="newData.maxPoints !== oldData.maxPoints && errors.maxPoints.length <= 0">(aktualizováno)</span></h3>
              <p>Zadejte maximální počet bodů, které lze za úkol získat. Tento počet bude použit při hodnocení úkolu.</p>
            </div>

            <div class="section-content">
              <NumberInput v-model="newData.maxPoints" :min="0" placeholder="Bez bodů" @input="checkForErrors" />

              <p class="input-error" v-if="errors.maxPoints.length > 0">{{ errors.maxPoints }}</p>
            </div>
          </div>

          <div class="page-section">
            <div class="line">
              <div class="section-head users">
                <h3>Vybraní hodnotitelé: {{ newData.evaluators.length }} <span class="update" v-show="!isEqual(newData.evaluators, oldData.evaluators)">(aktualizováno)</span></h3>
              </div>

              <SearchInput @change="onUsersSearchInputChange" placeholder="Hledat uživatele" />
            </div>

            <InputMenu :items="['teacher', 'admin']" deselect placeholder="Role uživatelů pro výběr hodnotitelů" @update:model-value="onRoleSelectChange" />

            <UsersTable ref="usersDatatable" @row-clicked="onUsersRowClicked" :has-checkbox="true" :selected-ids="newData.evaluators"  :users="users || []" :loading="usersPending" />

            <Pagination
                class="users-navigation"
                :number-of-pages="numberOfUsersPages"
                v-model="currentUsersPage"
            />
          </div>

          <EditFormFooter :is-loading="loading" :reset-function="resetUserData" :submit-function="updateMaturita">
            Pole označená * jsou povinná
          </EditFormFooter>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
#grades {
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

    .section-content {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;

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
  #grades {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
