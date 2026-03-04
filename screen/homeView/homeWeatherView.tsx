import { tag } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { use, useEffect, useRef, useState } from "react"
import * as weatherApi from "@/controller/api/weatherApi"
import { ScrollView } from "react-native"
import { HStack } from "@/components/ui/hstack"
import { VStack } from "@/components/ui/vstack"
import { Div } from "@expo/html-elements"
import { Divider } from "@/components/ui/divider"
import { Card } from "@/components/ui/card"


const TAG = tag.homeWeatherView

export const HomeWeatherView = () => {
    const [rerender, setRerender] = useState<boolean>(false)
    const [weatherReportRawData, setWeatherReportRawData] = useState<any>(null)
    const [AutomaticWeatherStationRawData, setAutomaticWeatherStationRawData] = useState<any>(null)
    const [rainfallData, setRainfallData] = useState<any[]>([])
    const [automaticWeatherStationData, setAutomaticWeatherStationData] = useState<any[]>([])

    const fetchWeatherData = () => {
        weatherApi.fetchCurrentWeatherReport()
        .then(res => {
            setWeatherReportRawData(res)
            setRainfallData(res.rainfall.data.filter((item: any) => item.max > -1))
        })
        .catch(e => {
            Common.writeConsole(TAG, `Error fetching weather report: ${e}`)
        })

        weatherApi.fetchAutomaticWeatherStation()
        .then(res => {
            setAutomaticWeatherStationRawData(res)
            setAutomaticWeatherStationData(res.hourlyRainfall.filter((item: any) => item.value > -1))
        })
        .catch(e => {
            Common.writeConsole(TAG, `Error fetching automatic weather station data: ${e}`)
        })
    }
 
    useEffect(() => {
        Common.writeConsole(TAG, `Rerender triggered in HomeWeatherView`)
        fetchWeatherData()
    }, [rerender])

    useEffect(() => {
        
    }, [])
    
    return (
        <Box>
            <ScrollView>
                <VStack space="sm">

                    <Box>
                        <HStack space="xs" style={{width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                            <Card variant="outline" className="rounded-lg" style={{padding: 10, flex: 50, marginRight: 20}}>
                                <Text size='md' style={styles.homeViewWeatherInfoCentreLabel}>Rainfall report: 0</Text>
                            </Card>

                            <Card variant="outline" className="rounded-lg" style={{padding: 10, flex: 50}}>
                                <Text size='md' style={styles.homeViewWeatherInfoCentreLabel}>Flooding report: 0</Text>
                            </Card>
                        </HStack>

                    </Box>

                    <Divider />

                    {rainfallData && 
                    <VStack space="sm" style={{padding: 10}}>
                        <Text size='md'>18 district 1 hour rainfall</Text>
                            
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
                        <Text size='md'>Automatic Weather Station Data</Text>
                            
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

