<script lang="ts" setup>
import EditFormFooter from "~/components/manage/Footer.vue";
import EditName from "~/components/manage/Name.vue";
import Navbar from "~/components/layout/Navbar.vue";
import {ref, computed} from "vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import { useAlertsStore } from "~/stores/alerts";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import checkPermissions from "~/componsables/checkPermissions";
import Input from "~/components/ui/Input.vue";

useHead({
  title: "Panel | Témata maturitních prací - Přidávání",
  meta: [
    { name: "description", content: "Panel Settings User Information" }
  ],
});

definePageMeta({
  roles: ["admin", "teacher"],
});

const route = useRoute();
const role = route.params.role as string;

const alertsStore = useAlertsStore();
const editName = ref<InstanceType<typeof EditName> | null>(null);
const loading = ref<boolean>(false);
const newData = ref<{ name: string | undefined }>({
  name: undefined,
});

const resetUserData = (): void => {
  newData.value = {
    name: undefined,
  };

  if (editName.value) editName.value.reset();
};

const addTopic = async (): Promise<void> => {
  if (!newData.value.name) {
    alertsStore.addAlert({ type: "error", title: "Přidání tématu", message: "Název tématu nebyl zadán." });
    return;
  }

  loading.value = true;

  await $fetch("/api/topic/add", {
    method: "post",
    body: {
      name: newData.value.name,
    },
    credentials: "include",
    ignoreResponseError: true,

    onResponse({ response }: any) {
      const resCode = response?._data?.resCode?.toString();

      switch (resCode) {
        case "63010":
          alertsStore.addAlert({ type: "error", title: "Přidání tématu", message: "Nemáte oprávnění k této akci." });
          break;

        case "63020":
          alertsStore.addAlert({ type: "error", title: "Přidání tématu", message: "Název tématu nebyl zadán." });
          break;

        case "63030":
          alertsStore.addAlert({ type: "error", title: "Přidání tématu", message: "Název tématu je příliš dlouhý." });
          break;

        case "63040":
          alertsStore.addAlert({ type: "error", title: "Přidání tématu", message: "Téma s tímto názvem již existuje." });
          break;

        case "63051":
          alertsStore.addAlert({ type: "success", title: "Přidání tématu", message: "Téma bylo úspěšně vytvořeno." });
          resetUserData();
          break;

        default:
          alertsStore.addAlert({ type: "error", title: "Přidání tématu", message: "Nastala neznámá chyba." });
          break;
      }
    },

    onRequestError() {
      alertsStore.addAlert({ type: "error", title: "Přidání tématu", message: "Nastala chyba při komunikaci se serverem." });
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
            { label: 'Maturity', to: `/panel/maturita/${role}/topics`, icon: 'material-symbols:architecture-rounded' },
            { label: 'Témata', to: `/panel/maturita/${role}/topics` },
            { label: 'Vytvoření', to: `/panel/maturita/${role}/topics/add`, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="topics">
        <div class="content">
          <ActionBar
              class="action-bar"
              description="Správa maturitních témat"
              :texts="['Přidat', 'Odebrat']"
              :actions="['add', 'remove']"
              :active="0"
              :icons="[
              'material-symbols:add-rounded',
              'material-symbols:delete-rounded',
            ]"
              :navigate-to="[
              `/panel/maturita/${role}/topics/add`,
              `/panel/maturita/${role}/topics/remove`,
            ]"
          />

          <div class="page-section">
            <div class="section-head">
              <h3>Název * <span class="update" v-show="newData.name">(aktualizováno)</span></h3>
              <p>Zadejte název úkolu, který bude jasně vystihovat jeho obsah a účel.</p>
            </div>

            <div class="section-content">
              <label for="name">Název</label>
              <Input type="text" id="name" placeholder="Dynamická webová aplikace" v-model.trim="newData.name" />
            </div>
          </div>

          <EditFormFooter :is-loading="loading" :reset-function="resetUserData" :submit-function="addTopic">
            Pole označená * jsou povinná
          </EditFormFooter>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
#topics {
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

    .page-section {
      border-bottom: 1px solid rgba(var(--border-color), 0.5);
      padding-bottom: 35px;
      display: flex;
      flex-direction: column;
      gap: 30px;

      .line {
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 35px;
        flex-wrap: wrap;

        ::v-deep(.section) {
          flex: 1;
        }
      }
    }

    .section-content {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;

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

    .line {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 30px;
      width: 100%;
      flex: 1;
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
  }
}

@media (max-width: 1055px) {
  #topics {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
