<template lang="pug">
.bg
  b-container
    b-row(align-h="center" align-v="center")
      b-col(sm="10" md="8" lg="5")
        b-card(title="Авторизуватись")
          sign-in
</template>

<script>
export default {
  components: {
    signIn: require('./innerComponents/signIn.vue')
  }
}
</script>
