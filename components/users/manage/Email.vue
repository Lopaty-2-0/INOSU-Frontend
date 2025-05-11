<script setup lang="ts">
import {ref, watch} from "vue";
import { useAlertsStore } from "~/stores/alerts";

const props = defineProps({
  oldEmail: {
    type: String,
    required: true,
  },
  reset: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update"]);
const email = ref<{ input: string, error: string }>({
  input: props.oldEmail,
  error: "",
});
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const onInput = () => {
  if (email.value.input && !emailRegex.test(email.value.input)) email.value.error = "Špatný formát e-mailu";
  else email.value.error = "";

  const isUpdated = email.value.input !== "" && email.value.input !== props.oldEmail && email.value.error === "";

  emits("update", { email: isUpdated ? email.value.input : undefined });
};

const pasteEmail = () => {
  try {
    navigator.clipboard.readText().then((text: string) => {
      email.value.input = text;

      onInput();
    });
  } catch {
    useAlertsStore().addAlert({ type: "warning", title: "Vložení URL", message: "Váš prohlížeč nepodporuje vkládání." });
  }
};

watch(() => props.reset, (reset: boolean) => {
  if (reset) {
    email.value.error = "";
    email.value.input = props.oldEmail;
  }
});
</script>

<template>
  <div class="section">
    <slot />

    <div class="item url">
      <div class="content">
        <label for="email">E-mail</label>
        <div class="line">
          <input :class="{ error: email.error }" type="email" id="email" placeholder="example.email@gmail.com" v-model="email.input" @input="onInput" />
          <div class="icon-div" @click="pasteEmail"><Icon class="icon" name="material-symbols:content-paste"></Icon></div>
        </div>

        <p v-if="email.error" class="input-error">{{ email.error}}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;

  .line {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    flex-wrap: wrap;

    input {
      flex: 1;
      min-width: 5rem;
    }
  }

  .update {
    color: var(--error-color);
  }

  .item {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    flex: 1;
    align-items: flex-end;

    &.url .icon-div {
      padding: 0.825rem 1rem;
      border: 1px solid var(--border-color);
      color: var(--btn-2-color);
      background: var(--btn-2-background);
      border-radius: 0.375rem;
      cursor: pointer;
      transition: 0.2s;
      line-height: 0;
      display: flex;
      justify-content: center;
      align-items: center;

      .icon {
        font-size: 1rem;
      }

      &:hover {
        background: var(--btn-2-hover-background);
      }
    }

    .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      label {
        color: var(--mini-title-color);
        font-size: 0.805rem;
        font-weight: 500;
      }

      .input-error {
        font-size: 0.875rem;
        color: var(--error-color);
      }

      input {
        border-radius: 0.375rem;
        font-size: 0.875rem;
        outline: none;
        padding: 0.825rem 1rem;
        border: 1px solid var(--border-color);
        min-width: 5rem;
        background: var(--input-background);
        color: var(--input-color);

        &:focus {
          border-color: var(--main-color);
        }

        &.error {
          border-color: var(--error-color);
        }
      }
    }
  }
}
</style>