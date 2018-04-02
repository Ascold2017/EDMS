import App from '../../src/App.vue'
import signIn from './../../src/components/indexPage/innerComponents/signIn.vue'
import { mount, shallow, createLocalVue } from 'vue-test-utils'
import store from './../../src/store/index'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(Vuex)

describe('Component', () => {
    test('является экземпляром Vue', () => {
      const wrapper = mount(signIn)
      expect(wrapper.isVueInstance()).toBeTruthy()
    })
  })

const $route = {
    path: '/'
}

describe('Test router', () => {
    test('test router', () => {
        const wrapper = shallow(App, {
            mocks: {
              $route
            }
        })
        expect(wrapper.vm.$route.path).toBe('/')
    })
})

