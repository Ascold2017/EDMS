<template lang="pug">
.content
    section.addNewDoc
        h1.title Добавить новый документ
        time.date Текущее время: {{date}}
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
                    b-progress(
                        :value="percentLoaded"
                        :max="100"
                        v-if="file && percentLoaded < 100"
                        show-progress
                        animated)
            
                
                    b-form-group(
                        label="Исполнитель:"
                        label-for="authors"
                        description="Выберите исполнителей")
                        b-form-input(
                            type="text"
                            v-model="authorNameOrRole"
                            placeholder="Начните поиск исполнителей")
            
                b-col(class="xs-6")
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
            b-row
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
        ...mapGetters('usersStore', ['users', 'token', 'currentUser']),
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
            if (!file) return;
            // save to send on server
            this.file = file;
            // check size file
            if (file.size / 1024 > 50000) {
                this.showAlert('Загружаемый файл должен быть меньше 50 МБ!');
                return false;
            }
            // read to create preview
            const reader = new FileReader();
            reader.onload = () => {
                console.log('loaded');
                this.previewDoc = reader.result;
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
            reader.readAsDataURL(file);
        },
        timer() {
            const timerID = setInterval(() => {
                    const time = new Date;
                    let day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
                    let month = time.getMonth() < 10 ? '0' + (time.getMonth() +1) : time.getMonth() + 1;
                    let hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
                    let minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
                    let seconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
                    this.date = `${day}.${month}.${time.getFullYear()} - ${hours}:${minutes}:${seconds}`;
                }, 1000);
        },
        addAuthor(user) {
            user.status = 'waiting';
            this.selectedUsers.push({...user});
        },
        removeAuthor(user) {
            this.selectedUsers = this.selectedUsers.filter(item => item._id !== user._id);
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
            formData.append('token', this.token);
            
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

