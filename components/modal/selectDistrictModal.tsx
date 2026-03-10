import { tag, district } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import React, {useState, useRef, forwardRef, useImperativeHandle, useEffect} from 'react'
// import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from "../ui/modal"
import { Text } from "../ui/text"
import { HStack } from "../ui/hstack"
import { Button, ButtonText } from "../ui/button"
import { Box } from "../ui/box"
import { Heading } from "../ui/heading"
import { Modal, Pressable, ScrollView, View } from "react-native"
import { Divider } from "../ui/divider"
import { VStack } from "../ui/vstack"

const TAG = tag.selectDistrictModal

export interface SelectDistrictModalHandle {
    open: () => void
    close: () => void
    setSelectedRegion: (district: string) => void
    resetSelectedDistrict: () => void
}

interface SelectDistrictModalProps {
    selectBtnFun?: (label:string) => void
    closeBtnFun?: () => void
}

export const SelectDistrictModal = forwardRef<SelectDistrictModalHandle, SelectDistrictModalProps>((props, ref) => {
    const defaultDistrictLabel = "No selected district"
    const defaultRegion = "Region"
    const [visible, setVisible] = useState(false)
    const [selectedDistrict, setSelectedDistrict] = useState<string>(defaultDistrictLabel)
    const [selectedRegion, setSelectedRegion] = useState<string>(defaultRegion)
    const [displayDistrictList, setDisplayDistrictList] = useState(district)

    useImperativeHandle(ref, () => ({
        open: () => openHandler(),
        close: () => closeHandler(),
        setSelectedRegion: (region: string) => setSelectedRegionHandler(region),
        resetSelectedDistrict: () => setSelectedDistrict(defaultDistrictLabel)
    }))

    const openHandler = () => {
        Common.writeConsole(TAG, `open modal selectedRegion: ${selectedRegion}`)
        if (selectedRegion == defaultRegion) {
            setDisplayDistrictList(district)
        }
        else {
            const filteredDistrict = district.filter((item) => item.region == selectedRegion)
            Common.writeConsole(TAG, `filtered district list: ${JSON.stringify(filteredDistrict)}`)
            setDisplayDistrictList(filteredDistrict)
        }
        setVisible(true)
    }

    const closeHandler = () => {
        Common.writeConsole(TAG, `close modal`)
        setVisible(false)
    }

    const selectBtnFun = (label:string) => {
        if (label == selectedDistrict) {
            setSelectedDistrict(defaultDistrictLabel)
        }
        else {
            Common.writeConsole(TAG, `select district: ${label}`)
            setSelectedDistrict(label)
        }
        
    }

    const confirmSelectBtnFun = () => {
        if (!props.selectBtnFun) {
            Common.writeConsole(TAG, `selectBtnFun is not defined`)
            return
        }
        else {
            if (selectedDistrict == defaultDistrictLabel) {
                props.selectBtnFun('District')
            }
            else {
                Common.writeConsole(TAG, `execute selectBtnFun`)
                props.selectBtnFun(selectedDistrict)
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

    const setSelectedRegionHandler = (region: string) => {
        Common.writeConsole(TAG, `set selected region: ${region}`)
        setSelectedRegion(region)
    }

    return (
        <Modal visible={visible} transparent>

            <Box style={styles.modalBackground}>

                <Box style={styles.commonModalTitleContainer}>
                    <Text style={styles.commonModalTitleLabel}>Select Region</Text>
                </Box>

                <Box style={[styles.commonModalContainer, {minHeight: 300, paddingVertical: 20}]}>
                    <ScrollView style={{width: '100%', height: 'auto'}}>
                        <VStack space="md" style={styles.commonModalListContainer}>
                            {displayDistrictList.map((district) => (
                                <VStack space="sm" key={district.id}>
                                    <Pressable className="rounded-full" onPress={() => selectBtnFun(district.label)} style={{backgroundColor: selectedDistrict == district.label ? '#32b4f4' : '#FFF'}}>
                                        <Text style={{paddingHorizontal: 10, color: selectedDistrict == district.label ? '#FFF' : '#000'}}>{district.label}</Text>
                                    </Pressable>
                                    <Divider className="bg-info-950" />
                                </VStack>
                            ))}
                        </VStack>
                    </ScrollView>

                    <Text style={{paddingHorizontal: 10, width: '100%', color: '#000'}}>Selected District: {selectedDistrict}</Text>
                </Box>

                <Box style={styles.twoBtnRowContainer}>
                    <Pressable style={styles.common2BtnModalBtnContainer} onPress={() => confirmSelectBtnFun()}>
                        <Text style={styles.common2BtnModalBtnLabel}>Select</Text>
                    </Pressable>

                    <Divider orientation="vertical" className="bg-info-0"/>

                    <Pressable style={styles.common2BtnModalBtnContainer} onPress={() => closeBtnFun()}>
                        <Text style={styles.common2BtnModalBtnLabel}>Close</Text>
                    </Pressable>
                </Box>
            </Box>

        </Modal>
    )
})