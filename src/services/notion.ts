import { Client } from "@notionhq/client"

import dotenv from 'dotenv'
import { TaskPayload } from "../types/notion.type"

dotenv.config()

const notion = new Client({
  auth: process.env.NOTION_KEY
})

const databaseName: string = process.env.NOTION_DATABASEID as string

export async function getDataBase () {
  try {
    const response = await notion.databases.query({
      database_id: databaseName
    })
    return response 
  } catch (error) {
    throw new Error(error)
  }
}

export async function insertNewTask (payload: TaskPayload) {
  try {
    console.log('insertNewTask', payload)
    const response = await notion.pages.create({
      parent: {
        database_id: databaseName,
        type: 'database_id'
      },
      properties: {
        Name: {
          title: [
            {
              type: 'text',
              text: {
                content: payload.nameTask
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default"
              }
            }
          ]
        },
        'Date of Reminder': {
          type: 'date',
          date: {
            start: payload.dateStart,
            end: payload.dateEnd,
            time_zone: null
          }
        },
        Status: {
          type: 'select',
          select: {
            id: '1',
            name: 'To Do',
            color: 'red'
          }
        },
        'Recurring Reminder': {
          type: 'checkbox',
          checkbox: payload.recurrent
        }
      }
    })
    console.log('response', response)
    // inserir nova task no notion
    return response
  } catch (error) {
    console.log('error', error)
    throw new Error(error)
  }
}
