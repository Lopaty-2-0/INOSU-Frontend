<script setup lang="ts">
import Navbar from "~/components/Navbar.vue";
import Alerts from "~/components/Alerts.vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import ActionBar from "~/components/basics/ActionBar.vue";
import apiFetch from "~/componsables/apiFetch";
import {ref} from "vue";
import Loading from "~/components/basics/Loading.vue";
import { useAlertsStore } from "~/stores/alerts";
import type {SpecializationData} from "~/types/specialization";

useHead({
  title: "Panel | Zaměření - Odstranění",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin"],
});

const alertsStore = useAlertsStore();
const cols = ref<{ field: string; title: string; type?: string; width?: string; filter?: boolean; }[]>([
  { field: "id", title: "ID", width: "90px", type: "number" },
  { field: "name", title: "Název", type: "string" },
  { field: "abbreviation", title: "Zkratka", type: "string" },
  { field: "lengthOfStudy", title: "Délka studia (roky)", type: "number" },
]);
const datatable = ref<any>(null);
const allSpecializations = ref<SpecializationData[] | undefined>(undefined);
const selectedSpecializations = ref<SpecializationData[]>([]);
const loading = ref<boolean>(false);
const searchInput = ref<string>("");

const pingResetSelectedSpecializations = (): void => {
  datatable.value.clearSelectedRows();
  selectedSpecializations.value = [];
};

const onCheckboxSelect = (): void => {
  if (!datatable.value) return;

  setTimeout((): void => {
    selectedSpecializations.value = datatable.value.getSelectedRows() as SpecializationData[];
  }, 0);
};

const removeSpecializations = async (): Promise<void> => {
  loading.value = true;

  await apiFetch("/specialization/delete", {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      idSpecialization: selectedSpecializations.value.map((specialization: SpecializationData) => specialization.id),
    },
    ignoreResponseError: true,
    credentials: "include",
    onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "5010":
          alertsStore.addAlert({ type: "error", title: "Odstranění zaměření", message: "Nemáte oprávnění k této akci." });
          break;
        case "5020":
          alertsStore.addAlert({ type: "error", title: "Odstranění zaměření", message: "Chybí ID zaměření." });
          break;
        case "5030":
          alertsStore.addAlert({ type: "error", title: "Odstranění zaměření", message: "Neproběhlo žádné odstranění." });
          break;
        case "5041":
          if ((response._data.data.classIds || []).length >= 1) {
            alertsStore.addAlert({type: "warning", title: "Odstranění zaměření", message: `Některé zaměření nebyly odstraněny. Tyto třídy používají některé z odstraňovaných zaměření: ${response._data.data.classIds.join(", ")}`});
          } else {
            alertsStore.addAlert({ type: "success", title: "Odstranění zaměření", message: `Zaměření byly úspěšně odstraněny. (${response._data.data.goodIds.length}/${selectedSpecializations.value.length})`});
          }

          allSpecializations.value = allSpecializations.value?.filter((specialization: SpecializationData) => !response._data.data.goodIds.includes(specialization.id));

          pingResetSelectedSpecializations();
          break;
        default:
          alertsStore.addAlert({ type: "error", title: "Odstranění zaměření", message: "Nastala neznámá chyba." });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Odstranění zaměření", message: "Nastala neznámá chyba." });
    },
  }).finally((): void => {
    loading.value = false;
  });
};

onMounted(async (): Promise<void> => {
  await apiFetch("/specialization/get", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }) {
      const specializations: SpecializationData[] = response._data.data.specializations;

      allSpecializations.value = specializations || [];
    },
  });
});
</script>

<template>
  <NuxtLayout name="panel" :loading="!allSpecializations">
    <template #header>
      <Navbar
          :links="[
          { name: 'Zaměření', path: '/panel/specializations' },
          { name: 'Odstranění', path: '/panel/specializations/remove' },
        ]"
      />
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
            :active="1"
            :navigate-to="[
              `/panel/specializations/add`,
              `/panel/specializations/remove`,
            ]"
          />

          <div class="line">
            <div class="section-head">
              <h3>Zaměření: {{ selectedSpecializations.length }} / {{ allSpecializations.length }}</h3>
              <p>Vyberte zaměření, která chcete odstranit ze systému. Po potvrzení budou vybraná zaměření trvale smazána.</p>
            </div>

            <div class="search">
              <input
                  type="text"
                  name="searchInput"
                  placeholder="Hledat zaměření"
                  v-model="searchInput"
              />
              <Icon class="icon" name="material-symbols:search-rounded"></Icon>
            </div>
          </div>

          <div class="buttons">
            <button class="remove" @click="removeSpecializations">
              Odstranit
              <Loading
                  v-show="loading"
                  size="5px"
                  color="var(--actionBar-actions-remove-color)"
              />
            </button>
            <button class="reset" @click="pingResetSelectedSpecializations">
              Zrušit vše
            </button>
          </div>

          <Vue3Datatable ref="datatable" :rows="allSpecializations" :columns="cols" :hasCheckbox="true" :pageSize="10" :sortable="true" :search="searchInput" @input="onCheckboxSelect">
            <template #abbreviation="data">
              <p>{{ data.value.abbreviation }}</p>
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
  #specializations {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
