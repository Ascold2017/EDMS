<template lang="pug">
    b-tabs(class='mb-3')
        b-tab(
            title='Последняя версия документа'
            style='padding: 20px 0 0')
            p.text Описание: {{ document.versions[0].description }}
            pdf-reader(
                :src='document.versions[0].file'
                )
        b-tab(
            v-if='document.versions.length && document.versions.length > 1'
            v-for='version in document.versions.filter((doc, i) => i !== 0)'
            :key='version._id'
            :title='"Версия документа: " + version.version' style='padding: 20px 0 0'
            )
            p.text {{ version.rejectReason }}
            p.text Описание: {{ version.description }}
            pdf-reader(
                :src='version.file'
                )
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('docsStore', ['document'])
  },
  components: {
    pdfReader: require('../pdf-reader')
  }
}
</script>
