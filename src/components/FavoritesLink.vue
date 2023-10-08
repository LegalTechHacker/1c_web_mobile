<template>
  <div>
    <q-item v-if="parent === 'favorites'">
      <q-item-section>
        <div class="row q-gutter-md">
          <q-card
            class="my-card tw-flex tw-justify-between tw-items-center tw-w-full tw-rounded-2xl tw-shadow-sm hover:tw-shadow-md"
          >
            <q-card-section horizontal class="tw-p-2">
              <q-item-label caption>
                <a
                  :href="getFavoriteURL(title)"
                  target="_blank"
                  rel="noreferrer"
                >
                  {{ caption }}
                </a>
              </q-item-label>
            </q-card-section>
            <q-card-actions vertical class="justify-around">
              <q-btn
                flat
                round
                dense
                :size="'0.75rem'"
                :icon="'icon-mat-close'"
                :aria-label="btnDeleteTitle"
                :title="btnDeleteTitle"
                @click="$emit('deleteItem')"
              />
            </q-card-actions>
          </q-card>
        </div>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'FavoritesLink',
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
      btnDeleteTitle: 'Удалить'
    }
  },
  computed: {
    ...mapGetters('appstore', ['baseURL'])
  },
  methods: {
    getFavoriteURL (url) {
      if (url?.indexOf('e1cib/data/') !== -1) {
        return '' + url?.replace('e1cib/data/', '?url=[e1cib/data/') + ']'
      } else if (url?.indexOf('e1cib/app/Отчет.') !== -1) {
        return (
          '' + url?.replace('e1cib/app/Отчет.', '?url=[e1cib/app/Отчет.') + ']'
        )
      } else {
        return '' + this.baseURL + '#' + url
      }
    }
  }
}
</script>
