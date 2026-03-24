import { tag, table } from '../../components/tag'
import * as Common from '../../common'
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
        Common.writeConsole(TAG, `[initDb] Error initializing database: ${error}`)
    }
}

export const createTableAsync = async (createTableQuery: string, table?: string) => {
    try {
        await db!.execAsync(createTableQuery)
        Common.writeConsole(TAG, `Table [${table}] created successfully`)
    } catch (error) {
        Common.writeConsole(TAG, `[createTableAsync] Error creating table [${table}]: ${error}`)
    }
}

export const getAllTableRecords = async (tableName: string, asc: boolean, order?: string) => {
    try {
        let sql
        if (order) {
            sql = `SELECT * FROM ${tableName} ${order}`
        } else {
            sql = `SELECT * FROM ${tableName} ORDER BY sysId ${asc ? 'ASC' : 'DESC'}`
        }

        const result = await db!.getAllAsync(sql)
        Common.writeConsole(TAG, `Get all records from table ${tableName}`)
        return result
    } catch (error) {
        Common.writeConsole(TAG, `[getAllTableRecords] Error getting records from table ${tableName}: ${error}`)
        return []
    }
}

export const getTableRecords = async (tableName: string, condition: string, params: any, order?: string) => {
    try {
        const sql = `SELECT * FROM ${tableName} WHERE ${condition} ${order ? order : ''}`
        Common.writeConsole(TAG, `Get records from table ${tableName} | sql: ${sql} | params: ${JSON.stringify(params)}`)
        const result = await db!.getAllAsync(sql, params)
        return result
    } catch (error) {
        Common.writeConsole(TAG, `[getTableRecords] Error getting records from table ${tableName}: ${error}`)
        return []
    }
}

export const getAllTableRecordsByDistance = async (tableName: string, latitude: number, longitude: number, order?: string) => {
    try {
        const sql = `SELECT *, ( (latitude - ?) * (latitude - ?) ) + ( (longitude - ?) * (longitude - ?) ) AS distance FROM ${tableName} ORDER BY distance ASC ${order ? order : ''}`
        const result = await db!.getAllAsync(sql, [latitude, latitude, longitude, longitude])
        Common.writeConsole(TAG, `Get records from table ${tableName} by distance with latitude: ${latitude}, longitude: ${longitude}`)
        return result
    }
    catch (error) {
        Common.writeConsole(TAG, `[getAllTableRecordsByDistance] Error getting records from table ${tableName} by distance: ${error}`)
        return []
    }
}

export const getTableRecordsByDistance = async (tableName: string, latitude: number, longitude: number, condition: string, params: any[], order?: string) => {
    try {
        let sql
        let sqlParams = [latitude, latitude, longitude, longitude, ...params]
        if (condition) {
            sql = `SELECT *, ( (latitude - ?) * (latitude - ?) ) + ( (longitude - ?) * (longitude - ?) ) AS distance FROM ${tableName} WHERE ${condition} ORDER BY distance ASC ${order ? order : ''}`
        } else {
            sql = `SELECT *, ( (latitude - ?) * (latitude - ?) ) + ( (longitude - ?) * (longitude - ?) ) AS distance FROM ${tableName} ORDER BY distance ASC ${order ? order : ''}`
        }
        const result = await db!.getAllAsync(sql, sqlParams)
        Common.writeConsole(TAG, `Get records from table ${tableName} by distance with latitude: ${latitude}, longitude: ${longitude}`)
        return result
    }
    catch (error) {
        Common.writeConsole(TAG, `[getTableRecordsByDistance] Error getting record from table ${tableName} by distance: ${error}`)
        return []
    }
}

export const insertRecord = async (tableName: string, columns: string[], values: any[]) => {
    try {
        const placeholders = columns.map(() => '?').join(', ')
        await db!.runAsync(`INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`, values)
        Common.writeConsole(TAG, `Inserted record into table ${tableName} successfully`)
    } catch (error) {
        Common.writeConsole(TAG, `[insertRecord] Error inserting record into table ${tableName}: ${error}`)
    }
}

export const updateRainfallReport = async () => {
    Common.writeConsole(TAG, `Updating Rainfall Report...`)
    const rainfallReportResult = await db!.getFirstAsync(`SELECT * FROM ${table.rainfallReport} LIMIT 1`)
    const rainfallReportCountResult = await apiHelper.getRainfallReportCount()
    const prevRainfallReportCount = parseInt(await Common.AsyncGetData(tag.rainfallReportCount, "1") as any)
    let getRainfallReportId = 1
    if (prevRainfallReportCount > 1) {
        getRainfallReportId = rainfallReportCountResult > prevRainfallReportCount ? rainfallReportCountResult - 1 : prevRainfallReportCount
    }
    Common.writeConsole(TAG, `Rainfall Report count from API: ${rainfallReportCountResult}, previous count from storage: ${prevRainfallReportCount}, get rainfall report id: ${getRainfallReportId}`)

    if (!rainfallReportResult || rainfallReportCountResult > prevRainfallReportCount) {
        apiHelper.getRainfallReport(getRainfallReportId).then(rs => {
            const data: any[] = rs.data || []
            Common.AsyncStoreData(tag.rainfallReportCount, rainfallReportCountResult.toString())
            Common.writeConsole(TAG, `Inserting Rainfall Report data: ${JSON.stringify(data)}`)
            data.forEach((item) => {
                const id = item.id
                const regionCode = item.regionCode
                const districtCode = item.districtCode
                const location = item.location
                const latitude = item.latitude
                const longitude = item.longitude
                const rate = item.rate
                const postTime = item.postTime
                const status = item.status
                const updateTime = item.updateTime

                db!.runAsync(`INSERT INTO ${table.rainfallReport} (id, regionCode, districtCode, location, latitude, longitude, rate, postTime, status, updateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                [id, regionCode, districtCode, location, latitude, longitude, rate, postTime, status, updateTime])
                .then(() => {
                    Common.writeConsole(TAG, `Inserted Rainfall Report record id: ${id} successfully`)
                })
                .catch((error) => {
                    Common.writeConsole(TAG, `[updateRainfallReport] Error inserting Rainfall Report record id: ${id}, error: ${error}`)
                })
            })
        })
    }
}

export const updateFloodingReport = async () => {
    Common.writeConsole(TAG, `Updating Flooding Report...`)
    const floodingReportResult = await db!.getFirstAsync(`SELECT * FROM ${table.floodingReport} LIMIT 1`)
    const floodingReportCountResult = await apiHelper.getFloodingReportCount()
    const prevFloodingReportCount = parseInt(await Common.AsyncGetData(tag.floodingReportCount, "1") as any)
    let getFloodingReportId = 1
    if (prevFloodingReportCount > 1) {
        getFloodingReportId = floodingReportCountResult > prevFloodingReportCount ? floodingReportCountResult - 1 : prevFloodingReportCount
    }

    Common.writeConsole(TAG, `Flooding Report count from API: ${floodingReportCountResult}, previous count from storage: ${prevFloodingReportCount}, get flooding report id: ${getFloodingReportId}`)

    if (!floodingReportResult || floodingReportCountResult > prevFloodingReportCount) {
        apiHelper.getFloodingReport(getFloodingReportId).then(rs => {
            const data: any[] = rs.data || []
            Common.AsyncStoreData(tag.floodingReportCount, floodingReportCountResult.toString())
            Common.writeConsole(TAG, `Inserting Flooding Report data: ${JSON.stringify(data)}`)
            data.forEach((item) => {
                const id = item.id
                const regionCode = item.regionCode
                const districtCode = item.districtCode
                const location = item.location
                const latitude = item.latitude
                const longitude = item.longitude
                const postTime = item.postTime
                const status = item.status
                const updateTime = item.updateTime

                db!.runAsync(`INSERT INTO ${table.floodingReport} (id, regionCode, districtCode, location, latitude, longitude, postTime, status, updateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                [id, regionCode, districtCode, location, latitude, longitude, postTime, status, updateTime])
                .then(() => {
                    Common.writeConsole(TAG, `Inserted Flooding Report record id: ${id} successfully`)
                })
                .catch((error) => {
                    Common.writeConsole(TAG, `[updateFloodingReport] Error inserting Flooding Report record id: ${id}, error: ${error}`)
                })
            })
        })
    }
}

export const updateOtherStoreReport = async () => {
    Common.writeConsole(TAG, `Updating Other Store Report...`)
    const otherStoreReportResult = await db!.getFirstAsync(`SELECT * FROM ${table.otherStore} LIMIT 1`)
    const otherStoreReportCountResult = await apiHelper.getOtherStoreReportCount()
    const prevOtherStoreReportCount = parseInt(await Common.AsyncGetData(tag.otherStoreReportCount, "1") as any)
    let getOtherStoreReportId = 1
    if (prevOtherStoreReportCount > 1) {
        getOtherStoreReportId = otherStoreReportCountResult > prevOtherStoreReportCount ? otherStoreReportCountResult - 1 : prevOtherStoreReportCount
    }
    
    Common.writeConsole(TAG, `Other Store Report count from API: ${otherStoreReportCountResult}, previous count from storage: ${prevOtherStoreReportCount}, get other store report id: ${getOtherStoreReportId}`)
    
    if (!otherStoreReportResult || otherStoreReportCountResult > prevOtherStoreReportCount) {
        apiHelper.getOtherStoreReport(getOtherStoreReportId).then(rs => {
            const data: any[] = rs.data || []
            Common.AsyncStoreData(tag.otherStoreReportCount, otherStoreReportCountResult.toString())
            Common.writeConsole(TAG, `Inserting Other Store Report data: ${JSON.stringify(data)}`)
            data.forEach((item) => {
                const id = item.id
                const regionCode = item.regionCode
                const districtCode = item.districtCode
                const code = item.code || ''
                const location = item.location
                const storeName = item.storeName
                const officeHours = item.officeHours
                const latitude = item.latitude
                const longitude = item.longitude
                const status = item.status
                const lastUpdateTime = item.lastUpdateTime

                db!.runAsync(`INSERT INTO ${table.otherStore} (id, regionCode, districtCode, code, location, officeHours, storeName, latitude, longitude, status, lastUpdateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                [id, regionCode, districtCode, code, location, officeHours, storeName, latitude, longitude, status, lastUpdateTime])
                .then(() => {
                    Common.writeConsole(TAG, `Inserted Other Store Report record id: ${id} successfully`)
                })
                .catch((error) => {
                    Common.writeConsole(TAG, `Error inserting Other Store Report record id: ${id}, error: ${error}`)
                })

                db!.runAsync(`INSERT INTO ${table.umbrellaRentalTemp} (id, regionCode, districtCode, code, location, officeHours, storeName, latitude, longitude, status, lastUpdateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
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

}

const initTable = async () => {
    try {
        Common.writeConsole(TAG, `Initializing tables...`)
        if (false) {
            // await db!.execAsync(`DROP TABLE IF EXISTS ${table.rainfallReport}`)
            // Common.AsyncStoreData(tag.rainfallReportCount, '1')

            // await db!.execAsync(`DROP TABLE IF EXISTS ${table.otherStore}`)
            // Common.AsyncStoreData(tag.otherStoreReportCount, '1')

            await db!.execAsync(`DROP TABLE IF EXISTS ${table.floodingReport}`)
            Common.AsyncStoreData(tag.floodingReportCount, '1')
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
                        Common.writeConsole(TAG, `[updateSfExpress] Error inserting SF Express record id: ${id}, error: ${error}`)
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
                        Common.writeConsole(TAG, `[updateJockeyClub] Error inserting Jockey Club record id: ${id}, error: ${error}`)
                    })
                })
            })
        }

        // Other store table
        await createTableAsync(createTable.createOtherStoreTable, table.otherStore)
        updateOtherStoreReport()

        // Umbrella Rental Temp table
        await createTableAsync(createTable.createUmbrellaRentalTempTable, table.umbrellaRentalTemp)
        const umbrellaRentalTempRecord = await getAllTableRecords(table.umbrellaRentalTemp, true)
        Common.writeConsole(TAG, `Umbrella Rental Temp records from DB: ${JSON.stringify(umbrellaRentalTempRecord)}`)

        // Rainfall Report table
        await createTableAsync(createTable.createRainfallReportTable, table.rainfallReport)
        updateRainfallReport()

        // Flooding Report table
        await createTableAsync(createTable.createFloodingReportTable, table.floodingReport)
        updateFloodingReport()

        Common.writeConsole(TAG, 'Tables initialized successfully')
    } catch (error) {
        Common.writeConsole(TAG, `[initDb] Error initializing tables: ${error}`)
    }
}

const checkTableExists = async (tableName: string) => {
    const result = await db!.getFirstAsync(
    "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
    [tableName]
  )
  return result !== null
}
