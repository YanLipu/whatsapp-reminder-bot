import { MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const mongoSecret = process.env.MONGO_DB_SECRET

const uri = `mongodb+srv://whatsapp-bot:${mongoSecret}@cluster0.bz8nb8s.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1
})

class Database {

  public async connect (): Promise<void> {
    try {
      await client.connect()
    } catch (error) {
      throw new Error(error)
    }
  }

  public async close (): Promise<void> {
    try {
      await client.close()
    } catch (error) {
      throw new Error(error)
    }
  }
}

export default Database
