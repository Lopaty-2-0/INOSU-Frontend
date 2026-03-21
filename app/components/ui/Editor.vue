<script setup lang="ts">
import {ref, computed, useTemplateRef, watch} from "vue";
import {QuillEditor} from "@vueup/vue-quill";
import { useI18n } from "#imports";

const { t } = useI18n();
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
  enabled: {
    type: Boolean,
    default: true,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "",
  },
});

const localContent = ref<string>(props.modelValue);
const editor = useTemplateRef<InstanceType<typeof QuillEditor>>("editor");
const emits = defineEmits(["update:modelValue"]);

const colorOptions = [
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
  { value: "#303f9f", label: "Indigo" },
];

const toolbarSections = computed<ToolbarSection[]>(() => [
  {
    section: "text-style",
    tools: [
      { type: "button", tool: "bold", class: "ql-bold", title: t('editor.toolbar.bold') },
      { type: "button", tool: "underline", class: "ql-underline", title: t('editor.toolbar.underline') },
      { type: "button", tool: "strike", class: "ql-strike", title: t('editor.toolbar.strike') },
      { type: "button", tool: "italic", class: "ql-italic", title: t('editor.toolbar.italic') },
    ],
  },
  {
    section: "block-style",
    tools: [
      { type: "button", tool: "blockquote", class: "ql-blockquote", title: t('editor.toolbar.blockquote') },
      { type: "button", tool: "code-block", class: "ql-code-block", title: t('editor.toolbar.codeBlock') },
    ],
  },
  {
    section: "media",
    tools: [
      { type: "button", tool: "link", class: "ql-link", title: t('editor.toolbar.link') },
      { type: "button", tool: "image", class: "ql-image", title: t('editor.toolbar.image') },
    ],
  },
  {
    section: "header-style",
    tools: [
      {
        type: "select",
        tool: "header",
        class: "ql-header",
        title: t('editor.toolbar.headings'),
        options: [
          { value: "1", label: t('editor.toolbar.heading1') },
          { value: "2", label: t('editor.toolbar.heading2') },
          { value: "3", label: t('editor.toolbar.heading3') },
          { value: "4", label: t('editor.toolbar.heading4') },
          { value: "", label: t('editor.toolbar.normal') },
        ],
      },
    ],
  },
  {
    section: "list-style",
    tools: [
      { type: "button", tool: "list-ordered", class: "ql-list", value: "ordered", title: t('editor.toolbar.listOrdered') },
      { type: "button", tool: "list-bullet", class: "ql-list", value: "bullet", title: t('editor.toolbar.listBullet') },
      { type: "button", tool: "list-check", class: "ql-list", value: "check", title: t('editor.toolbar.listCheck') },
    ],
  },
  {
    section: "indent-align",
    tools: [
      { type: "button", tool: "indentUp", class: "ql-indent", value: "-1", title: t('editor.toolbar.indentUp') },
      { type: "button", tool: "indentDown", class: "ql-indent", value: "+1", title: t('editor.toolbar.indentDown') },
      {
        type: "select",
        tool: "align",
        class: "ql-align",
        title: t('editor.toolbar.align'),
        options: [
          { value: "", label: t('editor.toolbar.alignLeft') },
          { value: "center", label: t('editor.toolbar.alignCenter') },
          { value: "right", label: t('editor.toolbar.alignRight') },
          { value: "justify", label: t('editor.toolbar.alignJustify') },
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
        title: t('editor.toolbar.textColor'),
        options: colorOptions,
      },
      {
        type: "select",
        tool: "background",
        class: "ql-background",
        title: t('editor.toolbar.bgColor'),
        options: colorOptions,
      },
    ],
  },
  {
    section: "clean",
    tools: [{ type: "button", tool: "clean", class: "ql-clean", title: t('editor.toolbar.clean') }],
  },
]);

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

watch(() => props.enabled, (newVal: boolean): void => {
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
    <div id="editor" :enable="String(props.enabled)">
      <div id="toolbar" v-show="props.enabledTools.length > 0">
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
          :placeholder="props.placeholder || t('editor.placeholder')"
          :options="{ readOnly: props.readOnly || !props.enabled }"
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

  &[enable="false"] {
    pointer-events: none;
    user-select: none;

    ::v-deep(.ql-editor) {
      pointer-events: none;
      user-select: none;
    }

    ::v-deep(.ql-container) * {
      opacity: var(--disabled-opacity);
      cursor: not-allowed;
    }
  }
}
</style>