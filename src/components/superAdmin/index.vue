<template lang='pug'>
    b-container
      h1.title.mb-3 Панель головного адміністратора EDMS
      b-tabs
        b-tab(title='Создать новую группу')
          create-group(@alert="openInfo").mt-3
        b-tab(title='Создать нового администратора')
          create-admin(@alert="openInfo").mt-3
        b-tab(title='Группы')
          groups-list(@alert="openInfo").mt-3
      b-modal(ref='infoModal' title='Сообщение')
        | {{ info }}
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
      info: ''
    }
  },
  methods: {
    openInfo (info) {
      this.info = info
      this.$refs.infoModal.show()
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
