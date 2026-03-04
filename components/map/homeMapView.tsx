import { tag } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { Box } from "../ui/box"
// import MapView, { Marker, LatLng, Region, PROVIDER_GOOGLE } from 'react-native-maps'
import { useRef, useState } from "react"
import { ActivityIndicator, Dimensions } from "react-native"
import * as Common from "@/common"
import { Fab, FabIcon, FabLabel } from "../ui/fab"
import { Settings, Locate } from 'lucide-react-native'
import * as Location from 'expo-location'
import { AnimationType, INFINITE_ANIMATION_ITERATIONS, LatLng, LeafletView, WebviewLeafletMessage } from 'react-native-leaflet-view'

const TAG = tag.homeMapView

export const HomeMapView = ({onChangeView, webViewContent}: any) => {
    const {width, height} = Dimensions.get("window");
    const ASPECT_RATIO = width/height;
    const LATITUDE_DELTA = 0.02;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
    const VTCL_POSITION = {
        latitude: 22.342747295665276,
        longitude: 114.1087984919611,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    }
    // const mapRef = useRef<MapView | null>(null)
    const initPosition = Common.getCurrentPosition()
    const [mapCenterPosition, setMapCenterPosition] = useState<{lat: number, lng: number}>
    (initPosition.latitude > 0 && initPosition.longitude > 0 
        ? {lat: initPosition.latitude, lng: initPosition.longitude} 
        : {lat: VTCL_POSITION.latitude, lng: VTCL_POSITION.longitude}
    )
    const [zoom, setZoom] = useState<number>(17)

    const onSettingFabPress = () => {
        Common.writeConsole(TAG, `FAB pressed`)
        onChangeView(TAG, tag.infoView)
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

        // let { status } = await Location.requestForegroundPermissionsAsync()
        // if (status == 'granted') {
        //     const location = await Location.getCurrentPositionAsync({})
        //     Common.writeConsole(tag.app, `Location: ${location.coords.latitude} | ${location.coords.longitude}`)
        // }
    }

    if (!webViewContent) {
        return (
            <Box style={styles.homeMapContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </Box>
        )
    }

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
                        type: AnimationType.BOUNCE, // Requires importing AnimationType
                        duration: 2,
                        delay: 0,
                        iterationCount: INFINITE_ANIMATION_ITERATIONS
                    }
                }}
            />

            {/* <MapView
                ref={mapRef}
                style={{flex: 100}}
                provider={PROVIDER_GOOGLE}
                initialRegion={INITIAL_POSITION}
                onPress={onMapPress}
                showsUserLocation={true}
                showsMyLocationButton={false}
            >

            </MapView> */}
        </Box>
    )
}

