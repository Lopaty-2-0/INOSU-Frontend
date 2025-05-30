<script setup lang="ts">
import Navbar from "~/components/Navbar.vue";
import Alerts from "~/components/Alerts.vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import ActionBar from "~/components/basics/ActionBar.vue";
import apiFetch from "~/componsables/apiFetch";
import type {ClassData} from "~/types/classes";
import {ref} from "vue";
import Loading from "~/components/basics/Loading.vue";
import { useAlertsStore } from "~/stores/alerts";

useHead({
  title: "Panel | Třídy - Odstranění",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin"],
});

const alertsStore = useAlertsStore();
const cols = ref<{ field: string; title: string; type?: string; width?: string; filter?: boolean; }[]>([
  { field: "id", title: "ID", width: "90px", type: "number" },
  { field: "name", title: "Název", type: "string" },
  { field: "class", title: "Třída", type: "string" },
  { field: "grade", title: "Ročník", type: "number" },
  { field: "group", title: "Skupina", type: "string" },
  { field: "specialization", title: "Zaměření", type: "string" },
]);
const datatable = ref<any>(null);
const allClasses = ref<ClassData[] | undefined>(undefined);
const selectedClasses = ref<ClassData[]>([]);
const loading = ref<boolean>(false);
const searchInput = ref<string>("");

const pingResetSelectedClasses = (): void => {
  datatable.value.clearSelectedRows();
  selectedClasses.value = [];
};

const onCheckboxSelect = (): void => {
  if (!datatable.value) return;

  setTimeout((): void => {
    selectedClasses.value = datatable.value.getSelectedRows() as ClassData[];
  }, 0);
};

const removeClasses = async (): Promise<void> => {
  loading.value = true;

  await apiFetch("/class/delete", {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      idClass : selectedClasses.value.map((oneClass: ClassData) => oneClass.id),
    },
    ignoreResponseError: true,
    credentials: "include",
    onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();


      switch (resCode) {
        case "9010":
          alertsStore.addAlert({type: "error", title: "Odstranění tříd", message: "Nedostatečné oprávnění pro odstranění tříd.",});
          break;
        case "9020":
          alertsStore.addAlert({type: "warning", title: "Odstranění tříd", message: "Žádná třída nebyla vybrána.",});
          break;
        case "9031":
          if ((response._data.data.taskIds || []).length >= 1) {
            alertsStore.addAlert({type: "warning", title: "Odstranění tříd", message: `Některé třídy nebyly odstraněny. Tyto úkoly používají některé z odstraňovaných tříd: ${response._data.data.taskIds.join(", ")}`});
          } else if ((response._data.data.userIds || []).length >= 1) {
            alertsStore.addAlert({type: "warning", title: "Odstranění tříd", message: `Některé třídy nebyly odstraněny. Tito uživatelé používají některé z odstraňovaných tříd: ${response._data.data.userIds.join(", ")}`});
          } else {
            alertsStore.addAlert({type: "success", title: "Odstranění tříd", message: `Třídy byly úspěšně odstraněny. (${response._data.data.goodIds.length}/${selectedClasses.value.length})`});
          }

          allClasses.value = allClasses.value?.filter((oneClass: ClassData) => !response._data.data.goodIds.includes(oneClass.id));

          pingResetSelectedClasses();
          break;
        default:
          alertsStore.addAlert({type: "error", title: "Odstranění tříd", message: "Nastala neznámá chyba.",});
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({type: "error", title: "Odstranění tříd", message: "Nastala neznámá chyba.",});
    },
  }).finally((): void => {
    loading.value = false;
  });
}

onMounted(async (): Promise<void> => {
  await apiFetch("/class/get", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }) {
      const classes: ClassData[] = response._data.data.classes;

      allClasses.value = classes || [];
    },
  });
});
</script>

<template>
  <NuxtLayout name="panel" :loading="!allClasses">
    <template #header>
      <Navbar
        :links="[
          { name: 'Třídy', path: '/panel/classes' },
          { name: 'Odstranění', path: '/panel/classes/remove' },
        ]"
      />
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
            :active="1"
            :navigate-to="[
              `/panel/classes/add`,
              `/panel/classes/remove`,
            ]"
          />

          <div class="line">
            <div class="section-head">
              <h3>Třídy: {{ selectedClasses.length }} / {{ allClasses.length }}</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
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

          <div class="buttons">
            <button class="remove" @click="removeClasses">
              Odstranit
              <Loading
                v-show="loading"
                size="5px"
                color="var(--actionBar-actions-remove-color)"
              />
            </button>
            <button class="reset" @click="pingResetSelectedClasses">
              Zrušit vše
            </button>
          </div>

          <Vue3Datatable ref="datatable" :rows="allClasses" :columns="cols" :hasCheckbox="true" :pageSize="10" :sortable="true" :search="searchInput" @input="onCheckboxSelect">
            <template #group="data">
              <p>
                {{ data.value.group }}
              </p>
            </template>

            <template #specialization="data">
              <p>
                {{ data.value.specialization }}
              </p>
            </template>

            <template #class="data">
              <p>
                {{ data.value.specialization }}{{ data.value.grade }}{{ data.value.group }}
              </p>
            </template>
          </Vue3Datatable>
        </div>
      </div>
      <Alerts />
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
@use "../../../assets/style/datatable";

::v-deep(.bh-datatable .bh-table-responsive tr td p) {
  text-transform: uppercase;
}

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

    .error {
      color: rgba(var(--error-color), 1);
      font-size: 16px;
    }

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
