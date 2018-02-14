<template lang="pug">
    div.reader
        .reader__container(v-show="loaded" id="pdfReader")
</template>

<script>
//import pdf from 'vue-pdf';
const PDFObject = require('pdfobject/pdfobject.min.js');
export default {
    props: {
        src: String
    },
    data() {
        return {
            loaded: true,
        }
    },
    
    methods: {
        printDoc() {
            // this.$refs.PdfComponent.print();
        },
        chLoaded() {
            // this.loaded = true;
        }
    },
    mounted() {
        PDFObject.embed(this.src, document.getElementById('pdfReader'));
    }
}
</script>
<style lang="sass" scoped>
.reader
    &__container
        height: 500px
        overflow-y: scroll
        overflow-x: hidden
    &__empty
        height: 100%
        width: 100%
        display: flex
        justify-content: center
        align-items: center
        background-color: #cccccc
        color: #222222
</style>
