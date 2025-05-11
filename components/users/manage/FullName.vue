<script setup lang="ts">
import {ref, watch} from "vue";

const props = defineProps({
  oldFullName: {
    type: Object as () => { name: string, surname: string },
    required: true,
  },
  reset: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(["update"]);
const inputData = ref<{
  name: { updated: boolean, input: string },
  surname: { updated: boolean, input: string }
}>({
  name: { updated: false, input: props.oldFullName?.name },
  surname: { updated: false, input: props.oldFullName?.surname }
});

const onInput = () => {
  inputData.value.name.updated = inputData.value.name.input !== "" && inputData.value.name.input !== props.oldFullName?.name;
  inputData.value.surname.updated = inputData.value.surname.input !== "" && inputData.value.surname.input !== props.oldFullName?.surname;

  const updateUserData: { name?: string | undefined, surname?: string | undefined } = {};

  if (inputData.value.name.updated) updateUserData.name = inputData.value.name.input;
  if (inputData.value.surname.updated) updateUserData.surname = inputData.value.surname.input;

  emits("update", updateUserData);
};

watch(() => props.reset, (reset: boolean) => {
  if (reset) {
    inputData.value.name.updated = false;
    inputData.value.surname.updated = false;
    inputData.value.name.input = props.oldFullName?.name;
    inputData.value.surname.input = props.oldFullName?.surname;
  }
});
</script>

<template>
  <div class="section">
    <slot />

    <div class="items full-name">
      <div class="item">
        <div class="content">
          <label for="firstName">Jméno <span class="update" v-if="inputData.name.updated">(aktualizováno)</span></label>
          <input type="text" id="firstName" name="firstName" :placeholder="props.oldFullName?.name ? props.oldFullName?.name : 'Jan'" v-model="inputData.name.input" @input="onInput">
        </div>
      </div>

      <div class="item">
        <div class="content">
          <label for="secondName">Příjmení <span class="update" v-if="inputData.surname.updated">(aktualizováno)</span></label>
          <input type="text" id="secondName" name="secondName" :placeholder="props.oldFullName?.surname ? props.oldFullName?.surname : 'Novák'" v-model="inputData.surname.input" @input="onInput">
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
  width: 100%;

  .update {
    color: var(--error-color);
  }

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

  .items {
    display: flex;
    gap: 2rem;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;

    .item {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
      flex: 1;
      align-items: flex-end;

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

        input {
          border-radius: 0.375rem;
          font-size: 0.875rem;
          outline: none;
          padding: 0.825rem 1rem;
          border: 1px solid var(--border-color);
          background: var(--input-background);
          color: var(--input-color);

          &:focus {
            border-color: var(--main-color);
          }
        }
      }
    }
  }
}
</style>