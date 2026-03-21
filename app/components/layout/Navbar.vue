<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useState } from "nuxt/app";
import { storeToRefs } from "pinia";
import { useAccountStore } from "~/stores/account";
import Image from "~/components/ui/Image.vue";
import { useI18n } from "#imports";

const { t } = useI18n();

const slots = useSlots();
const config = useRuntimeConfig();
const { getAccountData: accountData } = storeToRefs(useAccountStore());

// global state for hamburger click event
const isHamburgerClicked = useState<boolean>("isHamburgerClicked", () => false);
const loading = ref<boolean>(true);

const clickHamburger = (): void => {
  isHamburgerClicked.value = !isHamburgerClicked.value;
};

const profileData = computed<{ name: string; surname: string; profilePhoto: string; }>(() => ({
  name: accountData.value.name,
  surname: accountData.value.surname,
  profilePhoto: config.public.originUrl + "/api/file/pfp/" + accountData.value.profilePicture,
}));

onMounted((): void => {
  loading.value = false;
});
</script>

<template>
  <nav id="navbar" :class="{ 'active-hamburger': isHamburgerClicked }">
    <div class="left">
      <div class="hamburger" @click="clickHamburger">
        <Icon
          class="icon"
          size="30px"
          name="material-symbols:menu-rounded"
        ></Icon>
      </div>

      <div class="slot">
        <slot name="left" v-if="slots.left" />
      </div>
    </div>

    <div class="right">
      <div class="account">

        <Image
          :src="profileData.profilePhoto"
          alt="profile-photo"
          draggable="false"
        />

        <div class="name">
          <p class="welcome">{{ t('navbar.loggedInAs') }}</p>
          <p class="account-name" v-if="loading">{{ t('navbar.loading') }}</p>
          <p class="account-name" v-else>
            {{ profileData.name + " " + profileData.surname }}
          </p>
        </div>
      </div>

      <div class="slot">
        <slot name="right" v-if="slots.right" />
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

  .account {
    display: flex;
    flex-wrap: nowrap;
    gap: 10px;
    align-items: center;
    position: absolute;
    right: 30px;
    padding: 5px;
    background: var(--menu-background);

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

    ::v-deep(img) {
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

    &:hover,
    &:focus {
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

      .slot {
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

@media (max-width: 600px) {
  #navbar .slot {
    display: none;
  }
}
</style>
