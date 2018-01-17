<template lang="pug">
.content
    .details
        h1.details__title {{ data.title }}
        time.details__date {{ data.date }}
        b-embed(
            type="embed"
            aspect="16by9"
            :src="data.document"
            allowfullscreen
            )
        a(:href="convertToFile(data.document)" target="_blank").details__link.link Скачать
        b-form-group(label="Выберите действие").details__form
            b-form-radio-group(
                v-model="selected"
                name="radioSubComponent"
                stacked
                :options="options"
                )
        b-form-textarea(
                     v-model="comment"
                     placeholder="Оставьте комментарий"
                     :rows="3"
                     :max-rows="6"
                     v-if="selected === 'reject'"
                     ).details__comment
        b-button(@click="submitDoc").details__submit Отправить
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
            // get id of current document
            id: this.$router.currentRoute.params.id,
            // current status of doc
            selected: '',
            options: [
                { value: "resolve", text: "Согласен"},
                { value: "reject", text: "НЕ согласен"}
            ],
            comment: '',
        };
    },
    computed: {
        ...mapGetters('docsStore', ['data']),
    },
    methods: {
        ...mapActions('docsStore', ['getDocumentById', 'postVote']),
        convertToFile(dataURI) {
            // todo - converting data uri to file
            return dataURI;
        },
        submitDoc() {
            if (this.selected) {
                // post our vote to server
                this.postVote({ 
                    id: this.id,
                    vote: this.selected,
                    comment: this.comment
                    });
            }
        }
    },
    created() {
        this.getDocumentById(this.id);
    }
}
</script>
<style lang="sass" src="./style.sass" scoped></style>

