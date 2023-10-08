export const setMe = (state, payload) => {
  state.me = payload
  if (!state.me) {
    state.isAuthenticated = false
    localStorage.removeItem('me')
  } else {
    state.isAuthenticated = true
    localStorage.setItem(
      'me',
      btoa(unescape(encodeURIComponent(JSON.stringify(state.me))))
    )
  }
}
export const setToken = (state, payload) => {
  let strBase = '' + payload.username + ':'
  if (payload.password) {
    strBase += '' + payload.password
  }
  state.token = btoa(unescape(encodeURIComponent(strBase)))
  state.isAuthenticated = true
  localStorage.setItem('token', state.token)
}
export const setSeanceId = (state, payload) => {
  state.seanceId = payload
}

export const setCurrentMe = (state, payload) => {
  state.me = payload
}
export const setCurrentToken = (state, payload) => {
  state.token = payload
}
export const setCurrentIsAuthenticated = (state, payload) => {
  state.isAuthenticated = payload
}

export const removeToken = state => {
  state.me = {}
  state.token = ''
  state.seanceId = ''
  state.isAuthenticated = false
  localStorage.removeItem('me')
  localStorage.removeItem('token')
}

export const setCurrentTheme = (state, payload) => {
  state.currentTheme = payload
}

export const setUseOData = (state, payload) => {
  state.useOData = payload
}

export const setIsProvider1C = (state, payload) => {
  state.isProvider1C = payload
  state.baseURLOData =
    '' + (state.isProvider1C === true)
      ? '' + state.baseURL + 'odata/standard.odata/'
      : state.baseURL
}

export const setBaseURL = (state, payload) => {
  state.baseURL = payload
  state.baseURLOData =
    '' + (state.isProvider1C === true)
      ? '' + state.baseURL + 'odata/standard.odata/'
      : state.baseURL
}

export const setBaseURLOData = (state, payload) => {
  state.baseURLOData = payload
}

export const setFavorites = (state, payload) => {
  state.favorites = payload
}

export const addItemFromFavorites = (state, item) => {
  //state.favorites.push(item)
  state.favorites.unshift(item)
}

export const deleteItemFromFavorites = (state, id) => {
  state.favorites.splice(id, 1)
}

export const setNotifications = (state, payload) => {
  state.notifications = payload
}

export const addItemFromNotifications = (state, item) => {
  //state.notifications.push(item)
  state.notifications.unshift(item)
}

export const doneItemFromNotifications = (state, id) => {
  state.notifications.splice(id, 1)
}

export const deleteItemFromNotifications = (state, id) => {
  state.notifications.splice(id, 1)
}

export const setPrevMenuItemType = (state, payload) => {
  state.prevMenuItemType = payload
}
export const setCurrentMenuItemType = (state, payload) => {
  state.currentMenuItemType = payload
}
export const setPrevMenuItemID = (state, payload) => {
  state.prevMenuItemID = payload
}
export const setCurrentMenuItemID = (state, payload) => {
  state.currentMenuItemID = payload
}

export const setCurrentMenuItemURL = (state, payload) => {
  state.currentMenuItemURL = payload
}

export const setListODataMetadata = (state, payload) => {
  state.listODataMetadata = payload
}

export const setListDataMetadata = (state, payload) => {
  state.listDataMetadata = payload
}

export const setPrevSearchObjectURL = (state, payload) => {
  state.prevSearchObjectURL = payload
}
export const setCurrentSearchObjectURL = (state, payload) => {
  if (payload) {
    if (state.prevSearchObjectURL !== payload) {
      state.currentSearchObjectURL = payload
    }
  } else {
    state.currentSearchObjectURL = ''
  }
}
export const setCurrentSearchObjectData = (state, payload) => {
  state.currentSearchObjectData = payload
}
export const setCurrentSearchObjectDataLoading = (state, payload) => {
  state.currentSearchObjectDataLoading = payload
}
export const setCurrentSearchObjectIsDelete = (state, payload) => {
  state.currentSearchObjectIsDelete = payload
}
export const setCurrentSearchObjectFavorite = (state, payload) => {
  state.currentSearchObjectFavorite = payload
}

export const setShowSearchTR = (state, payload) => {
  state.showSearchTR = payload
}
export const setInFullscreenSearchTR = (state, payload) => {
  state.inFullscreenSearchTR = payload
}
export const setPropsSearchTR = (state, payload) => {
  state.propsSearchTR = payload
}

export const setPrevReportURL = (state, payload) => {
  state.prevReportURL = payload
}
export const setCurrentReportURL = (state, payload) => {
  if (payload) {
    if (state.prevReportURL !== payload) {
      state.currentReportURL = payload
    }
  } else {
    state.currentReportURL = ''
  }
}
export const setCurrentReportData = (state, payload) => {
  state.currentReportData = payload
}
export const setCurrentReportDataLoading = (state, payload) => {
  state.currentReportDataLoading = payload
}

export const setCurrentObjectReportData = (state, payload) => {
  state.currentObjectReportData = payload
}
export const setCurrentObjectReportDataLoading = (state, payload) => {
  state.currentObjectReportDataLoading = payload
}

export const setPrevObjectURL = (state, payload) => {
  state.prevObjectURL = payload
}

export const setCurrentObjectURL = (state, payload) => {
  if (payload) {
    if (state.prevObjectURL !== payload) {
      state.currentObjectURL = payload
    }
  } else {
    state.currentObjectURL = ''
  }
}
export const setCurrentObjectData = (state, payload) => {
  state.currentObjectData = payload
}
export const setCurrentObjectDataLoading = (state, payload) => {
  state.currentObjectDataLoading = payload
}
export const setCurrentObjectDataTables = (state, payload) => {
  state.currentObjectDataTables = payload
}

export const setShowTR = (state, payload) => {
  state.showTR = payload
}
export const setInFullscreenTR = (state, payload) => {
  state.inFullscreenTR = payload
}
export const setPropsTR = (state, payload) => {
  state.propsTR = payload
}

export const setIsNested = (state, payload) => {
  state.isNested = payload
}
export const setIsIframeMy = (state, payload) => {
  state.isIframeMy = payload
}

export const setIsMobile = (state, payload) => {
  state.isMobile = payload
}

export const setSettings = (state, payload) => {
  state.settings = payload
}

export const setStateValueByKey = (state, payload) => {
  if (!!payload.name && !!payload.key && !!payload.subKey && !!payload.value) {
    if (state[payload.name][payload.key][payload.subKey]) {
      state[payload.name][payload.key][payload.subKey] = payload.value
    }
  } else if (!!payload.name && !!payload.key && !!payload.value) {
    if (state[payload.name][payload.key]) {
      state[payload.name][payload.key] = payload.value
    }
  }
}
