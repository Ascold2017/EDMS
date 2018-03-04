<template lang="pug">
b-container
	b-row
		b-col
			b-card.mb-3
				h1.title {{ documents.title }}
	b-row
		b-col
			b-alert(show v-if="documents.globalStatus==='resolved'" variant="success") Документ успешно принят
			b-alert(show v-else variant="warning") Документ отказан в подписи и помещен в архив
			b-tabs(class="mb-3")
				b-tab(
					v-for="document in documents.versions"
					:key="document._id"
					:title="'Версия документа: ' + document.version" style="padding: 20px 0 0")
					time.text Дата публикации {{ toDateString(+document.date) }}
					p.details__description Описание: {{ document.description }}
					p(v-if="document.rejectReason").details__description {{ document.rejectReason }}
					pdf-reader(
						:src="document.file"
						v-if="document.file")
				
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
					p.subtitle.subtitle_small(v-if="author.dateSigning") Время подписи: {{ toDateString(+author.dateSigning) }}
					b-card(v-if="author.comment" class="mt-1")
						p.text Комментарий подписанта:
						p.text {{ author.comment }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import toDateString from '../modulesJs/toDateString';
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
		...mapActions("docsStore", ["getArchiveDocumentById"]),
		toDateString,
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
		this.getArchiveDocumentById(this.id)
		.catch(e => {
			console.log(e);
			this.$router.push('404');
		});
	},
	components: {
		pdfReader: require('../_common/pdf-reader'),
	}
}
</script>
