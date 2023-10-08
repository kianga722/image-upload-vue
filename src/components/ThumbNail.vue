<script setup lang="ts">
  defineProps([
    "filename"
  ])

  import.meta.env.VITE_BUCKET_URL_THUMBNAILS
  import { store } from '../store/store'

  const VITE_BUCKET_URL_THUMBNAILS = import.meta.env.VITE_BUCKET_URL_THUMBNAILS

  function handleThumbnailClick(thumbnail: string) {
    const fullImage = thumbnail.replace('resized-', '');
    store.selectedImage = fullImage
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