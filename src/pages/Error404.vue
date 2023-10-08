<template>
  <div class="fullscreen text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">Здесь ничего нет...</div>

      <q-btn
        class="q-mt-xl"
        unelevated
        rounded
        color="ur-bg-accent"
        to="/"
        label="Перейти на главную страницу"
        no-caps
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorNotFound'
}
</script>
