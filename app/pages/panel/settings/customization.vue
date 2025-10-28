<script lang="ts" setup>
import Navigation from "~/components/ui/Navigation.vue";
import EditThemeMode from "../../../components/manage/ThemeMode.vue";
import EditCustomLinks from "../../../components/manage/CustomLinks.vue";
import EditFormFooter from "../../../components/manage/Footer.vue";
import Navbar from "../../../components/layout/Navbar.vue";
import {ref} from "vue";
import { useAccountStore } from "~/stores/account";
import type {AccountLink, AccountTheme} from "~/types/account";
import type {LocaleObject} from "~/types/i18n";
import LocalePicker from "~/components/ui/LocalePicker.vue";
import { useI18n } from "#imports";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";

useHead({
  title: "Panel | Nastavení - Přizpůsobení",
  meta: [
    { name: "description", content: "Panel Customization Page" }
  ],
});

const { setLocale, locale, locales } = useI18n();
const accountStore = useAccountStore();
const editThemeMode = ref<InstanceType<typeof EditThemeMode> | null>(null);
const editCustomLinks = ref<InstanceType<typeof EditCustomLinks> | null>(null);
const submitLoading = ref<boolean>(false);
const oldUserData = ref<{ themeMode: AccountTheme, customLinks: AccountLink[] }>({
  themeMode: accountStore.getTheme,
  customLinks: accountStore.getLinks,
});
const newUserData = ref<{ themeMode: AccountTheme | undefined, locale: string, customLinks: AccountLink[] | undefined, }>({
  themeMode: undefined,
  locale: locale.value || "cz",
  customLinks: undefined,
});

const onThemeModeUpdate = (themeId: AccountTheme | undefined) => {
  newUserData.value.themeMode = themeId;
};

const onCustomLinksUpdate = (customLinks: AccountLink[] | undefined) => {
  newUserData.value.customLinks = customLinks;
};

const onLocaleUpdate = (localeId: string) => {
  newUserData.value.locale = localeId;
};

const resetUserData = () => {
  newUserData.value = {
    themeMode: undefined,
    locale: locale.value || "cz",
    customLinks: undefined,
  };

  if (editThemeMode.value) editThemeMode.value.reset();
  if (editCustomLinks.value) editCustomLinks.value.reset();
};

const updateUserData = () => {
  submitLoading.value = true;

  if (newUserData.value.themeMode) {
    localStorage.setItem("theme", newUserData.value.themeMode);
    accountStore.setTheme(newUserData.value.themeMode);
    oldUserData.value.themeMode = newUserData.value.themeMode;
    if (newUserData.value.themeMode !== "system") {
      document.documentElement.setAttribute("data-theme", newUserData.value.themeMode);
    } else {
      window.location.reload();
    }
  }

  if (newUserData.value.locale !== locale.value) {
    setLocale(newUserData.value.locale as any);
    localStorage.setItem("locale", newUserData.value.locale);
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
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Nastavení', to: '/panel/settings', icon: 'material-symbols:settings-rounded' },
            { label: 'Přizpůsobení', to: '/panel/settings/customization', active: true }
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="settings">
        <Navigation class="navigation" title="Nastavení účtu" :active-link-id="2" :links="[
          { name: 'Profil', path: '/panel/settings' },
          { name: 'Zabezpečení', path: '/panel/settings/security' },
          { name: 'Přizpůsobení', path: '/panel/settings/customization' },
        ]" />
        <div class="content">
          <EditThemeMode ref="editThemeMode" class="page-section" :old-theme="oldUserData.themeMode" @update="onThemeModeUpdate">
            <div class="section-head">
              <h3>
                Tématický režim
                <span class="update" v-show="newUserData.themeMode !== undefined && oldUserData.themeMode !== newUserData.themeMode">(aktualizováno)</span>
              </h3>
              <p>Zvolte preferovaný vzhled rozhraní. Vyberte si mezi světlým, tmavým nebo systémovým režimem podle svých potřeb.</p>
            </div>
          </EditThemeMode>

          <div class="page-section">
            <div class="section-head">
              <h3>
                Jazyk rozhraní
              </h3>
              <p>Vyberte preferovaný jazyk pro uživatelské rozhraní aplikace.</p>
            </div>

            <LocalePicker
              :model-value="newUserData.locale"
              :locales="locales as LocaleObject[]"
              @update:model-value="onLocaleUpdate"
            />
          </div>

          <EditCustomLinks ref="editCustomLinks" class="page-section" :old-custom-links="oldUserData.customLinks" @update="onCustomLinksUpdate">
            <div class="section-head">
              <h3>
                Vlastní odkazy
                <span class="update" v-show="newUserData.customLinks && JSON.stringify(oldUserData.customLinks) !== JSON.stringify(newUserData.customLinks)">(aktualizováno)</span>
              </h3>
              <p>Zde můžete spravovat své vlastní odkazy, které se zobrazí v uživatelském rozhraní. Přidejte, upravte nebo odeberte odkazy podle svých preferencí.</p>
            </div>
          </EditCustomLinks>

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
      display: flex;
      gap: 30px;
      flex-direction: column;
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
