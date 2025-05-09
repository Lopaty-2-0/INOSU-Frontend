<script setup lang="ts">
import moment from "moment";
import {ref, watch} from "vue";
import useArrayChunks from "../../componsables/useArrayChunks";
import type {AccountData} from "../../types/account";

const props = defineProps({
  users: {
    type: Array as () => AccountData[],
    default: () => []
  },
  action: {
    type: String as () => "list" | "edit" | "remove",
    default: "list"
  },
  activePage: {
    type: Number,
    default: 0,
    required: true
  },
  usersPerPage: {
    type: Number,
    default: 12,
    required: true
  }
});
const emits = defineEmits(["get:numberOfPages"]);

const numberOfPages = ref<number>(0);
const allUsersPages = ref<AccountData[][]>([]);

watch(() => props.users, (newValue: AccountData[]): void => {
  allUsersPages.value = useArrayChunks(newValue, props.usersPerPage);
  numberOfPages.value = Math.ceil(newValue.length / props.usersPerPage);

  emits("get:numberOfPages", numberOfPages.value);
}, { immediate: true });
</script>

<template>
  <div class="users-grid">
    <div class="all-users" v-if="users.length > 0">
      <div v-for="user in (allUsersPages[props.activePage] as AccountData[])" :key="user.id" class="card">
        <NuxtLink :to="'mailto:' + user.email" class="user list" v-if="props.action === 'list'">
          <div class="head">
            <img :src="'http://89.203.248.163/uploads/profilePictures/' + user.profilePicture" alt="User profile photo" loading="lazy">
            <h3>{{ user.name }} {{ user.surname }}</h3>
          </div>

          <div class="info">
            <p>E-mail: <span>{{ user.email }}</span></p>
            <p>Přezdívka: <span>{{ user.abbreviation || "Není" }}</span></p>
            <p>Vytvořen: <span>{{ moment(user.createdAt).format("DD. MM. YYYY") }}</span></p>
          </div>
        </NuxtLink>
      </div>
    </div>

    <p class="error message" v-else>Žádný uživatel nebyl zobrazen!</p>
  </div>
</template>

<style scoped lang="scss">
.users-grid {
  display: flex;
  flex-direction: column;
  gap: 30px;

  .all-users {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 30px;

    .card {
      border-radius: var(--normal-border-radius);
      padding: 30px;
      transition: 0.2s;
      cursor: pointer;
      border: var(--border-width) solid rgba(var(--border-color), 0.5);
      border-radius: var(--normal-border-radius);
      background: var(--card-1-background);
      height: 100%;

      .user {
        display: flex;
        flex-direction: column;
        gap: 20px;

        .head {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;

          img {
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

      &:hover {
        background: var(--card-1-hover-background);
      }
    }
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

@media (max-width: 489px) {
  .users-grid .all-users {
    display: flex;
    flex-direction: column;

    .card {
      width: 100%;
    }
  }
}
</style>