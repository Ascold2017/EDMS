<template lang="pug">
.container
    b-list-group
        b-list-group-item(
            v-for="preview in data"
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
      this.getPreviewsForUser(this.token);
  }
}
</script>
<style lang="sass" src="./style.sass" scoped></style>

