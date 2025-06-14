<script lang="ts" setup>
import {ref, onMounted, computed} from "vue";
import { useRoute, useState } from "nuxt/app";
import { storeToRefs } from "pinia";
import { useAccountStore } from "../stores/account";
import apiFetch from "../componsables/apiFetch";
import Loading from "./basics/Loading.vue";

const route = useRoute();
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
>(() =>[
  {
    name: "Hlavní",
    links: [
      {
        text: "Domů",
        href: "/panel",
        iconClass: "material-symbols:home-rounded",
        notify: false,
      },
      {
        text: "Úkoly",
        href: `/panel/tasks/${role.value}`,
        activeHrefs: [
          `/panel/tasks/${role.value}`,
          `/panel/tasks/${role.value}/add`,
          `/panel/tasks/${role.value}/remove`,
        ],
        iconClass: "material-symbols:folder-copy-rounded",
        notify: !["admin", "teacher"].includes(role.value) ? numberOfActiveTasks.value !== null ? getStyledNumber(numberOfActiveTasks.value) : "?" : false,
      },
      {
        text: "Zaměření",
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
        text: "Třídy",
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
        text: "Uživatelé",
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
    name: "Ostatní",
    links: [
      {
        text: "Nastavení",
        href: "/panel/settings",
        activeHrefs: [
          "/panel/settings",
          "/panel/settings/security",
          "/panel/settings/customization",
        ],
        iconClass: "material-symbols:settings-rounded",
        notify: false,
      }
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

  await apiFetch("/auth/logout", {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    ignoreResponseError: true,
    credentials: "include",
    async onResponse({ response }) {
      const resCode: string = response._data.resCode.toString();

      if (resCode === "7011") await navigateTo("/login");
    },
  }).finally((): void => {
    logoutLoading.value = false;
  });
};

onMounted(async (): Promise<void> => {
  if (!["admin", "teacher"].includes(role.value)) {
    await apiFetch("/user_task/count/approved_without_review", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      ignoreResponseError: true,
      onResponse({ response }) {
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
});
</script>

<template>
  <div id="sidebar" :class="{ 'active-sidebar': isHamburgerClicked }">
    <div class="header">
      <div class="sidebar-logo">
        <h2>INOSU</h2>
        <p>INformační a Organizační Systém Úloh</p>
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
                  active: checkIfLinkIsActive(
                    link.activeHrefs ? link.activeHrefs : link.href
                  ),
                  link: true
                }"
              >
                <Icon size="16px" class="icon" :name="link.iconClass"></Icon
                >{{ link.text }}</a
              >

              <a
                v-else
                :href="link.href"
                :class="{
                  active: checkIfLinkIsActive(
                    link.activeHrefs ? link.activeHrefs : link.href
                  ),
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
                <Icon
                  size="16px"
                  class="icon"
                  name="material-symbols:link-rounded"
                ></Icon>
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
            <Icon
              size="16px"
              class="icon"
              name="material-symbols:logout-rounded"
            ></Icon>
            Odhlásit se
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
  height: 100svh;
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

    .links .link {
      margin-left: -10px;
      display: flex;
      align-items: center;
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
      font-size: 16px;
      transition: 0.2s;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 10px;
      width: 100%;
      height: 100%;

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
