<script setup lang="ts">
import Loading from "~/components/basics/Loading.vue";
import {ref, onMounted} from "vue";
import {useState} from "nuxt/app";
import {storeToRefs} from "pinia";
import {useAccountStore} from "../stores/account";

const props = defineProps({
  links: {
    type: Array<{
      name: string,
      path: string,
    }>,
    required: true,
  },
  updated: {
    type: Boolean,
    default: false,
  },
});

const { getAccountData: accountData } = storeToRefs(useAccountStore());

// global state for hamburger click event
const isHamburgerClicked = useState<boolean>("isHamburgerClicked", () => false);
const loading = ref<boolean>(true);

const clickHamburger = (): void => {
  isHamburgerClicked.value = !isHamburgerClicked.value;
};


const profileData= computed<{ name: string; surname: string; profilePhoto: string; }>(() => ({
  name: accountData.value.name,
  surname: accountData.value.surname,
  profilePhoto: "http://89.203.248.163/uploads/profilePictures/" + accountData.value.profilePicture,
}));

onMounted((): void => {
  loading.value = false;
});
</script>

<template>
  <nav id="navbar" :class="{ 'active-hamburger': isHamburgerClicked }">
    <div class="right">
      <div class="hamburger" @click="clickHamburger">
        <Icon class="icon" size="30px" name="material-symbols:menu-rounded"></Icon>
      </div>

      <div class="full-path">
        <div class="path-item" v-for="(link, index) in props.links" :key="index">
          <NuxtLink :to="link.path">
            <p v-if="index === 0">
              <Icon class="icon" size="20px" name="material-symbols:square-rounded"></Icon> <span>{{ link.name }}</span>
            </p>
            <p v-else>
              {{ link.name }}
            </p>
          </NuxtLink>
          <p v-if="index !== props.links?.length - 1">/</p>
        </div>
      </div>
    </div>

    <div class="left">
      <div class="account">
        <Loading v-if="loading" color="rgba(var(--description-color), 1)" size="8px" />
        <img v-else :src="profileData.profilePhoto" alt="profile-photo" draggable="false" loading="lazy" />

        <div class="name">
          <p class="welcome">Přihlášen jako</p>
          <p class="account-name" v-if="loading">
            Načítání
          </p>
          <p class="account-name" v-else>
            {{ profileData.name + " " + profileData.surname }}
          </p>
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
#navbar {
  display: flex;
  flex-direction: row;
  width: calc(100% - 250px);
  background: var(--menu-background);
  position: fixed;
  top: 0;
  left: 250px;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  transition: 0.2s;
  padding: 10px 30px;
  border-bottom: var(--border-width) solid rgba(var(--border-color), 0.5);
  z-index: 50;
  gap: 15px;

  .right,
  .left {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
  }

  .full-path {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    color: rgba(var(--description-color), 1);

    .path-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 5px;

      a p {
        display: flex;
        align-items: center;
        gap: 5px;
        transition: 0.2s;

        span {
          color: rgba(var(--main-color), 1);
          text-transform: uppercase;
        }

        .icon {
          color: var(--navbar-square-icon-color);
        }

        &:hover {
          color: var(--mini-title-color);
        }
      }
    }
  }

  .account {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;

    .name {
      transition: 0.2s;
      display: flex;
      flex-direction: column;
      gap: 5px;

      .welcome {
        color: rgba(var(--main-color), 1);
        opacity: 0.8;
        text-transform: uppercase;
        font-size: 12px;
      }

      .account-name {
        color: var(--mini-title-color);
        font-size: 16px;
      }
    }

    img {
      width: 45px;
      height: 45px;
      border-radius: var(--small-border-radius);
      object-fit: cover;
    }
  }

  .hamburger {
    display: none;
    color: rgba(var(--description-color), 1);
    font-size: 24px;
    transition: 0.2s;
    margin: auto 0;
    z-index: 100;
    cursor: pointer;

    &:hover, &:focus {
      color: var(--mini-title-color);
    }
  }
}

@media (max-width: 1177px) {
  #navbar .items {
    display: none;
  }
}

@media (max-width: 750px) {
  #navbar {
    left: 0;
    width: 100%;

    .hamburger {
      display: flex;
    }

    .account {
      position: absolute;
      right: 30px;
    }

    &.active-hamburger {
      padding: 10px;

      .hamburger {
        margin-left: 250px;
      }

      .full-path {
        display: none;
      }
    }
  }
}

@media (max-width: 569px) {
  #navbar.active-hamburger .account {
    display: none;
  }
}

@media (max-width: 497px) {
  #navbar .full-path {
    display: none;
  }
}
</style>
