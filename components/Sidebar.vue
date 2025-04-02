<script lang="ts" setup>
import { ref, onMounted } from "vue";
import {useRoute, useState} from "nuxt/app";
import {storeToRefs} from "pinia";
import {useAccountStore} from "../stores/account";
import apiFetch from "../componsables/apiFetch";

const route = useRoute();
const { getLinks: accountLinks } = storeToRefs(useAccountStore());

const getStyledNumber = (number: number): string => {
  if (number >= 1000) return "1K+";

  return number.toString();
};

const loading = ref<boolean>(true);
const numberOfUnreadRequests = ref<number>(1000);
const sidebarLinks = ref<{
  name: string;
  links: {
    text: string;
    href: string;
    iconClass: string;
    activeHrefs?: string[];
    notify?: boolean | string;
  }[];
}[]>([
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
        text: "Kalendář",
        href: "/panel/calendar",
        iconClass: "material-symbols:calendar-month",
        notify: false,
      },
    ],
  },
  {
    name: "Admin",
    links: [
      {
        text: "Oznámení",
        href: "/panel/notifications",
        iconClass: "material-symbols:notifications-rounded",
        notify: getStyledNumber(numberOfUnreadRequests.value),
      },
      {
        text: "Uživatelé",
        href: "/panel/users",
        activeHrefs: ["/panel/users", "/panel/users/add", "/panel/users/remove", "/panel/users/edit"],
        iconClass: "material-symbols:user-attributes-rounded",
        notify: false,
      },
      {
        text: "Editor stránek",
        href: "/panel/pageContentEditor",
        iconClass: "material-symbols:edit-square-rounded",
        notify: false,
      },
    ],
  },
  {
    name: "Ostatní",
    links: [
      {
        text: "Nastavení",
        href: /*usePermissions(["page.settings"]) ? */"/panel/settings" /*: "/panel/settings/customization"*/,
        activeHrefs: ["/panel/settings", "/panel/settings/security", "/panel/settings/customization"],
        iconClass: "material-symbols:settings-rounded",
        notify: false,
      },
      {
        text: "Podpora",
        href: "/panel/support",
        iconClass: "material-symbols:help",
        notify: false,
      },
    ],
  },
]);

const checkIfLinkIsActive = (link: string | string[]): boolean => {
  const activePath: string = route.path;

  if (Array.isArray(link)) return link.includes(activePath) || link.some((href) => activePath.includes(href));

  return activePath === link;
};

const isHamburgerClicked = useState<string>("isHamburgerClicked");

const logOut = async (): Promise<void> => {
  await apiFetch("/auth/logout", {
    method: "delete",
    headers: {
      "Content-Type": "application/json"
    },
    ignoreResponseError: true,
    credentials: "include",
    async onResponse({ response }) {
      console.log(response)
      const resCode: string = response._data.resCode.toString();

      if (resCode === "7011") await navigateTo("/login");
    },
  }).catch(() => {
    console.log("error");
  })
};

onMounted((): void => {
  loading.value = false;
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
        <div class="item" v-for="(item, itemIndex) in sidebarLinks" :key="itemIndex">
          <p class="name">{{ item.name }}</p>
          <ul class="links">
            <li v-for="(link, linkIndex) in item.links" :key="linkIndex" >
              <a v-if="!link.notify" :href="link.href" :class="{
                active: checkIfLinkIsActive(link.activeHrefs ? link.activeHrefs : link.href),
                link: true,
              }">
                <Icon size="16px" class="icon" :name="link.iconClass"></Icon>{{ link.text }}</a>

              <a v-else :href="link.href" :class="{
                active: checkIfLinkIsActive(link.activeHrefs ? link.activeHrefs : link.href),
                link: true,
                notify: true,
              }">
                <Icon size="16px" class="icon" :name="link.iconClass"></Icon>{{ link.text }}
                <div class="number">{{ link.notify }}</div>
              </a>
            </li>
          </ul>
        </div>
        <div class="item custom-links" v-if="!loading">
          <ul class="links">
            <li v-for="(link, linkIndex) in accountLinks" :key="linkIndex" >
              <a :href="link.href" class="link" target="_blank">
                <Icon size="16px" class="icon" name="material-symbols:link-rounded"></Icon> {{ link.text }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer">
      <ul>
        <li class="log-out" @click="logOut">
          <button>
            <Icon size="16px" class="icon" name="material-symbols:logout-rounded"></Icon>Odhlásit se
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

    .item {
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
    padding: 20px 10px 20px 30px;
    background: var(--sidebar-log-out-background);
    cursor: pointer;
    transition: 0.2s;

    button {
      color: rgba(var(--description-color), 1);
      font-size: 16px;
      transition: 0.2s;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
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
