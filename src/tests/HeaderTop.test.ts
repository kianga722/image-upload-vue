import { APP_TITLE } from '../utils/CONSTANTS';

import { mount } from "@vue/test-utils";
import HeaderTop from "../components/HeaderTop.vue";

describe("Testing Header", () => {
  
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
