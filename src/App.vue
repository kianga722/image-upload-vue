<script setup lang="ts">
  import HeaderTop from './components/HeaderTop.vue';
  import GalleryMain from './components/GalleryMain.vue';
  import ImageModal from './components/ImageModal.vue';
  import UploadModal from './components/UploadModal.vue';
</script>

<template>
  <div id='content-wrapper'>
    <HeaderTop />

    <GalleryMain />

    <ImageModal />

    <UploadModal />
  </div>
</template>