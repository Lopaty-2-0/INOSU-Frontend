<script lang="ts" setup>
import EditProfilePicture from "~/components/manage/ProfilePicture.vue";
import EditFormFooter from "~/components/manage/Footer.vue";
import EditReminders from "~/components/manage/Reminders.vue";
import Navigation from "~/components/ui/Navigation.vue";
import Navbar from "~/components/layout/Navbar.vue";
import { ref, computed } from "vue";
import {storeToRefs} from "pinia";
import {useAccountStore} from "~/stores/account";
import {useAlertsStore} from "~/stores/alerts";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";

useHead({
  title: "Panel | Nastavení - Údaje",
  meta: [
    { name: "description", content: "Panel Settings User Information" }
  ],
});

const alertsStore = useAlertsStore();
const accountStore = useAccountStore();
const { getAccountData: accountData } = storeToRefs(accountStore);

const submitLoading = ref<boolean>(false);
const editProfilePicture = ref<InstanceType<typeof EditProfilePicture> | null>(null);
const editReminders = ref<InstanceType<typeof EditReminders> | null>(null);
const oldUserData = computed<{ profilePicture: string, reminders: boolean }>(() => ({
  profilePicture: "/api/file/pfp/" + accountData.value.profilePicture,
  reminders: accountData.value.reminders,
}));

const newUserData = ref<{ profilePicture: File | undefined, reminders: boolean }>({
  profilePicture: undefined,
  reminders: oldUserData.value.reminders,
});

const onProfilePictureUpdate = (updatedUserData: { profilePicture: File | undefined }): void => {
  newUserData.value.profilePicture = updatedUserData.profilePicture;
};

const onRemindersUpdate = (remindersValue: boolean): void => {
  newUserData.value.reminders = remindersValue;
};

const resetUserData = (): void => {
  newUserData.value = {
    profilePicture: undefined,
    reminders: oldUserData.value.reminders,
  };

  if (editReminders.value) editReminders.value.reset();
  if (editProfilePicture.value) editProfilePicture.value.reset();
};

const updateUserData = async (): Promise<void> => {
  submitLoading.value = true;

  if (!newUserData.value.profilePicture && oldUserData.value.reminders === newUserData.value.reminders) {
    submitLoading.value = false;
    return;
  }

  const updateProfileForm: FormData = new FormData();

  if (newUserData.value.profilePicture) updateProfileForm.append("profilePicture", newUserData.value.profilePicture);
  if (oldUserData.value.reminders !== newUserData.value.reminders) updateProfileForm.append("reminders", newUserData.value.reminders.toString());

  await $fetch("/api/user/update", {
    method: "PUT",
    body: updateProfileForm,
    credentials: "include",
    ignoreResponseError: true,
    async onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();
      const data: any = response._data.data;

      switch (resCode) {
        case "2010":
          alertsStore.addAlert({ type: "warning", title: "Změna údajů", message: "Nic nebylo zadáno k úpravě." });
          break;
        case "2020":
          alertsStore.addAlert({ type: "error", title: "Změna údajů", message: "Nepodporovaný formát obrázku." });
          break;
        case "2031":
          alertsStore.addAlert({ type: "success", title: "Změna údajů", message: "Údaje byly úspěšně aktualizovány." });
          accountStore.updateProfilePicture(data.user.profilePicture);
          accountStore.updateAccountDataSessionStorage();
          newUserData.value.profilePicture = undefined;
          oldUserData.value.reminders = data.user.reminders;
          break;
        default:
          alertsStore.addAlert({ type: "error", title: "Změna údajů", message: "Nastala neznámá chyba." });
          break;
      }
    },
    async onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Změna údajů", message: "Nastala neznámá chyba." });
    }
  });

  submitLoading.value = false;
};
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Nastavení', to: '/panel/settings', icon: 'material-symbols:settings-rounded' },
            { label: 'Údaje', to: '/panel/settings', active: true }
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="settings">
        <Navigation class="navigation" title="Nastavení" :active-link-id="0" :links="[
          { name: 'Údaje', path: '/panel/settings' },
          { name: 'Zabezpečení', path: '/panel/settings/security' },
          { name: 'Přizpůsobení', path: '/panel/settings/customization' },
        ]" />

        <div class="content">
          <EditProfilePicture ref="editProfilePicture" class="page-section" :old-profile-picture="oldUserData.profilePicture" @update="onProfilePictureUpdate">
            <div class="section-head">
              <h3>
                Profilová fotka
                <span class="update" v-show="newUserData.profilePicture">(aktualizováno)</span>
              </h3>
              <p>Zde můžete změnit svou profilovou fotku. Nahrajte nový obrázek, pokud si přejete aktualizovat stávající profilovou fotografii.</p>
            </div>
          </EditProfilePicture>

          <EditReminders ref="editReminders" class="page-section" :old-reminders-value="oldUserData.reminders" @update="onRemindersUpdate">
            <div class="section-head">
              <h3>
                Připomínky
                <span class="update" v-show="newUserData.reminders !== oldUserData.reminders">(aktualizováno)</span>
              </h3>
              <p>
                Zde můžete zapnout nebo vypnout připomínky na úkoly. Pokud je povolíte, budete dostávat do e-mailu upozornění na nadcházející úkoly a termíny.
              </p>
            </div>
          </EditReminders>

          <EditFormFooter :submit-function="updateUserData" :reset-function="resetUserData" :is-loading="submitLoading" />
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

  .navigation {
    height: fit-content;
    position: sticky;
    top: 110px;
    min-width: 300px;
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

    ::v-deep(.section) {
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
      min-width: 200px;
    }
  }
}
</style>
