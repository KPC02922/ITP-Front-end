import AsyncStorage from '@react-native-async-storage/async-storage'
import { tag, region, district } from './components/tag'
import * as turf from '@turf/turf'
import { hk_18_districts } from './JsonData/hk_18_districts'
import { automaticWeatherStation } from './JsonData/automaticWeatherStation'


const TAG = tag.common
let currentPosition = {lat: 0, lng: 0}
let lastPosition = {lat: 0, lng: 0}
let lastZoom = 0

export const writeConsole = (TAG: string, text: string) =>{
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const secends = now.getSeconds()
    const milliseconds = now.getMilliseconds()

    const msg = `[${hours}:${minutes}:${secends}:${milliseconds}] [${TAG}] ${text}`
    console.log(msg)
}

export const AsyncStoreData = async (key: string, value: string) => {
  try {
    writeConsole(TAG, `Saving data key: ${key} | value: ${value}`)
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    writeConsole(TAG, `Error saving data ${e}`)
  }
}

export const AsyncGetData = async (key: string, defaultValue?: string) => {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
      writeConsole(TAG, `Get data key: ${key} | value: ${value}`)
      return value;
    }
    else if (defaultValue){
      return defaultValue
    }
    else {
      return undefined
    }
  } catch (e) {
    writeConsole(TAG, `Error reading data ${e}`)
  }
}

export const regionCodeToLabel = (code: string) => {
    const map: Record<string, string> = {
        "1": "HK",
        "2": "KLN",
        "3": "NT",
    }
    return map[code] || code
}

export const regionCodeToFullLabel = (code: string) => {
    const map: Record<string, string> = {
        "1": "Hong Kong Island",
        "2": "Kowloon",
        "3": "New Territories",
    }
    return map[code] || code
}

export const regionLabelToCode = (label: string) => {
    const map: Record<string, string> = {
        "Hong Kong Island": "1",
        "Kowloon": "2",
        "New Territories": "3",
    }
    return map[label] || label
}

export const districtCodeToLabel = (code: string) => {
    const map: Record<string, string> = {
        "1": "Central and Western",
        "2": "Wan Chai",
        "3": "Eastern",
        "4": "Southern",
        "5": "Yau Tsim Mong",
        "6": "Sham Shui Po",
        "7": "Kowloon City",
        "8": "Wong Tai Sin",
        "9": "Kwun Tong",
        "10": "Kwai Tsing",
        "11": "Tsuen Wan",
        "12": "Tuen Mun",
        "13": "Yuen Long",
        "14": "North",
        "15": "Tai Po",
        "16": "Sha Tin",
        "17": "Sai Kung",
        "18": "Islands",
    }
    return map[code] || code
}

export const districtLabelToCode = (label: string) => {
    const map: Record<string, string> = {
        "Central and Western": "1",
        "Wan Chai": "2",
        "Eastern": "3",
        "Southern": "4",
        "Yau Tsim Mong": "5",
        "Sham Shui Po": "6",
        "Kowloon City": "7",
        "Wong Tai Sin": "8",
        "Kwun Tong": "9",
        "Kwai Tsing": "10",
        "Tsuen Wan": "11",
        "Tuen Mun": "12",
        "Yuen Long": "13",
        "North": "14",
        "Tai Po": "15",
        "Sha Tin": "16",
        "Sai Kung": "17",
        "Islands": "18",
    }
    return map[label] || label
}

export const getCurrentPosition = () => {
    return currentPosition
}

export const setCurrentPosition = (position: {lat: number, lng: number}) => {
    currentPosition = position
}

export const getLastPosition = () => {
    return lastPosition
}

export const setLastPosition = (position: {lat: number, lng: number}) => {
    lastPosition = position
}

export const getLastZoom = () => {
    return lastZoom
}

export const setLastZoom = (zoom: number) => {
    lastZoom = zoom
}

export const regionTcToEn = (regionTc: string) => {
    const map: Record<string, string> = {
        "香港島": "Hong Kong Island",
        "九龍": "Kowloon",
        "新界": "New Territories",
    }
    return map[regionTc] || regionTc
}

export const findDistrict = (lat: number, lng: number) => {
  const point = turf.point([lng, lat])
  for (const feature of hk_18_districts.features) {
    if (turf.booleanPointInPolygon(point, feature as any)) {
      return feature.properties?.District || 'Unknown'
    }
  }
  return 'Unknown'
}

export const dbDataTimetoString = (dateTimeStr: string, type: string = 'full') => {
  let rs = ''

  try {
    const dateObj = new Date(dateTimeStr)
    const year = dateObj.getFullYear().toString().padStart(4, '0')
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const date = dateObj.getDate().toString().padStart(2, '0')
    const hours = dateObj.getHours().toString().padStart(2, '0')
    const minutes = dateObj.getMinutes().toString().padStart(2, '0')

    switch (type) {
      case 'date':
        rs = `${year}-${month}-${date}`
        break
      case 'time':
        rs = `${hours}:${minutes}`
        break
      case 'full':
        rs = `${year}-${month}-${date} ${hours}:${minutes}`
        break
      case 'short':
        rs = `${month}/${date} ${hours}:${minutes}`
    }
    // writeConsole(TAG, `dbDataTimetoString: ${dateTimeStr} | ${rs}`)
  } catch (error) {
    writeConsole(TAG, `Error converting date time string: ${error}`)
  }

  return rs
}

export const automaticWeatherStationDistrict = (id: string) => {
  const tempDistrict = automaticWeatherStation.find((station) => station.automaticWeatherStationId === id)?.district
  return tempDistrict || 'Unknown'
}