<script lang="ts" setup>
import Sidebar from "~/components/layout/Sidebar.vue";
import Loading from "~/components/ui/Loading.vue";
import Alerts from "~/components/layout/Alerts.vue";
import {ref, onMounted} from "vue";
import { storeToRefs } from "pinia";
import {useLoadingStore} from "~/stores/loading";

const { t } = useI18n();

const { isAccountDataLoading: isAccountDataLoading, isDataLoading: isDataLoading, hasRateLimit: hasRateLimit } = storeToRefs(useLoadingStore());
const isPageLoading = ref<boolean>(true);

const refresh = (): void => {
  window.location.reload();
};

onMounted((): void => {
  isPageLoading.value = false;
});
</script>

<template>
  <div class="loading" v-if="!hasRateLimit && (isPageLoading || isDataLoading || isAccountDataLoading)">
    <Loading color="rgba(var(--description-color), 1)" />
  </div>
  <div v-else>
    <div class="header">
      <Sidebar />
      <Alerts />
      <slot name="header" />
    </div>
    <div class="page">
      <slot name="content" v-if="!hasRateLimit" />

      <div id="rate-limit" v-else>
        <div class="content">
          <div class="icon-div"><Icon name="material-symbols:error-rounded" class="icon"></Icon></div>

          <div class="text">
            <h1>{{ t('errors.429.title') }}</h1>
            <p>{{ t('errors.429.description') }}</p>
          </div>
          <div class="group-btn">
            <button class="primary" @click="refresh">{{ t('errors.429.tryAgain') }}</button>
          </div>
        </div>
      </div>
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

#rate-limit {
  width: 100%;
  height: calc(100svh - 200px);
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
    align-items: center;
    text-align: center;

    .icon-div {
      color: rgba(var(--main-color), 1);
      padding: 15px;
      font-size: 80px;
      line-height: 0;
      border-radius: 50%;
      border: var(--border-width) solid rgba(var(--border-color), 0.5);
    }

    .text {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;

      h1 {
        font-weight: 600;
        font-size: 24px;
        color: var(--title-color);
      }

      p {
        color: rgba(var(--description-color), 1);
        font-size: 16px;
      }
    }

    .group-btn {
      display: flex;
      flex-direction: row;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
      justify-content: center;

      button {
        padding: 10px 15px;
        border-radius: var(--small-border-radius);
        transition: 0.2s;
        font-size: 16px;
        cursor: pointer;
        text-decoration: none;
        outline: none;
        border: none;

        &.primary {
          background: var(--btn-1-background);
          color: var(--btn-1-color);

          &:hover {
            background: var(--btn-1-hover-background);
          }
        }

        &.secondary {
          background: var(--btn-2-background);
          color: var(--btn-2-color);
          border: var(--border-width) solid rgba(var(--border-color), 0.5);

          &:hover {
            background: var(--btn-2-hover-background);
          }
        }
      }
    }
  }
}

@media (max-height: 513px) {
  #rate-limit {
    height: 100%;
  }
}
</style>
