# Welcome to Whatsapp Reminder Bot step-by-step guide

This is a automated To Do List that integrate an Whatsapp Bot using **Twilio** to **Notion API**. You can creates tasks in a predefined Notion template and get notified on Whatsapp at date scheduled.

In this Readme I will guide you how to run the application.

## Steps

1. [Setup Developer Accounts](#1st)
   1. Setup Twilio Account
   2. Setup NotionAPI Account
   3. Setup MongoDB Atlas Account
2. [Clone the Notion template](#2nd)
3. [Create a connection with Notion](3rd)
4. [Setup Twilio Webhook](#4th)

## 1st step

First, you should create accounts as developer in the mentioned platforms. The first one is the Twilio.

To create a developer at Twilio account you can follow these [docs](https://www.twilio.com/docs/whatsapp/tutorial/connect-number-business-profile).

In Notion you can create a developer access using the [Get Started](https://developers.notion.com/) page.

The last one is MongoDB Atlas, the cloud of Mongo DB. You can start [here](https://www.mongodb.com/docs/atlas/getting-started/).

## 2nd step

You need to duplicate the Notion template of To Do List in the link below:

[To Do List template](https://chambray-poppy-2cb.notion.site/35ec4d10a71e4290bdf647e9c6316e62?v=10407c6be72d4dbb8cbd7728406e7e6e).

## 3rd step

To use this template as a database for our bot, you need to create a connection. [Start here](https://www.notion.so/integrations).

Add the new connection created to you template.

## 4th step
