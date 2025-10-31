<script setup lang="ts">
import { ref, watch } from "vue";
import { useAlertsStore } from "~/stores/alerts";
import type { AccountLink } from "~/types/account";
import Input from "~/components/ui/Input.vue";
import Card from "~/components/ui/Card.vue";

const props = defineProps({
  oldCustomLinks: {
    type: Array as () => AccountLink[],
    required: true,
  },
});

const emits = defineEmits(["update"]);

const accountCustomLinks = ref<AccountLink[]>([...props.oldCustomLinks]);
const editLinkId = ref<number | null>(null);
const textInputValue = ref<string[]>([]);
const hrefInputValue = ref<string[]>([]);

const isEqual = (array1: AccountLink[], array2: AccountLink[]): boolean => {
  if (array1.length !== array2.length) return false;

  return array1.every((element: AccountLink, index: number) => {
    if (!array2[index]) return false;

    return (
        element.href === array2[index]?.href &&
        element.text === array2[index]?.text
    );
  });
};

const callUpdateEmit = (): void => {
  emits("update", isEqual(props.oldCustomLinks, accountCustomLinks.value) ? undefined : accountCustomLinks.value);
};

const setEditLinkId = (index: number): void => {
  const link: AccountLink | undefined = accountCustomLinks.value[index];

  if (!link) return;

  textInputValue.value[index] = link.text ?? "";
  hrefInputValue.value[index] = link.href ?? "";

  editLinkId.value = editLinkId.value === index ? null : index;
};

const addCustomLink = (): void => {
  if (accountCustomLinks.value.length >= 5) {
    return useAlertsStore().addAlert({
      type: "warning",
      title: "Vlastní odkazy",
      message: "Nelze přidat více než 5 odkazů.",
    });
  }

  accountCustomLinks.value.push({
    text: "YouTube",
    href: "https://www.youtube.com",
  });

  setEditLinkId(accountCustomLinks.value.length - 1);
  callUpdateEmit();
};

const removeCustomLink = (id: number): void => {
  accountCustomLinks.value.splice(id, 1);
  editLinkId.value = null;
  callUpdateEmit();
};

const onInput = (): void => {
  if (editLinkId.value !== null) {
    accountCustomLinks.value[editLinkId.value] = {
      text: textInputValue.value[editLinkId.value] || "",
      href: hrefInputValue.value[editLinkId.value] || "",
    };

    callUpdateEmit();
  }
};

const reset = (): void => {
  accountCustomLinks.value = [...props.oldCustomLinks];
  editLinkId.value = null;
  textInputValue.value = [];
  hrefInputValue.value = [];
};

defineExpose({ reset })
</script>

<template>
  <div class="section">
    <slot />

    <div>
      <div class="number-of-links">
        <h4>Počet odkazů</h4>

        <div>
          <p>{{ accountCustomLinks.length }} / 5</p>
          <div class="icon-div" @click="addCustomLink">
            <Icon class="icon" name="material-symbols:add-rounded"></Icon>
          </div>
        </div>
      </div>

      <ul class="items">
        <li
          v-for="(link, index) in accountCustomLinks"
          :key="index"
          :class="{ open: editLinkId === index }"
          v-if="accountCustomLinks.length"
        >
          <Card class="link">
            <div class="body">
              <div class="head">
                <h4>{{ link.text }}</h4>
                <NuxtLink target="_blank" :to="link.href">{{ link.href }}</NuxtLink>
              </div>
              <hr />
              <div class="content">
                <div class="input">
                  <label :for="'text-input-' + index">Text</label>
                  <Input
                    type="text"
                    :id="'text-input-' + index"
                    name="linkText"
                    placeholder="YouTube"
                    v-model="textInputValue[editLinkId!]"
                    @input="onInput"
                  />
                </div>
                <div class="input">
                  <label :for="'url-input-' + index">Odkaz</label>
                  <Input
                    type="text"
                    :id="'url-input-' + index"
                    name="linkUrl"
                    placeholder="https://www.youtube.com/"
                    v-model="hrefInputValue[editLinkId!]"
                    @input="onInput"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div class="actions">
            <div class="icon-div edit" @click="setEditLinkId(index)">
              <Icon class="icon" name="material-symbols:edit-rounded"></Icon>
            </div>
            <div class="icon-div remove" @click="removeCustomLink(index)">
              <Icon class="icon" name="material-symbols:delete-rounded"></Icon>
            </div>
          </div>
        </li>
        <li v-else>Nemáte vytvořené žádné vlastní odkazy.</li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section {
  display: flex;
  flex-direction: column;
  gap: 30px;
  position: relative;
  width: 100%;

  .number-of-links {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;

    div {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 20px;

      p {
        color: rgba(var(--description-color), 1);
      }

      .icon-div {
        padding: 15px;
        border-radius: var(--small-border-radius);
        transition: 0.2s;
        font-size: 18px;
        background: rgba(var(--actionBar-actions-add-background), 1);
        color: var(--actionBar-actions-add-color);
        border: var(--border-width) solid
          rgba(var(--actionBar-actions-add-border), 1);
        cursor: pointer;
        line-height: 0;

        &:hover {
          background: rgba(var(--actionBar-actions-add-background), 0.8);
        }
      }
    }

    h4 {
      font-size: 16px;
      font-weight: 600;
      color: var(--title-color);

      span {
        color: rgba(var(--error-color), 1);
      }
    }
  }

  .items {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: flex-start;
    margin-top: 20px;
    width: 100%;

    li {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      color: rgba(var(--description-color), 1);
      text-wrap: wrap;
      width: 100%;

      &.open .link .body .content,
      &.open .link .body hr {
        display: flex;
      }

      .link {
        width: 100%;

        .body {
          display: flex;
          flex-direction: column;
          gap: 20px;

          .head {
            display: flex;
            flex-direction: column;
            gap: 10px;

            h4 {
              font-size: 16px;
              font-weight: 600;
              color: var(--title-color);
              word-break: break-all;
            }

            a {
              flex: 1;
              color: rgba(var(--description-color), 1);
              transition: 0.2s;
              font-size: 16px;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
              word-wrap: break-word;
              overflow-wrap: break-word;
              white-space: normal;
              word-break: break-all;

              &:hover {
                color: rgba(var(--main-color), 1);
              }
            }
          }

          hr {
            display: none;
            border-color: rgba(var(--border-color), 0.5);
          }

          .content {
            display: none;
            flex-direction: row;
            gap: 20px;
            transition: 0.2s;

            .input {
              display: flex;
              flex-direction: column;
              gap: 10px;
              width: 100%;

              label {
                color: var(--mini-title-color);
                font-size: 16px;
                font-weight: 500;
              }

              input {
                &.error {
                  border-color: rgba(var(--error-color), 1);

                  &:focus {
                    border-color: rgba(var(--error-color), 1);
                  }
                }
              }
            }
          }
        }
      }


      &.open .actions .edit {
        background: rgba(var(--actionBar-actions-edit-background), 1);
        color: var(--actionBar-actions-edit-color);
        border-color: transparent;
      }

      .actions {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;

        .icon-div {
          padding: 15px;
          border-radius: var(--small-border-radius);
          transition: 0.2s;
          font-size: 18px;
          background: var(--btn-2-background);
          color: var(--btn-2-color);
          border: var(--border-width) solid rgba(var(--border-color), 0.5);
          cursor: pointer;
          line-height: 0;

          &.remove:hover {
            background: rgba(var(--actionBar-actions-remove-background), 1);
            color: var(--actionBar-actions-remove-color);
            border-color: transparent;
          }

          &.edit:hover {
            background: rgba(var(--actionBar-actions-edit-background), 1);
            color: var(--actionBar-actions-edit-color);
            border-color: transparent;
          }
        }
      }
    }
  }
}

@media (max-width: 1300px) {
  .section .items li {
    flex-direction: column;

    .link .body {
      .head,
      .content {
        flex-direction: column;
      }
    }
  }
}
</style>
