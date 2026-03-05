import { tag, store } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import React, {useState, useRef, forwardRef, useImperativeHandle, useEffect} from 'react'
import { Text } from "../ui/text"
import { HStack } from "../ui/hstack"
import { Button, ButtonText } from "../ui/button"
import { Box } from "../ui/box"
import { Heading } from "../ui/heading"
import { Modal, Pressable, TouchableOpacity, View } from "react-native"
import { Divider } from "../ui/divider"
import { VStack } from "../ui/vstack"
import { AnimationType, INFINITE_ANIMATION_ITERATIONS, LeafletView, WebviewLeafletMessage, WebviewLeafletMessagePayload } from "react-native-leaflet-view"
import { Fab, FabIcon } from "../ui/fab"
import { Locate, MapPin } from "lucide-react-native"

const TAG = tag.messageModal

export interface MessageModalHandle {
    open: () => void
    close: () => void
}

interface MessageModalProps {
    numberOfBtn: number
    message: string
    title?: string
    selectBtnFun?: () => void
    closeBtnFun?: () => void
}

export const MessageModal = forwardRef<MessageModalHandle, MessageModalProps>((props, ref) => {
    const [visible, setVisible] = useState(false)
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const numberOfBtn = props.numberOfBtn

    useImperativeHandle(ref, () => ({
        open: () => openHandler(),
        close: () => closeHandler()
    }))

    const openHandler = () => {
        Common.writeConsole(TAG, `open modal`)
        setTitle(props.title || '')
        setMessage(props.message || '')
        setVisible(true)
    }

    const closeHandler = () => {
        Common.writeConsole(TAG, `close modal`)
        if (props.closeBtnFun) {
            props.closeBtnFun()
        }
        setVisible(false)
    }

    const selectBtnFun = () => {
        if (props.selectBtnFun) {
            props.selectBtnFun()
        }
        closeHandler()
    }

    return (
        <Modal visible={visible} transparent>

            <Box style={styles.modalBackground}>

                <Box style={[styles.commonModalTitleContainer]}>
                    <Text style={styles.commonModalTitleLabel}>{title}</Text>
                </Box>

                <Box style={[styles.commonModalContainer, {minHeight: "20%", paddingVertical: 20}]}>
                    <Text style={styles.commonModalMessageLabel}>{message}</Text>
                </Box>

                {numberOfBtn == 1 && 
                    <Box style={styles.closeBtnRowContainer}>
                        <Pressable style={styles.closeBtnRowBtnContainer} onPress={() => closeHandler()}>
                            <Text style={styles.common2BtnModalBtnLabel}>Close</Text>
                        </Pressable>
                    </Box>
                }

                {numberOfBtn == 2 && 
                    <Box style={[styles.twoBtnRowContainer]}>
                        <Pressable style={styles.common2BtnModalBtnContainer} onPress={() => selectBtnFun()}>
                            <Text style={styles.common2BtnModalBtnLabel}>Select</Text>
                        </Pressable>

                    <Divider orientation="vertical" />

                    <Pressable style={styles.common2BtnModalBtnContainer} onPress={() => closeHandler()}>
                        <Text style={styles.common2BtnModalBtnLabel}>Close</Text>
                    </Pressable>
                </Box>}
            </Box>

        </Modal>
    )
})