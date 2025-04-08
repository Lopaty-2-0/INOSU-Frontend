<script setup lang="ts">
import { ref, watch } from "vue";
import { useAlertsStore } from "~/stores/alerts";

const props = defineProps({
  oldCustomLinks: {
    type: Array as () => { text: string; href: string }[],
    required: true
  },
  reset: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(["update"]);
const accountCustomLinks = ref<{ text: string; href: string }[]>([ ...props.oldCustomLinks ]);
const editLinkId = ref<number | null>(null);
const textInputValue = ref<string[]>([]);
const hrefInputValue = ref<string[]>([]);

const isEqual = (array1: { text: string; href: string }[], array2: { text: string; href: string }[]): boolean => {
  if (array1.length !== array2.length) return false;

  return array1.every((element: { text: string, href: string }, index: number) => {
    return (element.href === array2[index].href) && (element.text === array2[index].text);
  });
};

const callUpdateEmit = () => {
  emits("update", isEqual(props.oldCustomLinks, accountCustomLinks.value) ? undefined : accountCustomLinks.value);
};

const setEditLinkId = (index: number) => {
  textInputValue.value[index] = accountCustomLinks.value[index].text || "";
  hrefInputValue.value[index] = accountCustomLinks.value[index].href || "";

  if (editLinkId.value === index) return editLinkId.value = null;

  editLinkId.value = index;
};

const addCustomLink = () => {
  if (accountCustomLinks.value.length >= 5) return useAlertsStore().addAlert({ type: "warning", title: "Vlastní odkazy", message: "Nelze přidat více než 5 odkazů." });

  accountCustomLinks.value.push({
    text: "YouTube",
    href: "https://www.youtube.com"
  });

  setEditLinkId(accountCustomLinks.value.length - 1);
  callUpdateEmit();
};

const removeCustomLink = (id: number) => {
  accountCustomLinks.value.splice(id, 1);

  callUpdateEmit();
};

const onInput = () => {
  if (editLinkId.value !== null) {
    accountCustomLinks.value[editLinkId.value] = {
      text: textInputValue.value[editLinkId.value],
      href: hrefInputValue.value[editLinkId.value]
    }

    callUpdateEmit();
  }
};

watch(() => props.reset, (value: boolean) => {
  if (value) {
    accountCustomLinks.value = [ ...props.oldCustomLinks ];
    editLinkId.value = null;
    textInputValue.value = [];
    hrefInputValue.value = [];
  }
});
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
            <Icon class="icon" name="material-symbols:add-rounded" size="1rem"></Icon>
          </div>
        </div>
      </div>

      <ul class="items">
        <li v-for="(link, index) in accountCustomLinks" :key="index" :class="{ open: editLinkId === index }" v-if="accountCustomLinks.length">
          <div class="link">
            <div class="head">
              <h4>{{ link.text }}</h4>
              <NuxtLink target="_blank" :to="link.href">{{ link.href }}</NuxtLink>
            </div>
            <hr>
            <div class="body">
              <div class="input">
                <label :for="'text-input-' + index">Text</label>
                <input type="text" :id="'text-input-' + index" name="linkText" placeholder="YouTube" v-model="textInputValue[editLinkId!]" @input="onInput">
              </div>
              <div class="input">
                <label :for="'url-input-' + index">Odkaz</label>
                <input type="text" :id="'url-input-' + index" name="linkUrl" placeholder="https://www.youtube.com/" v-model="hrefInputValue[editLinkId!]" @input="onInput">
              </div>
            </div>
          </div>

          <div class="actions">
            <div class="icon-div edit" @click="setEditLinkId(index)">
              <Icon class="icon" name="material-symbols:edit-rounded" size="16px"></Icon>
            </div>
            <div class="icon-div remove" @click="removeCustomLink(index)">
              <Icon class="icon" name="material-symbols:delete-rounded" size="16px"></Icon>
            </div>
          </div>
        </li>
        <li v-else>
          Nemáte vytvořené žádné vlastní odkazy.
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .number-of-links {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;

    div {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1rem;

      p {
        color: rgba(var(--description-color), 1);
      }

      .icon-div {
        padding: 1rem;
        border-radius: 0.375rem;
        transition: 0.2s;
        font-size: 15px;
        background: var(--actionBar-actions-add-background);
        color: var(--actionBar-actions-add-color);
        border: var(--border-width) solid transparent;
        cursor: pointer;
        line-height: 0;

        &:hover {
          border-color: var(--actionBar-actions-add-border);
        }
      }
    }

    h4 {
      font-size: 1rem;
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
    gap: 2rem;
    justify-content: flex-start;
    margin-top: 2rem;

    li {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      width: 100%;
      color: rgba(var(--description-color), 1);

      &.open .link .body, &.open .link hr {
        display: flex;
      }

      .link {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        border: var(--border-width) solid rgba(var(--border-color), 0.5);
        border-radius: 0.5rem;
        width: 100%;
        padding: 1.5rem;

        .head {
          display: flex;
          flex-direction: row;
          gap: 0.5rem;
          width: 100%;

          h4 {
            font-size: 1rem;
            font-weight: 600;
            color: var(--title-color);
            flex: 40%;
          }

          a {
            color: rgba(var(--description-color), 1);
            flex: 60%;
            transition: 0.2s;
            width: 100%;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;

            &:hover {
              color: rgba(var(--main-color), 1);
            }
          }
        }

        hr {
          display: none;
          border-color: rgba(var(--border-color), 0.5);
        }

        .body {
          display: none;
          flex-direction: row;
          gap: 2rem;
          width: 100%;
          transition: 0.2s;

          .input {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;

            label {
              color: var(--mini-title-color);
              font-size: 0.805rem;
              font-weight: 500;
            }

            input {
              border-radius: 0.375rem;
              font-size: 0.875rem;
              outline: none;
              padding: 0.825rem 1rem;
              min-width: 5rem;
              border: var(--border-width) solid rgba(var(--border-color), 0.5);
              background: var(--input-background);
              color: var(--input-color);

              &:focus {
                border-color: rgba(var(--main-color), 1);
              }

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

      &.open .actions .edit {
        background: var(--actionBar-actions-edit-background);
        color: var(--actionBar-actions-edit-color);
        border-color: transparent;
      }

      .actions {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;

        .icon-div {
          padding: 1rem;
          border-radius: 0.5rem;
          transition: 0.2s;
          font-size: 15px;
          background: var(--btn-2-background);
          color: var(--btn-2-color);
          border: var(--border-width) solid rgba(var(--border-color), 0.5);
          cursor: pointer;
          line-height: 0;

          &.remove:hover {
            background: var(--actionBar-actions-remove-background);
            color: var(--actionBar-actions-remove-color);
            border-color: transparent;
          }

          &.edit:hover {
            background: var(--actionBar-actions-edit-background);
            color: var(--actionBar-actions-edit-color);
            border-color: transparent;
          }
        }
      }
    }
  }
}

@media (max-width: 915px) {
  .section .items li {
    flex-direction: column;

    .link {
      .head, .body {
        flex-direction: column;
      }
    }
  }
}
</style>
