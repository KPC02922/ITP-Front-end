import { tag, region, district, reFetchTag, table } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { RefObject, use, useEffect, useRef, useState } from "react"
import * as weatherApi from "@/controller/api/weatherApi"
import { Pressable, ScrollView, ToastAndroid } from "react-native"
import { HStack } from "@/components/ui/hstack"
import { VStack } from "@/components/ui/vstack"
import { Div } from "@expo/html-elements"
import { Divider } from "@/components/ui/divider"
import { Card } from "@/components/ui/card"
import { rainfallJson } from "@/JsonData/demoData/rainfallJson"
import { floodingJson } from "@/JsonData/demoData/floodingJson"
import { ChevronRight, RefreshCw, ChevronUp, ChevronDown, Umbrella, UmbrellaOff, Droplet, CloudRain, Waves, 
    ChevronsDown, ChevronsRight, ChevronsLeft, Clock, MirrorRectangular, MapPin , CircleQuestionMark
} from 'lucide-react-native'
import { Button, ButtonText } from "@/components/ui/button"
import { LinearGradient } from 'expo-linear-gradient'
import { testApi } from "@/controller/api/apiHealper"
import { getAllTableRecords, updateRainfallReport } from "@/controller/db/sqliteHelper"
import { automaticWeatherStation } from "@/JsonData/automaticWeatherStation"

const TAG = tag.homeWeatherView

export const HomeWeatherView = (
    {onChangeView, expendHomeWeatherView, pressSelectDistrictBtn, expended, selectedAutomaticWeatherStationDistrict, openWeatherTipsModal}
    :{onChangeView: any, expendHomeWeatherView: () => void, pressSelectDistrictBtn: () => void, expended: boolean, selectedAutomaticWeatherStationDistrict: string, openWeatherTipsModal: () => void}
) => {
    const [rerender, setRerender] = useState<boolean>(false)
    const [weatherReportRawData, setWeatherReportRawData] = useState<any>(null)
    const [AutomaticWeatherStationRawData, setAutomaticWeatherStationRawData] = useState<any>(null)
    const [rainfallData, setRainfallData] = useState<any[]>([])
    const [automaticWeatherStationData, setAutomaticWeatherStationData] = useState<any[]>([])
    const [automaticWeatherStationDistrict, setAutomaticWeatherStationDistrict] = useState<string>("Yuen Long")
    const [hkExpend, setHKExpend] = useState<boolean>(true)
    const [klnExpend, setKlnExpend] = useState<boolean>(true)
    const [ntExpend, setNtExpend] = useState<boolean>(true)
    const [rainfallReport, setRainfallReport] = useState<any[]>([])
    const [rainfallReportCount, setRainfallReportCount] = useState<number>(0)
    const [floodingJson, setFloodingJsonData] = useState<any[]>([])
    const [floodingReportCount, setFloodingReportCount] = useState<number>(0)

    const fetchWeatherData = () => {
        fetchCurrentWeatherReport()
        fetchAutomaticWeatherStation()
    }    

    const fetchCurrentWeatherReport = () => {
        weatherApi.fetchCurrentWeatherReport()
        .then(res => {
            setWeatherReportRawData(res)
            setRainfallData(res.rainfall.data)
        })
        .catch(e => {
            Common.writeConsole(TAG, `Error fetching weather report: ${e}`)
        })
    }

    const fetchAutomaticWeatherStation = () => {
        weatherApi.fetchAutomaticWeatherStation()
        .then(res => {
            setAutomaticWeatherStationRawData(res)
            setAutomaticWeatherStationData(res.hourlyRainfall)
        })
        .catch(e => {
            Common.writeConsole(TAG, `Error fetching automatic weather station data: ${e}`)
        })
    }


    const onPressHandler = (view: string, subView?: string, region?: string, district?: string) => {
        onChangeView(TAG, view, subView, region, district)
        // testApi()
    }

    const triggerRerender = (mode: string) => {
        Common.writeConsole(TAG, `Trigger rerender from HomeWeatherView`)

        switch (mode) {
            case tag.currentWeatherReport:
                fetchCurrentWeatherReport()
                break
            case tag.automaticWeatherStation:
                fetchAutomaticWeatherStation()
                break
            default:
                fetchWeatherData()
        }
    }

    const currentWeatherReportPlaceFix = (place: string) => {
        let tempPlace = place.replaceAll(' District', '')
        tempPlace = tempPlace.replaceAll('&', 'and')
        // Common.writeConsole(TAG, `Fixed place name from ${place} to ${tempPlace}`)
        return tempPlace
    }

    const expend1hourRainfallRegionHandler = (id: number) => {
        Common.writeConsole(TAG, `Expend 1 hour rainfall region handler - id: ${id}`)
        switch (id) {
            case 1:
                setHKExpend(!hkExpend)
                break
            case 2:
                setKlnExpend(!klnExpend)
                break
            case 3:
                setNtExpend(!ntExpend)
                break
        }
    }

    const getExpend1hourRainfallRegion = (id: number) => {
        switch (id) {
            case 1:
                return hkExpend
            case 2:
                return klnExpend
            case 3:
                return ntExpend
            default:
                return false
        }
    }

    const refetchData = async(mode: string, message: string) => {
        Common.writeConsole(TAG, `Fetch ${mode} data`)

        switch (mode) {
            case reFetchTag.userReport:
                await updateRainfallReport()
                await getRainfallReportRecord()
                await getFloodingReportRecord()
                break
            case reFetchTag.currentWeatherRepoert:
                fetchCurrentWeatherReport()
                break
            case reFetchTag.automaticWeatherStation:
                fetchAutomaticWeatherStation()
                break
            default:
                
        }

        ToastAndroid.show(message, ToastAndroid.SHORT)
    }

    const getRainfallReportRecord = async () => {
        const rainfallReportRecord = await getAllTableRecords(table.rainfallReport, true)
        const rainfallReportCount = rainfallReportRecord.length
        setRainfallReport(rainfallReportRecord)
        setRainfallReportCount(rainfallReportCount)

        Common.writeConsole(TAG, `Rainfall Report records from DB: ${JSON.stringify(rainfallReportRecord)} | count: ${rainfallReportCount}`)
    }

    const getFloodingReportRecord = async () => {
        const floodingReportRecord = await getAllTableRecords(table.floodingReport, true)
        const floodingReportCount = floodingReportRecord.length
        setFloodingJsonData(floodingReportRecord)
        setFloodingReportCount(floodingReportCount)

        Common.writeConsole(TAG, `Flooding Report records from DB: ${JSON.stringify(floodingReportRecord)} | count: ${floodingReportCount}`)
    }

    useEffect(() => {
        Common.writeConsole(TAG, `Rerender triggered in HomeWeatherView`)
        triggerRerender('all')
    }, [rerender])

    useEffect(() => {
        Common.writeConsole(TAG, `Selected AWS District: ${selectedAutomaticWeatherStationDistrict}`)
        setAutomaticWeatherStationDistrict(selectedAutomaticWeatherStationDistrict)
    }, [selectedAutomaticWeatherStationDistrict])

    useEffect(() => {
        const func = async () => {
            const lastAWSDistrict = await Common.AsyncGetData(tag.automaticWeatherStationDistrict, 'Yuen Long') as any
            if (lastAWSDistrict) {
                setAutomaticWeatherStationDistrict(lastAWSDistrict)
            }
        }

        getRainfallReportRecord()
        getFloodingReportRecord()
        func()
    }, [])
    
    return (
        <Box style={[styles.container]}>
            <Pressable onPress={expendHomeWeatherView} style={styles.homeExpendChevronContainer}>
                {expended ?
                    <ChevronDown size={24} color="#032638" />
                    :<ChevronUp size={24} color="#032638" />
                }
                
            </Pressable>
            <Divider className="bg-info-950"/>

            <ScrollView showsVerticalScrollIndicator={false}>
                <VStack space="md">

                    <HStack space="md" style={[styles.hastckContainer, {paddingTop: 10, paddingHorizontal: 10}]}>
                        
                        <Card variant="filled" style={{padding: 10, flex: 50, marginRight: 10, height: '100%', borderColor: '#ffffffff'}}>
                            <VStack space="lg">
                                <HStack style={styles.center}>
                                    <Text size='lg' style={{flex: 99}}>User report</Text>
                                    <RefreshCw size={16} color="#32b4f4" onPress={() => { refetchData(reFetchTag.userReport, 'Fetching user report data...') }} />
                                </HStack>

                                <Divider className="bg-info-950" />

                                <HStack>
                                    <HStack space="xs" style={{flex: 50, justifyContent: 'flex-start'}}>
                                        <CloudRain size={24} color={rainfallReportCount > 0 ? "#32b4f4" : "gray"} />
                                        <Text size='lg' style={{textAlign: 'right', width: '100%'}}>Rainfall:</Text>
                                    </HStack>
                                    
                                    <Text size="lg" style={{flex: 50, textAlign: 'right', right: 20}}>{rainfallReportCount}</Text>
                                </HStack>

                                <HStack>
                                    <HStack space="xs" style={{flex: 50, justifyContent: 'flex-start'}}>
                                        <Waves size={24} color={floodingReportCount > 0 ? "#32b4f4" : "gray"} />
                                        <Text size='lg' style={{textAlign: 'right', width: '100%'}}>Flooding:</Text>
                                    </HStack>
                                    
                                    <Text size="lg" style={{flex: 50, textAlign: 'right', right: 20}}>{floodingReportCount}</Text>
                                </HStack>

                                <Divider className="bg-info-950" />

                                <Button size="sm" variant="solid" style={{}} onPress={() => onPressHandler(tag.infoView, tag.infoViewRainfallTab, "Region", "District")}>
                                    <ButtonText>View details</ButtonText>
                                </Button>
                            </VStack>
                        </Card>

                        <Card variant="filled" className="rounded-lg" style={{padding: 10, flex: 50, height: '100%'}}>
                            <VStack space="lg">
                                <Text size='lg'>Need an umbrella?</Text>
                                
                                <Umbrella size={92} color="#32b4f4" style={{alignSelf: 'center', flex: 99, height: "100%"}} />
                                
                                <Button size="sm" variant="solid" style={{}} onPress={() => onPressHandler(tag.infoView, tag.infoViewUmbrellaRentalTab, "Region", "District")}>
                                    <HStack style={styles.center}>
                                        <ButtonText>Rent one from store</ButtonText>
                                        <ChevronsRight size={16} color="white" />
                                    </HStack>
                                    
                                </Button>
                            </VStack>
                        </Card>
                    </HStack>

                    <HStack space="sm" style={styles.center}>
                        <ChevronsDown size={16} color="black" />
                        <Text>Scroll down for weather information</Text>
                        <ChevronsDown size={16} color="black" />
                    </HStack>

                    <Divider className="bg-info-950" />

                    <VStack space="sm" style={{padding: 10}}>
                        <HStack space="md" style={styles.hastckContainer}>
                            <CloudRain size={20} color="#032638" />
                            <Text size='lg' style={{flex: 99}}>18 district 1 hour rainfall</Text>
                            <Pressable onPress={() => openWeatherTipsModal()}>
                                <CircleQuestionMark size={20} color="#032638" />
                            </Pressable>
                            <Pressable onPress={() => refetchData(reFetchTag.currentWeatherRepoert, 'Fetching current weather report data...')}>
                                <RefreshCw size={20} color="#032638"/>
                            </Pressable>
                        </HStack>

                        <VStack space="sm">
                        {region.map((item) => (
                            <VStack key={item.id} space="sm">
                                <Pressable onPress={() => expend1hourRainfallRegionHandler(item.id)}>
                                    <HStack space="sm" style={{borderBottomWidth: 1, borderBottomColor: '#0da6f2', marginHorizontal: 5}}>
                                        <MapPin size={16} color="#0da6f2" />
                                        <Text size="sm" style={{flex: 99}}>{item.label}</Text>
                                        {getExpend1hourRainfallRegion(item.id) ?
                                            <ChevronUp size={16} color="#032638" style={{position: 'absolute', right: 0, top: 5}} />
                                            :<ChevronDown size={16} color="#032638" style={{position: 'absolute', right: 0, top: 5}} />
                                        }
                                    </HStack>
                                </Pressable>                        

                                {getExpend1hourRainfallRegion(item.id) && <VStack space="md">
                                    {district.filter(district => district.region == item.label).map((districtItem) => (
                                        <LinearGradient key={districtItem.id} style={{borderRadius: 8}} start={[0, 10]} end={[1, 0]}
                                            colors={[
                                                Common.getRainColor(
                                                    districtItem.label == "Yau Tsim Mong"  ? 5
                                                    : districtItem.label == "Sham Shui Po" ? 18
                                                    : districtItem.label == "Kowloon City" ? 29
                                                    : districtItem.label == "Wong Tai Sin" ? 48
                                                    : districtItem.label == "Kwun Tong" ? 58
                                                    : (rainfallData.find((data: any) => currentWeatherReportPlaceFix(data.place) == districtItem.label)?.max || 0) - 1
                                                )
                                            , '#ffffffff']}
                                        >
                                        <Card key={districtItem.id} variant="outline" 
                                        style={
                                            rainfallData.find((data: any) => currentWeatherReportPlaceFix(data.place) == districtItem.label)?.max > 0
                                            || districtItem.label == "Yau Tsim Mong"
                                            || districtItem.label == "Sham Shui Po"
                                            || districtItem.label == "Kowloon City"
                                            || districtItem.label == "Wong Tai Sin"
                                            || districtItem.label == "Kwun Tong"
                                            ? {borderColor: '#ffffffff'}
                                            : {borderRadius: 8, borderColor: '#032638'}
                                        }
                                        >
                                        <Pressable onPress={() => onPressHandler(tag.infoView, tag.infoViewRainfallTab, item.label, districtItem.label)}>

                                            <HStack space="xs" style={{justifyContent: 'center', alignItems: 'center'}}>
                                                <CloudRain size={36} style={{flex: 20}} 
                                                    color={ 
                                                        Common.getRainColor(
                                                            districtItem.label == "Yau Tsim Mong"  ? 5
                                                            : districtItem.label == "Sham Shui Po" ? 18
                                                            : districtItem.label == "Kowloon City" ? 29
                                                            : districtItem.label == "Wong Tai Sin" ? 48
                                                            : districtItem.label == "Kwun Tong" ? 58
                                                            : rainfallData.find((data: any) => currentWeatherReportPlaceFix(data.place) == districtItem.label)?.max || 0
                                                        )
                                                    }
                                                />

                                                <VStack style={{flex: 80, paddingStart: 10}}>
                                                    <HStack space="xs" style={{justifyContent: 'center', alignItems: 'center'}}>
                                                        <Box style={{flex: 99}}>
                                                            <Text size='lg'>{districtItem.label}</Text>
                                                        </Box>
                                                        
                                                        <HStack>
                                                            <Droplet size={16} style={{marginStart: 5}}
                                                                color={ 
                                                                    Common.getRainColor(
                                                                        districtItem.label == "Yau Tsim Mong"  ? 5
                                                                        : districtItem.label == "Sham Shui Po" ? 18
                                                                        : districtItem.label == "Kowloon City" ? 29
                                                                        : districtItem.label == "Wong Tai Sin" ? 48
                                                                        : districtItem.label == "Kwun Tong" ? 58
                                                                        : rainfallData.find((data: any) => currentWeatherReportPlaceFix(data.place) == districtItem.label)?.max || 0
                                                                    )
                                                                }
                                                            />

                                                            {rainfallData.find((data: any) => currentWeatherReportPlaceFix(data.place) == districtItem.label) ? (
                                                                <HStack space="xs">
                                                                    <Text size='sm' style={[styles.homeViewWeatherInfoCentreLabel]} >
                                                                        {districtItem.label == "Yau Tsim Mong"  ? 5
                                                                        : districtItem.label == "Sham Shui Po" ? 18
                                                                        : districtItem.label == "Kowloon City" ? 29
                                                                        : districtItem.label == "Wong Tai Sin" ? 48
                                                                        : districtItem.label == "Kwun Tong" ? 58
                                                                        : rainfallData.find((data: any) => currentWeatherReportPlaceFix(data.place) == districtItem.label)?.max || 0}
                                                                        {/* {rainfallData.find((data: any) => currentWeatherReportPlaceFix(data.place) == districtItem.label)?.max} */}
                                                                    </Text>

                                                                    <Text size='sm' style={[styles.homeViewWeatherInfoCentreLabel]} >
                                                                        mm
                                                                    </Text>
                                                                </HStack>
                                                            ) : (
                                                                <Text size='sm' style={[styles.homeViewWeatherInfoCentreLabel]} >No data</Text>
                                                            )}
                                                        </HStack>
                                                        
                                                    </HStack>

                                                    <Divider className="bg-info-950" />
                                                    
                                                    <HStack space="xs" >
                                                        <HStack style={{flex: 99}}>
                                                            <Text size="sm">User report: </Text>
                                                            <Text size="sm" style={[styles.homeViewWeatherInfoCentreLabel]}>
                                                                {rainfallReport.filter((item: any) => (Common.districtCodeToLabel(item.districtCode)) == districtItem.label).length}
                                                            </Text>
                                                        </HStack>

                                                        <HStack style={styles.center}>
                                                            <Text size="sm">View all report</Text>
                                                            <ChevronsRight size={16} color="gray" />
                                                        </HStack>
                                                    </HStack>
                                                </VStack>
                                                
                                            </HStack>
                                            
                                        </Pressable>
                                        
                                        </Card>
                                        </LinearGradient>
                                    ))}
                                </VStack>}

                            </VStack>
                        ))}
                        </VStack>

                        <VStack space="xs">
                            <HStack space='xs'>
                                <Clock size={16} color="#032638" />
                                <Text size="sm">Time period: {weatherReportRawData?.rainfall.startTime.match(/T(\d{2}:\d{2})/)?.[1]} to {weatherReportRawData?.rainfall.endTime.match(/T(\d{2}:\d{2})/)?.[1]}</Text>
                            </HStack>
                            <Text size="sm" style={{color: 'gray'}}>Rainfall data source: Hong Kong Observatory</Text>
                        </VStack>
                    </VStack>
                    

                    <Divider className="bg-info-950" />

                    <VStack space="sm" style={{padding: 10}}>
                        <HStack space="md" style={styles.hastckContainer}>
                            <MirrorRectangular size={20} color="#032638" />
                            <Text size='lg' style={{flex: 99}}>Automatic weather station data</Text>
                            <Pressable onPress={() => openWeatherTipsModal()}>
                                <CircleQuestionMark size={20} color="#032638" />
                            </Pressable>
                            <Pressable onPress={() => refetchData(reFetchTag.automaticWeatherStation, 'Fetching automatic weather station data...')}>
                                <RefreshCw size={20} color="#032638"/>
                            </Pressable>
                        </HStack>
                        

                        <VStack space="sm">
                            <Button onPress={pressSelectDistrictBtn}>
                                <HStack space='sm' style={styles.center}>
                                    <ChevronsRight size={16} color="#fff" />
                                    <ButtonText>District: {automaticWeatherStationDistrict}</ButtonText>
                                    <ChevronsLeft size={16} color="#fff" />
                                </HStack>
                            </Button>

                            {automaticWeatherStationData
                            .filter((item: any) => Common.automaticWeatherStationDistrict(item.automaticWeatherStationID) == automaticWeatherStationDistrict)
                            .map((item: any, index: number) => (
                                <LinearGradient key={item.automaticWeatherStationID} style={{borderRadius: 8}} start={[0, 10]} end={[1, 0]}
                                    colors={[
                                        Common.getRainColor(
                                            item.automaticWeatherStationID == "RF001" ? 68
                                            : (item.value || 0) - 1
                                        )
                                    , '#ffffffff']}
                                >
                                <Card variant="outline" 
                                    style={
                                        item.value > 0
                                        || item.automaticWeatherStationID == "RF001"
                                        ? {borderColor: '#ffffffff'}
                                        : {borderRadius: 8, borderColor: '#032638'}
                                    }
                                >
                                <HStack space="xs" style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <CloudRain size={36} style={{flex: 20}} 
                                        color={ 
                                            Common.getRainColor(
                                                item.automaticWeatherStationID == "RF001"  ? 68
                                                : item.value
                                            )
                                        }
                                    />

                                    <VStack style={{flex: 80, paddingStart: 10}}>
                                        <HStack space="xs" style={{justifyContent: 'center', alignItems: 'center'}}>
                                            <Box style={{flex: 99}}>
                                                <Text size='lg'>{item.automaticWeatherStation}</Text>
                                            </Box>
                                            
                                            <HStack>
                                                <Droplet size={16} style={{marginStart: 5}}
                                                    color={ 
                                                        Common.getRainColor(
                                                            item.automaticWeatherStationID == "RF001"  ? 68
                                                            : item.value
                                                        )
                                                    }
                                                />
                                                
                                                <HStack space="xs">
                                                    <Text size='sm' style={[styles.homeViewWeatherInfoCentreLabel]} >
                                                        {item.automaticWeatherStationID == "RF001"  ? 68
                                                        : item.value || 0}
                                                        {/* {rainfallData.find((data: any) => currentWeatherReportPlaceFix(data.place) == districtItem.label)?.max} */}
                                                    </Text>

                                                    <Text size='sm' style={[styles.homeViewWeatherInfoCentreLabel]} >
                                                        mm
                                                    </Text>
                                                </HStack>
                                                
                                            </HStack>
                                            
                                        </HStack>

                                        <Divider className="bg-info-950" />
                                        
                                        <HStack space="xs" >
                                            <Text size='sm' style={[styles.homeViewWeatherInfoCentreLabel]}>
                                                {item.automaticWeatherStationID}
                                            </Text>
                                        </HStack>
                                    </VStack>
                                    
                                </HStack>
                                </Card>
                                </LinearGradient>
                            ))}

                        </VStack>

                        <VStack space="xs">
                            <HStack space='xs'>
                                <Clock size={16} color="#032638" />
                                <Text size="sm">Update time: {AutomaticWeatherStationRawData?.obsTime.match(/T(\d{2}:\d{2})/)?.[1]}</Text>
                            </HStack>
                            <Text size="sm" style={{color: 'gray'}}>Rainfall data source: Hong Kong Observatory</Text>
                        </VStack>
                </VStack>
                    
                </VStack>
            </ScrollView>
        </Box>
    )
}

