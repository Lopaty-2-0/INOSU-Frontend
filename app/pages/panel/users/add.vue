<script lang="ts" setup>
import EditFormFooter from "~/components/manage/Footer.vue";
import Navbar from "~/components/layout/Navbar.vue";
import {ref, computed, watchEffect} from "vue";
import EditFullName from "../../../components/manage/FullName.vue";
import EditEmail from "../../../components/manage/Email.vue";
import EditPassword from "../../../components/manage/Password.vue";
import EditRole from "../../../components/manage/Role.vue";
import EditAbbreviation from "../../../components/manage/Abbreviation.vue";
import EditClass from "../../../components/manage/Class.vue";
import type {ClassData} from "~/types/classes";
import {useAlertsStore} from "~/stores/alerts";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import {useFetch} from "nuxt/app";
import {useLoadingStore} from "~/stores/loading";

definePageMeta({
  roles: ["admin"],
});

useHead({
  title: "Panel | Uživatelé - Přidání",
  meta: [
    { name: "description", content: "Panel Settings User Information" }
  ],
});

const alertsStore = useAlertsStore();
const submitLoading = ref<boolean>(false);
const editFullName = ref<InstanceType<typeof EditFullName> | null>(null);
const editEmail = ref<InstanceType<typeof EditEmail> | null>(null);
const editPassword = ref<InstanceType<typeof EditPassword> | null>(null);
const editRole = ref<InstanceType<typeof EditRole> | null>(null);
const editAbbreviation = ref<InstanceType<typeof EditAbbreviation> | null>(null);
const editClass = ref<InstanceType<typeof EditClass> | null>(null);
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
    alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Vyplňte všechna povinná pole." });
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
        case "1020":
          alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Jméno nebylo zadáno." });
          break;
        case "1030":
          alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Jméno je příliš dlouhé." });
          break;
        case "1040":
          alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Příjmení nebylo zadáno." });
          break;
        case "1050":
          alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Příjmení je příliš dlouhé." });
          break;
        case "1060":
          alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Role nebyla zadána." });
          break;
        case "1070":
          alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Role je příliš dlouhá." });
          break;
        case "1080":
          alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Heslo nebylo zadáno." });
          break;
        case "1090":
          alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Heslo je příliš krátké." });
          break;
        case "1100":
          alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "E-mail nebyl zadán." });
          break;
        case "1110":
          alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Špatný formát e-mailu." });
          break;
        case "1120":
          alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "E-mail je příliš dlouhý." });
          break;
        case "1130":
          alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "E-mail je již používán." });
          break;
        case "1140":
          alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Zkratka je již používána." });
          break;
        case "1150":
          alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Zkratka je příliš dlouhá." });
          break;
        case "1161":
          alertsStore.addAlert({ type: "success", title: "Přidání uživatele", message: "Uživatel byl úspěšně přidán." });
          resetUserData();
          break;
        default:
          alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Nastala neznámá chyba." });
          break;
      }
    },
    async onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Nastala neznámá chyba." });
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
            { label: 'Uživatelé', to: '/panel/users', icon: 'material-symbols:supervisor-account-rounded' },
            { label: 'Přidání', to: '/panel/users/add', active: true },
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
                <h3>Jméno a příjmení *</h3>
                <p>Zadejte jméno a příjmení nového uživatele. Tato pole jsou povinná.</p>
              </div>
            </EditFullName>
          </div>

          <div class="line page-section">
            <EditEmail ref="editEmail" :old-email="oldUserData.email" @update="onEmailUpdate">
              <div class="section-head">
                <h3>E-mail * <span class="update" v-show="newUserData.email">(aktualizováno)</span></h3>
                <p>Zadejte e-mailovou adresu nového uživatele. Toto pole je povinné a musí být ve správném formátu.</p>
              </div>
            </EditEmail>
          </div>

          <div class="line page-section">
            <EditPassword ref="editPassword" type="new" @update="onPasswordUpdate">
              <div class="section-head">
                <h3>Heslo k účtu * <span class="update" v-show="newUserData.password">(aktualizováno)</span></h3>
                <p>Zadejte silné heslo pro nového uživatele. Heslo musí splňovat bezpečnostní požadavky a je povinné.</p>
              </div>
            </EditPassword>
          </div>

          <div class="line page-section">
            <EditRole ref="editRole" :roles="allRoles" :old-role="oldUserData.role" @update="onRoleUpdate">
              <div class="section-head">
                <h3>Role * <span class="update" v-show="newUserData.role">(aktualizováno)</span></h3>
                <p>Vyberte roli, kterou má mít nový uživatel. Toto pole je povinné.</p>
              </div>
            </EditRole>
          </div>

          <div class="line page-section">
            <EditAbbreviation ref="editAbbreviation" :full-name="{ name: newUserData.name, surname: newUserData.surname }" :old-abbreviation="oldUserData.abbreviation" @update="onAbbreviationUpdate">
              <div class="section-head">
                <h3>Přezdívka <span class="update" v-show="newUserData.abbreviation">(aktualizováno)</span></h3>
                <p>Zadejte přezdívku (zkratku) pro nového uživatele. Toto pole je volitelné, ale musí být jedinečné.</p>
              </div>
            </EditAbbreviation>
          </div>

          <div class="line page-section">
            <div class="section-head">
              <h3>Třídy ({{ newUserData.classes.length }}) <span class="update" v-show="newUserData.classes.length > 0">(aktualizováno)</span></h3>
              <p>Vyberte třídy, do kterých bude nový uživatel (student) zařazen. Toto pole je volitelné.</p>
            </div>

            <EditClass ref="editClass" :old-class-ids="oldUserData.classes" @update="onClassUpdate" v-if="newUserData.role === 'student'" />
            <p class="error" v-else>
              Třídy můžete vybírat pouze pokud role uživatele je <strong>student</strong>.
            </p>
          </div>

          <EditFormFooter :is-loading="submitLoading" :reset-function="resetUserData" :submit-function="createNewUser">
            Pole označená * jsou povinná
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
