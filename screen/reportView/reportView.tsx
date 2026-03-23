import { tag } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { Navigator } from "@/components/main/navigator"
import { Header } from "@/components/main/header"
import { ScrollView } from "react-native"
import { HStack } from "@/components/ui/hstack"
import { Button, ButtonText } from "@/components/ui/button"
import { Box } from "@/components/ui/box"
import { Divider } from "@/components/ui/divider"
import { useRef, useState } from "react"
import { ReportViewTab } from "./reportViewTab"
import { SelectRegionModal, SelectRegionModalHandle } from "@/components/modal/selectRegionModal"
import { SelectDistrictModal, SelectDistrictModalHandle } from "@/components/modal/selectDistrictModal"
import { MapSelectLatLngModal, MapSelectLatLngModalHandle } from "@/components/modal/mapSelectLatLngModal"
import { MessageModal, MessageModalHandle } from "@/components/modal/messagModal"

const TAG = tag.reportView

export const ReportView = ({webViewContent}: {webViewContent: string}) => {
    const tabList: string[] = [tag.reportViewRainfallTab, tag.reportViewFloodingTab, tag.reportViewUmbrellaRentalTab]
    const [currentTab, setCurrentTab] = useState<string>(tag.reportViewRainfallTab)
    const selectRegionModalRef = useRef<SelectRegionModalHandle>(null)
    const selectDistrictModalRef = useRef<SelectDistrictModalHandle>(null)
    const mapSelectLatLngModalRef = useRef<MapSelectLatLngModalHandle>(null)
    const messageModalRef = useRef<MessageModalHandle>(null)
    const [selectedRegion, setSelectedRegion] = useState<string>('')
    const [selectedDistrict, setSelectedDistrict] = useState<string>('')
    const [selectedLatLng, setSelectedLatLng] = useState<{lat: number, lng: number}>({lat: 0, lng: 0})
    const [reset, setReset] = useState<boolean>(false)
    
    
    const changeTab = (tab: string) => {
        Common.writeConsole(TAG, `change tab: ${tab}`)
        setCurrentTab(tab)
        setSelectedLatLng({lat: 0, lng: 0})
        selectRegionModalRef.current?.resetSelectedRegion()
        selectDistrictModalRef.current?.resetSelectedDistrict()
        mapSelectLatLngModalRef.current?.resetSelectedLatLng()
    }

    const pressRegionBtn = () => {
        Common.writeConsole(TAG, `press region button`)
        selectRegionModalRef.current?.open()
    }

    const pressDistrictBtn = () => {
        Common.writeConsole(TAG, `press district button`)
        selectDistrictModalRef.current?.open()
    }

    const pressMapSelectBtn = () => {
        Common.writeConsole(TAG, `press map select button`)
        mapSelectLatLngModalRef.current?.open()
    }

    const onSelectLocation = (lat: number, lng: number) => {
        Common.writeConsole(TAG, `selected location: ${lat}, ${lng}`)
        setSelectedLatLng({lat, lng})
    }

    const showMessage = () => {
        messageModalRef.current?.open()
    }

    const resetForm = () => {
        setReset(!reset)
    }

    const autoFillHandler = (region: string) => {
        setSelectedRegion(region)
        selectDistrictModalRef.current?.setSelectedRegion(region)
    }

    return (
        <>
            <VStack style={styles.container}>
                <SelectRegionModal 
                    ref={selectRegionModalRef}
                    selectBtnFun={(region) => {
                        setSelectedRegion(region)
                        selectDistrictModalRef.current?.setSelectedRegion(region)
                    }}
                />
                <SelectDistrictModal 
                    ref={selectDistrictModalRef}
                    selectBtnFun={(district) => {setSelectedDistrict(district)}}
                />
                <MapSelectLatLngModal
                    ref={mapSelectLatLngModalRef}
                    webViewContent={webViewContent}
                    selectBtnFun={(lat, lng) => onSelectLocation(lat, lng)}
                    selectedLatLng={selectedLatLng}
                />
                <MessageModal
                    ref={messageModalRef}
                    numberOfBtn={1}
                    title="Report Uploaded"
                    message={`Report has been uploaded. \nThank you for your contribution!`}
                    closeBtnFun={() => {resetForm()}}
                />

                <HStack space="md" style={{padding: 10}}>

                    {tabList.map((tab) => (
                        <Box key={tab} style={styles.infoPageSubNavContainer}>
                            <Button variant={currentTab == tab ? "solid" : "outline"} size="md" action="primary" onPress={() => changeTab(tab)} style={styles.infoPageSubNavBtn}>
                                <ButtonText style={styles.infoPageSubNavText}>{tab}</ButtonText>
                            </Button>
                        </Box>
                    ))}
                
                </HStack>

                <Divider className="bg-info-600"/>

                {currentTab == tag.reportViewRainfallTab ? <ReportViewTab type={tag.reportViewRainfallTab} pressRegionBtn={pressRegionBtn} pressDistrictBtn={pressDistrictBtn} pressMapSelectBtn={pressMapSelectBtn} showMessage={showMessage} selectedRegion={selectedRegion} selectedDistrict={selectedDistrict} selectedLatLng={selectedLatLng} reset={reset} autoFillHandler={autoFillHandler}/> : 
                currentTab == tag.reportViewFloodingTab ? <ReportViewTab type={tag.reportViewFloodingTab} pressRegionBtn={pressRegionBtn} pressDistrictBtn={pressDistrictBtn} pressMapSelectBtn={pressMapSelectBtn} showMessage={showMessage} selectedRegion={selectedRegion} selectedDistrict={selectedDistrict} selectedLatLng={selectedLatLng} reset={reset} autoFillHandler={autoFillHandler}/> :
                currentTab == tag.reportViewUmbrellaRentalTab ? <ReportViewTab type={tag.reportViewUmbrellaRentalTab} pressRegionBtn={pressRegionBtn} pressDistrictBtn={pressDistrictBtn} pressMapSelectBtn={pressMapSelectBtn} showMessage={showMessage} selectedRegion={selectedRegion} selectedDistrict={selectedDistrict} selectedLatLng={selectedLatLng} reset={reset} autoFillHandler={autoFillHandler}/> :
                <></>
                }
            </VStack>
        </>
    )
}

