<script setup lang="ts">
import {ref, watch} from "vue";
import Input from "~/components/ui/Input.vue";

const props = defineProps({
  oldName: {
    type: String,
    required: true,
  }
});

const emits = defineEmits(["update"]);
const name = ref<{ input: string, updated: boolean }>({ input: props.oldName, updated: false });

const onInput = () => {
  name.value.updated = name.value.input !== "" && name.value.input !== props.oldName;

  emits("update", name.value.updated ? name.value.input : undefined);
};

const reset = (): void => {
  name.value.updated = false;
  name.value.input = props.oldName;
};

defineExpose({ reset })
</script>

<template>
  <div class="section">
    <slot />

    <div class="items name">
      <div class="section">
        <div class="content">
          <label for="name">Název</label>
          <Input type="text" id="name" name="name" :placeholder="props.oldName ? props.oldName : 'Zadejte název'" v-model.trim="name.input" @input="onInput" />
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
