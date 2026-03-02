import { tag } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { Box } from "../ui/box"
import MapView, { Marker, LatLng, Region, PROVIDER_GOOGLE } from 'react-native-maps'
import { useRef } from "react"
import { Dimensions } from "react-native"
import * as Common from "@/common"
import { Fab, FabIcon, FabLabel } from "../ui/fab"
import { Settings, Locate } from 'lucide-react-native'
import * as Location from 'expo-location'

const TAG = tag.homeMapView

export const HomeMapView = ({onChangeView}: any) => {
    const {width, height} = Dimensions.get("window");
    const ASPECT_RATIO = width/height;
    const LATITUDE_DELTA = 0.02;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
    const INITIAL_POSITION = {
        latitude: 22.342747295665276,
        longitude: 114.1087984919611,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    }
    const mapRef = useRef<MapView | null>(null)

    const onMapPress = (e: any) => {
        const coordinate: LatLng = e.nativeEvent.coordinate
        Common.writeConsole(TAG, `Map pressed at ${coordinate.latitude}, ${coordinate.longitude}`)
    }

    const onSettingFabPress = () => {
        Common.writeConsole(TAG, `FAB pressed`)
        onChangeView(TAG, tag.infoView)
    }

    const onLocateFabPress = async () => {
        Common.writeConsole(TAG, `Locate FAB pressed`)
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status == 'granted') {
            const location = await Location.getCurrentPositionAsync({})
            Common.writeConsole(tag.app, `Location: ${location.coords.latitude} | ${location.coords.longitude}`)
        }
    }


    return (
        <Box style={styles.homeMapContainer}>
            <Fab
                size="lg"
                placement="top left"
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

            <MapView
                ref={mapRef}
                style={{flex: 100}}
                provider={PROVIDER_GOOGLE}
                initialRegion={INITIAL_POSITION}
                onPress={onMapPress}
                showsUserLocation={true}
                showsMyLocationButton={false}
            >

            </MapView>
        </Box>
    )
}

