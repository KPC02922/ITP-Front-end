import * as Common from "@/common"
import { tag, table } from '../components/tag'
import * as SQLite from 'expo-sqlite'
import { useEffect, useState } from 'react'

export const createTable = {
    createSfExpressTable: 
        `CREATE TABLE IF NOT EXISTS ${table.sfExpress} (`
        + `sysId INTEGER PRIMARY KEY AUTOINCREMENT, `
        + `id INTEGER, `
        + `regionCode TEXT, `
        + `districtCode TEXT, `
        + `code TEXT, `
        + `location TEXT, `
        + `storeName TEXT, `
        + `officeHours TEXT, `
        + `latitude REAL, `
        + `longitude REAL, `
        + `status TEXT, `
        + `lastUpdateTime TEXT`
        + `);`,
    
    createJockeyClubTable: 
        `CREATE TABLE IF NOT EXISTS ${table.jockeyClub} (`
        + `sysId INTEGER PRIMARY KEY AUTOINCREMENT, `
        + `id INTEGER, `
        + `regionCode TEXT, `
        + `districtCode TEXT, `
        + `code TEXT, `
        + `location TEXT, `
        + `storeName TEXT, `
        + `officeHours TEXT, `
        + `latitude REAL, `
        + `longitude REAL, `
        + `status TEXT, `
        + `lastUpdateTime TEXT`
        + `);`,

    createUmbrellaRentalTempTable:
    `CREATE TEMPORARY TABLE IF NOT EXISTS ${table.umbrellaRentalTemp} AS SELECT * FROM ${table.jockeyClub};`
    + `INSERT INTO ${table.umbrellaRentalTemp} SELECT * FROM ${table.sfExpress};`
}