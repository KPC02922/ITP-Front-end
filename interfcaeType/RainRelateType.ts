export default interface RainRelateType {
    id: number,
    regionCode: string,
    districtCode: string,
    location: string,
    postTime?: string,
    updateTime?: string,
    rate?: number,
    storeName?: string,
    officeHours?: string,
    latitude: number,
    longitude: number,
    status: string
}