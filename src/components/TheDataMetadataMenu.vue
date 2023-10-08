<template>
  <div>
    <template v-for="itemData in data">
      <TheDataMetadataMenuItem
        :key="itemData?.id"
        v-bind="itemData"
        :data="itemData"
        :children="itemData?.children"
        :parent="itemData?.parent"
        :icon="itemData?.icon"
        :class="itemData?.children?.length ? '' : 'ur-expansion-item'"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'TheDataMetadataMenu',
  components: {
    TheDataMetadataMenuItem:
      require('src/components/TheDataMetadataMenuItem.vue').default
  },
  props: {
    data: { type: Array, default: () => [] }
  }
}
</script>
