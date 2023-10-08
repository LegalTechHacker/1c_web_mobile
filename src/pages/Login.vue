<template>
  <div :class="classes">
    <!--
    <svg
      class="ur-text-accent wave"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
    >
      <path
        fill="currentColor"
        fill-opacity="1"
        d="M0,160L120,181.3C240,203,480,245,720,240C960,235,1200,181,1320,154.7L1440,128L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
      ></path>
    </svg>
    -->
    <div class="ur-text-accent background-svg">
      <div class="wave row">
        <div class="col-0 col-md-6 flex justify-center content-center">
          <img
            src="logo.svg"
            alt="logo"
            class="responsive"
            style="width: 500px"
          />
        </div>
        <div
          v-bind:class="{
            'justify-center': $q.screen.md || $q.screen.sm || $q.screen.xs
          }"
          class="col-12 col-md-6 flex content-center"
        >
          <q-card
            style="max-width: 30rem"
            v-bind:style="$q.screen.lt.sm ? { width: '96%' } : { width: '69%' }"
            class="tw-rounded-2xl tw-shadow-md"
          >
            <q-card-section>
              <q-avatar
                class="absolute-center"
                icon="icon-mat-account_circle"
                color="white"
                text-color="ur-text-accent"
                size="100px"
                font-size="100px"
              >
              </q-avatar>
            </q-card-section>
            <q-card-section>
              <div class="q-pt-lg">
                <div class="col text-h6 ellipsis flex justify-center">
                  <h2
                    class="text-h2 text-uppercase q-my-name text-weight-regular"
                  >
                    Вход
                  </h2>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="tw-m-4">
              <q-form class="q-gutter-md" @submit.prevent="submitForm">
                <q-input
                  label="Пользователь"
                  type="text"
                  borderless
                  clearable
                  clear-icon="icon-mat-cancel_filled"
                  v-model="login.username"
                  class="tw-rounded-2xl tw-px-4 tw-shadow-md tw-bg-gray-200 hover:tw-bg-gray-100"
                >
                  <template v-slot:prepend>
                    <q-icon name="icon-mat-person" />
                  </template>
                </q-input>
                <q-input
                  label="Пароль"
                  type="password"
                  borderless
                  clearable
                  clear-icon="icon-mat-cancel_filled"
                  v-model="login.password"
                  class="tw-rounded-2xl tw-px-4 tw-shadow-md tw-bg-gray-200 hover:tw-bg-gray-100"
                >
                  <template v-slot:prepend>
                    <q-icon name="icon-mat-visibility_off" />
                  </template>
                </q-input>
                <div>
                  <q-btn
                    color="ur-bg-accent"
                    label="Войти"
                    size="lg"
                    type="submit"
                    class="tw-rounded-2xl full-width"
                  ></q-btn>
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      login: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapGetters('appstore', ['isAuthenticated', 'currentTheme']),
    svgSource () {
      return `url(wave.svg)`
      //return `url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' class='${this.currentTheme}' style='margin:0 auto;background:rgba(var(--color-background-base-mask-rgb), 1);display:block;z-index:1;position:relative;' width='1920' height='878' preserveAspectRatio='xMidYMid' viewBox='0 0 1920 878'%3E%3Cstyle type='text/css' %3E%3C!%5BCDATA%5B:root %7B--color-accent-base-mask-rgb: 196, 31, 72;--color-background-base-mask-rgb: 246, 247, 251;%7D.theme-urait %7B--color-accent-base-mask-rgb: 180, 57, 78;--color-background-base-mask-rgb: 246, 247, 251;%7D.theme-sirius %7B--color-accent-base-mask-rgb: 50, 50, 161;--color-background-base-mask-rgb: 226, 226, 226;%7D%5D%5D%3E%3C/style%3E%3Cg transform='translate(960,480) scale(1,-1) translate(-960,-480)'%3E%3ClinearGradient id='lg-0' x1='0' x2='1' y1='0' y2='0'%3E%3Cstop stop-color='rgba(var(--color-accent-base-mask-rgb), 1)' offset='0'%3E%3C/stop%3E%3Cstop stop-color='rgba(var(--color-accent-base-mask-rgb), 1)' offset='1'%3E%3C/stop%3E%3C/linearGradient%3E%3Cpath d='' fill='url(%23lg-0)' opacity='0.4'%3E%3Canimate attributeName='d' dur='10s' repeatCount='indefinite' keyTimes='0;0.333;0.667;1' calcMode='spline' keySplines='0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1' begin='0s' values='M0 0L 0 197Q 192 264 384 170T 768 151T 1152 120T 1536 120T 1920 196L 1920 0 Z;M0 0L 0 138Q 192 103 384 170T 768 171T 1152 177T 1536 166T 1920 120L 1920 0 Z;M0 0L 0 192Q 192 265 384 169T 768 178T 1152 228T 1536 220T 1920 172L 1920 0 Z;M0 0L 0 213Q 192 216 384 222T 768 137T 1152 179T 1536 295T 1920 214L 1920 0 Z;'%3E%3C/animate%3E%3C/path%3E%3Cpath d='' fill='url(%23lg-0)' opacity='0.4'%3E%3Canimate attributeName='d' dur='10s' repeatCount='indefinite' keyTimes='0;0.333;0.667;1' calcMode='spline' keySplines='0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1' begin='-2s' values='M0 0L 0 197Q 192 264 384 170T 768 151T 1152 120T 1536 120T 1920 196L 1920 0 Z;M0 0L 0 138Q 192 103 384 170T 768 171T 1152 177T 1536 166T 1920 120L 1920 0 Z;M0 0L 0 192Q 192 265 384 169T 768 178T 1152 228T 1536 220T 1920 209L 1920 0 Z;M0 0L 0 130Q 192 161 384 218T 768 203T 1152 129T 1536 144T 1920 172L 1920 0 Z;'%3E%3C/animate%3E%3C/path%3E%3Cpath d='' fill='url(%23lg-0)' opacity='0.4'%3E%3Canimate attributeName='d' dur='10s' repeatCount='indefinite' keyTimes='0;0.333;0.667;1' calcMode='spline' keySplines='0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1' begin='-4s' values='M0 0L 0 138Q 192 103 384 170T 768 171T 1152 177T 1536 166T 1920 120L 1920 0 Z;M0 0L 0 192Q 192 265 384 169T 768 178T 1152 228T 1536 220T 1920 172L 1920 0 Z;M0 0L 0 213Q 192 216 384 222T 768 137T 1152 179T 1536 295T 1920 214L 1920 0 Z;M0 0L 0 130Q 192 161 384 218T 768 203T 1152 129T 1536 144T 1920 172L 1920 0 Z;'%3E%3C/animate%3E%3C/path%3E%3Cpath d='' fill='url(%23lg-0)' opacity='0.4'%3E%3Canimate attributeName='d' dur='10s' repeatCount='indefinite' keyTimes='0;0.333;0.667;1' calcMode='spline' keySplines='0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1' begin='-6s' values='M0 0L 0 138Q 192 103 384 170T 768 171T 1152 177T 1536 166T 1920 120L 1920 0 Z;M0 0L 0 192Q 192 265 384 169T 768 178T 1152 228T 1536 220T 1920 172L 1920 0 Z;M0 0L 0 130Q 192 161 384 218T 768 203T 1152 129T 1536 144T 1920 172L 1920 0 Z;M0 0L 0 101Q 192 202 384 123T 768 113T 1152 202T 1536 173T 1920 241L 1920 0 Z;'%3E%3C/animate%3E%3C/path%3E%3Cpath d='' fill='url(%23lg-0)' opacity='0.4'%3E%3Canimate attributeName='d' dur='10s' repeatCount='indefinite' keyTimes='0;0.333;0.667;1' calcMode='spline' keySplines='0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1' begin='-8s' values='M0 0L 0 192Q 192 265 384 169T 768 178T 1152 228T 1536 220T 1920 172L 1920 0 Z;M0 0L 0 213Q 192 216 384 222T 768 137T 1152 179T 1536 295T 1920 214L 1920 0 Z;M0 0L 0 130Q 192 161 384 218T 768 203T 1152 129T 1536 144T 1920 172L 1920 0 Z;M0 0L 0 101Q 192 202 384 123T 768 113T 1152 202T 1536 173T 1920 241L 1920 0 Z;'%3E%3C/animate%3E%3C/path%3E%3C/g%3E%3C/svg%3E`
    },
    classes () {
      return 'ur-bg-color-base'
    }
  },
  methods: {
    ...mapActions('appstore', ['doLogin']),
    async submitForm () {
      if (!this.login.username) {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          message: 'Не заполнен пользователь.'
        })
      } else {
        try {
          await this.doLogin(this.login).then(() => {
            if (this.isAuthenticated) {
              const toPath = this.$route.query.to || '/'
              this.$router.push(toPath)
            } else {
              this.$q.notify({
                type: 'negative',
                position: 'top',
                message: 'Доступ запрещен.'
              })
            }
          })
        } catch (error) {
          this.$q.notify({
            type: 'negative',
            position: 'top',
            message: 'Ошибка: ' + error.message
          })
        }
      }
    }
  }
}
</script>

<style scoped>
.wave {
  position: fixed;
  height: auto;
  left: 0;
  bottom: 0;
  z-index: 0;
}
.wave.row {
  position: relative;
  height: 100vh;
  height: 100dvh;
}
.background-svg {
  background-image: v-bind('svgSource') !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  height: 100vh !important;
  height: 100dvh !important;
}
</style>
