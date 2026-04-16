<script lang="ts" setup>
import EditPassword from "~/components/manage/Password.vue";
import EditFormFooter from "~/components/manage/Footer.vue";
import Navigation from "~/components/ui/Navigation.vue";
import Navbar from "~/components/layout/Navbar.vue";
import { ref, computed } from "vue";
import { useAlertsStore } from "~/stores/alerts";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import { useI18n } from "#imports";

const { t } = useI18n();

useHead({
  title: t('pages.settings.security.title'),
  meta: [
    { name: "description", content: t('pages.settings.security.description') }
  ],
});

const alertsStore = useAlertsStore();

const submitLoading = ref<boolean>(false);
const editPassword = ref<InstanceType<typeof EditPassword> | null>(null);
const passwordRulesCheck = ref<boolean[]>([false, false, false, false]);
const userData = ref<{ passwords: { old: string, new: string } }>({
  passwords: {
    old: "",
    new: ""
  }
});

const checkPasswordRules = (): void => {
  passwordRulesCheck.value[0] = (userData.value.passwords.new || "").length >= 5; // Check if password length is at least 5 characters

  // Reset password rules check if password length is less than 6 characters
  if (!passwordRulesCheck.value[0]) {
    passwordRulesCheck.value = [false, false, false, false];
    return;
  }

  passwordRulesCheck.value[1] = !!(userData.value.passwords.new.match(/[A-Z]/g) && userData.value.passwords.new.match(/[a-z]/g) && userData.value.passwords.new.match(/[0-9]/g)); // Check if password contains 2-3 characters: uppercase, lowercase, numbers
  passwordRulesCheck.value[2] = !!userData.value.passwords.new.match(/[@#$%&*+=]/g); // Check if password contains at least 1 special character: @, #, $, %, &, *, +, =
  passwordRulesCheck.value[3] = !userData.value.passwords.new.match(/\s/g); // Check if password doesn't contain any spaces
};

const onPasswordsUpdate = (passwordsInputs: { old: string | undefined, new: string | undefined }): void => {
  if (!passwordsInputs.old || !passwordsInputs.new) {
    userData.value.passwords.old = "";
    userData.value.passwords.new = "";

    checkPasswordRules();

    return;
  }

  userData.value.passwords = {
    old: passwordsInputs.old,
    new: passwordsInputs.new
  };

  checkPasswordRules();
};

const resetUserData = (): void => {
  userData.value = {
    passwords: {
      old: "",
      new: ""
    }
  };

  passwordRulesCheck.value = [false, false, false, false];

  if (editPassword.value) editPassword.value.reset();
};

const updateUserData = async (): Promise<void> => {
  submitLoading.value = true;

  if (userData.value.passwords.old && userData.value.passwords.new) {
    await $fetch("/api/user/update/password", {
      method: "PUT",
      body: {
        oldPassword: userData.value.passwords.old,
        newPassword: userData.value.passwords.new
      },
      credentials: "include",
      ignoreResponseError: true,
      async onResponse({ response }: any) {
        const resCode: string = response._data.resCode.toString();

        switch (resCode) {
          case "11010":
            alertsStore.addAlert({type: "error", title: t('settings.security.alerts.changePassword.title'), message: t('settings.security.alerts.changePassword.noOldPassword')});
            break;
          case "11020":
            alertsStore.addAlert({type: "error", title: t('settings.security.alerts.changePassword.title'), message: t('settings.security.alerts.changePassword.noNewPassword')});
            break;
          case "11030":
            alertsStore.addAlert({type: "error", title: t('settings.security.alerts.changePassword.title'), message: t('settings.security.alerts.changePassword.wrongOldPassword')});
            break;
          case "11040":
            alertsStore.addAlert({type: "error", title: t('settings.security.alerts.changePassword.title'), message: t('settings.security.alerts.changePassword.tooShort')});
            break;
          case "11051":
            alertsStore.addAlert({type: "success", title: t('settings.security.alerts.changePassword.title'), message: t('settings.security.alerts.changePassword.success')});
            break;
          case "E10100":
            alertsStore.addAlert({type: "error", title: t('settings.security.alerts.changePassword.title'), message: t('errors.E10100')});
            break;
          default:
            alertsStore.addAlert({type: "error", title: t('settings.security.alerts.changePassword.title'), message: t('settings.security.alerts.changePassword.unknown')});
            break;
        }
      },
      async onRequestError() {
        alertsStore.addAlert({type: "error", title: t('settings.security.alerts.changePassword.title'), message: t('settings.security.alerts.changePassword.unknown')});
      }
    });
  }

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
            { label: t('settings.tabs.security'), to: '/panel/settings/security', active: true }
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="settings">
        <Navigation class="navigation" :title="t('settings.title')" :active-link-id="1" :links="[
          { name: t('settings.tabs.info'), path: '/panel/settings' },
          { name: t('settings.tabs.security'), path: '/panel/settings/security' },
          { name: t('settings.tabs.customization'), path: '/panel/settings/customization' },
        ]" />

        <div class="content">
          <EditPassword ref="editPassword" class="page-section" @update="onPasswordsUpdate">
            <div class="section-head">
              <h3>{{ t('settings.security.passwordReset.title') }} <span class="update" v-if="userData.passwords.new !== userData.passwords.old && passwordRulesCheck[0] && userData.passwords.old !== ''">{{ t('common.updated') }}</span></h3>
              <p>{{ t('settings.security.passwordReset.description') }}</p>

              <div class="password-rules">
                <h4>{{ t('settings.security.passwordReset.rules.title') }}</h4>
                <ul>
                  <li><Icon class="icon" size="16px" name="material-symbols:play-arrow-rounded"></Icon> <p>{{ t('settings.security.passwordReset.rules.minLength') }} <Icon size="16px" name="material-symbols:check-rounded" class="icon" v-if="passwordRulesCheck[0]"></Icon></p></li>
                  <li><Icon class="icon" size="16px" name="material-symbols:play-arrow-rounded"></Icon> <p>{{ t('settings.security.passwordReset.rules.charTypes') }} <Icon size="16px" name="material-symbols:check-rounded" class="icon" v-if="passwordRulesCheck[1]"></Icon></p></li>
                  <li><Icon class="icon" size="16px" name="material-symbols:play-arrow-rounded"></Icon> <p>{{ t('settings.security.passwordReset.rules.specialChar') }} <Icon size="16px" name="material-symbols:check-rounded" class="icon" v-if="passwordRulesCheck[2]"></Icon></p></li>
                  <li><Icon class="icon" size="16px" name="material-symbols:play-arrow-rounded"></Icon> <p>{{ t('settings.security.passwordReset.rules.noSpaces') }} <Icon size="16px" name="material-symbols:check-rounded" class="icon" v-if="passwordRulesCheck[3]"></Icon></p></li>
                  <li><Icon class="icon" size="16px" name="material-symbols:play-arrow-rounded"></Icon> <p>{{ t('settings.security.passwordReset.rules.noPersonalInfo') }}</p></li>
                </ul>
              </div>
            </div>
          </EditPassword>

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
