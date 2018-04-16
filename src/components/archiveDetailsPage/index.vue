<template lang="pug">
  v-container(fluid grid-list-md).bg-simple
    v-layout(row wrap)
      v-flex(xs12)
        v-card
          v-subheader.headline {{ document.title }}
          v-alert(:value='document.globalStatus === "resolved"' type="success") Документ успішно прийнят
          v-alert(:value='document.globalStatus !== "resolved"' type="error")
            v-card(color='transparent').px-2.py-2
              | Документ закритий.
              | {{ document.versions[0].rejectReason }}
      v-flex(xs12)
        doc-tabs
      v-flex(xs12)
        signers-list(:rejected="false")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import toDateString from '../modulesJs/toDateString'
export default {
  data () {
    return {
      id: this.$router.currentRoute.params.id
    }
  },
  computed: {
    ...mapGetters('docsStore', ['document'])
  },
  methods: {
    ...mapActions('docsStore', ['getArchiveDocumentById']),
    toDateString
  },
  created () {
    this.getArchiveDocumentById(this.id)
      .catch(e => {
        this.$router.push('/404')
      })
  },
  components: {
    docTabs: require('../_common/docTabs'),
    signersList: require('../_common/signersList')
  }
}
</script>
