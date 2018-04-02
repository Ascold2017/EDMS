<template lang='pug'>
    time.date Поточний час: {{date}}
</template>

<script>
export default {
  data () {
    return {
      date: ''
    }
  },
  methods: {
    timer () {
      setInterval(() => {
        const time = new Date()
        let day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
        let month =
          time.getMonth() < 10
            ? '0' + (time.getMonth() + 1)
            : time.getMonth() + 1
        let hours =
          time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
        let minutes =
          time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
        let seconds =
          time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()

        this.date = `${day}.${month}.${time.getFullYear()} - ${hours}:${minutes}:${seconds}`

        this.$emit('dateUpdate', this.date)
      }, 1000)
    }
  },
  created () {
    this.timer()
  }
}
</script>
