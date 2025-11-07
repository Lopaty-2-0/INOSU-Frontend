<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import "@bhplugin/vue3-datatable/dist/style.css";
import ActionBar from "~/components/ui/ActionBar.vue";
import {ref} from "vue";
import Loading from "~/components/ui/Loading.vue";
import { useAlertsStore } from "~/stores/alerts";
import Input from "~/components/ui/Input.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import NumberInput from "~/components/ui/NumberInput.vue";

useHead({
  title: "Panel | Zaměření - Přidání",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin"],
});

const alertsStore = useAlertsStore();
const loading = ref<boolean>(false);
const specializationData = ref<{ name: string; lengthOfStudy: number | null; abbreviation: string; }>({
  name: "",
  lengthOfStudy: null,
  abbreviation: "",
});
const errors = ref<{ name: string; lengthOfStudy: string; abbreviation: string; }>({
  name: "",
  lengthOfStudy: "",
  abbreviation: "",
});

const checkForErrors = (): void => {
  errors.value.name = "";
  errors.value.lengthOfStudy = "";
  errors.value.abbreviation = "";

  if (!specializationData.value.name) {
    errors.value.name = "Název třídy je povinný.";
  }

  if (specializationData.value.lengthOfStudy === null) {
    errors.value.lengthOfStudy = "Délka studia je povinná.";
  } else if (specializationData.value.lengthOfStudy < 1) {
    errors.value.lengthOfStudy = "Délka studia musí být větší než 0.";
  }

  if (!specializationData.value.abbreviation) {
    errors.value.abbreviation = "Zkratka zaměření je povinná.";
  } else if (specializationData.value.abbreviation.length > 1) {
    errors.value.abbreviation = "Zkratka zaměření může mít maximálně 1 znak.";
  }
};

const resetInputs = (): void => {
  specializationData.value.name = "";
  specializationData.value.lengthOfStudy = null;
  specializationData.value.abbreviation = "";

  errors.value.name = "";
  errors.value.lengthOfStudy = "";
  errors.value.abbreviation = "";
};

const addSpecialization = async (): Promise<void> => {
  if (!specializationData.value.name || specializationData.value.lengthOfStudy === null || !specializationData.value.abbreviation) {
    alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Vyplňte všechna povinná pole." });
    return;
  }

  if (errors.value.name || errors.value.lengthOfStudy || errors.value.abbreviation) {
    alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Opravte chyby ve formuláři." });
    return;
  }

  loading.value = true;

  await $fetch("/api/specialization/add", {
    method: "post",
    body: {
      name: specializationData.value.name,
      lengthOfStudy: specializationData.value.lengthOfStudy,
      abbreviation: specializationData.value.abbreviation,
    },
    ignoreResponseError: true,
    credentials: "include",
    onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "4010":
          alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Nemáte oprávnění k této akci." });
          break;
        case "4020":
          alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Délka studia chybí." });
          break;
        case "4030":
          alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Délka studia musí být celé číslo." });
          break;
        case "4040":
          alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Zkratka zaměření chybí." });
          break;
        case "4050":
          alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Zkratka zaměření je příliš dlouhá." });
          break;
        case "4060":
          alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Zkratka zaměření je již používána." });
          break;
        case "4070":
          alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Název zaměření chybí." });
          break;
        case "4080":
          alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Název zaměření je příliš dlouhý." });
          break;
        case "4090":
          alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Název zaměření je již používán." });
          break;
        case "4101":
          alertsStore.addAlert({ type: "success", title: "Přidání zaměření", message: "Zaměření bylo úspěšně vytvořeno." });

          resetInputs();
          break;
        default:
          alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Nastala neznámá chyba." });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Přidání zaměření", message: "Nastala neznámá chyba." });
    },
  }).finally((): void => {
    loading.value = false;
  });
};
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Zaměření', to: '/panel/specializations', icon: 'material-symbols:school' },
            { label: 'Vytvoření', to: '/panel/specializations/add', active: true }
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
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
            :active="0"
            :navigate-to="[
              `/panel/specializations/add`,
              `/panel/specializations/remove`,
            ]"
          />

          <div class="form">
            <div class="section">
              <div class="section-head">
                <h3>Název * <span class="update" v-show="specializationData.name">(aktualizováno)</span></h3>
                <p>Zadejte název zaměření, které chcete přidat. Název musí být jedinečný.</p>
              </div>

              <div class="content">
                <label for="name">Název</label>
                <Input type="text" id="name" placeholder="Informační technologie" v-model="specializationData.name" @input="checkForErrors" />

                <p class="input-error" v-if="errors.name.length > 0">{{ errors.name }}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-head">
                <h3>Zkratka * <span class="update" v-show="specializationData.abbreviation && specializationData.abbreviation.length === 1">(aktualizováno)</span></h3>
                <p>Zadejte jednopísmennou zkratku zaměření. Zkratka musí být unikátní.</p>
              </div>

              <div class="content">
                <label for="abbreviation">Zkratka</label>
                <Input type="text" id="abbreviation" placeholder="V" v-model="specializationData.abbreviation " @input="checkForErrors" />

                <p class="input-error" v-if="errors.abbreviation.length > 0">{{ errors.abbreviation }}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-head">
                <h3>Délka studia * <span class="update" v-show="specializationData.lengthOfStudy">(aktualizováno)</span></h3>
                <p>Zadejte délku studia v letech. Minimální hodnota je 1 rok.</p>
              </div>

              <div class="content">
                <label for="lengthOfStudy">Délka studia</label>
                <NumberInput v-model="specializationData.lengthOfStudy" :min="1" placeholder="1" id="lengthOfStudy" @update:model-value="checkForErrors" />

                <p class="input-error" v-if="errors.lengthOfStudy.length > 0">{{ errors.lengthOfStudy }}</p>
              </div>
            </div>
          </div>

          <div class="buttons">
            <button type="submit" @click="addSpecialization">
              Uložit změny
              <Loading v-show="loading" size="5px" color="var(--actionBar-actions-remove-color)"/>
            </button>
            <button type="reset" @click="resetInputs">
              Resetovat změny
            </button>
          </div>
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
  #specializations {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
