<template lang='pug'>
  div
    b-form-group(label='Обрати проміжок зрізу статистики').mt-3
      vue-rangedate-picker(
        i18n='EN'
        :month='datepickerConfig.month'
        :shortDays='datepickerConfig.shortDays'
        :captions='datepickerConfig.captions'
        :presetRanges='datepickerConfig.presetRanges'
        @selected='submitStat')

    h4 Статистика за {{ title }}
    ol
      li Створено усього документов за период: {{ docsCreated}}
      li Підписано усього документов за период: {{ docsSigned }}
      li Отказано документов за период: {{ docsRejected }}
      li Середній час між створенням та фінальним підписанням документа: {{ docsTimingResolve }}
      li Середній час одного підпису: {{ docsTimingSign }}
    b-table(
      striped
      bordered
      hover
      :fields='usersStat.fields'
      :items='usersStat.items')

</template>

<script>
import VueRangedatePicker from 'vue-rangedate-picker'
import toDateString from '../modulesJs/toDateString'
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  data () {
    return {
      loadedStat: false,
      title: 'весь час',
      datepickerConfig: {
        months: ['Cічень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень',
          'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
        shortDays: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'],
        captions: {
          'title': 'Оберить проміжок',
          'ok_button': 'Обрати',
          'today': 'За сьогодні'
        },
        presetRanges: {
          today: () => {
            const n = new Date()
            const startToday = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1, 0, 0)
            const endToday = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1, 23, 59)
            return {
              label: 'За сьогодні',
              active: false,
              dateRange: {
                start: startToday,
                end: endToday
              }
            }
          },
          thisMonth: () => {
            const n = new Date()
            const startToday = new Date(n.getFullYear(), n.getMonth() - 1, n.getDate())
            const endToday = new Date(n.getFullYear(), n.getMonth(), n.getDate() - 1, 0, 0)
            return {
              label: 'За останній місяць',
              active: false,
              dateRange: {
                start: startToday,
                end: endToday
              }
            }
          },
          last7days: () => {
            const n = new Date()
            const startToday = new Date(n.getFullYear(), n.getMonth(), n.getDate() - 7, 0, 0)
            const endToday = new Date(n.getFullYear(), n.getMonth(), n.getDate() - 1, 0, 0)
            return {
              label: 'За останні 7 діб',
              active: false,
              dateRange: {
                start: startToday,
                end: endToday
              }
            }
          },
          last30days: () => {
            const n = new Date()
            const startToday = new Date(n.getFullYear(), n.getMonth(), n.getDate() - 30, 0, 0)
            const endToday = new Date(n.getFullYear(), n.getMonth(), n.getDate() - 1, 0, 0)
            return {
              label: 'За останні 30 діб',
              active: false,
              dateRange: {
                start: startToday,
                end: endToday
              }
            }
          },
          allTime: () => {
            const n = new Date()
            const startToday = new Date(0)
            const endToday = new Date(n.getFullYear(), n.getMonth(), n.getDate())
            return {
              label: 'За весь час',
              active: true,
              dateRange: {
                start: startToday,
                end: endToday
              }
            }
          }
        }
      }
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
    toDateString,
    submitStat (dateObj) {
      const start = new Date(dateObj.start).getTime()
      const end = new Date(dateObj.end).getTime()
      this.title = `період с ${this.toDateString(start)} по ${this.toDateString(end)}`
      this.setRange({ start, end })
    }
  },
  created () {
    this.getDocsStat()
      .then(response => {
        this.loadedStat = true
      })
  },
  components: {
    VueRangedatePicker
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
