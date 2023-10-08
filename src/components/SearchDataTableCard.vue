<template>
  <div>
    <q-card
      class="tw-rounded-2xl tw-shadow-md tw-p-4"
      :class="currentSearchObjectIsDelete ? 'tw-bg-red-100' : ''"
      tabindex="0"
      style="max-width: 1024px; margin: auto"
    >
      <q-toolbar class="ur-sticky tw-sticky tw-top-0">
        <q-btn
          flat
          round
          dense
          :icon="'icon-mat-arrow_back'"
          @click="handleClickBtnClose"
        />
        <q-btn
          v-if="isCorrect && !isEditableNew"
          flat
          round
          dense
          :color="isFavorite ? 'orange' : ''"
          :icon="isFavorite ? 'icon-mat-grade_filled' : 'icon-mat-grade'"
          :aria-label="btnFavoriteTitle"
          :title="btnFavoriteTitle"
          @click="handleClickBtnFavorite"
        />
        <q-toolbar-title
          ><div class="text-h6" :title="currentSearchObjectData?.title">
            {{ currentSearchObjectData?.title }}
          </div></q-toolbar-title
        >
        <q-btn
          v-if="editable && isCorrect && !isEditableNew"
          flat
          round
          dense
          :color="currentSearchObjectIsDelete ? 'negative' : ''"
          :icon="
            currentSearchObjectIsDelete
              ? 'icon-mat-delete_filled'
              : 'icon-mat-delete'
          "
          :aria-label="btnDeleteTitle"
          :title="btnDeleteTitle"
          @click="handleClickBtnDelete"
        />
        <q-btn
          v-if="!editable && isCorrect"
          flat
          round
          dense
          :icon="'icon-mat-edit'"
          :aria-label="btnEditTitle"
          :title="btnEditTitle"
          @click="handleClickBtnEdit"
        />
        <!--
          <q-btn
            flat
            round
            dense
            :icon="
              inFullscreenSearchTR
                ? 'icon-mat-fullscreen_exit'
                : 'icon-mat-fullscreen'
            "
            @click="toggleInFullscreenSearchTR"
          />
          -->
      </q-toolbar>
      <div class="ur-bgii">
        <q-badge
          v-if="currentSearchObjectIsDelete"
          outline
          color="negative"
          :label="badgeDeleteTitle"
        />
        <q-form
          @submit.prevent="submitFormSearchDataTableTR"
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
              <q-card-section class="ur-card-section-table">
                <div>
                  <!--:columns="currentSearchObjectData?.columns"-->
                  <q-table
                    v-if="currentSearchObjectURL"
                    :link="currentSearchObjectURL"
                    :data="visibleRows"
                    :row-key="currentSearchObjectData?.rowKey"
                    :loading="currentSearchObjectData?.loading"
                    :rows-per-page-options="[0]"
                    :visible-columns="visibleColumns"
                    separator="horizontal"
                    selection="single"
                    virtual-scroll
                    class="tw-rounded-2xl tw-shadow-md tw-p-4 ur-table-card"
                    tabindex="0"
                    hide-header
                    hide-bottom
                  >
                    <template v-slot:body="props">
                      <q-tr
                        class="ur-tr"
                        :props="props"
                        @click="handleClickSearchDataTableTR(props)"
                        no-hover
                      >
                        <template v-for="col in props.cols">
                          <q-td
                            v-if="
                              !isMobile ||
                              (isMobile && col.name === colNameValue)
                            "
                            :class="
                              '' +
                              (col.name === colNameValue ? 'ur-td-card ' : '') +
                              (isMobile ? 'ur-bbws' : '')
                            "
                            :key="col.name"
                            :props="props"
                          >
                            <BaseFieldCompound
                              :field="getCurrentFieldTD(props, col)"
                              :visible="true"
                              :disabled="!editable"
                              :edited="edited"
                              :withLabel="isMobile"
                              :withTitle="false"
                              :isTD="true"
                              :isMobile="isMobile"
                              :presentation="getCurrentValueTD(props, col)"
                              @changeBaseField="handleChangeBaseField($event)"
                            />
                          </q-td>
                        </template>
                      </q-tr>
                    </template>
                  </q-table>
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
                <SearchDataTableCardTR
                  :title="table?.title"
                  :rows="table?.rows"
                  :columns="table?.columns"
                  :urRowID="urRowID"
                  :editable="editable"
                  :edited="edited"
                  @changeBaseFieldTR="handleChangeBaseFieldTR($event)"
                />
              </div>
            </q-expansion-item>
          </div>
          <q-card-actions align="right" class="ur-sticky tw-sticky tw-bottom-0">
            <!--type="submit"-->
            <q-btn
              class="ur-btn tw-rounded-xl tw-px-2"
              flat
              color="negative"
              :aria-label="btnSubmitTitle"
              :label="btnSubmitTitle"
              @click="handleClickBtnClose"
            />
            <q-btn
              v-if="editable && edited"
              class="ur-btn tw-rounded-xl tw-px-3 ur-text-accent-10 ur-bg-accent-400"
              flat
              :icon="'icon-mat-save'"
              :aria-label="btnSaveTitle"
              :label="btnSaveTitle"
              :disable="currentSearchObjectDataLoading"
              @click="handleClickBtnSave"
            />
          </q-card-actions>
        </q-form>
      </div>
    </q-card>
    <q-dialog v-model="isShowConfirmDialog" persistent>
      <q-card class="ur-dialog-card">
        <q-card-section class="row items-center">
          <q-avatar
            class="ur-icon"
            icon="icon-mat-info"
            color="white"
            text-color="primary"
          />
          <q-card-section>
            <h6>{{ titleConfirmDialog }}</h6>
            <p class="text-subtitle2" v-html="descriptionConfirmDialog"></p>
            <p class="text-subtitle2">Продолжить?</p>
          </q-card-section>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            class="ur-btn tw-rounded-xl tw-px-2"
            flat
            color="negative"
            :aria-label="btnConfirmDialogCancelTitle"
            :label="btnConfirmDialogCancelTitle"
            v-close-popup
            @click="handleClickBtnConfirmDialogCancel"
          />
          <q-btn
            class="ur-btn tw-rounded-xl tw-px-2"
            flat
            color="positive"
            :aria-label="btnConfirmDialogOKTitle"
            :label="btnConfirmDialogOKTitle"
            v-close-popup
            @click="handleClickBtnConfirmDialogOK"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { QTable } from 'quasar'
export default {
  name: 'SearchDataTableCard',
  components: {
    QTable,
    // BaseFieldReadonlyTDCard: require('src/components/BaseFieldReadonlyTDCard.vue').default,
    BaseFieldCompound: require('src/components/BaseFieldCompound.vue').default,
    SearchDataTableCardTR: require('src/components/SearchDataTableCardTR.vue')
      .default
  },
  props: {
    title: { type: String, default: '' },
    link: { type: String, default: '' },
    icon: { type: String, default: 'icon-mat-format_list_bulleted' }
  },
  data () {
    return {
      colNameTitle: 'ИмяРеквизита',
      colNameValue: 'ЗначениеРеквизита',
      btnSubmitTitle: 'Закрыть',
      btnSaveTitle: 'Сохранить',
      loading: false,
      rows: [],
      rowKey: 'urRowID',
      tableTitle: this.title,
      visibleColumns: [],
      fields: {},
      tablesFields: {},
      editable: false,
      edited: false,
      isShowConfirmDialog: false,
      isShowWarningBeforeClosing: false,
      typeConfirmDialog: '',
      titleConfirmDialog: '',
      descriptionConfirmDialog: '',
      btnConfirmDialogCancelTitle: '',
      btnConfirmDialogOKTitle: '',
      btnFavoriteTitle: 'Избранное',
      btnEditTitle: 'Редактировать',
      badgeDeleteTitle: 'Удален'
    }
  },
  mounted () {
    if (this.isEditableNew && this.isCorrect) {
      if (!this.editable) {
        this.editable = true
      }
    }
  },
  beforeUpdate () {
    const firstRow = this.currentSearchObjectData?.rows[0]
    if (firstRow) {
      this.visibleColumns = this.getVisibleColumns(firstRow)
    } else {
      this.visibleColumns = this.currentSearchObjectData?.columns?.map(
        item => item.name
      )
    }
  },
  computed: {
    ...mapGetters('appstore', [
      'isAuthenticated',
      'me',
      'token',
      'useOData',
      'baseURL',
      'currentMenuItemID',
      'currentSearchObjectURL',
      'currentSearchObjectData',
      'currentSearchObjectDataLoading',
      'currentSearchObjectIsDelete',
      'currentSearchObjectFavorite',
      'isCurrentSearchObjectFavorite',
      'inFullscreenSearchTR',
      'propsSearchTR',
      'isMobile'
    ]),
    visibleRows () {
      //console.log(JSON.stringify(this.currentSearchObjectData?.rows[0], null, ' '))
      if (
        this.isObject(this.currentSearchObjectData?.rows[0][this.colNameValue])
      ) {
        return this.currentSearchObjectData?.rows?.filter(
          row =>
            row[this.colNameValue]?.field?.field?.visible === true &&
            row[this.colNameValue]?.field?.field?.id !== 'fieldСсылка'
        )
      } else {
        return this.currentSearchObjectData?.rows
      }
    },
    tables () {
      return this.currentSearchObjectData?.tables
    },
    currentTables () {
      //console.log('DataTable - computed - urRowID: ' + this.urRowID)
      //return this.tables[this.urRowID]
      return this.tables
    },
    urRowID () {
      return 'id' + this.uid()
    },
    isEditable () {
      return this.isRefObjectEditable(this.currentSearchObjectURL)
    },
    isEditableNew () {
      return this.isRefNewObjectEditable(this.currentSearchObjectURL)
    },
    isCorrect () {
      return !this.currentSearchObjectData?.title.includes('<Объект не найден>')
    },
    isFavorite () {
      return (
        this.currentSearchObjectFavorite || this.isCurrentSearchObjectFavorite
      )
    },
    currentRefData () {
      return this.currentSearchObjectData?.refData
    },
    btnDeleteTitle () {
      if (this.currentSearchObjectIsDelete) {
        return 'Восстановить'
      } else {
        return 'Удалить'
      }
    }
  },
  methods: {
    ...mapActions('appstore', [
      'setPrevMenuItemID',
      'setPrevSearchObjectURL',
      'setCurrentMenuItemID',
      'setCurrentSearchObjectURL',
      'setCurrentSearchObjectData',
      'setInFullscreenSearchTR',
      'addFavoriteFrom1C',
      'deleteItemFromFavorites',
      'deleteCurrentSearchObjectData',
      'addCurrentSearchObjectData',
      'updateCurrentSearchObjectData'
    ]),
    handleClickSearchDataTableTR (props) {
      //this.urRowID = props?.row?.urRowID
      // TODO http://localhost/urait30/hs/interfacebuilder-local/v1/app?url=[e1cib/data/Справочник.юрВидДела?ref=8e5c80c5f22b45d211ea46727763e2f7]
      //console.log('SearchDataTableCard - handleClickSearchDataTableTR - currentSearchObjectData: ' + JSON.stringify(this.currentSearchObjectData))
      //console.log('SearchDataTableCard - handleClickSearchDataTableTR - props: ' + JSON.stringify(props))
      //console.log('SearchDataTableCard - handleClickSearchDataTableTR - urRowID: ' + JSON.stringify(this.urRowID))
      //console.log('SearchDataTableCard - handleClickSearchDataTableTR - currentTables: ' + JSON.stringify(this.currentTables))
    },
    handleClickSearchDataTableTDValue (col) {
      // TODO
      //console.log('SearchDataTableCard - handleClickSearchDataTableTDValue -col: ' + JSON.stringify(col))
    },

    submitFormSearchDataTableTR () {
      this.handleClickBtnClose()
    },
    toggleInFullscreenSearchTR () {
      this.setInFullscreenSearchTR(!this.inFullscreenSearchTR)
    },
    handleCloseSearchDataTable () {
      if (this.edited) {
        this.handleClickBtnSave()
        this.isShowWarningBeforeClosing = false
        this.edited = false
      } else {
        this.setInFullscreenSearchTR(false)
        this.setPrevSearchObjectURL('')
        this.setCurrentSearchObjectURL('')
        this.setCurrentSearchObjectData(null)
        this.setPrevMenuItemID('')
        this.setCurrentMenuItemID('')
      }
    },
    async handleClickBtnFavorite () {
      if (this.isAuthenticated && !this.useOData) {
        const favorite = {
          id: 'id' + this.hash_md5(this.currentSearchObjectURL),
          important: false,
          url: this.currentSearchObjectURL,
          description: this.currentSearchObjectData?.title,
          user: this.me?.userIB?.name
        }
        if (!this.isFavorite) {
          await this.addFavoriteFrom1C({
            token: this.token,
            loading: false,
            favorite: favorite,
            currentSearchObjectURL: this.currentSearchObjectURL
          })
        } else {
          await this.deleteItemFromFavorites({
            token: this.token,
            loading: false,
            favorite: favorite,
            currentSearchObjectURL: this.currentSearchObjectURL
          })
        }
      }
    },
    handleChangeBaseField (field) {
      if (this.editable) {
        if (!this.edited) {
          this.edited = true
        }
        this.fields[field.id] = field
        //console.log('handleChangeBaseField - field:' + JSON.stringify(field, null, ' '))
        //console.log('handleChangeBaseField - fields:' + JSON.stringify(this.fields, null, ' '))
        //TODO
      }
    },
    handleChangeBaseFieldTR (field) {
      if (this.editable) {
        if (!this.edited) {
          this.edited = true
        }
        this.fields[field.id] = field
        //this.tablesFields={} //TODO

        //console.log('handleChangeBaseFieldTR - field:' + JSON.stringify(field, null, ' '))
        //console.log('handleChangeBaseFieldTR - fields:' + JSON.stringify(this.fields, null, ' '))
        //TODO
      }
    },

    handleClickBtnEdit () {
      this.editable = !this.editable
    },
    handleClickBtnDelete () {
      this.typeConfirmDialog = 'Delete'
      this.titleConfirmDialog = 'Информация'
      this.btnConfirmDialogCancelTitle = 'Отменить'
      if (this.currentSearchObjectIsDelete) {
        this.descriptionConfirmDialog =
          'Будет произведено восстановление удалённого объекта.'
        this.btnConfirmDialogOKTitle = 'Восстановить'
      } else {
        this.descriptionConfirmDialog = 'Будет произведено удаление объекта.'
        this.btnConfirmDialogOKTitle = 'Удалить'
      }
      this.isShowConfirmDialog = true
    },
    handleClickBtnClose () {
      if (this.edited) {
        this.isShowWarningBeforeClosing = true
      }
      this.handleCloseSearchDataTable()
    },
    handleClickBtnSave () {
      this.typeConfirmDialog = 'Save'
      this.titleConfirmDialog = 'Информация'
      this.btnConfirmDialogCancelTitle = 'Отменить'
      this.descriptionConfirmDialog = ''
      if (this.isShowWarningBeforeClosing) {
        this.descriptionConfirmDialog +=
          'Имеются несохраненные данные.' + '<br/>'
      }
      if (this.isEditableNew) {
        this.descriptionConfirmDialog += 'Будет произведено создание объекта.'
        this.btnConfirmDialogOKTitle = 'Создать'
      } else {
        this.descriptionConfirmDialog += 'Будет произведено сохранение объекта.'
        this.btnConfirmDialogOKTitle = 'Сохранить'
      }
      this.isShowConfirmDialog = true
    },
    handleClickBtnConfirmDialogCancel () {
      if (this.typeConfirmDialog === 'Save') {
        this.handleClickBtnClose()
      }
    },
    async handleClickBtnConfirmDialogOK () {
      let message = ''
      if (this.typeConfirmDialog === 'Delete') {
        await this.deleteCurrentSearchObjectData({
          isAuthenticated: this.isAuthenticated,
          token: this.token,
          useOData: false,
          loading: false,
          currentSearchObjectURL: this.currentSearchObjectURL
        })
      } else if (this.typeConfirmDialog === 'Save') {
        let param = {
          isAuthenticated: this.isAuthenticated,
          token: this.token,
          useOData: false,
          loading: false,
          currentMenuItemID: this.currentMenuItemID,
          currentSearchObjectURL: this.currentSearchObjectURL,
          tableTitle: this.tableTitle,
          rowKey: this.rowKey,
          refData: this.currentRefData,
          fields: this.fields,
          tablesFields: this.tablesFields,
          edited: this.edited,
          editable: this.editable
        }
        if (this.isEditableNew) {
          await this.addCurrentSearchObjectData(param)
        } else {
          await this.updateCurrentSearchObjectData(param)
        }
        this.fields = param.fields
        this.tablesFields = param.tablesFields
        this.edited = param.edited
        this.editable = param.editable
      } else {
        message = 'coming soon...'
        this.displayNotify(message)
      }
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
    }
  }
}
</script>
<style>
.ur-card-section-table.q-card__section {
  padding: 0 !important;
}
.ur-table-card .q-table__top {
  padding-top: 0;
  padding-left: 0;
  padding-right: 0;
}
.ur-table-card .q-table__middle {
  height: 100%;
}
.q-expansion-item__toggle-focus {
  border-radius: 9999px !important;
}
.ur-dialog-card {
  border-radius: 1rem !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}
.ur-dialog-card .ur-icon i.q-icon {
  font-size: 3rem;
}
</style>
