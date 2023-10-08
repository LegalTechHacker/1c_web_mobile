<template>
  <div class="tw-p-2">
    <div class="tw-my-2">
      <div class="text-subtitle2" :title="convertToSentence(field)">
        {{ convertToSentence(field) }}
      </div>
    </div>
    <div class="tw-my-2">
      <template v-if="value">
        <template
          v-if="
            value?.indexOf('href=') !== -1 &&
            value?.indexOf('detail-app') !== -1
          "
        >
          <label
            class="q-field q-validation-component row no-wrap items-start tw-font-semibold tw-rounded-2xl tw-px-4 tw-shadow-md tw-bg-gray-200 q-input q-field--borderless q-field--float q-field--dense q-field--readonly"
          >
            <div class="q-field__inner relative-position col self-stretch">
              <div class="q-field__control relative-position row no-wrap">
                <div
                  class="q-field__prepend q-field__marginal row no-wrap items-center"
                >
                  <q-icon
                    name="icon-mat-info"
                    :title="value?.split('>')[1]?.split('<')[0]"
                  />
                </div>
                <div
                  class="ur-field"
                  v-html="
                    value
                      .replace('#', '?url=[')
                      .replace('\u0027 target=', ']\u0027 target=')
                  "
                ></div>
              </div>
            </div>
          </label>
        </template>
        <template
          v-else-if="
            value?.indexOf('href=') !== -1 && value?.indexOf('detail-1C') !== -1
          "
        >
          <label
            class="q-field q-validation-component row no-wrap items-start tw-font-semibold tw-rounded-2xl tw-px-4 tw-shadow-md tw-bg-gray-200 q-input q-field--borderless q-field--float q-field--dense q-field--readonly"
          >
            <div class="q-field__inner relative-position col self-stretch">
              <div class="q-field__control relative-position row no-wrap">
                <div
                  class="q-field__prepend q-field__marginal row no-wrap items-center"
                >
                  <q-icon
                    name="icon-mat-info"
                    :title="value?.split('>')[1]?.split('<')[0]"
                  />
                </div>
                <div
                  class="ur-field"
                  v-html="value?.replace('#', baseURL + '#')"
                ></div>
              </div>
            </div>
          </label>
        </template>
        <template
          v-else-if="value?.trim()?.slice(0, 4)?.indexOf('http') !== -1"
        >
          <label
            class="q-field q-validation-component row no-wrap items-start tw-font-semibold tw-rounded-2xl tw-px-4 tw-shadow-md tw-bg-gray-200 q-input q-field--borderless q-field--float q-field--dense q-field--readonly"
          >
            <div class="q-field__inner relative-position col self-stretch">
              <div class="q-field__control relative-position row no-wrap">
                <div
                  class="q-field__prepend q-field__marginal row no-wrap items-center"
                >
                  <q-icon name="icon-mat-info" :title="value" />
                </div>
                <div
                  class="ur-field"
                  v-html="
                    `<a href='` +
                    value +
                    `' target='_blank' rel='noopener noreferrer' class='detail detail-web'>` +
                    value +
                    `</a>`
                  "
                ></div>
              </div>
            </div>
          </label>
        </template>
        <template v-else-if="value?.indexOf('<code>') !== -1">
          <label
            class="q-field q-validation-component row no-wrap items-start tw-rounded-2xl tw-px-4 tw-shadow-md tw-bg-gray-200 q-input q-field--borderless q-field--float q-field--dense q-field--readonly"
          >
            <div class="q-field__inner relative-position col self-stretch">
              <div class="q-field__control relative-position row no-wrap">
                <div
                  class="q-field__prepend q-field__marginal row no-wrap items-center"
                >
                  <q-icon
                    name="icon-mat-info"
                    :title="value?.split('<code>')[1]?.split('</code>')[0]"
                  />
                </div>
                <div class="ur-field" v-html="value"></div>
              </div>
            </div>
          </label>
        </template>
        <template v-else>
          <q-input
            :placeholder="emptyValue"
            type="text"
            borderless
            dense
            readonly
            v-model="val"
            tabindex="0"
            class="tw-rounded-2xl tw-px-4 tw-shadow-md tw-bg-gray-200"
          >
            <template v-slot:prepend>
              <q-icon name="icon-mat-info" :title="value" />
            </template>
          </q-input>
        </template>
      </template>
      <template v-else>
        <q-input
          :placeholder="emptyValue"
          type="text"
          borderless
          dense
          readonly
          v-model="val"
          tabindex="0"
          class="tw-rounded-2xl tw-px-4 tw-shadow-md tw-bg-gray-200"
        >
          <template v-slot:prepend>
            <q-icon name="icon-mat-info" :title="value" />
          </template>
        </q-input>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BaseFieldReadonly',
  props: {
    field: { type: String, default: '' },
    value: { type: String, default: '' }
  },
  data () {
    return {
      val: this.value,
      emptyValue: '<Нет данных>'
    }
  },
  computed: { ...mapGetters('appstore', ['baseURL']) }
}
</script>
