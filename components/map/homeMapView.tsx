import { tag, mapMarkerTag } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { Box } from "../ui/box"
// import MapView, { Marker, LatLng, Region, PROVIDER_GOOGLE } from 'react-native-maps'
import { useEffect, useRef, useState } from "react"
import { ActivityIndicator, Dimensions } from "react-native"
import { Fab, FabIcon, FabLabel } from "../ui/fab"
import { Settings, Locate, CloudRain } from 'lucide-react-native'
import * as Location from 'expo-location'
import { AnimationType, INFINITE_ANIMATION_ITERATIONS, LatLng, LeafletView, MapMarker, WebviewLeafletMessage } from 'react-native-leaflet-view'
import { rainfallJson } from "@/demoData/rainfallJson"
import { sfExpressJson } from "@/demoData/sfExpressJson"
import { jockeyClubJson } from "@/demoData/jockeyClubJson"
import { getMarkerVisibility } from "@/controller/map/homeMapMarkerController"

const TAG = tag.homeMapView

export const HomeMapView = ({onChangeView, webViewContent, mapControlPanelModalRef, rerender}: {onChangeView: any; webViewContent: string; mapControlPanelModalRef: any; rerender: boolean}) => {
    const VTCL_POSITION = {
        latitude: 22.342747295665276,
        longitude: 114.1087984919611,
    }
    const initPosition = Common.getCurrentPosition()
    const [mapCenterPosition, setMapCenterPosition] = useState<{lat: number, lng: number}>
    (initPosition.latitude > 0 && initPosition.longitude > 0 
        ? {lat: initPosition.latitude, lng: initPosition.longitude} 
        : {lat: VTCL_POSITION.latitude, lng: VTCL_POSITION.longitude}
    )
    const [zoom, setZoom] = useState<number>(17)
    const [mapMarkerList, setMapMarkerList] = useState<MapMarker[]>([])

    const onSettingFabPress = () => {
        Common.writeConsole(TAG, `FAB pressed`)
        // onChangeView(TAG, tag.infoView)
        mapControlPanelModalRef.current?.open()
    }

    // onZoomStart. onMoveStart, onMove, onZoom, onZoomEnd, onMoveEnd, onMapClicked, onMapMarkerClicked
    const mapReceivedMsgHandler = (message: WebviewLeafletMessage) => {
        // Common.writeConsole(TAG, `Map received message: ${JSON.stringify(message)}`)
    }

    const onLocateFabPress = async () => {
        Common.writeConsole(TAG, `Locate FAB pressed`)
        if (initPosition.latitude > 0 && initPosition.longitude > 0) {
            setZoom(17)
            setMapCenterPosition({lat: initPosition.latitude, lng: initPosition.longitude})
            
        }
    }

    if (!webViewContent) {
        return (
            <Box style={styles.homeMapContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </Box>
        )
    }

    useEffect(() => {
        const tempMapMarkerList: MapMarker[] = []
        
        if (getMarkerVisibility(mapMarkerTag.rainfall)) {
            const rainfallMarkers = rainfallJson.map((item) => ({
                id: `rainfall-${item.id}`,
                title: `Rainfall rate: ${item.rate}`,
                position: { lat: item.latitude, lng: item.longitude },
                icon: "💧",
            }))
            tempMapMarkerList.push(...rainfallMarkers)
        }
        
        // flooding markers

        if (getMarkerVisibility(mapMarkerTag.sfExpress)) {
            const sfMarkers = sfExpressJson.map((item) => ({
                id: `sf-${item.code}`,
                title: `SF Express: ${item.code}`,
                position: { lat: item.latitude, lng: item.longitude },
                icon: "📦",
            }))
            tempMapMarkerList.push(...sfMarkers)          
        }

        if (getMarkerVisibility(mapMarkerTag.jockeyClub)) {
            const jockeyClubMarkers = jockeyClubJson.map((item, index) => ({
                id: `jockey-${index}`,
                title: `Jockey Club`,
                position: { lat: item.latitude, lng: item.longitude },
                icon: "🏇",
            }))
            tempMapMarkerList.push(...jockeyClubMarkers)
        }


        // other store markers
        setMapMarkerList([...tempMapMarkerList])

         // For testing: log the markers
        Common.writeConsole(TAG, `Map markers: ${JSON.stringify(tempMapMarkerList)}`)
    }, [rerender])

    return (
        <Box style={styles.homeMapContainer}>
            <Fab
                size="lg"
                placement="top right"
                onPress={onSettingFabPress}
                style={{marginTop: 24}}
            >
                <FabIcon as={Settings} />
            </Fab>

             <Fab
                size="lg"
                placement="bottom right"
                onPress={onLocateFabPress}
            >
                <FabIcon as={Locate} />
            </Fab>

            <LeafletView
                source={{ html: webViewContent }}
                mapCenterPosition={mapCenterPosition}
                zoom={zoom}
                zoomControl={true}
                onMessageReceived={message => mapReceivedMsgHandler(message)}
                ownPositionMarker={{
                    title: "You are here",
                    id: 'userPosition',
                    position: { lat: initPosition.latitude, lng: initPosition.longitude },
                    icon: "📍",
                    size: [24, 24],
                    animation: {
                        type: AnimationType.PULSE, // Requires importing AnimationType
                        duration: 5,
                        delay: 0,
                        iterationCount: INFINITE_ANIMATION_ITERATIONS
                    }
                }}
                mapMarkers={mapMarkerList}
            />
        </Box>
    )
}

