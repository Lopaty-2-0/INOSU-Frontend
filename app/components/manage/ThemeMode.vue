<script setup lang="ts">
import { ref, watch } from "vue";
import type { AccountTheme } from "~/types/account";
import Card from "~/components/ui/Card.vue";

const props = defineProps({
  oldTheme: {
    type: String as () => AccountTheme,
    required: true,
  },
});

const emits = defineEmits(["update"]);
const activeTheme = ref<AccountTheme>(props.oldTheme);

const setTheme = (newTheme: AccountTheme): void => {
  activeTheme.value = newTheme;

  emits("update", newTheme === props.oldTheme ? undefined : newTheme);
};

const reset = (): void => {
  activeTheme.value = props.oldTheme;
};

defineExpose({ reset });
</script>

<template>
  <div class="section">
    <slot />

    <div class="items">
      <Card class="card" :class="{ active: activeTheme === 'light' }" @click="setTheme('light')">
        <div class="body">
          <div class="info">
            <h4>Světlý</h4>
            <p>Váš panel bude mít světlý motiv</p>
          </div>
          <img src="../../assets/images/theme-light.svg" alt="Světlý režim" />
        </div>
      </Card>

      <Card class="card" :class="{ active: activeTheme === 'dark' }" @click="setTheme('dark')">
        <div class="body">
          <div class="info">
            <h4>Tmavý</h4>
            <p>Váš panel bude mít tmavý motiv</p>
          </div>
          <img src="../../assets/images/theme-dark.svg" alt="Tmavý režim" />
        </div>
      </Card>

      <Card class="card" :class="{ active: activeTheme === 'system' }" @click="setTheme('system')">
        <div class="body">
          <div class="info">
            <h4>Systém</h4>
            <p>Motiv bude podle systému vašeho zařízení</p>
          </div>
          <img src="../../assets/images/theme-system.svg" alt="Systémový režim"/>
        </div>
      </Card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;

  .items {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 30px;
    width: 100%;

    .card {
      display: flex;
      flex: 1;
      transition: 0.2s;
      cursor: pointer;

      .body {
        display: flex;
        flex-direction: column;
        gap: 20px;
        flex-wrap: wrap;
        justify-content: space-between;
        height: 100%;
      }

      &:hover {
        background: var(--card-1-hover-background);
      }

      &.active {
        border-color: rgba(var(--main-color), 1);

        .info h4 {
          color: rgba(var(--main-color), 1);
        }
      }

      .info {
        display: flex;
        flex-direction: column;
        gap: 10px;

        h4 {
          font-size: 16px;
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
        border-radius: var(--normal-border-radius);
      }
    }
  }
}
</style>
