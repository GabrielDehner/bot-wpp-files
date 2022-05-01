import dotenv from 'dotenv'

dotenv.config()
const envVars: any = {
  PORT: process.env.PORT || '8888',
  ENVIRONMENT: process.env.ENVIRONMENT || 'TEST',
}

export const Env = (key: string) => {
  return envVars[key]
}
