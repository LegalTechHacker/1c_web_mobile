<template>
  <div v-if="field.type" :class="classesFild" :title="field.description">
    <!--<div v-if="field.type === 'checkbox'" class="tw-block tw-mb-6">-->
    <div
      v-if="field.type === 'checkbox'"
      class="tw-block"
      :class="isTD ? '' : 'tw-p-2 tw-my-2'"
    >
      <template v-if="field.values.length">
        <span :class="classesTitle">{{ field.title + ': ' }}</span>
        <div class="tw-m-auto">
          <!--class="tw-mt-1.5 tw-flex tw-items-start"-->
          <div
            v-for="(item, index) in field.values"
            :key="'key_' + index + '_' + field.id"
            class="tw-flex tw-items-start"
            :class="isTD ? '' : 'tw-mt-1.5'"
          >
            <!--class="tw-form-checkbox tw-h-6.5 tw-w-6.5 tw-border tw-border-skin-secondary-border tw-text-lg tw-leading-lg tw-font-normal tw-text-skin-primary-text"-->
            <input
              class="tw-form-checkbox tw-h-6.5 tw-w-6.5 tw-border tw-border-skin-secondary-border tw-font-normal tw-text-skin-primary-text"
              :class="classes"
              :type="field.type"
              :id="'id_' + index + '_' + field.id"
              :name="'name_' + index + '_' + field.id"
              :value="item.value"
              v-model="fieldValue"
              @input="inputHandlerValue"
              @change="changeHandlerValue"
              :visible="visible ? field.visible : false"
              :disabled="!disabled ? field.disabled : true"
              :required="visible && !disabled ? field.required : false"
            />
            <label class="tw-flex" :for="'id_' + index + '_' + field.id">
              <!--<span class="tw-ml-1.5 tw-text-lg tw-leading-lg tw-font-normal">-->
              <span class="tw-ml-1.5 tw-font-normal">
                {{ item.title }}
              </span>
            </label>
          </div>
        </div>
      </template>

      <template v-else>
        <!--<div class="tw-mt-6 tw-mb-6">-->
        <div :class="isTD ? '' : 'tw-mt-6 tw-p-2 tw-my-2'">
          <!--<div class="tw-mt-1.5 tw-flex tw-items-start">-->
          <div class="tw-flex tw-items-start" :class="isTD ? '' : 'tw-mt-1.5'">
            <!--class="tw-form-checkbox tw-h-6.5 tw-w-6.5 tw-border tw-border-skin-secondary-border tw-text-lg tw-leading-lg tw-font-normal tw-text-skin-primary-text"-->
            <input
              class="tw-form-checkbox tw-h-6.5 tw-w-6.5 tw-border tw-border-skin-secondary-border tw-font-normal tw-text-skin-primary-text"
              :class="classes"
              :type="field.type"
              :id="'id_' + field.id"
              :name="'name_' + field.id"
              :value="field.value"
              v-model="field_value"
              @input="inputHandler"
              @change="changeHandler"
              :visible="visible ? field.visible : false"
              :disabled="!disabled ? field.disabled : true"
              :required="visible && !disabled ? field.required : false"
            />
            <label class="tw-flex" :for="'id_' + field.id">
              <!--class="tw-ml-1.5 tw-text-lg tw-leading-lg tw-font-normal"-->
              <span class="tw-ml-1.5 tw-font-normal" :class="classes">{{
                field.title
              }}</span>
            </label>
          </div>
        </div>
      </template>
    </div>

    <!--<div v-else-if="field.type === 'radio'" class="tw-block tw-mb-6">-->
    <div
      v-else-if="field.type === 'radio'"
      class="tw-block"
      :class="isTD ? '' : 'tw-p-2 tw-my-2'"
    >
      <span :class="classesTitle">{{ field.title + ': ' }}</span>
      <div class="tw-m-auto">
        <!--class="tw-mt-1.5 tw-flex tw-items-start"-->
        <div
          v-for="(item, index) in field.values"
          :key="'key_' + index + '_' + field.id"
          class="tw-flex tw-items-start"
          :class="isTD ? '' : 'tw-mt-1.5'"
        >
          <!--class="tw-form-radio tw-h-6.5 tw-w-6.5 tw-rounded-full tw-border tw-border-skin-secondary-border tw-text-lg tw-leading-lg tw-font-normal tw-text-skin-primary-text"-->
          <input
            class="tw-form-radio tw-h-6.5 tw-w-6.5 tw-rounded-full tw-border tw-border-skin-secondary-border tw-font-normal tw-text-skin-primary-text"
            :class="classes"
            :type="field.type"
            :id="'id_' + index + '_' + field.id"
            :name="'name_' + field.id"
            :value="item.value"
            v-model="field_value"
            @input="inputHandler"
            @change="changeHandler"
            :visible="visible ? field.visible : false"
            :disabled="!disabled ? field.disabled : true"
            :required="visible && !disabled ? field.required : false"
          />
          <label class="tw-flex" :for="'id_' + index + '_' + field.id">
            <!--<span class="tw-ml-1.5 tw-text-lg tw-leading-lg tw-font-normal">-->
            <span class="tw-ml-1.5 tw-font-normal"> {{ item.title }}</span>
          </label>
        </div>
      </div>
    </div>

    <!--<div v-else class="tw-block tw-mb-6">-->
    <div v-else class="tw-block" :class="isTD ? classesMB2 : 'tw-p-2 tw-my-2'">
      <label
        v-if="withLabel"
        class="tw-flex ur-scroll"
        :class="classesMB2"
        :for="'id_' + field.id"
      >
        <span :class="classesTitle">{{ field.title + ': ' }}</span>
      </label>

      <!--<div class="tw-mt-1.5">-->
      <div :class="isTD ? '' : 'tw-mt-1.5'">
        <template v-if="field.type === 'textarea'">
          <textarea
            class="tw-form-input"
            :class="classesInput"
            :id="'id_' + field.id"
            :name="'name_' + field.id"
            :placeholder="field.description || field.title"
            v-model.lazy="field_value"
            @input="inputHandler"
            @change="changeHandler"
            :visible="visible ? field.visible : false"
            :disabled="!disabled ? field.disabled : true"
            :required="visible && !disabled ? field.required : false"
          />
        </template>

        <template v-else-if="field.type === 'number'">
          <input
            class="tw-form-input"
            :class="classesInput"
            :type="field.type"
            :id="'id_' + field.id"
            :name="'name_' + field.id"
            :placeholder="field.description || field.title"
            v-model.number="field_value"
            @input="inputHandler"
            @change="changeHandler"
            :visible="visible ? field.visible : false"
            :disabled="!disabled ? field.disabled : true"
            :required="visible && !disabled ? field.required : false"
          />
        </template>

        <template v-else-if="field.type === 'date'">
          <input
            class="tw-form-input"
            :class="classesInput"
            :type="field.type"
            :id="'id_' + field.id"
            :name="'name_' + field.id"
            v-model="field_value"
            @input="inputHandler"
            @change="changeHandler"
            :visible="visible ? field.visible : false"
            :disabled="!disabled ? field.disabled : true"
            :required="visible && !disabled ? field.required : false"
          />
        </template>

        <template v-else-if="field.type === 'select'">
          <select
            class="tw-form-select"
            :class="classesInput"
            :id="'id_' + field.id"
            :name="'name_' + field.id"
            v-model="field_value"
            @input="inputHandler"
            @change="changeHandler"
            :visible="visible ? field.visible : false"
            :disabled="!disabled ? field.disabled : true"
            :required="visible && !disabled ? field.required : false"
          >
            <option
              v-for="item in field.values"
              :key="item.title"
              :value="item.value"
            >
              {{ item.title }}
            </option>
          </select>
        </template>

        <template v-else-if="field.type === 'datalist'">
          <BaseFieldDatalist
            :classesInput="classesInputDataList"
            :field="field"
            :visible="visible"
            :disabled="disabled"
            :edited="edited"
            @changeBaseFieldDatalist="handleChangeBaseFieldDatalist($event)"
          />
        </template>

        <template v-else>
          <input
            class="tw-form-input"
            :class="classesInput"
            :type="field.type"
            :id="'id_' + field.id"
            :name="'name_' + field.id"
            :placeholder="field.description || field.title"
            v-model.lazy="field_value"
            @input="inputHandler"
            @change="changeHandler"
            :visible="visible ? field.visible : false"
            :disabled="!disabled ? field.disabled : true"
            :required="visible && !disabled ? field.required : false"
          />
        </template>
      </div>
    </div>
  </div>
  <div v-else class="ur-td tw-flex" :title="withTitle ? presentation : ''">
    {{
      withTitle ? presentation?.split(' (')[0] || presentation : presentation
    }}
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'BaseField',
  components: {
    BaseFieldDatalist: require('src/components/BaseFieldDatalist.vue').default
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
  data () {
    return {
      fieldValue: this.field.value,
      field_value: this.field.value, //TODO
      field_edited: this.field.edited //TODO
    }
  },
  methods: {
    //...mapActions(['btnGetDocumentEnable', 'whenChangingAnswerQuestion']),
    inputHandlerValue: function () {
      this.field_edited = true
      this.field_value = this.fieldValue
    },
    changeHandlerValue: _.debounce(function () {
      this.field_edited = false
      this.field_value = this.fieldValue

      //console.log('1BaseField edited:' + this.edited)
      //console.log('1changeBaseField changeHandlerValue:' + JSON.stringify({ ...this.field, value: this.field_value }, null, ' '))
      this.$emit('changeBaseField', { ...this.field, value: this.field_value })

      // TODO
      /*
      if (this.btnGetDocumentDisabled) {
        this.btnGetDocumentEnable()
      }
      this.whenChangingAnswerQuestion(this.field)
      */
    }, 250),
    inputHandler: function (event) {
      this.field_edited = true
      this.field_value = event.target.value
    },
    changeHandler: _.debounce(function (event) {
      this.field_edited = false
      this.field_value = event.target.value

      //console.log('2BaseField edited:' + this.edited)
      //console.log('2changeBaseField changeHandler:' + JSON.stringify({ ...this.field, value: this.field_value }, null, ' '))
      this.$emit('changeBaseField', { ...this.field, value: this.field_value })

      // TODO
      /*
      if (this.btnGetDocumentDisabled) {
        this.btnGetDocumentEnable()
      }
      this.whenChangingAnswerQuestion(this.field)
      */
    }, 250),
    handleChangeBaseFieldDatalist (fieldValue) {
      this.field_value = fieldValue?.value
      //console.log('3handleChangeBaseFieldDatalist:' + JSON.stringify(this.field_value))
      //console.log('3changeBaseField handleChangeBaseFieldDatalist:' + JSON.stringify({ ...this.field, value: this.field_value }, null, ' '))
      this.$emit('changeBaseField', { ...this.field, value: this.field_value })
    }
  },
  computed: {
    //...mapGetters(['btnGetDocumentDisabled']),
    classesFild () {
      const classesAll = [
        this.field.id,
        this.visible ? (this.field.visible ? '' : 'tw-hidden') : 'tw-hidden',
        this.isTD ? 'ur-td' : '',
        'tw-w-full'
      ]
      const classesSkin = []
      const classesDisabled = [
        'tw-text-black'
        //'tw-text-opacity-25'
      ]
      return !this.disabled
        ? this.field.disabled
          ? [...classesAll, ...classesDisabled]
          : [...classesAll, ...classesSkin]
        : [...classesAll, ...classesDisabled]
    },
    classes () {
      const classesAll = [
        'focus:tw-outline-none',
        this.visible ? (this.field.visible ? '' : 'tw-hidden') : 'tw-hidden'
      ]
      const classesSkin = [
        'focus:tw-border-skin-primary-border',
        'focus:tw-shadow-skin-secondary-accent-shadow'
      ]
      const classesDisabled = [
        'tw-text-black',
        //'tw-text-opacity-25',
        'focus:tw-border-none',
        'focus:tw-shadow-none'
      ]
      return !this.disabled
        ? this.field.disabled
          ? [...classesAll, ...classesDisabled]
          : [...classesAll, ...classesSkin]
        : [...classesAll, ...classesDisabled]
    },
    classesTitle () {
      return [
        //'tw-text-skin-secondary-text',
        'tw-text-xb',
        'tw-leading-xb',
        'tw-font-normal tw-w-full'
      ]
    },
    classesInput () {
      return [
        ...this.classes,
        //'tw-px-3.5',
        'tw-px-4',
        'tw-py-2', // TODO
        'tw-leading-4', // TODO
        //'tw-py-3',
        'tw-block',
        'tw-w-full',
        //'tw-rounded',
        'tw-rounded-xl',
        'tw-border',
        'tw-border-skin-secondary-border',
        'tw-shadow-skin-secondary-shadow',
        //'tw-text-lg',
        //'tw-leading-lg',
        'tw-font-normal',
        'tw-text-skin-base-text',
        //'tw-my-1.5',
        'tw-placeholder-skin-base-placeholder'
      ]
    },
    classesInputDataList () {
      return [
        ...this.classes,
        'tw-pl-4',
        'tw-pr-10',
        'tw-py-2',
        'tw-leading-4',
        'tw-block',
        'tw-w-full',
        'tw-rounded-xl',
        'tw-border',
        'tw-border-skin-secondary-border',
        'tw-shadow-skin-secondary-shadow',
        'tw-font-normal',
        'tw-text-skin-base-text',
        'tw-placeholder-skin-base-placeholder'
      ]
    },
    classesMB2 () {
      return this.isMobile && this.withLabel ? 'tw-mb-2' : ''
    }
  }
}
</script>
