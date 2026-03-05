import { tag } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { Formik } from "formik"
import * as Yup from "yup"
import { TextInput } from "react-native"
import { Button, ButtonText } from "@/components/ui/button"
import { Box } from "@/components/ui/box"

const TAG = tag.reportViewTab

export const ReportViewTabbackup = ({type, webViewContent}: {type: string, webViewContent: string}) => {
    const rainfallReportInitialValues = {
        region: '',
        district: '',
        location: '',
        lat: 0,
        lng: 0,
        rate: 0,
    }

    const floodingReportInitialValues = {
        region: '',
        district: '',
        location: '',
        lat: 0,
        lng: 0,
    }

    const umbrellaRentalReportInitialValues = {
        region: '',
        district: '',
        location: '',
        lat: 0,
        lng: 0,
        storeName: '',
        officeHours: '',
    }

    const rainfallReportSchema = Yup.object().shape({
        region: Yup.string().required('Region is required'),
        district: Yup.string().required('District is required'),
        location: Yup.string().required('Location is required'),
        lat: Yup.number().required('Latitude is required'),
        lng: Yup.number().required('Longitude is required'),
        rate: Yup.number().required('Rainfall rate is required'),
    })

    const floodingReportSchema = Yup.object().shape({
        region: Yup.string().required('Region is required'),
        district: Yup.string().required('District is required'),
        location: Yup.string().required('Location is required'),
        lat: Yup.number().required('Latitude is required'),
        lng: Yup.number().required('Longitude is required'),
    })

    const umbrellaRentalReportSchema = Yup.object().shape({
        region: Yup.string().required('Region is required'),
        district: Yup.string().required('District is required'),
        location: Yup.string().required('Location is required'),
        lat: Yup.number().required('Latitude is required'),
        lng: Yup.number().required('Longitude is required'),
        storeName: Yup.string().required('Store name is required'),
        officeHours: Yup.string().required('Office hours is required'),
    })
    

    return (
        <Box style={{padding: 10}}>
            <Formik
                initialValues={{test: ''}}

                // validationSchema={type == tag.reportViewRainfallTab ? rainfallReportSchema :
                // type == tag.reportViewFloodingTab ? floodingReportSchema :
                // type == tag.reportViewUmbrellaRentalTab ? umbrellaRentalReportSchema :
                // rainfallReportSchema}

                onSubmit={(values) => {Common.writeConsole(TAG, `submit report: ${JSON.stringify(values)}`)}}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <VStack>
                        <Text style={[{textAlign: 'center'}]}>{type} report form</Text>

                        <TextInput onChangeText={handleChange('test')} onBlur={handleBlur('test')} value={values.test} />

                        <Button onPress={() => handleSubmit()}>
                            <ButtonText>Submit</ButtonText>
                        </Button>
                    </VStack>
                )}

                
            </Formik>


        </Box>
    )
}