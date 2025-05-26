<script setup lang="ts">
import {ref, watch} from "vue";

const props = defineProps({
  oldCheck: {
    type: Boolean,
    required: false,
  },
  reset: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(["update"]);
const check = ref<{ input: boolean, updated: boolean }>({ input: props.oldCheck, updated: false });

const onInput = () => {
  check.value.updated = check.value.input !== props.oldCheck;

  emits("update", check.value.updated ? check.value.input : undefined);
};

watch(() => props.reset, (reset: boolean): void => {
  if (reset) {
    check.value.updated = false;
    check.value.input = props.oldCheck;
  }
});
</script>

<template>
  <div class="section">
    <slot />

    <div class="items needApprove">
      <div class="section">
        <div class="content">
          <input type="checkbox" id="needApprove" name="needApprove" :value="props.oldCheck" v-model="check.input" @change="onInput">
          <label for="needApprove">Nutné schválení</label>
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
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;

        input[type="checkbox"] {
          accent-color: rgba(var(--main-color), 1);
          height: 15px;
          width: 15px;
          border-radius: var(--mini-border-radius);
          cursor: pointer;
        }

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