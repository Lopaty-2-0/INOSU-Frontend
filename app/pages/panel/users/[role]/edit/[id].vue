<script lang="ts" setup>
import EditFormFooter from "~/components/manage/Footer.vue";
import Navbar from "~/components/layout/Navbar.vue";
import {ref, useTemplateRef, watchEffect} from "vue";
import EditFullName from "~/components/manage/FullName.vue";
import EditEmail from "~/components/manage/Email.vue";
import EditPassword from "~/components/manage/Password.vue";
import EditRole from "~/components/manage/Role.vue";
import EditAbbreviation from "~/components/manage/Abbreviation.vue";
import EditClass from "~/components/manage/Class.vue";
import {type Alert, useAlertsStore} from "~/stores/alerts";
import {useRoute, useRouter} from "#app";
import type {AccountData} from "~/types/account";
import EditProfilePicture from "~/components/manage/ProfilePicture.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import {useLoadingStore} from "~/stores/loading";
import {useFetch} from "nuxt/app";
import {useUpload} from "~/componsables/useUploader";

definePageMeta({
  roles: ["admin"],
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

const config = useRuntimeConfig();
const alertsStore = useAlertsStore();
const { progress, upload } = useUpload();
const submitLoading = ref<boolean>(false);
const editProfilePicture = useTemplateRef<InstanceType<typeof EditProfilePicture>>("editProfilePicture");
const editFullName = useTemplateRef<InstanceType<typeof EditFullName>>("editFullName");
const editEmail = useTemplateRef<InstanceType<typeof EditEmail>>("editEmail");
const editPassword = useTemplateRef<InstanceType<typeof EditPassword>>("editPassword");
const editRole = useTemplateRef<InstanceType<typeof EditRole>>("editRole");
const editAbbreviation = useTemplateRef<InstanceType<typeof EditAbbreviation>>("editAbbreviation");
const editClass = useTemplateRef<InstanceType<typeof EditClass>>("editClass");
const allRoles: string[] = ["admin", "teacher", "student"];

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

const onClassUpdate = (data: { classes: number[] }): void => {
  newUserData.value.classes = data.classes;
};

const onProfilePictureUpdate = (updatedUserData: { profilePicture: File | undefined }): void => {
  newUserData.value.profilePicture = updatedUserData.profilePicture;
};

const resetUserData = (): void => {
  if (editProfilePicture.value) editProfilePicture.value.reset();
  if (editFullName.value) editFullName.value.reset();
  if (editEmail.value) editEmail.value.reset();
  if (editPassword.value) editPassword.value.reset();
  if (editRole.value) editRole.value.reset();
  if (editAbbreviation.value) editAbbreviation.value.reset();
  if (editClass.value) editClass.value.reset();

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
};

const updateUser = async (): Promise<void> => {
  submitLoading.value = true;

  await $fetch("/api/user/update", {
    method: "PUT",
    body: {
      idUser: id,
      profilePicture: newUserData.value.profilePicture ? newUserData.value.profilePicture.name : undefined,
      size: newUserData.value.profilePicture ? newUserData.value.profilePicture.size : undefined,
      name: newUserData.value.name,
      surname: newUserData.value.surname,
      email: newUserData.value.email,
      abbreviation: newUserData.value.abbreviation,
      role: newUserData.value.role,
      idClass: newUserData.value.classes ? JSON.stringify(newUserData.value.classes) : undefined,
    },
    credentials: "include",
    ignoreResponseError: true,
    async onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();
      const data: any = response._data.data;

      switch (resCode) {
        case "F15020":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Nahraný soubor je příliš velký." });
          break;
        case "2010":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Nebylo zadáno nic k úpravě." });
          break;
        case "2020":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Špatný formát souboru." });
          break;
        case "2031":
          alertsStore.addAlert({ type: "success", title: "Úprava uživatele", message: "Uživatel byl úspěšně upraven." });
          await refreshUser();
          resetUserData();
          break;
        case "2040":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Nemáte oprávnění k této akci." });
          break;
        case "2050":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "ID uživatele není číslo." });
          break;
        case "2060":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "ID uživatele není platné." });
          break;
        case "2070":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Uživatel nebyl nalezen." });
          break;
        case "2080":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Jméno je příliš dlouhé." });
          break;
        case "2090":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Příjmení je příliš dlouhé." });
          break;
        case "2100":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Zkratka je již používána." });
          break;
        case "2110":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Zkratka je příliš dlouhá." });
          break;
        case "2120":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Špatný formát e-mailu." });
          break;
        case "2130":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "E-mail je již používán." });
          break;
        case "2140":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "E-mail je příliš dlouhý." });
          break;
        case "2150":
          alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Špatný formát souboru." });
          break;
        case "2161":
          if (data.uploadUrl && newUserData.value.profilePicture) {
            const alert: Alert = {
              title: "Nahrávání souboru",
              message: "Probíhá nahrávání souboru...",
              type: "info",
              infinite: true,
              canClose: false,
              progress: progress
            };

            const alertIndex: number = alertsStore.addAlert(alert);

            upload(newUserData.value.profilePicture, data.uploadUrl).then(async (): Promise<void> => {
              alertsStore.removeAlert(alertIndex);
              alertsStore.addAlert({
                title: "Nahrávání souboru",
                message: "Soubor byl úspěšně nahrán.",
                type: "success"
              });

              await $fetch("/api/user/put/pfp", {
                method: "PUT",
                body: {
                  idUser: id,
                  profilePicture: data.user.profilePicture,
                },
                credentials: "include",
                ignoreResponseError: true,
                async onResponse({ response }: any) {
                  const resCode: string = response._data.resCode.toString();

                  switch (resCode) {
                    case "57070":
                      alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Soubor nebyl nalezen na úložišti." });
                      return;
                    case "57081":
                      oldUserData.value.profilePicture = data.user.profilePicture;
                      newUserData.value.profilePicture = undefined;
                      await refreshUser();
                      resetUserData();
                      break;
                    default:
                      alertsStore.addAlert({ type: "error", title: "Úprava uživatele", message: "Nastala neznámá chyba při ukládání." });
                      break;
                  }
                },
              });
            }).catch((): void => {
              alertsStore.removeAlert(alertIndex);
              alertsStore.addAlert({
                title: "Nahrávání souboru",
                message: "Nastala chyba při nahrávání souboru.",
                type: "error"
              });
            });
          }

          alertsStore.addAlert({ type: "success", title: "Úprava uživatele", message: "Uživatel byl úspěšně upraven." });
          if (newUserData.value.name) oldUserData.value.name = newUserData.value.name;
          if (newUserData.value.surname) oldUserData.value.surname = newUserData.value.surname;
          if (newUserData.value.email) oldUserData.value.email = newUserData.value.email;
          if (newUserData.value.abbreviation) oldUserData.value.abbreviation = newUserData.value.abbreviation;
          if (newUserData.value.role) oldUserData.value.role = newUserData.value.role;
          if (newUserData.value.classes) oldUserData.value.classes = newUserData.value.classes;

          await refreshUser();
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

const { data: userData, error: userError, refresh: refreshUser } = useFetch("/api/user/get/id", {
  query: {
    id: id,
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
});

watch([userData, userError], async (): Promise<void> => {
  if (userError.value) {
    router.push(`/panel/users/${role}`);
    return;
  }

  if (!userData.value) return;

  const user: AccountData = userData.value.data.user;

  oldUserData.value.name = user.name;
  oldUserData.value.surname = user.surname;
  oldUserData.value.email = user.email;
  oldUserData.value.password = "";
  oldUserData.value.abbreviation = user.abbreviation || "";
  oldUserData.value.role = user.role;
  oldUserData.value.classes = user.idClass;
  oldUserData.value.profilePicture = config.public.originUrl + "/api/file/pfp/" + user.profilePicture;
  oldUserData.value.loaded = true;
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !oldUserData.value.loaded);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Uživatelé', to: '/panel/users', icon: 'material-symbols:supervisor-account-rounded' },
            { label: role, to: '/panel/users/' + role },
            { label: 'Upravení', to: role === 'student' ? '/panel/users/' + role : '/panel/users/' + role + '/edit' },
            { label: id, to: '/panel/users/' + role + '/edit' + '/' + id, active: true }
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="settings" v-if="oldUserData.loaded">
        <div class="content">
          <div class="line page-section no-border">
            <EditProfilePicture ref="editProfilePicture" class="page-section" :old-profile-picture="oldUserData.profilePicture" @update="onProfilePictureUpdate">
              <div class="section-head">
                <h3>
                  Profilová fotka
                  <span class="update" v-show="newUserData.profilePicture">(aktualizováno)</span>
                </h3>
                <p>Zde můžete změnit profilovou fotku uživatele. Nahrajte novou fotku, pokud si přejete aktualizovat stávající obrázek.</p>
              </div>
            </EditProfilePicture>
          </div>

          <div class="line page-section">
            <EditFullName ref="editFullName" :old-full-name="{ name: oldUserData.name, surname: oldUserData.surname }" @update="onFullNameUpdate">
              <div class="section-head">
                <h3>Jméno a příjmení</h3>
                <p>Zadejte nové jméno a příjmení uživatele, pokud je chcete změnit.</p>
              </div>
            </EditFullName>
          </div>

          <div class="line page-section">
            <EditEmail ref="editEmail" :old-email="oldUserData.email" @update="onEmailUpdate">
              <div class="section-head">
                <h3>E-mail <span class="update" v-show="newUserData.email">(aktualizováno)</span></h3>
                <p>Zadejte novou e-mailovou adresu uživatele, pokud ji chcete změnit.</p>
              </div>
            </EditEmail>
          </div>

          <div class="line page-section">
            <EditPassword ref="editPassword" type="new" @update="onPasswordUpdate">
              <div class="section-head">
                <h3>Heslo k účtu <span class="update" v-show="newUserData.password">(aktualizováno)</span></h3>
                <p>Zadejte nové heslo, pokud chcete uživateli změnit přístupové údaje. Heslo musí splňovat bezpečnostní požadavky.</p>
              </div>
            </EditPassword>
          </div>

          <div class="line page-section">
            <EditRole ref="editRole" :roles="allRoles || []" :old-role="oldUserData.role" @update="onRoleUpdate">
              <div class="section-head">
                <h3>Role <span class="update" v-show="newUserData.role">(aktualizováno)</span></h3>
                <p>Zvolte roli, kterou má uživatel mít. Role určuje oprávnění a možnosti uživatele v systému.</p>
              </div>
            </EditRole>
          </div>

          <div class="line page-section">
            <EditAbbreviation ref="editAbbreviation" :full-name="{ name: newUserData.name ? newUserData.name : oldUserData.name, surname: newUserData.surname ? newUserData.surname : oldUserData.surname }" :old-abbreviation="oldUserData.abbreviation" @update="onAbbreviationUpdate">
              <div class="section-head">
                <h3>Přezdívka <span class="update" v-show="newUserData.abbreviation !== undefined && newUserData.abbreviation !== oldUserData.abbreviation">(aktualizováno)</span></h3>
                <p>Zadejte novou přezdívku uživatele, pokud ji chcete změnit. Přezdívka slouží jako zkratka jména například pro rychlou identifikaci.</p>
              </div>
            </EditAbbreviation>
          </div>

          <div class="line page-section class">
            <div class="section-head">
              <h3>Třídy</h3>
              <p>Vyberte třídu nebo více tříd, které chcete uživateli přiřadit.</p>
            </div>

            <EditClass ref="editClass" :old-class-ids="oldUserData.classes" @update="onClassUpdate" v-if="newUserData.role ? newUserData.role === 'student' : oldUserData.role === 'student'" />
            <p class="error" v-else>
              Třídy můžete vybírat pouze pokud role uživatele je <strong>student</strong>.
            </p>
          </div>

          <EditFormFooter :is-loading="submitLoading" :reset-function="resetUserData" :submit-function="updateUser" />
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

      &.no-border {
        border: none;
        padding-bottom: 0;
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
