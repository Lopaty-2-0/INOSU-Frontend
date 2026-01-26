<script lang="ts" setup>
import Sidebar from "~/components/layout/Sidebar.vue";
import Loading from "~/components/ui/Loading.vue";
import Alerts from "~/components/layout/Alerts.vue";
import {ref, onMounted} from "vue";
import { storeToRefs } from "pinia";
import {useLoadingStore} from "~/stores/loading";

const { isAccountDataLoading: isAccountDataLoading, isDataLoading: isDataLoading } = storeToRefs(useLoadingStore());
const isPageLoading = ref<boolean>(true);

onMounted((): void => {
  isPageLoading.value = false;
});
</script>

<template>
  <div class="loading" v-if="isPageLoading || isDataLoading || isAccountDataLoading">
    <Loading color="rgba(var(--description-color), 1)" />
  </div>
  <div v-else>
    <div class="header">
      <Sidebar />
      <Alerts />
      <slot name="header" />
    </div>
    <div class="page">
      <slot name="content" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100svh;
  background: rgba(var(--main-background), 1);
}

.page {
  margin-top: 80px;
  margin-left: 250px;
  padding: 30px;
  transition: 0.2s;
  display: flex;
  flex-direction: column;
  gap: 60px;
  width: auto;
  background: rgba(var(--main-background), 1);
  position: relative;
  height: 100%;
  min-height: calc(100vh - 80px);
}

@media (max-width: 750px) {
  .page {
    margin-left: 0;
  }
}
</style>
