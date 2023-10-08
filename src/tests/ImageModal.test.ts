import { mount } from "@vue/test-utils";
import { createTestingPinia } from '@pinia/testing'
import { vi } from 'vitest'

import ImageModal from '../components/ImageModal.vue'

describe("Testing ImageModal", () => {      
  test("Should render null when image not set", async () => {
    const wrapper = mount(ImageModal, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              gallery: {
                selectedImage: null,
              }
            },
          }),
        ],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="dialog-img"]').exists()).toBe(false)
    })
  })

  test("Should render component when image is set", async () => {
    const wrapper = mount(ImageModal, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              gallery: {
                selectedImage: 'dialog-img',
              }
            },
          }),
        ],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="dialog-img"]').exists()).toBe(true)
    })
  })
})