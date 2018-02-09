<template lang="pug">
b-container
	b-row
		b-col
			b-card.mb-3
				h1.title {{ documents.title }}
	b-row
		b-col
			b-tabs(class="mb-3")
				b-tab(
					v-for="document in documents.versions"
					:title="'Версия документа: ' + document.version" style="padding: 20px 0 0")
					time.text Дата публикации {{ document.date }}
					p.details__description Описание: {{ document.description }}
					b-embed(
						type="embed"
						aspect="16by9"
						:src="document.file"
						allowfullscreen
						)
				
	b-row
		b-col(sm="12")
			b-list-group(style="max-height: 300px; overflow-y: scroll;")
				b-list-group-item(
					v-for="author in documents.routes"
					:key="author._id"
					:variant="statusVariant(author.status)"
					)
					p.subtitle.subtitle_small {{ author.author }}
					p.subtitle.subtitle_small {{ author.role }}
					b-card(v-if="author.comment" class="mt-1")
						p.text Комментарий подписанта:
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
