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
const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const onInput = (): void => {
  if (email.value.input && !emailRegex.test(email.value.input)) email.value.error = "Špatný formát e-mailu";
  else email.value.error = "";

  const isUpdated: boolean = email.value.input !== "" && email.value.input !== props.oldEmail && email.value.error === "";

  emits("update", { email: isUpdated ? email.value.input : undefined });
};

const pasteEmail = (): void => {
  try {
    navigator.clipboard.readText().then((text: string) => {
      email.value.input = text;

      onInput();
    });
  } catch {
    useAlertsStore().addAlert({ type: "warning", title: "Vložení URL", message: "Váš prohlížeč nepodporuje vkládání." });
  }
};

watch(() => props.reset, (reset: boolean): void => {
  if (reset) {
    email.value.error = "";
    email.value.input = props.oldEmail;
  }
});
</script>

<template>
  <div class="section">
    <slot />

    <div class="section url">
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
  gap: 30px;
  width: 100%;

  .update {
    color: rgba(var(--error-color), 1);
  }

  .line {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    flex-wrap: wrap;

    input {
      flex: 1;
    }
  }

  .section {
    display: flex;
    flex-direction: row;
    gap: 20px;
    flex: 1;
    align-items: flex-end;

    &.url .icon-div {
      padding: 15px;
      border: var(--border-width) solid rgba(var(--border-color), 0.5);
      color: var(--btn-2-color);
      background: var(--btn-2-background);
      border-radius: var(--normal-border-radius);
      cursor: pointer;
      transition: 0.2s;
      line-height: 0;
      display: flex;
      justify-content: center;
      align-items: center;

      .icon {
        font-size: 16px;
      }

      &:hover {
        background: var(--btn-2-hover-background);
      }
    }

    .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .input-error {
        font-size: 16px;
        color: rgba(var(--error-color), 1);
      }

      label {
        color: var(--mini-title-color);
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
      }

      input {
        border-radius: var(--normal-border-radius);
        font-size: 16px;
        outline: none;
        padding: 15px;
        border: var(--border-width) solid rgba(var(--border-color), 0.5);
        min-width: 150px;
        background: var(--input-background);
        color: var(--input-color);

        &:focus {
          border-color: rgba(var(--main-color), 1);
        }

        &.error {
          border-color: rgba(var(--error-color), 1);
        }
      }
    }
  }
}
</style>