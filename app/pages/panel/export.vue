<script lang="ts" setup>
import {ref} from "vue";
import Navbar from "~/components/layout/Navbar.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import checkPermissions from "~/componsables/checkPermissions";
import Loading from "~/components/ui/Loading.vue";
import { useAlertsStore } from "~/stores/alerts";
import { useI18n } from "#imports";

const { t } = useI18n();

useHead({
  title: t('pages.export.title'),
  meta: [
    { name: "description", content: t('pages.export.description') }
  ],
});

definePageMeta({
  roles: ["admin", "teacher"],
});
const alertsStore = useAlertsStore();
const loading = ref({
  users: false,
  classes: false,
  specializations: false,
  maturitas: false,
  maturitaTopics: false,
  maturitaTable: false
});

const downloadFile = (response: any): void => {
  const disposition = response.headers.get("content-disposition");
  let fileName = "downloaded_file";

  if (disposition) {
    const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
    const asciiMatch = disposition.match(/filename="?([^"]+)"?/i);

    if (utf8Match?.[1]) {
      fileName = decodeURIComponent(utf8Match[1]);
    } else if (asciiMatch?.[1]) {
      fileName = asciiMatch[1];
    }
  }

  const contentType = response.headers.get("content-type") || "application/octet-stream";
  const data = response._data;

  const blob: Blob =
      data instanceof Blob
          ? data
          : data instanceof ArrayBuffer
              ? new Blob([data], { type: contentType })
              : typeof data === "string"
                  ? new Blob([data], { type: contentType })
                  : new Blob([JSON.stringify(data)], { type: "application/json;charset=utf-8" });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const exportUsers = async (): Promise<void> => {
  loading.value.users = true;

  try {
    const response = await $fetch.raw("/api/user/get/file", {
      method: "GET",
      credentials: "include",
      responseType: "blob"
    });

    const contentDisposition = response.headers.get("content-disposition");

    if (!contentDisposition) {
      const resCode: string | undefined = response._data.data?.resCode?.toString();

      if (resCode === "107010") {
        alertsStore.addAlert({type: "error", title: t('export.users.title'), message: t('export.alerts.noPermission'),});
        return;
      }

      alertsStore.addAlert({type: "error", title: t('export.users.title'), message: t('export.alerts.unknown')});
      return;
    }

    downloadFile(response);
  } catch {
    alertsStore.addAlert({type: "error", title: t('export.users.title'), message: t('export.alerts.unknown'),});
  } finally {
    loading.value.users = false;
  }
};

const exportClasses = async (): Promise<void> => {
  loading.value.classes = true;

  try {
    const response = await $fetch.raw("/api/class/get/file", {
      method: "GET",
      credentials: "include",
    });

    const contentDisposition = response.headers.get("content-disposition");

    if (!contentDisposition) {
      const resCode: string | undefined = response._data.data?.resCode?.toString();

      if (resCode === "106010") {
        alertsStore.addAlert({type: "error", title: t('export.classes.title'), message: t('export.alerts.noPermission'),});
        return;
      }

      alertsStore.addAlert({type: "error", title: t('export.classes.title'), message: t('export.alerts.unknown')});
      return;
    }

    downloadFile(response);
  } catch {
    alertsStore.addAlert({type: "error", title: t('export.classes.title'), message: t('export.alerts.unknown'),});
  } finally {
    loading.value.classes = false;
  }
};

const exportSpecializations = async (): Promise<void> => {
  loading.value.specializations = true;

  try {
    const response = await $fetch.raw("/api/specialization/get/file", {
      method: "GET",
      credentials: "include",
    });

    const contentDisposition = response.headers.get("content-disposition");

    if (!contentDisposition) {
      const resCode: string | undefined = response._data.data?.resCode?.toString();

      if (resCode === "104010") {
        alertsStore.addAlert({type: "error", title: t('export.specializations.title'), message: t('export.alerts.noPermission'),});
        return;
      }

      alertsStore.addAlert({type: "error", title: t('export.specializations.title'), message: t('export.alerts.unknown')});
      return;
    }

    downloadFile(response);
  } catch {
    alertsStore.addAlert({type: "error", title: t('export.specializations.title'), message: t('export.alerts.unknown'),});
  } finally {
    loading.value.specializations = false;
  }
};

const exportMaturitas = async (): Promise<void> => {
  loading.value.maturitas = true;

  try {
    const response = await $fetch.raw("/api/maturita/get/file", {
      method: "GET",
      credentials: "include",
    });

    const contentDisposition = response.headers.get("content-disposition");

    if (!contentDisposition) {
      const resCode: string | undefined = response._data.data?.resCode?.toString();

      if (resCode === "108010") {
        alertsStore.addAlert({type: "error", title: t('export.maturitas.title'), message: t('export.alerts.noPermission'),});
        return;
      }

      alertsStore.addAlert({type: "error", title: t('export.maturitas.title'), message: t('export.alerts.unknown')});
      return;
    }

    downloadFile(response);
  } catch {
    alertsStore.addAlert({type: "error", title: t('export.maturitas.title'), message: t('export.alerts.unknown'),});
  } finally {
    loading.value.maturitas = false;
  }
};

const exportMaturitaTopics = async (): Promise<void> => {
  loading.value.maturitaTopics = true;

  try {
    const response = await $fetch.raw("/api/topic/get/file", {
      method: "GET",
      credentials: "include",
    });

    const contentDisposition = response.headers.get("content-disposition");

    if (!contentDisposition) {
      const resCode: string | undefined = response._data.data?.resCode?.toString();

      if (resCode === "107010") {
        alertsStore.addAlert({type: "error", title: t('export.maturitaTopics.title'), message: t('export.alerts.noPermission'),});
        return;
      }

      alertsStore.addAlert({type: "error", title: t('export.maturitaTopics.title'), message: t('export.alerts.unknown')});
      return;
    }

    downloadFile(response);
  } catch {
    alertsStore.addAlert({type: "error", title: t('export.maturitaTopics.title'), message: t('export.alerts.unknown'),});
  } finally {
    loading.value.maturitaTopics = false;
  }
};

const exportMaturitaTable = async (): Promise<void> => {
  loading.value.maturitaTable = true;

  try {
    const response = await $fetch.raw("/api/maturita_task/get/excel", {
      method: "GET",
      credentials: "include",
    });

    const contentDisposition = response.headers.get("content-disposition");

    if (!contentDisposition) {
      const resCode: string | undefined = response._data.data?.resCode?.toString();

      if (resCode === "109010") {
        alertsStore.addAlert({type: "error", title: t('export.maturitaTable.title'), message: t('export.alerts.noPermission'),});
        return;
      }

      alertsStore.addAlert({type: "error", title: t('export.maturitaTable.title'), message: t('export.alerts.unknown')});
      return;
    }

    downloadFile(response);
  } catch {
    alertsStore.addAlert({type: "error", title: t('export.maturitaTable.title'), message: t('export.alerts.unknown'),});
  } finally {
    loading.value.maturitaTable = false;
  }
};
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: t('sidebar.sections.data'), to: '/panel/export', icon: 'material-symbols:download-2-rounded' },
            { label: t('export.title'), to: '/panel/export', active: true }
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="export">
        <div class="page-section bottom-line" v-if="checkPermissions(['admin'])">
          <div class="section-head">
            <h3>{{ t('export.users.title') }}</h3>
            <p>{{ t('export.users.description') }}</p>
          </div>

          <button type="button" class="primary" @click="exportUsers">
            {{ t('export.exportButton') }}
            <Loading size="5px" color="var(--btn-1-color)" v-if="loading.users" />
          </button>
        </div>

        <div class="page-section bottom-line" v-if="checkPermissions(['admin'])">
          <div class="section-head">
            <h3>{{ t('export.classes.title') }}</h3>
            <p>{{ t('export.classes.description') }}</p>
          </div>

          <button type="button" class="primary" @click="exportClasses">
            {{ t('export.exportButton') }}
            <Loading size="5px" color="var(--btn-1-color)" v-if="loading.classes" />
          </button>
        </div>

        <div class="page-section bottom-line" v-if="checkPermissions(['admin'])">
          <div class="section-head">
            <h3>{{ t('export.specializations.title') }}</h3>
            <p>{{ t('export.specializations.description') }}</p>
          </div>

          <button type="button" class="primary" @click="exportSpecializations">
            {{ t('export.exportButton') }}
            <Loading size="5px" color="var(--btn-1-color)" v-if="loading.specializations" />
          </button>
        </div>

        <div class="page-section bottom-line">
          <div class="section-head">
            <h3>{{ t('export.maturitas.title') }}</h3>
            <p>{{ t('export.maturitas.description') }}</p>
          </div>

          <button type="button" class="primary" @click="exportMaturitas">
            {{ t('export.exportButton') }}
            <Loading size="5px" color="var(--btn-1-color)" v-if="loading.maturitas" />
          </button>
        </div>

        <div class="page-section bottom-line">
          <div class="section-head">
            <h3>{{ t('export.maturitaTopics.title') }}</h3>
            <p>{{ t('export.maturitaTopics.description') }}</p>
          </div>

          <button type="button" class="primary" @click="exportMaturitaTopics">
            {{ t('export.exportButton') }}
            <Loading size="5px" color="var(--btn-1-color)" v-if="loading.maturitaTopics" />
          </button>
        </div>

        <div class="page-section">
          <div class="section-head">
            <h3>{{ t('export.maturitaTable.title') }}</h3>
            <p>{{ t('export.maturitaTable.description') }}</p>
          </div>

          <button type="button" class="primary" @click="exportMaturitaTable">
            {{ t('export.exportButton') }}
            <Loading size="5px" color="var(--btn-1-color)" v-if="loading.maturitaTable" />
          </button>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
#export {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 35px;
  position: relative;

  .page-section {
    border-bottom: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 30px;

    .section-head {
      display: flex;
      flex-direction: column;
      gap: 10px;

      h3 {
        font-weight: 700;
        font-size: 20px;
        color: var(--title-color);
      }

      p {
        color: rgba(var(--description-color), 1);
        font-size: 16px;
      }
    }

    &.bottom-line {
      padding-bottom: 35px;
      border-bottom: 1px solid rgba(var(--border-color), 0.5);
    }

    button {
      padding: 10px 15px;
      border-radius: var(--small-border-radius);
      transition: 0.2s;
      font-size: 16px;
      background: var(--btn-2-background);
      color: var(--btn-2-color);
      border: var(--border-width) solid rgba(var(--border-color), 0.5);
      cursor: pointer;
      height: fit-content;

      &:hover {
        background: var(--btn-2-hover-background);
      }

      &.primary {
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
}

@media (max-width: 700px) {
  #export .page-section {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>