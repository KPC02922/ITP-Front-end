import { tag } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { Navigator } from "@/components/main/navigator"
import { Header } from "@/components/main/header"

const TAG = tag.reportView

export const ReportView = () => {
    return (
        <>

            <VStack style={styles.container}>
                <Text size='md'>Report view</Text>
            </VStack>

        </>
    )
}

