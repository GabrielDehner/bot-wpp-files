import { Client } from 'whatsapp-web.js'

export default class ClientWhatsappService {
  public client: Client
  public isReady = false

  constructor() {
    this.client = new Client({})
    this.client.initialize()
  }

  public async getQr() {
    return new Promise((resolve, reject) => {
      this.client.on('qr', (qr: string) => {
        resolve(qr)
      })
    })
  }

  public async ready(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.on('ready', () => {
        console.log('Client is ready!')
        resolve(true)
      })
      setTimeout(() => {
        resolve(false)
      }, 7500)
    })
  }

  public async sendMessage(number: string, msg: string) {
    try {
      const numberDetails: any = await this.client.getNumberId(number) // get mobile number details
      const sendMessageData = await this.client.sendMessage(numberDetails?._serialized, msg) // send message
      console.info(`Message to client ${number} is OK.`)
    } catch (err: any) {
      console.log(err.message)
    }
  }

  public message() {
    this.client.on('message', (msg: any) => {
      if (msg.body == '!ping') {
        msg.reply('pong')
      }
    })
  }
}
