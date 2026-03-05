import { tag, region, district } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import RainRelateType from "@/interfcaeType/RainRelateType"
import { Card } from "../ui/card"
import { Text } from "../ui/text"
import { Droplet, Map } from 'lucide-react-native'
import { HStack } from "../ui/hstack"
import { Box } from "../ui/box"
import { useEffect, useState } from "react"
import { Button, ButtonText } from "../ui/button"

const TAG = tag.rainRelateListItem

export const RainRelateListItem = (
    {type, item, openMapMarkerModal}:
    {type: string, item: RainRelateType, openMapMarkerModal: (lat: number, lng: number) => void}
) => {
    // Common.writeConsole(TAG, `render RainRelateListItem - id: ${item.id}, location: ${item.location}, status: ${item.status}, region: ${Common.regionCodeToLabel(item.regionCode)}, district: ${Common.districtCodeToLabel(item.districtCode)}`)
    const displayPostTimeTag: string[] = [tag.infoViewRainfallTab, tag.infoViewFloodingTab]
    const displayRateTag: string[] = [tag.infoViewRainfallTab]
    const displayStoreNameTag: string[] = [tag.infoViewUmbrellaRentalTab]
    const displayOfficeHourTag: string[] = [tag.infoViewUmbrellaRentalTab]
    const [data, setData] = useState<RainRelateType>(item)

    const rate = []
    const unRate = []
    if (item.rate) {
        for (let i = 0; i < item.rate; i++) {
            rate.push(1)
        }
        for (let i = 0; i < 5 - item.rate; i++) {
            unRate.push(0)
        }
    }

    useEffect(() => {
        setData(item)
    }, [item])

    return (
        <Card size="md" variant="outline" className="rounded-lg" style={{padding: 10}}>

            {displayStoreNameTag.includes(type) &&
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
            }

            <Button variant="outline" size="sm" action="primary" onPress={() => openMapMarkerModal(item.latitude, item.longitude)} style={{marginTop: 10}}>
                <HStack space="sm" style={[styles.hastckContainer, {justifyContent: 'center', alignItems: 'center'}]}>
                    <Map color="#000000" size={16} />
                    <Text>View location on Map</Text>
                </HStack>
            </Button>

        </Card>
    )
}