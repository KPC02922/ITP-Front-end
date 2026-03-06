import { tag, mapMarkerTag } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { Box } from "../../components/ui/box"
// import MapView, { Marker, LatLng, Region, PROVIDER_GOOGLE } from 'react-native-maps'
import { use, useEffect, useRef, useState } from "react"
import { ActivityIndicator, Dimensions } from "react-native"
import { Fab, FabIcon, FabLabel } from "../../components/ui/fab"
import { Settings, Locate, CloudRain } from 'lucide-react-native'
import * as Location from 'expo-location'
import { AnimationType, INFINITE_ANIMATION_ITERATIONS, LatLng, LeafletView, MapMarker, WebviewLeafletMessage, WebviewLeafletMessagePayload } from 'react-native-leaflet-view'
import { rainfallJson } from "@/demoData/rainfallJson"
import { sfExpressJson } from "@/demoData/sfExpressJson"
import { jockeyClubJson } from "@/demoData/jockeyClubJson"
import { getMarkerVisibility } from "@/controller/map/homeMapMarkerController"

const TAG = tag.homeMapView

export const HomeMapView = (
    {onChangeView, webViewContent, mapControlPanelModalRef, rerender, expended}
    :{onChangeView: any; webViewContent: string; mapControlPanelModalRef: any; rerender: boolean; expended: boolean}
) => {
    const VTCL_POSITION = {lat: 22.342747295665276,lng: 114.1087984919611,}
    const initPosition = Common.getCurrentPosition()
    const [mapCenterPosition, setMapCenterPosition] = useState<{lat: number, lng: number}>
    (initPosition.lat > 0 && initPosition.lng > 0 
        ? {lat: initPosition.lat, lng: initPosition.lng} 
        : {lat: VTCL_POSITION.lat, lng: VTCL_POSITION.lng}
    )
    const [zoom, setZoom] = useState<number>(17)
    const [mapMarkerList, setMapMarkerList] = useState<MapMarker[]>([])
    const [expendedHomeWeatherView, setExpendedHomeWeatherView] = useState<boolean>(false)
    const [mapKey, setMapKey] = useState(0)

    const onSettingFabPress = () => {
        Common.writeConsole(TAG, `FAB pressed`)
        // onChangeView(TAG, tag.infoView)
        mapControlPanelModalRef.current?.open()
    }

    // onZoomStart. onMoveStart, onMove, onZoom, onZoomEnd, onMoveEnd, onMapClicked, onMapMarkerClicked
    const mapReceivedMsgHandler = (message: WebviewLeafletMessage) => {
        const event = message?.event || 'unknown'
        const playload: WebviewLeafletMessagePayload = message?.payload || {} as WebviewLeafletMessagePayload

        switch (event) {
            case 'onMoveEnd':
                const mapCenterPosition = playload?.mapCenterPosition
                Common.setLastPosition({lat: mapCenterPosition.lat, lng: mapCenterPosition.lng})
                Common.setLastZoom(mapCenterPosition.zoom)
                Common.writeConsole(TAG, `Map moved to ${mapCenterPosition.lat}, ${mapCenterPosition.lng}, zoom: ${playload.zoom}`)
                break
            default: 
        }
    }

    const onLocateFabPress = async () => {
        Common.writeConsole(TAG, `Locate FAB pressed`)
        if (initPosition.lat > 0 && initPosition.lng > 0) {
            setZoom(17)
            setMapCenterPosition({lat: initPosition.lat, lng: initPosition.lng})
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
                icon: "🌧️",
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

    useEffect(() => {
        const lastPosition = Common.getLastPosition()
        const lastZoom = Common.getLastZoom()
        if (lastPosition.lat > 0 && lastPosition.lng > 0) {
            setMapCenterPosition({lat: lastPosition.lat, lng: lastPosition.lng})
            setZoom(lastZoom)
            Common.writeConsole(TAG, `Restored last position: ${lastPosition.lat}, ${lastPosition.lng}, zoom: ${lastZoom}`)
        }
    }, [])

    useEffect(() => {
        setExpendedHomeWeatherView(expended)
        setMapKey(prevKey => prevKey + 1) // Force remount LeafletView to reset map state
        const lastPosition = Common.getLastPosition()
        const lastZoom = Common.getLastZoom()
        if (lastPosition.lat > 0 && lastPosition.lng > 0) {
            setMapCenterPosition({lat: lastPosition.lat, lng: lastPosition.lng})
            setZoom(lastZoom)
            Common.writeConsole(TAG, `Restored last position on expended change: ${lastPosition.lat}, ${lastPosition.lng}, zoom: ${lastZoom}`)
        }
    }, [expended])

    return (
        <Box style={expended ? {flex: 10, height: '100%'} : {flex: 62, height: '100%'}}>
            {!expended && <Fab
                size="lg"
                placement="top right"
                onPress={onSettingFabPress}
                style={{marginTop: 24}}
            >
                <FabIcon as={Settings} />
            </Fab>}

             {!expended && <Fab
                size="lg"
                placement="bottom right"
                onPress={onLocateFabPress}
            >
                <FabIcon as={Locate} />
            </Fab>}

            <LeafletView
                key={mapKey}
                source={{ html: webViewContent }}
                mapCenterPosition={mapCenterPosition}
                zoom={zoom}
                zoomControl={true}
                onMessageReceived={message => mapReceivedMsgHandler(message)}
                ownPositionMarker={{
                    title: "You are here",
                    id: 'userPosition',
                    position: { lat: initPosition.lat, lng: initPosition.lng },
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

