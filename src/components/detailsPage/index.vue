<template lang="pug">
.content
    .details
        h1.details__title {{ data.title }}
        time.details__date Дата публикации {{ data.date }}
        p.details__author Автор публикации {{ data.author}}
        b-embed(
            type="embed"
            aspect="16by9"
            :src="data.document"
            allowfullscreen
            )
        b-list-group.details__authors
            b-list-group-item(
                v-for="author in data.routes"
                :key="author._id"
                :variant="statusVariant(author.status)"
                )
                p.subtitle {{ author.author }}
                p.subtitle {{ author.role }}
        b-form-group(label="Выберите действие").details__form
            b-form-radio-group(
                v-model="selected"
                name="radioSubComponent"
                stacked
                :options="options"
                )
        b-form-group(
            label="Ваш комментарий"
            description="Укажите причину вашего отказа"
            v-if="selected === 'reject'"
            ).details__comment
            b-form-textarea(
                v-model="comment"
                placeholder="Оставьте комментарий"
                :rows="3"
                :max-rows="6"
                )
        b-button(@click="submitDoc").details__submit Отправить
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      // get id of current document
      id: this.$router.currentRoute.params.id,
      // current status of doc
      selected: "",
      options: [
        { value: "resolve", text: "Согласен" },
        { value: "reject", text: "НЕ согласен" }
      ],
      comment: ""
    };
  },
  computed: {
    ...mapGetters("docsStore", ["data"]),
    ...mapGetters("usersStore", ["token", "currentUser"]),
  },
  methods: {
    ...mapActions("docsStore", ["getDocumentById", "postVote"]),
    submitDoc() {
      if (this.selected) {
        // post our vote to server
        this.postVote({
          id: this.id,
          vote: this.selected,
          comment: this.comment,
          token: this.token,
          author: this.currentUser
        })
          .then(response => { console.log(response); this.getDocumentById(this.id); })
          .catch(e => console.log(e));
      }
    },
    statusVariant(state) {
      switch (state) {
        case "resolve":
          return "success";
        case "reject":
          return "danger";
        case "waiting":
          return "primary";
        default:
          return "warning";
      }
    }
  },
  created() {
    this.getDocumentById(this.id)
      .catch(() => {
          console.log('redirect');
          // this.$router.go('/');
        });
  }
};
</script>
<style lang="sass" src="./style.sass" scoped></style>

