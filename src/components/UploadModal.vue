<script setup lang="ts">
  import { MAX_FILE_SIZE_BYTES } from '../utils/CONSTANTS'
  import { ref, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useUploadStore } from '../store/uploadStore'

  import LoaderIcon from './LoaderIcon.vue'

  export type PresignedPostUrlResponse = {
    url: string;
    fields: {
      bucket: string;
      key: string;
      Policy: string;
      "X-Amz-Algorithm": string;
      "X-Amz-Credential": string;
      "X-Amz-Date": string;
      "X-Amz-Signature": string;
    };
  };

  const uploadStore = useUploadStore()
  const { isUploadModalOpen } = storeToRefs(uploadStore)
  const { handleModalClose } = uploadStore

  const isLoading = ref(false)

  const error = ref<string | null>(null)
  const uploadSuccess = ref(false)
  const selectedFile = ref<File | null>(null)

  const inputRef = ref<HTMLInputElement | null>(null);

  const inputRefURL = computed(() => {
    if (selectedFile.value) {
     return URL.createObjectURL(selectedFile.value)
    }

    return undefined
  })

  function handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;

    console.log("files", files);

    if (files[0]) {
      const [type] = files[0].type.split("/");
      if (!type || type !== "image") {
        error.value = "Selected file is not an image"
        selectedFile.value = null
        return;
      }

      if (files[0].size > MAX_FILE_SIZE_BYTES) {
        error.value = "File size is too large. Maximum allowed size is 10 MB";
        selectedFile.value = null
        return;
      }

      selectedFile.value = files[0]
      error.value = null
    }
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (!selectedFile.value) {
      return;
    }

    console.log("selectedFile.value.name", selectedFile.value.name);

    isLoading.value = true;

    try {
      // First get Pre-signed POST URL
      const response = await fetch(
        import.meta.env.VITE_UPLOAD_ENDPOINT as string,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: selectedFile.value.name,
          }),
        }
      );

      const presignedPost: PresignedPostUrlResponse = await response.json();

      console.log("responseJSON", presignedPost);

      // Then use URL to upload file
      const formData = new FormData();
      Object.entries(presignedPost.fields).forEach(([k, v]) => {
        formData.append(k, v);
      });
      formData.append("file", selectedFile.value);

      const s3Response = await fetch(presignedPost.url, {
        method: "POST",
        body: formData,
      });

      console.log("s3Rsponse", s3Response);

      uploadSuccess.value = true;
    } catch (err) {
      console.log(err);
      error.value = "Upload Failed"
    }

    isLoading.value = false;
  }

  function uploadReset() {
    selectedFile.value = null
    uploadSuccess.value = false

    if (inputRef.value?.value) {
      inputRef.value.value = "";
    }
  }
</script>


<template>
  <article 
    v-if="isUploadModalOpen"
    @click="handleModalClose"
  >
    <dialog
      @click.stop
    >
      <h2>Upload Image</h2>
  
      <div 
        v-if="isLoading && !uploadSuccess"
        data-testid="uploadloader" 
        class="loader-wrapper"
      >
        <LoaderIcon  />
      </div>
  
      <div 
        v-if="uploadSuccess"
        data-testid="successmessage" 
        class="loader-wrapper"
      >
        <p class="success">
          Upload successful! Your image will be reviewed as soon as
          possible.
        </p>
  
        <button 
          data-testid="successconfirm"
          @click="uploadReset"
        >
          Confirm
        </button>
      </div>
  
      <p 
        v-if="error"
        class="error"
      >{{error}}</p>
  
      <form @submit=handleSubmit>
        <input
          data-testid="input"
          type="file"
          accept="image/*"
          @change=handleFileInput
          :disabled=isLoading
          ref="inputRef"
        />
  
        <template v-if="selectedFile">
          <picture>
            <img
              data-testid="uploadpreview"
              :src=inputRefURL
            />
          </picture>
  
          <button
            data-testid="uploadsubmit"
            type="submit"
            :disabled=isLoading
          >
            Submit
          </button>
        </template>
      </form>
    </dialog>
  </article>
</template>

<style scoped>
article {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;

  background: rgba(0, 0, 0, .8);
}

dialog {
  display: block;
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 70vw;
  max-width: 600px;

  background: #FFF;
  border: 0;
  border-radius: 4px;
}

h2 {
  margin-top: 20px;

  font-size: 24px;
  text-align: center;
}

.loader-wrapper {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  background: rgba(0, 0, 0, .9);
  border-radius: 4px;
}

.loader-wrapper button {
  padding: 10px 20px;

  border: 1px solid #FFF;
  border-radius: 4px;
  color: #FFF;
  font-size: 18px;
  cursor: pointer;
}

dialog p {
  margin-top: 20px;

  font-size: 20px;
}

p.error {
  color: red;
  text-align: center;
}

p.success {
  padding: 10px;

  color: #35ec35;
  text-align: center;
}

form {
  margin: 20px;
  display: flex;
  flex-direction: column;
}

picture {
  margin-top: 10px;
  display: block;
}

img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
}

form button {
  margin: 20px auto 0;
  padding: 10px 20px;

  border: 1px solid #000;
  border-radius: 4px;
  color: #000;
  font-size: 18px;
  cursor: pointer;
}
</style>