import { Client } from "@notionhq/client"

import dotenv from 'dotenv'

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

export async function insertNewTask () {
  try {
    // inserir nova task no notion
  } catch (error) {
    throw new Error(error)
  }
}
