import { getDataBase } from "./notion"
import { Twilio } from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID as string
const authToken = process.env.TWILIO_AUTH_TOKEN as string

const from = process.env.TWILIO_FROM as string
const to = process.env.TWILIO_TO as string

const twilio = new Twilio(accountSid, authToken)

class Job {
  private database: any
  private todayTasks: any
  private bodyForTodayTasks: any
  private bodyForAllTasks: any
  private allTasksToDo: any

  public async run () {
    try {
      return await this.sendTaskToWhatsApp()
    } catch (error) {
      throw new Error(error)
    }
  }

  private async sendTaskToWhatsApp () {
    try {
      this.database = await this.getNotionTasks()

      this.todayTasks = await this.getTodayTasks()

      this.bodyForTodayTasks = this.generateBodyForTodayTasks()
      
      this.allTasksToDo = this.getAllToDoTasks()

      this.bodyForAllTasks = this.generateBodyForAllTasksToDo()
      await this.sendMessages()
      return true
    } catch (error) {
      throw new Error(error)
    }
  }

  private async getNotionTasks () {
    try {
      const response = await getDataBase()

      const taskList = response.results.map(item => item)
      return taskList
    } catch (error) {
      throw new Error(error)
    }
  }

  private async getTodayTasks () {
    try {
      const todayDate = new Date()
      const isoString = todayDate.toISOString()
      const tasks = this.database.filter((item: any)=>{
        if (item.properties['Date of Reminder'].date) {
          const today = isoString.split('T')
          const startDayFromDate = item.properties['Date of Reminder'].date.start

          if (today[0] === startDayFromDate) {
            return item
          }
        }
      })
      return tasks
    } catch (error) {
      throw new Error(error)
    }
  }

  private generateBodyForTodayTasks () {
    try {
      let message = `Lembrete diário.\n\n`

      const tasksLength = this.todayTasks.length

      message += `Hoje você possui *${tasksLength}* tasks.\n\n`
      for (let i = 0; i < this.todayTasks.length; i++) {
        const element = this.todayTasks[i]
        const taskName = element.properties.Name.title[0].plain_text

        message += `*Task ${i + 1}*: ${taskName}\n\n`
      }
      return message
    } catch (error) {
      throw new Error(error)
    }
  }

  private generateBodyForAllTasksToDo () {
    try {
      const message = `
        Ao todo você tem *${this.allTasksToDo.length + 1}* tasks para completar.`
      return message
    } catch (error) {
      throw new Error(error)
    }
  }

  private getAllToDoTasks () {
    try {
      const toDo = this.database.filter((item:any)=>{
        if (
          item.properties.Status.select && 
          item.properties.Status.select.name === 'To Do') {
          return item
        }
      })
      return toDo
    } catch (error) {
      throw new Error(error)
    }
  }

  private async sendMessages (): Promise<void> {
    try {
      await twilio.messages.create({
        body: this.bodyForTodayTasks,
        from: from,       
        to: to
      })
      await twilio.messages.create({
        body: this.bodyForAllTasks,
        from: from,       
        to: to
      })
    } catch (error) {
      throw new Error(error)
    }
  }
}

export { Job }
