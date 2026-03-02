import { tag } from "../tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import { Box } from "../ui/box"
import { Text } from "../ui/text"
import { HStack } from "../ui/hstack"
import { Divider } from '@/components/ui/divider'
import { Pressable } from '@/components/ui/pressable'
import { VStack } from "../ui/vstack"

const TAG = tag.navigator

export const Navigator = ({onChangeView}: any) => {
    const navbarHeight = 86
    const narbarPaddingBottom = 36
    
    const onPressHandler = (view: string) => {
        onChangeView(tag.navigator, view)
    }

    return (

        <VStack style={[styles.navigatorBar, {height: navbarHeight}]}>
            <HStack>
                <Pressable onPress={() => onPressHandler(tag.infoView)} style={styles.navigatorBtnContainer}>
                    <Text className="text-typography-white" size='lg' style={styles.navigatorText}>Info</Text>
                </Pressable>

                <Divider orientation="vertical" />

                <Pressable onPress={() => onPressHandler(tag.homeView)} style={styles.navigatorBtnContainer}>
                    <Text className="text-typography-white" size='lg' style={styles.navigatorText}>Home</Text>
                </Pressable>

                <Divider orientation="vertical" />

                <Pressable onPress={() => onPressHandler(tag.reportView)} style={styles.navigatorBtnContainer}>
                    <Text className="text-typography-white" size='lg' style={styles.navigatorText}>Report</Text>
                </Pressable>
            </HStack>
            
            <Box style={{paddingBottom: narbarPaddingBottom}} />
        </VStack>

    )
}