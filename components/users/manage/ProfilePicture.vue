<script setup lang="ts">
import {ref, watch} from "vue";

const props = defineProps({
  oldProfilePicture: {
    type: String,
    required: true,
  },
  reset: {
    type: Boolean,
    default: false,
  }
});

const emits = defineEmits(["update"]);
const profilePictureUrlImage = ref<string>(props.oldProfilePicture);
const fileInput = ref<null | HTMLInputElement>(null);
const profilePictureFile = ref<File | null>(null);
const urlInput = ref<string>("");
const errors = ref<{ file: string; url: string }>({ file: "", url: "" });

const selectFile = (): void => {
  if (fileInput.value) fileInput.value.click();
};

const resetErrors = (): void => {
  errors.value = { file: "", url: "" };
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
    throw { customMessage: "Nepodporovaný typ souboru. Povoleny jsou pouze jpg, png nebo gif." };
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject("Nepodařilo se přečíst soubor.");
    reader.readAsDataURL(file);
  });
};

const convertUrlToFile = async (url: string): Promise<File> => {
  const response: Blob = await $fetch(url, { responseType: "blob" });
  const filename = url.split("/").pop() || "image.png";
  const mimeType = response.type;
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

  if (!allowedMimeTypes.includes(mimeType)) {
    throw { customMessage: "Nepodporovaný typ souboru. Povoleny jsou pouze jpg, png nebo gif." };
  }

  return new File([response], filename, { type: mimeType });
};

const uploadFile = async (event: Event): Promise<void> => {
  resetErrors();

  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  if (file.size > 2097152) {
    handleError("Obrázek je příliš velký, nahrajte prosím jiný.", "file");
    return;
  }

  try {
    profilePictureFile.value = file;
    profilePictureUrlImage.value = await convertFileToBase64(file);
    urlInput.value = "";
  } catch (error: any) {
    handleError(error.customMessage || "Nepodařilo se přečíst soubor.", "file");
  }
};

const processUrlInput = async (url: string): Promise<void> => {
  resetErrors();

  try {
    const file = await convertUrlToFile(url);
    profilePictureUrlImage.value = await convertFileToBase64(file);
    profilePictureFile.value = file;
  } catch (error: any) {
    handleError(error.customMessage || "Nepodařilo se načíst obrázek z URL adresy.", "url");
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
    //useAlertsStore().addAlert({ type: "warning", title: "Vložení URL", message: "Váš prohlížeč nepodporuje vkládání." });
  }
};

watch(() => profilePictureUrlImage.value, (): void => {
  emits("update", { profilePicture: props.oldProfilePicture !== profilePictureUrlImage.value ? profilePictureFile.value : undefined });
});

watch(() => props.reset, (reset: boolean): void => {
  if (reset) {
    resetErrors();
    profilePictureUrlImage.value = props.oldProfilePicture;
    profilePictureFile.value = null;
    urlInput.value = "";
  }
});
</script>

<template>
  <div class="section">
    <slot />
    <div class="items">
      <div class="item">
        <div class="content image">
          <img loading="lazy" :src="profilePictureUrlImage" alt="Profile photo" />
          <div class="content upload-file" @click="selectFile" :class="{ error: errors.file }">
            <p v-if="errors.file">
              <Icon class="icon" size="5rem" name="material-symbols:error-rounded" />
              {{ errors.file }}
            </p>
            <p v-else>
              <Icon class="icon" size="5rem" name="material-symbols:cloud-upload" />
              Klikni pro nahrání obrázku z počítače
            </p>
            <input type="file" placeholder="Profile image file" ref="fileInput" @change="uploadFile($event)" accept=".png, .jpg, .jpeg .gif" />
          </div>
        </div>
      </div>

      <div class="item url">
        <div class="content">
          <label for="image">URL obrázku</label>
          <div class="line">
            <input
                :class="{ error: errors.url }"
                type="text"
                id="image"
                name="image"
                placeholder="https://example.image/image.png"
                v-model="urlInput"
                @change="onUrlInput"
            />
            <div class="icon-div" @click="pasteUrl">
              <Icon class="icon" name="material-symbols:content-paste" />
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
  gap: 2rem;
  width: 100%;

  .update {
    color: rgba(var(--error-color), 1);
  }

  .line {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    flex-wrap: wrap;

    input {
      flex: 1;
    }
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;

    .item {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
      flex: 1;
      align-items: flex-end;

      &.url .icon-div {
        padding: 0.825rem 1rem;
        border: 1px solid var(--border-color);
        color: var(--btn-2-color);
        background: var(--btn-2-background);
        border-radius: 0.375rem;
        cursor: pointer;
        transition: 0.2s;
        line-height: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon {
          font-size: 1rem;
        }

        &:hover {
          background: var(--btn-2-hover-background);
        }
      }

      .content {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        &.image {
          display: flex;
          flex-direction: row;
          gap: 2rem;

          img {
            width: 300px;
            height: 300px;
            object-fit: cover;
            border-radius: 0.375rem;
          }

          .upload-file {
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            width: 100%;
            border: 2px dashed rgba(var(--border-color), 1);
            background: var(--input-background);
            border-radius: 0.375rem;
            padding: 0.625rem;
            font-size: 0.875rem;
            transition: 0.2s;
            color: var(--input-color);
            cursor: pointer;

            p {
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              font-size: 0.875rem;
              gap: 1rem;
              position: absolute;

              .icon {
                font-size: 60px;
                border: none;
              }
            }

            input {
              height: 100%;
              display: none;
            }

            &:hover {
              background: var(--btn-2-hover-background);
            }

            &.error {
              border-color: rgba(var(--error-color), 1);
              color: rgba(var(--error-color), 1);
            }
          }
        }

        label {
          color: var(--mini-title-color);
          font-size: 0.805rem;
          font-weight: 500;
        }

        .input-error {
          font-size: 0.875rem;
          color: rgba(var(--error-color), 1);
        }

        input {
          border-radius: 0.375rem;
          font-size: 0.875rem;
          outline: none;
          padding: 0.825rem 1rem;
          border: 1px solid rgba(var(--border-color), 1);
          min-width: 5rem;
          background: var(--input-background);
          color: var(--input-color);

          &:focus {
            border-color: rgba(var(--main-color), 1);
          }

          &.error {
            border-color: rgba(var(--error-color), 1);
          }
        }
      }
    }
  }
}

@media (max-width: 994px) {
  #settings .section .items .item .content.image {
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
  .section .items .item .content.image {
    .upload-file {
      height: 150px;
    }

    img {
      height: 150px;
    }
  }
}

@media (max-width: 503px) {
  .section .items .item .content.image {
    flex-direction: column;

    .upload-file {
      height: 150px;
    }

    img {
      width: 100%;
    }
  }
}
</style>