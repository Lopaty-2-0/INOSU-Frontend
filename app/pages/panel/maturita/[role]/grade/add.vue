<script lang="ts" setup>
import EditFormFooter from "~/components/manage/Footer.vue";
import EditName from "~/components/manage/Name.vue";
import EditDateTime from "~/components/manage/DateTime.vue";
import Navbar from "~/components/layout/Navbar.vue";
import {ref, computed, useTemplateRef, watch, watchEffect} from "vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import { useAlertsStore } from "~/stores/alerts";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import NumberInput from "~/components/ui/NumberInput.vue";
import Input from "~/components/ui/Input.vue";
import Pagination from "~/components/ui/Pagination.vue";
import SearchInput from "~/components/ui/SearchInput.vue";
import UsersTable from "~/components/tables/Users.vue";
import type {AccountData} from "~/types/account";
import {useFetch} from "nuxt/app";
import {useLoadingStore} from "~/stores/loading";
import SelectRole from "~/components/manage/Role.vue";

const { t } = useI18n();

useHead({
  title: t('pages.maturita.gradeAdd.title'),
  meta: [
    { name: "description", content: t('pages.maturita.gradeAdd.description') }
  ],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const route = useRoute();
const role = route.params.role as string;

const alertsStore = useAlertsStore();
const usersDatatable = useTemplateRef<InstanceType<typeof UsersTable>>("usersDatatable");
const selectRole = useTemplateRef<InstanceType<typeof SelectRole>>("selectRole");
const selectedRole = ref<string>("teacher");
const users = ref<AccountData[] | undefined>(undefined);
const usersCount = ref<number>(0);
const selectedUsers = ref<number[]>([]);
const currentUsersPage = ref<number>(1);
const searchUsersInput = ref<string>("");
const amountForUsersPaging: number = 5;
const editName = ref<InstanceType<typeof EditName> | null>(null);
const editStartDate = ref<InstanceType<typeof EditDateTime> | null>(null);
const editEndDate = ref<InstanceType<typeof EditDateTime> | null>(null);
const loading = ref<boolean>(false);
const oldData = computed<{ grade: string, endDate: Date | null, startDate: Date | null, maxPoints: number | null }>(() => ({
  grade: "",
  endDate: null,
  startDate: null,
  maxPoints: 0,
}));
const newData = ref<{ grade: string | undefined, endDate: Date | undefined, startDate: Date | undefined, maxPoints: number | null }>({
  grade: undefined,
  endDate: undefined,
  startDate: undefined,
  maxPoints: 0,
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

const onUsersSearchInputChange = (input: string): void => {
  currentUsersPage.value = 1;

  searchUsersInput.value = input;
};

const onUsersRowClicked = (user: AccountData): void => {
  if (!selectedUsers.value.includes(user.id)) {
    selectedUsers.value.push(user.id);
  } else {
    selectedUsers.value = selectedUsers.value.filter((id: number) => id !== user.id);
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
  if (!newData.value.grade || newData.value.grade.length > 9 || newData.value.grade.length === 0) {
    errors.value.grade = newData.value.grade && newData.value.grade.length > 9
        ? t('maturita.grade.add.errors.nameTooLong')
        : t('maturita.grade.add.errors.nameTooLong');
  } else {
    errors.value.grade = "";
  }

  if (!newData.value.startDate) {
    errors.value.startDate = t('maturita.grade.add.alerts.addMaturita.noStartDate');
  } else {
    errors.value.startDate = "";
  }

  if (!newData.value.endDate) {
    errors.value.endDate = t('maturita.grade.add.alerts.addMaturita.noEndDate');
  } else {
    errors.value.endDate = "";
  }

  if (newData.value.maxPoints === null || isNaN(newData.value.maxPoints) || newData.value.maxPoints < 0) {
    errors.value.maxPoints = t('maturita.grade.add.errors.maxPointsNotPositive');
  } else {
    errors.value.maxPoints = "";
  }
};

const resetUserData = (): void => {
  newData.value = {
    grade: undefined,
    startDate: undefined,
    endDate: undefined,
    maxPoints: 0,
  };

  selectedUsers.value = [];

  if (editName.value) editName.value.reset();
  if (editStartDate.value) editStartDate.value.reset();
  if (editEndDate.value) editEndDate.value.reset();
  if (usersDatatable.value) usersDatatable.value.clearSelection();
};

const onRoleSelect = (data: { role: string }): void => {
  if (!data.role) return;

  selectedRole.value = data.role;
};

const addMaturita = async (): Promise<void> => {
  if (!newData.value.grade || !newData.value.endDate || !newData.value.startDate || newData.value.maxPoints === null) {
    alertsStore.addAlert({ type: "error", title: t('maturita.grade.add.alerts.addMaturita.title'), message: t('maturita.grade.add.alerts.addMaturita.fillRequired') });
    return;
  }

  loading.value = true;

  await $fetch("/api/maturita/add", {
    method: "post",
    body: {
      grade: newData.value.grade,
      startDate: newData.value.startDate?.getTime(),
      endDate: newData.value.endDate?.getTime(),
      maxPoints: newData.value.maxPoints,
      evaluators: selectedUsers.value || [],
    },
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "67010":
          alertsStore.addAlert({ type: "error", title: t('maturita.grade.add.alerts.addMaturita.title'), message: t('common.noPermission') });
          break;

        case "67020":
          alertsStore.addAlert({ type: "error", title: t('maturita.grade.add.alerts.addMaturita.title'), message: t('maturita.grade.add.alerts.addMaturita.noGrade') });
          break;

        case "67030":
          alertsStore.addAlert({ type: "error", title: t('maturita.grade.add.alerts.addMaturita.title'), message: t('maturita.grade.add.alerts.addMaturita.noMaxPoints') });
          break;

        case "67040":
          alertsStore.addAlert({ type: "error", title: t('maturita.grade.add.alerts.addMaturita.title'), message: t('maturita.grade.add.alerts.addMaturita.noStartDate') });
          break;

        case "67050":
          alertsStore.addAlert({ type: "error", title: t('maturita.grade.add.alerts.addMaturita.title'), message: t('maturita.grade.add.alerts.addMaturita.noEndDate') });
          break;

        case "67060":
          alertsStore.addAlert({ type: "error", title: t('maturita.grade.add.alerts.addMaturita.title'), message: t('maturita.grade.add.alerts.addMaturita.nameTooLong') });
          break;

        case "67070":
          alertsStore.addAlert({ type: "error", title: t('maturita.grade.add.alerts.addMaturita.title'), message: t('maturita.grade.add.alerts.addMaturita.gradeExists') });
          break;

        case "67080":
          alertsStore.addAlert({ type: "error", title: t('maturita.grade.add.alerts.addMaturita.title'), message: t('maturita.grade.add.alerts.addMaturita.maxPointsNaN') });
          break;

        case "67090":
          alertsStore.addAlert({ type: "error", title: t('maturita.grade.add.alerts.addMaturita.title'), message: t('maturita.grade.add.alerts.addMaturita.maxPointsInvalid') });
          break;

        case "67100":
          alertsStore.addAlert({ type: "error", title: t('maturita.grade.add.alerts.addMaturita.title'), message: t('maturita.grade.add.alerts.addMaturita.endDateInvalid') });
          break;

        case "67110":
          alertsStore.addAlert({ type: "error", title: t('maturita.grade.add.alerts.addMaturita.title'), message: t('maturita.grade.add.alerts.addMaturita.startDateInvalid') });
          break;

        case "67120":
          alertsStore.addAlert({ type: "error", title: t('maturita.grade.add.alerts.addMaturita.title'), message: t('maturita.grade.add.alerts.addMaturita.endBeforeStart') });
          break;

        case "67131":
          alertsStore.addAlert({ type: "success", title: t('maturita.grade.add.alerts.addMaturita.title'), message: t('maturita.grade.add.alerts.addMaturita.success') });
          resetUserData();
          break;

        case "E10100":
          alertsStore.addAlert({ type: "error", title: t('maturita.grade.add.alerts.addMaturita.title'), message: t('errors.E10100') });
          break;

        default:
          alertsStore.addAlert({ type: "error", title: t('maturita.grade.add.alerts.addMaturita.title'), message: t('common.unknown') });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: t('maturita.grade.add.alerts.addMaturita.title'), message: t('common.unknown') });
    },
  }).finally((): void => {
    loading.value = false;
  });
};

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

watch([usersData, usersError], (): void => {
  if (usersError.value) {
    if (usersError.value?.data?.resCode?.toString() === "E10100") {
      useLoadingStore().setHasRateLimit(true);
      return;
    }
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
            { label: t('sidebar.links.maturitas'), to: `/panel/maturita/${role}/grade`, icon: 'material-symbols:book-2-rounded' },
            { label: t('maturita.grade.add.breadcrumbCreate'), to: `/panel/maturita/${role}/grade/add`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="grades">
        <div class="content">
          <ActionBar
            class="action-bar"
            :description="t('maturita.grade.index.actionBar.description')"
            :texts="[t('actionBar.add'), t('actionBar.remove')]"
            :actions="['add', 'remove']"
            :active="0"
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
              <h3>{{ t('maturita.grade.add.heading') }} * <span class="update" v-show="newData.grade && errors.grade.length <= 0">{{ t('common.updated') }}</span></h3>
              <p>{{ t('maturita.grade.add.nameDescription') }}</p>
            </div>

            <div class="section-content">
              <label for="grade">{{ t('maturita.grade.add.heading') }}</label>
              <Input type="text" id="grade" placeholder="2024/2025" v-model.trim="newData.grade" @input="checkForErrors" />

              <p class="input-error" v-if="errors.grade.length > 0">{{ errors.grade }}</p>
            </div>
          </div>

          <div class="page-section">
            <div class="section-head">
              <h3>{{ t('maturita.grade.add.timeRangeHeading') }}</h3>
              <p>{{ t('maturita.grade.add.timeRangeDescription') }}</p>
            </div>

            <div class="line">
              <div class="section-content">
                <EditDateTime ref="editStartDate" @update="onStartDateUpdate" :old-date="oldData.startDate" :label="t('maturita.grade.add.startLabel')" />

                <p class="input-error" v-if="errors.startDate.length > 0">{{ errors.startDate }}</p>
              </div>

              <div class="section-content">
                <EditDateTime ref="editEndDate" @update="onEndDateUpdate" :old-date="oldData.endDate" :label="t('maturita.grade.add.endLabel')" />

                <p class="input-error" v-if="errors.endDate.length > 0">{{ errors.endDate }}</p>
              </div>
            </div>
          </div>

          <div class="page-section">
            <div class="section-head">
              <h3>{{ t('maturita.grade.add.pointsHeading') }} * <span class="update" v-show="newData.maxPoints !== oldData.maxPoints && errors.maxPoints.length <= 0">{{ t('common.updated') }}</span></h3>
              <p>{{ t('maturita.grade.add.pointsDescription') }}</p>
            </div>

            <div class="section-content">
              <NumberInput v-model="newData.maxPoints" :min="0" :placeholder="t('maturita.grade.add.pointsPlaceholder')" @input="checkForErrors" />

              <p class="input-error" v-if="errors.maxPoints.length > 0">{{ errors.maxPoints }}</p>
            </div>
          </div>

          <div class="page-section">
            <div class="line">
              <div class="section-head users">
                <h3>{{ t('maturita.grade.add.evaluatorsHeading') }}: {{ selectedUsers.length }} <span class="update" v-show="selectedUsers.length > 0">{{ t('common.updated') }}</span></h3>
              </div>

              <SearchInput @change="onUsersSearchInputChange" :placeholder="t('maturita.grade.add.searchPlaceholder')" />
            </div>

            <SelectRole ref="selectRole" :roles="['teacher', 'admin']" :multiple="false" :old-role="selectedRole" @update="onRoleSelect" />

            <UsersTable ref="usersDatatable" @row-clicked="onUsersRowClicked" :has-checkbox="true" :selected-ids="selectedUsers"  :users="users || []" :loading="usersPending" />

            <Pagination
                class="users-navigation"
                :number-of-pages="numberOfUsersPages"
                v-model="currentUsersPage"
            />
          </div>

          <EditFormFooter :is-loading="loading" :reset-function="resetUserData" :submit-function="addMaturita">
            {{ t('maturita.grade.add.requiredNote') }}
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
  }
}

@media (max-width: 1055px) {
  #grades {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
