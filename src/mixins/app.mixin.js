import axios from 'axios'
import MD5 from 'crypto-js/md5'
import { Notify } from 'quasar'

export default {
  methods: {
    hash_md5 (string) {
      return MD5(string).toString().toUpperCase()
    },
    uid () {
      return (
        Date.now().toString(36) +
        Math.floor(
          Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
        ).toString(36)
      )
    },
    base64ToBlob (base64, contentType, sliceSize) {
      contentType = contentType || ''
      sliceSize = sliceSize || 512
      var byteCharacters = atob(base64)
      var byteArrays = []
      for (
        var offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        var slice = byteCharacters.slice(offset, offset + sliceSize)
        var byteNumbers = new Array(slice.length)
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }
        var byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }
      var blob = new Blob(byteArrays, { type: contentType })
      return blob
    },
    base64ToBytes (base64) {
      const binString = atob(base64)
      return Uint8Array.from(binString, m => m.codePointAt(0))
    },
    bytesToBase64 (bytes) {
      const binString = Array.from(bytes, x => String.fromCodePoint(x)).join('')
      return btoa(binString)
    },
    encodeTextToBase64 (string) {
      return this.bytesToBase64(new TextEncoder().encode(string))
    },
    decodeTextFromBase64 (base64) {
      return new TextDecoder().decode(this.base64ToBytes(base64))
    },
    getMimeTypes () {
      const mimeTypes = {
        html: 'text/html; charset=utf-8',
        json: 'text/json; charset=utf-8',
        js: 'text/javascript',
        css: 'text/css',
        txt: 'text/plain',
        csv: 'text/csv',
        woff: 'font/woff',
        woff2: 'font/woff2',
        ico: 'image/x-icon',
        png: 'image/png',
        svg: 'image/svg+xml',
        gif: 'image/gif',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        xml: 'application/xml',
        xls: 'application/vnd.ms-excel',
        doc: 'application/msword',
        ppt: 'application/vnd.ms-powerpoint',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        pdf: 'application/pdf',
        zip: 'application/zip'
      }
      return mimeTypes
    },
    getFileType (extension) {
      let fileType = 'text/plain'
      const mimeTypes = this.getMimeTypes()
      const currentMimeType = mimeTypes[extension]
      if (currentMimeType) {
        fileType = currentMimeType
      }
      return fileType
    },
    getBlob (fileType, fileData) {
      return new Blob([fileData], {
        type: fileType
      })
    },
    saveBlobToFile (fileName, blob) {
      try {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          // IE variant
          window.navigator.msSaveOrOpenBlob(blob, fileName)
        } else {
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          link.remove()
        }
      } catch (error) {
        console.log(error)
      }
    },
    saveTextToFile (fileName, fileType, fileData) {
      const blob = this.getBlob(fileType, fileData)
      this.saveBlobToFile(fileName, blob)
    },
    saveBase64ToFile (fileName, fileType, fileBase64) {
      const blob = this.base64ToBlob(fileBase64, fileType)
      this.saveBlobToFile(fileName, blob)
    },
    capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    getArrayException_Prefix () {
      return [
        'юрки',
        'юркд',
        'отп',
        'ЮРд',
        'ЮР',
        'юр',
        'ав',
        'вр',
        'рт',
        'ро',
        'Кд',
        'МП',
        'МК'
      ]
    },
    getArray_Prefix () {
      return [
        'юрСинхронизацияСКонтурФокус',
        'юрОтслеживаемыеОбъектыФССП',
        'юрВидыДанныхКонтурФокус',
        'OAuth_redirection',
        'юрОбменУПП',
        'Фокус'
      ]
    },
    convertToSentence (str, withoutLabel = '') {
      let sentence = ''

      if (!str) {
        return sentence
      }

      if (str === withoutLabel) {
        return sentence
      }

      if (this.isObject(str)) {
        if (str?.title) {
          return str.title
        }
      }

      let count = 0
      const strException = '0123456789._'

      const objectName = {
        ChartOfCharacteristicTypes: 'Планы видов характеристик',
        ChartOfCalculationTypes: 'Планы видов расчета',
        AccumulationRegister: 'Регистры накопления',
        InformationRegister: 'Регистры сведений',
        CalculationRegister: 'Регистры расчета',
        AccountingRegister: 'Регистры бухгалтерии',
        BusinessProcess: 'Бизнес-процессы',
        DocumentJournal: 'Журналы документов',
        ChartOfAccounts: 'Планы счетов',
        ExchangePlan: 'Планы обмена',
        Constant: 'Константы',
        Document: 'Документы',
        Catalog: 'Справочники',
        Enum: 'Перечисления',
        Task: 'Задачи'
      }
      const strObjectName = objectName[str]

      if (strObjectName) {
        return strObjectName
      }

      const arrayException = [
        'ChartOfCharacteristicTypes_',
        'ChartOfCalculationTypes_',
        'AccumulationRegister_',
        'InformationRegister_',
        'CalculationRegister_',
        'AccountingRegister_',
        '____Presentation',
        'BusinessProcess_',
        'DocumentJournal_',
        'ChartOfAccounts_',
        'ExchangePlan_',
        '_RecordType',
        'Constant_',
        'Document_',
        'Catalog_',
        'Task_',
        'МП_'
      ]
      for (let i = 0; i < arrayException.length; i++) {
        str = str.replace(arrayException[i], '')
      }

      const fieldName = {
        DataVersion: 'Версия данных',
        Number: 'Номер',
        Date: 'Дата',
        DeletionMark: 'Пометка удаления',
        Completed: 'Завершен',
        Started: 'Стартован',
        Task: 'Задача',
        HeadTask: 'Ведущая задача',
        Presentation: 'Представление',
        Posted: 'Проведен',
        LineNumber: 'Номер строки',
        Ref: 'Ссылка',
        Ref_Type: 'Тип ссылки',
        Type: 'Тип',
        Description: 'Наименование',
        BusinessProcess: 'Бизнес-процесс',
        RoutePoint: 'Точка маршрута',
        Executed: 'Выполнена',
        Value: 'Значение',
        SurrogateKey: 'Суррогатный ключ',
        Predefined: 'Предопределенный',
        PredefinedDataName: 'Имя предопределенных данных',
        ValueType: 'Тип значения',
        Code: 'Код',
        SentNo: 'Номер отправленного',
        ReceivedNo: 'Номер принятого',
        RecordType: 'Вид движения',
        RecordSet: 'Набор записей',
        Recorder: 'Регистратор',
        Recorder_Type: 'Тип регистратора',
        Period: 'Период',
        Active: 'Активность',
        Parent: 'Родитель',
        Owner: 'Владелец',
        IsFolder: 'Это группа',
        Ref_Key: 'Ключ ссылки'
      }
      const strFieldName = fieldName[str]

      if (strFieldName) {
        return strFieldName
      }

      const arrayExceptionUC = [
        'Федресурс',
        'МойАрбитр',
        'Юрайт',
        'MacOS',
        'OAuth',
        'КоАП',
        'iOS'
      ]
      for (let i = 0; i < arrayExceptionUC.length; i++) {
        const currentWordUC = arrayExceptionUC[i]
        str = str.replace(
          new RegExp(currentWordUC, 'gi'),
          currentWordUC.toUpperCase()
        )
      }

      for (let i = 0; i < str.length; i++) {
        let currentSymbol = str.charAt(i)
        if (
          currentSymbol === currentSymbol.toUpperCase() &&
          strException?.indexOf(currentSymbol) == -1
        ) {
          sentence?.trim()
          sentence += ' '
          count++
        }
        if (currentSymbol === '_') {
          sentence?.trim()
          sentence += ' '
        } else {
          if (count > 1) {
            sentence += currentSymbol.toLowerCase()
          } else {
            sentence += currentSymbol
          }
        }
      }
      const arrayException_Prefix = this.getArrayException_Prefix()
      for (let i = 0; i < arrayException_Prefix.length; i++) {
        sentence = sentence.replace(arrayException_Prefix[i] + ' ', '')
      }

      const arrayException_Acronym = [
        ...arrayExceptionUC,
        'ЕГРЮЛ',
        'ЕФРСБ',
        'ПБДПП',
        'КЛАДР',
        'ОКВЭД',
        'ОКАТО',
        'ОКТМО',
        'СПАРК',
        'СВИФТ',
        'EXCEL',
        'OAuth',
        'ЕАЭС',
        'ОГРН',
        'ДОИО',
        'ССТУ',
        'МКТУ',
        'ОКПО',
        'ОСДБ',
        'ФССП',
        'ГУОВ',
        'ФИАС',
        'НХТК',
        'ПЦБК',
        'GUID',
        'HTML',
        'XDTO',
        'APNS',
        'MSIE',
        'SMTP',
        'ДДС',
        'НСИ',
        'МЧД',
        'ФИО',
        'ИНН',
        'ИПП',
        'КПП',
        'ГАС',
        'КАД',
        'КИС',
        'НДС',
        'СДР',
        'ФНС',
        'ЦКК',
        'КДД',
        'ПДФ',
        'РИБ',
        'СЭД',
        'УПД',
        'УПП',
        'МРО',
        'АПК',
        'АСВ',
        'ДОО',
        'ЭДО',
        'БЭД',
        'БИП',
        'БИК',
        'РКЦ',
        'API',
        'WEB',
        'WSS',
        'DSS',
        'DAV',
        'SMS',
        'PDF',
        'FTP',
        'ICS',
        'iOS',
        'FCM',
        'UTC',
        'URI',
        'URL',
        'АВ',
        'ЭД',
        'ДЗ',
        'ДО',
        'РФ',
        'ЦБ',
        'ИД',
        'ИП',
        'ИС',
        'ИБ',
        'ЭП',
        'ТЗ',
        'ТЧ',
        'ТС',
        'МК',
        'КД',
        'КУ',
        'КП',
        'КТ',
        'ФЛ',
        'ID',
        'MS',
        'CJ'
      ]
      sentence = ' ' + sentence?.trim() + ' '
      for (let i = 0; i < arrayException_Acronym.length; i++) {
        const currentWord = arrayException_Acronym[i]
        let currentWordToReplace = ''
        for (let j = 0; j < currentWord.length; j++) {
          currentWordToReplace += currentWord.charAt(j).toLowerCase() + ' '
        }
        currentWordToReplace = currentWordToReplace?.trim()
        sentence = sentence.replace(
          new RegExp(' ' + currentWordToReplace + ' ', 'gi'),
          ' ' + currentWord + ' '
        )
      }
      sentence = sentence.replace(/1 с /gi, ' 1С ')

      sentence = this.capitalizeFirstLetter(sentence?.trim())
      return sentence
    },
    getDateFormat (dateEvent) {
      let result = ''
      if (dateEvent) {
        const date = new Date(dateEvent)
        const rtf = new Intl.RelativeTimeFormat('ru')
        const diff = Math.round((date - new Date()) / (1000 * 60))
        if (diff === 0) {
          result = 'только что'
        } else if (diff > -60 && diff < 60) {
          result = rtf.format(diff, 'minute')
        } else if (diff > -60 * 24 && diff < 60 * 24) {
          result = rtf.format(Math.round(diff / 60), 'hour')
        } else if (diff > -60 * 24 * 3 || diff < 60 * 24 * 3) {
          result = rtf.format(Math.round(diff / (60 * 24)), 'day')
        } else {
          result = date.toLocaleString()
        }
      } else {
        result = new Date().toLocaleString()
      }
      return result
    },
    sortChildren (obj, sortFn) {
      obj.children.sort(sortFn)
      obj.children.forEach(child => this.sortChildren(child, sortFn))
    },
    buildObjectTreeFromArrayURL (data) {
      const objMap = {}
      const rootObjects = []

      const arrayException_Prefix = this.getArrayException_Prefix()
      const array_Prefix = this.getArray_Prefix()

      // Build a map of objects keyed by their URL
      data.forEach(obj => {
        const parts = obj.url.split('_')
        let parent = null
        let url = ''

        // Iterate through URL parts, building up URL and checking for parent
        for (let i = 0; i < parts.length; i++) {
          url += parts[i]

          if (
            arrayException_Prefix?.indexOf(parts[i]) != -1 ||
            array_Prefix?.indexOf(parts[i]) != -1
          ) {
            url += '_'
            continue
          }

          if (objMap[url]) {
            parent = objMap[url]
          } else {
            /*
          parent: '',
          id: AppMixin.methods.uid(),
          title: AppMixin.methods.convertToSentence(element.name),
          caption: element.name,
          data: { ...element },
          link: '' + element.url,
          icon: 'icon-mat-public',
          type: 'from1C'
            */
            const newObj = {
              parent: obj.name,
              id: this.uid(),
              title: this.convertToSentence(parts[i]),
              label: this.convertToSentence(parts[i]),
              caption: parts[i],
              data: { ...obj },
              link: url,
              icon: 'icon-mat-public',
              type: 'from1C',
              name: parts[i],
              url: url,
              children: []
            }

            objMap[url] = newObj

            if (parent) {
              parent.children.push(newObj)
            } else {
              rootObjects.push(newObj)
            }

            parent = newObj
          }

          url += '_'
        }
      })
      // Sort objects by name
      //const sortByName = (a, b) => a.name.localeCompare(b.name)
      //rootObjects.forEach(obj => this.sortChildren(obj, sortByName))

      //return rootObjects

      const sortByTitle = (a, b) => a.title.localeCompare(b.title)
      //rootObjects.forEach(obj => this.sortChildren(obj, sortByTitle))

      const res = [{ children: rootObjects }]
      res.forEach(obj => this.sortChildren(obj, sortByTitle))

      return res[0]?.children
    },
    filterObjectTreeByTitle (nodes, searchQuery) {
      const getNodes = (result, object) => {
        const searchWords = searchQuery.toLowerCase().split(' ')
        if (searchWords.every(v => object.title.toLowerCase().includes(v))) {
          result.push(object)
          return result
        }
        if (Array.isArray(object.children)) {
          const children = object.children.reduce(getNodes, [])
          if (children.length) result.push({ ...object, children })
        }
        return result
      }
      return nodes.reduce(getNodes, [])
    },
    async getObjectODataFromURL (param) {
      if (param.isAuthenticated) {
        if (param.objectURL) {
          if (param.useOData) {
            param.loading = true

            //const top = param.pagination.rowsPerPage
            //const skip = param.pagination.rowsPerPage * (param.pagination.page - 1)
            //const count = true

            const strQuery = '' + param.baseURL + param.objectURL + param.search
            //+'&$select=*____Presentation'
            //+'&allowedOnly=false'
            //+'&$top=100'

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
                  param.rows = response.data.value
                } catch (error) {
                  console.log(error.message)
                }
              })
              .catch(error => {
                console.log(error.message)
              })
              .finally(() => {
                //Object.freeze(rows)
                param.loading = false
              })
          }
        }
      }
    },
    getVisibleColumns (firstRow) {
      let visibleColumns = []
      if (firstRow) {
        const arrayInVisibleColumns = [
          'urRowID',
          'Ref',
          'Ref_Type',
          'Ref_Key',
          'DataVersion____Presentation',
          'DataVersion'
        ]
        const arrayColumns = Object.keys(firstRow)
        arrayColumns.forEach(child => {
          let isVisibleColumn = true
          for (let i = 0; i < arrayInVisibleColumns.length; i++) {
            if (child === arrayInVisibleColumns[i]) {
              isVisibleColumn = false
              break
            }
          }
          if (isVisibleColumn) {
            visibleColumns.push(child)
          }
        })
      }
      return visibleColumns
    },
    getColumns (firstRow, withoutLabel = '') {
      let columns = []
      if (firstRow) {
        const arrayInVisibleColumns = [
          'urRowID',
          'Ref',
          'Ref_Type',
          'Ref_Key',
          'DataVersion____Presentation',
          'DataVersion'
        ]
        const arrayColumns = Object.keys(firstRow)
        arrayColumns.forEach(child => {
          let isVisibleColumn = true
          for (let i = 0; i < arrayInVisibleColumns.length; i++) {
            if (child === arrayInVisibleColumns[i]) {
              isVisibleColumn = false
              break
            }
          }
          if (isVisibleColumn) {
            let sortable = true
            let currentName = child
            if (currentName === 'Параметр') {
              sortable = false
            } else if (currentName === 'Значение') {
              sortable = false
            } else if (currentName === 'Использование') {
              sortable = false
              currentName = ''
            } else if (currentName === 'ЛевоеЗначение') {
              sortable = false
              currentName = 'Отбор'
            } else if (currentName === 'ПравоеЗначение') {
              sortable = false
              currentName = 'Значение'
            } else if (currentName === 'ВидСравнения') {
              sortable = false
            }
            columns.push({
              name: child,
              label: this.convertToSentence(currentName, withoutLabel),
              field: child,
              align: 'left',
              sortable: sortable
            })
          }
        })
      }
      return columns
    },
    openTargetURL (href, target = '_blank') {
      var a = document.createElement('a')
      a.href = href
      a.target = target
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    isObject (obj) {
      return typeof obj === 'object' && !Array.isArray(obj) && obj !== null
    },
    isDocumentObject (objectURL) {
      return objectURL.toUpperCase().includes('Документ.'.toUpperCase())
    },
    isCatalogObject (objectURL) {
      return objectURL.toUpperCase().includes('Справочник.'.toUpperCase())
    },
    isObjectEditable (objectURL) {
      return (
        this.isDocumentObject(objectURL) || this.isCatalogObject(objectURL)
        //|| objectURL.toUpperCase().includes('РегистрСведений.'.toUpperCase()) //TODO
      )
    },
    isRefNewObject (objectURL) {
      return (
        objectURL.toUpperCase().includes('e1cib/data/'.toUpperCase()) &&
        objectURL
          .toUpperCase()
          .includes('?ref=00000000000000000000000000000000'.toUpperCase())
      )
    },
    isRefNewDocumentObject (objectURL) {
      return this.isRefNewObject(objectURL) && this.isDocumentObject(objectURL)
    },
    isRefNewCatalogObject (objectURL) {
      return this.isRefNewObject(objectURL) && this.isCatalogObject(objectURL)
    },
    isRefNewObjectEditable (objectURL) {
      return (
        this.isRefNewDocumentObject(objectURL) ||
        this.isRefNewCatalogObject(objectURL)
      )
    },
    isRefObject (objectURL) {
      return (
        objectURL.toUpperCase().includes('e1cib/data/'.toUpperCase()) &&
        objectURL.toUpperCase().includes('?ref='.toUpperCase())
      )
    },
    isRefDocumentObject (objectURL) {
      return this.isRefObject(objectURL) && this.isDocumentObject(objectURL)
    },
    isRefCatalogObject (objectURL) {
      return this.isRefObject(objectURL) && this.isCatalogObject(objectURL)
    },
    isRefObjectEditable (objectURL) {
      return (
        this.isRefDocumentObject(objectURL) ||
        this.isRefCatalogObject(objectURL)
      )
    },
    getCurrentValueTD (props, col) {
      //console.log('props: ' + JSON.stringify(props, null, ' '))
      //console.log('col: ' + JSON.stringify(col, null, ' '))
      const propsValue = props?.row[col?.name]
      const propsValuePresentation = propsValue?.presentation
      if (propsValuePresentation) {
        //console.log('1propsValuePresentation: ' + JSON.stringify(propsValuePresentation, null, ' '))
        return propsValuePresentation
      } else if (this.isObject(propsValue)) {
        //console.log('2propsValuePresentation: ' + JSON.stringify(propsValuePresentation, null, ' '))
        return propsValuePresentation
      } else if (propsValue) {
        //console.log('3propsValue: ' + JSON.stringify(propsValue, null, ' '))
        return propsValue
      } else {
        const colValue = col?.value
        const colValuePresentation = colValue?.presentation
        if (colValuePresentation) {
          //console.log('4colValuePresentation: ' + JSON.stringify(colValuePresentation, null, ' '))
          return colValuePresentation
        } else if (this.isObject(colValue)) {
          //console.log('5colValuePresentation: ' + JSON.stringify(colValuePresentation, null, ' '))
          return colValuePresentation
        } else {
          //console.log('6colValue: ' + JSON.stringify(colValue, null, ' '))
          return colValue
        }
      }
    },
    getCurrentFieldTD (props, col) {
      const urRowKey = props?.key
      const propsField = props?.row[col?.name]?.field?.field
      const colField = col?.field
      if (propsField) {
        //console.log('propsField: ' + JSON.stringify(propsField, null, ' '))
        return { ...propsField, urRowKey: urRowKey }
      } else {
        //console.log('colField: ' + JSON.stringify(colField, null, ' '))
        return colField
      }
    },
    isDisabledCurrentFieldTD (props, colName) {
      const propsField = props?.row[colName]?.field?.field
      if (propsField) {
        return propsField?.disabled || false
      } else {
        return false
      }
    },
    notifyDisplay (
      message,
      icon = '',
      color = '',
      textColor = '',
      position = ''
    ) {
      if (message) {
        Notify.create({
          progress: true,
          multiLine: true,
          html: true,
          icon: icon || 'icon-mat-info',
          color: color || 'ur-bg-accent',
          textColor: textColor || 'white',
          position: position || 'bottom-right',
          message: message.replace(new RegExp('\n', 'g'), '<br/>')
        })
      }
    },
    getIconData (icon, defaultIcon = 'description') {
      const prefix = 'icon-mat-'
      const prefixIcon = icon?.includes(prefix) ? '' : prefix
      const prefixDefaultIcon = defaultIcon?.includes(prefix) ? '' : prefix
      const defaultIconIcon = defaultIcon
        ? prefixDefaultIcon + defaultIcon
        : 'icon-mat-description'
      const iconIcon = icon ? prefixIcon + icon : defaultIconIcon
      return {
        name:
          '' + (icon?.includes('/') ? '' + icon?.split('/')[1] : '' + iconIcon),
        src: '' + (icon?.includes('/') ? '' + icon : '' + iconIcon)
      }
    }
  }
}
