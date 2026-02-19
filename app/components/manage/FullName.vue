<script setup lang="ts">
import {ref, watch} from "vue";
import Input from "~/components/ui/Input.vue";

const props = defineProps({
  oldFullName: {
    type: Object as () => { name: string, surname: string },
    required: true,
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
  inputData.value.name.updated = inputData.value.name.input ? inputData.value.name.input !== props.oldFullName?.name : false;
  inputData.value.surname.updated = inputData.value.surname.input ? inputData.value.surname.input !== props.oldFullName?.surname : false;

  const updateUserData: { name?: string | undefined, surname?: string | undefined } = {};

  if (inputData.value.name.updated) updateUserData.name = inputData.value.name.input;
  if (inputData.value.surname.updated) updateUserData.surname = inputData.value.surname.input;

  emits("update", updateUserData);
};

const reset = (): void => {
  inputData.value.name.updated = false;
  inputData.value.surname.updated = false;
  inputData.value.name.input = props.oldFullName?.name;
  inputData.value.surname.input = props.oldFullName?.surname;
};

defineExpose({ reset });
</script>

<template>
  <div class="section">
    <slot />

    <div class="items full-name">
      <div class="section">
        <div class="content">
          <label for="firstName">Jméno <span class="update" v-if="inputData.name.updated">(aktualizováno)</span></label>
          <Input type="text" id="firstName" name="firstName" :placeholder="props.oldFullName?.name ? props.oldFullName?.name : 'Jan'" v-model.trim="inputData.name.input" @input="onInput" />
        </div>
      </div>

      <div class="section">
        <div class="content">
          <label for="secondName">Příjmení <span class="update" v-if="inputData.surname.updated">(aktualizováno)</span></label>
          <Input type="text" id="secondName" name="secondName" :placeholder="props.oldFullName?.surname ? props.oldFullName?.surname : 'Novák'" v-model.trim="inputData.surname.input" @input="onInput" />
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

  .items {
    display: flex;
    gap: 30px;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;

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
      }
    }
  }
}
</style>
