<script setup lang="ts">
import {ref, useTemplateRef, watch} from "vue";
import { useAlertsStore } from "~/stores/alerts";
import Input from "~/components/ui/Input.vue";
import FileInput from "~/components/ui/FileInput.vue";
import Image from "~/components/ui/Image.vue";
import { useI18n } from "#imports";

const { t } = useI18n();

const props = defineProps({
  oldProfilePicture: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(["update"]);
const profilePictureUrlImage = ref<string>(props.oldProfilePicture);
const profilePictureFile = ref<File | null>(null);
const fileInput = useTemplateRef<InstanceType<typeof FileInput>>("fileInput");
const urlInput = ref<string>("");
const errors = ref<{ file: string; url: string }>({ file: "", url: "" });

const resetErrors = (): void => {
  errors.value = { file: "", url: "" };
  if (fileInput.value) fileInput.value.resetError();
};

const handleError = (message: string, type: string): void => {
  switch (type) {
    case "file":
      errors.value.file = message;
      break;
    case "url":
      errors.value.url = message;
      break;
  }

  urlInput.value = "";
  profilePictureUrlImage.value = props.oldProfilePicture;
};

const convertFileToBase64 = async (file: File): Promise<string> => {
  const validExtensions: string[] = ["image/jpeg", "image/png", "image/gif"];

  if (!validExtensions.includes(file.type)) {
    throw {
      customMessage: t('manage.profilePicture.errors.unsupportedType'),
    };
  }

  return new Promise((resolve, reject) => {
    const reader: FileReader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(t('manage.profilePicture.errors.readFailed'));
    reader.readAsDataURL(file);
  });
};

const convertUrlToFile = async (url: string): Promise<File> => {
  const response: Blob = await $fetch(url, { responseType: "blob" });
  const filename: string = url.split("/").pop() || "image.png";
  const mimeType: string = response.type;
  const allowedMimeTypes: string[] = ["image/jpeg", "image/png", "image/gif"];

  if (!allowedMimeTypes.includes(mimeType)) {
    throw {
      customMessage: t('manage.profilePicture.errors.unsupportedType'),
    };
  }

  return new File([response], filename, { type: mimeType });
};


const processUrlInput = async (url: string): Promise<void> => {
  resetErrors();

  try {
    const file: File = await convertUrlToFile(url);

    profilePictureUrlImage.value = await convertFileToBase64(file);
    profilePictureFile.value = file;
  } catch (error: any) {
    handleError(
      error.customMessage || t('manage.profilePicture.errors.urlLoadFailed'),
      "url"
    );
  }
};

const onUrlInput = async (): Promise<void> => {
  if (!urlInput.value) {
    resetErrors();
    profilePictureUrlImage.value = props.oldProfilePicture;
    return;
  }

  await processUrlInput(urlInput.value);
};

const pasteUrl = async (): Promise<void> => {
  try {
    urlInput.value = await navigator.clipboard.readText();
    await processUrlInput(urlInput.value);
  } catch {
    useAlertsStore().addAlert({
      type: "warning",
      title: t('common.pasteUrl.title'),
      message: t('common.pasteUrl.unsupported'),
    });
  }
};

const reset = (): void => {
  resetErrors();

  profilePictureUrlImage.value = props.oldProfilePicture;
  profilePictureFile.value = null;
  urlInput.value = "";
  if (fileInput.value) fileInput.value.resetError();
};

watch(() => profilePictureFile.value, async (newFile: File | null): Promise<void> => {
  if (newFile) {
    try {
      profilePictureUrlImage.value = await convertFileToBase64(newFile);
      urlInput.value = "";
    } catch (error: any) {
      handleError(error.customMessage || t('manage.profilePicture.errors.readFailed'), "file");
    }
  }
});

watch(() => profilePictureUrlImage.value, (): void => {
  if (fileInput.value) fileInput.value.resetError();

  emits("update", {
    profilePicture: props.oldProfilePicture !== profilePictureUrlImage.value ? profilePictureFile.value : undefined,
  });
});

defineExpose({ reset });
</script>

<template>
  <div class="section">
    <slot />
    <div class="items">
      <div class="section">
        <div class="content image">
          <Image
            :src="profilePictureUrlImage"
            class-name="img"
            :alt="t('manage.profilePicture.alt')"
          />

          <FileInput
            ref="fileInput"
            class="content"
            v-model="profilePictureFile"
            :placeholder="t('manage.profilePicture.uploadPlaceholder')"
            :max-size-m-b="2"
            accept=".png,.jpg,.jpeg,.gif"
          />
        </div>
      </div>

      <div class="section url">
        <div class="content">
          <label for="image">{{ t('manage.profilePicture.urlLabel') }}</label>
          <div class="line">
            <Input
              :class="{ error: errors.url }"
              type="url"
              id="image"
              name="image"
              :placeholder="t('manage.profilePicture.urlPlaceholder')"
              v-model.trim="urlInput"
              @change="onUrlInput"
            />
            <div class="icon-div" @click="pasteUrl">
              <Icon
                class="icon"
                size="16px"
                name="material-symbols:content-paste"
              />
            </div>
          </div>
          <p v-if="errors.url" class="input-error">{{ errors.url }}</p>
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

  .update {
    color: rgba(var(--error-color), 1);
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

  .items {
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

      &.url .icon-div {
        padding: 15px;
        border: var(--border-width) solid rgba(var(--border-color), 0.5);
        color: var(--btn-2-color);
        background: var(--btn-2-background);
        border-radius: var(--normal-border-radius);
        cursor: pointer;
        transition: 0.2s;
        line-height: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon {
          font-size: 16px;
        }

        &:hover {
          background: var(--btn-2-hover-background);
        }
      }

      .content {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;

        &.image {
          display: flex;
          flex-direction: row;
          gap: 30px;

          ::v-deep(.img) {
            width: 300px;
            height: 300px;
            object-fit: cover;
            border-radius: var(--normal-border-radius);
          }
        }

        label {
          color: var(--mini-title-color);
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
        }

        .input-error {
          font-size: 16px;
          color: rgba(var(--error-color), 1);
        }

        input {
          &.error {
            border-color: rgba(var(--error-color), 1);
          }
        }
      }
    }
  }
}

@media (max-width: 994px) {
  #settings .section .items .section .content.image {
    .upload-file {
      max-width: 100%;

      span {
        position: relative;
        width: 100%;
      }
    }
  }
}

@media (max-width: 750px) {
  .section .items .section .content.image {
    .upload-file {
      height: 150px;
    }

    ::v-deep(.img) {
      height: 150px;
    }
  }
}

@media (max-width: 503px) {
  .section .items .section .content.image {
    flex-direction: column;

    .upload-file {
      height: 150px;
    }

    ::v-deep(.img) {
      width: 100%;
    }
  }
}
</style>
