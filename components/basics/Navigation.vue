<script setup lang="ts">
const props = defineProps({
  activeLinkId: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
    required: true,
  },
  links: {
    type: Array<{ name: string, path?: string, action?: Function }>,
    default: []
  },
});

const clickAction = (link: { name: string, path?: string, action?: Function }) => {
  if (typeof link.action === "function") {
    link.action();
  }
}
</script>

<template>
  <div class="navigation">
    <h3>{{ props.title }}</h3>
    <ul>
      <li v-for="(link, index) in props.links" :class="{ active: props.activeLinkId === index }" :key="index" @click="clickAction(link)">
        <Icon class="icon" size="1rem" name="material-symbols:play-arrow-rounded"></Icon>
        <NuxtLink :to="link.path" v-if="link.path">
          {{ link.name }}
        </NuxtLink>
        <p v-else>
          {{ link.name }}
        </p>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.navigation {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(var(--border-color), 1);
  padding: 2rem;

  h3 {
    font-weight: 600;
    font-size: 1.1rem;
    color: var(--title-color);
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    li {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.625rem;
      color: rgba(var(--description-color), 1);
      transition: 0.2s;
      cursor: pointer;
      font-size: 0.875rem;

      a {
        text-decoration: none;
        width: 100%;
      }

      .icon {
        font-size: 1rem;
      }


      &.active {
        color: rgba(var(--main-color), 1);
      }

      &:hover {
        color: rgba(var(--main-color), 1);
      }
    }
  }
}
</style>