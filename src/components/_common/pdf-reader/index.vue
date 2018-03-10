<template lang='pug'>
    div.reader#pdfjs
        pdf(
            v-for='i in numPages'
            :key='i'
            :src='loadingTask'
            :page='i'
            style='display: block')
</template>

<script>
import pdf from 'vue-pdf'
export default {
  props: {
    src: String
  },
  data () {
    return {
      numPages: undefined
    }
  },
  computed: {
    loadingTask () {
      return pdf.createLoadingTask(this.src)
    }
  },
  mounted () {
    this.loadingTask.then(pdf => {
      this.numPages = pdf.numPages
    })
  },
  components: {
    pdf
  }
}
</script>
<style lang='sass' scoped>
.reader
    max-height: 500px
    overflow-y: scroll
    overflow-x: hidden
</style>
