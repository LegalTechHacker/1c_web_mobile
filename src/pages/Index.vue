<template>
  <q-page>
    <div :class="classesPageDiv">
      <div class="col-12">
        <template v-if="isAuthenticated">
          <template v-if="useOData">
            <ODataTable
              v-if="currentObjectURL"
              v-model="currentObjectData"
              :link="currentObjectURL"
            />
          </template>
          <template v-if="!useOData">
            <template
              v-if="
                currentMenuItemType === 'iframe' ||
                (currentMenuItemType === 'url' && prevMenuItemType === 'iframe')
              "
            >
              <iframe
                v-if="currentMenuItemURL"
                :id="idIframe"
                :src="currentMenuItemURLWithParameters"
                :class="classesIframe"
                loading="lazy"
              ></iframe>
            </template>
            <template v-else>
              <DataTable
                v-if="currentObjectURL"
                v-model="currentObjectData"
                :link="currentObjectURL"
                :menu="currentMenuItemID"
              />
              <SearchDataTableCard
                v-if="currentSearchObjectURL"
                v-model="currentSearchObjectData"
                :link="currentSearchObjectURL"
                :menu="currentMenuItemID"
              />
              <DataReport
                v-if="currentReportURL"
                v-model="currentReportData"
                :link="currentReportURL"
                :menu="currentMenuItemID"
              />
            </template>
          </template>
          <TheInformationPanel
            v-if="
              (useOData && !currentObjectURL) ||
              (!useOData &&
                !currentObjectURL &&
                !currentSearchObjectURL &&
                !currentReportURL &&
                currentMenuItemType !== 'iframe' &&
                prevMenuItemType !== 'iframe')
            "
          >
            Перейдите в левое меню для работы с данными
          </TheInformationPanel>
        </template>
        <TheInformationPanel v-if="!isAuthenticated">
          Для продолжения требуется авторизация
        </TheInformationPanel>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Index',
  components: {
    ODataTable: require('src/components/components-odata/ODataTable.vue')
      .default,
    DataTable: require('src/components/DataTable.vue').default,
    SearchDataTableCard: require('src/components/SearchDataTableCard.vue')
      .default,
    DataReport: require('src/components/DataReport.vue').default,
    TheInformationPanel: require('src/components/TheInformationPanel.vue')
      .default
  },
  beforeUpdate () {
    //console.log('1 - Index - beforeUpdate (currentMenuItemID):' + this.currentMenuItemID)
    //console.log('1 - Index - beforeUpdate (currentMenuItemURL):' + this.currentMenuItemURL)
    //console.log('1 - Index - beforeUpdate (currentSearchObjectURL):' + this.currentSearchObjectURL)
    //console.log('1 - Index - beforeUpdate (currentObjectURL):' + this.currentObjectURL)
    //console.log('1 - Index - beforeUpdate (isObjectURLChange):' + this.isObjectURLChange)
    //console.log('1 - Index - beforeUpdate (prevObjectURL):' + this.prevObjectURL)
    //console.log('1 - Index - beforeUpdate (isAuthenticated): ' + this.isAuthenticated)
    if (this.isAuthenticated) {
      //console.log('Index-beforeUpdate-currentMenuItemID: ' + this.currentMenuItemID)
      //console.log('Index-beforeUpdate-currentMenuItemURL: ' + this.currentMenuItemURL)
      //console.log('Index-beforeUpdate-currentObjectURL: ' + this.currentObjectURL)
      //console.log('Index-beforeUpdate-currentReportURL: ' + this.currentReportURL)

      const currentIsIframeMy = this.isNested && this.isMyURL
      if (currentIsIframeMy !== this.isIframeMy) {
        this.setIsIframeMy(currentIsIframeMy)
      }

      if (!this.currentSearchObjectURL) {
        if (this.currentObjectURL) {
          //console.log('currentObjectURL')
          if (this.isObjectURLChange) {
            this.setPrevMenuItemID(this.currentMenuItemID)
            this.setPrevObjectURL(this.currentObjectURL)
            let tableTitle = ''
            const currentURL = this.currentObjectURL
            const arrayTitle = currentURL.split('.')
            if (arrayTitle.length > 0) {
              tableTitle = this.convertToSentence(
                arrayTitle[arrayTitle.length - 1]
              )
            } else {
              tableTitle = this.convertToSentence(currentURL)
            }
            //console.log('2 - Index - beforeUpdate: ' + this.currentSearchObjectURL)
            if (this.useOData) {
              this.getCurrentObjectOData({
                isAuthenticated: this.isAuthenticated,
                token: this.token,
                useOData: true,
                filter: '',
                loading: false,
                baseURLOData: this.baseURLOData,
                currentObjectURL: this.currentObjectURL,
                pagination: {
                  sortBy: 'Description',
                  descending: false,
                  page: 1,
                  rowsPerPage: 20
                  //rowsNumber: 0
                },
                tableTitle: tableTitle,
                rowKey: 'Ref_Key'
              })
            } else {
              this.getCurrentObjectData({
                isAuthenticated: this.isAuthenticated,
                token: this.token,
                useOData: false,
                filter: '',
                reportSettings: {},
                loading: false,
                currentMenuItemID: this.currentMenuItemID,
                currentObjectURL: this.currentObjectURL,
                pagination: {
                  sortBy: 'Description',
                  descending: false,
                  page: 1,
                  rowsPerPage: 20,
                  rowsNumber: 0
                },
                tableTitle: tableTitle,
                rowKey: 'urRowID'
              })
            }
          }
        } else if (this.currentReportURL) {
          //console.log('currentReportURL')
          if (!this.useOData) {
            if (this.isReportURLChange) {
              this.setPrevMenuItemID(this.currentMenuItemID)
              this.setPrevReportURL(this.currentReportURL)
              this.getCurrentReportData({
                isAuthenticated: this.isAuthenticated,
                token: this.token,
                useOData: false,
                reportSettings: {},
                loading: false,
                currentMenuItemID: this.currentMenuItemID,
                currentReportURL: this.currentReportURL
              })
            }
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters('appstore', [
      'isAuthenticated',
      'token',
      'seanceId',
      'useOData',
      'baseURLOData',
      'prevMenuItemType',
      'prevMenuItemID',
      'prevObjectURL',
      'currentMenuItemType',
      'currentMenuItemID',
      'currentMenuItemURL',
      'currentObjectURL',
      'currentObjectData',
      'currentSearchObjectURL',
      'currentSearchObjectData',
      'currentReportURL',
      'currentReportData',
      'isNested',
      'isIframeMy'
    ]),
    isObjectURLChange () {
      if (this.useOData) {
        return (
          this.prevObjectURL !== this.currentObjectURL &&
          this.currentObjectURL !== ''
        )
      } else {
        return (
          this.prevMenuItemID !== this.currentMenuItemID &&
          this.currentObjectURL !== ''
        )
      }
    },
    isReportURLChange () {
      return (
        this.prevMenuItemID !== this.currentMenuItemID &&
        this.currentReportURL !== ''
      )
    },
    isURLFrom1C () {
      return this.currentMenuItemURL?.includes('e1cib/') || false
    },
    isMyURLFrom1C () {
      return this.currentMenuItemURL?.includes('url=[e1cib/') || false
    },
    isMyURL () {
      return (
        this.isMyURLFrom1C || !!this.currentObjectURL || !!this.currentReportURL
      )
    },
    paramCurrentMenuItemId () {
      if (this.currentMenuItemID) {
        if (this.isURLFrom1C) {
          let separator = '?'
          if (this.currentMenuItemURL?.includes(separator)) {
            separator = '&'
          }
          return '' + separator + 'v=' + this.currentMenuItemID
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    paramSeanceId () {
      if (this.seanceId) {
        if (this.isURLFrom1C) {
          let separator = '?'
          if (this.currentMenuItemURL?.includes(separator)) {
            separator = '&'
          }
          return '' + separator + 'seanceId=' + this.seanceId
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    currentMenuItemURLWithParameters () {
      return (
        '' +
        this.currentMenuItemURL +
        this.paramCurrentMenuItemId +
        this.paramSeanceId
      )
    },
    classesPageDiv () {
      return (
        'row items-start q-pa-sm q-pl-sm' +
        (this.isMyURLFrom1C ? ' tw-p-0' : '')
      )
    },
    classesIframe () {
      return this.isMyURLFrom1C
        ? 'ur-iframe-my'
        : this.isURLFrom1C
        ? 'ur-iframe-1c'
        : 'ur-iframe'
    },
    idIframe () {
      return this.isMyURL ? 'urIframeMy' : 'urIframe'
    }
  },
  methods: {
    ...mapActions('appstore', [
      'getCurrentObjectOData',
      'getCurrentObjectData',
      'getCurrentReportData',
      'setPrevObjectURL',
      'setPrevReportURL',
      'setPrevMenuItemID',
      'setIsIframeMy'
    ])
  }
}
</script>
