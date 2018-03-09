<template lang="pug">
b-container
	b-row
		b-col
			b-card.mb-3
				h1.title {{ document.title }}
	b-row
		b-col
			b-alert(show v-if="document.globalStatus==='resolved'" variant="success") Документ успешно принят
			b-alert(show v-else variant="warning") Документ отказан в подписи и помещен в архив
			doc-tabs
	b-row
		b-col(sm="12")
			signers-list(:rejected="false")
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
        ...mapGetters('docsStore', ['document']),
    },
    methods: {
        ...mapActions('docsStore', ['getArchiveDocumentById']),
        toDateString,
    },
    created() {
        this.getArchiveDocumentById(this.id)
        .catch(e => {
            this.$router.push('404');
        });
    },
    components: {
        docTabs: require('../_common/docTabs'),
        signersList: require('../_common/signersList'),
    },
};
</script>
