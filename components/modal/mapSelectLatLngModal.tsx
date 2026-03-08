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

const TAG = tag.mapSelectLatLngModal

export interface MapSelectLatLngModalHandle {
    open: () => void
    close: () => void
    resetSelectedLatLng: () => void
}

interface MapSelectLatLngModalProps {
    webViewContent: any
    selectBtnFun?: (lat: number, lng: number) => void
    closeBtnFun?: () => void
    selectedLatLng: {lat: number, lng: number}
}

export const MapSelectLatLngModal = forwardRef<MapSelectLatLngModalHandle, MapSelectLatLngModalProps>((props, ref) => {
    const [visible, setVisible] = useState(false)
    const webViewContent = props.webViewContent

    const initPosition = Common.getCurrentPosition()
    const VTCL_POSITION = {lat: 22.342747295665276,lng: 114.1087984919611,}
    const [mapCenterPosition, setMapCenterPosition] = useState<{lat: number, lng: number}>
    (initPosition.lat > 0 && initPosition.lng > 0 
        ? {lat: initPosition.lat, lng: initPosition.lng} 
        : {lat: VTCL_POSITION.lat, lng: VTCL_POSITION.lng}
    )
    const [pinMarker, setPinMarker] = useState<{lat: number, lng: number}>({lat: 0, lng: 0})
    const [markerList, setMarkerList] = useState<any[]>([])

    useImperativeHandle(ref, () => ({
        open: () => openHandler(),
        close: () => closeHandler(),
        resetSelectedLatLng: () => setPinMarker({lat: 0, lng: 0}),
    }))

    const openHandler = () => {
        Common.writeConsole(TAG, `open modal`)
        const tempLatLng = (props.selectedLatLng.lat > 0 && props.selectedLatLng.lng > 0) ? {lat: props.selectedLatLng.lat, lng: props.selectedLatLng.lng}
        : (initPosition.lat > 0 && initPosition.lng > 0  ? {lat: initPosition.lat, lng: initPosition.lng} : {lat: VTCL_POSITION.lat, lng: VTCL_POSITION.lng})
        setPinMarker(tempLatLng)
        setVisible(true)
    }

    const closeHandler = () => {
        Common.writeConsole(TAG, `close modal`)
        setPinMarker({lat: 0, lng: 0})
        setVisible(false)
    }

    const selectBtnFun = (lat: number, lng: number) => {
        Common.writeConsole(TAG, `select lat lng: ${lat}, ${lng}`)
        props.selectBtnFun?.(lat, lng)
        closeHandler()
    }

    const onLocateFabPress = async () => {
        Common.writeConsole(TAG, `Locate FAB pressed`)
        if (initPosition.lat > 0 && initPosition.lng > 0) {
            setMapCenterPosition({lat: initPosition.lat, lng: initPosition.lng})
            
        }
    }

    const mapReceivedMsgHandler = (message: WebviewLeafletMessage) => {
        const event = message?.event || 'unknown'
        const playload: WebviewLeafletMessagePayload = message?.payload || {} as WebviewLeafletMessagePayload

        switch (event) {
            case 'onMapClicked':
                const mapCenterPosition = playload?.touchLatLng
                setPinMarker({lat: mapCenterPosition.lat, lng: mapCenterPosition.lng})
                Common.writeConsole(TAG, `Map clicked at ${mapCenterPosition.lat}, ${mapCenterPosition.lng}, zoom: ${playload.zoom}`)
                break
            default: 
        }
    }

    useEffect(() => {
        const marker = {
            id: `pin-marker`,
            title: `Selected Location`,
            position: { lat: pinMarker.lat, lng: pinMarker.lng },
            icon: "📍",
            size: [30, 30],
            iconAnchor: [5, 30],
        }
        setMarkerList([marker])
    }, [pinMarker])

    return (
        <Modal visible={visible} transparent>

            <Box style={styles.modalBackground}>

                <Box style={[styles.commonModalTitleContainer, {width: '90%'}]}>
                    <Text style={styles.commonModalTitleLabel}>Pin Location</Text>
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
                        onMessageReceived={message => mapReceivedMsgHandler(message)}
                        mapMarkers={markerList}
                        mapLayers={[
                            {
                                baseLayer: true,
                                baseLayerName: "MapTiler Streets",
                                url: `https://api.maptiler.com/maps/dataviz-v4/{z}/{x}/{y}.png?key=HQS1C7ORPgw7GbeKEIVZ`,
                                attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap</a> contributors'              
                            }
                        ]}
                    />
                </Box>

                <Box style={[styles.twoBtnRowContainer, {width: '90%'}]}>
                    <Pressable style={styles.common2BtnModalBtnContainer} onPress={() => selectBtnFun(pinMarker.lat, pinMarker.lng)}>
                        <Text style={styles.common2BtnModalBtnLabel}>Select</Text>
                    </Pressable>

                    <Divider orientation="vertical" />

                    <Pressable style={styles.common2BtnModalBtnContainer} onPress={() => closeHandler()}>
                        <Text style={styles.common2BtnModalBtnLabel}>Close</Text>
                    </Pressable>
                </Box>
            </Box>

        </Modal>
    )
})