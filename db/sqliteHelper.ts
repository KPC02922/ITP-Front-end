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

export const createTableAsync = async (createTableQuery: string, table?: string) => {
    try {
        await db!.execAsync(createTableQuery)
        Common.writeConsole(TAG, `Table [${table}] created successfully`)
    } catch (error) {
        Common.writeConsole(TAG, `Error creating table [${table}]: ${error}`)
    }
}

export const getAllTableRecords = async (tableName: string, asc: boolean, extra?: string) => {
    try {
        let sql
        if (extra) {
            sql = `SELECT * FROM ${tableName} ${extra}`
        } else {
            sql = `SELECT * FROM ${tableName} ORDER BY id ${asc ? 'ASC' : 'DESC'}`
        }

        const result = await db!.getAllAsync(sql)
        Common.writeConsole(TAG, `Get all records from table ${tableName}`)
        return result
    } catch (error) {
        Common.writeConsole(TAG, `Error getting records from table ${tableName}: ${error}`)
        return []
    }
}

export const getTableRecords = async (tableName: string, condition: string, params: any) => {
    try {
        const sql = `SELECT * FROM ${tableName} WHERE ${condition}`
        const result = await db!.getAllAsync(sql, params)
        Common.writeConsole(TAG, `Get records from table ${tableName} with condition: ${condition}`)
        return result
    } catch (error) {
        Common.writeConsole(TAG, `Error getting records from table ${tableName}: ${error}`)
        return []
    }
}

export const insertRecord = async (tableName: string, columns: string[], values: any[]) => {
    try {
        const placeholders = columns.map(() => '?').join(', ')
        await db!.runAsync(`INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`, values)
        Common.writeConsole(TAG, `Inserted record into table ${tableName} successfully`)
    } catch (error) {
        Common.writeConsole(TAG, `Error inserting record into table ${tableName}: ${error}`)
    }
}

const initTable = async () => {
    try {
        Common.writeConsole(TAG, `Initializing tables...`)
        if (false) {
            await db!.execAsync(`DROP TABLE IF EXISTS ${table.sfExpress}`)
            await db!.execAsync(`DROP TABLE IF EXISTS ${table.jockeyClub}`)
            return
        }

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
                    const storeName = `SF Express (${item.code})`
                    const officeHours = `Weekdays: ${item.weekDayOfficeHours}, Sat: ${item.satOfficeHours}, Sun/Holiday: ${item.sunHolidayOfficeHours}`
                    const latitude = item.latitude
                    const longitude = item.longitude
                    const status = item.status
                    const lastUpdateTime = item.lastUpdateTime

                    db!.runAsync(`INSERT INTO ${table.sfExpress} (id, regionCode, districtCode, code, location, officeHours, storeName, latitude, longitude, status, lastUpdateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                    [id, regionCode, districtCode, code, location, officeHours, storeName, latitude, longitude, status, lastUpdateTime])
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
                    const code = item.code || ''
                    const location = item.location
                    const storeName = `Jockey Club`
                    const officeHours = item.officeHours
                    const latitude = item.latitude
                    const longitude = item.longitude
                    const status = item.status
                    const lastUpdateTime = item.lastUpdateTime

                    db!.runAsync(`INSERT INTO ${table.jockeyClub} (id, regionCode, districtCode, code, location, officeHours, storeName, latitude, longitude, status, lastUpdateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                    [id, regionCode, districtCode, code, location, officeHours, storeName, latitude, longitude, status, lastUpdateTime])
                    .then(() => {
                        Common.writeConsole(TAG, `Inserted Jockey Club record id: ${id} successfully`)
                    })
                    .catch((error) => {
                        Common.writeConsole(TAG, `Error inserting Jockey Club record id: ${id}, error: ${error}`)
                    })
                })
            })
        }

        // Umbrella Rental Temp table
        await createTableAsync(createTable.createUmbrellaRentalTempTable, table.umbrellaRentalTemp)
        const umbrellaRentalTempRecord = await getAllTableRecords(table.umbrellaRentalTemp, true)
        Common.writeConsole(TAG, `Umbrella Rental Temp records from DB: ${JSON.stringify(umbrellaRentalTempRecord)}`)

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