<script setup lang="ts">
  import.meta.env.VITE_BUCKET_URL_THUMBNAILS
  import { storeToRefs } from 'pinia'
  import { useGalleryStore } from '../store/galleryStore'

  const VITE_BUCKET_URL_IMAGES = import.meta.env.VITE_BUCKET_URL_IMAGES
  const galleryStore = useGalleryStore()
  const { selectedImage } = storeToRefs(galleryStore)
  const { handleImageReset } = galleryStore
</script>

<template>
  <article
    v-if="selectedImage"
    @click="handleImageReset"
  >
    <dialog>
      <button
        @click="handleImageReset"
      >&times;</button>

      <picture>
        <img
          data-testid='dialog-img'
          @click.stop
          :src="VITE_BUCKET_URL_IMAGES + selectedImage"  
        />
      </picture>
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
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 70vw;

  background: transparent;
  border: 0;
}

button {
  color: #FFF;
  font-size: 60px;
  cursor: pointer;
}

picture {
  margin-top: 30px;
  display: block;
}

img {
  width: 100%;
  height: 100%;
  max-height: 72vh;
  object-fit: contain;
}
</style>