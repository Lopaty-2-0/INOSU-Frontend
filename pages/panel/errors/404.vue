<script lang="ts" setup>
import Navbar from "~/components/Navbar.vue";

definePageMeta({
  middleware: ["auth"],
});

useHead({
  title: "Panel | Stránka nenalezena",
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
        { name: 'Stránka nenalezena', path: '/panel/errors/404' }
      ]" />
    </template>

    <template #content>
      <div id="page-not-found">
        <div class="content">
          <div class="icon-div"><Icon name="material-symbols:do-not-disturb-on-outline-rounded" class="icon"></Icon></div>

          <div class="text">
            <h1>Stránka nebyla nalezena</h1>
            <p>Stránka, na kterou jste chtěli přejít bohužel nebyla nalezena.</p>
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
#page-not-found {
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
      line-height: 0;
      border-radius: 50%;
      font-size: 80px;
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
  #page-not-found {
    height: 100%;
  }
}
</style>