import { tag } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
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
import { InfoViewRainRelatedTab } from "../infoViewTab/infoViewRainRelatedTab"
import * as Common from "@/common"
import { SelectRegionModal, SelectRegionModalHandle } from "@/components/modal/selectRegionModal"
import { SelectDistrictModal, SelectDistrictModalHandle } from "@/components/modal/selectDistrictModal"
import { SelectStoreModal, SelectStoreModalHandle } from "@/components/modal/selectStoreModal"
import { S } from "@expo/html-elements"

const TAG = tag.infoView

export const InfoView = () => {
    const tabList: string[] = [tag.infoViewRainfallTab, tag.infoViewFloodingTab, tag.infoViewUmbrellaRentalTab]
    const [currentTab, setCurrentTab] = useState<string>(tag.infoViewRainfallTab)
    const [regionLabel, setRegionLabel] = useState<string>("Region")
    const [districtLabel, setDistrictLabel] = useState<string>("District")
    const [storeLabel, setStoreLabel] = useState<string>("Store")
    const selectRegionModalRef = useRef<SelectRegionModalHandle>(null)
    const selectDistrictModalRef = useRef<SelectDistrictModalHandle>(null)
    const selectStoreModalRef = useRef<SelectStoreModalHandle>(null)

    const changeTab = (tab: string) => {
        Common.writeConsole(TAG, `change tab: ${tab}`)
        setCurrentTab(tab)
    }

    const pressRegionBtn = () => {
        Common.writeConsole(TAG, `press region button`)
        selectRegionModalRef.current?.open()
    }

    const pressDistrictBtn = () => {
        Common.writeConsole(TAG, `press district button`)
        selectDistrictModalRef.current?.open()
    }

    const pressStoreBtn = () => {
        Common.writeConsole(TAG, `press store button`)
        selectStoreModalRef.current?.open()
    }

    const regionLabelSetter = (label: string) => {
        Common.writeConsole(TAG, `set region label: ${label}`)
        setRegionLabel(label)
        selectDistrictModalRef.current?.setSelectedRegion(label)
    }

    const districtLabelSetter = (label: string) => {
        Common.writeConsole(TAG, `set district label: ${label}`)
        setDistrictLabel(label)
    }

    const storeLabelSetter = (label: string) => {
        Common.writeConsole(TAG, `set store label: ${label}`)
        setStoreLabel(label)
    }

    return (
        <>
            <VStack style={styles.container}>
                <SelectRegionModal 
                    ref={selectRegionModalRef}
                    selectBtnFun={(label:string) => regionLabelSetter(label)}
                />
                <SelectDistrictModal 
                    ref={selectDistrictModalRef}
                    selectBtnFun={(label:string) => districtLabelSetter(label)}
                />
                <SelectStoreModal
                    ref={selectStoreModalRef}
                    selectBtnFun={(label:string) => storeLabelSetter(label)}
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

                <Divider />

                {currentTab == tag.infoViewRainfallTab ? <InfoViewRainRelatedTab type={tag.infoViewRainfallTab} pressRegionBtn={pressRegionBtn} pressDistrictBtn={pressDistrictBtn} pressStoreBtn={pressStoreBtn} regionLabel={regionLabel} districtLabel={districtLabel} storeLabel=""/> :
                currentTab == tag.infoViewFloodingTab ? <InfoViewRainRelatedTab type={tag.infoViewFloodingTab} pressRegionBtn={pressRegionBtn} pressDistrictBtn={pressDistrictBtn} pressStoreBtn={pressStoreBtn} regionLabel={regionLabel} districtLabel={districtLabel} storeLabel=""/> :
                currentTab == tag.infoViewUmbrellaRentalTab ? <InfoViewRainRelatedTab type={tag.infoViewUmbrellaRentalTab} pressRegionBtn={pressRegionBtn} pressDistrictBtn={pressDistrictBtn} pressStoreBtn={pressStoreBtn} regionLabel={regionLabel} districtLabel={districtLabel} storeLabel={storeLabel}/> :
                <InfoViewRainRelatedTab type={tag.infoViewRainfallTab} pressRegionBtn={pressRegionBtn} pressDistrictBtn={pressDistrictBtn} pressStoreBtn={pressStoreBtn} regionLabel={regionLabel} districtLabel={districtLabel} storeLabel=""/>}

            </VStack>

        </>
    )
}

