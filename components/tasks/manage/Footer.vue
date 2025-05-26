<script setup lang="ts">
import Loading from "~/components/basics/Loading.vue";
import { useSlots } from "vue";

const slots = useSlots();

const props = defineProps({
  resetFunction: {
    type: Function,
    required: true,
  },
  submitFunction: {
    type: Function,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="footer">
    <div class="content" v-if="slots.content">
      <slot name="content" />
    </div>

    <div class="line">
      <button type="submit" @click="() => props.submitFunction()">
        Uložit změny
        <Loading
          v-show="props.isLoading"
          size="5px"
          color="var(--btn-1-color)"
        />
      </button>
      <button type="reset" @click="() => props.resetFunction()">
        Resetovat změny
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.footer {
  display: flex;
  flex-direction: column;
  gap: 30px;

  .content {
    display: flex;
    flex-direction: column;
    gap: 10px;

    font-size: 16px;
    color: rgba(var(--description-color), 1);
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

  .error {
    font-size: 16px;
    color: rgba(var(--error-color), 1);
  }

  .success {
    font-size: 16px;
    color: rgba(var(--success-color), 1);
  }

  button {
    padding: 10px 15px;
    border-radius: var(--small-border-radius);
    transition: 0.2s;
    font-size: 16px;

    &[type="submit"] {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
      background: var(--btn-1-background);
      color: var(--btn-1-color);

      &:hover {
        background: var(--btn-1-hover-background);
      }
    }

    &[type="reset"] {
      background: var(--btn-2-background);
      color: var(--btn-2-color);
      border: var(--border-width) solid rgba(var(--border-color), 0.5);

      &:hover {
        background: var(--btn-2-hover-background);
      }
    }
  }
}
</style>
