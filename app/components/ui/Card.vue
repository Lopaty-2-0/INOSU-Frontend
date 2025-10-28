<script setup lang="ts">
const props = defineProps({
  variant: {
    type: String as () => "outlined" | "subtle" | "soft",
    default: "outlined",
  }
});
const slots = useSlots();
</script>

<template>
  <div class="card" :class="props.variant">
    <div class="header" v-if="slots.header">
      <slot name="header" />
    </div>

    <div class="body">
      <slot name="default" />
    </div>

    <div class="footer" v-if="slots.footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  border-radius: var(--normal-border-radius);
  border: var(--border-width) solid rgba(var(--border-color), 0.5);
  background: var(--card-1-background);

  &.subtle {
    background: var(--card-2-background);
  }

  &.soft {
    border: none;
    background: var(--card-2-background);
  }

  .body {
    padding: 30px;
    height: 100%;
  }

  .header {
    border-bottom: var(--border-width) solid rgba(var(--border-color), 0.5);
    padding: 20px 30px;
  }

  .footer {
    border-top: var(--border-width) solid rgba(var(--border-color), 0.5);
    padding: 20px 30px;
  }
}
</style>