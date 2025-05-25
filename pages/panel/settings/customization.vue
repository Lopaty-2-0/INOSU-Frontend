<script lang="ts" setup>
import Alerts from "../../../components/Alerts.vue";
import Navigation from "../../../components/basics/Navigation.vue";
import EditThemeMode from "../../../components/users/manage/ThemeMode.vue";
import EditCustomLinks from "../../../components/users/manage/CustomLinks.vue";
import EditFormFooter from "../../../components/users/manage/Footer.vue";
import Navbar from "../../../components/Navbar.vue";
import {ref} from "vue";
import { useAccountStore } from "../../../stores/account";
import type {AccountLink, AccountTheme} from "../../../types/account";

definePageMeta({
});

useHead({
  title: "Panel | Nastavení - Přizpůsobení",
  meta: [
    { name: "description", content: "Panel Customization Page" }
  ],
});

const accountStore = useAccountStore();
const submitLoading = ref<boolean>(false);
const triggerReset = ref<boolean>(false);
const oldUserData = ref<{ themeMode: AccountTheme, customLinks: AccountLink[] }>({
  themeMode: accountStore.getTheme,
  customLinks: accountStore.getLinks,
});
const newUserData = ref<{ themeMode: AccountTheme | undefined, customLinks: AccountLink[] | undefined, }>({
  themeMode: undefined,
  customLinks: undefined,
});

const onThemeModeUpdate = (themeId: AccountTheme | undefined) => {
  newUserData.value.themeMode = themeId;
};

const onCustomLinksUpdate = (customLinks: AccountLink[] | undefined) => {
  newUserData.value.customLinks = customLinks;
};

const resetUserData = () => {
  newUserData.value = {
    themeMode: undefined,
    customLinks: undefined,
  };

  triggerReset.value = true;

  setTimeout(() => {
    triggerReset.value = false;
  }, 100);
};

const updateUserData = () => {
  submitLoading.value = true;

  if (newUserData.value.themeMode) {
    localStorage.setItem("theme", newUserData.value.themeMode);
    accountStore.setTheme(newUserData.value.themeMode);

    window.location.reload();
  }

  if (newUserData.value.customLinks) {
    accountStore.setLinks(JSON.parse(JSON.stringify(newUserData.value.customLinks)));
    oldUserData.value.customLinks = JSON.parse(JSON.stringify(newUserData.value.customLinks));
  }

  submitLoading.value = false;
};
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar :links="[
        { name: 'Nastavení', path: '/panel/settings' },
        { name: 'Přizpůsobení', path: '/panel/settings/customization' },
      ]" />
    </template>

    <template #content>
      <div id="settings">
        <Navigation class="navigation" title="Nastavení účtu" :active-link-id="2" :links="[
          { name: 'Profil', path: '/panel/settings' },
          { name: 'Zabezpečení', path: '/panel/settings/security' },
          { name: 'Přizpůsobení', path: '/panel/settings/customization' },
        ]" />
        <div class="content">
          <EditThemeMode class="page-section" :old-theme="oldUserData.themeMode" @update="onThemeModeUpdate" :reset="triggerReset">
            <div class="section-head">
              <h3>
                Tématický režim
                <span class="update" v-show="newUserData.themeMode !== undefined && oldUserData.themeMode !== newUserData.themeMode">(aktualizováno)</span>
              </h3>
              <p>Nastavte si motiv vašeho panelu</p>
            </div>
          </EditThemeMode>

          <EditCustomLinks class="page-section" :old-custom-links="oldUserData.customLinks" @update="onCustomLinksUpdate" :reset="triggerReset">
            <div class="section-head">
              <h3>
                Vlastní odkazy
                <span class="update" v-show="newUserData.customLinks && JSON.stringify(oldUserData.customLinks) !== JSON.stringify(newUserData.customLinks)">(aktualizováno)</span>
              </h3>
              <p>Přidejte vlastní odkazy pro rychlejší přístup z panelu</p>
            </div>
          </EditCustomLinks>

          <EditFormFooter :submit-function="updateUserData" :reset-function="resetUserData" :is-loading="submitLoading" />
        </div>
        <Alerts />
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
