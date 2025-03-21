<script lang="ts" setup>
import Loading from "~/components/basics/Loading.vue";
import apiFetch from "../../../utils/apiFetch";
import { ref } from "vue";

useHead({
  title: "Panel | Zapomenuté heslo",
  meta: [
    { name: "description", content: "Zapomenuté heslo" }
  ]
});

const messages = ref<{ email: string, form: { message: string, type: "error" | "success" | null } }>({ email: "", form: { message: "", type: null }});
const email = ref<string>("");
const loading = ref<boolean>(false);
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//check user inputs
const validateForm = (): void => {
  resetMessages();

  if (!emailRegex.test(email.value)) messages.value.email = "Špatný formát e-mailu";
  if (!email.value) messages.value.email = "Zadejte váš e-mail";
};

//reset messages when user start typing
const resetMessages = (): void => {
  messages.value = { email: "", form: { message: "", type: null }};
};

//check user inputs and send request to API
const submitForm = async (): Promise<void> => {
  validateForm();

  if (!messages.value.email) {
    loading.value = true;

    await apiFetch("user/password/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        email: email.value
      },
      async onResponse({response}) {
        const resCode: string = response._data.resCode.toString();

        switch (resCode) {
          case "12041":
            messages.value.form = { message: "E-mail byl odeslán", type: "success" };
            break;
        }
      },
      async onRequestError() {
        messages.value.form = { message: "Nastala neznámá chyba", type: "error" };
      },
      async onResponseError({response, error}) {
        const errorResCode: string = response._data.resCode.toString();

        messages.value.form = { type: "error", message: response._data.data.message };

        switch (errorResCode) {
          case "12010":
            messages.value.form = { type: "error", message: "E-mail nebyl zadán" };
            break;
          case "12020":
            messages.value.form = { type: "error", message: "Špatný formát e-mailu" };
            break;
          case "12030":
            messages.value.form = { type: "error", message: "Tento e-mail nebyl nalezen" };
            break;
        }
      },
    }).finally(() => {
      loading.value = false;
    });
  }
};
</script>

<template>
  <div id="forgetPassword-new">
    <div class="container">
      <div class="head">
        <h2>Zapomenuté heslo</h2>
        <p>Zadejte e-mail pro zaslání odkazu pro resetování.</p>
      </div>

      <form @submit.prevent="submitForm" @input="resetMessages">
        <div class="item">
          <label for="email">E-mail</label>
          <input type="text" id="email" name="email" placeholder="test@test.com" v-model="email">
          <p v-if="messages.email.length" class="error">{{ messages.email }}</p>
        </div>

        <div class="footer">
          <button type="submit">Zaslat e-mail</button>
          <p v-if="messages.form.message.length" :class="{ 'error': messages.form.type === 'error', 'success': messages.form.type === 'success' }">{{ messages.form.message }}</p>
        </div>

        <div v-if="loading" class="loading">
          <Loading color="rgba(var(--description-color), 1)" size="6px" />
        </div>

        <a href="/">Vzpomněli jste si?</a>
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
