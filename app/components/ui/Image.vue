<script setup lang="ts">
import Loading from "~/components/ui/Loading.vue";
import {watch, ref} from "vue";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: false,
    default: "",
  },
  width: {
    type: [String, Number],
    required: false,
  },
  height: {
    type: [String, Number],
    required: false,
  },
  className: {
    type: String,
    required: false,
  },
  quality: {
    type: [String, Number],
    required: false,
  },
  draggable: {
    type: [String, Boolean],
    required: false,
    default: true,
  },
  loading: {
    type: String,
    required: false,
    default: "auto",
  }
});
const isLoading = ref<boolean>(true);
const hasError = ref<boolean>(false);

const onLoad = (): void => {
  isLoading.value = false;
};

const onError = (): void => {
  hasError.value = true;
  isLoading.value = false;
};

watch(() => props.src, async () => {
    isLoading.value = true;
    hasError.value = false;
});
</script>

<template>
  <div class="image-wrapper">
    <div v-if="isLoading" class="loading">
      <Loading color="rgba(var(--description-color), 1)" size="6px" />
    </div>

    <div class="error" v-if="hasError">
      <Icon class="icon" name="material-symbols:error-outline-rounded" />
      Neplatný obrázek
    </div>

    <NuxtImg
      v-show="!isLoading && !hasError"
      :draggable="props.draggable"
      :src="props.src"
      :alt="props.alt"
      :loading="props.loading"
      :width="props.width"
      :height="props.height"
      :class="props.className"
      :quality="props.quality"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>

<style scoped lang="scss">
.image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  img {
    width: 100%;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .error {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    text-align: center;
    color: rgba(var(--error-color), 1);
    font-size: 14px;

    .icon {
      font-size: 20px;
    }
  }
}
</style>