<template lang="pug">
.content
    section.addNewDoc
        h1.title Добавить новый документ
        time.date Текущее время: {{date}}
        b-form(@submit.prevent.stop="addNewDoc" enctype="multipart/form-data")
            b-row
                b-col
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
                            accept=".doc, .docx, .pdf"
                            required)
                    b-progress(
                        :value="percentLoaded"
                        :max="100"
                        v-if="file && percentLoaded < 100"
                        show-progress
                        animated)
                    embed(
                        v-if="percentLoaded === 100"
                        :src="previewDoc"
                        type="application/pdf"
                        ).pdf-container
            b-row
                b-col
                    b-form-group(
                        label="Исполнитель:"
                        label-for="authors"
                        description="Выберите исполнителей")
                        b-form-input(
                            type="text"
                            v-model="authorNameOrRole"
                            placeholder="Начните поиск исполнителей")
            b-row
                b-col
                    b-form-group(
                        label=""
                        label-for="authors"
                        description="Список исполнителей")
                        b-list-group(id="authors").authors-list
                            b-list-group-item(
                                v-for="user in computedUsers"
                                :key="user.author"
                                @click="addAuthor(user)"
                                class="authors-list__item"
                                )
                                h3.subtitle {{ user.author }}
                                p.subtitle {{ user.role }}
                b-col
                    b-form-group(
                        label=""
                        label-for="authors-selected"
                        description="Выбранные исполнители"
                        v-if="selectedUsers")
                        b-list-group(id="authors-selected").authors-list
                            b-list-group-item(
                                v-for="user in selectedUsers"
                                :key="user.author"
                                variant="success"
                                )
                                .authors-list__top
                                    h3.subtitle {{ user.author }}
                                    button(type="button" @click="removeAuthor(user)").close X
                                p.subtitle {{ user.role }}
                    b-alert(variant="danger") Выберите исполнителей

            b-button(type="submit") Опубликовать

        b-modal(ref="alertModal" hide-footer) {{ infoAlert }}
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import pdf from 'vue-pdf';
export default {
    data() {
        return {
            date: '',
            docName: '',
            file: '',
            authorNameOrRole: '',
            selectedUsers: [],
            infoAlert: '',
            previewDoc: '',
            percentLoaded: 0,
        };
    },
    computed: {
        ...mapGetters('usersStore', ['users', 'token']),
        computedUsers() {
            // filtering selected users from result collection
            const filterSelected = (users) => {
                // if no selected users
                if (!this.selectedUsers.length) return users;
                // filtering selected users
                return users.filter(resultItem => {
                    let selectedUser = 
                        this.selectedUsers.find(selectedUser => selectedUser._id === resultItem._id);
                    // if user is selected - filtering from collection
                    if(!selectedUser) { return resultItem; }
                    else { return null; }
                });
            };

            if (!this.authorNameOrRole) return filterSelected(this.users);
            // live search by author or role
            let result = this.users.filter(user => {
                // are exist author with input name
                let existByName = user.author
                                .toLowerCase()
                                .indexOf(this.authorNameOrRole.toLowerCase()) !== -1;
                // are exist author with input role
                let existByRole = user.role
                                .toLowerCase()
                                .indexOf(this.authorNameOrRole.toLowerCase()) !== -1;
                // if exist author with search name or role
                if (existByName || existByRole) return user;
                return null;
            });
            // filtering selected users from collection
            return filterSelected(result);
        },
    },
    methods: {
        ...mapActions('usersStore', ['getAllUsers']),
        ...mapActions('docsStore', ['addNewDocument']),
        getFile(event) {
            const file = event.target.files[0];
            // check size image
            /*
            if (file.size / 1024 > 2000) {
                console.log('Большой файл');
                return false;
            }*/
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.previewDoc = reader.result;
                this.file = file;
            };
            // processing progress load
            reader.onerror = (e) => {
                console.log('error', e);
            };
            reader.onabort = () => {
                console.log('abort');
            }
            reader.onprogress = (e) =>  {
                if (e.lengthComputable) {
                    const percentLoaded = Math.round((e.loaded / e.total) * 100);
                    // Increase the progress bar length.
                    if (percentLoaded <= 100) {
                        this.percentLoaded = percentLoaded;
                        console.log(percentLoaded);
                    }
                }
            };
        },
        timer() {
            const timerID = setInterval(() => {
                    const time = new Date;
                    this.date = `${time.getUTCDay()}.${time.getUTCMonth() + 1}.${time.getFullYear()} - ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
                }, 1000);
        },
        addAuthor(user) {
            this.selectedUsers.push(user);
        },
        removeAuthor(user) {
            this.selectedUsers = this.selectedUsers.filter(item => item._id !== user._id);
        },
        addNewDoc() {
            if (!this.selectedUsers.length) {
                this.showAlert('Укажите исполнителей!');
                return;
            } 
            const formData = new FormData();
            formData.append('file', this.file);
            formData.append('author', 'Автор');
            formData.append('date', this.date);
            formData.append('title', this.docName);
            formData.append('author_id', '');
            formData.append('state', `0 / ${this.selectedUsers.length}`);
            formData.append('globalStatus', 'waiting');
            formData.append('status', 'waiting');
            formData.append('routes', JSON.stringify(this.selectedUsers));
            formData.append('token', this.token);
            
            this.addNewDocument(formData)
                .then(() => this.showAlert('Документ успешно опубликован!'));
        },
        showAlert(title) {
            this.infoAlert = title;
            this.$refs.alertModal.show();
        }
    },
    components: {
        pdf,
    },
    created() {
        this.timer();
        this.getAllUsers();
    }
}
</script>
<style lang="sass" scoped>
.addNewDoc
    padding: 40px 0
.authors-list
    max-height: 300px
    oveflow-y: scroll
    overflow-x: hidden
    &__top
        display: flex
        justify-content: space-between
    &__item
        cursor: pointer
        &:hover
            background-color: #cccccc
.pdf-container
    display: block
    height: 500px
    width: 100%
    overflow-x: hidden
    overflow-y: scroll
</style>

