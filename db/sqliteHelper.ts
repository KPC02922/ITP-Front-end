import { tag, table } from '../components/tag'
import * as Common from '../common'
import * as SQLite from 'expo-sqlite'
import { useEffect, useState } from 'react'
import { createTable } from './createTable'
import * as apiHelper from '../api/apiHealper'

const TAG = tag.sqliteHelper
let db: SQLite.SQLiteDatabase

export const initDb = async () => {
    try {
        Common.writeConsole(TAG, 'Initializing database...')
        db = await SQLite.openDatabaseAsync('itp001.db')
        await initTable()
    } 
    catch (error) {
        Common.writeConsole(TAG, `Error initializing database: ${error}`)
    }
}

const initTable = async () => {
    try {
        Common.writeConsole(TAG, `Initializing tables...`)
        
        // SF Express table
        await db!.execAsync(createTable.createSfExpressTable)
        const SfExpressResult = await db!.getFirstAsync(`SELECT * FROM ${table.sfExpress} LIMIT 1`)
        Common.writeConsole(TAG, `Check table ${table.sfExpress} result: ${JSON.stringify(SfExpressResult)}`)
        if (!SfExpressResult) {
            apiHelper.getSfExpressLocation().then(rs => {
                const data: any[] = rs.data || []
                Common.writeConsole(TAG, `Inserting SF Express data: ${JSON.stringify(data)}`)
                data.forEach((item) => {
                    const id = item.id
                    const regionCode = item.regionCode
                    const districtCode = item.districtCode
                    const code = item.code
                    const location = item.location
                    const weekDayOfficeHours = item.weekDayOfficeHours
                    const satOfficeHours = item.satOfficeHours
                    const sunHolidayOfficeHours = item.sunHolidayOfficeHours
                    const latitude = item.latitude
                    const longitude = item.longitude
                    const status = item.status
                    const lastUpdateTime = item.lastUpdateTime

                    db!.runAsync(`INSERT INTO ${table.sfExpress} (id, regionCode, districtCode, code, location, weekDayOfficeHours, satOfficeHours, sunHolidayOfficeHours, latitude, longitude, status, lastUpdateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                    [id, regionCode, districtCode, code, location, weekDayOfficeHours, satOfficeHours, sunHolidayOfficeHours, latitude, longitude, status, lastUpdateTime])
                    .then(() => {
                        Common.writeConsole(TAG, `Inserted SF Express record id: ${id} successfully`)
                    })
                    .catch((error) => {
                        Common.writeConsole(TAG, `Error inserting SF Express record id: ${id}, error: ${error}`)
                    })
                })
            })
        }

        // Jockey Club table
        await db!.execAsync(createTable.createJockeyClubTable)
        const JockeyClubResult = await db!.getFirstAsync(`SELECT * FROM ${table.jockeyClub} LIMIT 1`)
        Common.writeConsole(TAG, `Check table ${table.jockeyClub} result: ${JSON.stringify(JockeyClubResult)}`)
        if (!JockeyClubResult) {
            apiHelper.getJockeyClubLocation().then(rs => {
                const data: any[] = rs.data || []
                Common.writeConsole(TAG, `Inserting Jockey Club data: ${JSON.stringify(data)}`)
                data.forEach((item) => {
                    const id = item.id
                    const regionCode = item.regionCode
                    const districtCode = item.districtCode
                    const location = item.location
                    const officeHours = item.officeHours
                    const latitude = item.latitude
                    const longitude = item.longitude
                    const status = item.status
                    const lastUpdateTime = item.lastUpdateTime

                    db!.runAsync(`INSERT INTO ${table.jockeyClub} (id, regionCode, districtCode, location, officeHours, latitude, longitude, status, lastUpdateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                    [id, regionCode, districtCode, location, officeHours, latitude, longitude, status, lastUpdateTime])
                    .then(() => {
                        Common.writeConsole(TAG, `Inserted Jockey Club record id: ${id} successfully`)
                    })
                    .catch((error) => {
                        Common.writeConsole(TAG, `Error inserting Jockey Club record id: ${id}, error: ${error}`)
                    })
                })
            })
        }

        Common.writeConsole(TAG, 'Tables initialized successfully')
    } catch (error) {
        Common.writeConsole(TAG, `Error initializing tables: ${error}`)
    }
}

const checkTableExists = async (tableName: string) => {
    const result = await db!.getFirstAsync(
    "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
    [tableName]
  )
  return result !== null
}