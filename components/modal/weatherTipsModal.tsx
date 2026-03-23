import { tag } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import React, {useState, useRef, forwardRef, useImperativeHandle, useEffect} from 'react'
import { Text } from "../ui/text"
import { HStack } from "../ui/hstack"
import { Box } from "../ui/box"
import { Modal, Pressable, TouchableOpacity, View } from "react-native"
import { VStack } from "../ui/vstack"
import { CloudRain, Droplet } from "lucide-react-native"

const TAG = tag.weatherTipsModal

export interface WeatherTipsModalHandle {
    open: () => void
    close: () => void
}

interface WeatherTipsModalProps {
    selectBtnFun?: () => void
    closeBtnFun?: () => void
}

export const WeatherTipsModal = forwardRef<WeatherTipsModalHandle, WeatherTipsModalProps>((props, ref) => {
    const [visible, setVisible] = useState(false)

    useImperativeHandle(ref, () => ({
        open: () => openHandler(),
        close: () => closeHandler()
    }))

    const openHandler = () => {
        Common.writeConsole(TAG, `open modal`)
        setVisible(true)
    }

    const closeHandler = () => {
        Common.writeConsole(TAG, `close modal`)
        if (props.closeBtnFun) {
            props.closeBtnFun()
        }
        setVisible(false)
    }

    return (
        <Modal visible={visible} transparent>

            <Box style={styles.modalBackground}>

                <Box style={[styles.commonModalTitleContainer]}>
                    <Text style={styles.commonModalTitleLabel}></Text>
                </Box>

                <Box style={[styles.commonModalContainer, {height: "auto", paddingVertical: 20}]}>
                    <VStack space="md" style={{paddingHorizontal: 20}}>
                        <HStack space="md" style={styles.hastckContainer}>
                            <CloudRain size={20} color={Common.getRainColor(0)} />
                            <Text size='lg' style={{flex: 99}}>{`Rainfall = 0mm`}</Text>
                        </HStack>

                        <HStack space="md" style={styles.hastckContainer}>
                            <CloudRain size={20} color={Common.getRainColor(5)} />
                            <Text size='lg' style={{flex: 99}}>{`Rainfall > 0mm`}</Text>
                        </HStack>

                        <HStack space="md" style={styles.hastckContainer}>
                            <CloudRain size={20} color={Common.getRainColor(10)} />
                            <Text size='lg' style={{flex: 99}}>{`Rainfall >= 10mm`}</Text>
                        </HStack>

                        <HStack space="md" style={styles.hastckContainer}>
                            <CloudRain size={20} color={Common.getRainColor(20)} />
                            <Text size='lg' style={{flex: 99}}>{`Rainfall >= 20mm`}</Text>
                        </HStack>

                        <HStack space="md" style={styles.hastckContainer}>
                            <CloudRain size={20} color={Common.getRainColor(30)} />
                            <Text size='lg' style={{flex: 99}}>{`Rainfall >= 30mm`}</Text>
                        </HStack>

                        <HStack space="md" style={styles.hastckContainer}>
                            <CloudRain size={20} color={Common.getRainColor(50)} />
                            <Text size='lg' style={{flex: 99}}>{`Rainfall >= 50mm`}</Text>
                        </HStack>

                        <Text size="sm" style={{textAlign: "justify"}}>The Amber, Red abd Black weather warning are reffer to Hong Kong Observatory Rainstorm Warning System.</Text>

                    </VStack>
                </Box>

                
                <Box style={styles.closeBtnRowContainer}>
                    <Pressable style={styles.closeBtnRowBtnContainer} onPress={() => closeHandler()}>
                        <Text style={styles.common2BtnModalBtnLabel}>Close</Text>
                    </Pressable>
                </Box>
                

            </Box>

        </Modal>
    )
})