import { tag } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { use, useEffect, useRef, useState } from "react"
import * as weatherApi from "@/controller/api/weatherApi"
import { Pressable, ScrollView } from "react-native"
import { HStack } from "@/components/ui/hstack"
import { VStack } from "@/components/ui/vstack"
import { Div } from "@expo/html-elements"
import { Divider } from "@/components/ui/divider"
import { Card } from "@/components/ui/card"
import { rainfallJson } from "@/demoData/rainfallJson"
import { floodingJson } from "@/demoData/floodingJson"
import { ChevronRight, RefreshCw } from 'lucide-react-native'

const TAG = tag.homeWeatherView

export const HomeWeatherView = ({onChangeView}: {onChangeView: any}) => {
    const [rerender, setRerender] = useState<boolean>(false)
    const [weatherReportRawData, setWeatherReportRawData] = useState<any>(null)
    const [AutomaticWeatherStationRawData, setAutomaticWeatherStationRawData] = useState<any>(null)
    const [rainfallData, setRainfallData] = useState<any[]>([])
    const [automaticWeatherStationData, setAutomaticWeatherStationData] = useState<any[]>([])
    const filterValue = 0

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


    const onPressHandler = (view: string, subView?: string) => {
        onChangeView(TAG, view, subView)
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

    useEffect(() => {
        Common.writeConsole(TAG, `Rerender triggered in HomeWeatherView`)
        triggerRerender('all')
    }, [rerender])

    useEffect(() => {
        
    }, [])
    
    return (
        <Box>
            <ScrollView showsVerticalScrollIndicator={false}>
                <VStack space="sm">

                    <VStack space="sm" style={{padding: 10}}>
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
                                <Pressable onPress={() => onPressHandler(tag.infoView, tag.infoViewUmbrellaRentalTab)}>
                                    <HStack space="sm" style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <Text size='md' style={styles.homeViewWeatherInfoCentreLabel}>Find where could rent umbrellas</Text>
                                        <ChevronRight size={20} color="black"/>
                                    </HStack>
                                </Pressable>
                            </Card>

                            <Pressable onPress={() => triggerRerender('api')}>
                                <RefreshCw size={16} color="black"/>
                            </Pressable>
                        </HStack>

                    </VStack>

                    <Divider />

                    {rainfallData && 
                    <VStack space="sm" style={{padding: 10}}>
                        <HStack space="md" style={styles.hastckContainer}>
                            <Text size='md' style={{flex: 99}}>18 district 1 hour rainfall</Text>
                            <Pressable onPress={() => triggerRerender(tag.currentWeatherReport)}>
                                <RefreshCw size={16} color="black"/>
                            </Pressable>
                        </HStack>
                            
                        {rainfallData.length > 0 
                        ? <VStack space="sm">
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <HStack space="md">

                                    {rainfallData.map((item: any, index: number) => (
                                        <Card key={index}  variant="outline" className="rounded-lg">
                                            <VStack key={index}>
                                                <Text size='sm' style={[styles.homeViewWeatherInfoCentreLabel, {width: 60, height: 40}]} >{item.place.replaceAll('District', '')}</Text>
                                                
                                                <Divider style={{width: '100%'}} />

                                                <HStack space="xs" style={{justifyContent: 'center', alignItems: 'center'}}>
                                                    <Text size='sm' style={[styles.homeViewWeatherInfoCentreLabel]} >{item.max}</Text>
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
                            <Text size='md'>No rainfall data available</Text>
                        </Card>
                        }
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

