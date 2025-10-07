<script lang="ts" setup>
const props = defineProps({
  color: {
    type: String,
    default: "#000",
  },
  size: {
    type: String,
    default: "20px",
  },
});
</script>

<template>
  <span class="dot-spinner">
    <span
      v-for="index in 3"
      :key="index"
      :class="`dot${index}`"
      :style="{
        background: props.color,
        width: props.size,
        height: props.size,
      }"
    />
  </span>
</template>

<style lang="scss" scoped>
.dot-spinner {
  display: flex;
  gap: 10px;
  flex-direction: row;

  span {
    border-radius: 50%;
    animation: fade 1s infinite;

    &.dot0 {
      animation-delay: 1s;
    }
    &.dot1 {
      animation-delay: 0.21s;
    }
    &.dot2 {
      animation-delay: 0.4s;
    }
  }
}

@keyframes fade {
  0% {
    opacity: 1;
  }
  40% {
    opacity: 0;
  }
  60% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
