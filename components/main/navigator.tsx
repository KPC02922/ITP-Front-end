import { tag } from "../tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import { Box } from "../ui/box"
import { Text } from "../ui/text"
import { HStack } from "../ui/hstack"
import { Divider } from '@/components/ui/divider'
import { Pressable } from '@/components/ui/pressable'
import { VStack } from "../ui/vstack"
import { Info, Home, Edit, MessageSquareWarning, Plus } from "lucide-react-native"
import { use, useEffect, useState } from "react"

const TAG = tag.navigator

export const Navigator = ({onChangeView, resetInfoViewDefault, view}
    : {onChangeView: (fromView: string, toView: string) => void, resetInfoViewDefault: () => void, view: string}
) => {
    const navbarHeight = 106
    const narbarPaddingBottom = 50
    const [currentView, setCurrentView] = useState<string>(view)
    const selectedColor = "#000000"
    const defaultColor = "#FFFFFF"
    
    const onPressHandler = (view: string) => {
        if (view === tag.infoView) {
            resetInfoViewDefault()
        }
        onChangeView(tag.navigator, view)
    }

    useEffect(() => {
        setCurrentView(view)
    }, [view])

    return (

        <VStack style={[styles.navigatorBar, {height: navbarHeight}]}>
            <HStack>
                <Pressable onPress={() => onPressHandler(tag.infoView)} style={styles.navigatorBtnContainer}>
                    <VStack style={[currentView === tag.infoView ? styles.navigatorBtnContainerSelected : {}, {justifyContent: 'center', alignItems: 'center'}]}>
                        <MessageSquareWarning color={currentView === tag.infoView ? selectedColor : defaultColor} size={16} style={{marginRight: 5, marginTop: 5}} />
                        <Text style={[{ color: currentView === tag.infoView ? selectedColor : defaultColor }, styles.navigatorText]} size='md' >User Report</Text>
                    </VStack>
                </Pressable>

                <Divider orientation="vertical" />

                <Pressable onPress={() => onPressHandler(tag.homeView)} style={styles.navigatorBtnContainer}>
                    <VStack style={[currentView === tag.homeView ? styles.navigatorBtnContainerSelected : {}, {justifyContent: 'center', alignItems: 'center'}]}>
                        <Home color={currentView === tag.homeView ? selectedColor : defaultColor} size={16} style={{marginRight: 5, marginTop: 5}} />
                        <Text style={[{ color: currentView === tag.homeView ? selectedColor : defaultColor }, styles.navigatorText]} size='md' >Home</Text>
                    </VStack>
                </Pressable>

                <Divider orientation="vertical" />

                <Pressable onPress={() => onPressHandler(tag.reportView)} style={styles.navigatorBtnContainer}>
                    <VStack style={[currentView === tag.reportView ? styles.navigatorBtnContainerSelected : {}, {justifyContent: 'center', alignItems: 'center'}]}>
                        <Plus color={currentView === tag.reportView ? selectedColor : defaultColor} size={16} style={{marginRight: 5, marginTop: 5}} />
                        <Text style={[{ color: currentView === tag.reportView ? selectedColor : defaultColor }, styles.navigatorText]} size='md' >Create Report</Text>
                    </VStack>
                </Pressable>
            </HStack>
            
            <Box style={{paddingBottom: narbarPaddingBottom}} />
        </VStack>

    )
}