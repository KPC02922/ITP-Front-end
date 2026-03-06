import { tag } from "../tag"
import { Box } from "../ui/box"
import { Text } from "../ui/text"
import { Platform, StatusBar } from "react-native"
import { styles } from "@/assets/styles/styles"
import { useEffect, useState } from "react"

const TAG = tag.header

export const Header = ({view} : {view: string}) => {
    const headerHorizontalPadding = 10
    const STATUS_BAR_HEIGHT = ( Platform.OS == 'ios' ? 0 : StatusBar.currentHeight || 24 ) + headerHorizontalPadding
    const [title, setTitle] = useState<string>('')

    useEffect(() => {
        switch (view) {
            case tag.infoView:
                setTitle('User Report')
                break
            case tag.reportView:
                setTitle('Create Report')
                break
            case tag.settingView:
                setTitle('Setting')
                break
            default:
                setTitle('')
        }
    }, [view])

    return (
        
        <Box style={[styles.headerBar, {paddingTop: STATUS_BAR_HEIGHT, paddingBottom: headerHorizontalPadding}]}>
            <Text className="text-typography-white" size='lg' style={styles.headerText}>{title}</Text>
        </Box>

    )
}