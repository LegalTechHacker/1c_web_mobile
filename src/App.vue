<template>
  <div id="q-app" :class="currentTheme">
    <router-view />
  </div>
</template>

<script>
import customIcons from 'src/custom-icons/custom-icons.js'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapGetters('appstore', [
      'isAuthenticated',
      'token',
      'useOData',
      'currentTheme',
      'prevMenuItemID',
      'prevSearchObjectURL',
      'prevReportURL',
      'currentMenuItemID',
      'currentSearchObjectURL',
      'currentReportURL',
      'isNested',
      'isIframeMy'
    ]),
    isSearchURLChange () {
      return (
        (this.prevMenuItemID !== this.currentMenuItemID ||
          this.prevSearchObjectURL !== this.currentSearchObjectURL) &&
        this.currentSearchObjectURL !== ''
      )
    },
    isReportURLChange () {
      return (
        (this.prevMenuItemID !== this.currentMenuItemID ||
          this.prevReportURL !== this.currentReportURL) &&
        this.currentReportURL !== ''
      )
    }
  },
  watch: {
    isAuthenticated () {
      if (this.isAuthenticated) {
        try {
          this.getSettings({
            isAuthenticated: this.isAuthenticated,
            token: this.token,
            loading: false
          })
        } catch (error) {
          console.log(error.message)
        }
      }
    }
  },
  created () {
    const currentIsIframeMy = !!window?.parent?.parent?.urIframeMy
    const currentIsNested =
      !!window?.parent?.parent?.urIframe || currentIsIframeMy
    if (currentIsNested !== this.isNested) {
      this.setIsNested(currentIsNested)
    }
    if (currentIsIframeMy !== this.isIframeMy) {
      this.setIsIframeMy(currentIsIframeMy)
    }
    this.userInit().then(() => {
      if (!this.isAuthenticated) {
        const toPath = this.$route.query.to || '/login'
        this.$router.push(toPath)
      } else {
        try {
          setTimeout(() => {
            this.getServiceWorker()
          }, 2000)
        } catch (error) {
          console.log(error.message)
        }
        try {
          //console.log('window?.parent?.location?.search: ' + window?.parent?.location?.search)
          //console.log('window?.location?.search: ' + window?.location?.search)
          //console.log('window?.parent?.location?.hash: ' + window?.parent?.location?.hash)
          //console.log('window?.location?.hash: ' + window?.location?.hash)

          /*
          if (window?.parent?.location?.search !== window?.location?.search) {
            window.location.search = window?.parent?.location?.search
          }
          if (window?.parent?.location?.hash !== window?.location?.hash) {
            window.location.hash = window?.parent?.location?.hash
          }
          */
          //console.log('window?.location?.search: ' + window?.location?.search)
          //console.log('window?.location?.hash: ' + window?.location?.hash)

          const locationSearch =
            decodeURIComponent(window?.parent?.location?.search) ||
            decodeURIComponent(window?.location?.search)
          const locationHash =
            decodeURIComponent(window?.parent?.location?.hash) ||
            decodeURIComponent(window?.location?.hash)
          //console.log('locationSearch: ' + locationSearch)
          //console.log('locationHash: ' + locationHash)

          const dataPrefix = 'e1cib/data/'
          const dataSearch = locationSearch
            ?.split('url=[e1cib/data/')[1]
            ?.split(']')[0]
          const dataHash = locationHash?.split('#e1cib/data/')[1]
          const currentSearchObjectURL =
            (dataSearch ? '' + dataPrefix + dataSearch : '') ||
            (dataHash ? '' + dataPrefix + dataHash : '')

          //console.log('1currentSearchObjectURL: ' + currentSearchObjectURL)

          const reportPrefix = 'Отчет'
          const reportSearchName = locationSearch
            ?.split('url=[e1cib/app/Отчет.')[1]
            ?.split(']')[0]
          const reportCommandName = locationHash
            ?.split('#e1cib/command/Отчет.')[1]
            ?.split('.')[0]
          const reportAppName = locationHash?.split('#e1cib/app/Отчет.')[1]
          const currentReportURL =
            (reportSearchName
              ? '' + reportPrefix + '.' + reportSearchName
              : '') ||
            (reportCommandName
              ? '' + reportPrefix + '.' + reportCommandName
              : '') ||
            (reportAppName ? '' + reportPrefix + '.' + reportAppName : '')

          //http://localhost/DO_KDD_1C/hs/interfacebuilder/v1/app?url=[http://localhost/DO_KDD_1C/#e1cib/app/%D0%9E%D1%82%D1%87%D0%B5%D1%82.%D0%97%D0%B0%D1%82%D1%80%D0%B0%D1%82%D1%8B%D0%92%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%B8?vrn=%D0%94%D0%B8%D0%BD%D0%B0%D0%BC%D0%B8%D0%BA%D0%B0%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B5%D0%B3%D0%BE%D0%92%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%B8]
          //http://localhost/DO_KDD_1C/hs/interfacebuilder/v1/app?url=[e1cib/app/Отчет.ЗатратыВремени?vrn=ДинамикаРабочегоВремени]

          //console.log('1currentReportURL: ' + currentReportURL)

          if (currentSearchObjectURL) {
            //console.log('2currentSearchObjectURL: ' + currentSearchObjectURL)
            const currentMenuItemID =
              locationSearch?.split('&v=')[1] ||
              locationSearch?.split('?v=')[1] ||
              ''
            this.setCurrentMenuItemID(currentMenuItemID)
            this.setCurrentSearchObjectURL(currentSearchObjectURL)
            // -ТОДО разобраться с отображением переданной по урл страницы при первом входе (сейчас на десктопе может не отображаться)
            // -TODO ? удалить из адресной строки переданный параметр url после закрытия формы просмотра текущей переданной ссылки
            //37.140.198.163:1980/doct_kdd/hs/interfacebuilder/v1/app?url=[e1cib/data/Документ.юр_Дела?ref=9bef52540055b35611edc95354f3f86c]
            //http://localhost/urait30/hs/interfacebuilder-local/v1/app?url=[e1cib/data/Справочник.Пользователи?ref=a24300155dcd671711edb9ddf8a8fa8f]
            //http://localhost/urait30/hs/interfacebuilder-local/v1/app?url=[e1cib/data/%D0%A1%D0%BF%D1%80%D0%B0%D0%B2%D0%BE%D1%87%D0%BD%D0%B8%D0%BA.%D0%9F%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D0%B8?ref=a24300155dcd671711edb9ddf8a8fa8f]
            //window.location.search = ''
            //this.$router.push('/')
            if (this.isSearchURLChange) {
              this.setPrevMenuItemID(this.currentMenuItemID)
              this.setPrevSearchObjectURL(this.currentSearchObjectURL)
              if (!this.useOData) {
                let tableTitle = ''
                const currentURL = decodeURIComponent(
                  this.currentSearchObjectURL
                ).split('?')[0]
                const arrayTitle = currentURL.split('.')
                if (arrayTitle.length > 0) {
                  tableTitle = this.convertToSentence(
                    arrayTitle[arrayTitle.length - 1]
                  )
                } else {
                  tableTitle = this.convertToSentence(currentURL)
                }
                this.getCurrentSearchObjectData({
                  isAuthenticated: this.isAuthenticated,
                  token: this.token,
                  useOData: false,
                  filter: '',
                  loading: false,
                  currentMenuItemID: this.currentMenuItemID,
                  currentSearchObjectURL: this.currentSearchObjectURL,
                  pagination: {
                    sortBy: 'Description',
                    descending: false,
                    page: 1,
                    rowsPerPage: 20
                    //rowsNumber: 0
                  },
                  tableTitle: tableTitle,
                  rowKey: 'urRowID'
                })
              }
            }
          } else if (currentReportURL) {
            //http://localhost/urait_test_08042020/hs/interfacebuilder/v1/app#e1cib/app/Отчет.юрАктивныеДела
            //http://localhost/urait_test_08042020/hs/interfacebuilder/v1/app#e1cib/command/Отчет.юрРеестрАдминистративныхДел.Команда.ОткрытьОтчет
            //http://localhost/urait_test_08042020/hs/interfacebuilder/v1/app#e1cib/command/%D0%9E%D1%82%D1%87%D0%B5%D1%82.%D1%8E%D1%80%D0%A0%D0%B5%D0%B5%D1%81%D1%82%D1%80%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%82%D0%B8%D0%B2%D0%BD%D1%8B%D1%85%D0%94%D0%B5%D0%BB.%D0%9A%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4%D0%B0.%D0%9E%D1%82%D0%BA%D1%80%D1%8B%D1%82%D1%8C%D0%9E%D1%82%D1%87%D0%B5%D1%82
            //console.log('2currentReportURL: ' + currentReportURL)
            const currentMenuItemID =
              locationSearch?.split('&v=')[1] ||
              locationSearch?.split('?v=')[1] ||
              ''
            this.setCurrentMenuItemID(currentMenuItemID)
            this.setCurrentReportURL(currentReportURL)
            if (this.isReportURLChange) {
              this.setPrevMenuItemID(this.currentMenuItemID)
              this.setPrevReportURL(this.currentReportURL)
              if (!this.useOData) {
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
        } catch (error) {
          console.log(error.message)
        }
      }
    })
  },
  mounted () {
    this.changeIconSetToCustomIcons()
    let vm = this
    vm.setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', function () {
      vm.setIsMobile(window.innerWidth < 768)
    })
  },
  methods: {
    ...mapActions('appstore', [
      'appInit',
      'setPrevMenuItemID',
      'setPrevSearchObjectURL',
      'setPrevReportURL',
      'setCurrentMenuItemID',
      'setCurrentSearchObjectURL',
      'getCurrentSearchObjectData',
      'setCurrentReportURL',
      'getCurrentReportData',
      'setIsMobile',
      'getSettings',
      'setIsNested',
      'setIsIframeMy'
    ]),
    changeIconSetToCustomIcons () {
      this.$q.iconSet.set(customIcons)
    },
    getServiceWorker () {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('service-worker.js')
          .then(
            function (registration) {
              //console.log('ServiceWorker registration successful with scope:', registration.scope)
            },
            function (error) {
              console.log('ServiceWorker registration failed: ', error.message)
            }
          )
          .catch(function (error) {
            console.log('ServiceWorker error: ', error.message)
          })
      } else {
        //console.log('ServiceWorker is not supported')
      }
    },
    async userInit () {
      await this.appInit()
    }
  }
}
</script>
