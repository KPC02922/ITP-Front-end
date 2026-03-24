import { tag, region, district, mapMarkerTag } from "@/components/tag"
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
    {type: string, item: RainRelateType, openMapMarkerModal: (lat: number, lng: number, type: string) => void}
) => {
    const districtTimeHeader: string[] = [tag.infoViewRainfallTab, tag.infoViewFloodingTab, mapMarkerTag.rainfall, mapMarkerTag.flooding]
    const displaytStoreName: string[] = [tag.infoViewUmbrellaRentalTab, mapMarkerTag.otherStore]
    const displayRateTag: string[] = [tag.infoViewRainfallTab, mapMarkerTag.rainfall]
    const displayOfficeHourTag: string[] = [tag.infoViewUmbrellaRentalTab, mapMarkerTag.otherStore]
    const rateList = [1, 2, 3, 4, 5]
    const iconColor = "#32b4f4"

    const getRateColor = (index: number) => {
        switch(index) {
            case 1:
                return "#c7ebfc"
            case 2:
                return "#7ccff8"
            case 3:
                return "#32b4f4"
            case 4:
                return "#0b8dcd"
            case 5:
                return "#075a83"
            default:
                return "#838383"
        }
    }

    return (
        <Card size="md" variant="outline" className="rounded-lg" style={{padding: 10}}>

        <VStack space="md">
            
            <VStack space="md">
                <HStack style={[styles.fullWidth, styles.center]}>
                    <HStack space="sm" style={[{flex: 99, justifyContent: 'flex-start'}]}>
                        <Text size="xl">{Common.districtCodeToLabel(item.districtCode)}</Text>
                    </HStack>
                    
                    { districtTimeHeader.includes(type) && <HStack space="sm" style={styles.center}>
                        <Clock size={20} color={iconColor} />
                        <Text size="xl">{item.updateTime}</Text>
                    </HStack> }

                </HStack>

                <Divider />

                { displaytStoreName.includes(type) && <HStack space="md" style={[styles.fullWidth, {paddingEnd: 25}]}>
                    <Store size={20} color={iconColor} />
                    <Text size="md">{item.storeName}</Text>
                </HStack> }

                <HStack space="md" style={[styles.fullWidth, {paddingEnd: 25}]}>
                    <MapPin size={20} color={iconColor} />
                    <Text size="md">{item.location == '' ? '[Location not available]' : item.location}</Text>
                </HStack>

                { displayOfficeHourTag.includes(type) && <HStack space="md" style={[styles.fullWidth, {paddingEnd: 25}]} >
                    <Clock size={20} color={iconColor} />
                    <Text size="md">{item.officeHours}</Text>
                </HStack> }

                { displayRateTag.includes(type) && <HStack space="md" style={[styles.fullWidth, {paddingEnd: 25}]}>
                    <CloudRain size={20} color={iconColor} />
                    <HStack space="xs">
                        {rateList.map((rate, i) => (
                            <Droplet key={i} color={getRateColor(rate)} fill={i < item.rate! ? getRateColor(i+1) : "#ffffffff"} size={16} />
                        ))}
                    </HStack>
                </HStack>}
            </VStack>

            <Button variant="solid" size="sm" action="primary" onPress={() => openMapMarkerModal(item.latitude, item.longitude, type)}>
                <HStack space="sm" style={[styles.hastckContainer, {justifyContent: 'center', alignItems: 'center'}]}>
                    <MapPinned color="#ffffff" size={16} />
                    <Text style={{color: '#ffffff'}}>View location on Map</Text>
                </HStack>
            </Button>

        </VStack>
        </Card>
    )
}