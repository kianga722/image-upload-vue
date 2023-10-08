import { mount } from "@vue/test-utils";
import { vi } from 'vitest'

import ImageModal from '../components/ImageModal.vue'

describe("Testing ImageModal", () => {      
  test("Should render null when image not set", async () => {
    const wrapper = mount(ImageModal);

    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="dialog-img"]').exists()).toBe(false)
    })
  })

  test("Should render component when image is set", async () => {
    const wrapper = mount(ImageModal);

    // Unsure if this is the correct way to manipulate the global store
    //@ts-ignore
    wrapper.vm.store.selectedImage = 'dialog-img'

    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="dialog-img"]').exists()).toBe(true)
    })
  })
})