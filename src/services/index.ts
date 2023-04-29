import dotenv from 'dotenv'
import { Twilio, twiml } from 'twilio'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { templates } from '../templates/messages'
const { MessagingResponse } = twiml


dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNT_SID as string
const authToken = process.env.TWILIO_AUTH_TOKEN as string
const mongoSecret = process.env.MONGO_DB_SECRET

const uri = `mongodb+srv://whatsapp-bot:${mongoSecret}@cluster0.bz8nb8s.mongodb.net/?retryWrites=true&w=majority`

const twilioClient = new Twilio(accountSid, authToken)
const mongoClient = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1
})

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
    console.log('entrou register', message)
    const database = mongoClient.db('reminders')
    const users = database.collection('users')
    const data = await users.insertOne({
      ...message
    })
    console.log('data', data)
  } catch (error) {
    throw new Error(error)
  }
}


const handle = async (req: any, res: any) => {
  try {
    const body = JSON.parse(JSON.stringify(req.body))
    console.log('body', body)
    // const message = req.body.Body
    const name = req.body.ProfileName
    // const from = req.body.From

    const previousMessages = await getHistory(body.From)
    console.log("previousMessages", previousMessages)
    const response = new MessagingResponse()

    if (Array.isArray(previousMessages) && previousMessages.length < 1) {
      await registerUser(body)
      // register the new user
      // send menu options
    } else if (Array.isArray(previousMessages) && previousMessages.length > 0) {
      const menu = templates.Menu()
      const messageToSend = `
      Olá *${name}*! O que deseja?

      ${menu}
      `
      response.message(messageToSend)
      // verify if last message it was less than an hour ago
    }
    
   
    res.set("Content-Type", "application/xml")
    res.send(response.toString())   
  } catch (error) {
    throw new Error(error)
  }
  
}

export { handle }


