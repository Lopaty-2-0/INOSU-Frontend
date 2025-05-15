<script lang="ts" setup>
import EditFormFooter from "~/components/users/manage/Footer.vue";
import Alerts from "~/components/Alerts.vue";
import Navbar from "~/components/Navbar.vue";
import { ref, computed } from "vue";
import apiFetch from "~/componsables/apiFetch";
import EditFullName from "~/components/users/manage/FullName.vue";
import EditEmail from "~/components/users/manage/Email.vue";
import EditPassword from "~/components/users/manage/Password.vue";
import EditRole from "~/components/users/manage/Role.vue";
import EditAbbreviation from "~/components/users/manage/Abbreviation.vue";
import EditClass from "~/components/users/manage/Class.vue";
import type {ClassData} from "~/types/classes";
import {useAlertsStore} from "~/stores/alerts";

definePageMeta({
  middleware: ["auth"]
});

useHead({
  title: "Panel | Uživatelé - Přidání",
  meta: [
    { name: "description", content: "Panel Settings User Information" }
  ],
});

const alertsStore = useAlertsStore();
const submitLoading = ref<boolean>(false);
const triggerReset = ref<boolean>(false);
const allRoles = ref<string[] | undefined>(undefined);
const allClasses = ref<ClassData[] | undefined>(undefined);

const oldUserData = computed<{ name: string, surname: string, email: string, password: string, abbreviation: string, role: string, classes: number[]}>(() => ({
  name: "",
  surname: "",
  email: "",
  password: "",
  abbreviation: "",
  role: "",
  classes: [],
}));

const newUserData = ref<{ name: string | undefined, surname: string | undefined, email: string | undefined, password: string | undefined, abbreviation: string | undefined, role: string | undefined, classes: number[] | undefined}>({
  name: undefined,
  surname: undefined,
  email: undefined,
  password: undefined,
  abbreviation: undefined,
  role: undefined,
  classes: undefined,
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

const onClassUpdate = (data: { classes: number[] | undefined }): void => {
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
    classes: undefined,
  };

  triggerReset.value = true;

  setTimeout((): void => {
    triggerReset.value = false;
  }, 100);
};

const createNewUser = async (): Promise<void> => {
  if (!newUserData.value.name || !newUserData.value.surname || !newUserData.value.email || !newUserData.value.password || !newUserData.value.role) {
    alertsStore.addAlert({ type: "error", title: "Přidání uživatele", message: "Vyplňte všechna povinná pole." });
    return;
  }

  submitLoading.value = true;

  await apiFetch("/user/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
    async onResponse({ response }) {
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

await apiFetch("/user/get/roles", {
  method: "get",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  ignoreResponseError: true,
  onResponse({ response }) {
    const roles: string[] = response._data.data.roles;

    allRoles.value = roles || [];
  },
});

await apiFetch("/class/get", {
  method: "get",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  ignoreResponseError: true,
  onResponse({ response }) {
    const classes: ClassData[] = response._data.data.classes;

    allClasses.value = classes || [];
  },
});
</script>

<template>
  <NuxtLayout name="panel" :loading="!allRoles || !allClasses">
    <template #header>
      <Navbar :links="[
        { name: 'Uživatelé', path: '/panel/users' },
        { name: 'Přidání', path: '/panel/users/add' },
      ]" />
    </template>

    <template #content>
      <div id="settings">
        <div class="content">
          <div class="line page-section">
            <EditFullName :old-full-name="{ name: oldUserData.name, surname: oldUserData.surname }" :reset="triggerReset" @update="onFullNameUpdate">
              <div class="section-head">
                <h3>Jméno a příjmení *</h3>
                <p>Změňte své jméno a příjmení</p>
              </div>
            </EditFullName>
          </div>

          <div class="line page-section">
            <EditEmail :old-email="oldUserData.email" :reset="triggerReset" @update="onEmailUpdate">
              <div class="section-head">
                <h3>E-mail * <span class="update" v-show="newUserData.email">(aktualizováno)</span></h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
              </div>
            </EditEmail>
          </div>

          <div class="line page-section">
            <EditPassword type="new" :reset="triggerReset" @update="onPasswordUpdate">
              <div class="section-head">
                <h3>Heslo k účtu * <span class="update" v-show="newUserData.password">(aktualizováno)</span></h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
              </div>
            </EditPassword>
          </div>

          <div class="line page-section">
            <EditRole :roles="allRoles || []" :old-role="oldUserData.role" :reset="triggerReset" @update="onRoleUpdate">
              <div class="section-head">
                <h3>Role * <span class="update" v-show="newUserData.role">(aktualizováno)</span></h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
              </div>
            </EditRole>
          </div>

          <div class="line page-section">
            <EditAbbreviation :full-name="{ name: newUserData.name, surname: newUserData.surname }" :old-abbreviation="oldUserData.abbreviation" :reset="triggerReset" @update="onAbbreviationUpdate">
              <div class="section-head">
                <h3>Přezdívka <span class="update" v-show="newUserData.abbreviation">(aktualizováno)</span></h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
              </div>
            </EditAbbreviation>
          </div>

          <div class="line page-section" >
            <EditClass :old-class-ids="oldUserData.classes" :classes="allClasses || []" :reset="triggerReset" @update="onClassUpdate">
              <div class="section-head">
                <h3>Třída * <span class="update" v-show="newUserData.classes">(aktualizováno)</span></h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
              </div>
            </EditClass>
          </div>

          <EditFormFooter :is-loading="submitLoading" :reset-function="resetUserData" :submit-function="createNewUser">
            Pole označená * jsou povinná
          </EditFormFooter>
        </div>

        <Alerts/>
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

    .page-section {
      border-bottom: 1px solid rgba(var(--border-color), 0.5);
      padding-bottom: 35px;
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

    ::v-deep(.item) {
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
