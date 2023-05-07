import { getDataBase, insertNewTask } from '../../src/services/notion'

describe('notion connection', ()=>{
  it('get database', async () =>{
    try {
      const response = await getDataBase()
      expect(response).toBeTruthy()
    } catch (error) {
      throw new Error(error)
    }
  })

  it('insert new task to database', async ()=>{
    try {
      const task = {
        dateStart: '2023-12-01',
        dateEnd: '2023-12-01',
        nameTask: 'JEST TEST RUN',
        recurrent:  false
      }
      const response = await insertNewTask(task)
      expect(response).toBeTruthy()
    } catch (error) {
      throw new Error(error)
    }
  })
})
