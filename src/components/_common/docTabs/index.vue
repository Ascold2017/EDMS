<template lang="pug">
    v-tabs(v-if='document.versions' v-model='tabIndex' app)
      v-tab Остання версія документа
      v-tab-item
        v-card.px-3.py-3
          v-subheader Описання:
          p {{ document.versions[0].description }}
          v-alert(type='info' :value='true') {{ checked }}
          pdf-reader(:src='document.versions[0].file')
      template(
        v-for='version in document.versions.filter((doc, i) => i !== 0)')
        v-tab {{ "Версія документа: " + version.version }}
        v-tab-item
          v-card.px-3.py-3
            p {{ version.rejectReason }}
            p Описання: {{ version.description }}
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
