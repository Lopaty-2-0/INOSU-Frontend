<script setup lang="ts">
import InputMenu, {type InputMenuItem} from "~/components/ui/InputMenu.vue";
import { ref, watch, computed } from "vue";
import type { LocaleObject } from "~/types/i18n";
import { useI18n } from "#imports";

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  locales: {
    type: Array as () => LocaleObject[],
    required: true,
  },
});

const emits = defineEmits(["update:modelValue"]);

const localeItems = computed<InputMenuItem[]>(() =>
    props.locales.map((l: LocaleObject) => ({
      value: l.code,
      label: l.code.toUpperCase() + " - " + l.name,
    }))
);

const newLocale = ref<string[]>([props.modelValue]);

watch(() => newLocale.value, (value: string[]) => {
  if (!value[0]) return;

  emits("update:modelValue", value[0]);
});
</script>

<template>
  <InputMenu
    class="locale-picker"
    :items="localeItems"
    v-model="newLocale"
    :placeholder="t('localePicker.placeholder')"
  />
</template>
