<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import "@bhplugin/vue3-datatable/dist/style.css";
import ActionBar from "~/components/ui/ActionBar.vue";
import {computed, ref, watchEffect} from "vue";
import Loading from "~/components/ui/Loading.vue";
import { useAlertsStore } from "~/stores/alerts";
import type {SpecializationData} from "~/types/specialization";
import Input from "~/components/ui/Input.vue";
import InputMenu, {type InputMenuItem} from "~/components/ui/InputMenu.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import {useFetch} from "nuxt/app";
import {useLoadingStore} from "~/stores/loading";
import NumberInput from "~/components/ui/NumberInput.vue";
import SearchInput from "~/components/ui/SearchInput.vue";
import Pagination from "~/components/ui/Pagination.vue";

useHead({
  title: "Panel | Třídy - Přidání",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin"],
});

const alertsStore = useAlertsStore();
const amountOfSpecializationsForPaging: number = 10;
const currentSpecializationsPage = ref<number>(1);
const specializationsPage = ref<number>(1);
const numberOfSpecializations = ref<number>(1);
const loading = ref<boolean>(false);
const classData = ref<{ name: string; grade: number | null; group: string; specialization: number | null }>({
  name: "",
  grade: null,
  group: "",
  specialization: null
});
const errors = ref<{ name: string; grade: string; group: string; specialization: string }>({
  name: "",
  grade: "",
  group: "",
  specialization: ""
});
const allSpecializations = ref<SpecializationData[]>([]);
const selectedSpecialization = ref<string[] | undefined>(undefined);
const specializationsSearchInput = ref<string>("");
const dropDownSpecializations = computed<InputMenuItem[]>((): InputMenuItem[] => {
  return allSpecializations.value.map((specialization: SpecializationData): InputMenuItem => {
    return {
      label: `${specialization.name} (${specialization.abbreviation}) - ${specialization.lengthOfStudy} roky`,
      value: specialization.id.toString(),
    };
  });
});
const numberOfSpecializationsPages = computed(() => {
  return Math.ceil(numberOfSpecializations.value / amountOfSpecializationsForPaging);
});

const resetSelectedClasses = (): void => {
  selectedSpecialization.value = undefined;
  classData.value = {
    name: "",
    grade: null,
    group: "",
    specialization: null
  };
  errors.value = {
    name: "",
    grade: "",
    group: "",
    specialization: ""
  };
  specializationsSearchInput.value = "";
};

const onSearchInputChange = (input: string): void => {
  currentSpecializationsPage.value = 1;

  specializationsSearchInput.value = input;
};

const onSpecializationSelect = (value: string[]): void => {
  classData.value.specialization = value[0] ? parseInt(value[0]) : null;

  checkForErrors();
};

const checkForErrors = (): void => {
  errors.value.name = "";
  errors.value.grade = "";
  errors.value.group = "";
  errors.value.specialization = "";

  if (!classData.value.name) {
    errors.value.name = "Název třídy je povinný.";
  }

  if (!classData.value.grade || classData.value.grade < 1) {
    errors.value.grade = "Ročník třídy je povinný.";
  } else if (classData.value.grade < 1) {
    errors.value.grade = "Ročník třídy musí být větší než 0.";
  }

  if (!classData.value.group) {
    errors.value.group = "Skupina třídy je povinná.";
  } else if (classData.value.group.length > 1) {
    errors.value.group = "Skupina třídy musí být maximálně 1 znak.";
  }

  if (classData.value.specialization === null) {
    errors.value.specialization = "Zaměření třídy je povinné.";
  }
};

const addClass = async (): Promise<void> => {
  if (!classData.value.specialization || !classData.value.group || !classData.value.grade || !classData.value.name) {
    alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Některá pole jsou prázdná." });
    return;
  }

  if (errors.value.name || errors.value.grade || errors.value.group || errors.value.specialization) {
    alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Některá pole obsahují chyby." });
    return;
  }

  loading.value = true;

  await $fetch("/api/class/add", {
    method: "post",
    body: {
      name: classData.value.name,
      grade: classData.value.grade,
      group: classData.value.group,
      idSpecialization: classData.value.specialization,
    },
    ignoreResponseError: true,
    credentials: "include",

    onResponse({ response }: any) {
      const resCode = response?._data?.resCode?.toString();

      switch (resCode) {
        case "8010":
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Nemáte oprávnění k této akci." });
          break;

        case "8020":
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Ročník chybí." });
          break;

        case "8030":
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Skupina chybí." });
          break;

        case "8040":
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Zaměření chybí." });
          break;

        case "8050":
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Název třídy chybí." });
          break;

        case "8060":
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Ročník musí být celé číslo." });
          break;

        case "8070":
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Ročník musí být kladné číslo v povoleném rozsahu." });
          break;

        case "8080":
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Skupina může mít maximálně 1 znak." });
          break;

        case "8090":
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Zaměření musí být číslo." });
          break;

        case "8100":
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Zaměření má neplatnou hodnotu." });
          break;

        case "8110":
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Zvolené zaměření neexistuje." });
          break;

        case "8120":
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Ročník přesahuje délku studia zaměření." });
          break;

        case "8130":
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Název třídy je příliš dlouhý." });
          break;

        case "8140":
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Název třídy je již používán." });
          break;

        case "8151":
          alertsStore.addAlert({ type: "success", title: "Vytvoření třídy", message: "Třída byla úspěšně vytvořena." });
          resetSelectedClasses();
          break;

        default:
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Nastala neznámá chyba." });
      }
    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Nastala neznámá chyba." });
    },
  }).finally(() => {
    loading.value = false;
  });
};

const {data: specializationsData, error: specializationsError} = useFetch("/api/specialization/get", {
  query: {
    amountForPaging: amountOfSpecializationsForPaging,
    pageNumber: currentSpecializationsPage,
    searchQuery: specializationsSearchInput,
  },
  method: "get",
  credentials: "include",
  server: false,
  ignoreResponseError: true,
  lazy: true
});

watch([specializationsData, specializationsError], (): void => {
  if (specializationsError.value) {
    allSpecializations.value = [];
    return;
  }

  if (!specializationsData.value) return;

  allSpecializations.value = specializationsData.value.data.specializations;
  numberOfSpecializations.value = specializationsData.value.data.count;
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !allSpecializations.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Třídy', to: '/panel/classes', icon: 'material-symbols:flight-class-rounded' },
            { label: 'Vytvoření', to: '/panel/users/add', active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
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
            :active="0"
            :navigate-to="[
              `/panel/classes/add`,
              `/panel/classes/remove`,
            ]"
          />

          <div class="form">
            <div class="section">
              <div class="section-head">
                <h3>Název * <span class="update" v-show="classData.name">(aktualizováno)</span></h3>
                <p>Zadejte název nové třídy. Název by měl být unikátní a jasně identifikovat třídu v systému.</p>
              </div>

              <div class="content">
                <label for="name">Název</label>
                <Input type="text" id="name" placeholder="V1B-ANJ1" v-model.trim="classData.name" @input="checkForErrors" />

                <p class="input-error" v-if="errors.name.length > 0">{{ errors.name }}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-head">
                <h3>Zaměření * <span class="update" v-show="classData.specialization">(aktualizováno)</span></h3>
                <p>Vyberte zaměření, ke kterému bude nová třída přiřazena. Můžete filtrovat podle názvu, zkratky nebo délky studia.</p>
              </div>

              <div class="content">
                <label>Výběr zaměření</label>

                <InputMenu
                  v-model="selectedSpecialization"
                  :multiple="false"
                  :items="dropDownSpecializations"
                  :create-item="false"
                  placeholder="Vyberte zaměření"
                  :deselect="true"
                  :disable-item-filtering="true"
                  no-data-text="Žádné zaměření nebylo nalezeno"
                  @update:model-value="onSpecializationSelect"
                  @search:change="onSearchInputChange"
                >
                  <template #row-extra v-if="numberOfSpecializationsPages > 1">
                    <Pagination v-model="specializationsPage" :number-of-pages="numberOfSpecializationsPages" :chunk-size="2" />
                  </template>
                </InputMenu>
                <p class="input-error" v-if="errors.specialization.length > 0">{{ errors.specialization }}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-head">
                <h3>Ročník * <span class="update" v-show="classData.grade">(aktualizováno)</span></h3>
                <p>Zadejte ročník, do kterého nová třída patří. Ročník musí být celé číslo větší než 0 a nesmí přesahovat délku studia zvoleného zaměření.</p>
              </div>

              <div class="content">
                <label for="grade">Ročník</label>
                <NumberInput v-model="classData.grade" :min="1" placeholder="1" id="grade" @update:model-value="checkForErrors" />

                <p class="input-error" v-if="errors.grade.length > 0">{{ errors.grade }}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-head">
                <h3>Skupina * <span class="update" v-show="classData.group && classData.group.length === 1">(aktualizováno)</span></h3>
                <p>Zadejte označení skupiny, například písmeno A. Skupina musí být tvořena právě jedním znakem.</p>
              </div>

              <div class="content">
                <label for="group">Skupina</label>
                <Input type="text" id="group" placeholder="A" v-model.trim="classData.group" @input="checkForErrors" />

                <p class="input-error" v-if="errors.group.length > 0">{{ errors.group }}</p>
              </div>
            </div>
          </div>

          <div class="buttons">
            <button type="submit" @click="addClass">
              Uložit změny
              <Loading v-show="loading" size="5px" color="var(--actionBar-actions-remove-color)"/>
            </button>
            <button type="reset" @click="resetSelectedClasses">
              Resetovat změny
            </button>
          </div>
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

    .error {
      color: rgba(var(--error-color), 1);
      font-size: 16px;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 35px;
      width: 100%;
    }

    .search {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;

      label {
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex: 1;
      }
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 30px;
      flex: 1;
      align-items: flex-start;
      border-bottom: 1px solid rgba(var(--border-color), 0.5);
      padding-bottom: 35px;

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

      .line {
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 10px;
        flex-wrap: wrap;

        input {
          flex: 1;
        }
      }

      .icon-div {
        padding: 15px;
        border: var(--border-width) solid rgba(var(--border-color), 0.5);
        color: var(--btn-2-color);
        background: var(--btn-2-background);
        border-radius: var(--normal-border-radius);
        cursor: pointer;
        transition: 0.2s;
        line-height: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon {
          font-size: 16px;
        }

        &:hover {
          background: var(--btn-2-hover-background);
        }
      }

      .content {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .input-error {
          font-size: 16px;
          color: rgba(var(--error-color), 1);
        }

        label {
          color: var(--mini-title-color);
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
        }

        input {
          border-radius: var(--normal-border-radius);
          font-size: 16px;
          outline: none;
          padding: 15px;
          border: var(--border-width) solid rgba(var(--border-color), 0.5);
          min-width: 150px;
          background: var(--input-background);
          color: var(--input-color);

          &:focus {
            border-color: rgba(var(--main-color), 1);
          }

          &.error {
            border-color: rgba(var(--error-color), 1);
          }
        }
      }
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

    .buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;

      button {
        padding: 10px 15px;
        border-radius: var(--small-border-radius);
        transition: 0.2s;
        font-size: 16px;
        cursor: pointer;
        border: none;

        &[type="submit"] {
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

        &[type="reset"] {
          background: var(--btn-2-background);
          color: var(--btn-2-color);
          border: var(--border-width) solid rgba(var(--border-color), 0.5);

          &:hover {
            background: var(--btn-2-hover-background);
          }
        }

        .icon {
          font-size: 16px;
        }
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
