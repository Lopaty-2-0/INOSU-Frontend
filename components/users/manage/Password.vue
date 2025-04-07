<script setup lang="ts">
import {ref, watch} from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "updateUser" // "updateUser" | "addUser"
  },
  reset: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(["update"]);
const passwords = ref<{
  old: { input: string, error: string },
  new: { input: string, error: string }
}>({
  old: { input: "", error: "" },
  new: { input: "", error: "" },
});

const isPasswordVisible = ref<boolean>(false);

const resetErrors = () => {
  passwords.value.old.error = "";
  passwords.value.new.error = "";
};

const onInput = () => {
  resetErrors();

  if (props.type === "updateUser" && passwords.value.old.input === "") passwords.value.old.error = "Pole musí být vyplněno.";
  else if (props.type === "addUser" && passwords.value.old.input.length < 6) passwords.value.old.error = "Heslo musí mít alespoň 6 znaků.";
  else if (passwords.value.new.input.length < 6) passwords.value.new.error = "Heslo musí mít alespoň 6 znaků.";
  else passwords.value.old.error = "";

  switch (props.type) {
    case "updateUser":
      emits("update", { old: passwords.value.old.input, new: passwords.value.new.input });
      break;
    case "addUser":
      emits("update", { password: passwords.value.old.error === "" && passwords.value.old.input ? passwords.value.old.input : undefined });
      break;
  }
}

const showPassword = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

watch(() => props.reset, (reset: boolean) => {
  if (reset) {
    resetErrors();

    passwords.value.old.input = "";
    passwords.value.new.input = "";
  }
});
</script>

<template>
  <div class="section">
    <slot />

    <div class="items reset-password">
      <div class="item old-password">
        <div class="content">
          <label for="oldPassword">{{ props.type === "addUser" ? "Heslo" : "Staré heslo" }}</label>
          <div class="line">
            <input :type="isPasswordVisible ? 'text' : 'password'" id="oldPassword" :class="{ error: passwords.old.error }" name="oldPassword" placeholder="******" v-model="passwords.old.input" @input="onInput">
            <div class="icon-div" v-if="!isPasswordVisible"  @click="showPassword()"><Icon name="material-symbols:visibility-rounded" class="icon" size="1rem"></Icon></div>
            <div class="icon-div" v-else  @click="showPassword()"><Icon name="material-symbols:visibility-off-rounded" class="icon" size="1rem"></Icon></div>
          </div>
          <p v-if="passwords.old.error" class="input-error">{{ passwords.old.error }}</p>
        </div>
      </div>

      <div class="item" v-if="props.type !== 'addUser'">
        <div class="content">
          <label for="newPassword">Nové heslo</label>
          <input type="password" id="newPassword" :class="{ error: passwords.new.error }" name="newPassword" placeholder="******" ref="newPassword" v-model="passwords.new.input" @input="onInput">
          <p v-if="passwords.new.error" class="input-error">{{ passwords.new.error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .line {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    flex-wrap: wrap;

    input {
      flex: 1;
    }
  }

  .update {
    color: rgba(var(--error-color), 1);
  }

  .items {
    gap: 2rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;

    .item {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
      flex: 1;
      align-items: flex-end;

      &.old-password {
        .icon-div {
          padding: 0.825rem 1rem;
          border: 1px solid rgba(var(--border-color), 1);
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

        input {
          min-width: 5rem;
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
          color: rgba(var(--error-color), 1);
        }

        .input-success {
          font-size: 0.875rem;
          color: rgba(var(--success-color), 1);
        }

        input {
          border-radius: 0.375rem;
          font-size: 0.875rem;
          outline: none;
          padding: 0.825rem 1rem;
          min-width: 5rem;
          border: 1px solid rgba(var(--border-color), 1);
          background: var(--input-background);
          color: var(--input-color);

          &:focus {
            border-color: rgba(var(--main-color), 1);
          }

          &.error {
            border-color: rgba(var(--error-color), 1);

            &:focus {
              border-color: rgba(var(--error-color), 1);
            }
          }
        }
      }
    }
  }
}
</style>