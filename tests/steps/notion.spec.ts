import { getDataBase } from '../../src/services/notion'

describe('notion connection', ()=>{
  it('get database', async () =>{
    try {
      const response = await getDataBase()
      console.log('response', response)
      expect(response).toBeTruthy()
    } catch (error) {
      throw new Error(error)
    }
  })
})
