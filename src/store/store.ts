import { reactive } from 'vue'

interface Store {
  selectedImage: string | null;
  isUploadModalOpen: boolean;
  handleImageReset: () => void;
  handleModalOpen: () => void;
  handleModalClose: () => void;
}

export const store: Store = reactive({
  selectedImage: null,
  isUploadModalOpen: false,
  handleImageReset() {
    store.selectedImage = null
  },
  handleModalOpen() {
    store.isUploadModalOpen = true
  },
  handleModalClose() {
    store.isUploadModalOpen = false
  }
})