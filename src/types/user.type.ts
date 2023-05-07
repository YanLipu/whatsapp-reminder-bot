export interface User{
  _id: any
  from: string
  to: string
  messagesArray: MessageBody[]
  stage: number
  name: string
  nameTask?: string
  dateStart?: string
  dateEnd?: string
  recurrent?: boolean
}

export interface MessageBody {
  SmsMessageSid: string
  NumMedia: string
  ProfileName: string
  SmsSid: string
  WaId: string
  SmsStatus: string
  Body: string
  To: string
  NumSegments: string
  ReferralNumMedia: string
  MessageSid: string
  AccountSid: string
  From: string
  ApiVersion: string
  Stage?: number
}
