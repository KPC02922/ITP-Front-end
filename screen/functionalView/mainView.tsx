import { HomeView } from "@/screen/homeView/homeView"
import { tag } from "../../components/tag"
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import * as Common from "@/common"
import { Header } from "../../components/main/header"
import { Navigator } from "../../components/main/navigator"
import { InfoView } from "@/screen/infoView/infoView"
import { SettingView } from "@/screen/functionalView/settingView"
import { ReportView } from "@/screen/reportView/reportView"
import { ActivityIndicator, Alert } from "react-native"
import { Asset } from "expo-asset"
import * as FileSystem from "expo-file-system/legacy"
import * as Location from 'expo-location'
import { initMarkerVisibility } from "@/controller/map/homeMapMarkerController"

const TAG = tag.mainView

const MainView = ({}) => {
    const [view, setView] = useState<string>(tag.homeView)
    const [fromView, setFromView] = useState<string>(tag.homeView)
    const [headerVisible, setHeaderVisible] = useState<boolean>(true)
    const [navigatorVisible, setNavigatorVisible] = useState<boolean>(true)
    const noHeaderViews: string[] = [tag.homeView]
    const noNavigatorViews: string[] = [tag.settingView]
    const [webViewContent, setWebViewContent] = useState<string | null>(null)

    const onChangeView = (fromView: string, toView: string) => {
        setFromView(fromView)
        setView(toView)
        setHeaderVisible(!noHeaderViews.includes(toView))
        setNavigatorVisible(!noNavigatorViews.includes(toView))

        Common.writeConsole(TAG, `Change view from ${fromView} to ${toView}`)
    }

    useEffect(() => {
        Common.writeConsole(TAG, `init`)
        const initView = tag.homeView
        setView(initView)
        setFromView(initView)
        setHeaderVisible(!noHeaderViews.includes(initView))
        setNavigatorVisible(!noNavigatorViews.includes(initView))

        let isMounted = true

        const loadHtml = async () => {
            try {
                const path = require("../../assets/leaflet.html")
                const asset = Asset.fromModule(path)
                await asset.downloadAsync()
                const htmlContent = await FileSystem.readAsStringAsync(asset.localUri!)

                if (isMounted) {
                    setWebViewContent(htmlContent)
                }
            } 
            catch (error) {
                Alert.alert('Error loading HTML', JSON.stringify(error))
                console.error('Error loading HTML:', error)
            }
        }

        async function getCurrentLocation() {
      
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Common.writeConsole(TAG, 'Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            Common.setCurrentPosition({lat: location.coords.latitude, lng: location.coords.longitude});
        }

        getCurrentLocation()

        loadHtml()

        initMarkerVisibility()

        return () => {
            isMounted = false
        }
    }, [])

    if (!webViewContent) {
        return <ActivityIndicator size="large" />
    }

    return (
        <>
            <StatusBar style={view == tag.homeView ? "dark" : "light"}/>

            {headerVisible && <Header view={view} />}
            
            {/* MainView */}
            {
                view == tag.homeView ? <HomeView onChangeView={onChangeView} webViewContent={webViewContent} /> :
                view == tag.infoView ? <InfoView webViewContent={webViewContent} /> :
                view == tag.reportView ? <ReportView webViewContent={webViewContent}/> :
                view == tag.settingView ? <SettingView /> :
                <HomeView onChangeView={onChangeView} webViewContent={webViewContent} />
            }

            {navigatorVisible && <Navigator onChangeView={onChangeView} />}
        </>
    )
}

export default MainView