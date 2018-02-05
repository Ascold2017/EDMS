<template lang="pug">
	b-container.details
		h1.details__title {{ documents.title }}
		time.details__date Дата публикации {{ documents.date }}
		b-embed(
			type="embed"
			aspect="16by9"
			:src="documents.document"
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
		b-alert(
			variant="danger"
			v-if="documents.globalStatus === 'rejected'"
			class="mb-0"
			show
			).details__form Документ отказан в подписи. Вы можете его доработать или закрыть
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
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
			}
		},
	},
	created() {
		this.getMyDocumentById(this.id)
		.catch(e => {
			console.log(e);
			this.$router.push('404');
		});
	}
}
</script>

<style>

</style>
