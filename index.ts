import express from 'express'
import { Env } from './src/configs/config'
import path from 'path'
import multer from 'multer'
import fs from 'fs'
import qrcode from 'qrcode-terminal'
import ClientWhatsappService from './src/services/ClientWhatsappService'
import { getMessage } from './src/services/MessageService'
import { proccessFile } from './src/services/ProccessFileService'
import { NameAndPhone } from './src/models/NameAndPhoneInterface'

const clientWhatsappService = new ClientWhatsappService()

const upload = multer({ dest: 'tmp/csv/' })
const app = express()
const router = express.Router()
app.use('/', express.static(path.join(__dirname, './src/views')))
app.use(express.json())

router.post('/send-message', upload.single('file'), async (req: any, response) => {
    if (!clientWhatsappService.isReady) {
        response.json(false)
        await fs.unlinkSync(req.file.path)
        return
    }
    const pathFile = path.join(__dirname, './src/configs/MessageDefault.txt')
    const file = await fs.readFileSync(pathFile, {
        encoding: 'utf8',
        flag: 'r',
    })
    const arrayToSendMessage: NameAndPhone[] = await proccessFile(req.file.path)
    for (const element of arrayToSendMessage) {
        await clientWhatsappService.sendMessage(`54${element.phone}`, getMessage(element.name, file))
    }
    response.json(true)
})

router.get('/message', async (req: any, response) => {
    const pathFile = path.join(__dirname, './src/configs/MessageDefault.txt')
    const file = await fs.readFileSync(pathFile, {
        encoding: 'utf8',
        flag: 'r',
    })
    response.json(file)
})

router.put('/message', async (req: any, response) => {
    if (!req.body.message) return
    const pathFile = path.join(__dirname, './src/configs/MessageDefault.txt')
    await fs.writeFileSync(pathFile, req.body.message)
    response.json(true)
})

app.use('', router)
app.listen(Env('PORT'), async () => {
    console.log('Server running in port ' + Env('PORT'))
    clientWhatsappService.client.on('qr', (qr: string) => {
        console.log('Obtener Qr')
        qrcode.generate(qr, { small: true })
    })
    clientWhatsappService.client.on('ready', () => {
        clientWhatsappService.isReady = true
        console.log('El cliente ya esta configurado...')
    })
})
