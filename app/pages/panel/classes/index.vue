<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import "@bhplugin/vue3-datatable/dist/style.css";
import ActionBar from "~/components/ui/ActionBar.vue";
import type {ClassData} from "~/types/classes";
import {ref, watchEffect} from "vue";
import checkPermissions from "~/componsables/checkPermissions";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import {useFetch} from "nuxt/app";
import {useLoadingStore} from "~/stores/loading";
import ClassesTable from "~/components/tables/Classes.vue";

useHead({
  title: "Panel | Třídy",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

const allClasses = ref<ClassData[] | undefined>(undefined);
const searchInput = ref<string>("");

useFetch("/api/class/get", {
  method: "get",
  server: false,
  credentials: "include",
  ignoreResponseError: true,
  onResponse({ response }: any) {
    const classes: ClassData[] = response._data.data.classes;

    allClasses.value = classes || [];
  },
});

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !allClasses.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Třídy', to: '/panel/classes', active: true, icon: 'material-symbols:flight-class-rounded' },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content v-if="allClasses">
      <div id="classes">
        <div class="content">
          <ActionBar
            class="action-bar"
            description="Správa tříd"
            :texts="['Přidat', 'Odebrat']"
            :actions="['add', 'remove']"
            :icons="[
              'material-symbols:add-rounded',
              'material-symbols:delete-rounded',
            ]"
            :navigate-to="[
              `/panel/classes/add`,
              `/panel/classes/remove`,
            ]"
            v-if="checkPermissions(['admin'])"
          />

          <div class="line">
            <div class="section-head">
              <h3>Všechny třídy</h3>
              <p>Zde najdete seznam všech tříd v systému.</p>
            </div>

            <div class="search">
              <input
                type="text"
                name="searchInput"
                placeholder="Hledat třídy"
                v-model="searchInput"
              />
              <Icon class="icon" name="material-symbols:search-rounded"></Icon>
            </div>
          </div>

          <ClassesTable :classes="allClasses" :search="searchInput" />
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
#classes {
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

    .search {
      min-width: 150px;
      display: flex;
      align-items: center;

      input {
        border: var(--border-width) solid rgba(var(--border-color), 0.5);
        border-radius: var(--normal-border-radius);
        font-size: 16px;
        outline: none;
        padding: 15px 40px 15px 15px;
        width: 100%;
        background: var(--input-background);
        color: var(--input-color);

        &:focus {
          border-color: rgba(var(--main-color), 1);
        }
      }

      .icon {
        margin-left: -30px;
        cursor: pointer;
        color: rgba(var(--description-color), 1);
        transition: 0.2s;
        font-size: 16px;

        &:hover {
          color: var(--mini-title-color);
        }
      }
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
  #classes {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
