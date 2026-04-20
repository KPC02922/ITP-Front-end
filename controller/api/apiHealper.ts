import axios from 'axios'
import { tag } from '../../components/tag'
import * as Common from '../../common'

const TAG = tag.apiHelper
const baseUrl = 'http://192.168.128.53:8080'    // check if same as expo provide ip address

export const testApi = async () => {
    try {
        const response = await axios.get(`${baseUrl}/umbrellaRental/sfExpress/getLocation`)
        Common.writeConsole(TAG, `Test API response: ${JSON.stringify(response.data)}`)
    } catch (error) {
        Common.writeConsole(TAG, `Test API error: ${error}`)
    }
}

// SF Express
export const getSfExpressLocation = async () => {
    try {
        const response = await axios.get(`${baseUrl}/umbrellaRental/sfExpress/getLocation`)
        // Common.writeConsole(TAG, `Get SF Express Location response: ${JSON.stringify(response.data)}`)
        return response.data
    } catch (error) {
        Common.writeConsole(TAG, `Get SF Express Location error: ${error}`)
        return []
    }
}

// Jockey Club
export const getJockeyClubLocation = async () => {
    try {
        const response = await axios.get(`${baseUrl}/umbrellaRental/hkJockeyClub/getLocation`)
        // Common.writeConsole(TAG, `Get Jockey Club Location response: ${JSON.stringify(response.data)}`)
        return response.data
    } catch (error) {
        Common.writeConsole(TAG, `Get Jockey Club Location error: ${error}`)
        return []
    }
}

// Other Store
export const getOtherStoreReport = async (id: number) => {
    try {
        const response = await axios.get(`${baseUrl}/report/other/getOtherReport/${id}`)
        // Common.writeConsole(TAG, `Get Other Store Location response: ${JSON.stringify(response.data)}`)
        return response.data
    } catch (error) {
        Common.writeConsole(TAG, `Get Other Store Location error: ${error}`)
        return []
    }
}

export const getOtherStoreReportCount = async () => {
    try {
        const response = await axios.get(`${baseUrl}/report/other/getOtherReportCount`)
        Common.writeConsole(TAG, `Get Other Store Location Count response: ${JSON.stringify(response.data.data[0].count)}`)
        return response.data.data[0].count
    } catch (error) {
        Common.writeConsole(TAG, `Get Other Store Location Count error: ${error}`)
        return 0
    }
}

export const postOtherStoreReport = async (reportData: any) => {
    try {
        const response = await axios.post(`${baseUrl}/report/other/postOtherReport`, reportData)
        Common.writeConsole(TAG, `Post Other Store Location response: ${JSON.stringify(response.data)}`)
        return response.data
    } catch (error) {
        Common.writeConsole(TAG, `Post Other Store Location error: ${error}`)
        return null
    }
}

// Rainfall Report
export const getRainfallReport = async (id: number) => {
    try {
        const response = await axios.get(`${baseUrl}/report/rainfall/getRainfallReport/${id}`)
        // Common.writeConsole(TAG, `Get Rainfall Report response: ${JSON.stringify(response.data)}`)
        return response.data
    } catch (error) {
        Common.writeConsole(TAG, `Get Rainfall Report error: ${error}`)
        return []
    }
}

export const getRainfallReportCount = async () => {
    try {
        const response = await axios.get(`${baseUrl}/report/rainfall/getRainfallReportCount`)
        // Common.writeConsole(TAG, `Get Rainfall Report Count response: ${JSON.stringify(response.data.data[0].count)}`)
        return response.data.data[0].count
    } catch (error) {
        Common.writeConsole(TAG, `Get Rainfall Report Count error: ${error}`)
        return 0
    }
}

export const postRainfallReport = async (reportData: any) => {
    try {
        const response = await axios.post(`${baseUrl}/report/rainfall/postRainfallReport`, reportData)
        Common.writeConsole(TAG, `Post Rainfall Report response: ${JSON.stringify(response.data)}`)
        return response.data
    } catch (error) {
        Common.writeConsole(TAG, `Post Rainfall Report error: ${error}`)
        return null
    }
}

// Flooding Report
export const getFloodingReport = async (id: number) => {
    try {
        const response = await axios.get(`${baseUrl}/report/flooding/getFloodingReport/${id}`)
        // Common.writeConsole(TAG, `Get Flooding Report response: ${JSON.stringify(response.data)}`)
        return response.data
    }
    catch (error) {
        Common.writeConsole(TAG, `Get Flooding Report error: ${error}`)
        return []
    }
}

export const getFloodingReportCount = async () => {
    try {
        const response = await axios.get(`${baseUrl}/report/flooding/getFloodingReportCount`)
        // Common.writeConsole(TAG, `Get Flooding Report Count response: ${JSON.stringify(response.data.data[0].count)}`)
        return response.data.data[0].count
    }
    catch (error) {
        Common.writeConsole(TAG, `Get Flooding Report Count error: ${error}`)
        return 0
    }
}

export const postFloodingReport = async (reportData: any) => {
    try {
        const response = await axios.post(`${baseUrl}/report/flooding/postFloodingReport`, reportData)
        Common.writeConsole(TAG, `Post Flooding Report response: ${JSON.stringify(response.data)}`)
        return response.data
    }
    catch (error) {
        Common.writeConsole(TAG, `Post Flooding Report error: ${error}`)
        return null
    }
}