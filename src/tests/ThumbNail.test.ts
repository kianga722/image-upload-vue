import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from 'pinia'

import ThumbNail from '../components/ThumbNail.vue'

describe("Testing Thumbnail", () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia())
  })
    
  test("Should render the image thumbnail", () => {
    const wrapper = mount(ThumbNail, {
      props: {
        filename: 'test.jpg'
      }
    })

    expect(wrapper.find('img').attributes('src')).toContain('test')
  })

  test("Should render the same image thumbnail after click", () => {
    const wrapper = mount(ThumbNail, {
      props: {
        filename: 'test.jpg'
      }
    })

    expect(wrapper.find('img').attributes('src')).toContain('test')
    
    wrapper.find("button").trigger('click')

    expect(wrapper.find('img').attributes('src')).toContain('test')
  })
})