import { Job } from "../../src/services/job"

describe('cronjob run', ()=>{
  it('run', async () =>{
    try {
      const job = new Job()
      const response = await job.run()
      expect(response).toBeTruthy()
    } catch (error) {
      throw new Error(error)
    }
  })
})
