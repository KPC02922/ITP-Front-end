import { table, tag } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import { Text } from "@/components/ui/text"
import { HStack } from "@/components/ui/hstack"
import { Button, ButtonText } from "@/components/ui/button"
import { Box } from "@/components/ui/box"
import { Divider } from "@/components/ui/divider"
import { VStack } from "@/components/ui/vstack"
import { rainfallJson } from "@/demoData/rainfallJson"
import { Keyboard, ScrollView, ToastAndroid } from "react-native"
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { Key, Search, MoveUp } from 'lucide-react-native'
import { RainRelateListItem } from "@/components/listItem/rainRelateListItem"
import { floodingJson } from "@/demoData/floodingJson"
import RainRelateType from "@/interfcaeType/RainRelateType"
import { useEffect, useRef, useState } from "react"
import { jockeyClubJson } from "@/demoData/jockeyClubJson"
import { sfExpressJson } from "@/demoData/sfExpressJson"
import { Spinner } from "@/components/ui/spinner"
import { SendHorizonal } from "lucide-react-native"
import { Toast } from "@/components/ui/toast"
import { Fab, FabIcon } from "@/components/ui/fab"
import { createTableAsync, getAllTableRecords, getTableRecords, insertRecord } from "@/db/sqliteHelper"
import { createTable } from "@/db/createTable"

const TAG = tag.infoViewRainRelatedTab

export const InfoViewRainRelatedTab = (
    {type, pressRegionBtn, pressDistrictBtn, pressStoreBtn, resetSelected, openMapMarkerModal, regionLabel, districtLabel, storeLabel}: 
    {type: string, pressRegionBtn: () => void, pressDistrictBtn: () => void, pressStoreBtn: () => void, resetSelected: () => void, openMapMarkerModal: (lat: number, lng: number) => void, regionLabel: string, districtLabel: string, storeLabel: string}
) => {
    const defaultRegionLabel = "Region"
    const defaultDistrictLabel = "District"
    const defaultStoreLabel = "Store"
    const [rainfallJsonData, setRainfallJsonData] = useState<RainRelateType[]>([])
    const [floodingJsonData, setFloodingJsonData] = useState<RainRelateType[]>([])
    const [umbrellaRentalJson, setUmbrellaRentalJson] = useState<RainRelateType[]>([])
    const [DFumbrellaRentalJson, setDFUmbrellaRentalJson] = useState<RainRelateType[]>([])
    const [showAllItem, setShowAllItem] = useState<boolean>(false)
    const [listIndex, setListIndex] = useState<number>(50)
    const [loading, setLoading] = useState<boolean>(true)
    const [searchInput, setSearchInput] = useState<string>("")
    const rainfallScrollRef = useRef<ScrollView>(null)
    const floodingScrollRef = useRef<ScrollView>(null)
    const umbrellaRentalScrollRef = useRef<ScrollView>(null)

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

    const setDataHandler = async (mode?: string, noFiltering?: boolean)=> {
        Common.writeConsole(TAG, `set data handler - type: ${type}, mode: ${mode}, noFiltering: ${noFiltering}`)
        //setLoading(true)
        try {
            if (type == tag.infoViewRainfallTab) {
                if (noFiltering) {
                    if (mode == defaultRegionLabel) {
                        if (districtLabel == defaultDistrictLabel) {
                            setRainfallJsonData(rainfallJson)
                        }
                        else {
                            setRainfallJsonData(rainfallJson.filter(item => Common.districtCodeToLabel(item.districtCode) == districtLabel))
                        }
                    }
                } 
                else {
                    if (mode == defaultDistrictLabel) {
                        setRainfallJsonData(rainfallJson.filter(item => Common.districtCodeToLabel(item.districtCode) == districtLabel))
                    }
                    else if (mode == defaultRegionLabel && districtLabel == defaultDistrictLabel) {
                        setRainfallJsonData(rainfallJson.filter(item => Common.regionCodeToLabel(Common.regionCodeToFullLabel(item.regionCode)) == regionLabel))
                    }
                }
            }
            else if (type == tag.infoViewFloodingTab) {
                if (noFiltering) {
                    if (mode == defaultRegionLabel) {
                        if (districtLabel == defaultDistrictLabel) {
                            setFloodingJsonData(floodingJson)
                        }
                        else {
                            setFloodingJsonData(floodingJson.filter(item => Common.districtCodeToLabel(item.districtCode) == districtLabel))
                        }
                    }
                } 
                else {
                    if (mode == defaultDistrictLabel) {
                        setFloodingJsonData(floodingJson.filter(item => Common.districtCodeToLabel(item.districtCode) == districtLabel))
                    }
                    else if (mode == defaultRegionLabel && districtLabel == defaultDistrictLabel) {
                        setFloodingJsonData(floodingJson.filter(item => Common.regionCodeToLabel(Common.regionCodeToFullLabel(item.regionCode)) == regionLabel))
                    }
                }
            }
            // need to re-design the if statement logic
            else if (type == tag.infoViewUmbrellaRentalTab) { 
                const filteringRegion = regionLabel != defaultRegionLabel
                const filteringDistrict = districtLabel != defaultDistrictLabel
                const filteringStore = storeLabel != defaultStoreLabel
                const filteringSearchInput = searchInput.trim() != ""

                if (!filteringRegion && !filteringDistrict && !filteringStore && !filteringSearchInput) {
                    setUmbrellaRentalJson(DFumbrellaRentalJson)
                    return
                }

                let umbrellaRentalSqlExtra = ``
                let sqlParams: any[] = []
                let urCount = 0

                if (filteringRegion) {
                    umbrellaRentalSqlExtra += `regionCode = ?`
                    sqlParams.push(Common.regionLabelToCode(regionLabel))
                    urCount++
                }

                if (filteringDistrict) {
                    if (urCount > 0) {
                        umbrellaRentalSqlExtra += ` AND `
                    }
                    umbrellaRentalSqlExtra += `districtCode = ?`
                    sqlParams.push(Common.districtLabelToCode(districtLabel))
                    urCount++
                }

                if (filteringStore) {
                    if (urCount > 0) {
                        umbrellaRentalSqlExtra += ` AND `
                    }
                    if (storeLabel == 'Others') {
                        umbrellaRentalSqlExtra += `storeName NOT LIKE ? AND storeName NOT LIKE ?`
                        sqlParams.push(`%SF Express%`)
                        sqlParams.push(`%Jockey Club%`)
                    }
                    else {
                        umbrellaRentalSqlExtra += `storeName LIKE ?`
                        sqlParams.push(`%${storeLabel}%`)
                    }
                    
                    urCount++
                }

                if (filteringSearchInput) {
                    if (urCount > 0) {
                        umbrellaRentalSqlExtra += ` AND `
                    }
                    umbrellaRentalSqlExtra += `(location LIKE ? OR storeName LIKE ?)`
                    sqlParams.push(`%${searchInput}%`)
                    sqlParams.push(`%${searchInput}%`)
                }

                Common.writeConsole(TAG, `setDataHandler sql extra: ${umbrellaRentalSqlExtra} | params: ${JSON.stringify(sqlParams)}`)
                const umbrellaRentalDRecord = await getTableRecords(table.umbrellaRentalTemp, umbrellaRentalSqlExtra, sqlParams)
                Common.writeConsole(TAG, `Umbrella Rental records from DB: ${JSON.stringify(umbrellaRentalDRecord)}`)
                const umbrellaRentalData: RainRelateType[] = umbrellaRentalDRecord.map((item: any) => ({
                    id: `umbrella-${item.id}-${item.sysid}-${Math.random()}`,
                    regionCode: item.regionCode,
                    districtCode: item.districtCode,
                    location: item.location,
                    latitude: parseFloat(item.latitude),
                    longitude: parseFloat(item.longitude),
                    status: item.status,
                    storeName: item.storeName,
                    officeHours: item.officeHours.replaceAll(', ', '\n'),
                    lastUpdateTime: item.lastUpdateTime
                }))
                setUmbrellaRentalJson(umbrellaRentalData)
                fakeLoading()
            }
        } catch (error) {
            Common.writeConsole(TAG, `set data handler error: ${error}`)
        }

    }

    const listStatusHandler = () => {
        ToastAndroid.show(`Loading all items...`, ToastAndroid.SHORT)
        setListIndex(500)
        setShowAllItem(true)
        Common.writeConsole(TAG, `list index changed to: ${listIndex}`)
    }

    const searchHandler = (input: string) => {
        Common.writeConsole(TAG, `search handler: ${input}`)
        ToastAndroid.show(`Search for [${input}]`, ToastAndroid.SHORT)
        setDataHandler()
        Keyboard.dismiss()
    }

    const fakeLoading = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 50)
    }

    useEffect(() => {
        Common.writeConsole(TAG, `init - set data`)
        // setSearchComfirmInput("")
        // setRainfallJsonData(rainfallJson)
        setFloodingJsonData(floodingJson)
        setTimeout(() => {
            const loadSqliteData = async () => {
                const umbrellaRentalDRecord = await getAllTableRecords(table.umbrellaRentalTemp, true, `ORDER BY districtCode ASC, storeName ASC`)
                // Common.writeConsole(TAG, `Umbrella Rental records from DB: ${JSON.stringify(umbrellaRentalDRecord)}`)
                const umbrellaRentalData: RainRelateType[] = umbrellaRentalDRecord.map((item: any) => ({
                    id: `umbrella-${item.id}-${item.sysid}-${Math.random()}`,
                    regionCode: item.regionCode,
                    districtCode: item.districtCode,
                    location: item.location,
                    latitude: parseFloat(item.latitude),
                    longitude: parseFloat(item.longitude),
                    status: item.status,
                    storeName: item.storeName,
                    officeHours: item.officeHours.replaceAll(', ', '\n'),
                    lastUpdateTime: item.lastUpdateTime
                }))
                setUmbrellaRentalJson(umbrellaRentalData)
                setDFUmbrellaRentalJson(umbrellaRentalData)
            }

            loadSqliteData().then(() => {
                fakeLoading()
            })
        }, 50)

    }, [])

    useEffect(() => {
        Common.writeConsole(TAG, `regionLabel: ${regionLabel} | reredner`)
        //setLoading(true)
        setDataHandler(defaultRegionLabel, regionLabel == defaultRegionLabel)
    }, [regionLabel])

    useEffect(() => {
        Common.writeConsole(TAG, `districtLabel: ${districtLabel} | reredner`)
        //setLoading(true)
        setDataHandler(defaultDistrictLabel, districtLabel == defaultDistrictLabel)
    }, [districtLabel])

    useEffect(() => {
        Common.writeConsole(TAG, `storeLabel: ${storeLabel} | reredner`)
        //setLoading(true)
        setDataHandler(defaultStoreLabel, (storeLabel == defaultStoreLabel && regionLabel == defaultRegionLabel && districtLabel == defaultDistrictLabel))
    }, [storeLabel])

    useEffect(() => {
        resetSelected()
        setSearchInput("")
        setListIndex(50)
        setShowAllItem(false)
        Common.writeConsole(TAG, `type: ${type} | reredner`)
        Keyboard.dismiss()
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

                
                <HStack space="md" style={{paddingHorizontal: 10}}>
                    <Input variant="outline" size="md" style={{flex: 80}}>
                    <InputSlot style={{marginLeft: 10}}>
                        <InputIcon as={Search} style={{color: "#32b4f4"}}/>
                    </InputSlot>
                        <InputField placeholder={type == tag.infoViewUmbrellaRentalTab ? "Search by location or store name" : "Search by location"} value={searchInput} onChange={(e) => setSearchInput(e.nativeEvent.text)} />
                    </Input>

                    <Button variant="solid" size="md" onPress={() => {searchHandler(searchInput)}}>
                        <SendHorizonal size={20} color="white" />
                    </Button>
                </HStack>
                

                <Divider />
            </VStack>    

            {loading && 
                <Box style={{padding: 10}}>
                    <Spinner size="large" color="grey" />
                    <Text style={{textAlign: 'center'}}>Loading...</Text>
                </Box>
            }

            {(type == tag.infoViewRainfallTab && !loading) && 
                <Box>
                    <ScrollView ref={rainfallScrollRef}>
                        <VStack space="sm" style={[styles.paddingNav, {paddingTop: 10}]}>
                        {
                            rainfallJsonData.length == 0 ?
                                <Box style={{padding: 10}}>
                                    <Text style={{textAlign: 'center'}}>No data</Text>
                                </Box>
                            :
                            rainfallJsonData.map((item) => (
                                <Box key={item.id} style={{paddingHorizontal: 10}}>
                                    <RainRelateListItem type={type} item={item} openMapMarkerModal={openMapMarkerModal}/>
                                </Box>
                            ))
                        }
                        </VStack>
                    </ScrollView>
                </Box>
            }

            {(type == tag.infoViewFloodingTab && !loading) && 
                <Box>
                    <ScrollView ref={floodingScrollRef}>
                        <VStack space="sm" style={[styles.paddingNav, {paddingTop: 10}]}>
                        {
                            floodingJsonData.length == 1 ?
                                <Box style={{padding: 10}}>
                                    <Text style={{textAlign: 'center'}}>No data</Text>
                                </Box>
                            :
                            floodingJsonData.map((item) => (
                                <Box key={item.id} style={{paddingHorizontal: 10}}>
                                    <RainRelateListItem type={type} item={item} openMapMarkerModal={openMapMarkerModal}/>
                                </Box>
                            ))
                        }
                        </VStack>
                    </ScrollView>
                </Box>
            }

            {(type == tag.infoViewUmbrellaRentalTab && !loading) && 
                <Box>
                    <ScrollView ref={umbrellaRentalScrollRef}>
                        <VStack space="sm" style={[styles.paddingNav, {paddingTop: 10}]}>
                        {
                            umbrellaRentalJson.length == 0 ?
                                <Box style={{padding: 10}}>
                                    <Text style={{textAlign: 'center'}}>No data</Text>
                                </Box>
                            :
                            umbrellaRentalJson.map((item, index) => ( index < listIndex ) && (
                                <Box key={item.id} style={{paddingHorizontal: 10}}>
                                    <RainRelateListItem type={type} item={item} openMapMarkerModal={openMapMarkerModal}/>
                                </Box>
                            ))
                        }

                        {!showAllItem &&
                            <Button variant="outline" size="md" action="primary" onPress={() => listStatusHandler()} style={{alignSelf: 'center'}}>
                                <ButtonText style={styles.infoPageSubNavText}>Show All</ButtonText>
                            </Button>
                        }
                        </VStack>
                    </ScrollView>
                </Box>
            }
        </Box>
    )
}