<script lang="ts" setup>
import Loading from "~/components/ui/Loading.vue";
import { ref } from "vue";
import apiFetch from "../componsables/apiFetch";
import { navigateTo, useCookie } from "nuxt/app";
import type { AccountData } from "~/types/account";
import Checkbox from "~/components/ui/Checkbox.vue";
import Input from "~/components/ui/Input.vue";
import type {LocaleObject} from "~/types/i18n";
import LocalePicker from "~/components/ui/LocalePicker.vue";

useHead({
  title: "Panel | Přihlášení",
  meta: [{ name: "description", content: "Panel Login Page" }],
});

const loginData = ref<{ login: string | null; password: string | null; stayLogged: boolean; }>({
  login: null,
  password: null,
  stayLogged: false
});
const errors = ref<{ login: string | null; password: string | null; req: string | null; }>({
  login: null,
  password: null,
  req: null
});
const loading = ref<boolean>(false);
const pageLoading = ref<boolean>(true);
const { setLocale, locale, locales, t } = useI18n();
const newLocale = ref<string>(locale.value || "cz");

const validateLogin = (): void => {
  resetErrors();

  if (!loginData.value.login) errors.value.login = t("login.form.login.errors.required");
  if (!loginData.value.password) errors.value.password = t("login.form.password.errors.required");
};

const submitLoginForm = async (): Promise<void> => {
  validateLogin();

  if (errors.value.login || errors.value.password) return;

  loading.value = true;

  await apiFetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      login: loginData.value.login,
      password: loginData.value.password,
      stayLogged: loginData.value.stayLogged,
    },
    credentials: "include",
    ignoreResponseError: true,
    async onResponse({ response }) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "6010":
          errors.value.req = t("login.form.errors.missing");
          break;
        case "6020":
          errors.value.req = t("login.form.errors.invalid");
          break;
        case "6031":
          useCookie("accountData").value = JSON.stringify({
            profilePicture: response._data.data.user.profilePicture,
            email: response._data.data.user.email,
            name: response._data.data.user.name,
            surname: response._data.data.user.surname,
            idClass: response._data.data.user.idClass,
            abbreviation: response._data.data.user.abbreviation,
            createdAt: response._data.data.user.createdAt,
          } as AccountData);

          navigateTo("/panel");
          break;
        default:
          errors.value.req = t("login.form.errors.unknown");
          break;
      }
    },
    async onRequestError() {
      errors.value.req = t("login.form.errors.unknown");
    },
  }).finally((): void => {
    loading.value = false;
  });
};

const resetErrors = (): void => {
  errors.value = {
    login: null,
    password: null,
    req: null,
  };
};

const onLocaleUpdate = (newLocale: string): void => {
  if (newLocale === locale.value) return;

  setLocale(newLocale as any);
  localStorage.setItem("locale", newLocale);
};

onMounted((): void => {
  pageLoading.value = false;
});
</script>

<template>
  <div id="login-form" v-if="!pageLoading">
    <div class="container">
      <div class="head">
        <h2>{{ t("login.title") }}</h2>
        <p>{{ t("login.description") }}</p>
      </div>

      <LocalePicker
        class="locale-picker"
        :model-value="newLocale"
        :locales="locales as LocaleObject[]"
        @update:model-value="onLocaleUpdate"
      />

      <form @submit.prevent="submitLoginForm" @input="resetErrors">
        <div class="section">
          <label for="login">{{ t("login.form.login.label") }}</label>
          <Input
            id="login"
            v-model="loginData.login"
            type="text"
            name="login"
            :placeholder="t('login.form.login.placeholder')"
          />
          <p v-if="errors.login" class="error">{{ errors.login }}</p>
        </div>

        <div class="section">
          <label for="password">{{ t("login.form.password.label") }}</label>
          <Input
            id="password"
            v-model="loginData.password"
            type="password"
            name="password"
            :placeholder="t('login.form.password.placeholder')"
          />
          <p v-if="errors.password" class="error">{{ errors.password }}</p>
        </div>

        <div class="custom-item">
          <Checkbox
            id="stayLogged"
            name="stayLogged"
            @change="() => (loginData.stayLogged = !loginData.stayLogged)"
          />
          <label for="stayLogged">{{ t("login.form.remember.label") }}</label>
        </div>

        <div class="footer">
          <button type="submit">{{ t("login.form.submit") }}</button>
          <p v-if="errors.req" class="error">{{ errors.req }}</p>
        </div>

        <div v-if="loading" class="loading">
          <Loading color="rgba(var(--description-color), 1)" size="6px" />
        </div>

        <a href="/password/forget/new">{{ t("login.form.forgot-password") }}</a>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#login-form {
  width: 100%;
  min-height: 800px;
  height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  .locale-picker {
    position: absolute;
    top: 20px;
    right: 20px;
    width: fit-content;
  }

  .container {
    max-width: 500px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 30px;
    width: 100%;

    .head {
      display: flex;
      flex-direction: column;
      gap: 10px;
      justify-content: center;
      align-items: center;
      text-align: center;

      h2 {
        font-weight: 900;
        font-size: 36px;
        color: var(--title-color);
      }

      p {
        color: rgba(var(--description-color), 1);
        font-size: 16px;
      }
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 30px;
      border-radius: var(--medium-border-radius);
      border: var(--border-width) solid rgba(var(--border-color), 0.5);
      padding: 30px;

      label {
        color: var(--mini-title-color);
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
      }

      .loading {
        display: flex;
        justify-content: center;
      }

      .error {
        font-size: 16px;
        color: rgba(var(--error-color), 1);
      }

      .section {
        display: flex;
        flex-direction: column;
        gap: 10px;

        input {
          border-radius: var(--normal-border-radius);
          border: var(--border-width) solid rgba(var(--border-color), 0.5);
          padding: 15px;
          font-size: 16px;
          outline: none;
          background: var(--input-background);
          color: var(--input-color);

          &::placeholder {
            color: var(--input-placeholder-color);
          }

          &:focus {
            border-color: rgba(var(--main-color), 1);
          }
        }
      }

      .custom-item {
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
      }

      .footer {
        display: flex;
        flex-direction: column;
        gap: 10px;

        button {
          padding: 15px;
          border-radius: var(--normal-border-radius);
          background: var(--btn-1-background);
          color: var(--btn-1-color);
          transition: 0.2s;
          font-weight: var(--btn-1-font-weight);
          font-size: 16px;
          width: 100%;

          &:hover {
            background: var(--btn-1-hover-background);
          }
        }
      }

      a {
        color: rgba(var(--description-color), 1);
        font-size: 16px;
        transition: 0.2s;
        width: fit-content;

        &:hover {
          color: var(--mini-title-color);
        }
      }
    }
  }
}

@media (max-width: 450px) {
  #login-form .locale-picker {
    position: relative;
    width: 100%;
    top: 0;
    right: 0;
    order: 3;
  }
}
</style>
