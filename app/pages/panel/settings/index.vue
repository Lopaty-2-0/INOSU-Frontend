<script lang="ts" setup>
import EditProfilePicture from "~/components/manage/ProfilePicture.vue";
import EditFormFooter from "~/components/manage/Footer.vue";
import EditReminders from "~/components/manage/Reminders.vue";
import Navigation from "~/components/ui/Navigation.vue";
import Navbar from "~/components/layout/Navbar.vue";
import { ref, computed } from "vue";
import {storeToRefs} from "pinia";
import {useAccountStore} from "~/stores/account";
import {type Alert, useAlertsStore} from "~/stores/alerts";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import {useUpload} from "~/componsables/useUploader";
import { useI18n } from "#imports";

const { t } = useI18n();

useHead({
  title: t('pages.settings.info.title'),
  meta: [
    { name: "description", content: t('pages.settings.info.description') }
  ],
});

const alertsStore = useAlertsStore();
const accountStore = useAccountStore();
const config = useRuntimeConfig();
const { getAccountData: accountData } = storeToRefs(accountStore);
const { progress, upload } = useUpload();

const submitLoading = ref<boolean>(false);
const editProfilePicture = ref<InstanceType<typeof EditProfilePicture> | null>(null);
const editReminders = ref<InstanceType<typeof EditReminders> | null>(null);
const oldUserData = computed<{ profilePicture: string, reminders: boolean }>(() => ({
  profilePicture: `${config.public.originUrl}/api/file/pfp/${accountData.value.profilePicture}`,
  reminders: accountData.value.reminders ?? false,
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

  await $fetch("/api/user/update", {
    method: "PUT",
    body: {
      profilePicture: newUserData.value.profilePicture?.name,
      size: newUserData.value.profilePicture?.size,
      reminders: newUserData.value.reminders ?? undefined,
    },
    credentials: "include",
    ignoreResponseError: true,
    async onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();
      const data: any = response._data.data;

      switch (resCode) {
        case "F15020":
          alertsStore.addAlert({ type: "error", title: t('settings.info.alerts.updateInfo.title'), message: t('settings.info.alerts.updateInfo.fileTooLarge') });
          break;
        case "2010":
          alertsStore.addAlert({ type: "warning", title: t('settings.info.alerts.updateInfo.title'), message: t('settings.info.alerts.updateInfo.nothingToUpdate') });
          break;
        case "2020":
          alertsStore.addAlert({ type: "error", title: t('settings.info.alerts.updateInfo.title'), message: t('settings.info.alerts.updateInfo.unsupportedFormat') });
          break;
        case "2031":
          if (data.uploadUrl && newUserData.value.profilePicture) {
            const alert: Alert = {
              title: t('settings.info.alerts.uploadFile.title'),
              message: t('settings.info.alerts.uploadFile.uploading'),
              type: "info",
              infinite: true,
              canClose: false,
              progress: progress
            };

            const alertIndex: number = alertsStore.addAlert(alert);

            upload(newUserData.value.profilePicture, data.uploadUrl).then(async (): Promise<void> => {
              alertsStore.removeAlert(alertIndex);
              alertsStore.addAlert({
                title: t('settings.info.alerts.uploadFile.title'),
                message: t('settings.info.alerts.uploadFile.success'),
                type: "success"
              });

              await $fetch("/api/user/put/pfp", {
                method: "PUT",
                body: {
                  idUser: accountData.value.id,
                  profilePicture: data.user.profilePicture,
                },
                credentials: "include",
                ignoreResponseError: true,
                onResponse({ response }: any) {
                  const resCode: string = response._data.resCode.toString();

                  switch (resCode) {
                    case "57070":
                      alertsStore.addAlert({ type: "error", title: t('settings.info.alerts.updateInfo.title'), message: t('settings.info.alerts.updateInfo.fileNotFound') });
                      return;
                    case "57081":
                      accountStore.updateProfilePicture(data.user.profilePicture);
                      accountStore.updateAccountDataSessionStorage();
                      newUserData.value.profilePicture = undefined;
                      break;
                    default:
                      alertsStore.addAlert({ type: "error", title: t('settings.info.alerts.updateInfo.title'), message: t('settings.info.alerts.updateInfo.savingError') });
                      break;
                  }
                },
              });
            })
            .catch((): void => {
              alertsStore.removeAlert(alertIndex);
              alertsStore.addAlert({
                title: t('settings.info.alerts.uploadFile.title'),
                message: t('settings.info.alerts.uploadFile.error'),
                type: "error"
              });
            });
          }

          alertsStore.addAlert({ type: "success", title: t('settings.info.alerts.updateInfo.title'), message: t('settings.info.alerts.updateInfo.success') });
          oldUserData.value.reminders = data.user.reminders;
          break;
        default:
          alertsStore.addAlert({ type: "error", title: t('settings.info.alerts.updateInfo.title'), message: t('settings.info.alerts.updateInfo.unknown') });
          break;
      }
    },
    async onRequestError() {
      alertsStore.addAlert({ type: "error", title: t('settings.info.alerts.updateInfo.title'), message: t('settings.info.alerts.updateInfo.unknown') });
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
            { label: t('settings.title'), to: '/panel/settings', icon: 'material-symbols:settings-rounded' },
            { label: t('settings.tabs.info'), to: '/panel/settings', active: true }
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="settings">
        <Navigation class="navigation" :title="t('settings.title')" :active-link-id="0" :links="[
          { name: t('settings.tabs.info'), path: '/panel/settings' },
          { name: t('settings.tabs.security'), path: '/panel/settings/security' },
          { name: t('settings.tabs.customization'), path: '/panel/settings/customization' },
        ]" />

        <div class="content">
          <EditProfilePicture ref="editProfilePicture" class="page-section" :old-profile-picture="oldUserData.profilePicture" @update="onProfilePictureUpdate">
            <div class="section-head">
              <h3>
                {{ t('settings.info.profilePicture.title') }}
                <span class="update" v-show="newUserData.profilePicture">{{ t('common.updated') }}</span>
              </h3>
              <p>{{ t('settings.info.profilePicture.description') }}</p>
            </div>
          </EditProfilePicture>

          <EditReminders ref="editReminders" class="page-section" :old-reminders-value="oldUserData.reminders" @update="onRemindersUpdate">
            <div class="section-head">
              <h3>
                {{ t('settings.info.reminders.title') }}
                <span class="update" v-show="newUserData.reminders !== oldUserData.reminders">{{ t('common.updated') }}</span>
              </h3>
              <p>{{ t('settings.info.reminders.description') }}</p>
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
    padding: 30px;
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
