<script lang="ts" setup>
import EditProfilePicture from "~/components/users/manage/ProfilePicture.vue";
import EditFormFooter from "~/components/users/manage/Footer.vue";
import Alerts from "~/components/Alerts.vue";
import Navbar from "~/components/Navbar.vue";
import { ref, computed } from "vue";
import {storeToRefs} from "pinia";
import {useAccountStore} from "../../../stores/account";
import apiFetch from "../../../componsables/apiFetch";
import {useAlertsStore} from "../../../stores/alerts";
import EditFullName from "../../../components/users/manage/FullName.vue";
import EditEmail from "../../../components/users/manage/Email.vue";
import EditPassword from "../../../components/users/manage/Password.vue";

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
const accountStore = useAccountStore();
const { getAccountData: accountData } = storeToRefs(accountStore);

const submitLoading = ref<boolean>(false);
const triggerReset = ref<boolean>(false);

const oldUserData = computed<{ name: string, surname: string, email: string, password: string, abbreviation: string, role: string}>(() => ({
  name: "",
  surname: "",
  email: "",
  password: "",
  abbreviation: "",
  role: "",
}));

const newUserData = ref<{ name: string | undefined, surname: string | undefined, email: string | undefined, password: string | undefined, abbreviation: string | undefined, role: string | undefined}>({
  name: undefined,
  surname: undefined,
  email: undefined,
  password: undefined,
  abbreviation: undefined,
  role: undefined,
});


const resetUserData = (): void => {
  newUserData.value = {
    name: undefined,
    surname: undefined,
    email: undefined,
    password: undefined,
    abbreviation: undefined,
    role: undefined,
  };

  triggerReset.value = true;

  setTimeout((): void => {
    triggerReset.value = false;
  }, 100);
};

const createNewUser = async (): Promise<void> => {
  submitLoading.value = true;

  submitLoading.value = false;
};
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar :links="[
        { name: 'Uživatelé', path: '/panel/users' },
        { name: 'Přidání', path: '/panel/users/add' },
      ]" />
    </template>

    <template #content>
      <div id="settings">
        <div class="content">
          <EditFullName :old-full-name="{ name: oldUserData.name, surname: oldUserData.surname }" />

          <EditEmail :old-email="oldUserData.email" />

          <EditPassword />

          <EditFormFooter :submit-function="createNewUser" :reset-function="resetUserData" :is-loading="submitLoading" />
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
