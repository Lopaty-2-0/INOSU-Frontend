<script lang="ts" setup>
import EditFormFooter from "~/components/manage/Footer.vue";
import Navbar from "~/components/layout/Navbar.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import Navigation from "~/components/ui/Navigation.vue";
import FileInput from "~/components/ui/FileInput.vue";
import {computed, ref} from "vue";
import checkPermissions from "~/componsables/checkPermissions";
import {useAlertsStore} from "~/stores/alerts";

useHead({
  title: "Panel | Import dat - Uživatelé",
  meta: [
    { name: "description", content: "Přistup zamítnut page" }
  ],
});

definePageMeta({
  roles: ["admin"],
});

const alertsStore = useAlertsStore();
const errors = ref<{ resCode: number | string; message: string; number: number }[]>([]);
const loading = ref<boolean>(false);
const selectedFile = ref<File | null>(null);
const fileInput = ref<InstanceType<typeof FileInput> | null>(null);
const title = computed<string | null>(() => {
  if (!selectedFile.value) return null;

  return selectedFile.value.name;
});
const activeLinkId = computed<number>(() => {
  if (!checkPermissions(["admin"])) {
    return -1;
  }

  return 0;
});
const navigationLinks = computed(() => {
  const links = [];

  if (checkPermissions(["admin"])) {
    links.push({ name: "Uživatelé", path: "/panel/import" });
    links.push({ name: "Třídy", path: "/panel/import/classes" });
    links.push({ name: "Zaměření", path: "/panel/import/specializations" });
  }

  links.push({ name: "Maturity", path: "/panel/import/maturitas" });
  links.push({ name: "Maturitní témata", path: "/panel/import/maturitaTopics" });

  return links;
});

const importFile = async (): Promise<void> => {
  if (!selectedFile.value) {
    alertsStore.addAlert({ type: "error", title: "Nahrání uživatelů", message: "Nebyl vybrán žádný soubor." });
    return;
  }

  const data = new FormData();
  data.append("jsonFile", selectedFile.value);

  errors.value = [];
  loading.value = true;

  await $fetch("/api/user/add/file", {
    method: "post",
    body: data,
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "50010":
          alertsStore.addAlert({ type: "error", title: "Nahrání uživatelů", message: "Na tuto akci nemáte oprávnění." });
          break;

        case "50020":
          alertsStore.addAlert({ type: "error", title: "Nahrání uživatelů", message: "Soubor nebyl nahrán." });
          break;

        case "50030":
          alertsStore.addAlert({ type: "error", title: "Nahrání uživatelů", message: "Soubor má špatný formát." });
          break;

        case "F15020":
          alertsStore.addAlert({ type: "error", title: "Nahrání uživatelů", message: "Soubor je příliš velký." });
          break;

        case "50040":
          alertsStore.addAlert({ type: "error", title: "Nahrání uživatelů", message: "Soubor je prázdný." });
          break;

        case "50050":
          alertsStore.addAlert({ type: "error", title: "Nahrání uživatelů", message: "Soubor obsahuje neplatný JSON." });
          break;

        case "50150":
          alertsStore.addAlert({ type: "error", title: "Nahrání uživatelů", message: "Žádný uživatel nebyl vytvořen." });
          break;

        case "50161":
          alertsStore.addAlert({ type: "success", title: "Nahrání uživatelů", message: "Uživatelé byli úspěšně vytvořeni." });

          const badUsers = response._data.data.badUsers;

          errors.value = badUsers.map((badUser: any) => {
            const errorResCode = badUser.resCode.toString();
            let message;

            switch (errorResCode) {
              case "50060":
                message = "Některé povinné hodnoty chybí.";
                break;

              case "50070":
                message = "Jméno je příliš dlouhé.";
                break;

              case "50080":
                message = "Příjmení je příliš dlouhé.";
                break;

              case "50090":
                message = "Neplatná role uživatele.";
                break;

              case "50100":
                message = "Heslo je příliš krátké.";
                break;

              case "50110":
                message = "Email je neplatný, příliš dlouhý nebo již existuje.";
                break;

              case "50120":
                message = "Zkratka je příliš dlouhá.";
                break;

              case "50130":
                message = "Zkratka se již používá.";
                break;

              case "50140":
                message = "Některé ID tříd jsou neplatné.";
                break;

              default:
                message = badUser.data.message;
            }

            return {
              resCode: badUser.resCode,
              message: message,
              number: badUser.data.userNumber
            };
          });

          break;

        default:
          alertsStore.addAlert({ type: "error", title: "Nahrání uživatelů", message: "Nastala neznámá chyba." });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Nahrání uživatelů", message: "Nastala neznámá chyba." });
    },
  }).finally(async (): Promise<void> => {
    await resetFile();
    loading.value = false;
  });
};

const resetFile = async (): Promise<void> => {
  selectedFile.value = null;

  if (fileInput.value) {
    fileInput.value.resetError();
  }
};
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Data', to: '/panel/import', icon: 'material-symbols:upload-2-rounded' },
            { label: 'Import', to: '/panel/import' },
            { label: 'Uživatelé', to: '/panel/import', active: true }
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="import">
        <Navigation class="navigation" title="Import" :active-link-id="activeLinkId" :links="navigationLinks" />

        <div class="content">
          <div class="page-section bottom-line">
            <div class="section-head">
              <h3>Import uživatelů <span class="update" v-if="selectedFile">(aktualizováno)</span></h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, aliquam aliquid amet aut consequuntur cum deleniti enim exercitationem fuga.</p>
            </div>

            <FileInput class="fileInput" :max-size-m-b="10" accept=".json" v-model="selectedFile" placeholder="Vyberte soubor pro import dat" :title="title"></FileInput>
          </div>

          <div class="page-section" :class="{ 'buttom-line': errors.length > 0 }">
            <EditFormFooter :submit-function="importFile" :reset-function="resetFile" :is-loading="loading" />
          </div>

          <div class="page-section" v-if="errors.length > 0">
            <div class="errors">
              <p class="error" v-for="error in errors">{{ error.message }} <span class="number">Číslo: {{ error.number }}</span></p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
#import {
  display: flex;
  flex-direction: row;
  gap: 30px;
  position: relative;

  .navigation {
    height: fit-content;
    position: sticky;
    top: 110px;
    min-width: 300px;
    padding: 30px;
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 35px;
    position: relative;

    .page-section {
      display: flex;
      flex-direction: column;
      gap: 30px;

      &.bottom-line {
        padding-bottom: 35px;
        border-bottom: 1px solid rgba(var(--border-color), 0.5);
      }

      .errors {
        display: flex;
        flex-direction: column;
        gap: 20px;

        .error {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          gap: 30px;
          color: rgba(var(--error-color), 1);
          font-size: 16px;

          .number {
            font-weight: 600;
          }
        }
      }
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

    .password-rules {
      display: flex;
      flex-direction: column;
      gap: 10px;

      h4 {
        font-weight: 600;
        font-size: 16px;
        color: var(--title-color);
        margin-top: 10px;
      }

      ul {
        list-style: none;

        li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          color: rgba(var(--description-color), 1);
          margin-bottom: 10px;

          .icon {
            color: rgba(var(--main-color), 1);
            line-height: 0;
          }
        }

        p {
          display: flex;
          align-items: center;
          gap: 5px;

          .icon {
            padding-left: 5px;
            color: rgba(var(--success-color), 1);
          }
        }
      }
    }

    ::v-deep(.reset-password) {
      flex-direction: column;
    }

    ::v-deep(.section) {
      width: 100%;
    }
  }
}

@media (max-width: 1055px) {
  #import {
    flex-direction: column;
    gap: 30px;

    .navigation {
      width: 100%;
      position: relative;
      top: 0;
      min-width: 200px;
    }
  }
}
</style>