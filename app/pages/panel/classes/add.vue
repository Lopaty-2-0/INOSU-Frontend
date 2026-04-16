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
import { useI18n } from "#imports";

definePageMeta({
  roles: ["admin"],
});

const { t } = useI18n();

useHead({
  title: t("pages.classes.add.title"),
  meta: [{ name: "description", content: t("pages.classes.add.description") }],
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
    errors.value.name = t('classes.add.errors.nameRequired');
  }

  if (!classData.value.grade || classData.value.grade < 1) {
    errors.value.grade = t('classes.add.errors.gradeRequired');
  } else if (classData.value.grade < 1) {
    errors.value.grade = t('classes.add.errors.gradeMin');
  }

  if (!classData.value.group) {
    errors.value.group = t('classes.add.errors.groupRequired');
  } else if (classData.value.group.length > 1) {
    errors.value.group = t('classes.add.errors.groupTooLong');
  }

  if (classData.value.specialization === null) {
    errors.value.specialization = t('classes.add.errors.specializationRequired');
  }
};

const addClass = async (): Promise<void> => {
  if (!classData.value.specialization || !classData.value.group || !classData.value.grade || !classData.value.name) {
    alertsStore.addAlert({ type: "error", title: t('classes.add.alerts.createClass.title'), message: t('classes.add.alerts.createClass.emptyFields') });
    return;
  }

  if (errors.value.name || errors.value.grade || errors.value.group || errors.value.specialization) {
    alertsStore.addAlert({ type: "error", title: t('classes.add.alerts.createClass.title'), message: t('classes.add.alerts.createClass.hasErrors') });
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
          alertsStore.addAlert({ type: "error", title: t('classes.add.alerts.createClass.title'), message: t('classes.add.alerts.createClass.noPermission') });
          break;

        case "8020":
          alertsStore.addAlert({ type: "error", title: t('classes.add.alerts.createClass.title'), message: t('classes.add.alerts.createClass.noGrade') });
          break;

        case "8030":
          alertsStore.addAlert({ type: "error", title: t('classes.add.alerts.createClass.title'), message: t('classes.add.alerts.createClass.noGroup') });
          break;

        case "8040":
          alertsStore.addAlert({ type: "error", title: t('classes.add.alerts.createClass.title'), message: t('classes.add.alerts.createClass.noSpecialization') });
          break;

        case "8050":
          alertsStore.addAlert({ type: "error", title: t('classes.add.alerts.createClass.title'), message: t('classes.add.alerts.createClass.noName') });
          break;

        case "8060":
          alertsStore.addAlert({ type: "error", title: t('classes.add.alerts.createClass.title'), message: t('classes.add.alerts.createClass.invalidGrade') });
          break;

        case "8070":
          alertsStore.addAlert({ type: "error", title: t('classes.add.alerts.createClass.title'), message: t('classes.add.alerts.createClass.gradeTooLarge') });
          break;

        case "8080":
          alertsStore.addAlert({ type: "error", title: t('classes.add.alerts.createClass.title'), message: t('classes.add.alerts.createClass.groupTooLong') });
          break;

        case "8090":
          alertsStore.addAlert({ type: "error", title: t('classes.add.alerts.createClass.title'), message: t('classes.add.alerts.createClass.invalidSpecialization') });
          break;

        case "8100":
          alertsStore.addAlert({ type: "error", title: t('classes.add.alerts.createClass.title'), message: t('classes.add.alerts.createClass.invalidSpecializationValue') });
          break;

        case "8110":
          alertsStore.addAlert({ type: "error", title: t('classes.add.alerts.createClass.title'), message: t('classes.add.alerts.createClass.specializationNotFound') });
          break;

        case "8120":
          alertsStore.addAlert({ type: "error", title: t('classes.add.alerts.createClass.title'), message: t('classes.add.alerts.createClass.gradeExceedsLength') });
          break;

        case "8130":
          alertsStore.addAlert({ type: "error", title: t('classes.add.alerts.createClass.title'), message: t('classes.add.alerts.createClass.nameTooLong') });
          break;

        case "8140":
          alertsStore.addAlert({ type: "error", title: t('classes.add.alerts.createClass.title'), message: t('classes.add.alerts.createClass.nameInUse') });
          break;

        case "8151":
          alertsStore.addAlert({ type: "success", title: t('classes.add.alerts.createClass.title'), message: t('classes.add.alerts.createClass.success') });
          resetSelectedClasses();
          break;

        case "E10100":
          alertsStore.addAlert({ type: "error", title: t('classes.add.alerts.createClass.title'), message: t('errors.E10100') });
          break;

        default:
          alertsStore.addAlert({ type: "error", title: t('classes.add.alerts.createClass.title'), message: t('classes.add.alerts.createClass.unknown') });
      }
    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: t('classes.add.alerts.createClass.title'), message: t('classes.add.alerts.createClass.unknown') });
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
    if (specializationsError.value?.data?.resCode?.toString() === "E10100") {
      useLoadingStore().setHasRateLimit(true);
      return;
    }
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
            { label: t('sidebar.links.classes'), to: '/panel/classes', icon: 'material-symbols:flight-class-rounded' },
            { label: t('classes.add.breadcrumb.create'), to: '/panel/classes/add', active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="classes">
        <div class="content">
          <ActionBar
            class="action-bar"
            :description="t('classes.add.actionBar.description')"
            :texts="[t('classes.add.actionBar.add'), t('classes.add.actionBar.remove')]"
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
                <h3>{{ t('classes.add.sections.name.title') }} <span class="update" v-show="classData.name">{{ t('common.updated') }}</span></h3>
                <p>{{ t('classes.add.sections.name.description') }}</p>
              </div>

              <div class="content">
                <label for="name">{{ t('classes.add.sections.name.label') }}</label>
                <Input type="text" id="name" placeholder="V1B-ANJ1" v-model.trim="classData.name" @input="checkForErrors" />

                <p class="input-error" v-if="errors.name.length > 0">{{ errors.name }}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-head">
                <h3>{{ t('classes.add.sections.specialization.title') }} <span class="update" v-show="classData.specialization">{{ t('common.updated') }}</span></h3>
                <p>{{ t('classes.add.sections.specialization.description') }}</p>
              </div>

              <div class="content">
                <label>{{ t('classes.add.sections.specialization.label') }}</label>

                <InputMenu
                  v-model="selectedSpecialization"
                  :multiple="false"
                  :items="dropDownSpecializations"
                  :create-item="false"
                  :placeholder="t('classes.add.sections.specialization.placeholder')"
                  :deselect="true"
                  :disable-item-filtering="true"
                  :no-data-text="t('classes.add.sections.specialization.noData')"
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
                <h3>{{ t('classes.add.sections.grade.title') }} <span class="update" v-show="classData.grade">{{ t('common.updated') }}</span></h3>
                <p>{{ t('classes.add.sections.grade.description') }}</p>
              </div>

              <div class="content">
                <label for="grade">{{ t('classes.add.sections.grade.label') }}</label>
                <NumberInput v-model="classData.grade" :min="1" placeholder="1" id="grade" @update:model-value="checkForErrors" />

                <p class="input-error" v-if="errors.grade.length > 0">{{ errors.grade }}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-head">
                <h3>{{ t('classes.add.sections.group.title') }} <span class="update" v-show="classData.group && classData.group.length === 1">{{ t('common.updated') }}</span></h3>
                <p>{{ t('classes.add.sections.group.description') }}</p>
              </div>

              <div class="content">
                <label for="group">{{ t('classes.add.sections.group.label') }}</label>
                <Input type="text" id="group" placeholder="A" v-model.trim="classData.group" @input="checkForErrors" />

                <p class="input-error" v-if="errors.group.length > 0">{{ errors.group }}</p>
              </div>
            </div>
          </div>

          <div class="buttons">
            <button type="submit" @click="addClass">
              {{ t('manage.footer.save') }}
              <Loading v-show="loading" size="5px" color="var(--actionBar-actions-remove-color)"/>
            </button>
            <button type="reset" @click="resetSelectedClasses">
              {{ t('manage.footer.reset') }}
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
