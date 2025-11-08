<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import {ref, watchEffect} from "vue";
import type {SpecializationData} from "~/types/specialization";
import checkPermissions from "~/componsables/checkPermissions";
import SearchInput from "~/components/ui/SearchInput.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import {useFetch} from "nuxt/app";
import { useLoadingStore } from "~/stores/loading";
import SpecializationsTable from "~/components/tables/Specializations.vue";

useHead({
  title: "Panel | Zaměření",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

const allSpecializations = ref<SpecializationData[] | undefined>(undefined);
const searchInput = ref<string>("");

useFetch("/api/specialization/get", {
  method: "get",
  server: false,
  credentials: "include",
  ignoreResponseError: true,
  onResponse({ response }: any) {
    const specializations: SpecializationData[] = response._data.data.specializations;

    allSpecializations.value = specializations || [];
  },
});

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", allSpecializations.value === undefined);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Zaměření', to: '/panel/specializations', active: true, icon: 'material-symbols:school' },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content v-if="allSpecializations">
      <div id="specializations">
        <div class="content">
          <ActionBar
            class="action-bar"
            description="Správa zaměření"
            :texts="['Přidat', 'Odebrat']"
            :actions="['add', 'remove']"
            :icons="[
              'material-symbols:add-rounded',
              'material-symbols:delete-rounded',
            ]"
              :navigate-to="[
              `/panel/specializations/add`,
              `/panel/specializations/remove`,
            ]"
            v-if="checkPermissions(['admin'])"
          />

          <div class="line">
            <div class="section-head">
              <h3>Všechny zaměření</h3>
              <p>Zde najdete seznam všech zaměření (oborů) na škole dostupných v systému.</p>
            </div>

            <SearchInput v-model="searchInput" placeholder="Hledat zaměření" />
          </div>

          <SpecializationsTable :specializations="allSpecializations" :search="searchInput" />
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
#specializations {
  display: flex;
  flex-direction: row;
  gap: 30px;
  position: relative;

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 35px;
    position: relative;

    .line {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 30px;
      width: 100%;
    }

    .buttons {
      display: flex;
      gap: 10px;

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 5px;
        padding: 10px 15px;
        border-radius: var(--small-border-radius);
        border: var(--border-width) solid transparent;
        transition: 0.2s;
        font-size: 16px;

        &.remove {
          color: var(--actionBar-actions-remove-color);
          background: rgba(var(--actionBar-actions-remove-background), 1);
          border-color: rgba(var(--actionBar-actions-remove-border), 1);

          &:hover {
            background: rgba(var(--actionBar-actions-remove-background), 0.8);
          }
        }

        &.reset {
          background: var(--btn-2-background);
          color: var(--btn-2-color);
          border-color: rgba(var(--border-color), 0.5);

          &:hover {
            background: var(--btn-2-hover-background);
          }
        }

        .icon {
          font-size: 16px;
        }
      }
    }

    .error {
      color: rgba(var(--error-color), 1);
      font-size: 16px;
    }

    .page-section {
      border-bottom: 1px solid rgba(var(--border-color), 0.5);
      padding-bottom: 35px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .section-head {
      display: flex;
      flex-direction: column;
      gap: 10px;

      h3 {
        font-weight: 600;
        font-size: 20px;
        color: var(--title-color);
      }

      p {
        color: rgba(var(--description-color), 1);
        font-size: 16px;
      }

      .update {
        color: rgba(var(--error-color), 1);
      }
    }
  }
}

@media (max-width: 1055px) {
  #specializations {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
