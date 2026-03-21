<script lang="ts" setup>
import EditFormFooter from "~/components/manage/Footer.vue";
import Navbar from "~/components/layout/Navbar.vue";
import {ref, computed, useTemplateRef} from "vue";
import EditFullName from "../../../components/manage/FullName.vue";
import EditEmail from "../../../components/manage/Email.vue";
import EditPassword from "../../../components/manage/Password.vue";
import EditRole from "../../../components/manage/Role.vue";
import EditAbbreviation from "../../../components/manage/Abbreviation.vue";
import EditClass from "../../../components/manage/Class.vue";
import {useAlertsStore} from "~/stores/alerts";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import { useI18n } from "#imports";

definePageMeta({
  roles: ["admin"],
});

const { t } = useI18n();

useHead({
  title: t('pages.users.add.title'),
  meta: [
    { name: "description", content: t('pages.users.add.description') }
  ],
});
const alertsStore = useAlertsStore();
const submitLoading = ref<boolean>(false);
const editFullName = useTemplateRef<InstanceType<typeof EditFullName>>("editFullName");
const editEmail = useTemplateRef<InstanceType<typeof EditEmail>>("editEmail");
const editPassword = useTemplateRef<InstanceType<typeof EditPassword>>("editPassword");
const editRole = useTemplateRef<InstanceType<typeof EditRole>>("editRole");
const editAbbreviation = useTemplateRef<InstanceType<typeof EditAbbreviation>>("editAbbreviation");
const editClass = useTemplateRef<InstanceType<typeof EditClass>>("editClass");
const allRoles: string[] = ["admin", "teacher", "student"];

const oldUserData = computed<{ name: string, surname: string, email: string, password: string, abbreviation: string, role: string, classes: number[]}>(() => ({
  name: "",
  surname: "",
  email: "",
  password: "",
  abbreviation: "",
  role: "",
  classes: [],
}));

const newUserData = ref<{ name: string | undefined, surname: string | undefined, email: string | undefined, password: string | undefined, abbreviation: string | undefined, role: string | undefined, classes: number[]}>({
  name: undefined,
  surname: undefined,
  email: undefined,
  password: undefined,
  abbreviation: undefined,
  role: undefined,
  classes: [],
});

const onFullNameUpdate = (fullName: { name: string | undefined, surname: string | undefined }): void => {
  newUserData.value.name = fullName.name;
  newUserData.value.surname = fullName.surname;
};

const onEmailUpdate = (data: { email: string | undefined }): void => {
  newUserData.value.email = data.email;
};

const onPasswordUpdate = (data: { password: string | undefined }): void => {
  newUserData.value.password = data.password;
};

const onAbbreviationUpdate = (data: { abbreviation: string | undefined }): void => {
  newUserData.value.abbreviation = data.abbreviation;
};

const onRoleUpdate = (data: { role: string | undefined }): void => {
  newUserData.value.role = data.role;
};

const onClassUpdate = (data: { classes: number[] }): void => {
  newUserData.value.classes = data.classes;
};

const resetUserData = (): void => {
  newUserData.value = {
    name: undefined,
    surname: undefined,
    email: undefined,
    password: undefined,
    abbreviation: undefined,
    role: undefined,
    classes: [],
  };

  if (editFullName.value) editFullName.value.reset();
  if (editEmail.value) editEmail.value.reset();
  if (editPassword.value) editPassword.value.reset();
  if (editRole.value) editRole.value.reset();
  if (editAbbreviation.value) editAbbreviation.value.reset();
  if (editClass.value) editClass.value.reset();
};

const createNewUser = async (): Promise<void> => {
  if (!newUserData.value.name || !newUserData.value.surname || !newUserData.value.email || !newUserData.value.password || !newUserData.value.role) {
    alertsStore.addAlert({ type: "error", title: t('users.add.alerts.addUser.title'), message: t('users.add.alerts.addUser.fillRequired') });
    return;
  }

  submitLoading.value = true;

  await $fetch("/api/user/add", {
    method: "POST",
    body: {
      name: newUserData.value.name,
      surname: newUserData.value.surname,
      email: newUserData.value.email,
      password: newUserData.value.password,
      abbreviation: newUserData.value.abbreviation,
      role: newUserData.value.role,
      classes: newUserData.value.classes,
    },
    credentials: "include",
    ignoreResponseError: true,
    async onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "1010":
          alertsStore.addAlert({ type: "error", title: t('users.add.alerts.addUser.title'), message: t('users.add.alerts.addUser.noPermission') });
          break;
        case "1020":
          alertsStore.addAlert({ type: "error", title: t('users.add.alerts.addUser.title'), message: t('users.add.alerts.addUser.noName') });
          break;
        case "1030":
          alertsStore.addAlert({ type: "error", title: t('users.add.alerts.addUser.title'), message: t('users.add.alerts.addUser.nameTooLong') });
          break;
        case "1040":
          alertsStore.addAlert({ type: "error", title: t('users.add.alerts.addUser.title'), message: t('users.add.alerts.addUser.noSurname') });
          break;
        case "1050":
          alertsStore.addAlert({ type: "error", title: t('users.add.alerts.addUser.title'), message: t('users.add.alerts.addUser.surnameTooLong') });
          break;
        case "1060":
          alertsStore.addAlert({ type: "error", title: t('users.add.alerts.addUser.title'), message: t('users.add.alerts.addUser.noRole') });
          break;
        case "1070":
          alertsStore.addAlert({ type: "error", title: t('users.add.alerts.addUser.title'), message: t('users.add.alerts.addUser.invalidRole') });
          break;
        case "1080":
          alertsStore.addAlert({ type: "error", title: t('users.add.alerts.addUser.title'), message: t('users.add.alerts.addUser.noPassword') });
          break;
        case "1090":
          alertsStore.addAlert({ type: "error", title: t('users.add.alerts.addUser.title'), message: t('users.add.alerts.addUser.passwordTooShort') });
          break;
        case "1100":
          alertsStore.addAlert({ type: "error", title: t('users.add.alerts.addUser.title'), message: t('users.add.alerts.addUser.noEmail') });
          break;
        case "1110":
          alertsStore.addAlert({ type: "error", title: t('users.add.alerts.addUser.title'), message: t('users.add.alerts.addUser.invalidEmail') });
          break;
        case "1120":
          alertsStore.addAlert({ type: "error", title: t('users.add.alerts.addUser.title'), message: t('users.add.alerts.addUser.emailTooLong') });
          break;
        case "1130":
          alertsStore.addAlert({ type: "error", title: t('users.add.alerts.addUser.title'), message: t('users.add.alerts.addUser.emailInUse') });
          break;
        case "1140":
          alertsStore.addAlert({ type: "error", title: t('users.add.alerts.addUser.title'), message: t('users.add.alerts.addUser.abbreviationInUse') });
          break;
        case "1150":
          alertsStore.addAlert({ type: "error", title: t('users.add.alerts.addUser.title'), message: t('users.add.alerts.addUser.abbreviationTooLong') });
          break;
        case "1161":
          alertsStore.addAlert({ type: "success", title: t('users.add.alerts.addUser.title'), message: t('users.add.alerts.addUser.success') });
          resetUserData();
          break;
        default:
          alertsStore.addAlert({ type: "error", title: t('users.add.alerts.addUser.title'), message: t('users.add.alerts.addUser.unknown') });
          break;
      }
    },
    async onRequestError() {
      alertsStore.addAlert({ type: "error", title: t('users.add.alerts.addUser.title'), message: t('users.add.alerts.addUser.unknown') });
    },
  }).finally((): void => {
    submitLoading.value = false;
  });
};
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: t('sidebar.links.users'), to: '/panel/users', icon: 'material-symbols:supervisor-account-rounded' },
            { label: t('users.add.breadcrumb.add'), to: '/panel/users/add', active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="settings">
        <div class="content">
          <div class="line page-section">
            <EditFullName ref="editFullName" :old-full-name="{ name: oldUserData.name, surname: oldUserData.surname }" @update="onFullNameUpdate">
              <div class="section-head">
                <h3>{{ t('users.add.sections.fullName.title') }}</h3>
                <p>{{ t('users.add.sections.fullName.description') }}</p>
              </div>
            </EditFullName>
          </div>

          <div class="line page-section">
            <EditEmail ref="editEmail" :old-email="oldUserData.email" @update="onEmailUpdate">
              <div class="section-head">
                <h3>{{ t('users.add.sections.email.title') }} <span class="update" v-show="newUserData.email">{{ t('common.updated') }}</span></h3>
                <p>{{ t('users.add.sections.email.description') }}</p>
              </div>
            </EditEmail>
          </div>

          <div class="line page-section">
            <EditPassword ref="editPassword" type="new" @update="onPasswordUpdate">
              <div class="section-head">
                <h3>{{ t('users.add.sections.password.title') }} <span class="update" v-show="newUserData.password">{{ t('common.updated') }}</span></h3>
                <p>{{ t('users.add.sections.password.description') }}</p>
              </div>
            </EditPassword>
          </div>

          <div class="line page-section">
            <EditRole ref="editRole" :roles="allRoles" :old-role="oldUserData.role" @update="onRoleUpdate">
              <div class="section-head">
                <h3>{{ t('users.add.sections.role.title') }} <span class="update" v-show="newUserData.role">{{ t('common.updated') }}</span></h3>
                <p>{{ t('users.add.sections.role.description') }}</p>
              </div>
            </EditRole>
          </div>

          <div class="line page-section">
            <EditAbbreviation ref="editAbbreviation" :full-name="{ name: newUserData.name, surname: newUserData.surname }" :old-abbreviation="oldUserData.abbreviation" @update="onAbbreviationUpdate">
              <div class="section-head">
                <h3>{{ t('users.add.sections.abbreviation.title') }} <span class="update" v-show="newUserData.abbreviation">{{ t('common.updated') }}</span></h3>
                <p>{{ t('users.add.sections.abbreviation.description') }}</p>
              </div>
            </EditAbbreviation>
          </div>

          <div class="line page-section class">
            <div class="section-head">
              <h3>{{ t('users.add.sections.classes.title') }}</h3>
              <p>{{ t('users.add.sections.classes.description') }}</p>
            </div>

            <EditClass ref="editClass" :old-class-ids="oldUserData.classes" @update="onClassUpdate" v-if="newUserData.role === 'student'" />
            <p class="error" v-else>
              {{ t('users.add.sections.classes.roleError') }}
            </p>
          </div>

          <EditFormFooter :is-loading="submitLoading" :reset-function="resetUserData" :submit-function="createNewUser">
            {{ t('users.add.requiredNote') }}
          </EditFormFooter>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
#settings {
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
      gap: 20px;

      &.class {
        gap: 30px;
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

    ::v-deep(.reset-password) {
      flex-direction: column;
    }

    ::v-deep(.section) {
      width: 100%;
    }
  }
}

@media (max-width: 1055px) {
  #settings {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
