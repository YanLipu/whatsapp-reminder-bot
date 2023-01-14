import dotenv from 'dotenv'
dotenv.config()
const accountSid = process.env.TWILIO_ACCOUNT_SID as string
const authToken = process.env.TWILIO_AUTH_TOKEN as string

console.log('accountSid', accountSid)
console.log('authToken', authToken)

import { Twilio } from 'twilio'

const twilioClient = new Twilio(accountSid, authToken)

export async function handler (): Promise<unknown> {
  try {
    const response = await Promise.all([
      twilioClient.messages.create({
        body: Date.now().toString(),
        from: 'whatsapp:+14155238886',       
        to: 'whatsapp:+556799170828'
      })
    ])
    console.log('response', response)
    return response
  } catch (error) {
    throw new Error(error)
  }
}
