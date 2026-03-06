import { tag, region, district } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { Keyboard, Platform, Pressable, TextInput } from "react-native"
import { Button, ButtonText } from "@/components/ui/button"
import { Box } from "@/components/ui/box"
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control"
import { Input, InputField, InputSlot } from "@/components/ui/input"
import { useState, useEffect, use } from "react"
import { CircleAlert, ChevronDown, MapPin, Droplet, RotateCcw, Send } from "lucide-react-native"
import { HStack } from "@/components/ui/hstack"
import { ScrollView } from "react-native"
import { Divider } from "@/components/ui/divider"
import DateTimePicker from '@react-native-community/datetimepicker'

const TAG = tag.reportViewTab

export const ReportViewTab = (
    {type, pressRegionBtn, pressDistrictBtn, pressMapSelectBtn, showMessage, selectedRegion, selectedDistrict, selectedLatLng, reset}
    : {type: string, pressRegionBtn: () => void, pressDistrictBtn: () => void, pressMapSelectBtn: () => void, showMessage: () => void,
        selectedRegion: string, selectedDistrict: string, selectedLatLng: {lat: number, lng: number}, reset: boolean}
) => {
    const [region, setRegion] = useState<string>('')
    const [district, setDistrict] = useState<string>('')
    const [location, setLocation] = useState<string>('')
    const [lat, setLat] = useState<number>(0)
    const [lng, setLng] = useState<number>(0)
    const [rate, setRate] = useState<number>(1)
    const [storeName, setStoreName] = useState<string>('')
    const [officeOpenHours, setOfficeOpenHours] = useState<Date | null>(null)
    const [officeCloseHours, setOfficeCloseHours] = useState<Date | null>(null)

    const [valid, setValid] = useState<boolean>(true)
    const [regionValid, setRegionValid] = useState<boolean>(true)
    const [districtValid, setDistrictValid] = useState<boolean>(true)
    const [locationValid, setLocationValid] = useState<boolean>(true)
    const [latLngValid, setLatLngValid] = useState<boolean>(true)
    const [storeNameValid, setStoreNameValid] = useState<boolean>(true)
    const [officeOpenHoursValid, setOfficeOpenHoursValid] = useState<boolean>(true)
    const [officeCloseHoursValid, setOfficeCloseHoursValid] = useState<boolean>(true)

    const rateList = [1, 2, 3, 4, 5]
    const [startTimeTimepickerVisible, setStartTimeTimepickerVisible] = useState<boolean>(false)
    const [endTimeTimepickerVisible, setEndTimeTimepickerVisible] = useState<boolean>(false)


    const districtPressHandler = () => {
        if (region != '') {
            pressDistrictBtn()
        }
    }

    const latLngSelectHandler = () => {
        pressMapSelectBtn()
    }

    const ratePressHandler = (index: number) => {
        setRate(index)
    }

    const startTimeHandler = (time: Date) => {
        setOfficeOpenHours(time)
        setStartTimeTimepickerVisible(false)
    }

    const endTimeHandler = (time: Date) => {
        setOfficeCloseHours(time)
        setEndTimeTimepickerVisible(false)
    }

    const resetForm = () => {
        setRegion('')
        setDistrict('')
        setLocation('')
        setLat(0)
        setLng(0)
        setRate(1)
        setStoreName('')
        setOfficeOpenHours(null)
        setOfficeCloseHours(null)
        setRegionValid(true)
        setDistrictValid(true)
        setLocationValid(true)
        setLatLngValid(true)
        setStoreNameValid(true)
        setOfficeOpenHoursValid(true)
        setOfficeCloseHoursValid(true)
        setValid(true)
        Keyboard.dismiss()
    }

    const validateForm = () => {
        if (type == tag.reportViewRainfallTab || type == tag.reportViewFloodingTab) {
            setRegionValid(region != '')
            setDistrictValid(district != '')
            setLocationValid(location != '')
            setLatLngValid(lat != 0 && lng != 0)
            return region != '' && district != '' && location != '' && lat != 0 && lng != 0
        }
        else if (type == tag.reportViewUmbrellaRentalTab) {
            setRegionValid(region != '')
            setDistrictValid(district != '')
            setLocationValid(location != '')
            setLatLngValid(lat != 0 && lng != 0)
            setStoreNameValid(storeName != '')
            setOfficeOpenHoursValid(officeOpenHours != null)
            setOfficeCloseHoursValid(officeCloseHours != null)
            return region != '' && district != '' && location != '' && lat != 0 && lng != 0 && storeName != '' && officeOpenHours != null && officeCloseHours != null
        }
        else {
            return valid
        }
    }

    const submitReport = () => {
        if (!validateForm()) {
            Common.writeConsole(TAG, `form is invalid`)
            setValid(false)
            return
        }

        setValid(true)
        const reportData = {
            region: region,
            district: district,
            location: location,
            latitude: lat,
            longitude: lng,
            rate: type == tag.reportViewRainfallTab ? rate : undefined,
            storeName: type == tag.reportViewUmbrellaRentalTab ? storeName : undefined,
            officeHours: type == tag.reportViewUmbrellaRentalTab ? 
            `${officeOpenHours?.toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit'})} - ${officeCloseHours?.toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit'})}` 
            : undefined
        }
        Common.writeConsole(TAG, `submit report: ${JSON.stringify(reportData)}`)
        showMessage()
    }

    useEffect(() => {
        if (selectedRegion == 'Region') {
            setRegion('')
            setDistrict('')
        }
        else {
            setRegion(selectedRegion)
            setDistrict('')
            setRegionValid(true)
        }
    }, [selectedRegion])

    useEffect(() => {
        if (selectedDistrict == 'District') {
            setDistrict('')
        }
        else {            
            setDistrict(selectedDistrict)
            setDistrictValid(true)
        }
    }, [selectedDistrict])

    useEffect(() => {
        if (location != '') {
            setLocationValid(true)
        }
    }, [location])

    useEffect(() => {        
        if (selectedLatLng.lat != 0 && selectedLatLng.lng != 0) {
            setLat(selectedLatLng.lat)
            setLng(selectedLatLng.lng)
            setLatLngValid(true)
        }
    }, [selectedLatLng])

    useEffect(() => {
        if (storeName != '') {
            setStoreNameValid(true)
        }
    }, [storeName])

    useEffect(() => {
        if (officeOpenHours != null) {
            setOfficeOpenHoursValid(true)
        }
    }, [officeOpenHours])

    useEffect(() => {
        if (officeCloseHours != null) {
            setOfficeCloseHoursValid(true)
        }
    }, [officeCloseHours])

    useEffect(() => {
        resetForm()
    }, [type, reset])

    // region, district, location, lat, lng, rate (for rainfall report)
    // region, district, location, lat, lng (for flooding report)
    // region, district, location, lat, lng, storeName, officeHours (for umbrella rental report)
    return (
        <Box style={{padding: 10, paddingBottom: 75}}><ScrollView showsVerticalScrollIndicator={false}>
            
            <FormControl style={styles.fullWidth} isInvalid={!valid}>
                <VStack space="md">
                    {/* Region and District Inputs */}
                    <HStack space="md" style={styles.fullWidth}>
                        <Box style={{flex: 50}}>
                            <FormControlLabel>
                                <FormControlLabelText>Region</FormControlLabelText>
                            </FormControlLabel>
                            
                            <Input style={styles.hastckContainer} isInvalid={!regionValid}>
                                <InputField 
                                    placeholder="Select region" 
                                    value={region} 
                                    editable={false} 
                                />
                                <InputSlot onPress={pressRegionBtn} style={{padding: 10, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 4}}>
                                    <ChevronDown size={20}/>
                                </InputSlot>
                            </Input>
                            
                            <FormControlHelper>
                                <FormControlHelperText >Tap to select region</FormControlHelperText>
                            </FormControlHelper>
                            
                            {!regionValid && <FormControlError>
                                <FormControlErrorIcon as={CircleAlert} />
                                <FormControlErrorText >Region is required</FormControlErrorText>
                            </FormControlError>}                   
                        </Box>

                        <Box style={{flex: 50}}>
                            <FormControlLabel>
                                <FormControlLabelText>District</FormControlLabelText>
                            </FormControlLabel>

                            <Input style={styles.hastckContainer} isDisabled={region == ''} isInvalid={!districtValid}>
                                <InputField 
                                    placeholder="Select district" 
                                    value={district} 
                                    editable={false} 
                                />
                                <InputSlot 
                                    onPress={districtPressHandler} 
                                    style={{padding: 10, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 4}}
                                >
                                    <ChevronDown size={20}/>
                                </InputSlot>
                            </Input>
                            
                            <FormControlHelper>
                                <FormControlHelperText>{region == '' ? `Select Region first` : 'Tap to select district'}</FormControlHelperText>
                            </FormControlHelper>
                            
                            {!districtValid && <FormControlError>
                                <FormControlErrorIcon as={CircleAlert} />
                                <FormControlErrorText>District is required</FormControlErrorText>
                            </FormControlError>  }                      
                        </Box>
                        
                    </HStack>

                    {/* Location Input */}

                    <Box style={styles.fullWidth}>
                        <FormControlLabel>
                            <FormControlLabelText>{type == tag.reportViewUmbrellaRentalTab ? 'Address' : 'Location'}</FormControlLabelText>
                        </FormControlLabel>
                        
                        <Input style={styles.hastckContainer} isInvalid={!locationValid}>
                            <InputField 
                                placeholder={type == tag.reportViewUmbrellaRentalTab ? 'Enter address' : 'Enter location'} 
                                value={location}
                                onChangeText={(input) => setLocation(input)}
                            />
                        </Input>
                        
                        <FormControlHelper>
                            <FormControlHelperText >{type == tag.reportViewUmbrellaRentalTab ? 'Enter store full address' : 'Enter location e.g. Causway Bay Station / IFC mall'}</FormControlHelperText>
                        </FormControlHelper>
                        
                        {!locationValid && <FormControlError>
                            <FormControlErrorIcon as={CircleAlert} />
                            <FormControlErrorText >Location is required</FormControlErrorText>
                        </FormControlError> }     
                    </Box>

                    {/* lat and lng Inputs */}

                    <VStack style={styles.fullWidth}>
                        <HStack space="md" style={styles.hastckContainer}>
                            <Box style={{flex: 40}}>
                                <FormControlLabel>
                                    <FormControlLabelText>Latitude</FormControlLabelText>
                                </FormControlLabel>
                                
                                <Input style={styles.hastckContainer} isReadOnly={true} isInvalid={!latLngValid}>
                                    <InputField 
                                        placeholder="Enter latitude" 
                                        value={lat.toString()} 
                                        editable={false} 
                                    />
                                </Input>
                                
                                {!latLngValid && <FormControlError>
                                    <FormControlErrorIcon as={CircleAlert} />
                                    <FormControlErrorText>Latitude is required</FormControlErrorText>
                                </FormControlError>  }                      
                            </Box>

                            <Box style={{flex: 40}}>
                                <FormControlLabel>
                                    <FormControlLabelText>Longitude</FormControlLabelText>
                                </FormControlLabel>

                                <Input style={styles.hastckContainer} isReadOnly={true} isInvalid={!latLngValid}>
                                    <InputField 
                                        placeholder="Enter longitude" 
                                        value={lng.toString()} 
                                        editable={false} 
                                    />
                                </Input>
                                
                                {!latLngValid && <FormControlError>
                                    <FormControlErrorIcon as={CircleAlert} />
                                    <FormControlErrorText>Longitude is required</FormControlErrorText>
                                </FormControlError> }                       
                            </Box>

                            <Box style={latLngValid ? {flex: 20, paddingTop: 25} : {flex: 20, paddingTop: 0}}>
                                <Button variant="solid" size="md" action="primary" onPress={latLngSelectHandler}>
                                    <MapPin size={20} color="#FFFFFF"/>
                                </Button>
                            </Box>
                            
                        </HStack>

                        <Text size="sm" className="text-typography-500">Enter latitude and longitude by dragging the marker on the map</Text>
                    </VStack>

                    {/* Rate Input (only for rainfall report) */}

                    {type == tag.reportViewRainfallTab ?
                        <Box style={styles.fullWidth}>
                            <FormControlLabel>
                                <FormControlLabelText>Rainfall Rate</FormControlLabelText>
                            </FormControlLabel>
                            {/* style={{height: 0, width: 0}} */}
                            <Input isReadOnly={true}  style={{height: 0, width: 0}}> 
                                <InputField 
                                    placeholder={rate.toString()}
                                    value={rate.toString()}
                                    onChangeText={(input) => setRate(Number(input))}
                                    style={{height: 0, width: 0}}
                                />
                            </Input>

                            <Box style={[styles.fullWidth]}>
                                <HStack style={[styles.hastckContainer]} space="4xl" className="justify-between">
                                    <Text size="xl">1</Text>

                                    {rateList.map((_, i) => (
                                        <Pressable key={i} onPress={() => ratePressHandler(i+1)}>
                                            <Droplet key={i} color={i < rate ? "#007AFF" : "#838383"} size={30} />
                                        </Pressable>
                                    ))}

                                    <Text size="xl">5</Text>
                                </HStack>
                            </Box>

                            <FormControlHelper>
                                <FormControlHelperText>{`Click on the icon to rate how heavy the rain is\n1 = Light Rain | 5 = Heavy Rain`}</FormControlHelperText>
                            </FormControlHelper>
                        </Box>
                    : null
                    }


                    {/* Store Name and Office Hours Inputs (only for umbrella rental report) */}
                    {type == tag.reportViewUmbrellaRentalTab ? 
                    <Box style={styles.fullWidth}>
                        <FormControlLabel>
                            <FormControlLabelText>Store Name</FormControlLabelText>
                        </FormControlLabel>
                        
                        <Input style={styles.hastckContainer} isInvalid={!storeNameValid}>
                            <InputField 
                                placeholder="Enter store name" 
                                value={storeName}
                                onChangeText={(input) => setStoreName(input)}
                            />
                        </Input>
                        
                        <FormControlHelper>
                            <FormControlHelperText >Enter store name (apart from SF Epress and Jockey Club)</FormControlHelperText>
                        </FormControlHelper>
                        
                        {!storeNameValid && <FormControlError>
                            <FormControlErrorIcon as={CircleAlert} />
                            <FormControlErrorText >Store name is required</FormControlErrorText>
                        </FormControlError> }     
                    </Box>
                    : null
                    }

                    {type == tag.reportViewUmbrellaRentalTab ? 
                    <HStack space="md" style={styles.fullWidth}>
                        <Box style={{flex: 50}}>
                            <FormControlLabel>
                                <FormControlLabelText>Office Hours</FormControlLabelText>
                            </FormControlLabel>
                            
                            <Input style={styles.hastckContainer} isInvalid={!officeOpenHoursValid} isReadOnly={true}>
                                <InputField 
                                    placeholder="-- : --" 
                                    value={officeOpenHours ? officeOpenHours.toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit'}) : ''}
                                    editable={false} 
                                />
                                <InputSlot onPress={() => setStartTimeTimepickerVisible(true)} style={{padding: 10, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 4}}>
                                    <ChevronDown size={20}/>
                                </InputSlot>
                            </Input>

                            
                            
                            <FormControlHelper>
                                <FormControlHelperText >Select open hour</FormControlHelperText>
                            </FormControlHelper>
                            
                            {!officeOpenHoursValid && <FormControlError>
                                <FormControlErrorIcon as={CircleAlert} />
                                <FormControlErrorText >Open hour is required</FormControlErrorText>
                            </FormControlError> }     
                        </Box>

                        <Box style={{flex: 50}}>
                            <FormControlLabel>
                                <FormControlLabelText></FormControlLabelText>
                            </FormControlLabel>
                            
                            <Input style={styles.hastckContainer} isInvalid={!officeCloseHoursValid} isReadOnly={true}>
                                <InputField 
                                    placeholder="-- : --" 
                                    value={officeCloseHours ? officeCloseHours.toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit'}) : ''}
                                    editable={false} 
                                />
                                <InputSlot onPress={() => setEndTimeTimepickerVisible(true)} style={{padding: 10, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 4}}>
                                    <ChevronDown size={20}/>
                                </InputSlot>
                            </Input>

                            
                            
                            <FormControlHelper>
                                <FormControlHelperText >Select close hour</FormControlHelperText>
                            </FormControlHelper>
                            
                            {!officeCloseHoursValid && <FormControlError>
                                <FormControlErrorIcon as={CircleAlert} />
                                <FormControlErrorText >Close hour is required</FormControlErrorText>
                            </FormControlError> }     
                        </Box>
                    </HStack>
                    
                    : null
                    }

                    <Divider style={{margin: 5, width: '95%', alignSelf: 'center'}} />

                    {/* Reset and Submit Button */}
                    <Button variant="solid" size="lg" action="primary" onPress={resetForm}>
                        <RotateCcw size={16} color="#FFFFFF" style={{marginRight: 5}}/>
                        <ButtonText>Reset</ButtonText>
                    </Button>

                    <Button variant="solid" size="lg" action="primary" onPress={submitReport}>
                        <Send size={16} color="#FFFFFF" style={{marginRight: 5}} />
                        <ButtonText>Submit Report</ButtonText>
                    </Button>

                    {startTimeTimepickerVisible && <DateTimePicker
                        value={officeOpenHours || new Date()}
                        mode={'time'}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                            startTimeHandler(selectedDate || new Date())
                        }}
                        minimumDate={new Date()}
                    />}

                    {endTimeTimepickerVisible && <DateTimePicker
                        value={officeCloseHours || new Date()}
                        mode={'time'}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                            endTimeHandler(selectedDate || new Date())
                        }}
                        minimumDate={new Date()}
                    />}
                </VStack>
            </FormControl>

        </ScrollView></Box>
    )
}