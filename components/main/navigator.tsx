import { tag } from "../tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import { Box } from "../ui/box"
import { Text } from "../ui/text"
import { HStack } from "../ui/hstack"
import { Divider } from '@/components/ui/divider'
import { Pressable } from '@/components/ui/pressable'
import { VStack } from "../ui/vstack"
import { Info, Home, Edit } from "lucide-react-native"

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
                    <HStack style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Info color="#FFFFFF" size={20} style={{marginRight: 5}} />
                        <Text className="text-typography-white" size='lg' style={styles.navigatorText}>Info</Text>
                    </HStack>
                </Pressable>

                <Divider orientation="vertical" />

                <Pressable onPress={() => onPressHandler(tag.homeView)} style={styles.navigatorBtnContainer}>
                    <HStack style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Home color="#FFFFFF" size={20} style={{marginRight: 5}} />
                        <Text className="text-typography-white" size='lg' style={styles.navigatorText}>Home</Text>
                    </HStack>
                </Pressable>

                <Divider orientation="vertical" />

                <Pressable onPress={() => onPressHandler(tag.reportView)} style={styles.navigatorBtnContainer}>
                    <HStack style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Edit color="#FFFFFF" size={20} style={{marginRight: 5}} />
                        <Text className="text-typography-white" size='lg' style={styles.navigatorText}>Report</Text>
                    </HStack>
                </Pressable>
            </HStack>
            
            <Box style={{paddingBottom: narbarPaddingBottom}} />
        </VStack>

    )
}