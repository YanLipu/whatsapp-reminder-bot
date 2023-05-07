import dotenv from 'dotenv'
import { Twilio, twiml } from 'twilio'
import { MongoClient, ServerApiVersion } from 'mongodb'
import  Templates from '../templates/messages'
import BotManager from './bot'
const { MessagingResponse } = twiml

const templates = new Templates()


dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNT_SID as string
const authToken = process.env.TWILIO_AUTH_TOKEN as string
const mongoSecret = process.env.MONGO_DB_SECRET

const uri = `mongodb+srv://whatsapp-bot:${mongoSecret}@cluster0.bz8nb8s.mongodb.net/?retryWrites=true&w=majority`

const twilioClient = new Twilio(accountSid, authToken)
const mongoClient = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1
})
const database = mongoClient.db('reminders')
const users = database.collection('users')

async function getHistory (number: string) {
  try {
    return await Promise.all([
      twilioClient.messages.list({
        from: number
      })
    ])
  } catch (error) {
    throw new Error(error)
  }
}

async function registerUser (message: any) {
  try {
    const messagesArray = []
    messagesArray.push(message)
    const userData = {
      from: message.From,
      to: message.To,
      messagesArray: messagesArray,
      stage: 1,
      name: message.ProfileName
    }
    const data = await users.insertOne({
      ...userData
    })
    return data
  } catch (error) {
    throw new Error(error)
  }
}

async function getUserData (from: string, to: string) {
  try {
    const data = await users.findOne({ from: from, to: to })
    return data
  } catch (error) {
    throw new Error(error)
  }
}

async function insertIncomingMessageToUser (from: string, to: string, message: any): Promise<void> {
  try {
    const response = await getUserData(from, to)
    const messagesArray = response?.messagesArray
    messagesArray.push(message)
    await users.updateOne({ from: from, to:to }, { 
      $set: {
        messagesArray: messagesArray
      }
    })
  } catch (error) {
    throw new Error(error)
  }
}


const handle = async (req: any, res: any) => {
  try {
    const body = JSON.parse(JSON.stringify(req.body))

    const previousMessages = await getHistory(body.From)
    const previousMessagesFromOurDB = await getUserData(body.From, body.To)
    
    const response = new MessagingResponse()

    if ((Array.isArray(previousMessages) && previousMessages.length < 1) || 
      !previousMessagesFromOurDB) {
      await registerUser(body)
    }

    await insertIncomingMessageToUser(body.From, body.To, body)

    const userData = await getUserData(body.From, body.To)

    const botManager = new BotManager(templates, mongoClient, response)

    const message = await botManager.handleStage(userData)
    
    response.message(message.toString())
    
    res.set("Content-Type", "text/xml")
    res.send(response.toString())
  } catch (error) {
    throw new Error(error)
  }
  
}

export { handle }


