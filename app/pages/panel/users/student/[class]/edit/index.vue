<script setup lang="ts">
import { useRoute } from "#app";
import moment from "moment";
import {computed, ref, watchEffect} from "vue";
import ActionBar from "~/components/ui/ActionBar.vue";
import Navbar from "~/components/layout/Navbar.vue";
import UsersCardsGrid from "~/components/ui/CardsGrid.vue";
import Pagination from "~/components/ui/Pagination.vue";
import type { AccountData } from "~/types/account";
import SearchInput from "~/components/ui/SearchInput.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import {useLoadingStore} from "~/stores/loading";
import {navigateTo, useFetch} from "nuxt/app";
import Image from "~/components/ui/Image.vue";

definePageMeta({
  roles: ["admin"],
});

const route = useRoute();
const classId = route.params.class as string;

useHead({
  title: "Panel | Upravení uživatelů - Třída: " + classId,
  meta: [{ name: "description", content: "Panel Settings User Information" }],
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
const requests = computed<{ url: string, query: Record<string, any> }>(() => {
  if (classId !== "undefined") {
    return {
      url: "/api/user_class/get/users",
      query: {
        idClass: classId,
      }
    }
  } else {
    return {
      url: "/api/user/get/noClass",
      query: {}
    };
  }
});

const onSearchInputChange = (input: string): void => {
  currentPage.value = 1;

  searchInput.value = input;
};

const onItemGridClick = async (item: AccountData): Promise<void> => {
  await navigateTo(`/panel/users/student/edit/${item.id}`);
};

const { data: usersData, error: usersError, pending: usersPending } = useFetch(requests.value.url, {
  query: {
    amountForPaging: amountForPaging,
    pageNumber: currentPage,
    searchQuery: searchInput,
    ...requests.value.query
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
            { label: 'Uživatelé', to: '/panel/users', icon: 'material-symbols:supervisor-account-rounded' },
            { label: 'student', to: '/panel/users/student' },
            { label: 'Třída: ' + classId, to: '/panel/users/student/' + classId },
            { label: 'Upravení', to: '/panel/users/student/' + classId + '/edit', active: true }
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="users" v-if="users">
        <div class="content">
          <ActionBar
            class="action-bar"
            description="Správa uživatelů"
            :active="1"
            :texts="['Přidat', 'Upravit', 'Odebrat']"
            :icons="[
              'material-symbols:add-rounded',
              'material-symbols:edit-rounded',
              'material-symbols:delete-rounded',
            ]"
            :navigate-to="[
              `/panel/users/add`,
              `/panel/users/student/${classId}/edit`,
              `/panel/users/student/${classId}/remove`,
            ]"
          />

          <div class="line">
            <div class="section-head">
              <h3>Upravení uživatelů</h3>
              <p>Zde si můžete vybrat uživatele, kterého chcete upravit.</p>
            </div>

            <SearchInput @change="onSearchInputChange" placeholder="Hledat uživatele" />
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
                      Přezdívka: <span>{{ item.data.abbreviation || "Není" }}</span>
                    </p>
                    <p>
                      Vytvořen:
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

    .buttons {
      display: flex;
      gap: 10px;

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 5px;
        padding: 10px 15px;
        border-radius: var(--small-border-radius);
        border: var(--border-width) solid transparent;
        transition: 0.2s;
        font-size: 16px;

        &.remove {
          color: var(--actionBar-actions-remove-color);
          background: rgba(var(--actionBar-actions-remove-background), 1);
          border-color: rgba(var(--actionBar-actions-remove-border), 1);

          &:hover {
            background: rgba(var(--actionBar-actions-remove-background), 0.8);
          }
        }

        &.reset {
          background: var(--btn-2-background);
          color: var(--btn-2-color);
          border-color: rgba(var(--border-color), 0.5);

          &:hover {
            background: var(--btn-2-hover-background);
          }
        }

        .icon {
          font-size: 16px;
        }
      }
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
