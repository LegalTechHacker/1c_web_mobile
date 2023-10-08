<template>
  <div>
    <q-item
      exact
      clickable
      :active="link === currentObjectURL"
      @click="clickHandlerItem(link)"
    >
      <q-item-section avatar>
        <q-avatar icon="icon-mat-description" />
      </q-item-section>

      <q-item-section>
        <q-item-label :title="caption">{{ title }}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ODataLink',
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
    },
    children: { type: Array, default: () => [] },
    link: {
      type: String,
      default: '#/'
    }
  },
  computed: {
    ...mapGetters('appstore', ['currentObjectURL', 'showTR'])
  },
  methods: {
    ...mapActions('appstore', [
      'setCurrentObjectDataTables',
      'setCurrentObjectURL',
      'setCloseTR'
    ]),
    clickHandlerItem (link) {
      if (this.parent !== 'notifications') {
        if (this.showTR) {
          this.setCloseTR()
        }
        this.setCurrentObjectDataTables(this.children)
        this.setCurrentObjectURL(link.replace('#/', ''))
      }
    }
  }
}
</script>
