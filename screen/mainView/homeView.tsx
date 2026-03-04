import { tag } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { Navigator } from "@/components/main/navigator"
import { Header } from "@/components/main/header"
import { HomeMapView } from "@/components/map/homeMapView"
import { Box } from "../../components/ui/box"
import { HStack } from "@/components/ui/hstack"

const TAG = tag.homeView

export const HomeView = ({onChangeView, webViewContent}: {onChangeView: any; webViewContent: string}) => {
    return (
        <>
            <HomeMapView onChangeView={onChangeView} webViewContent={webViewContent} />

            <Box style={styles.homeContentContainer}>

                <VStack>
                    <HStack>
                        <Text size='md'>Map control panel</Text>
                    </HStack>

                </VStack>
                
                
            </Box>
            

        </>
    )
}

