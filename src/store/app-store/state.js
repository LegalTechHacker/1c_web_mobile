export default function () {
  return {
    currentTheme: '',
    //currentTheme: 'theme-urait',
    //currentTheme: 'theme-sirius',
    //useOData: true, // TODO проверить корректность работы
    useOData: false,
    isProvider1C: true,
    baseURL: '../../../',
    baseURLOData: '../../../odata/standard.odata/',
    me: null,
    token: '',
    seanceId: '',
    isAuthenticated: false,
    favorites: [],
    notifications: [],
    prevMenuItemType: '',
    prevMenuItemID: '',
    currentMenuItemType: '',
    currentMenuItemID: '',
    currentMenuItemURL: '',
    listODataMetadata: [],
    listDataMetadata: [],
    prevSearchObjectURL: '',
    currentSearchObjectURL: '',
    currentSearchObjectData: null,
    currentSearchObjectDataLoading: false,
    currentSearchObjectIsDelete: false,
    currentSearchObjectFavorite: false,
    showSearchTR: false,
    inFullscreenSearchTR: false,
    propsSearchTR: null,
    prevReportURL: '',
    currentReportURL: '',
    currentReportData: null,
    currentReportDataLoading: false,
    currentObjectReportData: null,
    currentObjectReportDataLoading: false,
    prevObjectURL: '',
    currentObjectURL: '',
    currentObjectData: null,
    currentObjectDataLoading: false,
    currentObjectDataTables: null,
    showTR: false,
    inFullscreenTR: false,
    propsTR: null,
    isNested: false,
    isIframeMy: false,
    isMobile: false,
    settings: {}
  }
}
