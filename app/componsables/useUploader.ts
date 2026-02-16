import { ref } from "vue";

export function useUpload() {
    const progress = ref<number>(0);
    const loaded = ref<number>(0);
    const total = ref<number>(0);
    const status = ref<"idle" | "uploading" | "success" | "error" | "aborted">("idle");

    let xhr: XMLHttpRequest | null = null;

    const upload = (file: File, uploadUrl: string): Promise<string> => {
        return new Promise<string>((resolve, reject): void => {
            status.value = "uploading";
            progress.value = 0;

            xhr = new XMLHttpRequest();
            xhr.open("PUT", uploadUrl, true);

            xhr.upload.onprogress = (event): void => {
                if (event.lengthComputable) {
                    loaded.value = event.loaded;
                    total.value = event.total;
                    progress.value = Math.round((event.loaded / event.total) * 100);
                }
            }

            xhr.onload = (): void => {
                if (xhr && xhr.status >= 200 && xhr.status < 300) {
                    status.value = "success";
                    resolve(xhr.responseText);
                } else {
                    status.value = "error";
                    reject(new Error(`Upload failed: ${xhr?.status}`));
                }
            }

            xhr.onerror = (): void => {
                status.value = "error";
                reject(new Error("Network error"));
            }

            xhr.onabort = (): void => {
                status.value = "aborted";
                reject(new Error("Upload aborted"));
            }

            xhr.send(file);
        })
    }

    const abort = (): void => {
        if (xhr) {
            xhr.abort();
        }
    }

    return {
        progress,
        loaded,
        total,
        status,
        upload,
        abort
    }
}
