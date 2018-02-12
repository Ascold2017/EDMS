<template lang="pug">
b-container
	b-row
		b-col(sm="12" class="mb-3")
			b-card
				h1.title {{ documents.title }}
		b-col(sm="12" class="mb-3")
			b-card
				p.text Автор публикации {{ documents.author}}
				time.text Дата первой публикации {{ documents.date }}
				p.text(v-if="documents.versions.lenght > 1") Текущая версия документа {{ documents.versions[0].version }}
				time.text(v-if="documents.versions.lenght > 1") Дата публикации версии {{ documents.versions[0].version }}: {{ documents.versions[0].date }}
	b-row
		b-col
			b-tabs(class="mb-3")
				b-tab(
					v-for="document in documents.versions"
					:key="document._id"
					:title="'Версия документа: ' + document.version" style="padding: 20px 0 0")
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
			b-form(@submit.prevent="submitDoc")
				b-card
					b-form-group(label="Выберите действие")
						b-form-radio-group(
							v-model="selected"
							name="radioSubComponent"
							:options="options"
							)
					b-form-group(label="Ваш комментарий")
						b-form-textarea(
							v-model="comment"
							placeholder="Оставьте комментарий"
							:rows="3"
							:max-rows="6"
							)
					b-button(type="submit") Отправить
	b-modal(ref="alertModal" hide-footer) {{ infoAlert }}
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
				{ value: "resolve", text: "Подписать документ" },
				{ value: "reject", text: "Отказать в подписи" }
			],
			comment: "",
			infoAlert: "",
		};
	},
	computed: {
		...mapGetters("docsStore", ["documents"]),
		...mapGetters("usersStore", ["currentUser"])
	},
	methods: {
		...mapActions("docsStore", ["getDocumentById", "postVote"]),
		submitDoc(e) {
			if (this.selected) {
				// post our vote to server
				this.postVote({
					id: this.id,
					vote: this.selected,
					comment: this.comment,
					author: this.currentUser
				})
					.then(response => {
						this.showAlert("Ваш голос успешно добавлен!");
						e.target.reset();
						this.getDocumentById(this.id);
					})
					.catch(e => {
						console.log(e);
						this.showAlert(`Произошла ошибка: ${e}`);
					});
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
		},
		showAlert(title) {
			this.infoAlert = title;
			this.$refs.alertModal.show();
		},
	},
	created() {
		this.getDocumentById(this.id)
		.catch(e => {
			console.log(e);
			this.$router.push('404');
		});
	}
};
</script>
