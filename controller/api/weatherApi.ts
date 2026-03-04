import { tag, mapMarkerTag } from "@/components/tag"
import * as Common from "@/common"
import { useEffect, useState } from "react"

const TAG = tag.weatherApi

export const goApi = async (url: string, funName?: string) => {
    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        Common.writeConsole(TAG, `Weather report fetched successfully - ${funName || ''}`)
        return data
    }
    catch (e) {
        Common.writeConsole(TAG, `Error fetching weather report: ${e}`)
        throw e
    }
}

export const fetchCurrentWeatherReport = async () => {
    const url = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en'
    return await goApi(url, 'fetchCurrentWeatherReport')
}

export const fetchAutomaticWeatherStation = async () => {
    const url = 'https://data.weather.gov.hk/weatherAPI/opendata/hourlyRainfall.php?lang=en'
    return await goApi(url, 'fetchAutomaticWeatherStation')
}
