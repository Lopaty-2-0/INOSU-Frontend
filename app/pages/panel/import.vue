<script lang="ts" setup>
import Navbar from "~/components/layout/Navbar.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import checkPermissions from "~/componsables/checkPermissions";
import ActionBar from "~/components/ui/ActionBar.vue";

useHead({
  title: "Panel | Import dat",
  meta: [
    { name: "description", content: "Přistup zamítnut page" }
  ],
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Domů', to: '/panel', icon: 'material-symbols:flight-class-rounded' },
            { label: 'Import', to: '/panel/import', active: true }
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="import">
        <div class="section-head">
          <h3>Import dat</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, aliquam aliquid amet aut consequuntur cum deleniti enim exercitationem fuga, harum impedit itaque nam nihil numquam optio porro, sapiente sit tempore!</p>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
#import {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 60px;
  position: relative;

  .section-head {
    display: flex;
    flex-direction: column;
    gap: 10px;

    h3 {
      font-weight: 700;
      font-size: 20px;
      color: var(--title-color);
    }

    p {
      color: rgba(var(--description-color), 1);
      font-size: 16px;
    }
  }
}
</style>