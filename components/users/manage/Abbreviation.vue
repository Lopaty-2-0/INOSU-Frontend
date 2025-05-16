<script setup lang="ts">
import {ref, watch} from "vue";
import { useAlertsStore } from "~/stores/alerts";

const props = defineProps({
  fullName: {
    type: Object as () => { name: string | undefined, surname: string | undefined },
    required: false,
  },
  oldAbbreviation: {
    type: String,
    required: true,
  },
  reset: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update"]);
const abbreviation = ref<{ input: string, error: string }>({ input: props.oldAbbreviation, error: "" });

const onInput = (): void => {
  if (abbreviation.value.input.length > 4) abbreviation.value.error = "Délka přezdívky může být max 4 znaky.";
  else abbreviation.value.error = "";

  const isUpdated: boolean = abbreviation.value.input !== "" && abbreviation.value.input.toLowerCase() !== props.oldAbbreviation.toLowerCase() && abbreviation.value.error === "";

  emits("update", { abbreviation: isUpdated ? abbreviation.value.input : undefined });
};

const generateAbbreviation = (): void => {
  if (props.fullName?.name && props.fullName?.surname) {
    const name: string = props.fullName.name;
    const surname: string = props.fullName.surname;

    abbreviation.value.input = `${name[0]?.toUpperCase() || ""}${name[1]?.toUpperCase() || ""}${surname[0]?.toUpperCase() || ""}${surname[1]?.toUpperCase() || ""}`;
    onInput();
  } else {
    abbreviation.value.error = "Ze jména a příjmení nelze vygenerovat přezdívku.";
    abbreviation.value.input = "";
  }
};

watch(() => props.reset, (reset: boolean): void => {
  if (reset) {
    abbreviation.value.error = "";
    abbreviation.value.input = props.oldAbbreviation;
  }
});
</script>

<template>
  <div class="section">
    <slot />

    <div class="item url">
      <div class="content">
        <label for="abbreviation">Přezdívka</label>
        <div class="line">
          <input :class="{ error: abbreviation.error }" type="text" id="abbreviation" placeholder="JUDE" v-model="abbreviation.input" @input="onInput" />
          <div class="icon-div" @click="generateAbbreviation"><Icon class="icon" name="material-symbols:wand-stars-rounded"></Icon></div>
        </div>

        <p v-if="abbreviation.error" class="input-error">{{ abbreviation.error }}</p>
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

  .item {
    display: flex;
    flex-direction: row;
    gap: 20px;
    flex: 1;
    align-items: flex-end;

    &.url .icon-div {
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

      &:hover {
        background: var(--btn-2-hover-background);
      }
    }

    .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .input-error {
        font-size: 16px;
        color: rgba(var(--error-color), 1);
      }

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
        text-transform: uppercase;

        &:focus {
          border-color: rgba(var(--main-color), 1);
        }

        &.error {
          border-color: rgba(var(--error-color), 1);
        }
      }
    }
  }
}
</style>
