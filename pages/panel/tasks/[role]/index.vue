<script setup lang="ts">
import Navbar from "~/components/Navbar.vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import ActionBar from "~/components/basics/ActionBar.vue";
import apiFetch from "~/componsables/apiFetch";
import type {ClassData} from "~/types/classes";
import {ref} from "vue";
import {useRoute} from "#vue-router";

useHead({
  title: "Panel | Úkoly",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
});

const route = useRoute();
const role = route.params.role as string;

const cols = ref<{ field: string; title: string; type?: string; width?: string; filter?: boolean; }[]>([
  { field: "id", title: "ID", width: "90px", type: "number" },
  { field: "name", title: "Název", type: "string" },
  { field: "class", title: "Třída", type: "string" },
  { field: "grade", title: "Ročník", type: "number" },
  { field: "group", title: "Skupina", type: "string" },
  { field: "specialization", title: "Zaměření (zkratka)", type: "string" },
  { field: "actions", title: "Akce" },
]);
const allTasks = ref<ClassData[] | undefined>(undefined);
const searchInput = ref<string>("");

const openTask = (id: number): void => {
};

await apiFetch("/class/get", {
  method: "get",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  ignoreResponseError: true,
  onResponse({ response }) {
    const tasks: ClassData[] = response._data.data.classes;

    allTasks.value = tasks || [];
  },
});
</script>

<template>
  <NuxtLayout name="panel" :loading="!allTasks">
    <template #header>
      <Navbar
        :links="[
          { name: 'Úkoly', path: `/panel/tasks/${role}` },
        ]"
      />
    </template>

    <template #content v-if="allTasks">
      <div id="tasks">
        <div class="content">
          <ActionBar
              class="action-bar"
              description="Správa  "
              :texts="['Přidat', 'Odebrat']"
              :actions="['add', 'remove']"
              :icons="[
              'material-symbols:add-rounded',
              'material-symbols:delete-rounded',
            ]"
            :navigate-to="[
              `/panel/tasks/${role}/add`,
              `/panel/tasks/${role}/remove`,
            ]"
          />

          <div class="line">
            <div class="section-head">
              <h3>Aktivní úkoly</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            </div>

            <div class="search">
              <input
                  type="text"
                  name="searchInput"
                  placeholder="Hledat úkol"
                  v-model="searchInput"
              />
              <Icon class="icon" name="material-symbols:search-rounded"></Icon>
            </div>
          </div>

          <Vue3Datatable :rows="allTasks" :columns="cols" :pageSize="10" :sortable="true" :search="searchInput">
            <template #actions="data">
              <div class="actions">
                <button type="button" class="view" @click="openTask(data.id)">Zobrazit</button>
              </div>
            </template>
          </Vue3Datatable>
        </div>
      </div>
      <Alerts />
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
@use "../../../../assets/style/datatable";

::v-deep(.bh-datatable .bh-table-responsive tr td p) {
  text-transform: uppercase;
}

#tasks {
  display: flex;
  flex-direction: row;
  gap: 30px;
  position: relative;

  .actions {
    display: flex;
    flex-direction: row;
    gap: 10px;

    button {
      padding: 10px 15px;
      border-radius: var(--small-border-radius);
      transition: 0.2s;
      font-size: 16px;


      &.view {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        background: var(--btn-1-background);
        color: var(--btn-1-color);

        &:hover {
          background: var(--btn-1-hover-background);
        }
      }
    }
  }

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
  #tasks {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
