<template>
  <div>
    <q-card class="tw-rounded-2xl tw-shadow-md tw-p-4" tabindex="0">
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          :icon="'icon-mat-arrow_back'"
          @click="handleCloseDataReport"
        />
        <q-toolbar-title
          ><div class="text-h6" :title="reportTitle">
            {{ reportTitle }}
          </div></q-toolbar-title
        >
      </q-toolbar>
      <div>
        <q-form @submit.prevent="submitFormDataReport" autofocus tabindex="0">
          <q-card-actions align="right">
            <div v-if="!reportFile">
              <div class="tw-m-2 ur-text-secondary">
                Для получения отчета выполните команду "Сформировать"
              </div>
            </div>
            <q-space />
            <div v-if="reportFile">
              <q-btn
                v-if="usePreview && previewReportText"
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
            <q-btn
              class="ur-btn tw-rounded-xl tw-px-3 ur-text-accent-10 ur-bg-accent-400"
              flat
              :icon="'icon-mat-report'"
              :aria-label="btnSubmitTitle"
              :label="btnSubmitTitle"
              :disabled="loading"
              type="submit"
            />
          </q-card-actions>
          <q-card-section>
            <ThePreviewReport :preview="previewReportText" />
          </q-card-section>
        </q-form>
      </div>
    </q-card>
    <q-dialog v-model="isShowPrintReportDialog" persistent>
      <q-card class="ur-dialog-card">
        <q-card-section class="row items-center">
          <q-avatar
            class="ur-icon"
            icon="icon-mat-print"
            color="white"
            text-color="primary"
          />
          <q-card-section>
            <h6>{{ titlePrintReportDialog }}</h6>
            <p class="text-subtitle2" v-html="descriptionPrintReportDialog"></p>
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
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            class="ur-btn tw-rounded-xl tw-px-2"
            flat
            color="negative"
            :aria-label="btnPrintReportDialogCancelTitle"
            :label="btnPrintReportDialogCancelTitle"
            v-close-popup
            @click="handleClickBtnPrintReportDialogCancel"
          />
          <q-btn
            class="ur-btn tw-rounded-xl tw-px-2"
            flat
            color="positive"
            :icon="'icon-mat-report'"
            :aria-label="btnPrintReportDialogOKTitle"
            :label="btnPrintReportDialogOKTitle"
            :disabled="loading"
            @click="handleClickBtnPrintReportDialogOK"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'DataReport',
  components: {
    TableFields: require('src/components/TableFields.vue').default,
    ThePreviewReport: require('src/components/ThePreviewReport.vue').default
  },
  props: {
    id: { type: String, default: '' },
    title: { type: String, default: '' },
    onlySettings: { type: Boolean, default: false },
    reportSettings: { type: Object, default: () => {} },
    previewBase64: { type: String, default: '' },
    fileBase64: { type: String, default: '' },
    fileName: { type: String, default: '' },
    fileExtension: { type: String, default: '' },
    file: { type: String, default: '' },
    link: { type: String, default: '' },
    icon: { type: String, default: 'icon-mat-report' }
  },
  data () {
    return {
      btnSubmitTitle: 'Сформировать',
      isShowPrintReportDialog: false,
      titlePrintReportDialog: 'Сформировать',
      descriptionPrintReportDialog: 'Сформировать отчет.',
      btnPrintReportDialogCancelTitle: 'Закрыть',
      btnPrintReportDialogOKTitle: 'Сформировать',
      usePreview: true,
      filter: '',
      loading: false,
      reportTitle: 'Отчет: ' + (this.title || ''),
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
  beforeUpdate () {},
  computed: {
    ...mapGetters('appstore', [
      'isAuthenticated',
      'token',
      'useOData',
      //'baseURL',
      'currentReportURL',
      'currentReportData',
      'currentReportDataLoading',
      'currentMenuItemID',
      'isMobile'
    ]),
    previewReportText () {
      if (this.currentReportData?.onlySettings) {
        return ''
      } else {
        const base64 = this.currentReportData?.previewBase64 || ''
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
    reportFileBase64 () {
      return this.currentReportData?.fileBase64 || ''
    },
    reportFile () {
      return this.currentReportData?.file || ''
    },
    reportFileType () {
      return this.getFileType(this.currentReportData?.fileExtension || '')
    }
  },
  watch: {
    currentReportDataLoading () {
      this.loading = this.currentReportDataLoading
    },
    currentReportData () {
      this.reportTitle = 'Отчет: ' + (this.currentReportData?.title || '')
      this.outputParameterFields =
        this.currentReportData?.reportSettings?.selectedParameterFields || []
      this.outputFilterFields =
        this.currentReportData?.reportSettings?.selectedFilterFields || []
      this.selectedColumns =
        this.currentReportData?.reportSettings?.selectedColumns || []
      this.selectedFile = this.currentReportData?.reportSettings?.typeFile || ''
      this.usePreview =
        this.currentReportData?.reportSettings?.usePreview || false
      this.expandedSelectedParameterFields =
        this.currentReportData?.reportSettings
          ?.expandedSelectedParameterFields || false
      this.expandedSelectedFilterFields =
        this.currentReportData?.reportSettings?.expandedSelectedFilterFields ||
        false
      this.expandedSelectedColumns =
        this.currentReportData?.reportSettings?.expandedSelectedColumns || false
      this.expandedTypeFile =
        this.currentReportData?.reportSettings?.expandedTypeFile || false
    }
  },
  methods: {
    ...mapActions('appstore', [
      'setPrevMenuItemID',
      'setPrevReportURL',
      'setCurrentMenuItemID',
      'setCurrentReportURL',
      'setCurrentReportData',
      'getCurrentReportData',
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
        name: 'currentReportData',
        key: 'reportSettings',
        subKey: 'selectedParameterFields',
        value: this.selectedParameterFields
      })
    },
    handleChangeTableFilterFieldsTR (array) {
      this.selectedFilterFields = array
      this.setStateValueByKey({
        name: 'currentReportData',
        key: 'reportSettings',
        subKey: 'selectedFilterFields',
        value: this.selectedFilterFields
      })
    },
    submitFormDataReport () {
      this.isShowPrintReportDialog = true
    },
    handleClickBtnPrintReportDialogCancel () {
      // TODO
    },
    handleClickBtnPrintReportDialogOK () {
      this.getCurrentReportData({
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
        currentReportURL: this.currentReportURL
      })
    },
    handleClickBtnPrint () {
      const printWindow = window.open()
      printWindow.document.write(this.previewReportText)
      printWindow.print()
      printWindow.close()
    },
    handleClickBtnFileSave () {
      if (this.reportFile) {
        this.saveBase64ToFile(
          this.reportFile,
          this.reportFileType,
          this.reportFileBase64
        )
      }
    },
    handleCloseDataReport () {
      this.setPrevMenuItemID('')
      this.setPrevReportURL('')
      this.setCurrentMenuItemID('')
      this.setCurrentReportURL('')
      this.setCurrentReportData(null)
    }
  }
}
</script>
<style></style>
