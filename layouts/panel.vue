<script lang="ts" setup>
import Sidebar from "~/components/Sidebar.vue";
import Loading from "~/components/basics/Loading.vue";
import { ref, onMounted } from "vue";

const loading = ref<boolean>(true);

onMounted((): void => {
  loading.value = false;
});
</script>

<template>
  <div>
    <div class="header">
      <Sidebar />
      <slot name="header" />
    </div>
    <div class="page">
      <template v-if="!loading">
        <slot name="content" />
      </template>

      <div class="loading" v-else>
        <Loading color="var(--title-color)" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page {
  margin-top: 5rem;
  margin-left: 15.625rem;
  padding: 1.875rem;
  transition: 0.2s;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  width: auto;
  background: var(--main-background);
  position: relative;
  height: 100%;
  min-height: calc(100vh - 80px);

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: calc(100vh - 140px);
    background: var(--main-background);
  }
}

@media (max-width: 750px) {
  .page {
    margin-left: 0;
  }
}
</style>
