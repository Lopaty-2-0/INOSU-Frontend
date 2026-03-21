<script lang="ts" setup>
import {ref, onMounted, computed} from "vue";
import {navigateTo, useFetch, useRoute, useState} from "nuxt/app";
import { storeToRefs } from "pinia";
import { useAccountStore } from "~/stores/account";
import Loading from "~/components/ui/Loading.vue";
import {useAlertsStore} from "~/stores/alerts";
import { useI18n } from "#imports";

const { t } = useI18n();

const route = useRoute();
const alertStore = useAlertsStore();
const { getLinks: accountLinks, getRole: role } = storeToRefs(useAccountStore());

const getStyledNumber = (number: number): string => {
  if (number >= 1000) return "1K+";

  return number.toString();
};

const loading = ref<boolean>(true);
const logoutLoading = ref<boolean>(false);
const numberOfActiveTasks = ref<number | null>(null);
const sidebarLinks = computed<
    {
      name: string;
      links: {
        text: string;
        href: string;
        iconClass: string;
        activeHrefs?: string[];
        notify?: boolean | string;
      }[];
    }[]
>(() => [
  {
    name: t('sidebar.sections.main'),
    links: [
      {
        text: t('sidebar.links.home'),
        href: "/panel",
        iconClass: "material-symbols:home-rounded",
        notify: false,
      },
      {
        text: t('sidebar.links.tasks'),
        href: `/panel/tasks/${role.value}`,
        activeHrefs: [
          `/panel/tasks/${role.value}`,
          `/panel/tasks/${role.value}/add`,
          `/panel/tasks/${role.value}/remove`,
        ],
        iconClass: "material-symbols:folder-copy-rounded",
        notify: !["admin", "teacher"].includes(role.value)
            ? numberOfActiveTasks.value !== null
                ? getStyledNumber(numberOfActiveTasks.value)
                : "?"
            : false,
      },
      {
        text: t('sidebar.links.calendar'),
        href: "/panel/calendar",
        iconClass: "material-symbols:calendar-month-rounded",
        notify: false,
      },
      {
        text: t('sidebar.links.chat'),
        href: "/panel/chat",
        iconClass: "material-symbols:mark-chat-unread-rounded",
        notify: false,
      },
      {
        text: t('sidebar.links.specializations'),
        href: "/panel/specializations",
        activeHrefs: [
          "/panel/specializations",
          "/panel/specializations/add",
          "/panel/specializations/remove",
        ],
        iconClass: "material-symbols:school",
        notify: false,
      },
      {
        text: t('sidebar.links.classes'),
        href: "/panel/classes",
        activeHrefs: [
          "/panel/classes",
          "/panel/classes/add",
          "/panel/classes/remove",
        ],
        iconClass: "material-symbols:flight-class-rounded",
        notify: false,
      },
      {
        text: t('sidebar.links.users'),
        href: "/panel/users",
        activeHrefs: [
          "/panel/users",
          "/panel/users/add",
          "/panel/users/remove",
          "/panel/users/edit",
        ],
        iconClass: "material-symbols:supervisor-account-rounded",
        notify: false,
      },
    ],
  },
  {
    name: t('sidebar.sections.maturita'),
    ...(role.value === "admin" || role.value === "teacher")
    ?
      {
        links: [
          {
            text: t('sidebar.links.maturitas'),
            href: `/panel/maturita/${role.value}/grade`,
            iconClass: "material-symbols:book-2-rounded",
            notify: false,
            activeHrefs: [
              `/panel/maturita/${role.value}/grade`,
              `/panel/maturita/${role.value}/grade/add`,
              `/panel/maturita/${role.value}/grade/remove`,
            ],
          },
          {
            text: t('sidebar.links.assignments'),
            href: `/panel/maturita/${role.value}/tasks`,
            iconClass: "material-symbols:folder-copy-rounded",
            notify: false,
            activeHrefs: [
              `/panel/maturita/${role.value}/tasks`,
              `/panel/maturita/${role.value}/tasks/add`,
              `/panel/maturita/${role.value}/tasks/remove`,
            ],
          },
          {
            text: t('sidebar.links.objector'),
            href: `/panel/maturita/${role.value}/objector`,
            iconClass: "material-symbols:search-rounded",
            activeHrefs: [
              `/panel/maturita/${role.value}/objector`,
            ],
            notify: false,
          },
          {
            text: t('sidebar.links.proposals'),
            href: `/panel/maturita/${role.value}/proposals`,
            iconClass: "material-symbols:lightbulb-rounded",
            notify: false,
          },
          {
            text: t('sidebar.links.topics'),
            href: `/panel/maturita/${role.value}/topics`,
            activeHrefs: [
              `/panel/maturita/${role.value}/topics`,
              `/panel/maturita/${role.value}/topics/add`,
              `/panel/maturita/${role.value}/topics/remove`,
            ],
            iconClass: "material-symbols:topic",
            notify: false,
          },
          {
            text: t('sidebar.links.tables'),
            href: `/panel/maturita/${role.value}/tables`,
            activeHrefs: [
              `/panel/maturita/${role.value}/tables`,
              `/panel/maturita/${role.value}/tables/evaluators`,
            ],
            iconClass: "material-symbols:table-rows-rounded",
            notify: false,
          },
        ],
      }
    :
      {
        links: [
          {
            text: t('sidebar.links.assignments'),
            href: `/panel/maturita/${role.value}`,
            iconClass: "material-symbols:folder-copy-rounded",
            notify: false,
          },
          {
            text: t('sidebar.links.proposals'),
            href: `/panel/maturita/${role.value}/proposals`,
            activeHrefs: [
              `/panel/maturita/${role.value}/proposals`,
              `/panel/maturita/${role.value}/proposals/add`,
              `/panel/maturita/${role.value}/proposals/remove`,
            ],
            iconClass: "material-symbols:lightbulb-rounded",
            notify: false,
          },
          {
            text: t('sidebar.links.topics'),
            href: `/panel/maturita/${role.value}/topics`,
            iconClass: "material-symbols:topic",
            notify: false,
          },
          {
            text: t('sidebar.links.chat'),
            href: `/panel/maturita/${role.value}/chat`,
            iconClass: "material-symbols:chat-rounded",
            notify: false,
          },
          {
            text: t('sidebar.links.tables'),
            href: `/panel/maturita/${role.value}/tables`,
            activeHrefs: [
              `/panel/maturita/${role.value}/tables`,
              `/panel/maturita/${role.value}/tables/evaluators`,
            ],
            iconClass: "material-symbols:table-rows-rounded",
            notify: false,
          },
        ],
      }
  },
  ...(role.value === "admin" || role.value === "teacher")
      ? [
        {
          name: t('sidebar.sections.data'),
          links: [
            {
              text: t('sidebar.links.import'),
              href: role.value === "admin" ? "/panel/import" : `/panel/import/maturitas`,
              iconClass: "material-symbols:upload-2-rounded",
              activeHrefs: [
                "/panel/import",
                "/panel/import/specializations",
                "/panel/import/classes",
                "/panel/import/maturitas",
                "/panel/import/maturitaTopics",
              ],
              notify: false,
            },
            {
              text: t('sidebar.links.export'),
              href: "/panel/export",
              iconClass: "material-symbols:download-2-rounded",
              notify: false,
            },
          ],
        },
      ]
      : [],
  {
    name: t('sidebar.sections.other'),
    links: [
      {
        text: t('sidebar.links.settings'),
        href: "/panel/settings",
        activeHrefs: [
          "/panel/settings",
          "/panel/settings/security",
          "/panel/settings/customization",
        ],
        iconClass: "material-symbols:settings-rounded",
        notify: false,
      },
    ],
  },
]);

const checkIfLinkIsActive = (link: string | string[]): boolean => {
  const activePath: string = route.path;

  if (Array.isArray(link))
    return (
      link.includes(activePath) ||
      link.some((href) => activePath.includes(href))
    );

  return activePath === link;
};

const isHamburgerClicked = useState<string>("isHamburgerClicked");

const logOut = async (): Promise<void> => {
  logoutLoading.value = true;

  await $fetch("/api/auth/logout", {
    method: "delete",
    credentials: "include",
    async onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      if (resCode === "7011") {
        sessionStorage.removeItem("accountData");
        await navigateTo("/login");
      }
    },
    onResponseError() {
      alertStore.addAlert({ type: "error", title: t('sidebar.alerts.logout.title'), message: t('sidebar.alerts.logout.unknown') });
    },
    onRequestError() {
      alertStore.addAlert({ type: "error", title: t('sidebar.alerts.logout.title'), message: t('sidebar.alerts.logout.unknown') });
    }
  }).finally((): void => {
    logoutLoading.value = false;
  });
};

if (!["admin", "teacher"].includes(role.value)) {
  useFetch("/api/user_team/count/tasks", {
    method: "get",
    server: false,
    credentials: "include",
    ignoreResponseError: true,
    onResponse({ response }: any) {
      const count: number = response._data.data.count;

      numberOfActiveTasks.value = count ?? null;
    },
  }).finally((): void => {
    loading.value = false;
  });
} else {
  loading.value = false;
  numberOfActiveTasks.value = null;
}
</script>

<template>
  <div id="sidebar" :class="{ 'active-sidebar': isHamburgerClicked }">
    <div class="header">
      <div class="sidebar-logo">
        <h2>{{ t('sidebar.logo.title') }}</h2>
        <p>{{ t('sidebar.logo.subtitle') }}</p>
      </div>

      <div class="items">
        <div
          class="section"
          v-for="(item, itemIndex) in sidebarLinks"
          :key="itemIndex"
        >
          <p class="name">{{ item.name }}</p>
          <ul class="links">
            <li v-for="(link, linkIndex) in item.links" :key="linkIndex">
              <a
                v-if="!link.notify"
                :href="link.href"
                :class="{
                  active: checkIfLinkIsActive(link.activeHrefs ? link.activeHrefs : link.href),
                  link: true
                }"
              >
                <Icon size="16px" class="icon" :name="link.iconClass"></Icon>{{ link.text }}
              </a>

              <a
                v-else
                :href="link.href"
                :class="{
                  active: checkIfLinkIsActive(link.activeHrefs ? link.activeHrefs : link.href),
                  link: true,
                  notify: true
                }"
              >
                <Icon class="icon" :name="link.iconClass"></Icon>{{ link.text }}
                <div class="number">{{ link.notify }}</div>
              </a>
            </li>
          </ul>
        </div>
        <div class="section custom-links" v-if="!loading">
          <ul class="links">
            <li v-for="(link, linkIndex) in accountLinks" :key="linkIndex">
              <a :href="link.href" class="link" target="_blank">
                <Icon size="16px" class="icon" name="material-symbols:link-rounded"></Icon>
                {{ link.text }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer">
      <ul>
        <li class="log-out" @click="logOut">
          <button v-if="!logoutLoading">
            <Icon size="16px" class="icon" name="material-symbols:logout-rounded"></Icon>
            {{ t('sidebar.logout') }}
          </button>

          <button class="loading" v-else>
            <Loading color="rgba(var(--description-color), 1)" size="6px" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#sidebar {
  height: 100dvh;
  position: fixed;
  background: var(--sidebar-background);
  width: 250px;
  border-right: var(--border-width) solid rgba(var(--border-color), 0.5);
  margin-left: 0;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 30px;
  z-index: 100;
  overflow-y: visible;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 3px;
  }

  .sidebar-logo {
    margin-left: 30px;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 20px 0;
    flex-direction: column;
    margin-bottom: 30px;
    gap: 5px;

    h2 {
      font-weight: 900;
      font-size: 32px;
      color: rgba(var(--main-color), 1);
    }

    p {
      color: rgba(var(--description-color), 1);
      font-size: 16px;
    }
  }

  .items {
    margin-left: 30px;

    .links {
      list-style-type: none;

      .link {
        margin-left: -10px;
        display: flex;
        align-items: center;
      }
    }

    .notify .number {
      width: 40px;
      height: 20px;
      padding-top: 3px;
      text-align: center;
      background: var(--sidebar-notification-background);
      opacity: 0.8;
      position: relative;
      margin-left: 10px;
      border-radius: 5px;
      font-size: 12px;
      color: var(--sidebar-notification-color);
      font-weight: 700;
    }

    .section {
      li {
        padding-right: 10px;
      }

      a {
        color: rgba(var(--description-color), 1);
        text-decoration: none;
        padding: 10px 0 10px 10px;
        font-size: 16px;
        transition: 0.2s;
        overflow: hidden;
        white-space: nowrap;

        &:hover,
        &.active {
          color: rgba(var(--main-color), 1);
        }

        .icon {
          margin-right: 10px;
          font-size: 16px;
          min-width: fit-content;
        }
      }

      .name {
        padding-bottom: 5px;
        text-transform: uppercase;
        color: rgba(var(--main-color), 1);
        font-size: 12px;
      }

      &:not(:last-child)::after {
        content: "";
        display: block;
        position: relative;
        height: 0.1px;
        width: 85%;
        background: rgba(var(--border-color), 0.5);
        margin-top: 20px;
        margin-bottom: 20px;
      }
    }
  }

  .log-out {
    width: 100%;
    height: 50px;
    background: var(--sidebar-log-out-background);
    cursor: pointer;
    transition: 0.2s;

    button {
      color: rgba(var(--description-color), 1);
      background: none;
      border: none;
      font-size: 16px;
      transition: 0.2s;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 10px;
      width: 100%;
      height: 100%;
      cursor: pointer;

      &:not(.loading) {
        justify-content: flex-start;
        margin-left: 30px;
      }
    }

    &:hover {
      background: var(--sidebar-log-out-hover-background);
    }
  }

  &.active-sidebar {
    margin-left: 0;
    transition: 0.2s;
  }
}

@media (max-width: 750px) {
  #sidebar {
    margin-left: -250px;
    transition: 0.2s;

    &.active-sidebar {
      margin-left: 0;
      transition: 0.2s;
    }
  }
}
</style>
