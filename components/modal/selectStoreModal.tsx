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

const TAG = tag.selectStoreModal

export interface SelectStoreModalHandle {
    open: () => void
    close: () => void
}

interface SelectStoreModalProps {
    selectBtnFun?: (label:string) => void
    closeBtnFun?: () => void
}

export const SelectStoreModal = forwardRef<SelectStoreModalHandle, SelectStoreModalProps>((props, ref) => {
    const defaultStoreLabel = "No selected store"
    const [visible, setVisible] = useState(false)
    const [selectedStore, setSelectedStore] = useState<string>(defaultStoreLabel)

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
        setVisible(false)
    }

    const selectBtnFun = (label:string) => {
        if (label == selectedStore) {
            setSelectedStore(defaultStoreLabel)
        }
        else {
            Common.writeConsole(TAG, `select store: ${label}`)
            setSelectedStore(label)
        }
    }

    const confirmSelectBtnFun = () => {
        if (!props.selectBtnFun) {
            Common.writeConsole(TAG, `selectBtnFun is not defined`)
            return
        }
        else {
            if (selectedStore == defaultStoreLabel) {
                props.selectBtnFun('Store')
            }
            else {
                Common.writeConsole(TAG, `execute selectBtnFun`)
                props.selectBtnFun(selectedStore)
            }
        }

        closeHandler()
    }

    return (
        <Modal visible={visible} transparent>

            <Box style={styles.modalBackground}>

                <Box style={styles.commonModalTitleContainer}>
                    <Text style={styles.commonModalTitleLabel}>Select Store</Text>
                </Box>

                <Box style={[styles.commonModalContainer, {height: 'auto', paddingVertical: 20}]}>
                    <VStack space="md" style={styles.commonModalListContainer}>
                        {store.map((region) => (
                            <VStack space="sm" key={region.id}>
                                <Pressable onPress={() => selectBtnFun(region.label)} style={{backgroundColor: selectedStore == region.label ? '#DDD' : '#FFF'}}>
                                    <Text style={{paddingHorizontal: 10}}>{region.label}</Text>
                                </Pressable>
                                <Divider />
                            </VStack>
                        ))}
                    </VStack>

                    <Text style={{paddingHorizontal: 10, width: '100%'}}>Selected Store: {selectedStore}</Text>
                </Box>

                <Box style={styles.twoBtnRowContainer}>
                    <Pressable style={styles.common2BtnModalBtnContainer} onPress={() => confirmSelectBtnFun()}>
                        <Text style={styles.common2BtnModalBtnLabel}>Select</Text>
                    </Pressable>

                    <Divider orientation="vertical" />

                    <Pressable style={styles.common2BtnModalBtnContainer} onPress={() => closeHandler()}>
                        <Text style={styles.common2BtnModalBtnLabel}>Close</Text>
                    </Pressable>
                </Box>
            </Box>

        </Modal>
    )
})