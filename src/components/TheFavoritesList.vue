<template>
  <q-list>
    <q-item>
      <q-item-section avatar>
        <div class="q-mx-sm">
          <q-btn
            flat
            round
            icon="icon-mat-grade"
            :aria-label="titleFavorites"
            :title="titleFavorites"
            @click="$emit('rightDrawerOpenFavoritesToggle')"
          >
          </q-btn>
        </div>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ titleFavorites }}</q-item-label>
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
      id="scroll-area-favorites"
    >
      <q-virtual-scroll
        scroll-target="scroll-area-favorites"
        :items="favorites"
      >
        <template v-slot="{ item, index }">
          <FavoritesLink
            :key="index"
            v-bind="item"
            parent="favorites"
            @deleteItem="btnHandleClickDeleteFavorite(item)"
          />
        </template>
      </q-virtual-scroll>
    </q-scroll-area>
  </q-list>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'TheFavoritesList',
  components: {
    FavoritesLink: require('src/components/FavoritesLink.vue').default
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
      titleFavorites: 'Избранное',
      btnRefreshTitle: 'Обновить'
    }
  },
  computed: {
    ...mapGetters('appstore', [
      'isAuthenticated',
      'me',
      'token',
      'useOData',
      'favorites',
      'currentSearchObjectURL'
    ])
  },
  created () {
    this.btnHandleClickRefresh()
  },
  methods: {
    ...mapActions('appstore', [
      'getFavoritesFrom1C',
      'deleteItemFromFavorites'
    ]),
    async btnHandleClickRefresh () {
      if (this.isAuthenticated && !this.useOData) {
        const favorite = {
          user: this.me?.userIB?.name
        }
        await this.getFavoritesFrom1C({
          token: this.token,
          loading: false,
          favorite: favorite,
          currentSearchObjectURL: this.currentSearchObjectURL
        })
      }
    },
    async btnHandleClickDeleteFavorite (item) {
      if (this.isAuthenticated && !this.useOData) {
        const favorite = {
          ...item?.data,
          user: this.me?.userIB?.name
        }
        await this.deleteItemFromFavorites({
          token: this.token,
          loading: false,
          favorite: favorite,
          currentSearchObjectURL: this.currentSearchObjectURL
        })
      }
    }
  }
}
</script>
