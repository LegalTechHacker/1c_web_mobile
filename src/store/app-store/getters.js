export function currentTheme (state) {
  return state.currentTheme
}

export function useOData (state) {
  return state.useOData
}

export function isProvider1C (state) {
  return state.isProvider1C
}

export function baseURL (state) {
  return state.baseURL
}

export function baseURLOData (state) {
  return state.baseURLOData
}

export function me (state) {
  return state.me
}

export function token (state) {
  return state.token
}
export function seanceId (state) {
  return state.seanceId
}

export function isAuthenticated (state) {
  return state.isAuthenticated
}

export function favorites (state) {
  return state.favorites
}

export function notifications (state) {
  return state.notifications
}

export function notificationsLength (state) {
  return state.notifications.length
}

export function prevMenuItemType (state) {
  return state.prevMenuItemType
}
export function currentMenuItemType (state) {
  return state.currentMenuItemType
}
export function prevMenuItemID (state) {
  return state.prevMenuItemID
}
export function currentMenuItemID (state) {
  return state.currentMenuItemID
}
export function currentMenuItemURL (state) {
  return state.currentMenuItemURL
}

export function listODataMetadata (state) {
  return state.listODataMetadata
}

export function listDataMetadata (state) {
  return state.listDataMetadata
}

export function prevSearchObjectURL (state) {
  return state.prevSearchObjectURL
}
export function currentSearchObjectURL (state) {
  return state.currentSearchObjectURL
}
export function currentSearchObjectData (state) {
  return state.currentSearchObjectData
}
export function currentSearchObjectDataLoading (state) {
  return state.currentSearchObjectDataLoading
}
export function currentSearchObjectIsDelete (state) {
  return state.currentSearchObjectIsDelete
}
export function currentSearchObjectFavorite (state) {
  return state.currentSearchObjectFavorite
}
export function isCurrentSearchObjectFavorite (state) {
  let isCurrentSearchObjectFavorite = false
  state.favorites.forEach(element => {
    if (state.currentSearchObjectURL) {
      if (element?.title === state.currentSearchObjectURL) {
        isCurrentSearchObjectFavorite = true
      }
    }
  })
  return isCurrentSearchObjectFavorite
}

export function showSearchTR (state) {
  return state.showSearchTR
}
export function inFullscreenSearchTR (state) {
  return state.inFullscreenSearchTR
}
export function propsSearchTR (state) {
  return state.propsSearchTR
}

export function prevReportURL (state) {
  return state.prevReportURL
}
export function currentReportURL (state) {
  return state.currentReportURL
}
export function currentReportData (state) {
  return state.currentReportData
}
export function currentReportDataLoading (state) {
  return state.currentReportDataLoading
}

export function currentObjectReportData (state) {
  return state.currentObjectReportData
}
export function currentObjectReportDataLoading (state) {
  return state.currentObjectReportDataLoading
}

export function prevObjectURL (state) {
  return state.prevObjectURL
}
export function currentObjectURL (state) {
  return state.currentObjectURL
}
export function currentObjectData (state) {
  return state.currentObjectData
}
export function currentObjectDataLoading (state) {
  return state.currentObjectDataLoading
}
export function currentObjectDataTables (state) {
  return state.currentObjectDataTables
}

export function showTR (state) {
  return state.showTR
}
export function inFullscreenTR (state) {
  return state.inFullscreenTR
}
export function propsTR (state) {
  return state.propsTR
}

export function isNested (state) {
  return state.isNested
}
export function isIframeMy (state) {
  return state.isIframeMy
}

export function isMobile (state) {
  return state.isMobile
}

export function settings (state) {
  return state.settings
}
