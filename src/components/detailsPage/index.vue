<template lang='pug'>
b-container
	b-row
		b-col(sm='12' class='mb-3')
			b-card
				h1.title {{ document.title }}
		b-col(sm='12' class='mb-3')
			b-card
				p.text Автор публикации {{ document.author}}
				time.text Дата первой публикации {{ toDateString(+document.date) }}
				div(v-if='document.versions.length > 1')
					p.text Текущая версия документа {{ document.versions[0].version }}
					time.text Дата публикации версии {{ document.versions[0].version }}: {{ toDateString(+document.versions[0].date) }}
	b-row
		b-col
			b-tabs(class='mb-3')
				b-tab(
					title='Последняя версия документа'
					style='padding: 20px 0 0')
					p.text Описание: {{ document.versions[0].description }}
					pdf-reader(
						:src='document.versions[0].file'
						)
					b-row
						b-col(sm='12' lg='6')
							b-tabs(v-if='!rejected')
								b-tab(title='Подписавшие' v-if='signedAuthors.length')
									b-list-group(style='max-height: 300px; overflow-y: scroll;')
										b-list-group-item(
											v-for='author in signedAuthors'
											:key='author._id'
											variant='success'
											)
											p.subtitle.subtitle_small {{ author.author }}
											p.subtitle.subtitle_small {{ author.role }}
											p.subtitle.subtitle_small Время подписи: {{ toDateString(+author.dateSigning) }}
											b-card(v-if='author.comment' class='mt-1')
												p.text Комментарий подписанта:
												p.text {{ author.comment }}
								b-tab(title='В очереди на подпись')
									b-list-group(style='max-height: 300px; overflow-y: scroll;')
										b-list-group-item(
											v-for='author in waitingAuthors'
											:key='author._id'
											variant='primary'
											)
											p.subtitle.subtitle_small {{ author.author }}
											p.subtitle.subtitle_small {{ author.role }}
											b-card(v-if='author.comment' class='mt-1')
												p.text Комментарий подписанта:
												p.text {{ author.comment }}
							b-alert( show variant='danger' v-else) Документ отказан в подписи Вами
						b-col(sm='12' lg='6')
							b-form(@submit.prevent='submitDoc')
								b-card
									b-form-group(label='Выберите действие')
										b-form-radio-group(
											v-model='selected'
											name='radioSubComponent'
											:options='options'
											)
									b-form-group(label='Ваш комментарий')
										b-form-textarea(
											v-model='comment'
											placeholder='Оставьте комментарий'
											:rows='3'
											:max-rows='6'
											required
											)
									b-button(type='submit') Отправить
				b-tab(
					v-if='document.versions.length && document.versions.length > 1'
					v-for='version in document.versions.filter((doc, i) => i !== 0)'
					:key='document._id'
					:title='"Версия документа: " + version.version' style='padding: 20px 0 0'
					)
					p.text {{ version.rejectReason }}
					p.text Описание: {{ version.description }}
					pdf-reader(:src='document.file')

	b-modal(ref='alertModal' hide-footer) {{ infoAlert }}
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import toDateString from '../modulesJs/toDateString';
export default {
  data() {
    return {
      // get id of current document
      id: this.$router.currentRoute.params.id,
      // current status of doc
      selected: '',
      options: [
        { value: 'resolve', text: 'Подписать документ' },
        { value: 'reject', text: 'Отказать в подписи' }
      ],
      comment: '',
      infoAlert: '',
      rejected: false
    };
  },
  computed: {
    ...mapGetters('docsStore', ['document']),
    ...mapGetters('usersStore', ['currentUser']),
    signedAuthors() {
			return this.document.routes
			.filter(route => route.status === 'resolve');
    },
    waitingAuthors() {
			return this.document.routes
			.filter(route => route.status === 'waiting');
    }
  },
  methods: {
    ...mapActions('docsStore', ['getDocumentById', 'postVote']),
    toDateString,
    submitDoc(e) {
      if (this.selected && this.comment) {
        // post our vote to server
        this.postVote({
          id: this.id,
          vote: this.selected,
          comment: this.comment,
          author: this.currentUser
        })
				.then(response => {
					const msg = '';
					this.selected === 'reject' ? (this.rejected = true) : null;
					this.showAlert(response.message);
					e.target.reset();
					this.getDocumentById(this.id);
				})
				.catch(e => {
					this.showAlert(`Произошла ошибка: ${e.message}`);
				});
      }
    },
    statusVariant(state) {
      switch (state) {
        case 'resolve':
          return 'success';
        case 'reject':
          return 'danger';
        case 'waiting':
          return 'primary';
        default:
          return 'warning';
      }
    },
    showAlert(title) {
      this.infoAlert = title;
      this.$refs.alertModal.show();
    }
  },
  created() {
		this.getDocumentById(this.id)
		.catch(e => {
      this.$router.push('404');
    });
  },
  components: {
    pdfReader: require('../_common/pdf-reader')
  }
};
</script>
