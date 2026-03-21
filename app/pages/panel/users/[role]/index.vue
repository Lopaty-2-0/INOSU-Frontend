<script setup lang="ts">
import {useRoute} from "#app";
import Navbar from "../../../../components/layout/Navbar.vue";
import type {AccountData} from "~/types/account";
import {computed, ref, watchEffect} from "vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import UsersCardsGrid from "../../../../components/ui/CardsGrid.vue";
import Pagination from "../../../../components/ui/Pagination.vue";
import checkPermissions from "~/componsables/checkPermissions";
import SearchInput from "~/components/ui/SearchInput.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import {useLoadingStore} from "~/stores/loading";
import {navigateTo, useFetch} from "nuxt/app";
import moment from "moment/moment";
import Image from "~/components/ui/Image.vue";

const route = useRoute();
const role = route.params.role as string;

const { t } = useI18n();

useHead({
  title: t('pages.users.roleIndex.title', { role }),
  meta: [{ name: "description", content: t('pages.users.roleIndex.description') }],
});

const config = useRuntimeConfig();
const amountForPaging: number = 12;
const currentPage = ref<number>(1);
const users = ref<AccountData[] | undefined>(undefined);
const searchInput = ref<string>("");
const usersCount = ref<number>(0);
const numberOfPages = computed<number>((): number => {
  return Math.ceil(usersCount.value / amountForPaging);
});

const onSearchInputChange = (input: string): void => {
  currentPage.value = 1;

  searchInput.value = input;
};

const onItemGridClick = (item: AccountData): void => {
  navigateTo(`mailto:${item.email}`, { external: true });
};

const { data: usersData, error: usersError, pending: usersPending } = useFetch("/api/user/get/role", {
  query: {
    role: role,
    amountForPaging: amountForPaging,
    pageNumber: currentPage,
    searchQuery: searchInput,
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true
});

watch([usersData, usersError], (): void => {
  if (usersError.value) {
    users.value = undefined;
    return;
  }

  if (!usersData.value) return;

  users.value = usersData.value.data.users;
  usersCount.value = usersData.value.data.count;
}, { immediate: true });

watchEffect((): void => {
  useLoadingStore().setLoading("dataLoading", !users.value && !usersError.value);
});
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: t('users.index.title'), to: '/panel/users', icon: 'material-symbols:supervisor-account-rounded' },
            { label: role, to: '/panel/users/' + role, active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="users" v-if="users">
        <div class="content">
          <ActionBar
            class="action-bar"
            :description="t('actionBar.description')"
            :texts="[t('actionBar.add'), t('actionBar.edit'), t('actionBar.remove')]"
            :icons="[
              'material-symbols:add-rounded',
              'material-symbols:edit-rounded',
              'material-symbols:delete-rounded',
            ]"
            :navigate-to="[
              `/panel/users/add`,
              `/panel/users/${role}/edit`,
              `/panel/users/${role}/remove`,
            ]"
            v-if="checkPermissions(['admin'])"
          />

          <div class="line">
            <div class="section-head">
              <h3>{{ t('users.role.index.heading', { count: usersCount }) }}</h3>
              <p>{{ t('users.role.index.description') }}</p>
            </div>

            <SearchInput @change="onSearchInputChange" :placeholder="t('users.role.index.searchPlaceholder')" />
          </div>

          <div class="users">
            <UsersCardsGrid
              :items="users"
              action="select"
              :loading="usersPending"
              @on-item-click="onItemGridClick"
            >
              <template #content="item">
                <div class="user">
                  <div class="head">
                    <Image :src="config.public.originUrl + '/api/file/pfp/' + item.data.profilePicture" alt="User profile photo"/>
                    <h3>{{ item.data.name }} {{ item.data.surname }}</h3>
                  </div>

                  <div class="info">
                    <p>
                      E-mail: <span>{{ item.data.email }}</span>
                    </p>
                    <p>
                      {{ t('users.role.index.abbreviationLabel') }} <span>{{ item.data.abbreviation || t('users.role.index.noAbbreviation') }}</span>
                    </p>
                    <p>
                      {{ t('users.student.class.index.createdLabel') }}
                      <span>{{ moment(item.data.createdAt).format("DD. MM. YYYY") }}</span>
                    </p>
                  </div>
                </div>
              </template>
            </UsersCardsGrid>
            <Pagination
              class="users-navigation"
              :number-of-pages="numberOfPages"
              v-model="currentPage"
            />
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
.action-bar {
  height: 80px;
}

#users {
  display: flex;
  flex-direction: row;
  gap: 30px;
  position: relative;
  min-height: calc(100vh - 140px);
  height: 100%;

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 35px;
    position: relative;

    .line {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 30px;
      width: 100%;
    }

    .users {
      display: flex;
      flex-direction: column;
      gap: 30px;
      justify-content: space-between;
      height: 100%;

      .user {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 30px;

        .head {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;

          ::v-deep(img) {
            width: 45px;
            height: 45px;
            border-radius: var(--small-border-radius);
            object-fit: cover;
          }

          h3 {
            color: var(--title-color);
            font-size: 16px;
            font-weight: 600;
            flex: 1;
            min-width: 100px;
            word-break: break-all;
          }
        }

        .info {
          display: flex;
          flex-direction: column;
          gap: 10px;

          p {
            color: var(--mini-title-color);
            font-size: 16px;
            font-weight: 500;
            word-break: break-all;

            span {
              font-weight: 400;
              color: rgba(var(--description-color), 1);
            }
          }
        }
      }
    }

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
    }
  }
}

@media (max-width: 545px) {
  .action-bar {
    height: auto;
  }
}
</style>
