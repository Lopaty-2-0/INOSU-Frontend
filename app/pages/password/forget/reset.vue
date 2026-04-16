<script lang="ts" setup>
import Loading from "~/components/ui/Loading.vue";
import Input from "~/components/ui/Input.vue";
import { ref, onMounted, computed } from "vue";
import { useRoute, useI18n } from "#imports";
import type { LocationQueryValue } from "vue-router";
import type {LocaleObject} from "~/types/i18n";
import LocalePicker from "~/components/ui/LocalePicker.vue";

const { setLocale, locale, locales, t } = useI18n();

useHead({
  title: t('pages.resetPassword.title'),
  meta: [{ name: "description", content: t('pages.resetPassword.description') }],
});

const token: LocationQueryValue | LocationQueryValue[] | undefined = useRoute().query.token;

const messages = ref<{
  password: string | null;
  passwordAgain: string | null;
  form: { message: string | null; type: "error" | "success" | null };
}>({
  password: null,
  passwordAgain: null,
  form: { message: null, type: null },
});
const loading = ref<boolean>(true);
const tokenEmail = ref<string | null>(null);
const formData = ref<{ password: string; passwordAgain: string }>({
  password: "",
  passwordAgain: "",
});
const pageLoading = ref<boolean>(true);
const newLocale = ref<string>(locale.value || "cz");

const validateForm = () => {
  if (formData.value.password.length < 5)
    messages.value.password = t('resetPassword.validation.tooShort');
  if (!formData.value.password) messages.value.password = t('resetPassword.validation.required');
  if (!formData.value.passwordAgain)
    messages.value.passwordAgain = t('resetPassword.validation.repeatRequired');
  else if (formData.value.passwordAgain !== formData.value.password)
    messages.value.passwordAgain = t('resetPassword.validation.mismatch');
};

const resetMessages = (): void => {
  messages.value = {
    password: null,
    passwordAgain: null,
    form: { message: null, type: null },
  };
};

const submitForm = async (): Promise<void> => {
  validateForm();

  if (messages.value.password || messages.value.passwordAgain || messages.value.form.type === "error") return;

  loading.value = true;

  await $fetch("/api/user/password/reset", {
    method: "POST",
    body: {
      email: tokenEmail.value,
      newPassword: formData.value.password,
    },
    credentials: "include",
    ignoreResponseError: true,
    async onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "14010":
          messages.value.form = {
            message: t('resetPassword.responses.invalidEmail'),
            type: "error",
          };
          break;
        case "14020":
          messages.value.form = {
            message: t('resetPassword.responses.emailTooLarge'),
            type: "error",
          };
          break;
        case "14030":
          messages.value.form = {
            message: t('resetPassword.responses.accountNotFound'),
            type: "error",
          };
          break;
        case "14040":
          messages.value.form = {
            message: t('resetPassword.responses.noNewPassword'),
            type: "error",
          };
          break;
        case "14050":
          messages.value.form = {
            message: t('resetPassword.responses.tooShort'),
            type: "error",
          };
          break;
        case "14061":
          messages.value.form = {
            message: t('resetPassword.responses.success'),
            type: "success",
          };
          formData.value.password = "";
          formData.value.passwordAgain = "";
          break;
        case "E10100":
          messages.value.form = {
            message: t('errors.E10100'),
            type: "error",
          };
          break;
        default:
          messages.value.form = {
            message: t('resetPassword.responses.unknown'),
            type: "error",
          };
          break;
      }
    },
    async onRequestError() {
      messages.value.form = {
        message: t('resetPassword.responses.unknown'),
        type: "error",
      };
    },
  });

  loading.value = false;
};

const onLocaleUpdate = (newLocale: string): void => {
  if (newLocale === locale.value) return;

  setLocale(newLocale as any);
  localStorage.setItem("locale", newLocale);
};

useFetch("/api/user/password/verify", {
  method: "POST",
  body: {
    token: token,
  },
  server: false,
  credentials: "include",
  ignoreResponseError: true,
  lazy: true,
  async onResponse({ response }: any) {
    const resCode: string = response._data.resCode.toString();

    switch (resCode) {
      case "13021":
        tokenEmail.value = response._data.data.email;
        break;
      default:
        tokenEmail.value = null;
        break;
    }
  },
}).then((): void => {
  loading.value = false;
});

onMounted((): void => {
  pageLoading.value = false;
});
</script>

<template>
  <div id="forgetPassword-reset-error" v-if="!tokenEmail && !pageLoading">
    <div v-if="loading" class="loading-big">
      <Loading color="rgba(var(--description-color), 1)" size="24px" />
    </div>

    <LocalePicker
      class="locale-picker"
      :model-value="newLocale"
      :locales="locales as LocaleObject[]"
      @update:model-value="onLocaleUpdate"
    />

    <div class="container card" v-if="!loading">
      <div class="head">
        <h2>{{ t('resetPassword.invalidToken.title') }}</h2>
        <p>{{ t('resetPassword.invalidToken.description') }}</p>
      </div>

      <div class="footer">
        <a href="/password/forget/new"><button type="submit">{{ t('resetPassword.invalidToken.retryButton') }}</button></a>
      </div>
    </div>
  </div>

  <div id="forgetPassword-reset" v-if="tokenEmail && !pageLoading">
    <LocalePicker
      class="locale-picker"
      :model-value="newLocale"
      :locales="locales as LocaleObject[]"
      @update:model-value="onLocaleUpdate"
    />

    <div class="container">
      <div class="head">
        <h2>{{ t('resetPassword.title') }}</h2>
        <p>{{ t('resetPassword.description') }}</p>
      </div>

      <form @submit.prevent="submitForm" @input="resetMessages">
        <div class="section">
          <label for="password">{{ t('resetPassword.newPasswordLabel') }}</label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="*****"
            v-model.trim="formData.password"
          />
          <p v-if="messages.password" class="error">{{ messages.password }}</p>
        </div>

        <div class="section">
          <label for="passwordAgain">{{ t('resetPassword.repeatPasswordLabel') }}</label>
          <Input
            type="password"
            id="passwordAgain"
            name="passwordAgain"
            placeholder="*****"
            v-model="formData.passwordAgain"
          />
          <p v-if="messages.passwordAgain" class="error">
            {{ messages.passwordAgain }}
          </p>
        </div>

        <div class="footer">
          <button type="submit">{{ t('resetPassword.submitButton') }}</button>
          <p
            v-if="messages.form.message"
            :class="{
              error: messages.form.type === 'error',
              success: messages.form.type === 'success',
            }"
          >
            {{ messages.form.message }}
          </p>
        </div>

        <div v-if="loading" class="loading">
          <Loading color="rgba(var(--description-color), 1)" size="6px" />
        </div>

        <a href="/">{{ t('resetPassword.doneLink') }}</a>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#forgetPassword-reset,
#forgetPassword-reset-error {
  width: 100%;
  min-height: 400px;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  .loading-big span span {
    width: 50px;
  }

  .locale-picker {
    position: absolute;
    top: 20px;
    right: 20px;
    width: fit-content;
  }

  .card {
    display: flex;
    flex-direction: column;
    gap: 20px;
    border-radius: var(--medium-border-radius);
    border: var(--border-width) solid rgba(var(--border-color), 0.5);
    padding: 30px;

    .head h2 {
      color: rgba(var(--error-color), 1);
      font-weight: 700;
      font-size: 28px;
    }

    a {
      text-decoration: none;
    }

    .footer button {
      padding: 15px;
      outline: none;
      border: none;
      cursor: pointer;
      border-radius: var(--normal-border-radius);
      background: rgba(var(--error-color), 1);
      color: var(--btn-2-color);
      transition: 0.2s;
      font-weight: var(--btn-1-font-weight);
      font-size: 16px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;

      &:hover {
        filter: brightness(1.2);
      }
    }
  }
}

.container {
  max-width: 500px;
  padding: 1.1rem;
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
      font-size: 32px;
      color: var(--title-color);
    }

    p {
      color: rgba(var(--description-color), 1);
      font-size: 16px;
    }
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
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;

      &:hover {
        background: var(--btn-1-hover-background);
      }
    }
  }
}

#forgetPassword-reset {
  .container {
    form {
      display: flex;
      flex-direction: column;
      gap: 30px;
      border: var(--border-width) solid rgba(var(--border-color), 0.5);
      border-radius: var(--medium-border-radius);
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

      .success {
        font-size: 16px;
        color: rgba(var(--success-color), 1);
      }

      .section {
        display: flex;
        flex-direction: column;
        gap: 10px;
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
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          border: none;
          cursor: pointer;

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
        text-decoration: none;

        &:hover {
          color: var(--mini-title-color);
        }
      }
    }
  }
}
</style>
