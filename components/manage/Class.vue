<script setup lang="ts">
import {ref, watch} from "vue";
import type {ClassData} from "../../types/classes";

const props = defineProps({
  classes: {
    type: Array as () => ClassData[],
    required: true,
  },
  oldClassIds: {
    type: Array as () => number[],
    required: true,
  },
  reset: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update"]);
const title = computed<string>((): string => {
  const numberOfSelectedClasses: number = selectedClasses.value.length;

  return numberOfSelectedClasses > 0 ? `Vybrané třídy: ${numberOfSelectedClasses}` : "";
});
const searchedClasses = computed<ClassData[]>((): ClassData[] => {
  return props.classes.filter((item: ClassData): boolean => {
    return (
      item.name.toLocaleLowerCase().includes(searchName.value.toLocaleLowerCase()) &&
      (searchSpecialization.value ? item.specialization.toLocaleLowerCase() === searchSpecialization.value.toLocaleLowerCase() : true) &&
      (searchGrade.value ? item.grade === searchGrade.value : true) &&
      (searchGroup.value ? item.group.toLocaleLowerCase() === searchGroup.value.toLocaleLowerCase() : true)
    );
  });
});
const selectedClasses = ref<number[]>([...props.oldClassIds]);
const open = ref<boolean>(false);
const searchName = ref<string>("");
const searchGrade = ref<number | null>(null);
const searchGroup = ref<string>("");
const searchSpecialization = ref<string>("");
const icons = {
  select: "material-symbols:done-rounded",
  selected: "material-symbols:close-rounded",
  open: "material-symbols:arrow-downward-rounded",
  close: "material-symbols:arrow-upward-rounded"
};

const toggleDropdown = (): void => {
  open.value = !open.value;
};

const selectClass = (classId: number): void => {
  selectedClasses.value = selectedClasses.value.includes(classId) ? selectedClasses.value.filter((item: number) => item !== classId) : [...selectedClasses.value, classId];

  emits("update", {
    classes: selectedClasses.value.length > 0 ? selectedClasses.value : undefined,
  });
};

watch(() => props.reset, (reset: boolean): void => {
  if (reset) {
    open.value = false;
    selectedClasses.value = [...props.oldClassIds];
    searchName.value = "";
    searchGrade.value = null;
    searchGroup.value = "";
    searchSpecialization.value = "";
  }
});

watch(() => props.oldClassIds, (newClassIds: number[]): void => {
  selectedClasses.value = newClassIds;
});
</script>

<template>
  <div class="section">
    <slot />

    <div class="section">
      <div class="content">
        <div class="search">
          <label for="searchName">
            Název
            <input id="searchName" placeholder="Vyhledat jméno" v-model="searchName" />
          </label>
          <label for="searchSpecialization">
            Zaměření
            <input id="searchSpecialization" placeholder="V" v-model="searchSpecialization" />
          </label>
          <label for="searchGrade">
            Ročník
            <input id="searchGrade" min="1" max="10" placeholder="3" type="number" v-model="searchGrade" />
          </label>
          <label for="searchGroup">
            Skupina
            <input id="searchGroup" placeholder="B" v-model="searchGroup" />
          </label>
        </div>

        <label>Výběr tříd</label>

        <div class="dropdown">
          <div class="title" @click="toggleDropdown">
            <p>{{ title || "Vyberte třídy" }}</p>

            <Icon class="icon" :name="open ? icons.close : icons.open" />
          </div>

          <div class="dropdown-content" v-show="open">
            <div
              v-for="item in searchedClasses"
              :key="item.id"
              class="section"
              :class="{ selected: selectedClasses.includes(item.id) }"
              @click="selectClass(item.id)"
              v-if="searchedClasses.length > 0"
            >
              <Icon class="icon" :name="selectedClasses.includes(item.id) ? icons.select : icons.selected" />
              <span><span class="name" v-if="item.name">{{ item.name + " - " }}</span>{{ item.specialization }}{{ item.grade }}{{ item.group }}</span>
            </div>

            <div v-else class="section error">
              <p>Žádné třída nebyla nalezena.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;

  .section {
    display: flex;
    flex-direction: row;
    gap: 20px;
    flex: 1;
    align-items: flex-end;

    .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;

      label {
        color: var(--mini-title-color);
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 5px;
        flex: 1;
      }

      .input-error {
        font-size: 16px;
        color: rgba(var(--error-color), 1);
      }

      .search {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;

        input {
          padding: 15px;
          min-width: 150px;
          width: 100%;
          background: transparent;
          outline: none;
          border-radius: var(--normal-border-radius);
          border: var(--border-width) solid rgba(var(--border-color), 0.5);
          background: var(--input-background);
          color: var(--input-color);

          &, &::placeholder {
            font-size: 16px;
            font-weight: 400;
          }

          &:focus {
            border-color: rgba(var(--main-color), 1);
          }
        }
      }
    }
  }

  .dropdown {
    position: relative;
    display: flex;
    width: 100%;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    flex-direction: column;

    &.error {
      .title input {
        border: var(--border-width) solid rgba(var(--error-color), 1);
      }
    }

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: 0.2s;
      width: 100%;
      gap: 10px;
      padding: 15px;
      border: var(--border-width) solid rgba(var(--border-color), 0.5);
      color: var(--btn-2-color);
      background: var(--btn-2-background);
      border-radius: var(--normal-border-radius);
      cursor: pointer;
      line-height: 0;

      .icon {
        font-size: 16px;
      }
    }

    .dropdown-content {
      position: relative;
      display: flex;
      flex-direction: column;
      transition: 0.2s;
      margin-top: 10px;
      border-radius: var(--normal-border-radius);
      font-size: 16px;
      outline: none;
      border: var(--border-width) solid rgba(var(--border-color), 0.5);
      background: var(--input-background);
      color: var(--input-color);
      width: 100%;
      word-break: break-word;
      max-height: 200px;
      overflow-y: auto;
      top: 100%;
      z-index: 5;
      left: 0;

      &::-webkit-scrollbar {
        width: 5px;
      }

      .section {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px;
        transition: 0.2s;
        cursor: pointer;

        span {
          text-transform: uppercase;
        }

        .name {
          text-transform: none;
        }

        .icon {
          font-size: 16px;
          color: rgba(var(--description-color), 1);
        }

        &.selected {
          .icon, span {
            color: rgba(var(--main-color), 1);
          }
        }

        &.error {
          color: rgba(var(--error-color), 1);
        }

        &:hover {
          background: var(--input-background-hover);
        }

        &:last-child {
          border-bottom-left-radius: var(--normal-border-radius);
          border-bottom-right-radius: var(--normal-border-radius);
        }

        &:first-child {
          border-top-left-radius: var(--normal-border-radius);
          border-top-right-radius: var(--normal-border-radius);
        }

        &:not(:last-child) {
          border-bottom: var(--border-width) solid rgba(var(--border-color), 1);
        }
      }
    }
  }

  .line {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    flex-wrap: wrap;

    input {
      flex: 1;
    }
  }
}
</style>
