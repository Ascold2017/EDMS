<template lang='pug'>
  v-card
    v-tabs(v-if='!rejected')
      v-tab(v-if='signedAuthors.length') Підписавщі
      v-tab-item(v-if='signedAuthors.length')
        div.signers-list
          template(v-for='author in signedAuthors')
            v-card(color='success').px-3.pb-3
              v-subheader {{ author.author }}
              v-subheader {{ author.role }}
              v-subheader Час підпису: {{ toDateString(+author.dateSigning) }}
              v-subheader Коментар підписанта:
              v-card(v-if='author.comment' class='mt-1').px-2.py-2
                p.mb-0 {{ author.comment }}
            v-divider
      v-tab(v-if='waitingAuthors.length') В черзі на підпис
      v-tab-item(v-if='waitingAuthors.length')
        div.signers-list
          template(v-for='author in waitingAuthors')
            v-card(color='info')
              v-subheader {{ author.author }}
              v-subheader {{ author.role }}
            v-divider
    v-alert(:value='true' type='error' v-else) Документ відмовлен в підписі Вами
</template>

<script>
import { mapGetters } from 'vuex'
import toDateString from '../../modulesJs/toDateString'
export default {
  props: {
    rejected: Boolean
  },
  methods: {
    toDateString
  },
  computed: {
    ...mapGetters('docsStore', ['document']),
    signedAuthors () {
      if (!this.document.routes) return []
      return this.document.routes.filter(route => route.status === 'resolve')
    },
    waitingAuthors () {
      if (!this.document.routes) return []
      return this.document.routes.filter(route => route.status === 'waiting')
    }
  }
}
</script>
<style lang="sass" scoped>
.signers-list
  height: 350px
  overflow-y: scroll
  overflow-x: hidden
  background-color: #ffffff
</style>
