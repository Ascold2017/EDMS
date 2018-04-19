<template lang='pug'>
    v-container(fluid app)
      v-subheader.headline Панель головного адміністратора EDMS
      div(v-if='showBlank === "" || showBlank === "createGroup"')
        create-group(@alert="openInfo")
      div(v-if='showBlank === "createAdmin"')
        create-admin(@alert="openInfo")
      div(v-if='showBlank === "groups"')
        groups-list(@alert="openInfo")

      v-snackbar(v-model='showInfo' top right)
        | {{ info }}
        v-btn(flat @click.native='showInfo = false' color='pink') Закрити
</template>
<script>
export default {
  data () {
    return {
      userForMail: {
        token: '',
        login: '',
        email: ''
      },
      info: '',
      showInfo: false,
      showBlank: ''
    }
  },
  methods: {
    openInfo (info) {
      this.info = info
      this.showInfo = true
    }
  },
  watch: {
    '$route': function (val) {
      console.log(val)
      this.showBlank = this.$route.params.blank
    }
  },
  components: {
    createGroup: require('./innerComponents/createGroup'),
    createAdmin: require('./innerComponents/createAdmin'),
    groupsList: require('./innerComponents/groupsList')
  }
}
</script>
<style lang='sass' scoped>
ol
  list-style: inside
</style>
