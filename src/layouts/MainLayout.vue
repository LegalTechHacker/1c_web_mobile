<template>
  <q-layout view="lhr lpr lfr">
    <q-header v-if="!isNested" reveal class="ur-header">
      <q-toolbar class="bg-white text-grey-10">
        <q-btn
          v-if="isAuthenticated"
          flat
          round
          dense
          icon="icon-mat-menu"
          :aria-label="titleMenu"
          :title="titleMenu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title> {{ titleToolbar }} </q-toolbar-title>
        <q-space />
        <div v-if="isAuthenticated && !useOData" class="q-mx-sm">
          <q-btn
            flat
            round
            icon="icon-mat-grade"
            :aria-label="titleFavorites"
            :title="titleFavorites"
            @click="rightDrawerOpenFavorites = !rightDrawerOpenFavorites"
          >
          </q-btn>
          <q-btn
            flat
            round
            icon="icon-mat-notifications"
            :aria-label="titleNotifications"
            :title="titleNotifications"
            @click="
              rightDrawerOpenNotifications = !rightDrawerOpenNotifications
            "
          >
            <q-badge
              v-if="notificationsLength"
              floating
              rounded
              color="red-4"
              class="tw-mt-2"
            >
              {{ notificationsLength }}
            </q-badge>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="isAuthenticated && !isNested"
      v-model="leftDrawerOpen"
      side="left"
      show-if-above
      bordered
      content-class="white"
      class="ur-left-drawer"
    >
      <TheODataMetadataList v-if="useOData" />
      <TheDataMetadataList v-if="!useOData" />
      <div class="ur-footer ur-sticky tw-sticky tw-bottom-0">
        <div class="ur-footer_wrapper">
          <div class="q-mx-sm">
            <!--<div class="ur-footer_title">{{ titleToolbar.toUpperCase() }}</div>-->
            <q-btn
              flat
              round
              icon="icon-mat-support"
              :aria-label="btnSupportTitle"
              :title="btnSupportTitle"
              @click="btnHandleClickSupport"
            />
          </div>
          <q-space />
          <div class="q-mx-sm">
            <q-btn
              v-if="isAuthenticated"
              flat
              round
              icon="icon-mat-logout"
              :aria-label="btnSignOutTitle"
              :title="btnSignOutTitle"
              @click="signOut(token)"
              to="/login"
            />
            <q-btn
              v-if="!isAuthenticated"
              flat
              round
              icon="icon-mat-login"
              :aria-label="btnSignInTitle"
              :title="btnSignInTitle"
              to="/login"
            />
          </div>
        </div>
      </div>
    </q-drawer>

    <q-drawer
      v-if="isAuthenticated && !isNested"
      v-model="rightDrawerOpenFavorites"
      side="right"
      behavior="mobile"
      overlay
      show-if-above
      bordered
      content-class="white"
      class="ur-right-drawer"
    >
      <TheFavoritesList
        v-if="!useOData"
        @rightDrawerOpenFavoritesToggle="
          rightDrawerOpenFavorites = !rightDrawerOpenFavorites
        "
      />
    </q-drawer>

    <q-drawer
      v-if="isAuthenticated && !isNested"
      v-model="rightDrawerOpenNotifications"
      side="right"
      behavior="mobile"
      overlay
      show-if-above
      bordered
      content-class="white"
      class="ur-right-drawer"
    >
      <TheNotificationsList
        v-if="!useOData"
        @rightDrawerOpenNotificationsToggle="
          rightDrawerOpenNotifications = !rightDrawerOpenNotifications
        "
      />
    </q-drawer>

    <q-page-container :class="classes">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'MainLayout',
  components: {
    TheODataMetadataList:
      require('src/components/components-odata/TheODataMetadataList.vue')
        .default,
    TheDataMetadataList: require('src/components/TheDataMetadataList.vue')
      .default,
    TheFavoritesList: require('src/components/TheFavoritesList.vue').default,
    TheNotificationsList: require('src/components/TheNotificationsList.vue')
      .default
  },
  data () {
    return {
      defaultTitleToolbar: 'Юрайт24',
      titleMenu: 'Меню',
      titleFavorites: 'Избранное',
      titleNotifications: 'Оповещения',
      btnSupportTitle: 'Поддержка',
      btnSupportURL: 'https://you-right.ru/kontakty',
      btnSignInTitle: 'Войти',
      btnSignOutTitle: 'Выйти',
      leftDrawerOpen: false,
      rightDrawerOpenFavorites: false,
      rightDrawerOpenNotifications: false
    }
  },
  computed: {
    ...mapGetters('appstore', [
      'isAuthenticated',
      'token',
      'useOData',
      'settings',
      'notificationsLength',
      'isNested',
      'isIframeMy'
    ]),
    titleToolbar () {
      return this.settings?.title || ''
    },
    classes () {
      return 'ur-bg-color-base' + (this.isIframeMy ? ' ur-nested' : '')
    }
  },
  methods: {
    ...mapActions('appstore', ['signOut']),
    btnHandleClickSignOut () {
      this.signOut(this.token)
    },
    btnHandleClickSupport () {
      if (
        this.titleToolbar.toUpperCase() ===
        this.defaultTitleToolbar.toUpperCase()
      ) {
        this.openTargetURL(this.btnSupportURL)
      } else {
        this.notifyDisplay('Функционал находится в разработке.')
      }
    }
  }
}
</script>
