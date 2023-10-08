<template>
  <div class="flex content-center justify-center">
    <div class="absolute-center">
      <div class="text-center text-h6 ur-text-secondary">
        <slot></slot>
      </div>
      <div class="q-pt-lg" style="opacity: 0.09">
        <img
          src="logo.svg"
          alt="logo"
          class="responsive"
          style="width: 500px"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheInformationPanel'
}
</script>
