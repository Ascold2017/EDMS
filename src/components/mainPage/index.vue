<template lang="pug">
.container
    b-list-group
        b-list-group-item(
            v-for="preview in sortingData"
            :key="preview._id"
            :href="preview._id"
            class="preview-item"
            )
            .preview-item__icon(:class="iconStatus(preview.status)")
                i(class="fa fa-file-text-o" aria-hidden="true")
            h2.preview-item__title {{ preview.title }}
            time.preview-item__date {{ preview.date }}
            span.preview-item__author {{ preview.author }}
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  computed: {
    ...mapGetters('docsStore', ['data']),
    ...mapGetters('usersStore', ['token']),
    sortingData() {
        const toDate = (date) => {
            const day = date.substring(0,2);
            const month = date.substring(3, 5);
            const year = date.substring(6, 10);
            const hours = date.substring(13, 15);
            const minutes = date.substring(16, 18);
            const seconds = date.substring(19, 21);
            return Date.parse(new Date(+day, +month - 1, +year, +hours, +minutes, +seconds));
        }
        return this.data.sort((prev, next) =>  toDate(prev.date) <= toDate(next.date));
    }
  },
  methods: {
      ...mapActions('docsStore', ['getPreviewsForUser']),
      iconStatus(status) {
        switch(status) {
            case "waiting":
                return "waiting";
            case "resolved":
                return "resolved";
            case "rejected":
                return "rejected";
            default: return "";
        }
    }
  },
  created() {
      console.log(this.token);
      this.getPreviewsForUser(this.token);
  }
}
</script>
<style lang="sass" src="./style.sass" scoped></style>

