export const region = [
    { id: 1, label: 'Hong Kong Island', value: 'HK' },
    { id: 2, label: 'Kowloon', value: 'KL' },
    { id: 3, label: 'New Territories', value: 'NT' },
]

export const district = [
    { id: 1, label: 'Central and Western', value: 'Central and Western', region: 'Hong Kong Island' },
    { id: 2, label: 'Wan Chai', value: 'Wan Chai', region: 'Hong Kong Island' },
    { id: 3, label: 'Eastern', value: 'Eastern', region: 'Hong Kong Island' },
    { id: 4, label: 'Southern', value: 'Southern', region: 'Hong Kong Island' },
    { id: 5, label: 'Yau Tsim Mong', value: 'Yau Tsim Mong', region: 'Kowloon' },
    { id: 6, label: 'Sham Shui Po', value: 'Sham Shui Po', region: 'Kowloon' },
    { id: 7, label: 'Kowloon City', value: 'Kowloon City', region: 'Kowloon' },
    { id: 8, label: 'Wong Tai Sin', value: 'Wong Tai Sin', region: 'Kowloon' },
    { id: 9, label: 'Kwun Tong', value: 'Kwun Tong', region: 'Kowloon' },
    { id: 10, label: 'Kwai Tsing', value: 'Kwai Tsing', region: 'New Territories' },
    { id: 11, label: 'Tsuen Wan', value: 'Tsuen Wan', region: 'New Territories' },
    { id: 12, label: 'Tuen Mun', value: 'Tuen Mun', region: 'New Territories' },
    { id: 13, label: 'Yuen Long', value: 'Yuen Long', region: 'New Territories' },
    { id: 14, label: 'North', value: 'North', region: 'New Territories' },
    { id: 15, label: 'Tai Po', value: 'Tai Po', region: 'New Territories' },
    { id: 16, label: 'Sha Tin', value: 'Sha Tin', region: 'New Territories' },
    { id: 17, label: 'Sai Kung', value: 'Sai Kung', region: 'New Territories' },
    { id: 18, label: 'Islands', value: 'Islands', region: 'New Territories' },
]

export const store = [
    { id: 1, label: 'SF Express'},
    { id: 2, label: 'Jockey Club'},
    { id: 3, label: 'Others'},
]

export const mapMarkerTag = {
    rainfall: 'Rainfall',
    flooding: 'Flooding',
    allUmbrellaRental: 'All Umbrella Rental',
    umbrellaRental: 'Umbrella rental',
    sfExpress: 'SF Express',
    jockeyClub: 'Jockey Club',
    otherStore: 'Other store',
}

 export const tag = {
    // common & funtional view
    app: 'app',
    common: 'common',
    header: 'header',
    mainView: 'mainView',
    navigator: 'navigator',
    settingView: 'settingView',

    // home view
    homeView: 'homeView',
    homeMapView: 'homeMapView',
    homeWeatherView: 'homeWeatherView',

    // info view
    infoView: 'infoView',
    infoViewRainfallTab: 'Rainfall',
    infoViewFloodingTab: 'Flooding',
    infoViewUmbrellaRentalTab: 'Umbrella Rental',
    infoViewRainRelatedTab: 'rainRelatedTab',   

    // report view
    reportView: 'reportView',
    reportViewTab: 'reportViewTab',
    reportViewRainfallTab: 'Rainfall',
    reportViewFloodingTab: 'Flooding',
    reportViewUmbrellaRentalTab: 'Umbrella Rental',

    // modal
    selectRegionModal: 'selectRegionModal',
    selectDistrictModal: 'selectDistrictModal',
    selectStoreModal: 'selectStoreModal',
    mapControllPanelModal: 'mapControllPanelModal',
    mapSelectLatLngModal: 'mapSelectLatLngModal',
    messageModal: 'messageModal',

    // api
    weatherApi: 'weatherApi',
    currentWeatherReport: 'currentWeatherReport',
    automaticWeatherStation: 'automaticWeatherStation',

    // controller
    homeMapMarkerController: 'homeMapMarkerController',

    // other
    rainRelateListItem: 'rainRelateListItem',
    
    
} as const