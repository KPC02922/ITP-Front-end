import { HomeView } from "@/screen/mainView/homeView"
import { tag } from "../tag"
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import * as Common from "@/common"
import { Header } from "./header"
import { Navigator } from "./navigator"
import { InfoView } from "@/screen/mainView/infoView"
import { SettingView } from "@/screen/mainView/settingView"
import { ReportView } from "@/screen/mainView/reportView"

const TAG = tag.mainView

const MainView = ({}) => {
    const [view, setView] = useState<string>(tag.homeView)
    const [fromView, setFromView] = useState<string>(tag.homeView)
    const [headerVisible, setHeaderVisible] = useState<boolean>(true)
    const [navigatorVisible, setNavigatorVisible] = useState<boolean>(true)
    const noHeaderViews: string[] = [tag.homeView]
    const noNavigatorViews: string[] = [tag.settingView]

    useEffect(() => {
        Common.writeConsole(TAG, `init`)
        const initView = tag.homeView
        setView(initView)
        setFromView(initView)
        setHeaderVisible(!noHeaderViews.includes(initView))
        setNavigatorVisible(!noNavigatorViews.includes(initView))
    }, [])

    const onChangeView = (fromView: string, toView: string) => {
        setFromView(fromView)
        setView(toView)
        setHeaderVisible(!noHeaderViews.includes(toView))
        setNavigatorVisible(!noNavigatorViews.includes(toView))

        Common.writeConsole(TAG, `Change view from ${fromView} to ${toView}`)
    }

    return (
        <>
            <StatusBar style={view == tag.homeView ? "dark" : "light"}/>

            {headerVisible && <Header />}
            
            {/* MainView */}
            {
                view == tag.homeView ? <HomeView onChangeView={onChangeView}/> :
                view == tag.infoView ? <InfoView /> :
                view == tag.reportView ? <ReportView /> :
                view == tag.settingView ? <SettingView /> :
                <HomeView />
            }

            {navigatorVisible && <Navigator onChangeView={onChangeView} />}
        </>
    )
}

export default MainView