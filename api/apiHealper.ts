import axios from 'axios'
import { tag } from '../components/tag'
import * as Common from '../common'

const TAG = tag.apiHelper
const baseUrl = 'http://192.168.128.58:8080'

export const testApi = async () => {
    try {
        const response = await axios.get(`${baseUrl}/umbrellaRental/sfExpress/getLocation`)
        Common.writeConsole(TAG, `Test API response: ${JSON.stringify(response.data)}`)
    } catch (error) {
        Common.writeConsole(TAG, `Test API error: ${error}`)
    }
}