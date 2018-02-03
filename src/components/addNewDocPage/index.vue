<template lang="pug">
.content
    section.addNewDoc
        h1.title Добавить новый документ
        app-timer(@dateUpdate="dateUpd")
        b-form(@submit.prevent.stop="addNewDoc" enctype="multipart/form-data")
            b-row
                b-col(class="xs-6")
                    b-form-group(
                            label="Название документа:"
                            label-for="docname"
                            description="Добавьте название документа")
                        b-form-input(
                            id="docname"
                            type="text"
                            v-model="docName"
                            required
                            placeholder="Введите название документа")
                    b-form-group(
                        label="Файл:"
                        label-for="file"
                        description="Добавьте файл документа")
                        b-form-file(
                            id="file"
                            @change="getFile($event)"
                            choose-label="Выберите файл"
                            accept=".pdf"
                            ref="fileInput"
                            required)

                    b-embed(
                        type="embed"
                        :src="previewDoc"
                        v-if="previewDoc"
                    )
                    
                b-col(class="xs-6")
                    preset-routes(@choosePreset="updateSelectedUser")
                    choose-authors(:selectedUsers="selectedUsers" @updateSelectedUsers="updateSelectedUser")
            b-row
                authors-list(:selectedUsers="selectedUsers" @updateSelectedUser="updateSelectedUser")

            b-button(type="submit") Опубликовать

        b-modal(ref="alertModal" hide-footer) {{ infoAlert }}
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
            date: '',
            docName: '',
            file: '',
            selectedUsers: [],
            infoAlert: '',
            previewDoc: '',
            percentLoaded: 0,
        };
    },
    computed: {
        ...mapGetters('usersStore', ['currentUser']),
    },
    methods: {
        ...mapActions('docsStore', ['addNewDocument']),
        ...mapActions('usersStore', ['getAllUsersFromGroup']),
        dateUpd(newDate) {
            this.date = newDate;
        },
        getFile(event) {
            const file = event.target.files[0];
            if (!file) return;
            // check size file
            if (file.size / 1024 > 50000) {
                this.showAlert('Загружаемый файл должен быть меньше 50 МБ!');
                return;
            }
            // save to send on server
            this.file = file;
            this.previewDoc = `${URL.createObjectURL(file)}`;
        },
        updateSelectedUser(users) {
            this.selectedUsers = users;
        },
        addNewDoc(e) {
            if (!this.selectedUsers.length) {
                this.showAlert('Укажите исполнителей!');
                return;
            } 
            const formData = new FormData();
            formData.append('file', this.file);
            formData.append('author', this.currentUser.author);
            formData.append('date', this.date);
            formData.append('title', this.docName);
            formData.append('author_id', this.currentUser._id);
            formData.append('state', 0);
            formData.append('total', this.selectedUsers.length)
            formData.append('globalStatus', 'waiting');
            formData.append('status', 'waiting');
            formData.append('routes', JSON.stringify(this.selectedUsers));
            formData.append('token', this.currentUser.token);
            
            this.addNewDocument(formData)
                .then(() => {
                    this.showAlert('Документ успешно опубликован!');
                    e.target.reset();
                    this.$refs.fileInput.reset();
                    this.selectedUsers = [];
                })
                .catch(e => {
                    this.showAlert('Произошла ошибка!');
                });
        },
        showAlert(title) {
            this.infoAlert = title;
            this.$refs.alertModal.show();
        }
    },
    created() {
        this.getAllUsersFromGroup();
    },
    components: {
        chooseAuthors: require('./innerComponents/chooseAuthors'),
        authorsList: require('./innerComponents/authorsList.vue'),
        appTimer: require('./innerComponents/timer.vue'),
        presetRoutes: require('./innerComponents/presetRoutes'),
    }
}
</script>
<style lang="sass" scoped>
.addNewDoc
    padding: 40px 0
.pdf-container
    display: block
    height: 500px
    width: 100%
    overflow-x: hidden
    overflow-y: scroll
</style>

