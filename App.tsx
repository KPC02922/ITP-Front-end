import { GluestackUIProvider, } from '@/components/ui/gluestack-ui-provider'
import '@/global.css'
import MainView from './screen/functionalView/mainView'
import * as SplashScreen from "expo-splash-screen"
import { use, useEffect, useState } from 'react'
import * as Common from "@/common"
import { tag } from './components/tag'
import * as Location from 'expo-location'
import { initDb } from './db/sqliteHelper'

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)

  const requestPermission = async () => {
    // location prermission
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
        // Permission denied
        Common.writeConsole(tag.app, 'Permission to access location was denied')
    } else {
        // Permission granted
        Common.writeConsole(tag.app, 'Location permission granted')
        // const location = await Location.getCurrentPositionAsync({})
        // Common.writeConsole(tag.app, `Location: ${location.coords.latitude} | ${location.coords.longitude}`)
    }
  }

  useEffect(() => {
    async function prepare() {
      Common.writeConsole(tag.app, "fun start")
      
      try {
        Common.writeConsole(tag.app, "App is preparing")
        await initDb()
        await requestPermission()
      } catch (e) {
        console.warn(e)
      } finally {
        Common.writeConsole(tag.app, "App is ready")
        setAppIsReady(true)
      }
      
    }
    
    prepare()
  }, [])

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync()
    }
  }, [appIsReady])

  if (!appIsReady) {
    return null
  }

  return (
      <GluestackUIProvider mode="light">
          <MainView />
      </GluestackUIProvider>
  )
}