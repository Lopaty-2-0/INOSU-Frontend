<script lang="ts" setup>
import Loading from "~/components/basics/Loading.vue";
import { ref, onMounted } from "vue";
import {useRoute} from "#imports";
import type {LocationQueryValue} from "vue-router";
import apiFetch from "../../../componsables/apiFetch";

useHead({
  title: "Panel | Resetování hesla",
  meta: [
    { name: "description", content: "Resetování hesla" }
  ]
});

const messages = ref<{ password: string | null, passwordAgain: string | null, form: { message: string | null, type: "error" | "success" | null }}>({ password: null, passwordAgain: null, form: { message: null, type: null }});
const loading = ref<boolean>(true);
const tokenEmail = ref<string | null>(null);
const formData = ref<{ password: string, passwordAgain: string }>({password: "", passwordAgain: ""});

//check user inputs
const validateForm = () => {
  if (formData.value.password.length < 5) messages.value.password = "Nové heslo musí mít nejméně 5 znaků";
  if (!formData.value.password) messages.value.password = "Zadejte nové heslo";
  if (!formData.value.passwordAgain) messages.value.passwordAgain = "Zadejte heslo znovu";
  else if (formData.value.passwordAgain !== formData.value.password) messages.value.passwordAgain = "Hesla se neshodují";
};

//reset messages when user start typing
const resetMessages = (): void => {
  messages.value = { password: null, passwordAgain: null, form: { message: null, type: null }};
};

//check user inputs and send request to API
const submitForm = async (): Promise<void> => {
  validateForm();

  if (messages.value.password || messages.value.passwordAgain || messages.value.form.type === "error") return;

  loading.value = true;

  await apiFetch("/user/password/reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      email: tokenEmail.value,
      newPassword: formData.value.password,
    },
    credentials: "include",
    ignoreResponseError: true,
    async onResponse({response}) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "14010":
          messages.value.form = {
            message: "Účet nebyl nalezen",
            type: "error"
          };
          break;
        case "14020":
          messages.value.form = {
            message: "Nové heslo musí mít nejméně 5 znaků",
            type: "error"
          };
          break;
        case "14031":
          messages.value.form = {
            message: "Heslo bylo úspěšně změněno",
            type: "success"
          };
          break;
        default:
          messages.value.form = {
            message: "Nastala neznámá chyba",
            type: "error"
          };
          break;
      }
    },
    async onRequestError() {
      messages.value.form = {
        message: "Nastala neznámá chyba",
        type: "error"
      }
    },
  });

  loading.value = false;
};

//start checkToken on page load and set email from response to tokenEmail
onMounted(async (): Promise<void> => {
  const token: LocationQueryValue | LocationQueryValue[]  = useRoute().query.token;

  if (!token) tokenEmail.value = null;

  await apiFetch("/user/password/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      token: token
    },
    ignoreResponseError: true,
    async onResponse({ response }) {
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
    async onResponseError() {
      tokenEmail.value = null;
    },
  });

  loading.value = false;
});
</script>

<template>
  <div id="forgetPassword-reset-error" v-if="!tokenEmail">
    <div v-if="loading" class="loading-big">
      <Loading color="rgba(var(--description-color), 1)" size="24px" />
    </div>

    <div class="container card" v-if="!loading">
      <div class="head">
        <h2>Token je neplatný</h2>
        <p>Token pro resetování hesla je neplatný nebo vypršel, je potřeba vytvořit nový token a zkusit to znovu</p>
      </div>

      <div class="footer">
        <a href="/password/forget/new"><button type="submit">Zkusit znovu</button></a>
      </div>
    </div>
  </div>

  <div id="forgetPassword-reset" v-if="tokenEmail">
    <div class="container">
      <div class="head">
        <h2>Změna hesla</h2>
        <p>Resetujte si heslo k vašemu účtu zadáním nového hesla</p>
      </div>

      <form @submit.prevent="submitForm" @input="resetMessages">
        <div class="item">
          <label for="password">Nové heslo</label>
          <input type="password" id="password" name="password" placeholder="*****" v-model="formData.password">
          <p v-if="messages.password" class="error">{{ messages.password }}</p>
        </div>

        <div class="item">
          <label for="passwordAgain">Heslo znovu</label>
          <input type="password" id="passwordAgain" name="passwordAgain" placeholder="*****" v-model="formData.passwordAgain">
          <p v-if="messages.passwordAgain" class="error">{{ messages.passwordAgain }}</p>
        </div>

        <div class="footer">
          <button type="submit">Změnit heslo</button>
          <p v-if="messages.form.message" :class="{ 'error': messages.form.type === 'error', 'success': messages.form.type === 'success' }">{{ messages.form.message }}</p>
        </div>

        <div v-if="loading" class="loading">
          <Loading color="rgba(var(--description-color), 1)" size="6px" />
        </div>

        <a href="/">Máte změněno?</a>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#forgetPassword-reset, #forgetPassword-reset-error {
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

    .footer button {
      padding: 15px;
      border-radius: var(--normal-border-radius);
      background: rgba(var(--error-color), 1);
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
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;

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
