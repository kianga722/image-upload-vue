import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGalleryStore = defineStore('gallery', () => {
  const selectedImage = ref<string | null>(null)

	function handleImageReset () {
		selectedImage.value = null;
	}

  return { selectedImage, handleImageReset }
})