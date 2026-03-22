<script lang="ts" setup>
import Loading from "~/components/ui/Loading.vue";
import Input from "~/components/ui/Input.vue";
import {onMounted, ref, computed} from "vue";
import type {LocaleObject} from "~/types/i18n";
import { useI18n } from "#imports";
import LocalePicker from "~/components/ui/LocalePicker.vue";

const { setLocale, locale, locales, t } = useI18n();

useHead({
  title: t('pages.forgotPassword.title'),
  meta: [{ name: "description", content: t('pages.forgotPassword.description') }],
});

const messages = ref<{
  email: string | null;
  form: { message: string | null; type: "error" | "success" | null };
}>({ email: null, form: { message: null, type: null } });
const email = ref<string>("");
const loading = ref<boolean>(false);
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const pageLoading = ref<boolean>(true);
const newLocale = ref<string>(locale.value || "cz");

//check user inputs
const validateForm = (): void => {
  resetMessages();

  if (!emailRegex.test(email.value))
    messages.value.email = t('forgotPassword.validation.invalidEmail');
  if (!email.value) messages.value.email = t('forgotPassword.validation.emailRequired');
};

//reset messages when user start typing
const resetMessages = (): void => {
  messages.value = { email: null, form: { message: null, type: null } };
};

//check user inputs and send request to API
const submitForm = async (): Promise<void> => {
  validateForm();

  if (messages.value.email) return;

  loading.value = true;

  await $fetch("/api/user/password/new", {
    method: "POST",
    body: {
      email: email.value,
    },
    ignoreResponseError: true,
    credentials: "include",
    async onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "12010":
          messages.value.form = {
            type: "error",
            message: t('forgotPassword.responses.noEmail'),
          };
          break;
        case "12020":
          messages.value.form = {
            type: "error",
            message: t('forgotPassword.responses.invalidFormat'),
          };
          break;
        case "12030":
          messages.value.form = {
            type: "error",
            message: t('forgotPassword.responses.emailNotFound'),
          };
          break;
        case "12040":
          messages.value.form = {
            message: t('forgotPassword.responses.noUser'),
            type: "success",
          };
          break;
        case "12051":
          messages.value.form = {
            message: t('forgotPassword.responses.sent'),
            type: "success",
          };
          break;
        default:
          messages.value.form = {
            type: "error",
            message: t('forgotPassword.responses.unknown'),
          };
          break;
      }
    },
    async onRequestError() {
      messages.value.form = { message: t('forgotPassword.responses.unknown'), type: "error" };
    },
  });

  loading.value = false;
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
  <div id="forgetPassword-new" v-if="!pageLoading">
    <LocalePicker
      class="locale-picker"
      :model-value="newLocale"
      :locales="locales as LocaleObject[]"
      @update:model-value="onLocaleUpdate"
    />

    <div class="container">
      <div class="head">
        <h2>{{ t('forgotPassword.title') }}</h2>
        <p>{{ t('forgotPassword.description') }}</p>
      </div>

      <form @submit.prevent="submitForm" @input="resetMessages">
        <div class="section">
          <label for="email">{{ t('forgotPassword.emailLabel') }}</label>
          <Input
            type="text"
            id="email"
            name="email"
            :placeholder="t('forgotPassword.emailPlaceholder')"
            v-model.trim="email"
          />
          <p v-if="messages.email" class="error">{{ messages.email }}</p>
        </div>

        <div class="footer">
          <button type="submit">{{ t('forgotPassword.submitButton') }}</button>
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

        <a href="/">{{ t('forgotPassword.rememberedLink') }}</a>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#forgetPassword-new {
  width: 100%;
  min-height: 400px;
  height: 100vh;
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
