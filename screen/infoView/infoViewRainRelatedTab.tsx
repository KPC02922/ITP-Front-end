import { tag } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import { Text } from "@/components/ui/text"
import { HStack } from "@/components/ui/hstack"
import { Button, ButtonText } from "@/components/ui/button"
import { Box } from "@/components/ui/box"
import { Divider } from "@/components/ui/divider"
import { VStack } from "@/components/ui/vstack"
import { rainfallJson } from "@/demoData/rainfallJson"
import { ScrollView } from "react-native"
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { Search } from 'lucide-react-native'
import { RainRelateListItem } from "@/components/listItem/rainRelateListItem"
import { floodingJson } from "@/demoData/floodingJson"
import RainRelateType from "@/interfcaeType/RainRelateType"
import { useEffect, useState } from "react"
import { jockeyClubJson } from "@/demoData/jockeyClubJson"
import { sfExpressJson } from "@/demoData/sfExpressJson"

const TAG = tag.infoViewRainRelatedTab

export const InfoViewRainRelatedTab = (
    {type, pressRegionBtn, pressDistrictBtn, pressStoreBtn, resetSelected, regionLabel, districtLabel, storeLabel}: 
    {type: string, pressRegionBtn: () => void, pressDistrictBtn: () => void, pressStoreBtn: () => void, resetSelected: () => void, regionLabel: string, districtLabel: string, storeLabel: string}
) => {
    const defaultRegionLabel = "Region"
    const defaultDistrictLabel = "District"
    const defaultStoreLabel = "Store"
    const [rainfallJsonData, setRainfallJsonData] = useState<RainRelateType[]>([])
    const [floodingJsonData, setFloodingJsonData] = useState<RainRelateType[]>([])
    const [umbrellaRentalJson, setUmbrellaRentalJson] = useState<RainRelateType[]>([])
    const [DFumbrellaRentalJson, setDFUmbrellaRentalJson] = useState<RainRelateType[]>([])
    const [showAllItem, setShowAllItem] = useState<boolean>(false)
    const [listIndex, setListIndex] = useState<number>(20)
    const [showBtnLabel, setShowBtnLabel] = useState<string>("Show More")

    const pressHndler = (mode: string) => {
        Common.writeConsole(TAG, `press ${mode} button`)
        if (mode === regionLabel) {
            pressRegionBtn()
        } else if (mode === districtLabel) {
            pressDistrictBtn()
        }
        else if (mode === storeLabel) {
            pressStoreBtn()
        }
    }

    const setDataHandler = (mode: string, noFiltering: boolean)=> {
        Common.writeConsole(TAG, `set data handler - type: ${type}, mode: ${mode}, noFiltering: ${noFiltering}`)
        if (type == tag.infoViewRainfallTab) {
            if (noFiltering) {
                setRainfallJsonData(rainfallJson)
            } 
            else {
                if (mode == defaultDistrictLabel) {
                    setRainfallJsonData(rainfallJson.filter(item => Common.districtCodeToLabel(Common.districtCodeToLabel(item.districtCode)) == districtLabel))
                }
                else if (mode == defaultRegionLabel && regionLabel == defaultRegionLabel) {
                    setRainfallJsonData(rainfallJson.filter(item => Common.regionCodeToLabel(Common.regionCodeToFullLabel(item.regionCode)) == regionLabel))
                }
                 
            }
        }
        else if (type == tag.infoViewFloodingTab) {
            if (noFiltering) {
                setFloodingJsonData(floodingJson)
            } 
            else {
                if (mode == defaultDistrictLabel) {
                    setFloodingJsonData(floodingJson.filter(item => Common.districtCodeToLabel(Common.districtCodeToLabel(item.districtCode)) == districtLabel))
                }
                else if (mode == defaultRegionLabel && regionLabel == defaultRegionLabel) {
                    setFloodingJsonData(floodingJson.filter(item => Common.regionCodeToLabel(Common.regionCodeToFullLabel(item.regionCode)) == regionLabel))
                }
            }
        }
        else if (type == tag.infoViewUmbrellaRentalTab) {
            if (noFiltering) {
                setUmbrellaRentalJson(DFumbrellaRentalJson)
            }
            else {               
                if (mode == defaultStoreLabel && storeLabel != defaultStoreLabel) {
                    setUmbrellaRentalJson(DFumbrellaRentalJson.filter(item => item.storeName?.includes(storeLabel)))
                }
                else if (mode == defaultDistrictLabel || (mode == defaultStoreLabel && storeLabel == defaultStoreLabel)) {
                    setUmbrellaRentalJson(DFumbrellaRentalJson.filter(item => Common.districtCodeToLabel(Common.districtCodeToLabel(item.districtCode)) == districtLabel))
                }
                else if (mode == defaultRegionLabel && regionLabel == defaultRegionLabel) {
                    setUmbrellaRentalJson(DFumbrellaRentalJson.filter(item => Common.regionCodeToLabel(Common.regionCodeToFullLabel(item.regionCode)) == regionLabel))
                }
            }
        }
    }

    const listStatusHandler = () => {
        return
        setListIndex(showAllItem ? 20 : 20)
        setShowBtnLabel(showAllItem ? "Show Less" : "Show More")
        setShowAllItem(prev => !prev)
        Common.writeConsole(TAG, `list index changed to: ${listIndex}`)
    }

    useEffect(() => {
        setTimeout(() => {
            Common.writeConsole(TAG, `init - set data`)
            setRainfallJsonData(rainfallJson)
            setFloodingJsonData(floodingJson)
            jockeyClubJson.forEach((item) => {
                const jcData: RainRelateType = {
                    id: Math.random(),
                    regionCode: item.regionCode,
                    districtCode: item.districtCode,
                    location: item.location,
                    latitude: parseFloat(item.latitude),
                    longitude: parseFloat(item.longitude),
                    status: 'N',
                    storeName: 'Jockey Club',
                    officeHours: item.officeHours.replaceAll(', ', '\n')
                }
                setUmbrellaRentalJson(prev => [...prev, jcData])
                setDFUmbrellaRentalJson(prev => [...prev, jcData])
            })
            
            sfExpressJson.forEach((item) => {
                const sfData: RainRelateType = {
                    id: Math.random(),
                    regionCode: item.regionCode,
                    districtCode: item.districtCode,
                    location: item.location,
                    latitude: parseFloat(item.latitude),
                    longitude: parseFloat(item.longitude),
                    status: 'N',
                    storeName: `SF Express (${item.code})`,
                    officeHours: item.weekDayOfficeHours.replaceAll(', ', '\n')
                }
                setUmbrellaRentalJson(prev => [...prev, sfData])
                setDFUmbrellaRentalJson(prev => [...prev, sfData])
            })
        }, 50)

    }, [])

    useEffect(() => {
        Common.writeConsole(TAG, `regionLabel: ${regionLabel} | reredner`)
        setDataHandler(defaultRegionLabel, regionLabel == defaultRegionLabel)
    }, [regionLabel])

    useEffect(() => {
        Common.writeConsole(TAG, `districtLabel: ${districtLabel} | reredner`)
        setDataHandler(defaultDistrictLabel, districtLabel == defaultDistrictLabel)
    }, [districtLabel])

    useEffect(() => {
        Common.writeConsole(TAG, `storeLabel: ${storeLabel} | reredner`)
        setDataHandler(defaultStoreLabel, (storeLabel == defaultStoreLabel && regionLabel == defaultRegionLabel && districtLabel == defaultDistrictLabel))
    }, [storeLabel])

    useEffect(() => {
        resetSelected()
    }, [type])

    return (
        <Box style={styles.container}>
            <VStack space="sm">
                <HStack space="md" style={{paddingHorizontal: 10, paddingTop: 10}}>
                    <Box style={styles.common2BtnHStackContainer}>
                        <Button variant={regionLabel != defaultRegionLabel ? "solid" : "outline"} size="md" action="primary" onPress={() => pressHndler(regionLabel)}>
                            <ButtonText style={styles.infoPageSubNavText}>{regionLabel}</ButtonText>
                        </Button>
                    </Box>

                    <Box style={styles.common2BtnHStackContainer}>
                        <Button variant={districtLabel != defaultDistrictLabel ? "solid" : "outline"} size="md" action="primary" onPress={() => pressHndler(districtLabel)}>
                            <ButtonText style={styles.infoPageSubNavText}>{districtLabel}</ButtonText>
                        </Button>
                    </Box>
                    
                </HStack>

                {type == tag.infoViewUmbrellaRentalTab && 
                    <Box style={{width: "100%", paddingHorizontal: 10}}>
                        <Button variant={storeLabel != defaultStoreLabel ? "solid" : "outline"} size="md" action="primary" onPress={() => pressHndler(storeLabel)}>
                            <ButtonText style={styles.infoPageSubNavText}>{storeLabel}</ButtonText>
                        </Button>
                    </Box>
                }

                
                {/* <HStack space="md" style={{paddingHorizontal: 10}}>
                    <Input variant="outline" size="md" style={{flex: 80}}>
                    <InputSlot style={{marginLeft: 10}}>
                        <InputIcon as={Search} />
                    </InputSlot>
                        <InputField placeholder="Search by location" value={""} onChange={() => {}} />
                    </Input>
                </HStack> */}
                

                <Divider />
            </VStack>            

            {type == tag.infoViewRainfallTab && 
                <Box>
                    <ScrollView>
                        <VStack space="sm" style={[styles.paddingNav, {paddingTop: 10}]}>
                        {
                            rainfallJsonData.length == 0 ?
                                <Box style={{padding: 10}}>
                                    <Text style={{textAlign: 'center'}}>No data</Text>
                                </Box>
                            :
                            rainfallJsonData.map((item) => (
                                <Box key={item.id} style={{paddingHorizontal: 10}}>
                                    <RainRelateListItem type={type} item={item} />
                                </Box>
                            ))
                        }
                        </VStack>
                    </ScrollView>
                </Box>
            }

            {type == tag.infoViewFloodingTab && 
                <Box>
                    <ScrollView>
                        <VStack space="sm" style={[styles.paddingNav, {paddingTop: 10}]}>
                            <Box style={{padding: 10}}>
                                <Text style={{textAlign: 'center'}}>No data</Text>
                            </Box>
                        {
                            // floodingJsonData.length == 0 ?
                            //     <Box style={{padding: 10}}>
                            //         <Text style={{textAlign: 'center'}}>No data</Text>
                            //     </Box>
                            // :
                            // floodingJsonData.map((item) => (
                            //     <Box key={item.id} style={{paddingHorizontal: 10}}>
                            //         <RainRelateListItem type={type} item={item} />
                            //     </Box>
                            // ))
                        }
                        </VStack>
                    </ScrollView>
                </Box>
            }

            {type == tag.infoViewUmbrellaRentalTab && 
                <Box>
                    <ScrollView>
                        <VStack space="sm" style={[styles.paddingNav, {paddingTop: 10}]}>
                        {
                            umbrellaRentalJson.length == 0 ?
                                <Box style={{padding: 10}}>
                                    <Text style={{textAlign: 'center'}}>No data</Text>
                                </Box>
                            :
                            umbrellaRentalJson.map((item, index) => ( index < listIndex ) && (
                                <Box key={item.id} style={{paddingHorizontal: 10}}>
                                    <RainRelateListItem type={type} item={item} />
                                </Box>
                            ))
                        }

                        {umbrellaRentalJson.length > 0 &&
                            <Button variant="outline" size="md" action="primary" onPress={() => listStatusHandler()} style={{alignSelf: 'center'}}>
                                <ButtonText style={styles.infoPageSubNavText}>{showBtnLabel}</ButtonText>
                            </Button>
                        }
                        </VStack>
                    </ScrollView>
                </Box>
            }
        </Box>
    )
}