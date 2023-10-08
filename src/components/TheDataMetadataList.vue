<template>
  <q-list>
    <q-item>
      <q-item-section avatar>
        <q-avatar
          size="64px"
          color="ur-bg-accent-50"
          text-color="ur-text-accent-200"
        >
          {{ '' + me?.user?.Description?.charAt(0).toUpperCase() }}
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label :title="me?.userIB?.name"
          >{{ me?.user?.Description }}
        </q-item-label>
        <!--<q-item-label caption>{{ me?.userIB?.name }}</q-item-label>-->
      </q-item-section>
    </q-item>

    <q-separator />

    <q-item>
      <q-item-section>
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
          class="tw-rounded-2xl tw-px-4 tw-shadow-md tw-bg-gray-200 hover:tw-bg-gray-100"
        >
          <template v-slot:prepend>
            <q-icon name="icon-mat-search" />
          </template>
          <template v-if="!filter" v-slot:append>
            <q-icon name="" />
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <TheDataMetadataMenu :data="filteredListDataMetadata" />
    <div class="ur-eil"></div>
  </q-list>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'TheDataMetadataList',
  components: {
    TheDataMetadataMenu: require('src/components/TheDataMetadataMenu.vue')
      .default
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
      filter: ''
    }
  },
  mounted () {
    this.setListDataMetadata({
      token: this.token,
      loading: false
    })
  },

  computed: {
    ...mapGetters('appstore', ['me', 'token', 'listDataMetadata']),
    filteredListDataMetadata () {
      if (this.filter) {
        return this.filterObjectTreeByTitle(this.listDataMetadata, this.filter)
      } else {
        return this.listDataMetadata
      }
    }
  },
  methods: {
    ...mapActions('appstore', ['setListDataMetadata'])
  }
}
</script>
