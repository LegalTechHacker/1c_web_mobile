<template>
  <div>
    <div v-show="!showTR">
      <q-table
        v-if="currentObjectURL"
        :link="currentObjectURL"
        :title="currentObjectData?.tableTitle"
        :data="currentObjectData?.rows"
        :columns="currentObjectData?.columns"
        :row-key="currentObjectData?.rowKey"
        :pagination.sync="pagination"
        :loading="loading"
        :filter="filter"
        :rows-per-page-options="[0]"
        :visible-columns="visibleColumns"
        separator="horizontal"
        selection="single"
        :selected.sync="selected"
        binary-state-sort
        virtual-scroll
        class="tw-rounded-2xl tw-shadow-md tw-p-4 ur-table ur-sticky-header-table"
        tabindex="0"
        ref="myDataTable"
        @keydown.native="onMyDataTableKey"
        @request="onRequest"
      >
        <!--<template v-slot:top="props"></template>-->
        <template v-slot:top>
          <q-toolbar>
            <q-btn
              flat
              round
              dense
              :icon="'icon-mat-arrow_back'"
              @click="handleCloseDataTable"
            />
            <q-toolbar-title>
              <div
                class="q-table__title"
                :title="currentObjectData?.tableTitle"
              >
                {{ currentObjectData?.tableTitle }}
              </div>
            </q-toolbar-title>
            <q-btn
              flat
              round
              dense
              :icon="'icon-mat-more_vert'"
              :aria-label="btnMenuTitle"
              :title="btnMenuTitle"
              :disable="loading"
            >
              <q-menu fit content-class="ur-menu">
                <q-list dense class="ur-list-menu">
                  <q-item
                    clickable
                    v-close-popup
                    @click="handleClickBtnRefresh"
                  >
                    <q-item-section avatar class="ur-img-icon">
                      <q-icon name="icon-mat-refresh" />
                    </q-item-section>
                    <q-item-section>
                      {{ btnRefreshTitle }}
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="handleClickBtnPrintList"
                  >
                    <q-item-section avatar class="ur-img-icon">
                      <q-icon name="icon-mat-print" />
                    </q-item-section>
                    <q-item-section>
                      {{ btnPrintListTitle }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <!--
            <q-btn
              flat
              round
              dense
              :icon="'icon-mat-refresh'"
              :aria-label="btnRefreshTitle"
              :title="btnRefreshTitle"
              :disable="loading"
              @click="handleClickBtnRefresh"
            />
            -->
            <!--
            <q-btn
              flat
              round
              dense
              :icon="
                props.inFullscreen
                  ? 'icon-mat-fullscreen_exit'
                  : 'icon-mat-fullscreen'
              "
              @click="props.toggleFullscreen"
            />
            -->
          </q-toolbar>
          <div class="full-width">
            <div class="row q-mb-sm">
              <q-space />
              <div>
                <q-input
                  placeholder="Поиск"
                  type="text"
                  debounce="300"
                  dense
                  borderless
                  clearable
                  clear-icon="icon-mat-cancel_filled"
                  v-model="filter"
                  autofocus
                  tabindex="1"
                  ref="myDataTableSearch"
                  class="tw-rounded-2xl tw-px-4 tw-shadow-md tw-bg-gray-200 hover:tw-bg-gray-100"
                >
                  <template v-slot:prepend>
                    <q-icon name="icon-mat-search" />
                  </template>
                  <template v-if="!filter" v-slot:append>
                    <q-icon name="" />
                  </template>
                </q-input>
              </div>
            </div>
          </div>
        </template>

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ convertToSentence(col.field) }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" class="tw-cursor-pointer">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <BaseFieldReadonlyTD
                :col="col"
                :props="props"
                @clickTD="handleClickDataTableTR(props)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-page-sticky
        v-if="isObjectEditable(currentObjectURL)"
        position="bottom-right"
        :offset="fabPos"
      >
        <q-btn
          class="ur-btn"
          fab
          icon="icon-mat-add"
          color="white"
          text-color="primary"
          :disable="draggingFab"
          v-touch-pan.prevent.mouse="moveFab"
          @click="handlerFabActionClick"
        />
      </q-page-sticky>
    </div>
    <div v-show="showTR">
      <q-card
        v-model="showTR"
        class="tw-rounded-2xl tw-shadow-md tw-p-4"
        tabindex="0"
        ref="myDataTableTR"
        @keydown.native="onMyDataTableTRKey"
      >
        <q-toolbar>
          <q-btn
            flat
            round
            dense
            :icon="'icon-mat-arrow_back'"
            @click="handleCloseDataTableTR"
          />
          <q-toolbar-title
            ><div class="text-h6" :title="currentObjectData?.title">
              {{ currentObjectData?.title }}
            </div></q-toolbar-title
          >
          <!--
          <q-btn
            flat
            round
            dense
            :icon="
              inFullscreenTR
                ? 'icon-mat-fullscreen_exit'
                : 'icon-mat-fullscreen'
            "
            @click="toggleInFullscreenTR"
          />
          -->
        </q-toolbar>
        <div v-if="propsTR">
          <q-form
            @submit.prevent="submitFormDataTableTR"
            autofocus
            tabindex="0"
          >
            <div class="tw-mb-2">
              <q-expansion-item
                default-opened
                expand-icon-toggle
                label="Основные данные"
                class="text-subtitle1"
              >
                <q-card-section>
                  <div class="row items-end">
                    <div
                      v-for="col in propsTR.cols"
                      :key="col.name"
                      class="col-xs-12 col-sm-6"
                    >
                      <BaseFieldReadonly
                        :field="col.field"
                        :value="getCurrentValueTD(propsTR, col)"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-expansion-item>
            </div>
            <div
              class="tw-mb-2"
              v-for="table in currentTables"
              :key="table?.title"
            >
              <q-expansion-item
                expand-icon-toggle
                :label="table?.title + ' (' + table?.rows?.length + ')'"
                class="text-subtitle1"
              >
                <div class="tw-my-2">
                  <!--<pre>{{ table }}</pre>-->
                  <DataTableTR
                    :title="table?.title"
                    :rows="table?.rows"
                    :columns="table?.columns"
                    :urRowID="urRowID"
                  />
                </div>
              </q-expansion-item>
            </div>
            <q-card-actions align="right">
              <q-btn
                class="ur-btn tw-rounded-xl tw-px-2"
                flat
                color="negative"
                :aria-label="btnSubmitTitle"
                :label="btnSubmitTitle"
                type="submit"
              />
            </q-card-actions>
          </q-form>
        </div>
      </q-card>
      <q-dialog v-model="isShowPrintListDialog" persistent>
        <q-card class="ur-dialog-card">
          <q-card-section class="row items-center">
            <q-avatar
              class="ur-icon"
              icon="icon-mat-print"
              color="white"
              text-color="primary"
            />
            <q-card-section>
              <h6>{{ titlePrintListDialog }}</h6>
              <p class="text-subtitle2" v-html="descriptionPrintListDialog"></p>
            </q-card-section>
          </q-card-section>
          <q-card-section style="max-height: 70vh" class="scroll">
            <div v-if="outputParameterFields?.length" class="tw-mb-2">
              <q-expansion-item
                v-model="expandedSelectedParameterFields"
                expand-icon-toggle
                :label="labelParameterFieldsSettingsTitle"
                class="text-subtitle1"
              >
                <q-card-section
                  style="max-height: 50vh"
                  :class="'scroll' + (isMobile ? ' tw-px-0' : ' tw-px-2')"
                >
                  <TableFields
                    :rows="outputParameterFields"
                    @clickTR="handleClickTableParameterFieldsTR($event)"
                    @changeTR="handleChangeTableParameterFieldsTR($event)"
                  />
                </q-card-section>
              </q-expansion-item>
            </div>
            <div v-if="outputFilterFields?.length" class="tw-mb-2">
              <q-expansion-item
                v-model="expandedSelectedFilterFields"
                expand-icon-toggle
                :label="labelFilterFieldsSettingsTitle"
                class="text-subtitle1"
              >
                <q-card-section
                  style="max-height: 50vh"
                  :class="'scroll' + (isMobile ? ' tw-px-0' : ' tw-px-2')"
                >
                  <TableFields
                    :rows="outputFilterFields"
                    @clickTR="handleClickTableFilterFieldsTR($event)"
                    @changeTR="handleChangeTableFilterFieldsTR($event)"
                  />
                </q-card-section>
              </q-expansion-item>
            </div>
            <div v-if="outputColumns?.length" class="tw-mb-2">
              <q-expansion-item
                v-model="expandedSelectedColumns"
                expand-icon-toggle
                :label="labelColumnSettingsTitle"
                class="text-subtitle1"
              >
                <q-card-section
                  style="max-height: 50vh"
                  :class="'scroll' + (isMobile ? ' tw-px-2' : '')"
                >
                  <div class="tw-rounded-2xl tw-shadow-md tw-p-4">
                    <q-option-group
                      v-model="selectedColumns"
                      :options="outputColumns"
                      type="checkbox"
                    />
                  </div>
                </q-card-section>
              </q-expansion-item>
            </div>
            <div v-if="outputFiles?.length" class="tw-mb-2">
              <q-expansion-item
                v-model="expandedTypeFile"
                expand-icon-toggle
                :label="labelFilesSettingsTitle"
                class="text-subtitle1"
              >
                <q-card-section
                  style="max-height: 50vh"
                  :class="'scroll' + (isMobile ? ' tw-px-2' : '')"
                >
                  <div class="tw-rounded-2xl tw-shadow-md tw-p-4">
                    <q-option-group
                      v-model="selectedFile"
                      :options="outputFiles"
                      type="radio"
                    />
                  </div>
                </q-card-section>
              </q-expansion-item>
            </div>
            <div class="tw-mb-2 tw-p-2">
              <q-checkbox v-model="usePreview" :label="labelUsePreviewTitle" />
            </div>
            <div v-if="usePreview" class="tw-mb-2">
              <q-card-section>
                <ThePreviewReport :preview="previewObjectReportText" />
              </q-card-section>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-space />
            <div v-if="objectReportFile">
              <q-btn
                v-if="usePreview && previewObjectReportText"
                class="ur-btn tw-rounded-xl tw-px-2"
                flat
                color="primary"
                :icon="'icon-mat-print'"
                :aria-label="btnPrintTitle"
                :label="btnPrintTitle"
                :disabled="loading"
                @click="handleClickBtnPrint"
              />
              <q-btn
                class="ur-btn tw-rounded-xl tw-px-2"
                flat
                color="primary"
                :icon="'icon-mat-cloud_download'"
                :aria-label="btnFileSaveTitle"
                :label="btnFileSaveTitle"
                :disabled="loading"
                @click="handleClickBtnFileSave"
              />
            </div>
          </q-card-actions>
          <q-card-actions align="right">
            <q-btn
              class="ur-btn tw-rounded-xl tw-px-2"
              flat
              color="negative"
              :aria-label="btnPrintListDialogCancelTitle"
              :label="btnPrintListDialogCancelTitle"
              v-close-popup
              @click="handleClickBtnPrintListDialogCancel"
            />
            <!--v-close-popup-->
            <q-btn
              class="ur-btn tw-rounded-xl tw-px-2"
              flat
              color="positive"
              :icon="'icon-mat-report'"
              :aria-label="btnPrintListDialogOKTitle"
              :label="btnPrintListDialogOKTitle"
              :disabled="!selectedColumns.length || loading"
              @click="handleClickBtnPrintListDialogOK"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { QTable } from 'quasar'
export default {
  name: 'DataTable',
  components: {
    QTable,
    BaseFieldReadonlyTD: require('src/components/BaseFieldReadonlyTD.vue')
      .default,
    BaseFieldReadonly: require('src/components/BaseFieldReadonly.vue').default,
    DataTableTR: require('src/components/DataTableTR.vue').default,
    TableFields: require('src/components/TableFields.vue').default,
    ThePreviewReport: require('src/components/ThePreviewReport.vue').default
  },
  props: {
    title: { type: String, default: '' },
    link: { type: String, default: '' },
    icon: { type: String, default: 'icon-mat-format_list_bulleted' }
  },
  data () {
    return {
      btnSubmitTitle: 'Закрыть',
      filter: '',
      loading: false,
      selected: [],
      pagination: {
        sortBy: 'Description',
        descending: false,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 0
      },
      rows: [],
      rowKey: 'urRowID',
      tableTitle: this.title,
      visibleColumns: [],
      urRowID: '',
      currentObjectAddURL: '',
      fabPos: [44, 98],
      draggingFab: false,
      btnMenuTitle: 'Меню',
      btnRefreshTitle: 'Обновить',
      btnPrintListTitle: 'Вывести список...',
      isShowPrintListDialog: false,
      titlePrintListDialog: 'Вывести список',
      descriptionPrintListDialog: 'Вывод списка объектов.',
      btnPrintListDialogCancelTitle: 'Закрыть',
      btnPrintListDialogOKTitle: 'Сформировать',
      labelUsePreviewTitle: 'Предварительный просмотр',
      usePreview: false,
      labelFilesSettingsTitle: 'Настройки сохранения',
      outputFiles: [
        { label: 'Файл Excel', value: 'XLSX' },
        { label: 'Файл Word', value: 'DOCX' },
        { label: 'Файл PDF', value: 'PDF' }
      ],
      selectedFile: 'XLSX',
      labelColumnSettingsTitle: 'Настройки колонок',
      outputColumns: [],
      selectedColumns: [],
      labelParameterFieldsSettingsTitle: 'Настройки параметров',
      labelFilterFieldsSettingsTitle: 'Настройки отборов',
      outputParameterFields: [],
      outputFilterFields: [],
      selectedParameterFields: [],
      selectedFilterFields: [],
      btnPrintTitle: 'Распечатать',
      btnFileSaveTitle: 'Сохранить',
      expandedSelectedParameterFields: false,
      expandedSelectedFilterFields: false,
      expandedSelectedColumns: false,
      expandedTypeFile: false
    }
  },
  beforeUpdate () {
    const firstRow = this.currentObjectData?.rows[0]
    if (firstRow) {
      this.visibleColumns = this.getVisibleColumns(firstRow)
    } else {
      this.visibleColumns = this.currentObjectData?.columns?.map(
        item => item.name
      )
    }
    //console.log('firstRow: ' + JSON.stringify(firstRow))
    //console.log('visibleColumns: ' + JSON.stringify(this.visibleColumns))
    //console.log('currentObjectData: ' + JSON.stringify(this.currentObjectData))
  },
  computed: {
    ...mapGetters('appstore', [
      'isAuthenticated',
      'token',
      'useOData',
      'baseURL',
      'prevObjectURL',
      'currentObjectURL',
      'currentObjectData',
      'currentObjectDataLoading',
      'currentObjectReportData',
      'currentObjectReportDataLoading',
      'currentMenuItemID',
      'showTR',
      'inFullscreenTR',
      'propsTR',
      'isMobile'
    ]),
    paginations () {
      return this.currentObjectData?.pagination || this.pagination
    },
    tables () {
      return this.currentObjectData?.tables
    },
    currentTables () {
      //console.log('DataTable - computed - urRowID: ' + this.urRowID)
      return this.tables[this.urRowID]
    },
    previewObjectReportText () {
      if (this.currentObjectReportData?.onlySettings) {
        return ''
      } else {
        const base64 = this.currentObjectReportData?.previewBase64 || ''
        try {
          if (base64) {
            return this.decodeTextFromBase64(base64)
          } else {
            return ''
          }
        } catch (error) {
          console.log(error)
          return ''
        }
      }
    },
    objectReportFileBase64 () {
      return this.currentObjectReportData?.fileBase64 || ''
    },
    objectReportFile () {
      return this.currentObjectReportData?.file || ''
    },
    objectReportFileType () {
      return this.getFileType(this.currentObjectReportData?.fileExtension || '')
    }
  },
  watch: {
    currentObjectDataLoading () {
      this.loading = this.currentObjectDataLoading
    },
    currentObjectData () {
      const availableColumns = this.currentObjectData?.columns || []
      this.outputColumns =
        availableColumns.map(item => ({
          value: item.name,
          label: item.label
        })) || []
      this.outputParameterFields =
        this.currentObjectData?.reportSettings?.selectedParameterFields || []
      this.outputFilterFields =
        this.currentObjectData?.reportSettings?.selectedFilterFields || []
      this.selectedColumns =
        this.currentObjectData?.reportSettings?.selectedColumns || []
      this.selectedFile = this.currentObjectData?.reportSettings?.typeFile || ''
      this.usePreview =
        this.currentObjectData?.reportSettings?.usePreview || false
      this.expandedSelectedParameterFields =
        this.currentObjectData?.reportSettings
          ?.expandedSelectedParameterFields || false
      this.expandedSelectedFilterFields =
        this.currentObjectData?.reportSettings?.expandedSelectedFilterFields ||
        false
      this.expandedSelectedColumns =
        this.currentObjectData?.reportSettings?.expandedSelectedColumns || false
      this.expandedTypeFile =
        this.currentObjectData?.reportSettings?.expandedTypeFile || false
    },
    currentObjectReportDataLoading () {
      this.loading = this.currentObjectReportDataLoading
    },
    currentObjectReportData () {
      this.outputParameterFields =
        this.currentObjectReportData?.reportSettings?.selectedParameterFields ||
        []
      this.outputFilterFields =
        this.currentObjectReportData?.reportSettings?.selectedFilterFields || []
      this.selectedColumns =
        this.currentObjectReportData?.reportSettings?.selectedColumns || []
      this.selectedFile =
        this.currentObjectReportData?.reportSettings?.typeFile || ''
      this.usePreview =
        this.currentObjectReportData?.reportSettings?.usePreview || false
      this.expandedSelectedParameterFields =
        this.currentObjectReportData?.reportSettings
          ?.expandedSelectedParameterFields || false
      this.expandedSelectedFilterFields =
        this.currentObjectReportData?.reportSettings
          ?.expandedSelectedFilterFields || false
      this.expandedSelectedColumns =
        this.currentObjectReportData?.reportSettings?.expandedSelectedColumns ||
        false
      this.expandedTypeFile =
        this.currentObjectReportData?.reportSettings?.expandedTypeFile || false
    },
    paginations () {
      this.pagination = this.paginations
    }
  },
  methods: {
    ...mapActions('appstore', [
      'setPrevMenuItemID',
      'setPrevObjectURL',
      'setCurrentMenuItemID',
      'setCurrentObjectURL',
      'setCurrentObjectData',
      'getCurrentObjectData',
      'setShowTR',
      'setInFullscreenTR',
      'setPropsTR',
      'setCurrentObjectReportData',
      'getCurrentObjectReportData',
      'setStateValueByKey'
    ]),
    handleClickTableFilterFieldsTR (props) {
      //console.log('handleClickTableFilterFieldsTR - props: ' + JSON.stringify(props, null, ' '))
    },
    handleClickTableParameterFieldsTR (props) {
      //console.log('handleClickTableParameterFieldsTR - props: ' + JSON.stringify(props, null, ' '))
    },
    handleChangeTableParameterFieldsTR (array) {
      this.selectedParameterFields = array
      this.setStateValueByKey({
        name: 'currentObjectData',
        key: 'reportSettings',
        subKey: 'selectedParameterFields',
        value: this.selectedParameterFields
      })
    },
    handleChangeTableFilterFieldsTR (array) {
      this.selectedFilterFields = array
      this.setStateValueByKey({
        name: 'currentObjectData',
        key: 'reportSettings',
        subKey: 'selectedFilterFields',
        value: this.selectedFilterFields
      })
    },
    handleClickBtnPrintList () {
      this.isShowPrintListDialog = true
    },
    handleClickBtnPrintListDialogCancel () {
      // TODO
    },
    handleClickBtnPrintListDialogOK () {
      this.getCurrentObjectReportData({
        isAuthenticated: this.isAuthenticated,
        token: this.token,
        useOData: false,
        reportSettings: {
          expandedSelectedParameterFields: this.expandedSelectedParameterFields,
          expandedSelectedFilterFields: this.expandedSelectedFilterFields,
          expandedSelectedColumns: this.expandedSelectedColumns,
          expandedTypeFile: this.expandedTypeFile,
          selectedParameterFields: this.selectedParameterFields,
          selectedFilterFields: this.selectedFilterFields,
          selectedColumns: this.selectedColumns,
          typeFile: this.selectedFile,
          usePreview: this.usePreview
        },
        loading: false,
        currentMenuItemID: this.currentMenuItemID,
        currentObjectReportURL: this.currentObjectURL
      })
    },
    handleClickBtnPrint () {
      const printWindow = window.open()
      printWindow.document.write(this.previewObjectReportText)
      printWindow.print()
      printWindow.close()
    },
    handleClickBtnFileSave () {
      if (this.objectReportFile) {
        this.saveBase64ToFile(
          this.objectReportFile,
          this.objectReportFileType,
          this.objectReportFileBase64
        )
      }
    },
    handleClickDataTableTR (props) {
      this.urRowID = props?.row?.urRowID
      this.setPropsTR(props)
      this.setShowTR(true)
      //console.log('DataTable - handleClickDataTableTR - urRowID: ' + JSON.stringify(this.urRowID))
      //console.log('DataTable - handleClickDataTableTR - currentTables: ' + JSON.stringify(this.currentTables))
    },
    submitFormDataTableTR () {
      this.handleCloseDataTableTR()
    },
    toggleInFullscreenTR () {
      this.setInFullscreenTR(!this.inFullscreenTR)
    },
    handleCloseDataTable () {
      this.setPrevMenuItemID('')
      this.setPrevObjectURL('')
      this.setCurrentMenuItemID('')
      this.setCurrentObjectURL('')
      this.setCurrentObjectData(null)
      this.setCurrentObjectReportData(null)
    },
    handleCloseDataTableTR () {
      this.setShowTR(false)
      this.setInFullscreenTR(false)
      this.setPropsTR(null)
      this.$nextTick(() => {
        try {
          this.$refs.myDataTableSearch.focus()
        } catch (error) {
          console.log(error.message)
        }
      })
    },
    onMyDataTableKey (evt) {
      //console.log(evt.keyCode)
      if (
        [27, 33, 34, 35, 36, 38, 40].indexOf(evt.keyCode) === -1 ||
        this.$refs.myDataTable === void 0
      ) {
        return
      }
      evt.preventDefault()
      //console.log(evt.keyCode)
      switch (evt.keyCode) {
        case 27: //ESC
          this.handleCloseDataTable()
          break
      }
    },
    onMyDataTableTRKey (evt) {
      if (evt.keyCode !== 27 || this.$refs.myDataTableTR === void 0) {
        return
      }
      evt.preventDefault()
      if (evt.keyCode === 27) {
        this.handleCloseDataTableTR()
      }
    },
    handlerFabActionClick () {
      if (!this.currentObjectAddURL) {
        this.currentObjectAddURL =
          'app?url=[e1cib/data/' +
          this.currentObjectURL +
          '?ref=00000000000000000000000000000000]' +
          '&v=' +
          this.currentMenuItemID
      }
      this.openTargetURL(this.currentObjectAddURL)
      this.currentObjectAddURL = ''
    },
    moveFab (ev) {
      this.draggingFab = ev.isFirst !== true && ev.isFinal !== true
      this.fabPos = [this.fabPos[0] - ev.delta.x, this.fabPos[1] - ev.delta.y]
    },
    handleClickBtnRefresh () {
      const currentMenuItemID = this.currentMenuItemID
      const currentObjectURL = this.currentObjectURL
      this.setPrevMenuItemID('')
      this.setPrevObjectURL('')
      this.setCurrentObjectURL('')
      this.setCurrentObjectData(null)
      this.setCurrentMenuItemID(currentMenuItemID)
      this.setCurrentObjectURL(currentObjectURL)
    },
    displayNotify (message) {
      if (message) {
        this.$q.notify({
          progress: true,
          icon: 'icon-mat-info',
          color: 'ur-bg-accent',
          textColor: 'white',
          position: 'bottom-right',
          message: message
        })
      }
    },
    onRequest (props) {
      //console.log(props)
      this.pagination = props.pagination
      this.filter = props.filter
      this.getCurrentObjectData({
        isAuthenticated: this.isAuthenticated,
        token: this.token,
        useOData: this.useOData,
        filter: this.filter,
        reportSettings: {
          expandedSelectedParameterFields: this.expandedSelectedParameterFields,
          expandedSelectedFilterFields: this.expandedSelectedFilterFields,
          expandedSelectedColumns: this.expandedSelectedColumns,
          expandedTypeFile: this.expandedTypeFile,
          selectedParameterFields: this.selectedParameterFields,
          selectedFilterFields: this.selectedFilterFields,
          selectedColumns: this.selectedColumns,
          typeFile: this.selectedFile,
          usePreview: this.usePreview
        },
        loading: this.loading,
        currentMenuItemID: this.currentMenuItemID,
        currentObjectURL: this.currentObjectURL,
        pagination: this.pagination,
        tableTitle: this.tableTitle,
        rowKey: this.rowKey
      })
    }
  }
}
</script>
<style>
/*
.ur-table .q-table {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.ur-table .q-table__top {
  padding-left: 0;
  padding-right: 0;
}
.ur-table .q-table__middle {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  height: 100vh;
  height: 100dvh;
}
*/
.ur-table .q-table__top {
  padding-top: 0;
  padding-left: 0;
  padding-right: 0;
}
.ur-table .q-table__middle {
  height: 100vh;
  height: 100dvh;
}
.q-expansion-item__toggle-focus {
  border-radius: 9999px !important;
}

.ur-dialog-card {
  max-width: 100% !important;
}
</style>
