import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUploadStore = defineStore('upload', () => {
  const isUploadModalOpen = ref(false)

  function handleModalOpen() {
    isUploadModalOpen.value = true
  }

  function handleModalClose() {
    isUploadModalOpen.value = false
  }

  return { isUploadModalOpen, handleModalOpen, handleModalClose }
})