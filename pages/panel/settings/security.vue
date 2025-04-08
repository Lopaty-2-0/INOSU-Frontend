<script lang="ts" setup>
import EditProfilePicture from "~/components/users/manage/ProfilePicture.vue";
import EditPassword from "~/components/users/manage/Password.vue";
import EditFormFooter from "~/components/users/manage/Footer.vue";
import Navigation from "~/components/basics/Navigation.vue";
import Alerts from "~/components/Alerts.vue";
import Navbar from "~/components/Navbar.vue";
import { ref } from "vue";
import {storeToRefs} from "pinia";
import {useAccountStore} from "../../../stores/account";
import apiFetch from "../../../componsables/apiFetch";

definePageMeta({
  middleware: ["auth"]
});

useHead({
  title: "Panel | Nastavení - Zabezpečení",
  meta: [
    { name: "description", content: "Panel Settings User Information" }
  ],
});

const { getAccountData: accountData } = storeToRefs(useAccountStore());

const submitLoading = ref<boolean>(false);
const triggerReset = ref<boolean>(false);

const passwordRulesCheck = ref<boolean[]>([false, false, false, false]);

const oldUserData = ref<{ profilePicture: string}>({
  profilePicture: "http://89.203.248.163/uploads/profilePictures/" + accountData.value.profilePicture,
});

const newUserData = ref<{ profilePicture: File | undefined, passwords: { old: string, new: string } }>({
  profilePicture: undefined,
  passwords: {
    old: "",
    new: ""
  }
});

const onProfilePictureUpdate = (updatedUserData: { profilePicture: File | undefined }): void => {
  newUserData.value.profilePicture = updatedUserData.profilePicture;
};

const checkPasswordRules = (): void => {
  passwordRulesCheck.value[0] = newUserData.value.passwords.new.length >= 5; // Check if password length is at least 5 characters

  // Reset password rules check if password length is less than 6 characters
  if (!passwordRulesCheck.value[0]) {
    passwordRulesCheck.value = [false, false, false, false];
    return;
  }

  passwordRulesCheck.value[1] = !!(newUserData.value.passwords.new.match(/[A-Z]/g) && newUserData.value.passwords.new.match(/[a-z]/g) && newUserData.value.passwords.new.match(/[0-9]/g)); // Check if password contains 2-3 characters: uppercase, lowercase, numbers
  passwordRulesCheck.value[2] = !!newUserData.value.passwords.new.match(/[@#$%&*+=]/g); // Check if password contains at least 1 special character: @, #, $, %, &, *, +, =
  passwordRulesCheck.value[3] = !newUserData.value.passwords.new.match(/\s/g); // Check if password doesn't contain any spaces
};

const onPasswordsUpdate = (passwordsInputs: { old: string, new: string }): void => {
  newUserData.value.passwords = passwordsInputs;

  checkPasswordRules();
};

const resetUserData = (): void => {
  newUserData.value = {
    profilePicture: undefined,
    passwords: {
      old: "",
      new: ""
    }
  };

  passwordRulesCheck.value = [false, false, false, false];
  triggerReset.value = true;

  setTimeout((): void => {
    triggerReset.value = false;
  }, 100);
};

const updateUserData = async (): Promise<void> => {
  submitLoading.value = true;

  const updateProfileForm: FormData = new FormData();

  if (newUserData.value.profilePicture) {
    updateProfileForm.append("profilePicture", newUserData.value.profilePicture);
  }

  if (newUserData.value.passwords.old && newUserData.value.passwords.new) {
    await apiFetch("/user/update/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        oldPassword: newUserData.value.passwords.old,
        newPassword: newUserData.value.passwords.new
      },
      credentials: "include",
      ignoreResponseError: true,
      async onResponse({ response }) {
        const resCode: string = response._data.resCode.toString();

        switch (resCode) {
        }
      },
      async onRequestError() {
        console.log("Nastala neznámá chyba");
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
        { name: 'Zabezpečení', path: '/panel/settings/security' },
      ]" />
    </template>

    <template #content>
      <div id="settings">
        <Navigation class="navigation" title="Nastavení" :active-link-id="1" :links="[
          { name: 'Profil', path: '/panel/settings' },
          { name: 'Zabezpečení', path: '/panel/settings/security' },
          { name: 'Přizpůsobení', path: '/panel/settings/customization' },
        ]" />

        <div class="content">
          <EditPassword class="page-section" @update="onPasswordsUpdate" :reset="triggerReset">
            <div class="section-head">
              <h3>Resetování hesla <span class="update" v-if="newUserData.passwords.new !== newUserData.passwords.old && passwordRulesCheck[0] && newUserData.passwords.old !== ''">(aktualizováno)</span></h3>
              <p>Jednoduše změňte své heslo na jiné</p>

              <div class="password-rules">
                <h4>Doporučená pravidla hesla</h4>
                <ul>
                  <li><Icon class="icon" size="16px" name="material-symbols:play-arrow-rounded"></Icon> <p>Obsahuje minimálně 5 znaků <Icon size="16px" name="material-symbols:check-rounded" class="icon" v-if="passwordRulesCheck[0]"></Icon></p></li>
                  <li><Icon class="icon" size="16px" name="material-symbols:play-arrow-rounded"></Icon> <p>Obsahuje 2 až 3 znaky: velké, malé, čísla <Icon size="16px" name="material-symbols:check-rounded" class="icon" v-if="passwordRulesCheck[1]"></Icon></p></li>
                  <li><Icon class="icon" size="16px" name="material-symbols:play-arrow-rounded"></Icon> <p>Obsahuje aspoň 1 speciální znak: @, #, $, %, &, *, +, = <Icon size="16px" name="material-symbols:check-rounded" class="icon" v-if="passwordRulesCheck[2]"></Icon></p></li>
                  <li><Icon class="icon" size="16px" name="material-symbols:play-arrow-rounded"></Icon> <p>Neobsahuje žádné mezery <Icon size="16px" name="material-symbols:check-rounded" class="icon" v-if="passwordRulesCheck[3]"></Icon></p></li>
                  <li><Icon class="icon" size="16px" name="material-symbols:play-arrow-rounded"></Icon> <p>Neobsahuje žádné osobní informace</p></li>
                </ul>
              </div>
            </div>
          </EditPassword>

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
