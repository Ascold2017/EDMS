<template lang='pug'>
    b-tabs(v-if='!rejected')
        b-tab(title='Подписавшие' v-if='signedAuthors.length')
            b-list-group(style='max-height: 300px overflow-y: scroll')
                b-list-group-item(
                    v-for='author in signedAuthors'
                    :key='author._id'
                    variant='success'
                    )
                    p.subtitle.subtitle_small {{ author.author }}
                    p.subtitle.subtitle_small {{ author.role }}
                    p.subtitle.subtitle_small Время подписи: {{ toDateString(+author.dateSigning) }}
                    b-card(v-if='author.comment' class='mt-1')
                        p.text Комментарий подписанта:
                        p.text {{ author.comment }}
        b-tab(title='В очереди на подпись' v-if='waitingAuthors.length')
            b-list-group(style='max-height: 300px overflow-y: scroll')
                b-list-group-item(
                    v-for='author in waitingAuthors'
                    :key='author._id'
                    variant='primary'
                    )
                    p.subtitle.subtitle_small {{ author.author }}
                    p.subtitle.subtitle_small {{ author.role }}
                    b-card(v-if='author.comment' class='mt-1')
                        p.text Комментарий подписанта:
                        p.text {{ author.comment }}
    b-alert( show variant='danger' v-else) Документ отказан в подписи Вами
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
      return this.document.routes.filter(route => route.status === 'resolve')
    },
    waitingAuthors () {
      return this.document.routes.filter(route => route.status === 'waiting')
    }
  }
}
</script>
