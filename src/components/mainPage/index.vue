<template lang="pug">
div
  h2.title Документы к подписанию
  b-container
    b-list-group
      b-alert(variant="primary" show v-if="!loaded") Загрузка...
      b-alert(variant="danger" show v-if="loaded && !sortingData.length") Новых документов к рассмотрению нет
      router-link(
        v-for="preview in sortingData"
        :key="preview._id"
        :to="'/edms/' + preview._id"
        class="list-group-item preview-item list-group-item-action"
        )
        .preview-item__icon(:class="iconStatus(preview.globalStatus)")
            i(class="fa fa-file-text-o" aria-hidden="true")
        h2.preview-item__title {{ preview.title }}
        time.preview-item__date Дата публикации: {{ preview.date }}
        span.preview-item__author Автор публикации: {{ preview.author }}
        span.preview-item__state Текущий маршрут: {{ preview.state }} / {{ preview.total }}
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      loaded: false,
    }
  },
  computed: {
    ...mapGetters("docsStore", ["documents"]),
    ...mapGetters("usersStore", ["currentUser"]),
    sortingData() {
      if (!this.documents.length) return [];
      const toDate = date => {
        const day = date.substring(0, 2);
        const month = date.substring(3, 5);
        const year = date.substring(6, 10);
        const hours = date.substring(13, 15);
        const minutes = date.substring(16, 18);
        const seconds = date.substring(19, 21);
        return Date.parse(
          new Date(+day, +month - 1, +year, +hours, +minutes, +seconds)
        );
      };
      console.log('documents: ', this.documents);
      return this.documents.sort(
        (prev, next) => toDate(prev.date) <= toDate(next.date)
      );
    }
  },
  methods: {
    ...mapActions("docsStore", ["getPreviews"]),
    ...mapActions("usersStore", ["getCurrentUser"]),
    iconStatus(status) {
      switch (status) {
        case "waiting":
          return "waiting";
        case "resolved":
          return "resolved";
        case "rejected":
          return "rejected";
        default:
          return "";
      }
    }
  },
  created() {
    this.getPreviews()
    .then(() => {
      console.log(this.documents);
      this.loaded = true;
    })
    .catch((err) => {
      console.log(err);
          this.$router.push('/');
      });;
  }
};
</script>
