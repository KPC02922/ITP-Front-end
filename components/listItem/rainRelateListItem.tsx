import { tag, region, district } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import RainRelateType from "@/interfcaeType/RainRelateType"
import { Card } from "../ui/card"
import { Text } from "../ui/text"
import { Droplet, Map, Clock, MapPin, CloudRain, MapPinned, Store } from 'lucide-react-native'
import { HStack } from "../ui/hstack"
import { Box } from "../ui/box"
import { useEffect, useState } from "react"
import { Button, ButtonText } from "../ui/button"
import { VStack } from "../ui/vstack"
import { Divider } from "../ui/divider"

const TAG = tag.rainRelateListItem

export const RainRelateListItem = (
    {type, item, openMapMarkerModal}:
    {type: string, item: RainRelateType, openMapMarkerModal: (lat: number, lng: number) => void}
) => {
    const districtTimeHeader: string[] = [tag.infoViewRainfallTab, tag.infoViewFloodingTab]
    const displaytStoreName: string[] = [tag.infoViewUmbrellaRentalTab]
    const displayRateTag: string[] = [tag.infoViewRainfallTab]
    const displayOfficeHourTag: string[] = [tag.infoViewUmbrellaRentalTab]
    const [data, setData] = useState<RainRelateType>(item)
    const rateList = [1, 2, 3, 4, 5]


    useEffect(() => {
        setData(item)
    }, [item])

    return (
        <Card size="md" variant="outline" className="rounded-lg" style={{padding: 10}}>

        <VStack space="md">
            
            <VStack space="md">
                <HStack style={[styles.fullWidth, styles.center]}>
                    <HStack space="sm" style={[{flex: 99, justifyContent: 'flex-start'}]}>
                        <Text size="xl">{Common.districtCodeToLabel(item.districtCode)}</Text>
                    </HStack>
                    
                    { districtTimeHeader.includes(type) && <HStack space="sm" style={styles.center}>
                        <Clock size={20} color="gray" />
                        <Text size="xl">{item.updateTime}</Text>
                    </HStack> }

                </HStack>

                <Divider />

                { displaytStoreName.includes(type) && <HStack space="md" style={[styles.fullWidth, {paddingEnd: 25}]}>
                    <Store size={20} color="gray" />
                    <Text size="md">{item.storeName}</Text>
                </HStack> }

                <HStack space="md" style={[styles.fullWidth, {paddingEnd: 25}]}>
                    <MapPin size={20} color="gray" />
                    <Text size="md">{item.location}</Text>
                </HStack>

                { displayOfficeHourTag.includes(type) && <HStack space="md" style={[styles.fullWidth, {paddingEnd: 25}]} >
                    <Clock size={20} color="gray" />
                    <Text size="md">{item.officeHours}</Text>
                </HStack> }

                { displayRateTag.includes(type) && <HStack space="md" style={[styles.fullWidth, {paddingEnd: 25}]}>
                    <CloudRain size={20} color="gray" />
                    <HStack space="xs">
                        {rateList.map((_, i) => (
                            <Droplet key={i} color={i < item.rate! ? "#007AFF" : "#838383"} size={16} />
                        ))}
                    </HStack>
                </HStack>}
            </VStack>
            

            {/* {displayStoreNameTag.includes(type) &&
                <HStack style={styles.fullWidth}>
                    <Text style={styles.listItemContainerLeft}>Store Name</Text>
                    <Text style={styles.listItemContainerColon}>: </Text>
                    <Text style={styles.listItemContainerRight}>{item.storeName}</Text>
                </HStack>
            }

            <HStack style={styles.fullWidth}>
                <Text style={styles.listItemContainerLeft}>District</Text>
                <Text style={styles.listItemContainerColon}>: </Text>
                <Text style={styles.listItemContainerRight}>{Common.districtCodeToLabel(item.districtCode)} - ({Common.regionCodeToLabel(item.regionCode)})</Text>
            </HStack>

            <HStack style={styles.fullWidth}>
                <Text style={styles.listItemContainerLeft}>Location</Text>
                <Text style={styles.listItemContainerColon}>: </Text>
                <Text style={styles.listItemContainerRight}>{item.location}</Text>
            </HStack>
            
            {displayRateTag.includes(type) && 
                <HStack style={styles.fullWidth}>
                    <Text style={styles.listItemContainerLeft}>Rainfall Rate</Text>
                    <Text style={styles.listItemContainerColon}>: </Text>
                    <Box style={[styles.listItemContainerRight, {flexDirection: 'row', alignItems: 'center'}]}>
                        <HStack>
                            {rate.map((_, i) => (
                                <Droplet key={i} color="#007AFF" size={16} />
                            ))}

                            {unRate.map((_, i) => (
                                <Droplet key={i} color="rgba(131, 131, 131, 1)" size={16} />
                            ))}
                        </HStack>
                    </Box>
                </HStack>
            }

            {displayPostTimeTag.includes(type) &&
                <HStack style={styles.fullWidth}>
                    <Text style={styles.listItemContainerLeft}>Post Time</Text>
                    <Text style={styles.listItemContainerColon}>: </Text>
                    <Text style={styles.listItemContainerRight}>{item.postTime}</Text>
                </HStack>
            }

            {displayOfficeHourTag.includes(type) &&
                <HStack style={styles.fullWidth}>
                    <Text style={styles.listItemContainerLeft}>Office Hours</Text>
                    <Text style={styles.listItemContainerColon}>: </Text>
                    <Text style={styles.listItemContainerRight}>{item.officeHours}</Text>
                </HStack>
            } */}

            <Button variant="outline" size="sm" action="primary" onPress={() => openMapMarkerModal(item.latitude, item.longitude)}>
                <HStack space="sm" style={[styles.hastckContainer, {justifyContent: 'center', alignItems: 'center'}]}>
                    <MapPinned color="#000000" size={16} />
                    <Text>View location on Map</Text>
                </HStack>
            </Button>

        </VStack>
        </Card>
    )
}