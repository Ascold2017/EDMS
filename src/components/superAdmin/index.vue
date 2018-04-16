<template lang='pug'>
    v-container(fluid app)
      v-subheader.headline Панель головного адміністратора EDMS
      v-tabs
        v-tab Створити нову групу
        v-tab-item
          create-group(@alert="openInfo")
        v-tab Создать нового администратора
        v-tab-item
          create-admin(@alert="openInfo")
        v-tab Групи
        v-tab-item
          groups-list(@alert="openInfo")
      v-dialog(v-model='showInfo')
        v-card.px-3.py-3 {{ info }}
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
      showInfo: false
    }
  },
  methods: {
    openInfo (info) {
      this.info = info
      this.showInfo = true
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
