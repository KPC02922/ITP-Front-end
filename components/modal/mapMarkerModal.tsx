import { tag, store } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import React, {useState, useRef, forwardRef, useImperativeHandle, useEffect} from 'react'
import { Text } from "../ui/text"
import { HStack } from "../ui/hstack"
import { Button, ButtonText } from "../ui/button"
import { Box } from "../ui/box"
import { Heading } from "../ui/heading"
import { Modal, Pressable, TouchableOpacity, View } from "react-native"
import { Divider } from "../ui/divider"
import { VStack } from "../ui/vstack"
import { AnimationType, INFINITE_ANIMATION_ITERATIONS, LeafletView, WebviewLeafletMessage, WebviewLeafletMessagePayload } from "react-native-leaflet-view"
import { Fab, FabIcon } from "../ui/fab"
import { Locate, MapPin } from "lucide-react-native"

const TAG = tag.mapMarkerModal

export interface MapMarkerModalHandle {
    open: () => void
    close: () => void
    setLatLng: (lat: number, lng: number) => void
}

interface MapMarkerModalProps {
    webViewContent: any
    closeBtnFun?: () => void
}

export const MapMarkerModal = forwardRef<MapMarkerModalHandle, MapMarkerModalProps>((props, ref) => {
    const [visible, setVisible] = useState(false)
    const webViewContent = props.webViewContent

    const initPosition = Common.getCurrentPosition()
    const VTCL_POSITION = {lat: 22.342747295665276,lng: 114.1087984919611,}
    const [mapCenterPosition, setMapCenterPosition] = useState<{lat: number, lng: number}>
    (initPosition.lat > 0 && initPosition.lng > 0 
        ? {lat: initPosition.lat, lng: initPosition.lng} 
        : {lat: VTCL_POSITION.lat, lng: VTCL_POSITION.lng}
    )
    const [markerList, setMarkerList] = useState<any[]>([])

    useImperativeHandle(ref, () => ({
        open: () => openHandler(),
        close: () => closeHandler(),
        setLatLng: (lat: number, lng: number) => {
            Common.writeConsole(TAG, `Set marker position to lat: ${lat}, lng: ${lng}`)
            setMapCenterPosition({lat, lng})
            setMarkerList([
                {
                    id: 'selectedLocation',
                    position: {lat, lng},
                    title: 'Selected Location',
                    icon: "📍",
                    size: [30, 30],
                    iconAnchor: [5, 30],
                }
            ])
        }
    }))

    const openHandler = () => {
        Common.writeConsole(TAG, `open modal`)
        setVisible(true)
    }

    const closeHandler = () => {
        Common.writeConsole(TAG, `close modal`)
        setVisible(false)
    }

    const onLocateFabPress = async () => {
        Common.writeConsole(TAG, `Locate FAB pressed`)
        if (initPosition.lat > 0 && initPosition.lng > 0) {
            setMapCenterPosition({lat: initPosition.lat, lng: initPosition.lng})
            
        }
    }

    return (
        <Modal visible={visible} transparent>

            <Box style={styles.modalBackground}>

                <Box style={[styles.commonModalTitleContainer, {width: '90%'}]}>
                    <Text style={styles.commonModalTitleLabel}>Location</Text>
                </Box>

                <Box style={[styles.commonModalContainer, {height: '80%', paddingVertical: 20, width: '90%'}]}>
                    <Fab
                        size="lg"
                        placement="bottom left"
                        onPress={onLocateFabPress}
                    >
                        <FabIcon as={Locate} />
                    </Fab>
                    <LeafletView
                        source={{ html: webViewContent }}
                        mapCenterPosition={mapCenterPosition}
                        zoom={17}
                        zoomControl={false}
                        mapMarkers={markerList}
                    />
                </Box>

                <Box style={[styles.closeBtnRowContainer, {width: '90%'}]}>
                    <Pressable style={styles.closeBtnRowBtnContainer} onPress={() => closeHandler()}>
                        <Text style={styles.common2BtnModalBtnLabel}>Close</Text>
                    </Pressable>
                </Box>
            </Box>

        </Modal>
    )
})