import signIn from './../../src/components/indexPage/innerComponents/signIn.vue'
import { mount } from 'vue-test-utils'
import store from './../../src/store/index'
const sessionStorage = {}

describe('Component', () => {
    test('является экземпляром Vue', () => {
      const wrapper = mount(authForm)
      expect(wrapper.isVueInstance()).toBeTruthy()
    })
  })
