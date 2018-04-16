<template lang="pug">
  v-container(fluid fill-height).bg
    v-layout(align-center justify-center)
      v-flex(xs12 sm8 md4)
        v-card(class='elevetion-12')
          sign-in
</template>

<script>
export default {
  components: {
    signIn: require('./innerComponents/signIn.vue')
  }
}
</script>
