<script setup lang="ts">
import {ref, watch} from "vue";
import InputMenu from "~/components/ui/InputMenu.vue";

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
const selected = ref<string[]>(role.value.input ? [role.value.input] : []);
const roles = ref<string[]>([...props.roles]);

const onCreate = (item: string): void => {
  roles.value.push(item);
};

watch(() => selected.value, (newVal: string[]): void => {
  role.value.input = newVal[0] || "";
  emits("update", { role: role.value.input !== props.oldRole ? role.value.input : undefined });
  role.value.error = "";
});

watch(() => props.reset, (reset: boolean): void => {
  if (reset) {
    role.value.error = "";
    role.value.input = props.oldRole;
    open.value = false;
    selected.value = role.value.input ? [role.value.input] : [];
    roles.value = [...props.roles];
  }
});
</script>

<template>
  <div class="section">
    <slot />

    <div class="section">
      <div class="content">
        <label for="roleInput">Role</label>

        <InputMenu
          :items="roles"
          v-model="selected"
          :error="!!role.error"
          @create="onCreate"
          create-item
        />

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
