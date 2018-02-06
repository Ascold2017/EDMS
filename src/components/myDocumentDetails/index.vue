<template lang="pug">
	b-container.details
		h1.details__title {{ documents.title }}
		time.details__date Дата публикации {{ documents.date }}
		b-tabs.details__versions
			b-tab(
				v-for="document in documents.versions"
				:title="document.version")
				p.details__description Описание: {{ document.description }}
				b-embed(
					type="embed"
					aspect="16by9"
					:src="document.file"
					allowfullscreen
					)
		b-list-group.details__authors
			b-list-group-item(
				v-for="author in documents.routes"
				:key="author._id"
				:variant="statusVariant(author.status)"
				)
				p.subtitle {{ author.author }}
				p.subtitle {{ author.role }}
				p.text {{ author.comment }}
		b-alert(
			variant="success"
			v-if="documents.globalStatus === 'resolved'"
			class="mb-0"
			show
			).details__form Документ подписан, его можно найти в 
			router-link(:to="'/edms/archive/' + documents._id") Архиве
		b-alert(
			variant="primary"
			v-if="documents.globalStatus === 'waiting'"
			class="mb-0"
			show
			).details__form Документ на стадии рассмотрения
		div.details__form(v-if="documents.globalStatus === 'rejected'")
			b-alert(
				variant="danger"
				show
				) Документ отказан в подписи. Вы можете его доработать или закрыть
			b-button(@click="closeDocument" size="lg" class="mb-3") Закрыть документ и отправить в архив
			router-link(:to="'/edms/myDocumentEdit/' + id" class="btn btn-success btn-lg") Перейти в редактор версий
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      id: this.$router.currentRoute.params.id,
    };
  },
  computed: {
    ...mapGetters("docsStore", ["documents"]),
  },
  methods: {
    ...mapActions("docsStore", ["getMyDocumentById"]),
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
      };
	},
	closeDocument() {
		console.log('close!');
	}
  },
  created() {
    this.getMyDocumentById(this.id).catch(e => {
      console.log(e);
      this.$router.push("404");
    });
  }
};
</script>