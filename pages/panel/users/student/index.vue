<script lang="ts" setup>
import Alerts from "~/components/Alerts.vue";
import apiFetch from "~/componsables/apiFetch";
import type {ClassData} from "~/types/classes";

definePageMeta({
  middleware: ["auth"],
});

useHead({
  title: "Panel | Uživatelé - student",
  meta: [{ name: "description", content: "Panel Settings User Information" }],
});

const allClasses = ref<ClassData[] | undefined>(undefined);

await apiFetch("/class/get", {
  method: "get",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  ignoreResponseError: true,
  onResponse({ response }) {
    const classes: ClassData[] = response._data.data.classes;

    allClasses.value = classes || [];
  },
});
</script>

<template>
  <NuxtLayout name="panel" :loading="!allClasses">
    <template #header>
      <Navbar :links="[{ name: 'Uživatelé', path: '/panel/users' }, { name: 'student', path: '/panel/users/student' }]" />
    </template>

    <template #content v-if="allClasses">
      <div id="classes">
        <div class="content">
          <div class="line">
            <div class="section-head">
              <h3>Celkem tříd: {{ allClasses.length }}</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            </div>
          </div>

          <div class="classes-section">
            <div class="section-head">
              <h4>Třídy</h4>
              <p class="error message" v-if="allClasses.length <= 0">Žádná třída nebyla nalezena!</p>
            </div>

            <div class="classes">
              <NuxtLink
                class="class"
                v-for="oneClass in allClasses"
                :key="oneClass.id"
                :to="`/panel/users/student/${oneClass.id}`"
              >
                <div class="section-head">
                  <span><span class="name" v-if="oneClass.name">{{ oneClass.name + " - " }}</span>{{ oneClass.specialization }}{{ oneClass.grade }}{{ oneClass.group }}</span>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <Alerts />
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
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

    .page-section {
      border-bottom: 1px solid rgba(var(--border-color), 0.5);
      padding-bottom: 35px;
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

      h4 {
        font-weight: 600;
        font-size: 16px;
        color: var(--title-color);
      }

      p {
        color: rgba(var(--description-color), 1);
        font-size: 16px;
      }

      .message {
        font-size: 16px;

        &.error {
          color: rgba(var(--error-color), 1);
        }

        &.success {
          color: rgba(var(--success-color), 1);
        }
      }
    }

    .classes-section {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .classes {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 30px;

        .class {
          border-radius: var(--normal-border-radius);
          display: flex;
          flex: 1;
          gap: 30px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: var(--border-width) solid rgba(var(--border-color), 0.5);
          padding: 60px 30px;
          transition: 0.2s;
          cursor: pointer;
          min-width: 200px;
          background: var(--card-1-background);

          span {
            font-weight: 600;
            font-size: 16px;
            color: var(--title-color);
            text-transform: uppercase;

            .name {
              text-transform: none;
            }
          }

          &:hover,
          &.active {
            background: var(--card-1-hover-background);
          }
        }
      }
    }

    ::v-deep(.section) {
      width: 100%;
    }
  }
}
</style>
