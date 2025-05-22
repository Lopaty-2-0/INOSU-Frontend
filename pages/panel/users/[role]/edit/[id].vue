<script lang="ts" setup>
import EditFormFooter from "~/components/users/manage/Footer.vue";
import Alerts from "~/components/Alerts.vue";
import Navbar from "~/components/Navbar.vue";
import { ref } from "vue";
import apiFetch from "~/componsables/apiFetch";
import EditFullName from "~/components/users/manage/FullName.vue";
import EditEmail from "~/components/users/manage/Email.vue";
import EditPassword from "~/components/users/manage/Password.vue";
import EditRole from "~/components/users/manage/Role.vue";
import EditAbbreviation from "~/components/users/manage/Abbreviation.vue";
import EditClass from "~/components/users/manage/Class.vue";
import type {ClassData} from "~/types/classes";
import {useAlertsStore} from "~/stores/alerts";
import {useRoute, useRouter} from "vue-router";
import type {AccountData} from "../../../../../types/account";
import EditProfilePicture from "~/components/users/manage/ProfilePicture.vue";

definePageMeta({
  middleware: ["auth"]
});

const route = useRoute();
const router = useRouter();
const id: string = route.params.id as string;
const role: string = route.params.role as string;

useHead({
  title: "Panel | Upravení uživatele - " + id,
  meta: [
    { name: "description", content: "Panel Settings User Information" }
  ],
});

const alertsStore = useAlertsStore();
const submitLoading = ref<boolean>(false);
const triggerReset = ref<boolean>(false);
const allRoles = ref<string[] | undefined>(undefined);
const allClasses = ref<ClassData[] | undefined>(undefined);

const oldUserData = ref<{ loaded: boolean, profilePicture: string; name: string, surname: string, email: string, password: string, abbreviation: string, role: string, classes: number[]}>( {
  loaded: false,
  profilePicture: "",
  name: "",
  surname: "",
  email: "",
  password: "",
  abbreviation: "",
  role: "",
  classes: [],
});

const newUserData = ref<{ profilePicture: File | undefined; name: string | undefined, surname: string | undefined, email: string | undefined, password: string | undefined, abbreviation: string | undefined, role: string | undefined, classes: number[] | undefined}>({
  profilePicture: undefined,
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

const onProfilePictureUpdate = (updatedUserData: { profilePicture: File | undefined }): void => {
  newUserData.value.profilePicture = updatedUserData.profilePicture;
};

const resetUserData = (): void => {
  newUserData.value = {
    profilePicture: undefined,
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

const updateUser = async (): Promise<void> => {
  submitLoading.value = true;

  const updateUserForm: FormData = new FormData();

  if (newUserData.value.profilePicture) updateUserForm.append("profilePicture", newUserData.value.profilePicture);
  if (newUserData.value.name) updateUserForm.append("name", newUserData.value.name);
  if (newUserData.value.surname) updateUserForm.append("surname", newUserData.value.surname);
  if (newUserData.value.email) updateUserForm.append("email", newUserData.value.email);
  if (newUserData.value.abbreviation) updateUserForm.append("abbreviation", newUserData.value.abbreviation);
  if (newUserData.value.role) updateUserForm.append("role", newUserData.value.role);
  if (newUserData.value.classes) updateUserForm.append("idClass", JSON.stringify(newUserData.value.classes));
  updateUserForm.append("idUser", id);

  await apiFetch("/user/update", {
    method: "PUT",
    body: updateUserForm,
    credentials: "include",
    ignoreResponseError: true,
    async onResponse({ response }) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "2040":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Nemáte oprávnění k této akci." });
          break;
        case "2050":
          alertsStore.addAlert({ type: "warning", title: "Úprava uživatele", message: "Nic nebylo zadáno ke změně." });
          break;
        case "2060":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Špatné ID uživatele." });
          break;
        case "2070":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Zkratka je již používána." });
          break;
        case "2080":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Zkratka je příliš dlouhá." });
          break;
        case "2090":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Špatný formát e-mailu." });
          break;
        case "2100":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "E-mail je již používán." });
          break;
        case "2110":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "E-mail je příliš dlouhý." });
          break;
        case "2120":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Špatný formát souboru." });
          break;
        case "2131":
          alertsStore.addAlert({ type: "success", title: "Úprava uživatele", message: "Uživatel byl úspěšně upraven." });

          if (newUserData.value.name) oldUserData.value.name = newUserData.value.name;
          if (newUserData.value.surname) oldUserData.value.surname = newUserData.value.surname;
          if (newUserData.value.email) oldUserData.value.email = newUserData.value.email;
          if (newUserData.value.abbreviation) oldUserData.value.abbreviation = newUserData.value.abbreviation;
          if (newUserData.value.role) oldUserData.value.role = newUserData.value.role;
          if (newUserData.value.classes) oldUserData.value.classes = newUserData.value.classes;
          if (newUserData.value.profilePicture) {
            oldUserData.value.profilePicture = URL.createObjectURL(newUserData.value.profilePicture);
          }

          resetUserData();
          break;
        default:
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Nastala neznámá chyba." });
          break;
      }
    },
    async onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Nastala neznámá chyba." });
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

await apiFetch(`/user/get/id?id=${encodeURIComponent(id)}`, {
  method: "get",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  ignoreResponseError: true,
  async onResponse({ response }) {
    const user: AccountData = response._data.data.user;

    if (user) {
      oldUserData.value.name = user.name;
      oldUserData.value.surname = user.surname;
      oldUserData.value.email = user.email;
      oldUserData.value.password = "";
      oldUserData.value.abbreviation = user.abbreviation || "";
      oldUserData.value.role = user.role;
      oldUserData.value.classes = user.idClass;
      oldUserData.value.profilePicture = "http://89.203.248.163/uploads/profilePictures/" + user.profilePicture;
    } else {
      await router.push(`/panel/users/${role}/edit`);
      return;
    }

    oldUserData.value.loaded = true;
  },
})
</script>

<template>
  <NuxtLayout name="panel" :loading="!allRoles || !allClasses || !oldUserData.loaded">
    <template #header>
      <Navbar :links="[
          { name: 'Uživatelé', path: '/panel/users' },
          { name: role, path: '/panel/users/' + role },
          { name: 'Upravení', path: '/panel/users/' + role + '/edit' },
          { name: id, path: '/panel/users/' + role + '/edit' + '/' + id },
      ]" />
    </template>

    <template #content>
      <div id="settings">
        <div class="content">
          <div class="line page-section">
            <EditProfilePicture class="page-section" :old-profile-picture="oldUserData.profilePicture" @update="onProfilePictureUpdate" :reset="triggerReset">
              <div class="section-head">
                <h3>
                  Profilová fotka
                  <span class="update" v-show="newUserData.profilePicture">(aktualizováno)</span>
                </h3>
                <p>Změňte svůj profilový obrázek</p>
              </div>
            </EditProfilePicture>
          </div>

          <div class="line page-section">
            <EditFullName :old-full-name="{ name: oldUserData.name, surname: oldUserData.surname }" :reset="triggerReset" @update="onFullNameUpdate">
              <div class="section-head">
                <h3>Jméno a příjmení</h3>
                <p>Změňte své jméno a příjmení</p>
              </div>
            </EditFullName>
          </div>

          <div class="line page-section">
            <EditEmail :old-email="oldUserData.email" :reset="triggerReset" @update="onEmailUpdate">
              <div class="section-head">
                <h3>E-mail <span class="update" v-show="newUserData.email">(aktualizováno)</span></h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
              </div>
            </EditEmail>
          </div>

          <div class="line page-section">
            <EditPassword type="new" :reset="triggerReset" @update="onPasswordUpdate">
              <div class="section-head">
                <h3>Heslo k účtu <span class="update" v-show="newUserData.password">(aktualizováno)</span></h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
              </div>
            </EditPassword>
          </div>

          <div class="line page-section">
            <EditRole :roles="allRoles || []" :old-role="oldUserData.role" :reset="triggerReset" @update="onRoleUpdate">
              <div class="section-head">
                <h3>Role <span class="update" v-show="newUserData.role">(aktualizováno)</span></h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
              </div>
            </EditRole>
          </div>

          <div class="line page-section">
            <EditAbbreviation :full-name="{ name: newUserData.name ? newUserData.name : oldUserData.name, surname: newUserData.surname ? newUserData.surname : oldUserData.surname }" :old-abbreviation="oldUserData.abbreviation" :reset="triggerReset" @update="onAbbreviationUpdate">
              <div class="section-head">
                <h3>Přezdívka <span class="update" v-show="newUserData.abbreviation">(aktualizováno)</span></h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
              </div>
            </EditAbbreviation>
          </div>

          <div class="line page-section">
            <div class="section-head">
              <h3>Třída <span class="update" v-show="newUserData.classes">(aktualizováno)</span></h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            </div>

            <EditClass :old-class-ids="oldUserData.classes" :classes="allClasses || []" :reset="triggerReset" @update="onClassUpdate" v-if="newUserData.role ? newUserData.role === 'student' : oldUserData.role === 'student'" />
            <p class="error" v-else>
              Třídy můžete vybírat pouze pokud role uživatele je <strong>student</strong>.
            </p>
          </div>

          <EditFormFooter :is-loading="submitLoading" :reset-function="resetUserData" :submit-function="updateUser" />
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
