import MessagingResponse from "twilio/lib/twiml/MessagingResponse"
import Templates from "../templates/messages"
import { User } from "../types/user.type"
import { Collection, Db, MongoClient } from 'mongodb'
import { getDataBase, insertNewTask } from "./notion"
import { TaskPayload } from "../types/notion.type"


class BotManager {
  private templates: Templates
  private incomingUserAndMessages: User
  private mongoDBInstance: MongoClient
  private database: Db
  private userCollection: Collection<any> 
  private responseTwilio: MessagingResponse

  constructor (templates: Templates, mongodb: MongoClient, response: MessagingResponse) {
    this.templates = templates
    this.mongoDBInstance = mongodb
    this.database = this.mongoDBInstance.db('reminders')
    this.userCollection = this.database.collection('users')
    this.responseTwilio = response
  }

  public async handleStage (userData: any): Promise<string> {
    try {
      this.incomingUserAndMessages = userData
      const stage = this.incomingUserAndMessages.stage
      const messagesArrayLength = this.incomingUserAndMessages.messagesArray.length
      let message: any = ''
      switch (stage) {
        case 1: 
          message = await this.sendStartMenu(userData.messagesArray[0].ProfileName)
          break
        case 2:  
          message = await this.handleMessage(userData.messagesArray[messagesArrayLength - 1].Body, stage)
          break
        case 3: 
          message = await this.sendCreateTaskDate(userData.messagesArray[messagesArrayLength - 1].Body)
          break
        case 4: 
          message = await this.sendListOfTasks()
          break
        case 5: 
          message = await this.sendQuestionRecurring(userData.messagesArray[messagesArrayLength - 1].Body)
          break
        case 6: 
          message = await this.handleMessage(userData.messagesArray[messagesArrayLength - 1].Body, stage)
          break
        case 7: 
          message = await this.handleMessage(userData.messagesArray[messagesArrayLength - 1].Body, stage)
          break
        case 8: 
          message = await this.sendEndRecurring(userData.messagesArray[messagesArrayLength - 1].Body)
          break
        default:
          break
      }
      return message
    } catch (error) {
      throw new Error(error)
    }
  }

  private async handleMessage (message: string, stage: number): Promise<string> {
    if (stage === 2) {
      if (message === '1' || message.toLowerCase() === 'criar') {
        await this.userCollection.updateOne({
          from: this.incomingUserAndMessages.from,
          to: this.incomingUserAndMessages.to
        }, {
          $set: {
            stage: 3
          }
        })
        return this.templates.createTaskName()
      } else if (message === '2' || message.toLowerCase() === 'listar') {
        await this.userCollection.updateOne({
          from: this.incomingUserAndMessages.from,
          to: this.incomingUserAndMessages.to
        }, {
          $set: {
            stage: 1
          }
        })
        const listOfTasks = await this.sendListOfTasks()
        return this.templates.listTasks(listOfTasks)
      }
    } else if (stage === 6) {
      if (message === 'Sim') {
        await this.userCollection.updateOne({
          from: this.incomingUserAndMessages.from,
          to: this.incomingUserAndMessages.to
        }, {
          $set: {
            stage: 8,
            recurrent: true
          }
        })
        return this.templates.createRecurringEnd()
      } else {
        await this.userCollection.updateOne({
          from: this.incomingUserAndMessages.from,
          to: this.incomingUserAndMessages.to
        }, {
          $set: {
            stage: 7,
            recurrent: false
          }
        })
        return this.templates.createTaskSuccess()
      }
    } else if (stage === 7) {
      if (message === '1' || message.toLowerCase() === 'sim') {
        await this.userCollection.updateOne({
          from: this.incomingUserAndMessages.from,
          to: this.incomingUserAndMessages.to
        }, {
          $set: {
            stage: 3
          }
        })
        const taskPayload = this.treatUserData(this.incomingUserAndMessages)
        await insertNewTask(taskPayload)
        return this.templates.createTaskName()
      } else {
        await this.userCollection.updateOne({
          from: this.incomingUserAndMessages.from,
          to: this.incomingUserAndMessages.to
        }, {
          $set: {
            stage: 1
          }
        })
        const taskPayload = this.treatUserData(this.incomingUserAndMessages)
        await insertNewTask(taskPayload)
        return this.templates.endTaskCreation()
      }
    }
    return this.templates.createTaskError()
  }

  private async sendStartMenu (name: string): Promise<string> {
    try {
      await this.userCollection.updateOne({
        from: this.incomingUserAndMessages.from,
        to: this.incomingUserAndMessages.to
      }, {
        $set: {
          stage: 2
        }
      })
      return this.templates.Menu(name)
    } catch (error) {
      throw new Error(error)
    }
  }

  private async sendCreateTaskDate (nameTask: string): Promise<string> {
    try {
      await this.userCollection.updateOne({
        from: this.incomingUserAndMessages.from,
        to: this.incomingUserAndMessages.to
      }, {
        $set: {
          stage: 5,
          nameTask: nameTask
        }
      })
      return this.templates.createTaskDate()
    } catch (error) {
      throw new Error(error)
    }
  }

  private async sendListOfTasks (): Promise<string> {
    try {
      const response = await getDataBase()
      const database = response.results.map(item => item)
      const taskList = database.filter((item: any)=>{
        if (
          item.properties.Status.select && 
          item.properties.Status.select.name === 'To Do') {
          return item
        }
      })
      let message = ''
      taskList.forEach((item:any, index: number)=>{
        message += `*Task ${index + 1}*: ${item.properties.Name.title[0].plain_text}\n`
      })
      return message.toString()
    } catch (error) {
      throw new Error(error)
    }
  }

  private async sendQuestionRecurring (data: string): Promise<string> {
    try {
      await this.userCollection.updateOne({
        from: this.incomingUserAndMessages.from,
        to: this.incomingUserAndMessages.to
      }, {
        $set: {
          stage: 6,
          dateStart: data
        }
      })
      return this.templates.createRecurringAsk()
    } catch (error) {
      throw new Error(error)
    }
  }

  private async sendEndRecurring (data: string): Promise<string> {
    try {      
      await this.userCollection.updateOne({
        from: this.incomingUserAndMessages.from,
        to: this.incomingUserAndMessages.to
      }, {
        $set: {
          stage: 7,
          dateEnd: data
        }
      })
      return this.templates.createTaskSuccess()
    } catch (error) {
      throw new Error(error)
    }
  }

  private treatUserData (data: User): TaskPayload {
    const todayDate = new Date()
    const isoString = todayDate.toISOString()
    const today = isoString.split('T')
    const dateStart = data.dateStart ? data.dateStart.replace(/\//g, "-") : today[0]
    const dateEnd = data.dateEnd ? data.dateEnd.replace(/\//g, "-") : today[0]
    const taskData = {
      dateStart,
      dateEnd,
      nameTask: data.nameTask ? data.nameTask : '',
      recurrent: data.recurrent ? data.recurrent : false
    }
    return taskData
  }
}

export default BotManager
