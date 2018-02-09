<template lang="pug">
	b-container
		b-row
			b-col(sm="12" class="mb-3")
				b-card
					h1.title {{ documents.title }}
			b-col(sm="12" class="mb-3")
				b-card
					time.text Дата первой публикации {{ documents.date }}
					p.text(v-if="documents.versions.lenght > 1") Текущая версия документа {{ documents.versions[0].version }}
					time.text(v-if="documents.versions.lenght > 1") Дата публикации версии {{ documents.versions[0].version }}: {{ documents.versions[0].date }}

		b-row
			b-col
				b-tabs(class="mb-3")
					b-tab(
						v-for="document in documents.versions"
						:title="'Версия документа: ' + document.version"
						style="padding: 20px 0 0"
						)
						p.text Описание: {{ document.description }}
						b-embed(
							type="embed"
							aspect="16by9"
							:src="document.file"
							allowfullscreen
							)
		b-row
			b-col(sm="12" lg="6")
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
			b-col(sm="12" lg="6")
				b-alert(
					variant="success"
					v-if="documents.globalStatus === 'resolved'"
					class="mb-0"
					show
					) Документ успешно подписан, его можно найти в 
					router-link(:to="'/edms/archive/' + documents._id") Архиве
				b-alert(
					variant="primary"
					v-if="documents.globalStatus === 'waiting'"
					class="mb-0"
					show
					) Документ на стадии рассмотрения. Сейчас его рассматривает: {{ closerViewer }}
				div(v-if="documents.globalStatus === 'rejected'")
					b-alert(
						variant="danger"
						show
						) Документ отказан в подписи. Вы можете его доработать или закрыть.
					b-card.mb-3
						p.subtitle.subtitle_small Вам отказал(а) в подписи {{ rejectReason.name }}:
						p.subtitle.subtitle_small Причина отказа: <br> {{ rejectReason.reason }}
					b-button(
						id="toArchive"
						@click="closeDocument"
						size="md"
						class="mr-3 mb-3"
						) Закрыть документ
					router-link(
						id="editDocument"
						:to="'/edms/myDocumentEdit/' + id"
						class="btn btn-success btn-md mb-3"
						) Доработать документ
					b-tooltip(target="editDocument" title="Перейти в редактор версий")
					b-tooltip(target="toArchive" title="Документ отправится в архив")
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
		rejectReason() {
			const rejectAuthor = this.documents.routes.find(route => route.status === 'reject');
			if (!rejectAuthor) return { name: '', reason: ''};
			return { name: rejectAuthor.author, reason: rejectAuthor.comment ? rejectAuthor.comment : 'Причина не указана' };
		},
		closerViewer() {
			return this.documents.routes.find(route => route.status === 'waiting').author;
		}
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