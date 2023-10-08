<template>
  <div>
    <template v-if="children?.length">
      <q-expansion-item :key="data?.id" v-model="expanded">
        <template v-slot:header="{ expanded }">
          <q-item-section avatar class="ur-img-icon">
            <template v-if="expanded">
              <q-img
                v-if="data?.iconExpanded?.includes('/')"
                class="q-icon"
                :src="
                  getIconData(data?.iconExpanded, defaultIcon + '_open')?.src
                "
              />
              <q-icon
                v-else
                :name="
                  getIconData(data?.iconExpanded, defaultIcon + '_open')?.name
                "
              />
            </template>
            <template v-else>
              <q-img
                v-if="data?.icon?.includes('/')"
                class="q-icon"
                :src="getIconData(data?.icon, defaultIcon)?.src"
              />
              <q-icon
                v-else
                :name="getIconData(data?.icon, defaultIcon)?.name"
              />
            </template>
          </q-item-section>
          <q-item-section>
            <q-item-label
              >{{ data?.title }} ({{ data?.children?.length }})
            </q-item-label>
          </q-item-section>
        </template>
        <q-scroll-area
          :thumb-style="thumbStyle"
          :bar-style="barStyle"
          :style="scrollAreaStyle"
          :id="`scroll-area-${data?.id}`"
          :data-count="expanded ? data?.children?.length : 1"
        >
          <q-virtual-scroll
            :scroll-target="`scroll-area-${data?.id}`"
            :items="data?.children"
          >
            <template v-slot="{ item }">
              <TheDataMetadataMenuItem
                :key="item?.id"
                v-bind="item"
                :data="item"
                :children="item?.children"
                :parent="data?.title"
                :icon="item?.icon"
                :class="item?.children?.length ? '' : 'ur-expansion-item'"
              />
            </template>
          </q-virtual-scroll>
        </q-scroll-area>
      </q-expansion-item>
    </template>
    <template v-else>
      <q-item
        exact
        clickable
        :active="isActive(link)"
        @click="clickHandlerItem(link)"
      >
        <q-item-section avatar class="ur-img-icon">
          <q-avatar v-if="icon?.includes('/')">
            <q-img class="q-icon" :src="getIconData(icon, defaultIcon)?.src" />
          </q-avatar>
          <q-icon v-else :name="getIconData(icon, defaultIcon)?.name" />
        </q-item-section>
        <q-item-section>
          <q-item-label :title="caption">{{ title }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TheDataMetadataMenuItem',
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
    data: { type: Object, default: undefined },
    children: { type: Array, default: () => [] },
    link: {
      type: String,
      default: '#/'
    },
    icon: { type: String, default: '' },
    type: { type: String, default: '' }
  },
  data () {
    return { expanded: false, scrollAreaStyle: this.getScrollAreaStyle() }
  },
  computed: {
    ...mapGetters('appstore', [
      'prevMenuItemType',
      'prevMenuItemID',
      'currentMenuItemType',
      'currentMenuItemID',
      'currentMenuItemURL',
      'currentObjectURL',
      'currentSearchObjectURL',
      'showTR'
    ]),
    defaultIcon () {
      if (this.children.length) {
        if (this.type === 'report' || this.children[0].type === 'report') {
          return 'folder_report'
        } else {
          return 'folder'
        }
      } else {
        if (this.type === 'report') {
          return 'report'
        } else {
          return 'description'
        }
      }
    }
  },
  watch: {
    expanded () {
      this.scrollAreaStyle = this.getScrollAreaStyle()
      this.$nextTick(() => {
        this.setHeightParentScrollArea()
      })
    }
  },
  methods: {
    ...mapActions('appstore', [
      'setPrevMenuItemType',
      'setPrevMenuItemID',
      'setCurrentMenuItemType',
      'setCurrentMenuItemID',
      'setCurrentMenuItemURL',
      'setCurrentObjectDataTables',
      'setCurrentObjectURL',
      'setCurrentReportURL',
      'setCloseTR'
    ]),
    calculateElementsHeight (count) {
      return (count || 0) * 60
    },
    getHeightScrollArea () {
      let count = 0
      if (this.expanded) {
        count = this.data?.children?.length
      } else {
        count = 1
      }
      return this.calculateElementsHeight(count)
    },
    getScrollAreaStyle () {
      return (
        'max-height: calc(100vh - 310px); min-height: 64px; height: ' +
        this.getHeightScrollArea() +
        'px;'
      )
    },
    setHeightParentScrollArea () {
      const elParent = document.getElementById(
        'scroll-area-' + this.data?.parentId
      )
      if (elParent) {
        let count = 0
        const elCount = elParent.querySelectorAll('div[data-count]')
        if (elCount) {
          elCount.forEach(item => {
            count += parseInt(item.dataset.count)
          })
        }
        //const elItem = elParent.querySelectorAll('.ur-expansion-item')
        //count += elItem.length
        elParent.style.height = this.calculateElementsHeight(count) + 'px'
      }
    },
    clickHandlerItem (link) {
      if (this.parent !== 'notifications') {
        this.setPrevMenuItemType(this.currentMenuItemType)
        this.setPrevMenuItemID(this.currentMenuItemID)
        this.setCurrentMenuItemType(this.type)
        this.setCurrentMenuItemID(this.id)
        this.setCurrentMenuItemURL(link)
        if (this.type === 'url') {
          this.openTargetURL(link)
        } else if (this.type === 'iframe') {
        } else if (this.type === 'report') {
          if (this.showTR) {
            this.setCloseTR()
          }
          this.setCurrentObjectDataTables(null)
          this.setCurrentObjectURL('')
          this.setCurrentReportURL(link.replace('#/', ''))
        } else {
          if (this.showTR) {
            this.setCloseTR()
          }
          this.setCurrentObjectDataTables(this.children) // TODO?
          this.setCurrentObjectURL(link.replace('#/', ''))
        }
      }
    },
    isActive (link) {
      return (
        this.currentMenuItemID === this.id &&
        this.currentMenuItemURL === link &&
        this.currentMenuItemURL !== ''
      )
    }
  }
}
</script>
