<template lang='pug'>
    #app
        app-header
        b-container
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
