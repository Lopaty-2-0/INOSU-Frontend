<script setup lang="ts">
import {ref, watch} from "vue";

const props = defineProps({
  oldTheme: {
    type: Number, // "dark" | "light" | "system"
    required: true,
  },
  reset: {
    type: Boolean,
    default: false,
  }
});

const emits = defineEmits(["update"]);
const activeThemeIndex = ref<number>(props.oldTheme);

const setTheme = (index: number): void => {
  activeThemeIndex.value = index;

  emits("update", index === props.oldTheme ? undefined : index);
};

watch(() => props.reset, (reset: boolean): void => {
  if (reset) activeThemeIndex.value = props.oldTheme;
});
</script>

<template>
  <div class="section">
    <slot />

    <ul class="items">
      <li :class="{ 'active': activeThemeIndex === 0 }" @click="setTheme(0)">
        <div class="info">
          <h4>Světlý</h4>
          <p>Váš panel bude mít světlý motiv</p>
        </div>
        <img src="../../../assets/images/theme-light.svg" alt="Světlý režim">
      </li>
      <li :class="{ 'active': activeThemeIndex === 1 }" @click="setTheme(1)">
        <div class="info">
          <h4>Tmavý</h4>
          <p>Váš panel bude mít tmavý motiv</p>
        </div>
        <img src="../../../assets/images/theme-dark.svg" alt="Tmavý režim">
      </li>
      <li :class="{ 'active': activeThemeIndex === 2 }" @click="setTheme(2)">
        <div class="info">
          <h4>Systém</h4>
          <p>Váš panel bude mít motiv podle systému vašeho zařízení</p>
        </div>
        <img src="../../../assets/images/theme-system.svg" alt="Systémový režim">
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.section {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .items {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: flex-start;

    li {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 1rem;
      padding: 1.5rem;
      border-radius: 0.5rem;
      border: var(--border-width) solid rgba(var(--border-color), 0.5);
      flex-wrap: wrap;
      transition: 0.2s;
      cursor: pointer;

      &.active, &:hover {
        border-color: rgba(var(--main-color), 1);

        .info h4 {
          color: rgba(var(--main-color), 1);
        }
      }

      .info {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        h4 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--title-color);
          transition: 0.2s;
        }

        p {
          color: rgba(var(--description-color), 1);
        }
      }

      img {
        width: 100%;
        min-width: 150px;
        max-height: 300px;
        object-fit: cover;
        border-radius: 0.5rem;
      }
    }
  }
}
</style>
