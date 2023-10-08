<template>
  <div class="ur-bg-print">
    <div
      id="printArea"
      class="tw-block tw-p-pa4 tw-bg-white tw-shadow-md tw-w-wa4 tw-h-ha4 tw-min-w-wa4 tw-min-h-ha4 tw-mx-auto tw-overflow-auto"
    >
      <iframe :srcdoc="preview" loading="lazy"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThePreviewReport',
  props: {
    preview: { type: String, default: '' }
  }
}
</script>
