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
				p.text {{ author.comment }}
		b-form(@submit.prevent="submitDoc").details__form
			b-form-group(label="Выберите действие")
				b-form-radio-group(
					v-model="selected"
					name="radioSubComponent"
					:options="options"
					)
			b-form-group(label="Ваш комментарий").details__comment
				b-form-textarea(
					v-model="comment"
					placeholder="Оставьте комментарий"
					:rows="3"
					:max-rows="6"
					)
			b-button(type="submit").details__submit Отправить
	b-modal(ref="alertModal" hide-footer) {{ infoAlert }}
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
	//'https://view.officeapps.live.com/op/embed.aspx?src=' + data.document
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
			comment: "",
			infoAlert: ""
		};
	},
	computed: {
		...mapGetters("docsStore", ["data"]),
		...mapGetters("usersStore", ["token", "currentUser"])
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
					token: this.token,
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
		}
	},
	created() {
		this.getDocumentById(this.id);
	}
};
</script>
<style lang="sass" src="./style.sass" scoped></style>
