import { tag } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { Navigator } from "@/components/main/navigator"
import { Header } from "@/components/main/header"
import { HomeMapView } from "@/screen/homeView/homeMapView"
import { Box } from "../../components/ui/box"
import { HStack } from "@/components/ui/hstack"
import { MapControlPanelModal, MapControlPanelModalHandle } from "@/components/modal/mapControllPanelModal"
import { useRef, useState } from "react"
import { HomeWeatherView } from "./homeWeatherView"

const TAG = tag.homeView

export const HomeView = ({onChangeView, webViewContent}: {onChangeView: any; webViewContent: string}) => {
    const mapControlPanelModalRef = useRef<MapControlPanelModalHandle>(null)
    const [rerender, setRerender] = useState<boolean>(false)

    const triggerRerender = () => {
        Common.writeConsole(TAG, `Trigger rerender from HomeView`)
        setRerender(!rerender)
    }

    return (
        <>
            <MapControlPanelModal ref={mapControlPanelModalRef} triggerRerender={triggerRerender} />

            <HomeMapView onChangeView={onChangeView} webViewContent={webViewContent} mapControlPanelModalRef={mapControlPanelModalRef} rerender={rerender} />

            <Box style={styles.homeContentContainer}>

                <HomeWeatherView />
                
            </Box>
            

        </>
    )
}

