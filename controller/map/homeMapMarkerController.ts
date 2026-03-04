import { tag, mapMarkerTag } from "@/components/tag"
import { styles } from "@/assets/styles/styles"
import * as Common from "@/common"

const TAG = tag.homeMapMarkerController

let rainfallMarkerVisibility = true
let floodingMarkerVisibility = true
let umbrellaRentalMarkerVisibility = true
let sfExpressMarkerVisibility = true
let jockeyClubMarkerVisibility = true
let otherStoreMarkerVisibility = true

const allUnderUmbrellaRentalList = [mapMarkerTag.umbrellaRental, mapMarkerTag.sfExpress, mapMarkerTag.jockeyClub, mapMarkerTag.otherStore]

const mapMarkermap: Record<string, boolean> = {
    [mapMarkerTag.rainfall]: rainfallMarkerVisibility,
    [mapMarkerTag.flooding]: floodingMarkerVisibility,
    [mapMarkerTag.umbrellaRental]: umbrellaRentalMarkerVisibility,
    [mapMarkerTag.sfExpress]: sfExpressMarkerVisibility,
    [mapMarkerTag.jockeyClub]: jockeyClubMarkerVisibility,
    [mapMarkerTag.otherStore]: otherStoreMarkerVisibility,
}

export const initMarkerVisibility =  async () => {
    Common.writeConsole(TAG, `Init marker visibility`)
    const rainfallMarkerVisibility = await Common.AsyncGetData(mapMarkerTag.rainfall, 'true') == 'true'
    const floodingMarkerVisibility = await Common.AsyncGetData(mapMarkerTag.flooding, 'true') == 'true'
    const umbrellaRentalMarkerVisibility = await Common.AsyncGetData(mapMarkerTag.umbrellaRental, 'true') == 'true'
    const sfExpressMarkerVisibility = await Common.AsyncGetData(mapMarkerTag.sfExpress, 'true') == 'true'
    const jockeyClubMarkerVisibility = await Common.AsyncGetData(mapMarkerTag.jockeyClub, 'true') == 'true'
    const otherStoreMarkerVisibility = await Common.AsyncGetData(mapMarkerTag.otherStore, 'true') == 'true'

    mapMarkermap[mapMarkerTag.rainfall] = rainfallMarkerVisibility
    mapMarkermap[mapMarkerTag.flooding] = floodingMarkerVisibility
    mapMarkermap[mapMarkerTag.umbrellaRental] = umbrellaRentalMarkerVisibility
    mapMarkermap[mapMarkerTag.sfExpress] = sfExpressMarkerVisibility
    mapMarkermap[mapMarkerTag.jockeyClub] = jockeyClubMarkerVisibility
    mapMarkermap[mapMarkerTag.otherStore] = otherStoreMarkerVisibility

    Common.writeConsole(TAG, `Marker visibility initialized: ${JSON.stringify(mapMarkermap)}`)
}

export const getMarkerVisibility = (tag: string) => {
    if (mapMarkermap.hasOwnProperty(tag)) {
        return mapMarkermap[tag]
    }
    else {
        Common.writeConsole(TAG, `Marker tag ${tag} not found`)
        return false
    }
}

export const switchMarkersVisible = (tag: string, visible?: boolean) => {
    Common.writeConsole(TAG, `Switch marker visibility for ${tag}`)
    if (mapMarkermap[tag] != undefined) {
        if (tag == mapMarkerTag.umbrellaRental) {
            const urBoolean = !mapMarkermap[mapMarkerTag.umbrellaRental]

            if (!visible) {
                allUnderUmbrellaRentalList.forEach(tag => {
                    mapMarkermap[tag] = urBoolean
                    Common.AsyncStoreData(tag, urBoolean ? 'true' : 'false')
                })
            }
            else {
                mapMarkermap[mapMarkerTag.umbrellaRental] = urBoolean
                Common.AsyncStoreData(mapMarkerTag.umbrellaRental, urBoolean ? 'true' : 'false')
            }
        }
        else {
            if (visible !== undefined) {
                mapMarkermap[tag] = visible
            } else {
                mapMarkermap[tag] = !mapMarkermap[tag]
            }

            Common.writeConsole(TAG, `Marker tag ${tag} set to ${mapMarkermap[tag]}`)
            Common.AsyncStoreData(tag, mapMarkermap[tag] ? 'true' : 'false')
        }
        
        
    }
}