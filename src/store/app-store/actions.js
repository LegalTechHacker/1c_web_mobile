import axios from 'axios'
import AppMixin from 'src/mixins/app.mixin'

export const doLogin = async ({ commit }, login) => {
  if (login.username) {
    const url = 'app/query'
    let strBase = '' + login.username + ':'
    if (login.password) {
      strBase += '' + login.password
    }
    const headers = {
      Authorization: 'Basic ' + btoa(unescape(encodeURIComponent(strBase))),
      IBSession: 'start'
    }
    const payload = {
      type: 'query',
      data: {
        type: 'login'
      }
    }
    await axios
      .post(
        url,
        {
          payload: btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
        },
        {
          headers: headers
        }
      )
      .then(async response => {
        if (
          response.data.success &&
          response.data.response?.user?.Description !==
            'СистемныйПользовательПриложения'
        ) {
          await commit('setMe', response.data.response)
          await commit('setToken', login)
          //console.log(JSON.stringify(response, null, 2))
          await commit('setSeanceId', '') //TODO
        } else {
          commit('removeToken')
        }
      })
      .catch(error => {
        console.log(error.message)
        commit('removeToken')
      })
  } else {
    commit('removeToken')
  }
}
export const signOut = async ({ commit }, token) => {
  const url = 'app/query'
  let headers = ''
  if (token) {
    headers = {
      Authorization: 'Basic ' + token,
      IBSession: 'finish'
    }
  } else {
    headers = {
      IBSession: 'finish'
    }
  }
  const payload = {
    type: 'query',
    data: {
      type: 'logout'
    }
  }
  await axios
    .post(
      url,
      {
        payload: btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
      },
      {
        headers: headers
      }
    )
    .then(() => {
      commit('removeToken')
    })
    .catch(error => {
      console.log(error.message)
      commit('removeToken')
    })
}
export const appInit = async ({ commit }) => {
  const me = localStorage.getItem('me')
  const token = localStorage.getItem('token')
  if (me && token) {
    await commit(
      'setCurrentMe',
      JSON.parse(decodeURIComponent(escape(atob(me))))
    )
    await commit('setCurrentToken', token)
    await axios
      .post(
        'app/query',
        {
          payload: btoa(
            unescape(
              encodeURIComponent(
                JSON.stringify({
                  type: 'query',
                  data: {
                    type: 'logout'
                  }
                })
              )
            )
          )
        },
        {
          headers: {
            IBSession: 'finish'
          }
        }
      )
      .then(async () => {
        await axios
          .post(
            'app/query',
            {
              payload: btoa(
                unescape(
                  encodeURIComponent(
                    JSON.stringify({
                      type: 'query',
                      data: {
                        type: 'login'
                      }
                    })
                  )
                )
              )
            },
            {
              headers: {
                Authorization: 'Basic ' + token,
                IBSession: 'start'
              }
            }
          )
          .then(async response => {
            await commit('setCurrentIsAuthenticated', true)
            //console.log(JSON.stringify(response, null, 2))
            await commit('setSeanceId', '') //TODO
          })
          .catch(error => {
            console.log(error.message)
            commit('removeToken')
          })
      })
      .catch(error => {
        console.log(error.message)
        commit('removeToken')
      })
  } else {
    await commit('removeToken')
  }
}

export const setCurrentMe = ({ commit }, value) => {
  commit('setCurrentMe', value)
}
export const setCurrentToken = ({ commit }, value) => {
  commit('setCurrentToken', value)
}
export const setCurrentIsAuthenticated = ({ commit }, value) => {
  commit('setCurrentIsAuthenticated', value)
}

export const setCurrentTheme = ({ commit }, value) => {
  commit('setCurrentTheme', value)
}

export const setUseOData = ({ commit }, value) => {
  commit('setUseOData', value)
}

export const setIsProvider1C = ({ commit }, value) => {
  commit('setIsProvider1C', value)
}

export const setBaseURL = ({ commit }, value) => {
  commit('setBaseURL', value)
}

export const setBaseURLOData = ({ commit }, value) => {
  commit('setBaseURLOData', value)
}

export const getFavoritesFrom1C = async ({ commit }, param) => {
  let isCurrentSearchObjectFavorite = false
  let array = []
  param.loading = true
  const url = 'app/query'
  let headers = ''
  if (param.token) {
    headers = {
      Authorization: 'Basic ' + param.token
    }
  }
  const payload = {
    type: 'query',
    data: {
      type: 'getFavoritesFromBase',
      data: param.favorite
    }
  }
  await axios
    .post(
      url,
      {
        payload: btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
      },
      { headers: headers }
    )
    .then(response => {
      let res = []
      try {
        res = response.data.response
      } catch (error) {
        console.log(error.message)
      }
      res.forEach(element => {
        // TODO
        //id //important //url //description
        array.push({
          parent: 'favorites',
          id: element?.id,
          title: element?.url,
          caption: element?.description,
          data: { ...element },
          link: '#/',
          icon: 'icon-mat-grade',
          type: 'from1C'
        })
        if (param?.currentSearchObjectURL) {
          if (element?.url === param?.currentSearchObjectURL) {
            isCurrentSearchObjectFavorite = true
          }
        }
      })
    })
    .catch(error => {
      console.log(error.message)
    })
    .finally(() => {
      //Object.freeze(array)
      commit('setFavorites', array)
      if (param?.currentSearchObjectURL) {
        commit('setCurrentSearchObjectFavorite', isCurrentSearchObjectFavorite)
      }
      param.loading = false
    })
}
export const addFavoriteFrom1C = async ({ commit }, param) => {
  let array = []
  param.loading = true
  const url = 'app/query'
  let headers = ''
  if (param.token) {
    headers = {
      Authorization: 'Basic ' + param.token
    }
  }
  const payload = {
    type: 'query',
    data: {
      type: 'addFavoriteFromBase',
      data: param.favorite
    }
  }
  await axios
    .post(
      url,
      {
        payload: btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
      },
      { headers: headers }
    )
    .then(response => {
      let res = []
      try {
        res = response.data.response
      } catch (error) {
        console.log(error.message)
      }
      res.forEach(element => {
        // TODO
        //id //important //url //description
        array.push({
          parent: 'favorites',
          id: element?.id,
          title: element?.url,
          caption: element?.description,
          data: { ...element },
          link: '#/',
          icon: 'icon-mat-grade',
          type: 'from1C'
        })
        if (param?.currentSearchObjectURL) {
          if (element?.url === param?.currentSearchObjectURL) {
            commit('setCurrentSearchObjectFavorite', true)
          }
        }
      })
    })
    .catch(error => {
      console.log(error.message)
    })
    .finally(() => {
      //Object.freeze(array)
      if (array[0]) {
        commit('addItemFromFavorites', array[0])
      }
      param.loading = false
    })
}
export const setFavorites = ({ commit }, array) => {
  commit('setFavorites', array)
}
export const addItemFromFavorites = ({ commit }, item) => {
  commit('addItemFromFavorites', item)
}
export const deleteItemFromFavorites = async ({ commit }, param) => {
  let res = false
  param.loading = true
  const url = 'app/query'
  let headers = ''
  if (param.token) {
    headers = {
      Authorization: 'Basic ' + param.token
    }
  }
  const payload = {
    type: 'query',
    data: {
      type: 'deleteFavoriteFromBase',
      data: param.favorite
    }
  }
  await axios
    .post(
      url,
      {
        payload: btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
      },
      { headers: headers }
    )
    .then(response => {
      try {
        res = response.data.response
      } catch (error) {
        console.log(error.message)
      }
    })
    .catch(error => {
      console.log(error.message)
    })
    .finally(() => {
      if (res) {
        if (param?.currentSearchObjectURL) {
          if (param?.favorite?.url === param?.currentSearchObjectURL) {
            commit('setCurrentSearchObjectFavorite', false)
          }
        }
        commit('deleteItemFromFavorites', param?.favorite?.id)
      }
      param.loading = false
    })
}

export const getNotificationsFrom1C = async ({ commit }, param) => {
  let array = []
  param.loading = true
  const url = 'app/query'
  let headers = ''
  if (param.token) {
    headers = {
      Authorization: 'Basic ' + param.token
    }
  }
  const payload = {
    type: 'query',
    data: { type: 'getNotificationsFromBase' }
  }
  await axios
    .post(
      url,
      {
        payload: btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
      },
      { headers: headers }
    )
    .then(response => {
      let res = []
      try {
        res = response.data.response
      } catch (error) {
        console.log(error.message)
      }
      res.forEach(element => {
        // БСП +НапоминанияПользователя
        // ДО +УведомленияПрограммы
        //user //typeEvent //dateEvent //source //description
        array.push({
          parent: '',
          id: AppMixin.methods.uid(),
          title: element?.typeEvent,
          caption: element?.description,
          data: { ...element },
          link: '#/',
          icon: 'icon-mat-event',
          type: 'from1C'
        })
      })
    })
    .catch(error => {
      console.log(error.message)
    })
    .finally(() => {
      array.sort(
        (a, b) => new Date(b.data.dateEvent) - new Date(a.data.dateEvent)
      )
      //Object.freeze(array)
      commit('setNotifications', array)
      param.loading = false
      if (param.useSound) {
        try {
          if (array.length > param.notificationsLength) {
            const audio = new Audio(
              'data:video/mp4;base64,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'
            )
            audio.play()
          }
        } catch (error) {
          console.log(error.message)
        }
      }
    })
}
export const sortNotifications = ({ commit }, array) => {
  array.sort((a, b) => new Date(b.data.dateEvent) - new Date(a.data.dateEvent))
  //Object.freeze(array)
  commit('setNotifications', array)
}
export const setNotifications = ({ commit }, array) => {
  commit('setNotifications', array)
}
export const addItemFromNotifications = ({ commit }, item) => {
  commit('addItemFromNotifications', item)
}
export const doneItemFromNotifications = ({ commit }, id) => {
  commit('doneItemFromNotifications', id)
}
export const addNotificationsFrom1C = async ({ commit }, param) => {
  // TODO addNotificationsFromBase
}
export const deleteItemFromNotifications = async ({ commit }, param) => {
  let res = false
  param.loading = true
  const url = 'app/query'
  let headers = ''
  if (param.token) {
    headers = {
      Authorization: 'Basic ' + param.token
    }
  }
  const payload = {
    type: 'query',
    data: {
      type: 'deleteNotificationFromBase',
      data: param.notification.data
    }
  }
  await axios
    .post(
      url,
      {
        payload: btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
      },
      { headers: headers }
    )
    .then(response => {
      try {
        res = response.data.response
      } catch (error) {
        console.log(error.message)
      }
    })
    .catch(error => {
      console.log(error.message)
    })
    .finally(() => {
      if (res) {
        commit('deleteItemFromNotifications', param.notification.id)
      }
      param.loading = false
    })
}

export const setPrevMenuItemType = ({ commit }, value) => {
  commit('setPrevMenuItemType', value)
}
export const setCurrentMenuItemType = ({ commit }, value) => {
  commit('setCurrentMenuItemType', value)
}
export const setPrevMenuItemID = ({ commit }, value) => {
  commit('setPrevMenuItemID', value)
}
export const setCurrentMenuItemID = ({ commit }, value) => {
  commit('setCurrentMenuItemID', value)
}
export const setCurrentMenuItemURL = ({ commit }, value) => {
  commit('setCurrentMenuItemURL', value)
}

export const setListODataMetadata = async ({ commit }, param) => {
  //http://Администратор:@109.188.84.21/Strahovanie/odata/standard.odata?$format=json

  let array = []
  param.loading = true
  const strQuery = '' + param.baseURLOData + '?$format=json'
  let headers = ''
  if (param.token) {
    headers = { Authorization: 'Basic ' + param.token }
  }
  await axios
    .get(strQuery, '', {
      headers: headers
    })
    .then(response => {
      let res = []
      try {
        res = response.data.value
      } catch (error) {
        console.log(error.message)
      }
      array = AppMixin.methods.buildObjectTreeFromArrayURL(res)
      //console.log(array)
      /*
      res.forEach(element => {
        array.push({
          parent: '',
          id: AppMixin.methods.uid(),
          title: AppMixin.methods.convertToSentence(element.name),
          caption: element.name,
          data: { ...element },
          link: '' + element.url,
          icon: 'icon-mat-public',
          type: 'from1C'
        })
      })
      */
    })
    .catch(error => {
      console.log(error.message)
    })
    .finally(() => {
      //Object.freeze(array)
      commit('setListODataMetadata', array)
      param.loading = false
    })
}
export const setListDataMetadata = async ({ commit }, param) => {
  let array = []
  param.loading = true
  const url = 'app/query'
  let headers = ''
  if (param.token) {
    headers = {
      Authorization: 'Basic ' + param.token
    }
  }
  const payload = {
    type: 'query',
    data: { type: 'getListDataMetadataFromBase' }
  }
  await axios
    .post(
      url,
      {
        payload: btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
      },
      { headers: headers }
    )
    .then(response => {
      let res = []
      try {
        res = response.data.response
      } catch (error) {
        console.log(error.message)
      }
      array = res
    })
    .catch(error => {
      console.log(error.message)
    })
    .finally(() => {
      //Object.freeze(array)
      commit('setListDataMetadata', array)
      param.loading = false
    })
}

export const setPrevSearchObjectURL = ({ commit }, value) => {
  if (value) {
    commit('setPrevObjectURL', '')
    commit('setPrevReportURL', '')
  }
  commit('setPrevSearchObjectURL', value)
}
export const setCurrentSearchObjectURL = ({ commit }, value) => {
  if (value) {
    commit('setCurrentObjectURL', '')
    commit('setCurrentReportURL', '')
  }
  commit('setCurrentSearchObjectURL', value)
}
export const getCurrentSearchObjectData = async ({ commit }, param) => {
  if (param.isAuthenticated) {
    if (param.currentSearchObjectURL) {
      if (!param.useOData) {
        let res = {
          error: '',
          message: '',
          response: {},
          success: false
        }
        let resResponse = res.response
        let refData = {}
        let tableTitle = param.tableTitle
        let rows = []
        let columns = []
        let tables = {}
        param.loading = true
        commit('setCurrentSearchObjectDataLoading', param.loading)
        const url = 'app/query'
        let headers = ''
        if (param.token) {
          headers = {
            Authorization: 'Basic ' + param.token
          }
        }
        const payload = {
          type: 'query',
          data: {
            type: 'getObjectDataFromBase',
            data: {
              menu: param.currentMenuItemID,
              url: param.currentSearchObjectURL,
              pagination: param.pagination,
              filter: param.filter
            }
          }
        }
        await axios
          .post(
            url,
            {
              payload: btoa(
                unescape(encodeURIComponent(JSON.stringify(payload)))
              )
            },
            { headers: headers }
          )
          .then(response => {
            try {
              res = response.data
              resResponse = res?.response
              refData = resResponse?.refData
              tableTitle = resResponse?.title
              rows = resResponse?.rows
              columns = resResponse?.columns
              tables = resResponse?.tables
            } catch (error) {
              console.log(error.message)
            }
          })
          .catch(error => {
            console.log(error.message)
          })
          .finally(() => {
            if (res.error) {
              //console.log(res.error)
              AppMixin.methods.notifyDisplay(
                res.error,
                'icon-mat-error',
                'negative'
              )
            } else {
              commit('setCurrentSearchObjectData', {
                refData: refData,
                title: tableTitle,
                tableTitle: '' + tableTitle + ' (' + rows.length + ')',
                rows: rows,
                columns: columns,
                tables: tables,
                rowKey: param.rowKey
              })
              commit(
                'setCurrentSearchObjectIsDelete',
                refData?.DeletionMark || false
              )
            }
            if (res.message) {
              //console.log(res.message)
              AppMixin.methods.notifyDisplay(res.message, '', 'positive')
            }
            param.loading = false
            commit('setCurrentSearchObjectDataLoading', param.loading)
          })
      }
    }
  }
}
export const setCurrentSearchObjectData = ({ commit }, value) => {
  if (value) {
    commit('setCurrentObjectData', null)
  }
  commit('setCurrentSearchObjectData', value)
}
export const addCurrentSearchObjectData = async ({ commit }, param) => {
  if (param.isAuthenticated) {
    if (param.currentSearchObjectURL) {
      if (!param.useOData) {
        let res = {
          error: '',
          message: '',
          response: {},
          success: false
        }
        let resResponse = res.response
        let refData = {}
        let tableTitle = param.tableTitle
        let rows = []
        let columns = []
        let tables = {}
        param.loading = true
        commit('setCurrentSearchObjectDataLoading', param.loading)
        const url = 'app/query'
        let headers = ''
        if (param.token) {
          headers = {
            Authorization: 'Basic ' + param.token
          }
        }
        const payload = {
          type: 'query',
          data: {
            type: 'addObjectDataFromBase',
            data: {
              menu: param.currentMenuItemID,
              url: param.currentSearchObjectURL,
              refData: param.refData,
              fields: param.fields,
              tablesFields: param.tablesFields
            }
          }
        }
        await axios
          .post(
            url,
            {
              payload: btoa(
                unescape(encodeURIComponent(JSON.stringify(payload)))
              )
            },
            { headers: headers }
          )
          .then(response => {
            try {
              res = response.data
              resResponse = res?.response
              refData = resResponse?.refData
              tableTitle = resResponse?.title
              rows = resResponse?.rows
              columns = resResponse?.columns
              tables = resResponse?.tables
            } catch (error) {
              console.log(error.message)
            }
          })
          .catch(error => {
            console.log(error.message)
          })
          .finally(() => {
            if (res.error) {
              //console.log(res.error)
              AppMixin.methods.notifyDisplay(
                res.error,
                'icon-mat-error',
                'negative'
              )
            } else {
              commit('setCurrentSearchObjectData', {
                refData: refData,
                title: tableTitle,
                tableTitle: '' + tableTitle + ' (' + rows.length + ')',
                rows: rows,
                columns: columns,
                tables: tables,
                rowKey: param.rowKey
              })
              if (refData?.url) {
                if (refData?.url !== param.currentSearchObjectURL) {
                  commit(
                    'setCurrentSearchObjectURL',
                    refData?.url || param.currentSearchObjectURL
                  )
                }
              }
              commit(
                'setCurrentSearchObjectIsDelete',
                refData?.DeletionMark || false
              )
              param.fields = {}
              param.tablesFields = {}
              param.edited = false
              param.editable = false
            }
            if (res.message) {
              //console.log(res.message)
              AppMixin.methods.notifyDisplay(res.message, '', 'positive')
            }
            param.loading = false
            commit('setCurrentSearchObjectDataLoading', param.loading)
          })
      }
    }
  }
}
export const updateCurrentSearchObjectData = async ({ commit }, param) => {
  if (param.isAuthenticated) {
    if (param.currentSearchObjectURL) {
      if (!param.useOData) {
        let res = {
          error: '',
          message: '',
          response: {},
          success: false
        }
        let resResponse = res.response
        let refData = {}
        let tableTitle = param.tableTitle
        let rows = []
        let columns = []
        let tables = {}
        param.loading = true
        commit('setCurrentSearchObjectDataLoading', param.loading)
        const url = 'app/query'
        let headers = ''
        if (param.token) {
          headers = {
            Authorization: 'Basic ' + param.token
          }
        }
        const payload = {
          type: 'query',
          data: {
            type: 'updateObjectDataFromBase',
            data: {
              menu: param.currentMenuItemID,
              url: param.currentSearchObjectURL,
              refData: param.refData,
              fields: param.fields,
              tablesFields: param.tablesFields
            }
          }
        }
        await axios
          .post(
            url,
            {
              payload: btoa(
                unescape(encodeURIComponent(JSON.stringify(payload)))
              )
            },
            { headers: headers }
          )
          .then(response => {
            try {
              res = response.data
              resResponse = res?.response
              refData = resResponse?.refData
              tableTitle = resResponse?.title
              rows = resResponse?.rows
              columns = resResponse?.columns
              tables = resResponse?.tables
            } catch (error) {
              console.log(error.message)
            }
          })
          .catch(error => {
            console.log(error.message)
          })
          .finally(() => {
            if (res.error) {
              //console.log(res.error)
              AppMixin.methods.notifyDisplay(
                res.error,
                'icon-mat-error',
                'negative'
              )
            } else {
              commit('setCurrentSearchObjectData', {
                refData: refData,
                title: tableTitle,
                tableTitle: '' + tableTitle + ' (' + rows.length + ')',
                rows: rows,
                columns: columns,
                tables: tables,
                rowKey: param.rowKey
              })
              if (refData?.url) {
                if (refData?.url !== param.currentSearchObjectURL) {
                  commit(
                    'setCurrentSearchObjectURL',
                    refData?.url || param.currentSearchObjectURL
                  )
                }
              }
              commit(
                'setCurrentSearchObjectIsDelete',
                refData?.DeletionMark || false
              )
              param.fields = {}
              param.tablesFields = {}
              param.edited = false
              param.editable = false
            }
            if (res.message) {
              //console.log(res.message)
              AppMixin.methods.notifyDisplay(res.message, '', 'positive')
            }
            param.loading = false
            commit('setCurrentSearchObjectDataLoading', param.loading)
          })
      }
    }
  }
}
export const deleteCurrentSearchObjectData = async ({ commit }, param) => {
  if (param.isAuthenticated) {
    if (param.currentSearchObjectURL) {
      if (!param.useOData) {
        let res = {
          error: '',
          message: '',
          response: false,
          success: false
        }
        let resResponse = res.response
        param.loading = true
        commit('setCurrentSearchObjectDataLoading', param.loading)
        const url = 'app/query'
        let headers = ''
        if (param.token) {
          headers = {
            Authorization: 'Basic ' + param.token
          }
        }
        const payload = {
          type: 'query',
          data: {
            type: 'deleteObjectDataFromBase',
            data: { url: param.currentSearchObjectURL }
          }
        }
        await axios
          .post(
            url,
            {
              payload: btoa(
                unescape(encodeURIComponent(JSON.stringify(payload)))
              )
            },
            { headers: headers }
          )
          .then(response => {
            try {
              res = response.data
              resResponse = res?.response
            } catch (error) {
              console.log(error.message)
            }
          })
          .catch(error => {
            console.log(error.message)
          })
          .finally(() => {
            if (res.error) {
              //console.log(res.error)
              AppMixin.methods.notifyDisplay(
                res.error,
                'icon-mat-error',
                'negative'
              )
            } else {
              commit('setCurrentSearchObjectIsDelete', resResponse)
            }
            if (res.message) {
              //console.log(res.message)
              AppMixin.methods.notifyDisplay(res.message, '', 'positive')
            }
            param.loading = false
            commit('setCurrentSearchObjectDataLoading', param.loading)
          })
      }
    }
  }
}

export const setShowSearchTR = ({ commit }, value) => {
  commit('setShowSearchTR', value)
}
export const setInFullscreenSearchTR = ({ commit }, value) => {
  commit('setInFullscreenSearchTR', value)
}
export const setPropsSearchTR = ({ commit }, value) => {
  commit('setPropsSearchTR', value)
}

export const setCloseSearchTR = ({ commit }) => {
  commit('setShowSearchTR', false)
  commit('setInFullscreenSearchTR', false)
  commit('setPropsSearchTR', null)
}

export const setPrevReportURL = ({ commit }, value) => {
  if (value) {
    commit('setPrevSearchObjectURL', '')
    commit('setPrevObjectURL', '')
  }
  commit('setPrevReportURL', value)
}
export const setCurrentReportURL = ({ commit }, value) => {
  if (value) {
    commit('setCurrentSearchObjectURL', '')
    commit('setCurrentObjectURL', '')
  }
  commit('setCurrentReportURL', value)
}
export const getCurrentReportData = async ({ commit }, param) => {
  if (param.isAuthenticated) {
    if (param.currentReportURL) {
      if (!param.useOData) {
        let res = {
          error: '',
          message: '',
          response: {},
          success: false
        }
        let resResponse = res.response
        param.loading = true
        commit('setCurrentReportDataLoading', param.loading)
        const url = 'app/query'
        let headers = ''
        if (param.token) {
          headers = {
            Authorization: 'Basic ' + param.token
          }
        }
        const payload = {
          type: 'query',
          data: {
            type: 'getReportFromBase',
            data: {
              menu: param.currentMenuItemID,
              url: param.currentReportURL,
              reportSettings: param.reportSettings
            }
          }
        }
        await axios
          .post(
            url,
            {
              payload: btoa(
                unescape(encodeURIComponent(JSON.stringify(payload)))
              )
            },
            { headers: headers }
          )
          .then(response => {
            try {
              res = response.data
              resResponse = res?.response
            } catch (error) {
              console.log(error.message)
            }
          })
          .catch(error => {
            console.log(error.message)
          })
          .finally(() => {
            if (res.error) {
              //console.log(res.error)
              AppMixin.methods.notifyDisplay(
                res.error,
                'icon-mat-error',
                'negative'
              )
            } else {
              commit('setCurrentReportData', resResponse)
            }
            if (res.message) {
              //console.log(res.message)
              AppMixin.methods.notifyDisplay(res.message, '', 'positive')
            }
            param.loading = false
            commit('setCurrentReportDataLoading', param.loading)
          })
      }
    }
  }
}
export const setCurrentReportData = ({ commit }, value) => {
  if (value) {
    commit('setCurrentObjectData', null)
    commit('setCurrentSearchObjectData', null)
  }
  commit('setCurrentReportData', value)
}

export const getCurrentObjectReportData = async ({ commit }, param) => {
  if (param.isAuthenticated) {
    if (param.currentObjectReportURL) {
      if (!param.useOData) {
        let res = {
          error: '',
          message: '',
          response: {},
          success: false
        }
        let resResponse = res.response
        param.loading = true
        commit('setCurrentObjectReportDataLoading', param.loading)
        const url = 'app/query'
        let headers = ''
        if (param.token) {
          headers = {
            Authorization: 'Basic ' + param.token
          }
        }
        const payload = {
          type: 'query',
          data: {
            type: 'getReportFromBase',
            data: {
              menu: param.currentMenuItemID,
              url: param.currentObjectReportURL,
              reportSettings: param.reportSettings
            }
          }
        }
        await axios
          .post(
            url,
            {
              payload: btoa(
                unescape(encodeURIComponent(JSON.stringify(payload)))
              )
            },
            { headers: headers }
          )
          .then(response => {
            try {
              res = response.data
              resResponse = res?.response
            } catch (error) {
              console.log(error.message)
            }
          })
          .catch(error => {
            console.log(error.message)
          })
          .finally(() => {
            if (res.error) {
              //console.log(res.error)
              AppMixin.methods.notifyDisplay(
                res.error,
                'icon-mat-error',
                'negative'
              )
            } else {
              commit('setCurrentObjectReportData', resResponse)
            }
            if (res.message) {
              //console.log(res.message)
              AppMixin.methods.notifyDisplay(res.message, '', 'positive')
            }
            param.loading = false
            commit('setCurrentObjectReportDataLoading', param.loading)
          })
      }
    }
  }
}
export const setCurrentObjectReportData = ({ commit }, value) => {
  if (value) {
    //commit('setCurrentSearchObjectData', null)
  }
  commit('setCurrentObjectReportData', value)
}

export const setPrevObjectURL = ({ commit }, value) => {
  if (value) {
    commit('setPrevSearchObjectURL', '')
    commit('setPrevReportURL', '')
  }
  commit('setPrevObjectURL', value)
}
export const setCurrentObjectURL = ({ commit }, value) => {
  if (value) {
    commit('setCurrentSearchObjectURL', '')
    commit('setCurrentReportURL', '')
  }
  commit('setCurrentObjectURL', value)
}
export const getCurrentObjectOData = async ({ commit }, param) => {
  if (param.isAuthenticated) {
    if (param.currentObjectURL) {
      if (param.useOData) {
        let rows = []
        let columns = [] //TODO
        param.loading = true

        const top = param.pagination.rowsPerPage
        const skip = param.pagination.rowsPerPage * (param.pagination.page - 1)
        const count = true

        let strQuery =
          '' + param.baseURLOData + param.currentObjectURL + '?$format=json'
        //+'&$select=*____Presentation'
        //+'&allowedOnly=false'
        //+'&$top=100'

        let isPresentationAccessible = true
        let isHasTablePart = false
        let isHasRef_RefType = false

        const arrayNotPresentation = [
          'AccumulationRegister_',
          //'InformationRegister_',
          'CalculationRegister_',
          'AccountingRegister_',
          'Constant_'
        ]
        for (let i = 0; i < arrayNotPresentation.length; i++) {
          if (param.currentObjectURL?.indexOf(arrayNotPresentation[i]) !== -1) {
            isPresentationAccessible = false
            break
          }
        }

        const arrayHasTablePart = [
          'ChartOfCharacteristicTypes_',
          'ChartOfCalculationTypes_',
          'BusinessProcess_',
          'ChartOfAccounts_',
          'ExchangePlan_',
          'Document_',
          'Catalog_',
          'Task_'
        ]
        for (let i = 0; i < arrayHasTablePart.length; i++) {
          if (param.currentObjectURL?.indexOf(arrayHasTablePart[i]) !== -1) {
            isHasTablePart = true
            break
          }
        }

        const arrayGet_Ref_RefType = ['DocumentJournal_']
        for (let i = 0; i < arrayGet_Ref_RefType.length; i++) {
          if (param.currentObjectURL?.indexOf(arrayGet_Ref_RefType[i]) !== -1) {
            isHasRef_RefType = true
            break
          }
        }

        if (isPresentationAccessible) {
          if (isHasTablePart) {
            strQuery += '&$select=Ref_Key,*____Presentation'
          } else if (isHasRef_RefType) {
            strQuery += '&$select=Ref,Ref_Type,*____Presentation'
          } else {
            strQuery += '&$select=*____Presentation'
          }
        }

        let headers = ''
        if (param.token) {
          headers = {
            Authorization: 'Basic ' + param.token
          }
        }

        await axios
          .get(strQuery, '', { headers: headers })
          .then(response => {
            try {
              rows = response.data.value
            } catch (error) {
              console.log(error.message)
            }
          })
          .catch(error => {
            console.log(error.message)
          })
          .finally(() => {
            const tableTitle = '' + param.tableTitle + ' (' + rows.length + ')'
            //Object.freeze(rows)
            commit('setCurrentObjectData', {
              title: param.tableTitle,
              tableTitle: tableTitle,
              rows: rows,
              columns: columns,
              rowKey: param.rowKey
            })
            param.loading = false
          })
      }
    }
  }
}
export const getCurrentObjectData = async ({ commit }, param) => {
  if (param.isAuthenticated) {
    if (param.currentObjectURL) {
      if (!param.useOData) {
        let res = {
          error: '',
          message: '',
          response: {},
          success: false
        }
        let resResponse = res.response
        let count = 0
        let tableTitle = param.tableTitle
        let rows = []
        let columns = []
        let tables = {}
        let reportSettings = {}
        param.loading = true
        commit('setCurrentObjectDataLoading', param.loading)
        const url = 'app/query'
        let headers = ''
        if (param.token) {
          headers = {
            Authorization: 'Basic ' + param.token
          }
        }
        const payload = {
          type: 'query',
          data: {
            type: 'getObjectDataFromBase',
            data: {
              menu: param.currentMenuItemID,
              url: param.currentObjectURL,
              pagination: param.pagination,
              filter: param.filter,
              reportSettings: param.reportSettings
            }
          }
        }
        await axios
          .post(
            url,
            {
              payload: btoa(
                unescape(encodeURIComponent(JSON.stringify(payload)))
              )
            },
            { headers: headers }
          )
          .then(response => {
            try {
              res = response.data
              resResponse = res?.response
              tableTitle = resResponse?.title
              rows = resResponse?.rows
              columns = resResponse?.columns
              tables = resResponse?.tables
              reportSettings = resResponse?.reportSettings || {}
              count = resResponse?.count || rows.length
            } catch (error) {
              console.log(error.message)
            }
          })
          .catch(error => {
            console.log(error.message)
          })
          .finally(() => {
            if (res.error) {
              //console.log(res.error)
              AppMixin.methods.notifyDisplay(
                res.error,
                'icon-mat-error',
                'negative'
              )
            } else {
              //Object.freeze(rows)
              param.pagination.rowsNumber = count
              commit('setCurrentObjectData', {
                count: count,
                pagination: param.pagination,
                title: tableTitle,
                tableTitle: '' + tableTitle + ' (' + count + ')',
                rows: rows,
                columns: columns,
                tables: tables,
                reportSettings: reportSettings,
                rowKey: param.rowKey
              })
            }
            if (res.message) {
              //console.log(res.message)
              AppMixin.methods.notifyDisplay(res.message, '', 'positive')
            }
            param.loading = false
            commit('setCurrentObjectDataLoading', param.loading)
          })
      }
    }
  }
}
export const setCurrentObjectData = ({ commit }, value) => {
  if (value) {
    commit('setCurrentSearchObjectData', null)
  }
  commit('setCurrentObjectData', value)
}
export const setCurrentObjectDataTables = ({ commit }, value) => {
  commit('setCurrentObjectDataTables', value)
}

export const setShowTR = ({ commit }, value) => {
  commit('setShowTR', value)
}
export const setInFullscreenTR = ({ commit }, value) => {
  commit('setInFullscreenTR', value)
}
export const setPropsTR = ({ commit }, value) => {
  commit('setPropsTR', value)
}

export const setCloseTR = ({ commit }) => {
  commit('setShowTR', false)
  commit('setInFullscreenTR', false)
  commit('setPropsTR', null)
}

export const setIsNested = ({ commit }, value) => {
  commit('setIsNested', value)
}
export const setIsIframeMy = ({ commit }, value) => {
  commit('setIsIframeMy', value)
}

export const setIsMobile = ({ commit }, value) => {
  commit('setIsMobile', value)
}

export const getSettings = async ({ commit }, param) => {
  if (param.isAuthenticated) {
    param.loading = true

    let settings = {}

    const url = 'app/query'
    let headers = ''
    if (param.token) {
      headers = {
        Authorization: 'Basic ' + param.token
      }
    }
    const payload = {
      type: 'query',
      data: {
        type: 'getSettingsFromBase'
      }
    }
    await axios
      .post(
        url,
        {
          payload: btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
        },
        { headers: headers }
      )
      .then(response => {
        try {
          settings = response.data.response
        } catch (error) {
          console.log(error.message)
        }
      })
      .catch(error => {
        console.log(error.message)
      })
      .finally(() => {
        commit('setSettings', settings)
        param.loading = false
      })
  }
}
export const setSettings = ({ commit }, value) => {
  commit('setSettings', value)
}

export const setStateValueByKey = ({ commit }, param) => {
  commit('setStateValueByKey', param)
}
