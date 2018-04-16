<template lang='pug'>
  #app
    v-app(light)
      app-header
      v-content
        router-view
      app-footer
</template>

<script>
import AppHeader from './components/_common/header'
import AppFooter from './components/_common/footer'

export default {
  name: 'app',
  components: {
    AppHeader,
    AppFooter
  }
}
</script>
