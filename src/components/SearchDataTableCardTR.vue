<template>
  <div>
    <div v-show="!showSearchTR">
      <q-table
        v-if="urRowID"
        :title="tableTitle"
        :data="rows"
        :columns="columns"
        :row-key="rowKey"
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
        class="tw-rounded-2xl tw-shadow-md tw-p-4 ur-sticky-header-table"
        tabindex="0"
      >
        <template v-slot:top>
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
                  ref="mySearchDataTableTRSearch"
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
            <div v-if="editable" class="row q-mb-sm">
              <q-btn
                flat
                round
                dense
                class="ur-btn tw-mr-2"
                color="primary"
                icon="icon-mat-add"
                :aria-label="btnAddRowTitle"
                :title="btnAddRowTitle"
                @click="handleClickBtnAddRow"
              />
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
                @clickTD="handleClickSearchDataTableTR(props)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <div v-show="showSearchTR">
      <q-card
        v-model="showSearchTR"
        class="tw-rounded-2xl tw-shadow-md tw-p-4"
        tabindex="0"
        style="height: inherit"
      >
        <q-toolbar>
          <q-btn
            flat
            round
            dense
            :icon="'icon-mat-arrow_back'"
            @click="handleCloseSearchDataTableTR"
          />
          <q-toolbar-title
            ><div class="text-h6" :title="title">
              {{ title }}
            </div></q-toolbar-title
          >
        </q-toolbar>
        <div v-if="propsSearchTR">
          <q-form
            @submit.prevent="submitFormSearchDataTableTR"
            autofocus
            tabindex="0"
          >
            <div class="tw-mb-2">
              <q-expansion-item
                default-opened
                expand-icon-toggle
                label="Данные строки"
                class="text-subtitle1"
              >
                <q-card-section>
                  <div class="row items-end">
                    <div
                      v-for="col in propsSearchTR.cols"
                      :key="col.name"
                      class="col-xs-12 col-sm-6 ur-col"
                    >
                      <BaseFieldCompound
                        :field="getCurrentFieldTD(propsSearchTR, col)"
                        :visible="true"
                        :disabled="!editable"
                        :edited="edited"
                        :withLabel="true"
                        :withTitle="false"
                        :isTD="false"
                        :presentation="getCurrentValueTD(propsSearchTR, col)"
                        @changeBaseField="handleChangeBaseFieldTR($event)"
                      />
                    </div>
                  </div>
                </q-card-section>
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
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { QTable } from 'quasar'
export default {
  name: 'SearchDataTableCardTR',
  components: {
    QTable,
    BaseFieldReadonlyTD: require('src/components/BaseFieldReadonlyTD.vue')
      .default,
    //BaseFieldReadonly: require('src/components/BaseFieldReadonly.vue').default,
    BaseFieldCompound: require('src/components/BaseFieldCompound.vue').default
  },
  props: {
    title: { type: String, default: '' },
    rows: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },
    Ref_Key: { type: String, default: '' },
    urRowID: { type: String, default: '' },
    editable: { type: Boolean, default: false },
    edited: { type: Boolean, default: false }
  },
  data () {
    return {
      btnSubmitTitle: 'Закрыть',
      btnAddRowTitle: 'Добавить строку',
      propsSearchTR: null,
      showSearchTR: false,
      objectURL: '',
      filter: '',
      loading: false,
      selected: [],
      pagination: {
        sortBy: 'Description',
        descending: false,
        page: 1,
        rowsPerPage: 20
        //rowsNumber: 0
      },
      tableTitle: this.title,
      visibleColumns: [],
      rowKey: 'urRowID'
    }
  },
  beforeUpdate () {
    const firstRow = this.rows[0]
    if (firstRow) {
      this.visibleColumns = this.getVisibleColumns(firstRow)
    } else {
      this.visibleColumns = this.columns?.map(item => item.name)
    }
  },
  computed: {
    ...mapGetters('appstore', ['baseURL'])
  },
  methods: {
    handleClickSearchDataTableTR (props) {
      this.propsSearchTR = props
      this.showSearchTR = true
    },
    submitFormSearchDataTableTR () {
      this.handleCloseSearchDataTableTR()
    },
    handleCloseSearchDataTableTR () {
      this.showSearchTR = false
      this.propsSearchTR = null
      this.$nextTick(() => {
        try {
          this.$refs.mySearchDataTableTRSearch.focus()
        } catch (error) {
          console.log(error.message)
        }
      })
    },
    handleChangeBaseFieldTR (field) {
      if (this.editable) {
        //TODO
        //console.log('1handleChangeBaseFieldTR:' + field)
        this.$emit('changeBaseFieldTR', field)
      }
    },
    handleClickBtnAddRow () {
      const message = 'add row - coming soon...'
      this.displayNotify(message)
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
