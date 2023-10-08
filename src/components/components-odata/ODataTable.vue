<template>
  <div>
    <div v-show="!showTR">
      <!--:columns="currentObjectData?.columns"-->
      <q-table
        v-if="currentObjectURL"
        :link="currentObjectURL"
        :title="currentObjectData?.tableTitle"
        :data="currentObjectData?.rows"
        :row-key="currentObjectData?.rowKey"
        :pagination.sync="pagination"
        :loading="currentObjectData?.loading"
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
        ref="myODataTable"
        @keydown.native="onMyODataTableKey"
      >
        <!--<template v-slot:top="props"></template>-->
        <template v-slot:top>
          <q-toolbar>
            <q-btn
              flat
              round
              dense
              :icon="'icon-mat-arrow_back'"
              @click="handleCloseODataTable"
            />
            <q-toolbar-title>
              <div
                class="q-table__title"
                :title="currentObjectData?.tableTitle"
              >
                {{ currentObjectData?.tableTitle }}
              </div>
            </q-toolbar-title>
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
                  ref="myODataTableSearch"
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
                @clickTD="handleClickODataTableTR(props)"
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
        ref="myODataTableTR"
        @keydown.native="onMyODataTableTRKey"
      >
        <q-toolbar>
          <q-btn
            flat
            round
            dense
            :icon="'icon-mat-arrow_back'"
            @click="handleCloseODataTableTR"
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
            @submit.prevent="submitFormODataTableTR"
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
              v-for="table in currentObjectDataTables"
              :key="table?.id"
            >
              <q-expansion-item
                expand-icon-toggle
                :label="table?.label || table?.title"
                class="text-subtitle1"
              >
                <div class="tw-my-2">
                  <!--<pre>{{ table }}</pre>-->
                  <ODataTableTR
                    :title="table?.title"
                    :link="table?.link"
                    :rows="table?.rows"
                    :columns="table?.columns"
                    :Ref_Key="Ref_Key"
                    @updateLabel="
                      v => (table.label = table?.title + ' (' + v + ')')
                    "
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
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { QTable } from 'quasar'
export default {
  name: 'ODataTable',
  components: {
    QTable,
    BaseFieldReadonlyTD: require('src/components/BaseFieldReadonlyTD.vue')
      .default,
    BaseFieldReadonly: require('src/components/BaseFieldReadonly.vue').default,
    ODataTableTR: require('src/components/components-odata/ODataTableTR.vue')
      .default
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
        rowsPerPage: 20
        //rowsNumber: 0
      },
      rows: [],
      rowKey: 'Ref_Key',
      tableTitle: this.title,
      visibleColumns: [],
      Ref_Key: ''
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
  },
  computed: {
    ...mapGetters('appstore', [
      'isAuthenticated',
      'useOData',
      'baseURL',
      'currentObjectURL',
      'currentObjectData',
      'currentObjectDataTables',
      'showTR',
      'inFullscreenTR',
      'propsTR'
    ])
  },
  methods: {
    ...mapActions('appstore', [
      'setCurrentObjectURL',
      'setCurrentObjectData',
      'setCurrentObjectDataTables',
      'setPrevObjectURL',
      'setShowTR',
      'setInFullscreenTR',
      'setPropsTR'
    ]),
    handleClickODataTableTR (props) {
      this.setPropsTR(props)
      this.setShowTR(true)
      this.Ref_Key = props?.row?.Ref_Key
      //console.log('ODataTable - handleClickODataTableTR - Ref_Key: ' + JSON.stringify(this.Ref_Key))
    },
    submitFormODataTableTR () {
      this.handleCloseODataTableTR()
    },
    toggleInFullscreenTR () {
      this.setInFullscreenTR(!this.inFullscreenTR)
    },
    handleCloseODataTable () {
      this.setPrevObjectURL('')
      this.setCurrentObjectURL('')
      this.setCurrentObjectData(null)
      this.setCurrentObjectDataTables(null)
    },
    handleCloseODataTableTR () {
      this.setShowTR(false)
      this.setInFullscreenTR(false)
      this.setPropsTR(null)
      this.$nextTick(() => {
        try {
          this.$refs.myODataTableSearch.focus()
        } catch (error) {
          console.log(error.message)
        }
      })
    },
    onMyODataTableKey (evt) {
      //console.log(evt.keyCode)
      if (
        [27, 33, 34, 35, 36, 38, 40].indexOf(evt.keyCode) === -1 ||
        this.$refs.myODataTable === void 0
      ) {
        return
      }
      evt.preventDefault()
      //console.log(evt.keyCode)
      switch (evt.keyCode) {
        case 27: //ESC
          this.handleCloseODataTable()
          break
      }
    },
    onMyODataTableTRKey (evt) {
      if (evt.keyCode !== 27 || this.$refs.myODataTableTR === void 0) {
        return
      }
      evt.preventDefault()
      if (evt.keyCode === 27) {
        this.handleCloseODataTableTR()
      }
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
</style>
