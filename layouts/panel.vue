<script lang="ts" setup>
import Sidebar from "~/components/Sidebar.vue";
import Loading from "~/components/basics/Loading.vue";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAccountStore } from "../stores/account";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const { getLoading: accountLoading } = storeToRefs(useAccountStore());

const loading = ref<boolean>(true);

onMounted((): void => {
  loading.value = false;
});
</script>

<template>
  <div class="loading" v-if="loading || accountLoading || props.loading">
    <Loading color="rgba(var(--description-color), 1)" />
  </div>
  <div v-else>
    <div class="header">
      <Sidebar />
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
  background: var(--main-background);
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
  background: var(--main-background);
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
