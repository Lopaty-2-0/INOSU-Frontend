<script setup lang="ts">
export type BreadcrumbItem = {
  label: string;
  icon?: string;
  to?: string;
  active?: boolean;
};

const props = defineProps({
  items: {
    type: Array as () => BreadcrumbItem[],
    required: true,
  },
  separatorIcon: {
    type: String,
    default: "material-symbols:chevron-right-rounded",
  },
});
</script>

<template>
  <nav class="breadcrumb">
    <ul>
      <li v-for="(item, index) in props.items" :key="index" class="item" :class="{ active: item.active }">
        <NuxtLink v-if="item.to" :to="item.to" class="link">
          <Icon v-if="item.icon" :name="item.icon" class="icon" />
          {{ item.label }}
        </NuxtLink>
        <span v-else class="link">
          <Icon v-if="item.icon" :name="item.icon" class="icon" />
          {{ item.label }}
        </span>

        <div class="separator" v-if="index < props.items.length - 1">
          <slot name="separator">
            <Icon :name="props.separatorIcon" class="icon" />
          </slot>
        </div>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.breadcrumb {
  ul {
    display: flex;
    align-items: center;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .item {
    display: flex;
    align-items: center;

    .link {
      display: flex;
      align-items: center;
      color: rgba(var(--description-color), 1);
      text-decoration: none;
      transition: 0.2s;
      gap: 5px;

      &:is(a) {
        cursor: pointer;

        &:hover {
          color: var(--mini-title-color);
        }
      }
    }

    .separator {
      margin: 0 10px;
      font-size: 20px;
      color: rgba(var(--description-color), 1);
      line-height: 0;
    }

    &.active .link {
      color: rgba(var(--main-color), 1);
    }
  }
}
</style>