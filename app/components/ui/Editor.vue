<script setup lang="ts">
import {ref, useTemplateRef, watch} from "vue";
import {QuillEditor} from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

type Tool = {
  type: "button" | "select";
  tool: string;
  class: string;
  title: string;
  value?: string;
  options?: { value: string; label: string }[];
};

type ToolbarSection = {
  section: string;
  tools: Tool[];
};

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  enabledTools: {
    type: Array<string>,
    default: [
      "bold",
      "underline",
      "strike",
      "italic",
      "blockquote",
      "code-block",
      "link",
      "image",
      "header",
      "list-ordered",
      "list-bullet",
      "list-check",
      "indentUp",
      "indentDown",
      "align",
      "color",
      "background",
      "clean",
    ],
  },
  focus: {
    type: Boolean,
    default: false,
  },
  enable: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "Zde napište text",
  },
});

const localContent = ref<string>(props.modelValue);
const editor = useTemplateRef<InstanceType<typeof QuillEditor>>("editor");
const emits = defineEmits(["update:modelValue"]);

const toolbarSections: ToolbarSection[] = [
  {
    section: "text-style",
    tools: [
      { type: "button", tool: "bold", class: "ql-bold", title: "Tučné" },
      { type: "button", tool: "underline", class: "ql-underline", title: "Podtržené" },
      { type: "button", tool: "strike", class: "ql-strike", title: "Přeškrtnuté" },
      { type: "button", tool: "italic", class: "ql-italic", title: "Kurzíva" },
    ],
  },
  {
    section: "block-style",
    tools: [
      { type: "button", tool: "blockquote", class: "ql-blockquote", title: "Citace" },
      { type: "button", tool: "code-block", class: "ql-code-block", title: "Kód" },
    ],
  },
  {
    section: "media",
    tools: [
      { type: "button", tool: "link", class: "ql-link", title: "Odkaz" },
      { type: "button", tool: "image", class: "ql-image", title: "Obrázek" },
    ],
  },
  {
    section: "header-style",
    tools: [
      {
        type: "select",
        tool: "header",
        class: "ql-header",
        title: "Nadpisy",
        options: [
          { value: "1", label: "Nadpis 1" },
          { value: "2", label: "Nadpis 2" },
          { value: "3", label: "Nadpis 3" },
          { value: "4", label: "Nadpis 4" },
          { value: "", label: "Normální" },
        ],
      },
    ],
  },
  {
    section: "list-style",
    tools: [
      { type: "button", tool: "list-ordered", class: "ql-list", value: "ordered", title: "Seznam - číslovaný" },
      { type: "button", tool: "list-bullet", class: "ql-list", value: "bullet", title: "Seznam - odrážkový" },
      { type: "button", tool: "list-check", class: "ql-list", value: "check", title: "Seznam - zaškrtávací" },
    ],
  },
  {
    section: "indent-align",
    tools: [
      { type: "button", tool: "indentUp", class: "ql-indent", value: "-1", title: "Odsadit" },
      { type: "button", tool: "indentDown", class: "ql-indent", value: "+1", title: "Vrátit odsazení" },
      {
        type: "select",
        tool: "align",
        class: "ql-align",
        title: "Zarovnání",
        options: [
          { value: "", label: "Levá" },
          { value: "center", label: "Střed" },
          { value: "right", label: "Pravá" },
          { value: "justify", label: "Zarovnat" },
        ],
      },
    ],
  },
  {
    section: "color-style",
    tools: [
      {
        type: "select",
        tool: "color",
        class: "ql-color",
        title: "Barva textu",
        options: [
          { value: "", label: "Default" },
          { value: "#be7272", label: "Red" },
          { value: "#34a853", label: "Green" },
          { value: "#4285f4", label: "Blue" },
          { value: "#fbbc05", label: "Yellow" },
          { value: "#ff6f00", label: "Orange" },
          { value: "#e91e63", label: "Pink" },
          { value: "#9c27b0", label: "Purple" },
          { value: "#8bc34a", label: "Light Green" },
          { value: "#00bcd4", label: "Cyan" },
          { value: "#607d8b", label: "Gray" },
          { value: "#795548", label: "Brown" },
          { value: "#ffeb3b", label: "Bright Yellow" },
          { value: "#ff9800", label: "Bright Orange" },
          { value: "#00e676", label: "Bright Green" },
          { value: "#00bfa5", label: "Teal" },
          { value: "#f44336", label: "Bright Red" },
          { value: "#d32f2f", label: "Dark Red" },
          { value: "#1976d2", label: "Dark Blue" },
          { value: "#303f9f", label: "Indigo" }
        ],
      },
      {
        type: "select",
        tool: "background",
        class: "ql-background",
        title: "Barva pozadí",
        options: [
          { value: "", label: "Default" },
          { value: "#be7272", label: "Red" },
          { value: "#34a853", label: "Green" },
          { value: "#4285f4", label: "Blue" },
          { value: "#fbbc05", label: "Yellow" },
          { value: "#ff6f00", label: "Orange" },
          { value: "#e91e63", label: "Pink" },
          { value: "#9c27b0", label: "Purple" },
          { value: "#8bc34a", label: "Light Green" },
          { value: "#00bcd4", label: "Cyan" },
          { value: "#607d8b", label: "Gray" },
          { value: "#795548", label: "Brown" },
          { value: "#ffeb3b", label: "Bright Yellow" },
          { value: "#ff9800", label: "Bright Orange" },
          { value: "#00e676", label: "Bright Green" },
          { value: "#00bfa5", label: "Teal" },
          { value: "#f44336", label: "Bright Red" },
          { value: "#d32f2f", label: "Dark Red" },
          { value: "#1976d2", label: "Dark Blue" },
          { value: "#303f9f", label: "Indigo" }
        ],
      },
    ],
  },
  {
    section: "clean",
    tools: [{ type: "button", tool: "clean", class: "ql-clean", title: "Vyčistit formátování" }],
  },
];

const checkIfSectionIsEnabled = (section: ToolbarSection): boolean => {
  return section?.tools.some((tool: Tool) => props.enabledTools.includes(tool.tool));
};

const checkIfToolIsEnabled = (tool: string): boolean => {
  return props.enabledTools.includes(tool);
};

const emitInputEvent = (value: string) => {
  localContent.value = value;

  emits("update:modelValue", value);
};

watch(() => props.enable, (newVal: boolean): void => {
  if (!editor.value) return;

  const quill = editor.value.getQuill();

  if (newVal) quill.enable();
  else quill.disable();
});

watch(() => props.modelValue, (newVal: string): void => {
  if (!editor.value || newVal === localContent.value) return;

  localContent.value = newVal;
  editor.value.setHTML(newVal);
});

watch(() => props.focus, (newVal: boolean): void => {
  if (newVal && editor.value) editor.value.getQuill().focus();
});
</script>

<template>
  <ClientOnly>
    <div id="editor">
      <div id="toolbar">
        <div v-for="section in toolbarSections" class="ql-formats" :key="section.section" v-show="checkIfSectionIsEnabled(section)">
          <template v-for="item in section.tools" :key="item.tool">
            <template v-if="checkIfToolIsEnabled(item.tool)">
              <button v-if="item.type === 'button'" :class="item.class" :value="item.value" :title="item.title"></button>
              <select v-else-if="item.type === 'select'" :class="item.class" :title="item.title">
                <option v-for="option in item.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </template>
          </template>
        </div>
      </div>

        <QuillEditor
          ref="editor"
          theme="snow"
          @update:content="emitInputEvent"
          v-model:content="localContent"
          :placeholder="props.placeholder"
          :options="{ readOnly: !props.enable }"
          content-type="html"
          toolbar="#toolbar"
        />
    </div>
  </ClientOnly>
</template>

<style lang="scss" scoped>
@use "../../assets/style/editor.scss";

#editor {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  width: 100%;
  position: relative;
}
</style>