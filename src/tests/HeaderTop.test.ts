import { APP_TITLE } from '../utils/CONSTANTS';
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from 'pinia'
import HeaderTop from "../components/HeaderTop.vue";

describe("Testing Header", () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia())
  })
  
  test("Should render initial values", async () => {
    const wrapper = mount(HeaderTop);

    expect(wrapper.find("h1").text()).toContain(APP_TITLE);
    expect(wrapper.find("button").text()).toContain("Upload");
  });

  test("Should render same initial values when button is pressed", () => {
    const wrapper = mount(HeaderTop);

    expect(wrapper.find("h1").text()).toContain(APP_TITLE);
    expect(wrapper.find("button").text()).toContain("Upload")

    wrapper.find("button").trigger('click')
    
    expect(wrapper.find("h1").text()).toContain(APP_TITLE);
    expect(wrapper.find("button").text()).toContain("Upload")
  })
})
