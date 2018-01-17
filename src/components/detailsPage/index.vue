<template lang="pug">
.content
    .details
        h1.details__title {{ data.title }}
        time.details__date {{ data.date }}
        b-embed(
            type="embed"
            aspect="16by9"
            :src="file"
            allowfullscreen
            )
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
        file() {
            return this.convertToFile(this.data.document);
        },
    },
    methods: {
        ...mapActions('docsStore', ['getDocumentById', 'postVote']),
        convertDataUriToBlob(dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            let byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            // write the bytes of the string to a typed array
            let ia = new Uint8Array(byteString.length);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], {type:mimeString});
        },
        convertToFile(dataURI) {
            let blob = this.convertDataUriToBlob(dataURI);
            let file = new File([blob], 'myFile');
            console.log(file);
            // todo create file
            return URL.createObjectURL(blob);
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
        this.getDocumentById(this.id)
    }
}
</script>
<style lang="sass" src="./style.sass" scoped></style>

