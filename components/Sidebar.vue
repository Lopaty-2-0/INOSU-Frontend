<script lang="ts" setup>
import { ref } from "vue";
import {useRoute, useState} from "#imports";

const route = useRoute();

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
  const activePath = route.path;

  if (Array.isArray(link)) return link.includes(activePath) || link.some((href) => activePath.includes(href));

  return activePath === link;
};

const isHamburgerClicked = useState("isHamburgerClicked");

const logOut = () => {
  console.log("Log out");
};

onMounted(() => {
  loading.value = false;
});
</script>

<template>
  <div id="sidebar" :class="{ 'active-sidebar': isHamburgerClicked }">
    <div class="header">
      <div class="sidebar-logo">
        <p>Název webových stránek</p>
        <h2>Admin Panel</h2>
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
                <Icon size="1rem" class="icon" :name="link.iconClass"></Icon>{{ link.text }}</a>

              <a v-else :href="link.href" :class="{
                active: checkIfLinkIsActive(link.activeHrefs ? link.activeHrefs : link.href),
                link: true,
                notify: true,
              }">
                <Icon size="1rem" class="icon" :name="link.iconClass"></Icon>{{ link.text }}
                <div class="number">{{ link.notify }}</div>
              </a>
            </li>
          </ul>
        </div>
        <!--
        <div class="item custom-links" v-if="!loading">
          <ul class="links">
            <li v-for="(link, linkIndex) in accountData.links" :key="linkIndex" >
              <a :href="link.href" class="link" target="_blank">
                <Icon size="1rem" class="icon" name="material-symbols:link-rounded"></Icon> {{ link.text }}
              </a>
            </li>
          </ul>
        </div>
        -->
      </div>
    </div>

    <div class="footer">
      <ul>
        <li class="log-out" @click="logOut">
          <button>
            <Icon size="1rem" class="icon" name="material-symbols:logout-rounded"></Icon>Odhlásit se
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
  background: var(--menu-background);
  width: 250px;
  border-right: 1px solid var(--border-color);
  margin-left: 0;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  z-index: 100;
  overflow-y: visible;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 3px;
  }

  .sidebar-logo {
    margin-left: 2.188rem;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 1rem 0;
    flex-direction: column;
    margin-bottom: 2rem;

    p {
      font-size: 0.875rem;
      color: var(--mini-title-color);
      opacity: 0.8;
    }

    h2 {
      font-size: 1.25rem;
      color: var(--main-color);
      font-weight: 600;
    }
  }

  .items {
    margin-left: 2.188rem;

    .links .link {
      margin-left: -0.563rem;
      display: flex;
      align-items: center;
    }

    .notify .number {
      width: 2.5rem;
      height: 1.2rem;
      padding-top: 0.2rem;
      text-align: center;
      background: var(--sidebar-notification-background);
      opacity: 0.8;
      position: relative;
      margin-left: 0.625rem;
      border-radius: 0.375rem;
      font-size: 0.65rem;
      color: var(--sidebar-notification-color);
      font-weight: 600;
    }

    .item {
      li {
        padding-right: 0.625rem;
      }

      a {
        color: var(--description-color);
        text-decoration: none;
        padding: 0.625rem;
        font-size: 0.875rem;
        transition: 0.2s;
        overflow: hidden;
        white-space: nowrap;

        &:hover,
        &.active {
          color: var(--main-color);
        }

        .icon {
          margin-right: 0.375rem;
          font-size: 1rem;
        }
      }

      .name {
        padding-bottom: 5px;
        text-transform: uppercase;
        color: var(--main-color);
        opacity: 0.8;
        font-size: 0.75rem;
        font-weight: 500;
      }

      &:not(:last-child)::after {
        content: "";
        display: block;
        position: relative;
        height: 0.1px;
        width: 85%;
        background: var(--border-color);
        margin-top: 1.563rem;
        margin-bottom: 1.563rem;
      }
    }
  }

  .log-out {
    width: 100%;
    padding: 0.938rem 0.938rem 0.938rem 2.5rem;
    background: var(--sidebar-log-out-background);
    cursor: pointer;
    transition: 0.2s;

    button {
      color: var(--description-color);
      font-size: 0.875rem;
      transition: 0.2s;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.625rem;
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
