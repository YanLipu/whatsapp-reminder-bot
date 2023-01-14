import utils from '../utils/index'

describe('Send message to number', ()=>{
  it('Trigger handler', async ()=>{
    try {
      const response = await utils.useHandler()
      console.log('response', response)
      expect(Array.isArray(response)).toBe(true)
    } catch (error) {
      throw new Error(error)
    }
  })
})
