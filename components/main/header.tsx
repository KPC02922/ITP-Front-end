import { tag } from "../tag"
import { Box } from "../ui/box"
import { Text } from "../ui/text"
import { Platform, StatusBar } from "react-native"
import { styles } from "@/assets/styles/styles"

const TAG = tag.header

export const Header = () => {
    const headerHorizontalPadding = 10
    const STATUS_BAR_HEIGHT = ( Platform.OS == 'ios' ? 0 : StatusBar.currentHeight || 24 ) + headerHorizontalPadding

    return (
        
        <Box style={[styles.headerBar, {paddingTop: STATUS_BAR_HEIGHT, paddingBottom: headerHorizontalPadding}]}>
            <Text className="text-typography-white" size='lg' style={styles.headerText}>Header</Text>
        </Box>

    )
}