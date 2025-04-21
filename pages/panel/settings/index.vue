<script lang="ts" setup>
import EditProfilePicture from "~/components/users/manage/ProfilePicture.vue";
import EditFormFooter from "~/components/users/manage/Footer.vue";
import Navigation from "~/components/basics/Navigation.vue";
import Alerts from "~/components/Alerts.vue";
import Navbar from "~/components/Navbar.vue";
import { ref, computed } from "vue";
import {storeToRefs} from "pinia";
import {useAccountStore} from "../../../stores/account";
import apiFetch from "../../../componsables/apiFetch";
import {useAlertsStore} from "../../../stores/alerts";

definePageMeta({
  middleware: ["auth"]
});

useHead({
  title: "Panel | Nastavení - Profil",
  meta: [
    { name: "description", content: "Panel Settings User Information" }
  ],
});

const alertsStore = useAlertsStore();
const accountStore = useAccountStore();
const { getAccountData: accountData } = storeToRefs(accountStore);

const submitLoading = ref<boolean>(false);
const triggerReset = ref<boolean>(false);

const oldUserData = computed<{ profilePicture: string}>(() => ({
  profilePicture: "http://89.203.248.163/uploads/profilePictures/" + accountData.value.profilePicture,
}));

const newUserData = ref<{ profilePicture: File | undefined }>({
  profilePicture: undefined,
});

const onProfilePictureUpdate = (updatedUserData: { profilePicture: File | undefined }): void => {
  newUserData.value.profilePicture = updatedUserData.profilePicture;
};

const resetUserData = (): void => {
  newUserData.value = {
    profilePicture: undefined,
  };

  triggerReset.value = true;

  setTimeout((): void => {
    triggerReset.value = false;
  }, 100);
};

const updateUserData = async (): Promise<void> => {
  submitLoading.value = true;

  if (newUserData.value.profilePicture) {
    const updateProfileForm: FormData = new FormData();

    updateProfileForm.append("profilePicture", newUserData.value.profilePicture);

    await apiFetch("/user/update", {
      method: "PUT",
      body: updateProfileForm,
      credentials: "include",
      ignoreResponseError: true,
      async onResponse({ response }) {
        const resCode: string = response._data.resCode.toString();
        const data = response._data.data;

        switch (resCode) {
          case "2010":
            alertsStore.addAlert({ type: "error", title: "Změna profilu", message: "Profilová fotka nebyla zadána." });
            break;
          case "2020":
            alertsStore.addAlert({ type: "error", title: "Změna profilu", message: "Nepodporovaný formát obrázku." });
            break;
          case "2031":
            alertsStore.addAlert({ type: "success", title: "Změna profilu", message: "Profilový obrázek byl aktualizován." });
            accountStore.updateProfilePicture(data.user.profilePicture);
            break;
          default:
            alertsStore.addAlert({ type: "error", title: "Změna profilu", message: "Nastala neznámá chyba." });
            break;
        }
      },
      async onRequestError() {
        alertsStore.addAlert({ type: "error", title: "Změna profilu", message: "Nastala neznámá chyba." });
      }
    });
  }

  submitLoading.value = false;
};
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar :links="[
        { name: 'Nastavení', path: '/panel/settings' },
        { name: 'Profil', path: '/panel/settings' },
      ]" />
    </template>

    <template #content>
      <div id="settings">
        <Navigation class="navigation" title="Nastavení" :active-link-id="0" :links="[
          { name: 'Profil', path: '/panel/settings' },
          { name: 'Zabezpečení', path: '/panel/settings/security' },
          { name: 'Přizpůsobení', path: '/panel/settings/customization' },
        ]" />

        <div class="content">
          <EditProfilePicture class="page-section" :old-profile-picture="oldUserData.profilePicture" @update="onProfilePictureUpdate" :reset="triggerReset">
            <div class="section-head">
              <h3>
                Profilová fotka
                <span class="update" v-show="newUserData.profilePicture">(aktualizováno)</span>
              </h3>
              <p>Změňte svůj profilový obrázek</p>
            </div>
          </EditProfilePicture>

          <EditFormFooter :submit-function="updateUserData" :reset-function="resetUserData" :is-loading="submitLoading" />
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
  gap: 3rem;
  position: relative;

  .navigation {
    height: fit-content;
    position: sticky;
    top: 110px;
    width: 300px;
  }

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

    .navigation {
      width: 100%;
      position: relative;
      top: 0;
    }
  }
}
</style>
