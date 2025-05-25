<script lang="ts" setup>
import Navbar from "~/components/Navbar.vue";

definePageMeta({
});

useHead({
  title: "Panel | Přístup odepřen",
  meta: [
    { name: "description", content: "Přistup zamítnut page" }
  ],
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar :links="[
        { name: 'Domů', path: '/panel' },
        { name: 'Přístup odepřen', path: '/panel/errors/403' }
      ]" />
    </template>

    <template #content>
      <div id="access-denied">
        <div class="content">
          <div class="icon-div"><Icon name="material-symbols:visibility-lock-rounded" class="icon"></Icon></div>

          <div class="text">
            <h1>Přístup odepřen</h1>
            <p>Nemáte dostatečná oprávnění pro zobrazení této stránky.</p>
          </div>
          <div class="group-btn">
            <NuxtLink class="primary" href="/panel">Vrátit zpět</NuxtLink>
            <NuxtLink class="secondary" href="/panel/support">Podpora</NuxtLink>
          </div>
        </div>
      </div>
      <Alerts />
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
#access-denied {
  width: 100%;
  height: calc(100vh - 200px);
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

      a {
        padding: 10px 15px;
        border-radius: var(--normal-border-radius);
        transition: 0.2s;
        font-size: 16px;

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
  #access-denied {
    height: 100%;
  }
}
</style>