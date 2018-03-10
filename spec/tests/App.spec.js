//import App from './../../src/App.vue'
import store from './../../src/store/index'
import msToTime from './../../src/components/modulesJs/msToTime'
const sessionStorage = {}
/*
describe('Test APP.vue', () => {
  it('User not authorize', () => {
    expect(App.route.path).toBe('/auth')
  })
})
*/

const trueTimes = [
    Object({ hours: '00', minutes: '00', seconds: '00' })
]

describe('Test ms to time:', () => {
    it('Type is object', () => {
        expect(typeof msToTime('1'))
        .toBe('object')
    })
    /*
    it('Time is true', () => {
        expect(msToTime(300))
        .toBe(trueTimes[0])
    })*/
})
