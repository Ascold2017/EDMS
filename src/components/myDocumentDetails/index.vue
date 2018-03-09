<template lang='pug'>
	b-container
		b-row
			b-col(sm='12' class='mb-3')
				b-card
					h1.title {{ documents.title }}
			b-col(sm='12' class='mb-3')
				b-card
					time.text Дата первой публикации {{ toDateString(+documents.date) }}
					p.text(v-if='documents.versions.lenght > 1') Текущая версия документа {{ documents.versions[0].version }}
					time.text(v-if='documents.versions.lenght > 1') Дата публикации версии {{ documents.versions[0].version }}: {{ documents.versions[0].date }}

		b-row
			b-col
				b-tabs(class='mb-3')
					b-tab(
						title='Последняя версия документа'
						style='padding: 20px 0 0')
						p.text Описание: {{ documents.versions[0].description }}
						pdf-reader(
							:src='documents.versions[0].file'
							)
					b-tab(
						v-if='documents.versions.length && documents.versions.length > 1'
						v-for='document in documents.versions.filter((doc, i) => i !== 0)'
						:key='document._id'
						:title='"Версия документа: " + document.version' style='padding: 20px 0 0'
						)
						p.text {{ document.rejectReason }}
						p.text Описание: {{ document.description }}
						pdf-reader(
							:src='document.file'
							)
		b-row
			b-col(sm='12' lg='6')
				b-tabs
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
					b-tab(title='В очереди на подпись' v-if='waitingAuthors.length')
						b-list-group(style='max-height: 300px; overflow-y: scroll;')
							b-list-group-item(
								v-for='author in waitingAuthors'
								:key='author._id'
								variant='primary'
								)
								p.subtitle.subtitle_small {{ author.author }}
								p.subtitle.subtitle_small {{ author.role }}
		
			b-col(sm='12' lg='6')
				b-alert(
					variant='success'
					v-if='documents.globalStatus === "resolved"'
					class='mb-0'
					show
					) Документ успешно подписан, его можно найти в 
					router-link(:to='"/edms/archive/" + documents._id') Архиве
				b-alert(
					variant='primary'
					v-if='documents.globalStatus === "waiting"'
					class='mb-0'
					show
					) Документ на стадии рассмотрения. Сейчас его рассматривает: {{ closerViewer }}
				div(v-if='documents.globalStatus === "rejected"')
					b-alert(
						variant='danger'
						show
						) Документ отказан в подписи. Вы можете его доработать или закрыть.
						b-card.mb-3
							p.subtitle.subtitle_small {{ documents.versions[0].rejectReason }}
					b-button(
						id='toArchive'
						@click='closeDocument'
						size='md'
						class='mr-3 mb-3'
						) Закрыть документ
					router-link(
						id='editDocument'
						:to='"/edms/myDocumentEdit/" + id'
						class='btn btn-success btn-md mb-3'
						) Доработать документ
					b-tooltip(target='editDocument' title='Перейти в редактор версий')
					b-tooltip(target='toArchive' title='Документ отправится в архив')
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import toDateString from '../modulesJs/toDateString';
export default {
  data() {
    return {
      id: this.$router.currentRoute.params.id
    };
  },
  computed: {
    ...mapGetters('docsStore', ['documents']),
    closerViewer() {
      return this.documents.routes.find(route => route.status === 'waiting').author;
    },
    signedAuthors() {
      return this.documents.routes.filter(route => route.status === 'resolve');
    },
    waitingAuthors() {
      return this.documents.routes.filter(route => route.status === 'waiting');
    }
  },
  methods: {
    ...mapActions('docsStore', ['getMyDocumentById', 'closeDocumentById']),
    toDateString,
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
    closeDocument() {
      console.log('close!', this.id);
      this.closeDocumentById(this.id);
    }
  },
  created() {
    this.getMyDocumentById(this.id).catch(e => {
      console.log(e);
      this.$router.push('404');
    });
  },
  components: {
    pdfReader: require('../_common/pdf-reader')
  }
};
</script>