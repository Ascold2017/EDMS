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
		...mapActions("docsStore", ["getDocumentById"]),
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
		this.getDocumentById(this.id)
		.catch(e => {
			console.log(e);
			this.$router.push('404');
		});
	}
}
</script>

<style>

</style>
