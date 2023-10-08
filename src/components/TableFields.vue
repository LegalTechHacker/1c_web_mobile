<template>
  <div class="ur-tfc">
    <q-table
      v-if="isMobile"
      class="tw-rounded-2xl tw-shadow-md tw-p-4 ur-tf"
      :data="dataRows"
      :columns="dataColumns"
      :visible-columns="dataVisibleColumns"
      :rows-per-page-options="[0]"
      :pagination.sync="pagination"
      row-key="urRowID"
      grid
    >
      <template v-slot:item="props">
        <q-card
          class="tw-rounded-2xl tw-shadow-md tw-p-4 tw-my-2"
          tabindex="0"
          style="height: inherit"
        >
          <q-card-section>
            <div class="row items-end">
              <div
                v-for="col in props.cols.filter(
                  col =>
                    col.name !== colNameLeftValue &&
                    col.name !== colNameParameter
                )"
                :key="col.name"
                class="col-12"
              >
                <div v-if="col.name === colNameUsage" :title="colNameUsage">
                  <!-- TODO вынести в компонент BaseField (для типа boolean)-->
                  <div class="tw-block tw-p-2 tw-my-2">
                    <template
                      v-if="
                        props.cols
                          .map(c => c.name)
                          .indexOf(colNameLeftValue) !== -1
                      "
                    >
                      <label
                        class="tw-flex ur-scroll tw-mb-2"
                        :for="'id' + '_' + col.name + '_' + colNameLeftValue"
                      >
                        <span
                          class="tw-text-xb tw-leading-xb tw-font-normal tw-w-full"
                          >{{ colLabelLeftValue + ': ' }}</span
                        >
                      </label>
                      <q-checkbox
                        v-if="
                          isDisabledCurrentFieldTD(props, colNameRightValue)
                        "
                        v-model="props.row[col.name]"
                        @input="handleChangeBaseField($event)"
                        disable
                        :label="
                          props.row[colNameLeftValue]?.split(' (')[0] ||
                          props.row[colNameLeftValue]
                        "
                        :title="props.row[colNameLeftValue]"
                        :id="'id' + '_' + col.name + '_' + colNameLeftValue"
                        class="tw--ml-2"
                      />
                      <q-checkbox
                        v-else
                        v-model="props.row[col.name]"
                        @input="handleChangeBaseField($event)"
                        :label="
                          props.row[colNameLeftValue]?.split(' (')[0] ||
                          props.row[colNameLeftValue]
                        "
                        :title="props.row[colNameLeftValue]"
                        :id="'id' + '_' + col.name + '_' + colNameLeftValue"
                        class="tw--ml-2"
                      />
                    </template>
                    <template
                      v-else-if="
                        props.cols
                          .map(c => c.name)
                          .indexOf(colNameParameter) !== -1
                      "
                    >
                      <label
                        class="tw-flex ur-scroll tw-mb-2"
                        :for="'id' + '_' + col.name + '_' + colNameParameter"
                      >
                        <span
                          class="tw-text-xb tw-leading-xb tw-font-normal tw-w-full"
                          >{{ colNameParameter + ': ' }}</span
                        >
                      </label>
                      <q-checkbox
                        v-if="isDisabledCurrentFieldTD(props, colNameValue)"
                        v-model="props.row[col.name]"
                        @input="handleChangeBaseField($event)"
                        disable
                        :label="
                          props.row[colNameParameter]?.split(' (')[0] ||
                          props.row[colNameParameter]
                        "
                        :title="props.row[colNameParameter]"
                        :id="'id' + '_' + col.name + '_' + colNameParameter"
                        class="tw--ml-2"
                      />
                      <q-checkbox
                        v-else
                        v-model="props.row[col.name]"
                        @input="handleChangeBaseField($event)"
                        :label="
                          props.row[colNameParameter]?.split(' (')[0] ||
                          props.row[colNameParameter]
                        "
                        :title="props.row[colNameParameter]"
                        :id="'id' + '_' + col.name + '_' + colNameParameter"
                        class="tw--ml-2"
                      />
                    </template>
                    <template v-else>
                      <q-checkbox
                        v-if="
                          isDisabledCurrentFieldTD(
                            props,
                            props.cols
                              .map(c => c.name)
                              .indexOf(colNameRightValue) !== -1
                              ? colNameRightValue
                              : props.cols
                                  .map(c => c.name)
                                  .indexOf(colNameValue) !== -1
                              ? colNameValue
                              : col.name
                          )
                        "
                        v-model="props.row[col.name]"
                        @input="handleChangeBaseField($event)"
                        disable
                        :label="props.row[col.name]"
                        :title="props.row[col.name]"
                        :id="'id' + '_' + col.name"
                        class="tw--ml-2"
                      />
                      <q-checkbox
                        v-else
                        v-model="props.row[col.name]"
                        @input="handleChangeBaseField($event)"
                        :label="props.row[col.name]"
                        :title="props.row[col.name]"
                        :id="'id' + '_' + col.name"
                        class="tw--ml-2"
                      />
                    </template>
                  </div>
                </div>
                <BaseFieldCompound
                  v-else
                  :field="getCurrentFieldTD(props, col)"
                  :visible="true"
                  :disabled="!editable"
                  :edited="edited"
                  :withLabel="true"
                  :withTitle="true"
                  :isTD="false"
                  :isMobile="false"
                  :presentation="getCurrentValueTD(props, col)"
                  @changeBaseField="handleChangeBaseField($event)"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </template>
    </q-table>
    <!--virtual-scroll-->
    <q-table
      v-else
      class="tw-rounded-2xl tw-shadow-md tw-p-4 ur-tf ur-sticky-header-table"
      :data="dataRows"
      :columns="dataColumns"
      :visible-columns="dataVisibleColumns"
      :rows-per-page-options="[0]"
      :pagination.sync="pagination"
      row-key="urRowID"
    >
      <template v-slot:body="props">
        <q-tr
          class="ur-tr"
          :props="props"
          @click="handleClickTableFieldsTR(props)"
          no-hover
        >
          <template v-for="col in props.cols">
            <q-td
              :class="
                col.name === colNameUsage ? 'ur-td-card ur-mw-48' : 'ur-td-card'
              "
              :key="col.name"
              :props="props"
            >
              <div
                v-if="col.name === colNameUsage"
                :title="colNameUsage"
                class="ur-td"
              >
                <q-checkbox
                  v-if="
                    isDisabledCurrentFieldTD(
                      props,
                      props.cols.map(c => c.name).indexOf(colNameRightValue) !==
                        -1
                        ? colNameRightValue
                        : props.cols.map(c => c.name).indexOf(colNameValue) !==
                          -1
                        ? colNameValue
                        : col.name
                    )
                  "
                  v-model="props.row[col.name]"
                  @input="handleChangeBaseField($event)"
                  disable
                />
                <q-checkbox
                  v-else
                  v-model="props.row[col.name]"
                  @input="handleChangeBaseField($event)"
                />
              </div>
              <BaseFieldCompound
                v-else
                :field="getCurrentFieldTD(props, col)"
                :visible="true"
                :disabled="!editable"
                :edited="edited"
                :withLabel="false"
                :withTitle="colNamesWithTitle.includes(col.name)"
                :isTD="true"
                :isMobile="false"
                :presentation="getCurrentValueTD(props, col)"
                @changeBaseField="handleChangeBaseField($event)"
              />
            </q-td>
          </template>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { QTable } from 'quasar'
export default {
  name: 'TableFields',
  components: {
    QTable,
    BaseFieldCompound: require('src/components/BaseFieldCompound.vue').default
  },
  props: {
    rows: { type: Array, default: () => [] }
  },
  data () {
    return {
      dataPrevHash: '',
      dataHash: '',
      dataRows: [],
      dataColumns: [],
      dataVisibleColumns: [],
      pagination: { rowsPerPage: 0 },
      colNameUsage: 'Использование',
      colNameLeftValue: 'ЛевоеЗначение',
      colNameParameter: 'Параметр',
      colNameRightValue: 'ПравоеЗначение',
      colNameValue: 'Значение',
      colNamesWithTitle: 'ЛевоеЗначение, Параметр',
      colLabelLeftValue: 'Отбор',
      editable: true,
      edited: false,
      //fields: {},
      selected: []
    }
  },
  beforeUpdate () {
    if (!this.dataHash) {
      this.dataHash = this.uid()
      this.dataPrevHash = this.dataHash
    }
    if (this.dataPrevHash !== this.dataHash) {
      this.dataHash = this.uid()
      this.dataPrevHash = this.dataHash
    }
  },
  computed: {
    ...mapGetters('appstore', [
      'isAuthenticated',
      'token',
      'useOData',
      'isMobile'
    ]),
    rowsData () {
      return this.rows || []
    }
  },
  watch: {
    rowsData () {
      this.dataHash = this.uid()
      this.dataPrevHash = this.dataHash
    },
    dataHash () {
      //console.log('watch - dataHash: ' + this.dataHash)
      this.dataRows = this.rowsData || []
      const firstRow = this.rowsData[0]
      if (firstRow) {
        this.dataColumns = this.getColumns(firstRow, this.colNameUsage)
        this.dataVisibleColumns = this.getVisibleColumns(firstRow)
      } else {
        this.dataColumns = []
        this.dataVisibleColumns = []
      }
    }
  },
  methods: {
    ...mapActions('appstore', ['setPropsTR']),
    handleClickTableFieldsTR (props) {
      this.$emit('clickTR', props)
    },
    handleChangeBaseField (field) {
      if (this.editable) {
        if (!this.edited) {
          this.edited = true
        }
        //this.fields[field.id] = field // TODO
        //console.log('handleChangeBaseField - field:' + JSON.stringify(field, null, ' '))
        //console.log('handleChangeBaseField - fields:' + JSON.stringify(this.fields, null, ' '))
        const id = field?.id
        const urRowKey = field?.urRowKey
        if (id && urRowKey) {
          let dataRows = this.dataRows
          for (let i = 0; i < dataRows.length; i++) {
            let tr = dataRows[i]
            const urRowID = tr?.urRowID
            if (urRowID) {
              if (urRowID === urRowKey) {
                Object.keys(tr).forEach(k => {
                  let td = tr[k]
                  if (td?.field?.field?.id === id) {
                    td.field.field = field
                    try {
                      tr[this.colNameUsage] = true
                    } catch (error) {}
                    //console.log('td' + JSON.stringify(td, null, ' '))
                  }
                })
              }
            }
          }
          this.dataRows = dataRows
        }
        //console.log('handleChangeBaseField - dataRows:' + JSON.stringify(this.dataRows, null, ' '))
        this.$emit('changeTR', this.dataRows)
      }
    }
  }
}
</script>

<style lang="scss">
.ur-tfc {
  max-height: 46vh;
  padding: 0.5rem;
  overflow: auto;
  .q-table__grid-content {
    .q-card {
      padding: 0;
    }
    .ur-dense {
      margin-top: 2em;
    }
  }
}

.ur-tf {
  height: 100%;
  .q-table {
    margin-right: 2.4rem;
  }
}
.ur-tf .q-table__top {
  padding-top: 0;
  padding-left: 0;
  padding-right: 0;
}
.ur-tf .q-table__middle {
  height: 100%;
}
</style>
