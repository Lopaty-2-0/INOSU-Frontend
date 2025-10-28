<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import ActionBar from "~/components/ui/ActionBar.vue";
import apiFetch from "~/componsables/apiFetch";
import {ref, onMounted} from "vue";
import {useAccountStore} from "~/stores/account";
import type {TaskData} from "~/types/tasks";
import moment from "moment/moment";
import { storeToRefs } from "pinia";
import SearchInput from "~/components/ui/SearchInput.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";

useHead({
  title: "Panel | Úkoly",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["teacher", "admin"],
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Test', to: '/panel/', icon: 'material-symbols:home-rounded' },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      test
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
</style>
