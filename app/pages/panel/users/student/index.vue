<script lang="ts" setup>
import type {ClassData} from "~/types/classes";
import Navbar from "~/components/layout/Navbar.vue";
import Card from "~/components/ui/Card.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import checkPermissions from "~/componsables/checkPermissions";
import ActionBar from "~/components/ui/ActionBar.vue";
import {computed, watchEffect} from "vue";
import {useLoadingStore} from "~/stores/loading";
import {useFetch} from "nuxt/app";
import Pagination from "~/components/ui/Pagination.vue";
import CardsGrid from "~/components/ui/CardsGrid.vue";

const { t } = useI18n();

useHead({
  title: t('pages.users.studentIndex.title'),
  meta: [{ name: "description", content: t('pages.users.studentIndex.description') }],
});

const amountForPaging: number = 6;
const allClasses = ref<ClassData[] | undefined>(undefined);
const currentPage = ref<number>(1);
const classesCount = ref<number>(0);
const numberOfPages = computed<number>((): number => {
  return Math.ceil(classesCount.value / amountForPaging);
});

const { data: classesData, error: classesError } = useFetch("/api/class/get", {
  query: {
    amountForPaging: amountForPaging,
    pageNumber: currentPage,
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
});

watch([classesData, classesError], (): void => {
  if (classesError.value) {
    if (classesError.value?.data?.resCode?.toString() === "E10100") {
      useLoadingStore().setHasRateLimit(true);
      return;
    }
    allClasses.value = [];
    classesCount.value = 0;
    return;
  }

  if (!classesData.value) return;

  allClasses.value = classesData.value.data.classes;
  classesCount.value = classesData.value.data.count;
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !allClasses.value && !classesError.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: t('users.index.title'), to: '/panel/users', icon: 'material-symbols:supervisor-account-rounded' },
            { label: t('users.student.breadcrumb'), to: '/panel/users/student', active: true }
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="topics" v-if="allClasses">
        <div class="content">
          <ActionBar
            class="action-bar"
            :description="t('actionBar.description')"
            :texts="[t('actionBar.add')]"
            :icons="[
              'material-symbols:add-rounded',
            ]"
              :navigate-to="[
              `/panel/users/add`,
            ]"
              v-if="checkPermissions(['admin'])"
          />

          <div class="line">
            <div class="section-head">
              <h3>{{ t('users.student.index.heading', { count: classesCount }) }}</h3>
              <p>{{ t('users.student.index.description') }}</p>
            </div>
          </div>

          <div class="classes-section">
            <div class="section-head">
              <h4>{{ t('users.student.index.classesHeading') }}</h4>
            </div>

            <div class="classes">
              <CardsGrid :items="allClasses">
                <template #content="item">
                  <NuxtLink
                      class="class"
                      :to="`/panel/users/student/${item.data.id}`"
                  >
                    <div class="section-head">
                      <span><span class="name" v-if="item.data.name">{{ item.data.name + " - " }}</span>{{ item.data.specialization }}{{ item.data.grade }}{{ item.data.group }}</span>
                    </div>
                  </NuxtLink>
                </template>

                <template #additional v-show="currentPage === numberOfPages">
                  <Card class="card">
                    <NuxtLink class="class" :to="`/panel/users/student/undefined`">
                      <div class="section-head">
                        <span>{{ t('users.student.index.unassigned') }}</span>
                      </div>
                    </NuxtLink>
                    </Card>
                </template>
              </CardsGrid>
            </div>

            <Pagination :number-of-pages="numberOfPages" v-model="currentPage" />
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
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
          display: flex;
          flex: 1;
          cursor: pointer;
          min-width: 200px;
          text-decoration: none;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 100%;
          padding: 60px 30px;
          transition: 0.2s;

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
