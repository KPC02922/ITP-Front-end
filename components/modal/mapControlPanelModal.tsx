import { tag, mapMarkerTag } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import React, {useState, useRef, forwardRef, useImperativeHandle, useEffect} from 'react'
import { Text } from "../ui/text"
import { HStack } from "../ui/hstack"
import { Box } from "../ui/box"
import { Modal, Pressable, TouchableOpacity, View } from "react-native"
import { Divider } from "../ui/divider"
import { VStack } from "../ui/vstack"
import { CloudRain, Umbrella, Waves, Package, ChessKnight, Store } from 'lucide-react-native'
import { Switch } from "../ui/switch"
import { getMarkerVisibility, switchMarkersVisible } from "@/controller/map/homeMapMarkerController"

const TAG = tag.mapControlPanelModal

export interface MapControlPanelModalHandle {
    open: () => void
    close: () => void
}

interface MapControlPanelModalProps {
    triggerRerender: () => void
}

export const MapControlPanelModal = forwardRef<MapControlPanelModalHandle, MapControlPanelModalProps>((props, ref) => {
    const [visible, setVisible] = useState(false)
    const [rainfallMarkerVisible, setRainfallMarkerVisible] = useState(getMarkerVisibility(mapMarkerTag.rainfall))
    const [floodingMarkerVisible, setFloodingMarkerVisible] = useState(getMarkerVisibility(mapMarkerTag.flooding))
    const [umbrellaRentalMarkerVisible, setUmbrellaRentalMarkerVisible] = useState(getMarkerVisibility(mapMarkerTag.umbrellaRental))
    const [sfExpressMarkerVisible, setSfExpressMarkerVisible] = useState(getMarkerVisibility(mapMarkerTag.sfExpress))
    const [jockeyClubMarkerVisible, setJockeyClubMarkerVisible] = useState(getMarkerVisibility(mapMarkerTag.jockeyClub))
    const [otherStoreMarkerVisible, setOtherStoreMarkerVisible] = useState(getMarkerVisibility(mapMarkerTag.otherStore))
    const iconColor = '#32b4f4'
    const trackFalseColor = "#767577"
    const trackTrueColor = iconColor
    const thumbColor = "#fafafa"

    useImperativeHandle(ref, () => ({
        open: () => openHandler(),
        close: () => closeHandler()
    }))

    const openHandler = () => {
        Common.writeConsole(TAG, `open modal`)
        setVisible(true)
    }

    const closeHandler = () => {
        Common.writeConsole(TAG, `close modal`)
        props.triggerRerender()
        setVisible(false)
    }

    const switchHandler = (tag: string) => {
        Common.writeConsole(TAG, `Switch marker visibility for ${tag}`)
        switchMarkersVisible(tag)

        switch (tag) {
            case mapMarkerTag.rainfall:
                setRainfallMarkerVisible(getMarkerVisibility(mapMarkerTag.rainfall))
                break
            case mapMarkerTag.flooding:
                setFloodingMarkerVisible(getMarkerVisibility(mapMarkerTag.flooding))
                break
            case mapMarkerTag.umbrellaRental:
                setUmbrellaRentalMarkerVisible(getMarkerVisibility(mapMarkerTag.umbrellaRental))
                setSfExpressMarkerVisible(getMarkerVisibility(mapMarkerTag.sfExpress))
                setJockeyClubMarkerVisible(getMarkerVisibility(mapMarkerTag.jockeyClub))
                setOtherStoreMarkerVisible(getMarkerVisibility(mapMarkerTag.otherStore))
                break
            case mapMarkerTag.sfExpress:
                setSfExpressMarkerVisible(getMarkerVisibility(mapMarkerTag.sfExpress))
                allUnderUmbrellaRentalHandler()
                break
            case mapMarkerTag.jockeyClub:
                setJockeyClubMarkerVisible(getMarkerVisibility(mapMarkerTag.jockeyClub))
                allUnderUmbrellaRentalHandler()
                break
            case mapMarkerTag.otherStore:
                setOtherStoreMarkerVisible(getMarkerVisibility(mapMarkerTag.otherStore))
                allUnderUmbrellaRentalHandler()
                break
            default:
                break;
        }
    }

    const allUnderUmbrellaRentalHandler = () => {
        const sfVisible = getMarkerVisibility(mapMarkerTag.sfExpress)
        const jcVisible = getMarkerVisibility(mapMarkerTag.jockeyClub)
        const osVisible = getMarkerVisibility(mapMarkerTag.otherStore)
        Common.writeConsole(TAG, `SF Express visible: ${sfVisible}, Jockey Club visible: ${jcVisible}, Other Store visible: ${osVisible}`)

        if (sfVisible || jcVisible || osVisible) {
            if (!umbrellaRentalMarkerVisible) {
                setUmbrellaRentalMarkerVisible(true)
                switchMarkersVisible(mapMarkerTag.umbrellaRental, true)
            }
        }

        if (!sfVisible && !jcVisible && !osVisible) {
            if (umbrellaRentalMarkerVisible) {
                setUmbrellaRentalMarkerVisible(false)
                switchMarkersVisible(mapMarkerTag.umbrellaRental, false)
            }
        }
    }

    return (
        <Modal visible={visible} transparent>

            <Box style={styles.modalBackground}>

                <Box style={styles.commonModalTitleContainer}>
                    <Text style={styles.commonModalTitleLabel}>Map marker control panel</Text>
                </Box>

                <Box style={[styles.commonModalContainer, {height: 'auto', paddingVertical: 20}]}>
                    <VStack space="md" style={styles.commonModalListContainer}>

                        {/* Rainfall related markers */}
                        <VStack>
                            <Text style={styles.bottomBorderContainer}>Rainfall related markers</Text>
                            <HStack space="md" style={styles.mapMarkerControlPanelRowContainer}>
                                <CloudRain size={20} color={iconColor} style={{ flex: 10}} />
                                <Text style={{ flex: 80}}>{mapMarkerTag.rainfall}</Text>
                                <Switch 
                                    size="md" 
                                    style={{ flex: 10}}
                                    trackColor={{ false: trackFalseColor, true: trackTrueColor }}
                                    thumbColor={thumbColor}
                                    value={rainfallMarkerVisible}
                                    onValueChange={() => switchHandler(mapMarkerTag.rainfall)}
                                />
                            </HStack>
                        </VStack>

                        {/* Flooding related markers */}
                        <VStack>
                            <Text style={styles.bottomBorderContainer}>Flooding related markers</Text>
                            <HStack space="md" style={styles.mapMarkerControlPanelRowContainer}>
                                <Waves size={20} color={iconColor} style={{ flex: 10}} />
                                <Text style={{ flex: 80}}>{mapMarkerTag.flooding}</Text>
                                <Switch 
                                    size="md" 
                                    style={{ flex: 10}}
                                    trackColor={{ false: trackFalseColor, true: trackTrueColor }}
                                    thumbColor={thumbColor}
                                    value={floodingMarkerVisible}
                                    onValueChange={() => switchHandler(mapMarkerTag.flooding)}
                                />
                            </HStack>                            
                        </VStack>
                        
                        {/* Umbrella rental related markers */}
                        <VStack>
                            <Text style={styles.bottomBorderContainer}>Umbrella rental related markers</Text>
                            <HStack space="md" style={styles.mapMarkerControlPanelRowContainer}>
                                <Umbrella size={20} color={iconColor} style={{ flex: 10}} />
                                <Text style={{ flex: 80}}>{mapMarkerTag.umbrellaRental}</Text>
                                <Switch 
                                    size="md" 
                                    style={{ flex: 10}}
                                    trackColor={{ false: trackFalseColor, true: trackTrueColor }}
                                    thumbColor={thumbColor}
                                    value={umbrellaRentalMarkerVisible}
                                    onValueChange={() => switchHandler(mapMarkerTag.umbrellaRental)}
                                />
                            </HStack>

                            <HStack space="md" style={styles.mapMarkerControlPanelRowContainer}>
                                <Package size={20} color={iconColor} style={{ flex: 10}} />
                                <Text style={{ flex: 80}}>{mapMarkerTag.sfExpress}</Text>
                                <Switch 
                                    size="md" 
                                    style={{ flex: 10}}
                                    trackColor={{ false: trackFalseColor, true: trackTrueColor }}
                                    thumbColor={thumbColor}
                                    value={sfExpressMarkerVisible}
                                    onValueChange={() => switchHandler(mapMarkerTag.sfExpress)}
                                />
                            </HStack>

                            <HStack space="md" style={styles.mapMarkerControlPanelRowContainer}>
                                <ChessKnight size={20} color={iconColor} style={{ flex: 10}} />
                                <Text style={{ flex: 80}}>{mapMarkerTag.jockeyClub}</Text>
                                <Switch 
                                    size="md" 
                                    style={{ flex: 10}}
                                    trackColor={{ false: trackFalseColor, true: trackTrueColor }}
                                    thumbColor={thumbColor}
                                    value={jockeyClubMarkerVisible}
                                    onValueChange={() => switchHandler(mapMarkerTag.jockeyClub)}
                                />
                            </HStack>

                            <HStack space="md" style={styles.mapMarkerControlPanelRowContainer}>
                                <Store size={20} color={iconColor} style={{ flex: 10}} />
                                <Text style={{ flex: 80}}>{mapMarkerTag.otherStore}</Text>
                                <Switch 
                                    size="md" 
                                    style={{ flex: 10}}
                                    trackColor={{ false: trackFalseColor, true: trackTrueColor }}
                                    thumbColor={thumbColor}
                                    value={otherStoreMarkerVisible}
                                    onValueChange={() => switchHandler(mapMarkerTag.otherStore)}
                                />
                            </HStack>
                        </VStack>

                    </VStack>
                </Box>

                <Box style={styles.closeBtnRowContainer}>
                    <Pressable style={styles.closeBtnRowBtnContainer} onPress={() => closeHandler()}>
                        <Text style={styles.common2BtnModalBtnLabel}>Close</Text>
                    </Pressable>
                </Box>
            </Box>

        </Modal>
    )
})