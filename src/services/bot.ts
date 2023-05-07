import MessagingResponse from "twilio/lib/twiml/MessagingResponse"
import Templates from "../templates/messages"
import { User } from "../types/user.type"
import { Collection, Db, MongoClient } from 'mongodb'
import { getDataBase } from "./notion"


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
        case 1: // envia o menu e altera o stage pra 2
          message = await this.sendStartMenu(userData.messagesArray[0].ProfileName)
          break
        case 2:  // verifica a opcao digitada e altera o stage para 3 ou 4
          message = await this.handleMessage(userData.messagesArray[messagesArrayLength - 1].Body, stage)
          break
        case 3: // salva o nome da task, pergunta a data e altera o stage para 5
          message = await this.sendCreateTaskDate(userData.messagesArray[messagesArrayLength - 1].Body)
          break
        case 4: // lista as tasks e altera o stage para 1
          message = await this.sendListOfTasks()
          break
        case 5: // salva a data, pergunta se é recorrente e altera o stage para 6
          message = await this.sendQuestionRecurring(userData.messagesArray[messagesArrayLength - 1].Body)
          break
        case 6: // verifica se é recorrente, e altera o stage para 7 ou 8
          message = await this.handleMessage(userData.messagesArray[messagesArrayLength - 1].Body, stage)
          break
        case 7: // não é recorrente, manda mensagem se quer criar nova task, altera o stage para 10
          message = await this.handleMessage(userData.messagesArray[messagesArrayLength - 1].Body, stage)
          break
        case 8: // salva a data de final e altera o stage para 9
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
        // setar stage para 3
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
        // setar stage para 4
        await this.userCollection.updateOne({
          from: this.incomingUserAndMessages.from,
          to: this.incomingUserAndMessages.to
        }, {
          $set: {
            stage: 4
          }
        })
        return this.templates.listTasks()
      }
    } else if (stage === 6) {
      if (message === 'Sim') {
        await this.userCollection.updateOne({
          from: this.incomingUserAndMessages.from,
          to: this.incomingUserAndMessages.to
        }, {
          $set: {
            stage: 8
          }
        })
        return this.templates.createRecurringEnd()
      } else {
        await this.userCollection.updateOne({
          from: this.incomingUserAndMessages.from,
          to: this.incomingUserAndMessages.to
        }, {
          $set: {
            stage: 7
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
      const taskList = response.results.map(item => item)
      console.log('taskList', taskList)
      // pegar lista de tasks do notion
      // estruturar mensagem
      // alterar o stage para 1
      return taskList.toString()
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

  // private async sendSuccessMessage (): Promise<string> {
  //  try {
  //    await this.userCollection.updateOne({
  //      from: this.incomingUserAndMessages.from,
  //      to: this.incomingUserAndMessages.to
  //    }, {
  //      $set: {
  //        stage: 1
  //      }
  //    })
  //    return this.templates.endTaskCreation()
  //  } catch (error) {
  //    throw new Error(error)
  //  }
  // }

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
}

export default BotManager
