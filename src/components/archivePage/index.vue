<template lang="pug">
    b-container
        b-list-group
            b-alert(variant="primary" show v-if="!loaded") Загрузка...
            b-alert(variant="danger" show v-if="loaded && !sortingData.length") Доступных документов нет
            router-link(
                v-for="preview in sortingData"
                :key="preview._id"
                :to="'/edms/archive/' + preview._id"
                class="list-group-item preview-item list-group-item-action"
                )
                .preview-item__icon(:class="preview.globalStatus")
                    i(class="fa fa-file-text-o" aria-hidden="true")
                h2.preview-item__title {{ preview.title }}
                time.preview-item__date {{ preview.date }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
      return {
        loaded: false,
      }
    },
    computed: {
        ...mapGetters('docsStore', ['documents']),
        sortingData() {
            return this.documents;
        },
    },
    methods: {
        ...mapActions('docsStore', ['getArchiveDocuments']),
    },
    created() {
        this.getArchiveDocuments()
        .then(() => {
            console.log(this.documents);
            this.loaded = true;
        });
    }
}
</script>
