<template lang="pug">
    b-tabs(class='mb-3' v-if='document.versions' v-model='tabIndex')
      b-tab(
        title='Остання версія документа'
        style='padding: 20px 0 0')
        p.text.ml-3 Описання: {{ document.versions[0].description }}
        p.text.ml-3 {{ checked }}
        pdf-reader(:src='document.versions[0].file')
      b-tab(
        v-for='version,indx in document.versions.filter((doc, i) => i !== 0)'
        v-if='document.versions.length > 1 && tabIndex === indx'
        :key='indx'
        :title='"Версія документа: " + version.version' style='padding: 20px 0 0'
        )
        p.text.ml-3 {{ version.rejectReason }}
        p.text.ml-3 Описання: {{ version.description }}
        pdf-reader(:src='version.file')
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      tabIndex: 0
    }
  },
  computed: {
    ...mapGetters('docsStore', ['document', 'checked'])
  },
  components: {
    pdfReader: require('../pdf-reader')
  }
}
</script>
