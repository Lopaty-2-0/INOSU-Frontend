<script setup lang="ts">
import { useI18n } from "#imports";
import { computed } from "vue";

const { t } = useI18n();

const props = defineProps({
  icons: {
    type: Array as () => string[],
    default: [
      "material-symbols:add-rounded",
      "material-symbols:edit-rounded",
      "material-symbols:delete-rounded",
    ],
  },
  texts: {
    type: Array as () => string[],
    default: null,
  },
  actions: {
    type: Array as () => string[],
    default: ["add", "edit", "remove"],
  },
  separatorIndexes: {
    type: Array as () => number[],
    default: [],
  },
  separatorIcon: {
    type: String,
    default: "material-symbols:square-rounded",
  },
  description: {
    type: String as () => string | null,
    default: null,
  },
  active: {
    type: Number,
  },
  navigateTo: {
    type: Array as () => string[],
    default: ["#", "#", "#"],
  },
});
const emits = defineEmits(["selected"]);

const resolvedTexts = computed(() => props.texts ?? [t('actionBar.add'), t('actionBar.edit'), t('actionBar.remove')]);
const resolvedDescription = computed(() => props.description ?? t('actionBar.description'));
</script>

<template>
  <div id="action-bar">
    <p class="description">{{ resolvedDescription }}</p>

    <div class="actions">
      <div class="action"
       v-for="(_, index) in resolvedTexts.length"
       :key="index"
      >
        <a
          :class="{
            active: props.active === index,
            [props.actions[index] || '']: true,
          }"
          :href="props.navigateTo[index] || '#'"
          @click="emits('selected', index)"
        >
          <Icon
              class="icon"
              :name="
            props.icons[index] || 'material-symbols:radio-button-unchecked'
          "
          ></Icon>
          {{ resolvedTexts[index] }}
        </a>

        <Icon v-if="props.separatorIndexes.includes(index)" :name="separatorIcon" class="separator icon" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  background: var(--actionBar-background);
  padding: 10px 30px;
  width: calc(100% + 60px);
  margin-top: -30px;
  margin-left: -30px;
  color: rgba(var(--description-color), 1);
  border-bottom: 1px solid rgba(var(--border-color), 0.5);
  flex-wrap: wrap;

  .description {
    font-size: 16px;
    color: rgba(var(--description-color), 1);
    font-weight: 500;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    &::-webkit-scrollbar {
      height: 5px;
    }

    .action {
      display: flex;
      align-items: center;

      .separator {
        color: rgba(var(--description-color), 0.5);
        font-size: 16px;
        margin-left: 10px;
      }

      a {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 10px 15px;
        border-radius: var(--small-border-radius);
        font-size: 16px;
        transition: 0.2s;
        background: var(--btn-2-background);
        color: var(--btn-2-color);
        text-decoration: none;
        border: var(--border-width) solid rgba(var(--border-color), 0.5);

        .icon {
          font-size: 16px;
        }

        &:hover,
        &.active {
          color: var(--actionBar-actions-default-color);
          background: rgba(var(--actionBar-actions-default-background), 1);
          border-color: rgba(var(--actionBar-actions-default-border), 1);

          &.add {
            color: var(--actionBar-actions-add-color);
            background: rgba(var(--actionBar-actions-add-background), 1);
            border-color: rgba(var(--actionBar-actions-add-border), 1);
          }

          &.edit {
            color: var(--actionBar-actions-edit-color);
            background: rgba(var(--actionBar-actions-edit-background), 1);
            border-color: rgba(var(--actionBar-actions-edit-border), 1);
          }

          &.remove {
            color: var(--actionBar-actions-remove-color);
            background: rgba(var(--actionBar-actions-remove-background), 1);
            border-color: rgba(var(--actionBar-actions-remove-border), 1);
          }
        }

        &.active {
          cursor: default;
        }
      }
    }
  }
}
</style>
