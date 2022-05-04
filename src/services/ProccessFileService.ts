import { Env } from '../configs/config'
import { NameAndPhone } from '../models/NameAndPhoneInterface'
import fs from 'fs'
import xlsx from 'node-xlsx'


export const proccessFile = async (pathName: string): Promise<NameAndPhone[]> => {
  return new Promise((resolve, reject) => {
    fs.readFile(pathName, 'utf-8', async (err: any, data: any) => {
      if (err) {
        console.log(err)
      } else {
        try {
          const procInRow = data.replace(/"\n;/g, '"#row#;').split('#row#')
          const procInColumn = procInRow.map((element: string) => {
            const split = element.split(';')
            let i = 0
            for (const spl of split) {
              split[i] = spl.replace(/"/g, '')
              i++
            }
            return split
          })
          const dataProccesed = proccessFormatRow(procInColumn)
          await fs.unlinkSync(pathName)
          resolve(dataProccesed)
        } catch (err: any) {
          console.log('Error in process file... ', err.message)
          resolve([])
        }
      }
    })
  })
}

const filterNameAndPhone = (array: string[][]): NameAndPhone[] => {
  const arrayWithProperties = []
  let i = 0
  for (const row of array) {
    arrayWithProperties[arrayWithProperties.length] = {
      name: row?.[1] || '',
      phone: row?.[2] || '',
    }
    i++
  }
  return arrayWithProperties
}


export const proccessFileXls = async (pathName: string): Promise<NameAndPhone[]> => {
  return new Promise((resolve, reject) => {
    console.log("llego")
    const objectXls = xlsx.parse(pathName); // parses a file
    const data = objectXls?.[0].data as string[][]
    const dataProcessed = proccessFormatRow(data)
    fs.unlinkSync(pathName)
    resolve(dataProcessed)

  })
}

const proccessFormatRow = (data: string[][])=>{
  const filterArray = filterNameAndPhone(data)
  filterArray.forEach((element) => {
    element.name = element.name.split('\n')[1]
    element.phone = element.phone.split('\n')[1]
    element.phone = element.phone.split(' ')[0].replace('-', '')
    if (element.phone[0] === '5' && element.phone[1] === '4') {
      element.phone = element.phone.substring(2)
    }
    if (
      element.phone[0] === '1' &&
      element.phone[1] === '5' &&
      element.phone[2] === '4' &&
      element.phone.length === 9
    ) {
      element.phone = element.phone.substring(2)
      element.phone = `376${element.phone}`
    }

    if (Env('ENVIRONMENT') === 'TEST') {
      element.phone = `3764639284`
    }
  })
  const lastProcessArray = filterArray.filter((elem) => elem.name && elem.phone)
  return lastProcessArray
}