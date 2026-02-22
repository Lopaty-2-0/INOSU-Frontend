<script lang="ts" setup>
import EditFormFooter from "~/components/manage/Footer.vue";
import Navbar from "~/components/layout/Navbar.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import Navigation from "~/components/ui/Navigation.vue";
import FileInput from "~/components/ui/FileInput.vue";
import {computed, ref} from "vue";
import checkPermissions from "~/componsables/checkPermissions";

useHead({
  title: "Panel | Import dat - Maturitní témata",
  meta: [
    { name: "description", content: "Přistup zamítnut page" }
  ],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const loading = ref<boolean>(false);
const selectedFile = ref<File | null>(null);
const fileInput = ref<InstanceType<typeof FileInput> | null>(null);
const title = computed<string | null>(() => {
  if (!selectedFile.value) return null;

  return selectedFile.value.name;
});
const activeLinkId = computed<number>(() => {
  if (!checkPermissions(["admin"])) {
    return 1;
  }

  return 4;
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
  console.log(selectedFile.value);

  loading.value = true;

  setTimeout(() => {
    loading.value = false;
  }, 2000);
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
            { label: 'Data', to: '/panel/import/maturitaTopics', icon: 'material-symbols:upload-2-rounded' },
            { label: 'Import', to: '/panel/import/maturitaTopics' },
            { label: 'Maturitní témata', to: '/panel/import/maturitaTopics', active: true }
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
              <h3>Import maturitních témat <span class="update" v-if="selectedFile">(aktualizováno)</span></h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, aliquam aliquid amet aut consequuntur cum deleniti enim exercitationem fuga.</p>
            </div>

            <FileInput class="fileInput" :max-size-m-b="10" accept=".json" v-model="selectedFile" placeholder="Vyberte soubor pro import dat" :title="title"></FileInput>
          </div>


          <EditFormFooter :submit-function="importFile" :reset-function="resetFile" :is-loading="loading" />
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
