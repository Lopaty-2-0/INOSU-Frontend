<script setup lang="ts">
const props = defineProps({
  icons: {
    type: Array<string>,
    default: ["material-symbols:add-rounded", "material-symbols:edit-rounded", "material-symbols:delete-rounded"]
  },
  texts: {
    type: Array<string>,
    default: ["Přidat", "Upravit", "Odstranit"]
  },
  description: {
    type: String,
    default: "Akční bar",
  },
  active: {
    type: Number
  },
  navigateTo: {
    type: Array<string>,
    default: ["#", "#", "#"]
  }
});
const emits = defineEmits(["selected"]);
</script>

<template>
  <div id="action-bar">
    <p class="description">{{ props.description }}</p>

    <div class="actions">
      <NuxtLink v-for="(_, index) in props.texts.length" :key="index"
        :class="{
          action: true,
          active: props.active === index,
          edit: index === 1,
          remove: index === 2,
          add: index === 0
        }" :to="props.navigateTo[index] || '#'" @click="emits('selected', index)"
      >
        <Icon size="1rem" class="icon" :name="props.icons[index] || 'material-symbols:radio-button-unchecked'"></Icon>
        {{ props.texts[index] }}
      </NuxtLink>
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
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 10px 15px;
      border-radius: var(--small-border-radius);
      font-size: 16px;
      transition: 0.2s;
      background: var(--btn-2-background);
      color: var(--btn-2-color);
      border: var(--border-width) solid rgba(var(--border-color), 0.5);

      .icon {
        font-size: 16px;
      }

      &:hover, &.active {
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
</style>