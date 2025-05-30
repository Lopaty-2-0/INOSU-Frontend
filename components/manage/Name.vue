<script setup lang="ts">
import {ref, watch} from "vue";

const props = defineProps({
  oldName: {
    type: String,
    required: true,
  },
  reset: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(["update"]);
const name = ref<{ input: string, updated: boolean }>({ input: props.oldName, updated: false });

const onInput = () => {
  name.value.updated = name.value.input !== "" && name.value.input !== props.oldName;

  emits("update", name.value.updated ? name.value.input : undefined);
};

watch(() => props.reset, (reset: boolean) => {
  if (reset) {
    name.value.updated = false;
    name.value.input = props.oldName;
  }
});
</script>

<template>
  <div class="section">
    <slot />

    <div class="items name">
      <div class="section">
        <div class="content">
          <label for="name">Název</label>
          <input type="text" id="name" name="name" :placeholder="props.oldName ? props.oldName : 'Úkol 1'" v-model="name.input" @input="onInput">
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
        }
      }
    }
  }
}
</style>