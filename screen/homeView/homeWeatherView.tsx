import { tag, region, district } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { RefObject, use, useEffect, useRef, useState } from "react"
import * as weatherApi from "@/controller/api/weatherApi"
import { Pressable, ScrollView } from "react-native"
import { HStack } from "@/components/ui/hstack"
import { VStack } from "@/components/ui/vstack"
import { Div } from "@expo/html-elements"
import { Divider } from "@/components/ui/divider"
import { Card } from "@/components/ui/card"
import { rainfallJson } from "@/demoData/rainfallJson"
import { floodingJson } from "@/demoData/floodingJson"
import { ChevronRight, RefreshCw, ChevronUp, ChevronDown, Umbrella, UmbrellaOff, Droplet, CloudRain, Waves, ChevronsDown, ChevronsRight } from 'lucide-react-native'
import { Button, ButtonText } from "@/components/ui/button"

const TAG = tag.homeWeatherView

export const HomeWeatherView = (
    {onChangeView, expendHomeWeatherView, expended}
    :{onChangeView: any, expendHomeWeatherView: () => void, expended: boolean}
) => {
    const [rerender, setRerender] = useState<boolean>(false)
    const [weatherReportRawData, setWeatherReportRawData] = useState<any>(null)
    const [AutomaticWeatherStationRawData, setAutomaticWeatherStationRawData] = useState<any>(null)
    const [rainfallData, setRainfallData] = useState<any[]>([])
    const [automaticWeatherStationData, setAutomaticWeatherStationData] = useState<any[]>([])
    const [hkExpend, setHKExpend] = useState<boolean>(true)
    const [klnExpend, setKlnExpend] = useState<boolean>(true)
    const [ntExpend, setNtExpend] = useState<boolean>(true)
    const filterValue = -1

    const fetchWeatherData = () => {
        fetchCurrentWeatherReport()
        fetchAutomaticWeatherStation()
    }    

    const fetchCurrentWeatherReport = () => {
        weatherApi.fetchCurrentWeatherReport()
        .then(res => {
            setWeatherReportRawData(res)
            setRainfallData(res.rainfall.data.filter((item: any) => item.max > filterValue))
        })
        .catch(e => {
            Common.writeConsole(TAG, `Error fetching weather report: ${e}`)
        })
    }

    const fetchAutomaticWeatherStation = () => {
        weatherApi.fetchAutomaticWeatherStation()
        .then(res => {
            setAutomaticWeatherStationRawData(res)
            setAutomaticWeatherStationData(res.hourlyRainfall.filter((item: any) => item.value > filterValue))
        })
        .catch(e => {
            Common.writeConsole(TAG, `Error fetching automatic weather station data: ${e}`)
        })
    }


    const onPressHandler = (view: string, subView?: string, region?: string, district?: string) => {
        onChangeView(TAG, view, subView, region, district)
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
        Common.writeConsole(TAG, `Fixed place name from ${place} to ${tempPlace}`)
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

    useEffect(() => {
        Common.writeConsole(TAG, `Rerender triggered in HomeWeatherView`)
        triggerRerender('all')
    }, [rerender])

    useEffect(() => {
        
    }, [])
    
    return (
        <Box style={[styles.container]}>
            <Pressable onPress={expendHomeWeatherView} style={styles.homeExpendChevronContainer}>
                {expended ?
                    <ChevronDown size={20} color="black" />
                    :<ChevronUp size={20} color="black" />
                }
            </Pressable>

            <ScrollView showsVerticalScrollIndicator={false}>
                <VStack space="md">

                    <HStack space="md" style={[styles.hastckContainer, {paddingTop: 10, paddingHorizontal: 10}]}>
                        <Card variant="filled" className="rounded-lg" style={{padding: 10, flex: 50, marginRight: 10, height: '100%'}}>
                            <VStack space="lg">
                                <HStack style={styles.center}>
                                    <Text size='lg' style={{flex: 99}}>User report</Text>
                                    <RefreshCw size={16} color="black" onPress={() => {}} />
                                </HStack>

                                <Divider />

                                <HStack>
                                    <HStack space="xs" style={{flex: 50, justifyContent: 'flex-start'}}>
                                        <CloudRain size={24} color={rainfallJson.length > 0 ? "#007AFF" : "gray"} />
                                        <Text size='lg' style={{textAlign: 'right', width: '100%'}}>Rainfall:</Text>
                                    </HStack>
                                    
                                    <Text size="lg" style={{flex: 50, textAlign: 'right', right: 20}}>{rainfallJson.length}</Text>
                                </HStack>

                                <HStack>
                                    <HStack space="xs" style={{flex: 50, justifyContent: 'flex-start'}}>
                                        <Waves size={24} color={floodingJson.length > 1 ? "#007AFF" : "gray"} />
                                        <Text size='lg' style={{textAlign: 'right', width: '100%'}}>Flooding:</Text>
                                    </HStack>
                                    
                                    <Text size="lg" style={{flex: 50, textAlign: 'right', right: 20}}>{floodingJson.length - 1}</Text>
                                </HStack>

                                <Divider />

                                <Button size="sm" variant="solid" style={{}} onPress={() => onPressHandler(tag.infoView, tag.infoViewRainRelatedTab, "Region", "District")}>
                                    <ButtonText>View Details</ButtonText>
                                </Button>
                            </VStack>
                        </Card>

                        <Card variant="filled" className="rounded-lg" style={{padding: 10, flex: 50, height: '100%'}}>
                            <VStack space="lg">
                                <Text size='lg'>Need an umbrella?</Text>
                                
                                <Umbrella size={92} color="#007AFF" style={{alignSelf: 'center', flex: 99, height: "100%"}} />
                                
                                <Button size="sm" variant="solid" style={{}} onPress={() => onPressHandler(tag.infoView, tag.infoViewUmbrellaRentalTab, "Region", "District")}>
                                    <HStack style={styles.center}>
                                        <ButtonText>Explore store</ButtonText>
                                        <ChevronsRight size={16} color="white" />
                                    </HStack>
                                    
                                </Button>
                            </VStack>
                        </Card>
                    </HStack>

                    <HStack space="sm" style={styles.center}>
                        <ChevronsDown size={16} color="black" />
                        <Text>Scroll Down for weather information</Text>
                        <ChevronsDown size={16} color="black" />
                    </HStack>
                    
                    {/* <VStack space="sm" style={{padding: 10}}>
                        <HStack space="xs" style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <Card variant="outline" className="rounded-lg" style={{padding: 10, flex: 50, marginRight: 20}}>
                                <Pressable onPress={() => onPressHandler(tag.infoView, tag.infoViewRainfallTab)}>
                                    <HStack space="sm" style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <Text size='md' style={styles.homeViewWeatherInfoCentreLabel}>Rainfall: {rainfallJson.length}</Text>
                                        <ChevronRight size={20} color="black"/>
                                    </HStack>
                                </Pressable>
                            </Card>

                            <Card variant="outline" className="rounded-lg" style={{padding: 10, flex: 50}}>
                                <Pressable onPress={() => onPressHandler(tag.infoView, tag.infoViewFloodingTab)}>
                                    <HStack space="sm" style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <Text size='md' style={styles.homeViewWeatherInfoCentreLabel}>Flooding: {floodingJson.length - 1}</Text>
                                        <ChevronRight size={20} color="black"/>
                                    </HStack>
                                </Pressable>
                            </Card>
                        </HStack>

                        <HStack style={styles.hastckContainer}>
                            <Card variant="outline" className="rounded-lg" style={{padding: 10, flex: 90, marginRight: 20}}>
                                <Pressable onPress={() => onPressHandler(tag.infoView, tag.infoViewUmbrellaRentalTab, "Region", "District")}>
                                    <HStack space="sm" style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <Text size='md' style={styles.homeViewWeatherInfoCentreLabel}>Need an umbrella?</Text>
                                        <ChevronRight size={20} color="black"/>
                                    </HStack>
                                </Pressable>
                            </Card>

                            <Pressable onPress={() => triggerRerender('api')}>
                                <RefreshCw size={16} color="black"/>
                            </Pressable>
                        </HStack>

                    </VStack> */}

                    <Divider />

                    {rainfallData && 
                    <VStack space="sm" style={{padding: 10}}>
                        <HStack space="md" style={styles.hastckContainer}>
                            <Text size='md' style={{flex: 99}}>18 district 1 hour rainfall</Text>
                            <Pressable onPress={() => triggerRerender(tag.currentWeatherReport)}>
                                <RefreshCw size={16} color="black"/>
                            </Pressable>
                        </HStack>

                        <VStack space="sm">
                        {region.map((item) => (
                            <VStack key={item.id} space="sm">
                                <Pressable onPress={() => expend1hourRainfallRegionHandler(item.id)}>
                                    <Text style={{width: '100%', borderBottomWidth: 1, borderBottomColor: '#E0E0E0'}}>{item.label}</Text>
                                    {getExpend1hourRainfallRegion(item.id) ?
                                        <ChevronUp size={16} color="black" style={{position: 'absolute', right: 0, top: 5}} />
                                        :<ChevronDown size={16} color="black" style={{position: 'absolute', right: 0, top: 5}} />
                                    }
                                    
                                </Pressable>                        

                                {getExpend1hourRainfallRegion(item.id) && <VStack space="md">
                                    {district.filter(district => district.region == item.label).map((districtItem) => (
                                        <Card key={districtItem.id} variant="outline" className="rounded-lg">
                                        <Pressable onPress={() => onPressHandler(tag.infoView, tag.infoViewRainfallTab, item.label, districtItem.label)}>

                                            <HStack space="xs" style={{justifyContent: 'center', alignItems: 'center'}}>
                                                { rainfallData.find((data: any) => currentWeatherReportPlaceFix(data.place) == districtItem.label)?.max > 0
                                                    || rainfallJson.filter((item: any) => (Common.districtCodeToLabel(item.districtCode)) == districtItem.label).length > 0
                                                    ?<CloudRain size={36} color="#007AFF" style={{flex: 20}}/>
                                                    :<CloudRain size={36} color="gray" style={{flex: 20}}/>
                                                }

                                                <VStack style={{flex: 80, paddingStart: 10}}>
                                                    <HStack space="xs" style={{justifyContent: 'center', alignItems: 'center'}}>
                                                        <Box style={{flex: 99}}>
                                                            <Text size='lg'>{districtItem.label}</Text>
                                                        </Box>
                                                        
                                                        <HStack>
                                                            <Droplet size={16} color="#007AFF" style={{marginStart: 5}}/>

                                                            {rainfallData.find((data: any) => currentWeatherReportPlaceFix(data.place) == districtItem.label) ? (
                                                                <HStack space="xs">
                                                                    <Text size='sm' style={[styles.homeViewWeatherInfoCentreLabel]} >
                                                                        {rainfallData.find((data: any) => currentWeatherReportPlaceFix(data.place) == districtItem.label)?.max}
                                                                    </Text>

                                                                    <Text size='sm' style={[styles.homeViewWeatherInfoCentreLabel]} >
                                                                        {rainfallData.find((data: any) => currentWeatherReportPlaceFix(data.place) == districtItem.label)?.unit}
                                                                    </Text>
                                                                </HStack>
                                                            ) : (
                                                                <Text size='sm' style={[styles.homeViewWeatherInfoCentreLabel]} >No data</Text>
                                                            )}
                                                        </HStack>
                                                        
                                                    </HStack>

                                                    <Divider/>
                                                    
                                                    <HStack space="xs" >
                                                        <HStack style={{flex: 99}}>
                                                            <Text size="sm">Number of report: </Text>
                                                            <Text size="sm" style={[styles.homeViewWeatherInfoCentreLabel]}>
                                                                {rainfallJson.filter((item: any) => (Common.districtCodeToLabel(item.districtCode)) == districtItem.label).length}
                                                            </Text>
                                                        </HStack>

                                                        <HStack>
                                                            <Text size="sm">View all report</Text>
                                                            <ChevronRight size={16} color="black" />
                                                        </HStack>
                                                    </HStack>
                                                </VStack>
                                                
                                            </HStack>
                                            
                                        </Pressable>
                                        </Card>
                                    ))}
                                </VStack>}

                            </VStack>
                        ))}
                        </VStack>

                        <Text size="sm">Time period: {weatherReportRawData?.rainfall.startTime.match(/T(\d{2}:\d{2})/)?.[1]} to {weatherReportRawData?.rainfall.endTime.match(/T(\d{2}:\d{2})/)?.[1]}</Text>
                    </VStack>
                    }

                    <Divider />

                    {AutomaticWeatherStationRawData && 
                        <VStack space="sm" style={{padding: 10}}>
                            <HStack space="md" style={styles.hastckContainer}>
                                <Text size='md' style={{flex: 99}}>Automatic weather station data</Text>
                                <Pressable onPress={() => triggerRerender(tag.currentWeatherReport)}>
                                    <RefreshCw size={16} color="black"/>
                                </Pressable>
                            </HStack>
                            
                            {automaticWeatherStationData.length > 0 
                            ? <VStack space="sm">
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <HStack space="md">

                                        {automaticWeatherStationData.map((item: any, index: number) => (
                                            <Card key={index}  variant="outline" className="rounded-lg">
                                                <VStack key={index}>
                                                    <Text size='sm' style={[styles.homeViewWeatherInfoCentreLabel, {width: 60, height: 40}]} >{item.automaticWeatherStation}</Text>
                                                    
                                                    <Divider style={{width: '100%'}} />

                                                    <HStack space="xs" style={{justifyContent: 'center', alignItems: 'center'}}>
                                                        <Text size='sm' style={[styles.homeViewWeatherInfoCentreLabel]} >{item.value}</Text>
                                                        <Text size='sm' style={[styles.homeViewWeatherInfoCentreLabel]} >{item.unit}</Text>
                                                    </HStack>
                                                </VStack>
                                            </Card>
                                        ))}

                                    </HStack>
                                </ScrollView>
                            </VStack>
                            : 
                            <Card variant="outline" className="rounded-lg">
                                <Text size='md'>No automatic weather station data available</Text>
                            </Card>
                            }
                        <Text size="sm">Update time: {AutomaticWeatherStationRawData?.obsTime.match(/T(\d{2}:\d{2})/)?.[1]}</Text>
                    </VStack>
                    }
                </VStack>
            </ScrollView>
        </Box>
    )
}

