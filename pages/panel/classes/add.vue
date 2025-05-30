<script setup lang="ts">
import Navbar from "~/components/Navbar.vue";
import Alerts from "~/components/Alerts.vue";
import "@bhplugin/vue3-datatable/dist/style.css";
import ActionBar from "~/components/basics/ActionBar.vue";
import apiFetch from "~/componsables/apiFetch";
import {onMounted, ref} from "vue";
import Loading from "~/components/basics/Loading.vue";
import { useAlertsStore } from "~/stores/alerts";
import type {SpecializationData} from "~/types/specialization";

useHead({
  title: "Panel | Třídy - Přidání",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin"],
});

const alertsStore = useAlertsStore();
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
const selectedSpecialization = ref<number | null>(null);
const open = ref<boolean>(false);
const searchName = ref<string>("");
const searchLengthOfStudy = ref<number | null>(null);
const searchAbbreviation = ref<string>("");
const icons = {
  select: "material-symbols:done-rounded",
  selected: "material-symbols:close-rounded",
  open: "material-symbols:arrow-downward-rounded",
  close: "material-symbols:arrow-upward-rounded"
};
const title = ref<string>("");
const searchedSpecializations = computed<SpecializationData[]>((): SpecializationData[] => {
  return allSpecializations.value.filter((item: SpecializationData): boolean => {
    return (
        item.name.toLocaleLowerCase().includes(searchName.value.toLocaleLowerCase()) &&
        (searchAbbreviation.value ? item.abbreviation.toLocaleLowerCase() === searchAbbreviation.value.toLocaleLowerCase() : true) &&
        (searchLengthOfStudy.value ? item.lengthOfStudy === searchLengthOfStudy.value : true)
    );
  });
});

const toggleDropdown = (): void => {
  open.value = !open.value;
};

const pingResetSelectedClasses = (): void => {
  selectedSpecialization.value = null;
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
  searchAbbreviation.value = "";
  searchLengthOfStudy.value = null;
  searchName.value = "";
  title.value = "";
  open.value = false;
};

const onSpecializationSelect = (specialization: SpecializationData): void => {
  if (specialization.id === selectedSpecialization.value) {
    selectedSpecialization.value = null;
    classData.value.specialization = null;
    title.value = "";
    return;
  }

  selectedSpecialization.value = specialization.id;
  classData.value.specialization = specialization.id;
  title.value = `${specialization.name} - ${specialization.abbreviation.toUpperCase()} - Délka studia (roky): ${specialization.lengthOfStudy}`;

  checkForErrors();
};

const checkForErrors = (): void => {
  errors.value.name = "";
  errors.value.grade = "";
  errors.value.group = "";
  errors.value.specialization = "";

  if (classData.value.name.length < 1) {
    errors.value.name = "Název třídy je povinný.";
  }

  if (!classData.value.grade || classData.value.grade < 1) {
    errors.value.grade = "Ročník třídy je povinný.";
  } else if (classData.value.grade < 1) {
    errors.value.grade = "Ročník třídy musí být větší než 0.";
  }

  if (classData.value.group.length < 1) {
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

  if (errors.value.name.length > 0 || errors.value.grade.length > 0 || errors.value.group.length > 0 || errors.value.specialization.length > 0) {
    alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Některá pole obsahují chyby." });
    return;
  }

  loading.value = true;

  await apiFetch("/class/add", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: {
      name: classData.value.name,
      grade: classData.value.grade,
      group: classData.value.group,
      idSpecialization: classData.value.specialization,
    },
    ignoreResponseError: true,
    credentials: "include",
    onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

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
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Skupina může mít maximálně 1 znak." }); break;
        case "8080":
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Neplatné zaměření." });
          break;
        case "8090":
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Ročník přesahuje délku studia zaměření." });
          break;
        case "8100":
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Název třídy je již používán." });
          break;
        case "8111":
          alertsStore.addAlert({ type: "success", title: "Vytvoření třídy", message: "Třída byla úspěšně vytvořena." });

          classData.value.name = "";
          classData.value.grade = null;
          classData.value.group = "";
          classData.value.specialization = null;
          selectedSpecialization.value = null;
          title.value = "";
          searchName.value = "";
          searchLengthOfStudy.value = null;
          searchAbbreviation.value = "";
          errors.value.name = "";
          errors.value.grade = "";
          errors.value.group = "";
          errors.value.specialization = "";
          open.value = false;

          break;
        default:
          alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Nastala neznámá chyba." });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Vytvoření třídy", message: "Nastala neznámá chyba." });
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
          { name: 'Třídy', path: '/panel/classes' },
          { name: 'Vytvoření', path: '/panel/classes/add' },
        ]"
      />
    </template>

    <template #content v-if="allSpecializations">
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
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
              </div>

              <div class="content">
                <label for="name">Název</label>
                <input type="text" id="name" placeholder="V1B-ANJ1" v-model="classData.name" @input="checkForErrors" />

                <p class="input-error" v-if="errors.name.length > 0">{{ errors.name }}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-head">
                <h3>Zaměření * <span class="update" v-show="classData.specialization">(aktualizováno)</span></h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
              </div>

              <div class="content">
                <div class="search">
                  <label for="searchName">
                    Název
                    <input id="searchName" placeholder="Vyhledat název" v-model="searchName" />
                  </label>
                  <label for="searchAbbreviation">
                    Zkratka
                    <input id="searchAbbreviation" placeholder="V" v-model="searchAbbreviation" />
                  </label>
                  <label for="searchLengthOfStudy">
                    Délka studia
                    <input id="searchLengthOfStudy" min="1" max="10" placeholder="3" type="number" v-model="searchLengthOfStudy " />
                  </label>
                </div>

                <label>Výběr zaměření</label>

                <div class="dropdown">
                  <div class="title" @click="toggleDropdown">
                    <p>{{ title || "Vyberte zaměření" }}</p>

                    <Icon class="icon" :name="open ? icons.close : icons.open" />
                  </div>

                  <div class="dropdown-content" v-show="open">
                    <div
                        v-for="item in searchedSpecializations"
                        :key="item.id"
                        class="item"
                        :class="{ selected: selectedSpecialization === item.id }"
                        @click="() => onSpecializationSelect(item)"
                        v-if="searchedSpecializations.length > 0"
                    >
                      <Icon class="icon" :name="selectedSpecialization === item.id ? icons.select : icons.selected" />
                      <span>
                        <span class="name" v-if="item.name">{{ item.name + " - " }}</span>
                        <span class="uppercase">{{ item.abbreviation + " - " }}</span>
                        <span>Délka studia (roky): {{ item.lengthOfStudy }}</span>
                      </span>
                    </div>

                    <div v-else class="item error">
                      <p>Žádné zaměření nebylo nalezeno.</p>
                    </div>
                  </div>
                </div>
                <p class="input-error" v-if="errors.specialization.length > 0">{{ errors.specialization }}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-head">
                <h3>Ročník * <span class="update" v-show="classData.grade">(aktualizováno)</span></h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
              </div>

              <div class="content">
                <label for="grade">Ročník</label>
                <input type="number" id="grade" placeholder="1" min="1" v-model="classData.grade" @input="checkForErrors" />

                <p class="input-error" v-if="errors.grade.length > 0">{{ errors.grade }}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-head">
                <h3>Skupina * <span class="update" v-show="classData.group">(aktualizováno)</span></h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
              </div>

              <div class="content">
                <label for="group">Skupina</label>
                <input type="text" id="group" placeholder="A" v-model="classData.group" @input="checkForErrors" />

                <p class="input-error" v-if="errors.group.length > 0">{{ errors.group }}</p>
              </div>
            </div>
          </div>

          <div class="buttons">
            <button type="submit" @click="addClass">
              Uložit změny
              <Loading v-show="loading" size="5px" color="var(--actionBar-actions-remove-color)"/>
            </button>
            <button type="reset" @click="pingResetSelectedClasses">
              Resetovat změny
            </button>
          </div>
        </div>
      </div>
      <Alerts />
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

      input {
        padding: 15px;
        min-width: 150px;
        width: 100%;
        background: transparent;
        outline: none;
        border-radius: var(--normal-border-radius);
        border: var(--border-width) solid rgba(var(--border-color), 0.5);
        background: var(--input-background);
        color: var(--input-color);

        &, &::placeholder {
          font-size: 16px;
          font-weight: 400;
        }

        &:focus {
          border-color: rgba(var(--main-color), 1);
        }
      }
    }

    .dropdown {
      position: relative;
      display: flex;
      width: 100%;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
      flex-direction: column;

      &.error {
        .title input {
          border: var(--border-width) solid rgba(var(--error-color), 1);
        }
      }

      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: 0.2s;
        width: 100%;
        gap: 10px;
        padding: 15px;
        border: var(--border-width) solid rgba(var(--border-color), 0.5);
        color: var(--btn-2-color);
        background: var(--btn-2-background);
        border-radius: var(--normal-border-radius);
        cursor: pointer;
        line-height: 0;

        .icon {
          font-size: 16px;
        }
      }

      .dropdown-content {
        position: relative;
        display: flex;
        flex-direction: column;
        transition: 0.2s;
        margin-top: 10px;
        border-radius: var(--normal-border-radius);
        font-size: 16px;
        outline: none;
        border: var(--border-width) solid rgba(var(--border-color), 0.5);
        background: var(--input-background);
        color: var(--input-color);
        width: 100%;
        word-break: break-word;
        max-height: 200px;
        overflow-y: auto;
        z-index: 5;

        &::-webkit-scrollbar {
          width: 5px;
        }

        .item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px;
          transition: 0.2s;
          cursor: pointer;

          .uppercase {
            text-transform: uppercase;
          }

          .name {
            text-transform: none;
          }

          .icon {
            font-size: 16px;
            color: rgba(var(--description-color), 1);
          }

          &.selected {
            .icon, span {
              color: rgba(var(--main-color), 1);
            }
          }

          &.error {
            color: rgba(var(--error-color), 1);
          }

          &:hover {
            background: var(--input-background-hover);
          }

          &:last-child {
            border-bottom-left-radius: var(--normal-border-radius);
            border-bottom-right-radius: var(--normal-border-radius);
          }

          &:first-child {
            border-top-left-radius: var(--normal-border-radius);
            border-top-right-radius: var(--normal-border-radius);
          }

          &:not(:last-child) {
            border-bottom: var(--border-width) solid rgba(var(--border-color), 1);
          }
        }
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

      button {
        padding: 10px 15px;
        border-radius: var(--small-border-radius);
        transition: 0.2s;
        font-size: 16px;

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
