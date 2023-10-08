<template>
  <q-list>
    <q-item>
      <q-item-section avatar>
        <div class="q-mx-sm">
          <q-btn
            flat
            round
            icon="icon-mat-notifications"
            :aria-label="titleNotifications"
            :title="titleNotifications"
            @click="$emit('rightDrawerOpenNotificationsToggle')"
          >
            <q-badge
              v-if="notifications.length"
              floating
              rounded
              color="red-4"
              class="tw-mt-2"
            >
              {{ notifications.length }}
            </q-badge>
          </q-btn>
        </div>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ titleNotifications }}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <div class="q-mx-sm">
          <q-btn
            flat
            round
            icon="icon-mat-refresh"
            :aria-label="btnRefreshTitle"
            :title="btnRefreshTitle"
            @click="btnHandleClickRefresh"
          />
        </div>
      </q-item-section>
    </q-item>

    <q-separator />

    <q-scroll-area
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      style="height: calc(100vh - 60px)"
      id="scroll-area-notifications"
    >
      <q-virtual-scroll
        scroll-target="scroll-area-notifications"
        :items="notifications"
      >
        <template v-slot="{ item, index }">
          <NotificationsLink
            :key="index"
            v-bind="item"
            parent="notifications"
            @doneItem="doneItemFromNotifications(item.id)"
            @deleteItem="btnHandleClickDeleteNotification(item)"
          />
        </template>
      </q-virtual-scroll>
    </q-scroll-area>
  </q-list>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'TheNotificationsList',
  components: {
    NotificationsLink: require('src/components/NotificationsLink.vue').default
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
      timeout: null,
      titleNotifications: 'Оповещения',
      btnRefreshTitle: 'Обновить'
    }
  },
  computed: {
    ...mapGetters('appstore', [
      'isAuthenticated',
      'token',
      'useOData',
      'notifications'
    ])
  },
  created () {
    if (this.isAuthenticated && !this.useOData) {
      this.refreshNotificationsFrom1C()
    }
  },
  destroyed () {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  },
  methods: {
    ...mapActions('appstore', [
      'getNotificationsFrom1C',
      'sortNotifications',
      'addItemFromNotifications',
      'doneItemFromNotifications',
      'deleteItemFromNotifications'
    ]),
    refreshNotificationsFrom1C () {
      if (this.isAuthenticated && !this.useOData) {
        this.btnHandleClickRefresh()
        this.timeout = setTimeout(() => {
          this.refreshNotificationsFrom1C()
        }, 1000 * 60 * 5)
      } else {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
      }
    },
    handleRefreshNotificationsFrom1C () {
      if (this.isAuthenticated && !this.useOData) {
        const notificationsLength = this.notifications.length
        this.getNotificationsFrom1C({
          token: this.token,
          loading: false,
          notificationsLength: notificationsLength,
          useSound: true
        }).then(() => {
          try {
            if (this.notifications.length > notificationsLength) {
              setTimeout(() => {
                this.$q.notify({
                  progress: true,
                  icon: 'icon-mat-notifications_active',
                  color: 'ur-bg-accent',
                  textColor: 'white',
                  position: 'bottom-right',
                  message: 'Есть новые уведомления.'
                })
              }, 2000)
            }
          } catch (error) {
            console.log(error.message)
          }
        })
      }
    },
    btnHandleClickRefresh () {
      if (this.isAuthenticated && !this.useOData) {
        this.handleRefreshNotificationsFrom1C()
      }
    },
    btnHandleClickDeleteNotification (item) {
      if (this.isAuthenticated && !this.useOData) {
        this.deleteItemFromNotifications({
          token: this.token,
          loading: false,
          notification: item
        })
      }
    }
  }
}
</script>
