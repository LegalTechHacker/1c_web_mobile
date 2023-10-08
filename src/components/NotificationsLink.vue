<template>
  <div>
    <q-item v-if="parent === 'notifications'">
      <q-item-section>
        <div class="row q-gutter-md">
          <q-card
            class="my-card tw-w-full tw-rounded-2xl tw-shadow-sm hover:tw-shadow-md"
          >
            <q-card-section class="tw-p-0 tw-pt-2">
              <q-item>
                <q-item-section avatar>
                  <q-avatar
                    color="ur-bg-accent-50"
                    text-color="ur-text-accent-200"
                  >
                    {{ '' + title.charAt(0).toUpperCase() }}
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ title }} </q-item-label>
                  <q-item-label caption>{{
                    getDateFormat(data?.dateEvent)
                  }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <div class="text-subtitle2">{{ caption }}</div>
                </q-item-section>
              </q-item>
            </q-card-section>

            <q-card-actions>
              <q-btn
                class="ur-btn tw-rounded-xl tw-px-2"
                flat
                color="positive"
                :aria-label="btnPositiveTitle"
                :label="btnPositiveTitle"
                @click="$emit('doneItem')"
              />
              <q-btn
                class="ur-btn tw-rounded-xl tw-px-2"
                flat
                color="negative"
                :aria-label="btnNegativeTitle"
                :label="btnNegativeTitle"
                @click="$emit('deleteItem')"
              />

              <q-space />

              <q-btn
                v-if="data?.source?.Description"
                color="grey"
                flat
                round
                dense
                :icon="
                  expanded
                    ? 'icon-mat-keyboard_arrow_up'
                    : 'icon-mat-keyboard_arrow_down'
                "
                @click="expanded = !expanded"
              />
            </q-card-actions>
            <div v-if="data?.source?.Description">
              <q-slide-transition>
                <div v-show="expanded">
                  <q-separator />
                  <q-card-section class="tw-px-0">
                    <q-item v-if="data?.source?.url">
                      <q-item-section>
                        <q-item-label>
                          {{ textSource + ':' }}
                        </q-item-label>
                        <q-item-label caption>
                          <a
                            :href="getNotificationURL(data?.source?.url)"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {{ data?.source?.Description }}
                          </a>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-card-section>
                </div>
              </q-slide-transition>
            </div>
          </q-card>
        </div>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NotificationsLink',
  props: {
    parent: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: '',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: undefined
    }
  },
  data () {
    return {
      expanded: false,
      textSource: 'Источник',
      btnPositiveTitle: 'Закрыть',
      btnNegativeTitle: 'Удалить'
    }
  },
  computed: {
    ...mapGetters('appstore', ['baseURL'])
  },
  methods: {
    getNotificationURL (url) {
      if (url?.indexOf('e1cib/data/') !== -1) {
        return '' + url?.replace('e1cib/data/', '?url=[e1cib/data/') + ']'
      } else {
        return '' + this.baseURL + '#' + url
      }
    }
  }
}
</script>
