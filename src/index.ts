import dotenv from 'dotenv'
import express from 'express'
import serverless from 'serverless-http'
import router from './routes'
import { Job } from './services/job'

dotenv.config()

const app = express()

app.use(router)

const handler = serverless(app)

export async function job (): Promise<void> {
  try {
    const job = new Job()
    await job.run()
  } catch (error) {
    throw new Error(error)
  }
}

export { handler }
