<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "updateUser", // "updateUser" | "addUser"
  },
  reset: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update"]);
const passwords = ref<{
  old: { input: string; error: string };
  new: { input: string; error: string };
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

  if (props.type === "updateUser" && passwords.value.old.input === "")
    passwords.value.old.error = "Pole musí být vyplněno.";
  else if (props.type === "addUser" && passwords.value.old.input.length < 5)
    passwords.value.old.error = "Heslo musí mít alespoň 5 znaků.";
  else if (passwords.value.new.input.length < 5)
    passwords.value.new.error = "Heslo musí mít alespoň 5 znaků.";
  else passwords.value.old.error = "";

  switch (props.type) {
    case "updateUser":
      emits("update", {
        old: !passwords.value.old.error ? passwords.value.old.input : undefined,
        new: !passwords.value.new.error ? passwords.value.new.input : undefined,
      });
      break;
    case "addUser":
      emits("update", {
        password:
          !passwords.value.old.error && passwords.value.old.input
            ? passwords.value.old.input
            : undefined,
      });
      break;
  }
};

const showPassword = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

watch(
  () => props.reset,
  (reset: boolean) => {
    if (reset) {
      resetErrors();

      passwords.value.old.input = "";
      passwords.value.new.input = "";
    }
  }
);
</script>

<template>
  <div class="section">
    <slot />

    <div class="items reset-password">
      <div class="item old-password">
        <div class="content">
          <label for="oldPassword">{{
            props.type === "addUser" ? "Heslo" : "Staré heslo"
          }}</label>
          <div class="line">
            <input
              :type="isPasswordVisible ? 'text' : 'password'"
              id="oldPassword"
              :class="{ error: passwords.old.error }"
              name="oldPassword"
              placeholder="******"
              v-model="passwords.old.input"
              @input="onInput"
            />
            <div
              class="icon-div"
              v-if="!isPasswordVisible"
              @click="showPassword()"
            >
              <Icon
                name="material-symbols:visibility-rounded"
                class="icon"
                size="16px"
              ></Icon>
            </div>
            <div class="icon-div" v-else @click="showPassword()">
              <Icon
                name="material-symbols:visibility-off-rounded"
                class="icon"
                size="16px"
              ></Icon>
            </div>
          </div>
          <p v-if="passwords.old.error" class="input-error">
            {{ passwords.old.error }}
          </p>
        </div>
      </div>

      <div class="item" v-if="props.type !== 'addUser'">
        <div class="content">
          <label for="newPassword">Nové heslo</label>
          <input
            type="password"
            id="newPassword"
            :class="{ error: passwords.new.error }"
            name="newPassword"
            placeholder="******"
            ref="newPassword"
            v-model="passwords.new.input"
            @input="onInput"
          />
          <p v-if="passwords.new.error" class="input-error">
            {{ passwords.new.error }}
          </p>
        </div>
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

  .update {
    color: rgba(var(--error-color), 1);
  }

  .items {
    gap: 30px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;

    .item {
      display: flex;
      flex-direction: row;
      gap: 20px;
      flex: 1;
      align-items: flex-end;

      &.old-password {
        .icon-div {
          padding: 10px 15px;
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

        input {
          min-width: 150px;
        }
      }

      .content {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;

        label {
          color: var(--mini-title-color);
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
        }

        .input-error {
          font-size: 16px;
          color: rgba(var(--error-color), 1);
        }

        .input-success {
          font-size: 16px;
          color: rgba(var(--success-color), 1);
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
