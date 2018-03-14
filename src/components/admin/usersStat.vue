<template lang='pug'>
  div
    b-form-group(label='Выбрать промежуток среза статистики').mt-3
      b-button(type='button' @click='showCalendar = !showCalendar') Открыть календарь
    h4 Статистика за {{ title }}
    p Создано документов за период: {{ docsCreated}}
    p Подписано документов за период: {{ docsSigned }}
    p Отказано документов за период: {{ docsRejected }}
    p Среднее время между созданием и финальным подписанием документ: {{ docsTimingResolve }}
    p Среднее время одной подписи: {{ docsTimingSign }}
    h4 Статистика по ролям:
    b-table(
      striped
      bordered
      hover
      :fields='usersStat.fields'
      :items='usersStat.items'
      )
    b-button(type='button' @click='submitStat') Получить статистику
    b-modal(v-model='showCalendar' title='Выбрать промежуток среза статистики' hide-footer )
      date-range(
          class='calendar'
          :first-day-of-week='1'
          v-model='date'
          lang='ru')
</template>

<script>
import { DateRange } from 'vue-date-range'
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  data () {
    return {
      date: {
        startDate: null,
        endDate: null
      },
      loadedStat: false,
      showCalendar: false,
      title: 'все время'
    }
  },
  computed: {
    ...mapGetters('statStore', [
      'docsCreated',
      'docsSigned',
      'docsRejected',
      'docsTimingSign',
      'docsTimingResolve',
      'usersStat'
    ])
  },
  methods: {
    ...mapActions('statStore', ['getDocsStat']),
    ...mapMutations('statStore', ['setRange']),
    submitStat () {
      const start = Date.parse(this.date.startDate._d)
      const end = Date.parse(this.date.endDate._d)
      this.title = `период с ${this.toDateString(start)} по ${this.toDateString(
        end
      )}`
      this.setRange({ start, end })
      this.showCalendar = false
    }
  },
  created () {
    this.getDocsStat()
      .then(response => {
        this.loadedStat = true
      })
  },
  components: {
    DateRange
  }
}
</script>

<style lang='sass' scoped>
.users-list
  max-height: 445px
  overflow-y: scroll
  overflow-x: hidden
ol
  list-style: inside
</style>
