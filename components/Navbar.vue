<script setup lang="ts">
import Loading from "~/components/basics/Loading.vue";
import {ref, onMounted} from "vue";
import {useState} from "#imports";

const props = defineProps({
  links: {
    type: Array<{
      name: string,
      path: string,
    }>,
    required: true,
  },
});

// global state for hamburger click event
const isHamburgerClicked = useState("isHamburgerClicked", () => false);
const loading = ref<boolean>(true);

const clickHamburger = () => {
  isHamburgerClicked.value = !isHamburgerClicked.value;
};

const profileData = ref<{ firstName: string, secondName: string, profilePhoto: string }>({
  firstName: "Roman",
  secondName: "Svoboda",
  profilePhoto: "http://89.203.248.163/uploads/profilePictures/default.jpg"
});

onMounted(() => {
  loading.value = false;
});
</script>

<template>
  <nav id="navbar" :class="{ 'active-hamburger': isHamburgerClicked }">
    <div class="right">
      <div class="hamburger" @click="clickHamburger">
        <Icon class="icon" size="2rem" name="material-symbols:menu-rounded"></Icon>
      </div>

      <div class="full-path">
        <div class="path-item" v-for="(link, index) in props.links" :key="index">
          <NuxtLink :to="link.path">
            <p v-if="index === 0">
              <Icon class="icon" size="1.5rem" name="material-symbols:square-rounded"></Icon> <span>{{ link.name }}</span>
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
        <Loading v-if="loading" color="#9ca3af" size="6px" />
        <img v-else crossorigin="anonymous" :src="profileData.profilePhoto" alt="profile-photo" draggable="false" loading="lazy" />

        <div class="name">
          <p class="welcome">Přihlášen jako</p>
          <p class="account-name" v-if="loading">
            Načítání
          </p>
          <p class="account-name" v-else>
            {{ profileData.firstName + " " + profileData.secondName }}
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
  height: 5rem;
  transition: 0.2s;
  padding: 0.938rem 1.875rem;
  border-bottom: 1px solid var(--border-color);
  z-index: 50;
  gap: 15px;

  .right,
  .left {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.938rem;
  }

  .full-path {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    color: var(--mini-title-color);

    .path-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;

      a p {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        span {
          color: var(--main-color);
          text-transform: uppercase;
        }

        .icon {
          color: var(--navbar-square-icon-color);
        }
      }
    }
  }

  .account {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;

    .name {
      margin: auto 0;
      transition: 0.2s;

      .welcome {
        color: var(--main-color);
        opacity: 0.8;
        text-transform: uppercase;
        font-size: 0.75rem;
      }

      .account-name {
        color: var(--mini-title-color);
        font-size: 0.875rem;
        padding-top: 2px;
        font-weight: 600;

        .icon {
          font-size: 0.625rem;
          padding-right: 3px;
          margin: auto;
          transition: 0.2s;
        }
      }
    }

    img {
      width: 2.813rem;
      height: 2.813rem;
      border-radius: 0.5rem;
      object-fit: cover;
    }
  }

  .hamburger {
    display: none;
    color: var(--description-color);
    font-size: 1.438rem;
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
      right: 1.875rem;
    }

    &.active-hamburger {
      padding: 0.938rem;
      height: 5rem;

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
  #navbar {
    .account {
      position: absolute;
      right: 1.875rem;
    }

    .full-path {
      font-size: 0.813rem;
    }

    &.active-hamburger .account {
      display: none;
    }
  }
}

@media (max-width: 497px) {
  #navbar .full-path {
    display: none;
  }
}
</style>
