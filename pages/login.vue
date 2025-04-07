<script lang="ts" setup>
import Loading from "~/components/basics/Loading.vue";
import { ref } from "vue";
import apiFetch from "../componsables/apiFetch";
import {navigateTo} from "nuxt/app";

useHead({
  title: "Panel | Přihlášení",
  meta: [
    { name: "Panel Login Page", content: "Panel Login Page" }
  ]
});

const loginData = ref<{ login: string | null, password: string | null, stayLogged: boolean }>({ login: null, password: null, stayLogged: false });
const errors = ref<{ login: string | null, password: string | null, req: string | null }>({ login: null, password: null, req: null });
const loading = ref<boolean>(false);

// Check user inputs
const validateLogin = (): void => {
  resetErrors();

  if (!loginData.value.login) errors.value.login = "Zadejte váš e-mail nebo zkratku";
  if (!loginData.value.password) errors.value.password = "Zadejte vaše heslo";
};

// Check user inputs and send request to backend
const submitLoginForm = async (): Promise<void> => {
  validateLogin();

  if (errors.value.login || errors.value.password) return;

  loading.value = true;

  await apiFetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      login: loginData.value.login,
      password: loginData.value.password,
      stayLogged: loginData.value.stayLogged
    },
    credentials: "include",
    ignoreResponseError: true,
    async onResponse({ response }) {
      const resCode: string = response._data.resCode.toString();
      
      switch (resCode) {
        case "6010":
          errors.value.req = "Login nebo heslo nebylo zadáno";
          break;
        case "6020":
          errors.value.req = "Špatný login nebo heslo";
          break;
        case "6031":
          navigateTo("/panel");
          break;
        default:
          errors.value.req = "Nastala neznámá chyba";
          break;
      }
    },
    async onRequestError() {
      errors.value.req = "Nastala neznámá chyba";
    },
  }).finally((): void => {
    loading.value = false;
  })
};

const resetErrors = (): void => {
  errors.value = {
    login: null,
    password: null,
    req: null
  };
};
</script>

<template>
  <div id="login-form">
    <div class="container">
      <div class="head">
        <h2>INOSU panel</h2>
        <p>Lorem Ipsum is simply dummy text of the printing and </p>
      </div>

      <form @submit.prevent="submitLoginForm" @input="resetErrors">
        <div class="item">
          <label for="login">E-mail / Zkratka</label>
          <input id="login" v-model="loginData.login" type="text" name="login" placeholder="test@test.com / JUDE">
          <p v-if="errors.login" class="error">{{ errors.login }}</p>
        </div>

        <div class="item">
          <label for="password">Heslo</label>
          <input id="password" v-model="loginData.password" type="password" name="password" placeholder="*****">
          <p v-if="errors.password" class="error">{{ errors.password }}</p>
        </div>

        <div class="custom-item">
          <input id="stayLogged" type="checkbox" name="stayLogged" @change="() => loginData.stayLogged = !loginData.stayLogged">
          <label for="stayLogged">Zůstat přihlášen</label>
        </div>

        <div class="footer">
          <button type="submit">Přihlásit se</button>
          <p v-if="errors.req" class="error">{{ errors.req }}</p>
        </div>

        <div v-if="loading" class="loading">
          <Loading color="rgba(var(--description-color), 1)" size="6px" />
        </div>

        <a href="/password/forget/new">Zapomněli jste heslo?</a>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#login-form {
  width: 100%;
  min-height: 800px;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  .container {
    max-width: 500px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 30px;

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

      .item {
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

        input[type=checkbox] {
          accent-color: rgba(var(--main-color), 1);
          height: 15px;
          width: 15px;
          border-radius: var(--mini-border-radius);
          cursor: pointer;
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
</style>
