<script setup lang="ts">
import moment from "moment";
import {ref, watch} from "vue";
import type { AccountData } from "~/types/account";
import Card from "~/components/ui/Card.vue";
import Image from "~/components/ui/Image.vue";
import Loading from "~/components/ui/Loading.vue";

const props = defineProps({
  users: {
    type: Array as () => AccountData[],
    default: () => [],
  },
  action: {
    type: String as () => "list" | "edit" | "remove",
    default: "list",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  selectedUsers: {
    type: Array as () => AccountData[],
    default: () => [],
  }
});
const emits = defineEmits(["get:numberOfPages", "get:selectedUsers"]);
const config = useRuntimeConfig();

const localSelectedUsers = ref<AccountData[]>([...(props.selectedUsers || [])]);

const onUserClick = (user: AccountData): void => {
  switch (props.action) {
    case "list":
      navigateTo(`mailto:${user.email}`, { external: true });
      break;
    case "edit":
      navigateTo(`/panel/users/${user.role}/edit/${user.id}`);
      break;
    case "remove":
      localSelectedUsers.value = localSelectedUsers.value.includes(user)
        ? localSelectedUsers.value.filter((u: AccountData) => u.id !== user.id)
        : [...localSelectedUsers.value, user];
      emits("get:selectedUsers", localSelectedUsers.value);
      break;
  }
};

const isSelected = (user: AccountData): boolean => {
  return localSelectedUsers.value.some((u: AccountData) => u.id === user.id);
};

const reset = (): void => {
  localSelectedUsers.value = [];
  emits("get:selectedUsers", localSelectedUsers.value);
};

const updateSelectedUsers = (users: AccountData[]): void => {
  localSelectedUsers.value = users;
};

watch(() => props.selectedUsers, (value: AccountData[]): void => {
  localSelectedUsers.value = value ? [...value] : [];
});

defineExpose({ reset, updateSelectedUsers });
</script>

<template>
  <div class="users-grid">
    <div class="loading" v-if="props.loading">
      <Loading color="rgba(var(--description-color), 1)" />
    </div>

    <div class="all-users" v-else-if="users.length > 0">
      <Card
        v-for="user in props.users"
        :key="user.id"
        class="card"
        :class="{
          [props.action]: true,
          selected: isSelected(user),
        }"
        @click="onUserClick(user)"
      >
        <div class="user">
          <div class="head">
            <Image :src="config.public.originUrl + '/api/file/pfp/' + user.profilePicture" alt="User profile photo"/>
            <h3>{{ user.name }} {{ user.surname }}</h3>
          </div>

          <div class="info">
            <p>
              E-mail: <span>{{ user.email }}</span>
            </p>
            <p>
              Přezdívka: <span>{{ user.abbreviation || "Není" }}</span>
            </p>
            <p>
              Vytvořen:
              <span>{{ moment(user.createdAt).format("DD. MM. YYYY") }}</span>
            </p>
          </div>
        </div>
      </Card>
    </div>

    <p class="error message" v-else>Žádný uživatel nebyl zobrazen!</p>
  </div>
</template>

<style scoped lang="scss">
.users-grid {
  display: flex;
  flex-direction: column;
  gap: 30px;
  flex: 1;

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .all-users {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 30px;

    .card {
      transition: 0.2s;
      cursor: pointer;

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

      &:hover {
        background: var(--card-1-hover-background);
      }

      &.remove {
        &:hover,
        &.selected {
          background: rgba(var(--error-color), 0.1);
          border: var(--border-width) solid rgba(var(--error-color), 0.5);
        }
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
