<template>
  <div class="tw-flex tw-items-center">
    <input
      class="tw-form-input"
      :class="classesInput"
      type="text"
      :list="'list_' + field.id"
      :id="'id_' + field.id"
      :name="'name_' + field.id"
      :placeholder="field.description || field.title"
      v-model="item_Description"
      @input="inputHandler"
      :visible="visible ? field.visible : false"
      :disabled="!disabled ? field.disabled : true"
      :required="visible && !disabled ? field.required : false"
    />
    <div v-if="isLoading">
      <svg
        class="tw-animate-spin tw-h-5 tw-w-5 tw-min-h-5 tw-min-w-5 tw--ml-8.5 tw-text-gray-400 tw-bg-white tw-rounded-full tw-relative"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <div
      v-else
      :aria-label="btnUpdateListDataTitle"
      :title="btnUpdateListDataTitle"
      :disabled="disabled"
      @click="updateListData"
    >
      <svg
        :class="classesSVG"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <datalist class="tw-hidden" :id="'list_' + field.id">
      <option
        v-for="item in items"
        :key="item.Ref_Key"
        :id="item.Ref_Key"
        :value="item.Description"
      />
    </datalist>
  </div>
</template>

<script>
import _ from 'lodash'
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'BaseFieldDatalist',
  props: {
    classesInput: { type: String, default: '' },
    field: { type: Object, default: () => {} },
    visible: { type: Boolean, default: true },
    disabled: { type: Boolean, default: true },
    edited: { type: Boolean, default: false } //TODO
  },
  data () {
    return {
      item: this.field.value || {
        Ref_Key: '',
        Description: ''
      },
      item_Description: this.field.value.Description || '',
      items: [],
      isLoading: false,
      isChanges: false,
      field_value: this.field.value, //TODO
      field_edited: this.field.edited, //TODO
      btnUpdateListDataTitle: 'Обновить список выбора'
    }
  },
  created () {
    //this.getListData(this.field.typeValue, this.item_Description)
  },
  computed: {
    //...mapGetters(['btnGetDocumentDisabled']),
    classesSVG () {
      return [
        'tw-h-5',
        'tw-w-5',
        'tw-min-h-5',
        'tw-min-w-5',
        'tw--ml-8.5',
        'tw-cursor-pointer',
        'tw-bg-white',
        'tw-rounded-full',
        'tw-relative',
        this.isChanges
          ? 'tw-text-gray-400 hover:tw-text-gray-500'
          : 'tw-text-skin-primary-text'
      ]
    }
  },
  watch: {
    item_Description () {
      // TODO
      /*
      if (this.btnGetDocumentDisabled) {
        this.btnGetDocumentEnable()
      }
      */
      this.$emit('input', this.item)

      this.getListData(this.field.typeValue, this.item_Description)
      this.changeHandler()
      this.isChanges = false
    }
  },
  methods: {
    ...mapActions(['isAuthenticated', 'token']),
    //'btnGetDocumentEnable', //'whenChangingAnswerQuestion' // TODO
    async getListData (typeValue, search) {
      if (this.isAuthenticated) {
        this.isLoading = true
        const url = 'app/query'
        let headers = '' // TODO
        if (this.token) {
          headers = {
            Authorization: 'Basic ' + this.token
          }
        }
        const payload = {
          type: 'query',
          data: {
            type: 'getValuesFromBase',
            data: {
              typeValue: typeValue,
              search: search,
              limit: 10
            }
          }
        }
        await axios
          .post(
            url,
            {
              payload: btoa(
                unescape(encodeURIComponent(JSON.stringify(payload)))
              )
            },
            headers
          )
          .then(response => {
            try {
              this.items = response.data.value
            } catch (error) {
              console.log(error.message)
            }
          })
          .catch(error => {
            console.log(error.message)
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    },
    updateListData () {
      if (!this.disabled) {
        this.getListData(this.field.typeValue, this.item_Description)
      }
    },
    inputHandler: _.debounce(function (event) {
      this.field_edited = true
      this.isChanges = this.item_Description !== event.target.value
      this.item_Description = event.target.value
    }, 250),
    changeHandler: function () {
      this.field_edited = false
      let currentValue = this.item_Description
      let selectedItems = this.items.filter(
        currentItem => currentItem.Description == currentValue
      )
      if (selectedItems.length == 1) {
        this.item = selectedItems[0]
      } else {
        this.item = {
          Ref_Key: '',
          Description: ''
        }
      }
      this.field_value = this.item
      if (this.item?.Description) {
        this.$emit('changeBaseFieldDatalist', {
          ...this.field,
          value: this.field_value
        })
        //console.log(JSON.stringify(this.field)) // TODO
        // TODO
        //this.whenChangingAnswerQuestion(this.field)
      }
    }
  }
}
</script>
