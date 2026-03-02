import { tag, region } from "@/components/tag"
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

const TAG = tag.selectRegionModal

export interface SelectRegionModalHandle {
    open: () => void
    close: () => void
}

interface SelectRegionModalProps {
    selectBtnFun?: (label:string) => void
    closeBtnFun?: () => void
}

export const SelectRegionModal = forwardRef<SelectRegionModalHandle, SelectRegionModalProps>((props, ref) => {
    const defaultRegionLabel = "No selected region"
    const [visible, setVisible] = useState(false)
    const [selectedRegion, setSelectedRegion] = useState<string>(defaultRegionLabel)

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
        if (label == selectedRegion) {
            setSelectedRegion(defaultRegionLabel)
        }
        else {
            Common.writeConsole(TAG, `select region: ${label}`)
            setSelectedRegion(label)
        }
        
    }

    const confirmSelectBtnFun = () => {
        if (!props.selectBtnFun) {
            Common.writeConsole(TAG, `selectBtnFun is not defined`)
            return
        }
        else {
            if (selectedRegion == defaultRegionLabel) {
                props.selectBtnFun('Region')
            }
            else {
                Common.writeConsole(TAG, `execute selectBtnFun`)
                props.selectBtnFun(selectedRegion)
            }
        }
            
        closeHandler()
    }

    const closeBtnFun = () => {
        if (!props.closeBtnFun) {
            Common.writeConsole(TAG, `closeBtnFun is not defined`)
            closeHandler()
            return
        }
        else {
            Common.writeConsole(TAG, `execute closeBtnFun`)
            props.closeBtnFun()
        }
    }

    return (
        <Modal visible={visible} transparent>

            <Box style={styles.modalBackground}>

                <Box style={styles.commonModalTitleContainer}>
                    <Text style={styles.commonModalTitleLabel}>Select Region</Text>
                </Box>

                <Box style={[styles.commonModalContainer, {height: 'auto', paddingVertical: 20}]}>
                    <VStack space="md" style={styles.commonModalListContainer}>
                        {region.map((region) => (
                            <VStack space="sm" key={region.id}>
                                <Pressable onPress={() => selectBtnFun(region.label)} style={{backgroundColor: selectedRegion == region.label ? '#DDD' : '#FFF'}}>
                                    <Text style={{paddingHorizontal: 10}}>{region.label}</Text>
                                </Pressable>
                                <Divider />
                            </VStack>
                        ))}
                    </VStack>

                    <Text style={{paddingHorizontal: 10, width: '100%'}}>Selected Region: {selectedRegion}</Text>
                </Box>

                <Box style={styles.twoBtnRowContainer}>
                    <Pressable style={styles.common2BtnModalBtnContainer} onPress={() => confirmSelectBtnFun()}>
                        <Text style={styles.common2BtnModalBtnLabel}>Select</Text>
                    </Pressable>

                    <Divider orientation="vertical" />

                    <Pressable style={styles.common2BtnModalBtnContainer} onPress={() => closeBtnFun()}>
                        <Text style={styles.common2BtnModalBtnLabel}>Close</Text>
                    </Pressable>
                </Box>
            </Box>

        </Modal>
    )
})