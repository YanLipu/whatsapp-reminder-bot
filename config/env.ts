export const env = {
  staging: {
    stage: 'staging',
    region: 'us-east-1',
    deploymentBucket: 'reminders.bucket'
  },
  prod: {
    stage: 'prod',
    region: 'us-east-1',
    deploymentBucket: 'reminders.bucket'
  }
} as const
