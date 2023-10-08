<script setup lang="ts">
  defineProps([
    "filename"
  ])

  import.meta.env.VITE_BUCKET_URL_THUMBNAILS
  import { storeToRefs } from 'pinia'
  import { useGalleryStore } from '../store/galleryStore'

  const VITE_BUCKET_URL_THUMBNAILS = import.meta.env.VITE_BUCKET_URL_THUMBNAILS
  const galleryStore = useGalleryStore()
  const { selectedImage } = storeToRefs(galleryStore)

  function handleThumbnailClick(thumbnail: string) {
    const fullImage = thumbnail.replace('resized-', '');
    selectedImage.value = fullImage
  }
</script>

<template>
  <li>
    <button
      @click="handleThumbnailClick(filename)"
    >

      <img 
        loading="lazy"
        :src="VITE_BUCKET_URL_THUMBNAILS + filename" 
      />
    </button>
  </li>
</template>
  
<style scoped>
li {
  aspect-ratio: 1/ 1;
  background: gray;
}

button {
  width: 100%;
  height: 100%;
    
  cursor: pointer;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>