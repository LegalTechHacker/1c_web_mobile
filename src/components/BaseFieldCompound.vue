<template>
  <div
    class="tw-flex tw-flex-no-wrap tw-w-full tw-items-center tw-justify-between"
  >
    <BaseField
      :field="dataField"
      :visible="visible"
      :disabled="disabled"
      :edited="edited"
      :presentation="presentation"
      :withLabel="withLabel"
      :withTitle="withTitle"
      :isTD="isTD"
      :isMobile="isMobile"
      @changeBaseField="handleChangeBaseField($event)"
    />
    <div class="tw--ml-8.5 ur-dense tw-opacity-50">
      <q-space />
      <q-btn
        v-if="typeValues.length > 1"
        flat
        round
        dense
        :disabled="disabled"
        :aria-label="btnMenuTypeValuesTitle"
        :title="btnMenuTypeValuesTitle"
        :icon="'icon-mat-tune'"
        class="ur-btn-menu"
      >
        <q-menu fit content-class="ur-menu">
          <q-list v-if="typeValues.length > 100" dense class="ur-list-menu">
            <q-scroll-area
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
              :style="`max-height: calc(100vh - 260px); min-height: 40px; height: ${
                typeValues.length * 36
              }px;`"
              id="scroll-area-types"
            >
              <q-virtual-scroll
                scroll-target="scroll-area-types"
                :items="typeValues"
              >
                <template v-slot="{ item }">
                  <q-item
                    :key="item"
                    :class="currentTypeValue === item ? 'q-item--active' : ''"
                    clickable
                    v-close-popup
                    @click="handleChangeTypeValue(item)"
                  >
                    <q-item-section :title="item">{{
                      getTypeValueDescription(item)
                    }}</q-item-section>
                  </q-item>
                </template>
              </q-virtual-scroll>
            </q-scroll-area>
          </q-list>
          <q-list v-else dense class="ur-list-menu">
            <q-item
              v-for="typeValue in typeValues"
              :key="typeValue"
              :class="currentTypeValue === typeValue ? 'q-item--active' : ''"
              clickable
              v-close-popup
              @click="handleChangeTypeValue(typeValue)"
            >
              <q-item-section :title="typeValue">{{
                getTypeValueDescription(typeValue)
              }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseFieldCompound',
  components: {
    BaseField: require('src/components/BaseField.vue').default
  },
  props: {
    field: { type: Object, default: () => {} },
    visible: { type: Boolean, default: true },
    disabled: { type: Boolean, default: true },
    edited: { type: Boolean, default: false }, //TODO
    presentation: { type: String, default: '' },
    withLabel: { type: Boolean, default: true },
    withTitle: { type: Boolean, default: false },
    isTD: { type: Boolean, default: false },
    isMobile: { type: Boolean, default: false }
  },
  setup () {
    return {
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: 'rgba(var(--color-accent-base-mask-rgb), 0.25)',
        width: '5px',
        opacity: 0.75
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: 'rgba(var(--color-accent-base-mask-rgb), 0.15)',
        width: '9px',
        opacity: 0.2
      }
    }
  },
  data () {
    return {
      dataField: this.field,
      btnMenuTypeValuesTitle: 'Выбрать тип значения'
    }
  },
  computed: {
    currentTypeValue () {
      return this.dataField?.typeValue || ''
    },
    typeValues () {
      return (
        this.dataField?.typeValues?.split(';').filter(element => element) || []
      )
    }
  },
  methods: {
    getTypeValueDescription (typeValue) {
      let result = typeValue
      const parts = typeValue.split('.').filter(element => element) || []
      for (let i = 0; i < parts.length; i++) {
        if (i === 0) {
          result = ''
          result += this.convertToSentence(parts[i])
        } else {
          result += ' "' + this.convertToSentence(parts[i]) + '"'
        }
      }
      return result
    },
    handleChangeBaseField (field) {
      this.dataField = field
      //console.log('handleChangeBaseField - field:' + JSON.stringify(this.dataField, null, ' ')) // TODO?
      this.$emit('changeBaseField', this.dataField)
    },
    handleChangeTypeValue (typeValue) {
      this.dataField.typeValue = typeValue
      if (typeValue.includes('.')) {
        this.dataField.type = 'datalist'
      } else if (typeValue === 'Строка') {
        this.dataField.type = 'text'
      } else if (typeValue === 'Число') {
        this.dataField.type = 'number'
      } else if (typeValue === 'Дата') {
        this.dataField.type = 'date'
      } else if (typeValue === 'Булево') {
        this.dataField.type = 'select'
      } else if (typeValue === 'Перечисление') {
        this.dataField.type = 'select'
      } else if (typeValue === 'НавигационнаяСсылка') {
        this.dataField.type = 'datalist'
      } else {
        this.dataField.type = 'text'
      }
    }
  }
}
</script>
