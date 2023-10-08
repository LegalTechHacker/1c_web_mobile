<template>
  <div>
    <div v-show="!showTR">
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
                  ref="myDataTableTRSearch"
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
    </div>
    <div v-show="showTR">
      <q-card
        v-model="showTR"
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
            @click="handleCloseDataTableTR"
          />
          <q-toolbar-title
            ><div class="text-h6" :title="title">
              {{ title }}
            </div></q-toolbar-title
          >
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
                label="Данные строки"
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
  name: 'DataTableTR',
  components: {
    QTable,
    BaseFieldReadonlyTD: require('src/components/BaseFieldReadonlyTD.vue')
      .default,
    BaseFieldReadonly: require('src/components/BaseFieldReadonly.vue').default
  },
  props: {
    title: { type: String, default: '' },
    rows: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },
    Ref_Key: { type: String, default: '' },
    urRowID: { type: String, default: '' }
  },
  data () {
    return {
      btnSubmitTitle: 'Закрыть',
      propsTR: null,
      showTR: false,
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
    handleClickDataTableTR (props) {
      this.propsTR = props
      this.showTR = true
    },
    submitFormDataTableTR () {
      this.handleCloseDataTableTR()
    },
    handleCloseDataTableTR () {
      this.showTR = false
      this.propsTR = null
      this.$nextTick(() => {
        try {
          this.$refs.myDataTableTRSearch.focus()
        } catch (error) {
          console.log(error.message)
        }
      })
    }
  }
}
</script>
