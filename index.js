import Vue from 'vue'
import Vuex from 'vuex'
import appstore from './app-store'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      appstore
    },

    strict: process.env.DEBUGGING
  })

  return Store
}
