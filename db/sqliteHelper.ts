import { tag, table } from '../components/tag'
import * as Common from '../common'
import * as SQLite from 'expo-sqlite'
import { useEffect, useState } from 'react'
import { createTable } from './createTable'

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
        
        await db!.execAsync(createTable.createSfExpressTable)
        checkTableExists(table.sfExpress).then(exists => {
            if (exists) {
                Common.writeConsole(TAG, `Table ${table.sfExpress} exists.`)
            } else {
                Common.writeConsole(TAG, `Table ${table.sfExpress} does not exist.`)
            }
        })

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