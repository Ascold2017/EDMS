<template lang='pug'>
  .bg-simple
    b-container
        b-list-group
            b-alert(variant='primary' show v-if='!loaded') Завантажується...
            b-alert(variant='danger' show v-if='loaded && !sortingData.length') У вас немає опублікованих документів!
            router-link(
              v-for='preview in sortingData'
              :key='preview._id'
              :to='"/edms/myDocuments/" + preview._id'
              class='list-group-item preview-item list-group-item-action'
              )
              .preview-item__icon(:class='preview.globalStatus')
                i(class='fa fa-file-text-o' aria-hidden='true')
              h2.preview-item__title {{ preview.title }}
              time.preview-item__date {{ toDateString(+preview.date) }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import toDateString from '../modulesJs/toDateString'
export default {
  data () {
    return {
      loaded: false
    }
  },
  computed: {
    ...mapGetters('docsStore', ['documents']),
    sortingData () {
      return this.documents.slice(0).sort((prev, next) => prev.date <= next.date)
    }
  },
  methods: {
    ...mapActions('docsStore', ['getOurDocuments']),
    toDateString
  },
  created () {
    this.getOurDocuments()
      .then(() => {
        this.loaded = true
      })
  }
}
</script>
