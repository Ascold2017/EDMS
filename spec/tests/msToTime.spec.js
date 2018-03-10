import msToTime from './../../src/components/modulesJs/msToTime'
const testTime  = { hours: '06', minutes: '32', seconds: '43' }
const trueTime = 21600000 + 1920000 + 43000

describe('Test ms to time:', () => {
    it('Type is object', () => {
        expect(typeof msToTime('1'))
        .toBe('object')
    })
    
    it('Time is true', () => {
        expect(msToTime(trueTime))
        .toEqual(testTime)
    })
})
