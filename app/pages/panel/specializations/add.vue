<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
import "@bhplugin/vue3-datatable/dist/style.css";
import ActionBar from "~/components/ui/ActionBar.vue";
import {ref, computed} from "vue";
import Loading from "~/components/ui/Loading.vue";
import { useAlertsStore } from "~/stores/alerts";
import Input from "~/components/ui/Input.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import NumberInput from "~/components/ui/NumberInput.vue";

const { t } = useI18n();

useHead({
  title: t("pages.specializations.add.title"),
  meta: [{ name: "description", content: t("pages.specializations.add.description") }],
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
    errors.value.name = t("specializations.add.errors.nameRequired");
  }

  if (specializationData.value.lengthOfStudy === null) {
    errors.value.lengthOfStudy = t("specializations.add.errors.lengthOfStudyRequired");
  } else if (specializationData.value.lengthOfStudy < 1) {
    errors.value.lengthOfStudy = t("specializations.add.errors.lengthOfStudyMin");
  }

  if (!specializationData.value.abbreviation) {
    errors.value.abbreviation = t("specializations.add.errors.abbreviationRequired");
  } else if (specializationData.value.abbreviation.length > 1) {
    errors.value.abbreviation = t("specializations.add.errors.abbreviationTooLong");
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
  if (
      !specializationData.value.name ||
      specializationData.value.lengthOfStudy === null ||
      !specializationData.value.abbreviation
  ) {
    alertsStore.addAlert({ type: "error", title: t("specializations.add.alerts.addSpecialization.title"), message: t("specializations.add.alerts.addSpecialization.fillRequired") });
    return;
  }

  if (errors.value.name || errors.value.lengthOfStudy || errors.value.abbreviation) {
    alertsStore.addAlert({ type: "error", title: t("specializations.add.alerts.addSpecialization.title"), message: t("specializations.add.alerts.addSpecialization.hasErrors") });
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
      const resCode = response?._data?.resCode?.toString();

      switch (resCode) {
        case "4010":
          alertsStore.addAlert({ type: "error", title: t("specializations.add.alerts.addSpecialization.title"), message: t("specializations.add.alerts.addSpecialization.noPermission") });
          break;

        case "4020":
          alertsStore.addAlert({ type: "error", title: t("specializations.add.alerts.addSpecialization.title"), message: t("specializations.add.alerts.addSpecialization.noLengthOfStudy") });
          break;

        case "4030":
          alertsStore.addAlert({ type: "error", title: t("specializations.add.alerts.addSpecialization.title"), message: t("specializations.add.alerts.addSpecialization.noAbbreviation") });
          break;

        case "4040":
          alertsStore.addAlert({ type: "error", title: t("specializations.add.alerts.addSpecialization.title"), message: t("specializations.add.alerts.addSpecialization.noName") });
          break;

        case "4050":
          alertsStore.addAlert({ type: "error", title: t("specializations.add.alerts.addSpecialization.title"), message: t("specializations.add.alerts.addSpecialization.invalidLengthOfStudy") });
          break;

        case "4060":
          alertsStore.addAlert({ type: "error", title: t("specializations.add.alerts.addSpecialization.title"), message: t("specializations.add.alerts.addSpecialization.lengthOfStudyMin") });
          break;

        case "4070":
          alertsStore.addAlert({ type: "error", title: t("specializations.add.alerts.addSpecialization.title"), message: t("specializations.add.alerts.addSpecialization.abbreviationTooLong") });
          break;

        case "4080":
          alertsStore.addAlert({ type: "error", title: t("specializations.add.alerts.addSpecialization.title"), message: t("specializations.add.alerts.addSpecialization.abbreviationInUse") });
          break;

        case "4090":
          alertsStore.addAlert({ type: "error", title: t("specializations.add.alerts.addSpecialization.title"), message: t("specializations.add.alerts.addSpecialization.nameTooLong") });
          break;

        case "4100":
          alertsStore.addAlert({ type: "error", title: t("specializations.add.alerts.addSpecialization.title"), message: t("specializations.add.alerts.addSpecialization.nameInUse") });
          break;

        case "4111":
          alertsStore.addAlert({ type: "success", title: t("specializations.add.alerts.addSpecialization.title"), message: t("specializations.add.alerts.addSpecialization.success") });
          resetInputs();
          break;

        case "E10100":
          alertsStore.addAlert({ type: "error", title: t("specializations.add.alerts.addSpecialization.title"), message: t('errors.E10100') });
          break;

        default:
          alertsStore.addAlert({ type: "error", title: t("specializations.add.alerts.addSpecialization.title"), message: t("specializations.add.alerts.addSpecialization.unknown") });
      }
    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: t("specializations.add.alerts.addSpecialization.title"), message: t("specializations.add.alerts.addSpecialization.unknown") });
    },
  }).finally(() => {
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
            { label: t('sidebar.links.specializations'), to: '/panel/specializations', icon: 'material-symbols:school' },
            { label: t('specializations.add.breadcrumb'), to: '/panel/specializations/add', active: true }
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="specializations">
        <div class="content">
          <ActionBar
            class="action-bar"
            :description="t('specializations.actionBar.description')"
            :texts="[t('specializations.actionBar.add'), t('specializations.actionBar.remove')]"
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
                <h3>{{ t('specializations.add.sections.name.title') }} <span class="update" v-show="specializationData.name">{{ t('common.updated') }}</span></h3>
                <p>{{ t('specializations.add.sections.name.description') }}</p>
              </div>

              <div class="content">
                <label for="name">{{ t('specializations.add.sections.name.label') }}</label>
                <Input type="text" id="name" :placeholder="t('specializations.add.sections.name.placeholder')" v-model.trim="specializationData.name" @input="checkForErrors" />

                <p class="input-error" v-if="errors.name.length > 0">{{ errors.name }}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-head">
                <h3>{{ t('specializations.add.sections.abbreviation.title') }} <span class="update" v-show="specializationData.abbreviation && specializationData.abbreviation.length === 1">{{ t('common.updated') }}</span></h3>
                <p>{{ t('specializations.add.sections.abbreviation.description') }}</p>
              </div>

              <div class="content">
                <label for="abbreviation">{{ t('specializations.add.sections.abbreviation.label') }}</label>
                <Input type="text" id="abbreviation" :placeholder="t('specializations.add.sections.abbreviation.placeholder')" v-model.trim="specializationData.abbreviation " @input="checkForErrors" />

                <p class="input-error" v-if="errors.abbreviation.length > 0">{{ errors.abbreviation }}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-head">
                <h3>{{ t('specializations.add.sections.lengthOfStudy.title') }} <span class="update" v-show="specializationData.lengthOfStudy">{{ t('common.updated') }}</span></h3>
                <p>{{ t('specializations.add.sections.lengthOfStudy.description') }}</p>
              </div>

              <div class="content">
                <label for="lengthOfStudy">{{ t('specializations.add.sections.lengthOfStudy.label') }}</label>
                <NumberInput v-model="specializationData.lengthOfStudy" :min="1" placeholder="1" id="lengthOfStudy" @update:model-value="checkForErrors" />

                <p class="input-error" v-if="errors.lengthOfStudy.length > 0">{{ errors.lengthOfStudy }}</p>
              </div>
            </div>
          </div>

          <div class="buttons">
            <button type="submit" @click="addSpecialization">
              {{ t('specializations.add.saveBtn') }}
              <Loading v-show="loading" size="5px" color="var(--actionBar-actions-remove-color)"/>
            </button>
            <button type="reset" @click="resetInputs">
              {{ t('specializations.add.resetBtn') }}
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
