<template>
  <div>
    <template v-if="getCurrentValueTD(props, col)">
      <div
        v-if="
          getCurrentValueTD(props, col)?.indexOf('href=') !== -1 &&
          getCurrentValueTD(props, col)?.indexOf('detail-app') !== -1
        "
        class="ur-td tw-flex tw-font-semibold"
        v-html="
          getCurrentValueTD(props, col)
            ?.replace('#', '?url=[')
            ?.replace('\u0027 target=', ']\u0027 target=')
        "
      ></div>
      <div
        v-else-if="
          getCurrentValueTD(props, col)?.indexOf('href=') !== -1 &&
          getCurrentValueTD(props, col)?.indexOf('detail-1C') !== -1
        "
        class="ur-td tw-flex tw-font-semibold"
        v-html="getCurrentValueTD(props, col)?.replace('#', baseURL + '#')"
      ></div>
      <div
        v-else-if="
          getCurrentValueTD(props, col)
            ?.trim()
            ?.slice(0, 4)
            ?.indexOf('http') !== -1
        "
        class="ur-td tw-flex tw-font-semibold"
        v-html="
          `<a href='` +
          getCurrentValueTD(props, col) +
          `' target='_blank' rel='noopener noreferrer' class='detail detail-web'>` +
          getCurrentValueTD(props, col) +
          `</a>`
        "
      ></div>
      <div
        v-else-if="getCurrentValueTD(props, col)?.indexOf('<code>') !== -1"
        class="ur-td tw-flex"
        @click.prevent="$emit('clickTD', props)"
        v-html="getCurrentValueTD(props, col)"
      ></div>
      <template v-else>
        <div
          v-if="getCurrentValueTD(props, col) !== ''"
          class="ur-td tw-flex"
          @click.prevent="$emit('clickTD', props)"
          v-html="getCurrentValueTD(props, col)"
        ></div>
        <div
          v-else
          class="ur-td-empty tw-flex"
          @click.prevent="$emit('clickTD', props)"
        >
          {{ emptyValue }}
        </div>
      </template>
    </template>
    <template v-else>
      <div class="ur-td-empty tw-flex" @click.prevent="$emit('clickTD', props)">
        {{ emptyValue }}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'BaseFieldReadonlyTD',
  props: {
    props: { type: Object, default: () => {} },
    col: { type: Object, default: () => {} }
  },
  data () {
    return {
      emptyValue: '<Нет данных>'
    }
  }
}
</script>

<style></style>
