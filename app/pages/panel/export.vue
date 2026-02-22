<script lang="ts" setup>
import Navbar from "~/components/layout/Navbar.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import checkPermissions from "~/componsables/checkPermissions";
import ActionBar from "~/components/ui/ActionBar.vue";
import Loading from "~/components/ui/Loading.vue";

useHead({
  title: "Panel | Export dat",
  meta: [
    { name: "description", content: "Přistup zamítnut page" }
  ],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const loading = ref({
  users: false,
  classes: false,
  specializations: false,
  maturitas: false,
  maturitaTopics: false,
  maturitaTable: false
});

const exportUsers = async (): Promise<void> => {
  loading.value.users = true;

  setTimeout(() => {
    loading.value.users = false;
  }, 1000);
};

const exportClasses = async (): Promise<void> => {
  loading.value.classes = true;

  setTimeout(() => {
    loading.value.classes = false;
  }, 1000);
};

const exportSpecializations = async (): Promise<void> => {
  loading.value.specializations = true;

  setTimeout(() => {
    loading.value.specializations = false;
  }, 1000);
};

const exportMaturitas = async (): Promise<void> => {
  loading.value.maturitas = true;

  setTimeout(() => {
    loading.value.maturitas = false;
  }, 1000);
};

const exportMaturitaTopics = async (): Promise<void> => {
  loading.value.maturitaTopics = true;

  setTimeout(() => {
    loading.value.maturitaTopics = false;
  }, 1000);
};

const exportMaturitaTable = async (): Promise<void> => {
  loading.value.maturitaTable = true;

  setTimeout(() => {
    loading.value.maturitaTable = false;
  }, 1000);
};
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: 'Data', to: '/panel/export', icon: 'material-symbols:download-2-rounded' },
            { label: 'Export', to: '/panel/export', active: true }
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="export">
        <div class="page-section bottom-line" v-if="checkPermissions(['admin'])">
          <div class="section-head">
            <h3>Export uživatelů</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, aliquam aliquid amet aut consequuntur cum deleniti enim exercitationem fuga.</p>
          </div>

          <button type="button" class="primary" @click="exportUsers">
            Exportovat
            <Loading size="5px" color="var(--btn-1-color)" v-if="loading.users" />
          </button>
        </div>

        <div class="page-section bottom-line" v-if="checkPermissions(['admin'])">
          <div class="section-head">
            <h3>Export tříd</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, aliquam aliquid amet aut consequuntur cum deleniti enim exercitationem fuga.</p>
          </div>

          <button type="button" class="primary" @click="exportClasses">
            Exportovat
            <Loading size="5px" color="var(--btn-1-color)" v-if="loading.classes" />
          </button>
        </div>

        <div class="page-section bottom-line" v-if="checkPermissions(['admin'])">
          <div class="section-head">
            <h3>Export zaměření</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, aliquam aliquid amet aut consequuntur cum deleniti enim exercitationem fuga.</p>
          </div>

          <button type="button" class="primary" @click="exportSpecializations">
            Exportovat
            <Loading size="5px" color="var(--btn-1-color)" v-if="loading.specializations" />
          </button>
        </div>

        <div class="page-section bottom-line">
          <div class="section-head">
            <h3>Export maturit</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, aliquam aliquid amet aut consequuntur cum deleniti enim exercitationem fuga.</p>
          </div>

          <button type="button" class="primary" @click="exportMaturitas">
            Exportovat
            <Loading size="5px" color="var(--btn-1-color)" v-if="loading.maturitas" />
          </button>
        </div>

        <div class="page-section bottom-line">
          <div class="section-head">
            <h3>Export maturitních témat</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, aliquam aliquid amet aut consequuntur cum deleniti enim exercitationem fuga.</p>
          </div>

          <button type="button" class="primary" @click="exportMaturitaTopics">
            Exportovat
            <Loading size="5px" color="var(--btn-1-color)" v-if="loading.maturitaTopics" />
          </button>
        </div>

        <div class="page-section">
          <div class="section-head">
            <h3>Export maturitní tabulky</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, aliquam aliquid amet aut consequuntur cum deleniti enim exercitationem fuga.</p>
          </div>

          <button type="button" class="primary" @click="exportMaturitaTable">
            Exportovat
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