<script lang="ts" setup>
import EditFormFooter from "~/components/tasks/manage/Footer.vue";
import EditName from "~/components/tasks/manage/Name.vue";
import EditNeedApprove from "~/components/tasks/manage/NeedApprove.vue";
import EditTaskFile from "~/components/tasks/manage/TaskFile.vue";
import EditDateTime from "~/components/tasks/manage/DateTime.vue";
import Alerts from "~/components/Alerts.vue";
import Navbar from "~/components/Navbar.vue";
import { ref, computed } from "vue";
import {useRoute} from "#vue-router";
import ActionBar from "~/components/basics/ActionBar.vue";

definePageMeta({
});

useHead({
  title: "Panel | Úkol - Přidání",
  meta: [
    { name: "description", content: "Panel Settings User Information" }
  ],
});

const route = useRoute();
const role = route.params.role as string;

const submitLoading = ref<boolean>(false);
const triggerReset = ref<boolean>(false);

const oldData = computed<{ name: string, check: boolean, taskFile: string, startDate: Date | null, endDate: Date | null }>(() => ({
  name: "",
  check: false,
  taskFile: "",
  startDate: null,
  endDate: null,
}));

const newData = ref<{ name: string | undefined, check: boolean | undefined, taskFile: File | undefined, startDate: Date | undefined, endDate: Date | undefined }>({
  name: undefined,
  check: undefined,
  taskFile: undefined,
  startDate: undefined,
  endDate: undefined,
});

const onNameUpdate = (name: string): void => {
  newData.value.name = name;
};

const onNeedApproveUpdate = (needApprove: boolean): void => {
  newData.value.check = needApprove;
};

const onTaskFileUpdate = (taskFile: File | undefined): void => {
  newData.value.taskFile = taskFile;
};

const onStartDateUpdate = (startDate: Date | undefined): void => {
  newData.value.startDate = startDate;
};

const onEndDateUpdate = (endDate: Date | undefined): void => {
  newData.value.endDate = endDate;
};

const resetUserData = (): void => {
  newData.value = {
    name: undefined,
    check: undefined,
    taskFile: undefined,
    startDate: undefined,
    endDate: undefined,
  };

  triggerReset.value = true;

  setTimeout((): void => {
    triggerReset.value = false;
  }, 100);
};

</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar :links="[
        { name: 'Úkoly', path: `/panel/tasks/${role}` },
        { name: 'Přidání', path: `/panel/tasks/${role}/add` },
      ]" />
    </template>

    <template #content>
      <div id="tasks">
        <div class="content">
          <ActionBar
              class="action-bar"
              description="Správa  "
              :texts="['Přidat', 'Odebrat']"
              :actions="['add', 'remove']"
              :icons="[
              'material-symbols:add-rounded',
              'material-symbols:delete-rounded',
            ]"
            :active="0"
            :navigate-to="[
              `/panel/tasks/${role}/add`,
              `/panel/tasks/${role}/remove`,
            ]"
          />

          <div class="line page-section">
            <EditName :old-name="oldData.name" :reset="triggerReset" @update="onNameUpdate">
              <div class="section-head">
                <h3>Název * <span class="update" v-show="newData.name">(aktualizováno)</span></h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquam consequatur mollitia officiis placeat!</p>
              </div>
            </EditName>
          </div>

          <div class="line page-section">
            <EditTaskFile @update="onTaskFileUpdate" :reset="triggerReset" :old-check="oldData.taskFile">
              <div class="section-head">
                <h3>Zadání * <span class="update" v-show="newData.taskFile">(aktualizováno)</span></h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquam consequatur mollitia officiis placeat!</p>
              </div>
            </EditTaskFile>
          </div>

          <div class="line page-section">
            <div class="section-head">
              <h3>Časové rozmezí úkolu *</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquam consequatur mollitia officiis placeat!</p>
            </div>

            <div class="line">
              <EditDateTime @update="onStartDateUpdate" :reset="triggerReset" :old-date="oldData.startDate" label="Začátek úkolu" />
              <EditDateTime @update="onEndDateUpdate" :reset="triggerReset" :old-date="oldData.endDate" label="Konec úkolu" />
            </div>
          </div>

          <div class="line page-section">
            <EditNeedApprove @update="onNeedApproveUpdate" :reset="triggerReset" :old-check="oldData.check">
              <div class="section-head">
                <h3>Nutné schválení * <span class="update" v-show="newData.check">(aktualizováno)</span></h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquam consequatur mollitia officiis placeat!</p>
              </div>
            </EditNeedApprove>
          </div>

          <EditFormFooter :is-loading="submitLoading" :reset-function="resetUserData" :submit-function="() => {}">
            Pole označená * jsou povinná
          </EditFormFooter>
        </div>

        <Alerts/>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
#tasks {
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
      gap: 20px;

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
  #tasks {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
