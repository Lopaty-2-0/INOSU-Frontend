<script setup lang="ts">
import {ref, watch} from "vue";

const props = defineProps({
  roles: {
    type: Array as () => string[],
    required: true,
  },
  oldRole: {
    type: String,
    required: true,
  },
  reset: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update"]);
const open = ref<boolean>(false);
const role = ref<{ input: string, error: string }>({ input: props.oldRole, error: "" });
const icons = {
  select: "material-symbols:done-rounded",
  selected: "material-symbols:close-rounded",
  open: "material-symbols:arrow-downward-rounded",
  close: "material-symbols:arrow-upward-rounded"
};

const selectItem = (value: string): void => {
  role.value.error = "";

  if (value === role.value.input) {
    role.value.input = "";
    emits("update", { role: undefined });
    return;
  }

  role.value.input = value;

  emits("update", { role: role.value.input });
};

const onInput = (): void => {
  role.value.error = "";

  if (role.value.input) {
    if (role.value.input.length < 2) {
      role.value.error = "Nová role musí mít alespoň 2 znaky.";
    } else if (role.value.input.length > 45) {
      role.value.error = "Nová role může mít maximálně 45 znaků.";
    }
  }

  const isUpdated: boolean = role.value.input !== "" && role.value.input !== props.oldRole && role.value.error === "";

  emits("update", { role: isUpdated ? role.value.input : undefined });
};

const toggleDropdown = (): void => {
  open.value = !open.value;
};

watch(() => props.reset, (reset: boolean): void => {
  if (reset) {
    role.value.error = "";
    role.value.input = props.oldRole;
    open.value = false;
  }
});
</script>

<template>
  <div class="section">
    <slot />

    <div class="item">
      <div class="content">
        <label for="roleInput">Role</label>

        <div class="dropdown" :class="{ open: open, error: role.error }">
          <div class="title">
            <input id="roleInput" placeholder="Vyberte / Vytvořte roli" @input="onInput" v-model="role.input" />

            <div class="icon-div" @click="toggleDropdown">
              <Icon class="icon" :name="open ? icons.close : icons.open" />
            </div>
          </div>

          <div class="dropdown-content" v-show="open">
            <div
              v-for="(item, index) in props.roles"
              :key="index"
              :class="{ selected: role.input === item }"
              class="item"
              @click="selectItem(item)"
            >
              <Icon class="icon" :name="role.input === item ? icons.select : icons.selected" />
              <span>{{ item }}</span>
            </div>
          </div>
        </div>

        <p v-if="role.error" class="input-error">{{ role.error }}</p>
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

  .dropdown {
    position: relative;
    display: flex;
    width: 100%;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &.error {
      .title input {
        border: var(--border-width) solid rgba(var(--error-color), 1);
      }
    }

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: 0.2s;
      width: 100%;
      gap: 10px;

      input {
        padding: 15px 0 15px 15px;
        width: 100%;
        background: transparent;
        outline: none;
        border-radius: var(--normal-border-radius);
        font-size: 16px;
        border: var(--border-width) solid rgba(var(--border-color), 0.5);
        background: var(--input-background);
        color: var(--input-color);

        &:focus {
          border-color: rgba(var(--main-color), 1);
        }
      }

      .icon-div {
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
      }
    }

    .dropdown-content {
      position: absolute;
      display: flex;
      flex-direction: column;
      transition: 0.2s;
      margin-top: 10px;
      border-radius: var(--normal-border-radius);
      font-size: 16px;
      outline: none;
      border: var(--border-width) solid rgba(var(--border-color), 0.5);
      background: var(--input-background);
      color: var(--input-color);
      width: 100%;
      word-break: break-word;
      top: 100%;
      z-index: 5;
      left: 0;

      .item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px;
        transition: 0.2s;
        cursor: pointer;

        .icon {
          font-size: 16px;
          color: rgba(var(--description-color), 1);
        }

        &.selected {
          .icon, span {
            color: rgba(var(--main-color), 1);
          }
        }

        &:hover {
          background: var(--input-background-hover);
        }

        &:last-child {
          border-bottom-left-radius: var(--normal-border-radius);
          border-bottom-right-radius: var(--normal-border-radius);
        }

        &:first-child {
          border-top-left-radius: var(--normal-border-radius);
          border-top-right-radius: var(--normal-border-radius);
        }

        &:not(:last-child) {
          border-bottom: var(--border-width) solid rgba(var(--border-color), 1);
        }
      }
    }
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

  .item {
    display: flex;
    flex-direction: row;
    gap: 20px;
    flex: 1;
    align-items: flex-end;

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
    }
  }
}
</style>
