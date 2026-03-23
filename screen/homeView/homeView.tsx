import { tag } from "@/components/tag"
import * as Common from "@/common"
import { HomeMapView } from "@/screen/homeView/homeMapView"
import { Box } from "../../components/ui/box"
import { MapControlPanelModal, MapControlPanelModalHandle } from "@/components/modal/mapControlPanelModal"
import { useEffect, useRef, useState } from "react"
import { HomeWeatherView } from "./homeWeatherView"
import { SelectDistrictModal, SelectDistrictModalHandle } from "@/components/modal/selectDistrictModal"
import { WeatherTipsModal, WeatherTipsModalHandle } from "@/components/modal/weatherTipsModal"

const TAG = tag.homeView

export const HomeView = (
    {onChangeView, webViewContent}
    :{onChangeView: any; webViewContent: string}
) => {
    const mapControlPanelModalRef = useRef<MapControlPanelModalHandle>(null)
    const selectDistrictModalRef = useRef<SelectDistrictModalHandle>(null)
    const weatherTipsModalRef = useRef<WeatherTipsModalHandle>(null)
    const [rerender, setRerender] = useState<boolean>(false)
    const [expended, setExpanded] = useState<boolean>(false)
    const [selectedAWSDistrict, setSelectedAWSDistrict] = useState<string>('Yuen Long')

    const triggerRerender = () => {
        Common.writeConsole(TAG, `Trigger rerender from HomeView`)
        setRerender(!rerender)
    }

    const expendHomeWeatherView = () => {
        setExpanded(!expended)
    }

    const pressSelectDistrictBtn = () => {
        Common.writeConsole(TAG, `Press select district button`)
        selectDistrictModalRef.current?.open()
    }

    const awsHandler = (district: string) => {
        setSelectedAWSDistrict(district)
        Common.AsyncStoreData(tag.automaticWeatherStationDistrict, district)
    }

    const openWeatherTipsModal = () => {
        weatherTipsModalRef.current?.open()
    }

    useEffect(() => {
        const func = async () => {
            const lastAWSDistrict = await Common.AsyncGetData(tag.automaticWeatherStationDistrict, 'Yuen Long') as any
            if (lastAWSDistrict) {
                setSelectedAWSDistrict(lastAWSDistrict)
            }
        }

        func()
        
    }, [])

    return (
        <>
            <SelectDistrictModal 
                ref={selectDistrictModalRef} 
                selectBtnFun={(district) => {awsHandler(district)}}
            />

            <WeatherTipsModal ref={weatherTipsModalRef} />

            <MapControlPanelModal ref={mapControlPanelModalRef} triggerRerender={triggerRerender} />

            <HomeMapView onChangeView={onChangeView} webViewContent={webViewContent} mapControlPanelModalRef={mapControlPanelModalRef} rerender={rerender} expended={expended}/>

            <Box style={expended ? {flex: 90} : {flex: 38}}>

                <HomeWeatherView onChangeView={onChangeView} expendHomeWeatherView={expendHomeWeatherView} expended={expended} selectedAutomaticWeatherStationDistrict={selectedAWSDistrict} pressSelectDistrictBtn={pressSelectDistrictBtn} openWeatherTipsModal={openWeatherTipsModal}/>

            </Box>
            

        </>
    )
}

