import { mount } from "@vue/test-utils";
import { vi } from 'vitest'

import ThumbNail from '../components/ThumbNail.vue'


describe("Testing Thumbnail", () => {
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