import type { AWS } from '@serverless/typescript'
import { env } from './config/env'

const { prod, staging } = env
const current = process.env.AWS_PROFILE === 'prod' ? prod : staging

const serverlessConfiguration: AWS = {
  service: 'WhatsAppBot',
  useDotenv: true,
  frameworkVersion: '3',
  custom: {
    'serverless-layers': {
      dependenciesPath: './package.json'
    },
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: false
    }
  },
  plugins: [
    'serverless-webpack', 
    'serverless-layers', 
    'serverless-aws-latest-layer-version',
    'serverless-offline'
  ],
  provider: {
    stage: current.stage,
    name: 'aws',
    region: current.region,
    runtime: 'nodejs16.x',
    iam: {
      role: 'arn:aws:iam::016120380681:role/LambdaS3Trainning'
    },
    deploymentBucket: current.deploymentBucket,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1'
    },
    lambdaHashingVersion: '20201221'
  },
  functions: {
    handler: {
      name: 'SendReminder',
      handler: 'src/index.handler',
      events: [
        {
          schedule: {
            rate: ['rate(3 minutes)']
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration
