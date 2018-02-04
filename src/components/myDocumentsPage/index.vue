<template lang="pug">
    b-container
        b-list-group
            router-link(
                v-for="preview in sortingData"
                :key="preview._id"
                :to="'/edms/myDocuments/' + preview._id"
                class="list-group-item preview-item list-group-item-action"
                )
                .preview-item__icon(:class="iconStatus(preview.globalStatus)")
                    i(class="fa fa-file-text-o" aria-hidden="true")
                h2.preview-item__title {{ preview.title }}
                time.preview-item__date {{ preview.date }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    computed: {
        ...mapGetters('docsStore', ['documents']),
        sortingData() {
            return this.documents;
        },
    },
    methods: {
        ...mapActions('docsStore', ['getOurDocuments']),
        iconStatus(status) {
            switch (status) {
                case "waiting":
                    return "waiting";
                case "resolved":
                    return "resolved";
                case "rejected":
                    return "rejected";
                default:
                    return "";
            }
        },
    },
    created() {
        this.getOurDocuments();
    }
}
</script>
