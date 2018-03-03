<template lang="pug">
    b-container
        section.admin
            h1.title Панель администратора {{ group.name }}
            b-tabs.mt-3
                b-tab(title="Создать роль в группе")
                    b-row
                        b-col
                            b-form(@submit.prevent="createUser" class="mb-3 mt-3")
                                b-form-group(
                                    description="Введите название роли пользователя"
                                    )
                                    b-form-input(
                                        type="text"
                                        v-model="user.role"
                                        required
                                        placeholder="Роль")

                                b-form-group(
                                    title="Создать логин пользователя"
                                    label="Сгенерировать логин пользователя:"
                                    description="Логин сгенерируется автоматически")
                                    b-form-input(
                                        type="text"
                                        v-model="user.login"
                                        required
                                        placeholder="Логин пользователя")
                                    b-button(type="button" @click="user.login = generateInvite()" class="mt-3") Сгенерировать

                                b-form-group(
                                    description="Создать инвайт-код пользователя"
                                    )
                                    b-form-input(
                                        type="text"
                                        v-model="user.invite"
                                        required
                                        readonly
                                        placeholder="Инвайт-код")
                                    b-button(type="button" @click="user.invite = generateInvite()" class="mt-3") Сгенерировать

                                b-button(type="submit") Создать
                        b-col.mt-3
                            h2.subtitle Пользователи группы {{ group.name }}
                            b-list-group.users-list
                                b-list-group-item(v-for="сurrUser in users" :key="сurrUser._id")
                                    b-btn(v-if="сurrUser.role !== 'Admin'" @click="openSendModal(сurrUser)").mb-1 Отправить доступ
                                    h4 {{ сurrUser.author ? сurrUser.author : 'Не зарегистрирован' }}
                                    small Роль: {{ сurrUser.role }}
                b-tab(title="Статистика группы")
                    h3.title.mt-3 Статистика
                    b-form-group(label="Выбрать параметр статистики")
                        b-form-select(:options="statOptions" v-model="choosedStat")
                    b-form-group(label="Выбрать промежуток" v-if="choosedStat === 'docsStat'")
                        date-range(
                            class="calendar"
                            :first-day-of-week="1"
                            v-model="date"
                            lang="ru")
                        b-form-group(label="Статистика документооборота" v-if="loadedStat")
                            b-form-group(label="Создано документов за период: ")
                                | {{ docsCreated}}
                            b-form-group(label="Подписано документов за период: ")
                                | {{ docsSigned }}
                            b-form-group(label="Подписано документов за период: ")
                                | {{ docsRejected }}

                    b-button(type="button" @click="submitStat" v-if="choosedStat") Получить статистику


            b-modal(ref="modalSend" :title="modalTitle" hide-footer)
                b-form(@submit.prevent="sendInvite")

                    b-form-group(label="Логин:")
                        b-form-input(
                            type="text"
                            v-model="userForMail.login"
                            readonly)

                    b-form-group(label="Инвайт-код:")
                        b-form-input(
                            type="text"
                            v-model="userForMail.token"
                            readonly)

                    b-form-group(label="Почта:" description="На эту почту отправится доступ! Будьте внимательны!")
                        b-form-input(type="email" v-model="userForMail.email" required)

                    b-button(type="submit") Отправить

</template>

<script>
import randomizer from "../modulesJs/randomizer";
import {DateRange} from 'vue-date-range';
import { mapGetters, mapActions } from "vuex";
export default {
    data() {
        return {
            user: {
                role: "",
                invite: "",
                login: ""
            },
            userForMail: {
                token: "",
                login: "",
                email: ""
            },
            modalTitle: 'Отправить доступы пользователю',
            date: {
                startDate: null,
                endDate: null,
            },
            statOptions: [
                {value: '', text: 'Не выбрано'},
                {value: 'docsStat', text: 'Статистика документооборота'},
                {value: 'timeStat', text: 'Временная статистика'},
                {value: 'usersStart', text: 'Статистика ролей'}
                ],
            choosedStat: '',
            loadedStat: false,
        };
    },
    computed: {
        ...mapGetters("groupsStore", ["groups"]),
        ...mapGetters('usersStore',['currentUser']),
        ...mapGetters('statStore', ['docsCreated', 'docsSigned', 'docsRejected']),
        users() {
            return this.groups[0].users;
        },
        group() {
            return this.groups[0];
        },
    },
    methods: {
        ...mapActions("groupsStore", ["createNewUser", "getCurrentGroup"]),
        ...mapActions("usersStore", ["sendMail"]),
        ...mapActions('statStore', ['getDocsStat']),
        generateInvite() {
            return randomizer(5);
        },
        createUser(e) {
        this.createNewUser({ ...this.user, group: this.group._id })
            .then(response => {
                e.target.reset();
                this.getCurrentGroup(this.group.groupInvite);
            })
            .catch(e => console.log(e));
        },
        openSendModal(user) {
            this.userForMail = {
                ...user,
                groupInvite: this.group.groupInvite,
                subject: `Доступ "${user.role}" в группу ${this.group.name}`
                };
            this.$refs.modalSend.show();
        },
        sendInvite(e) {
            const modal = this.$refs.modalSend;
            this.modalTitle = 'Письмо отправляется...';
            this.sendMail(this.userForMail)
            .then(response => {
                if (response.result) {
                    this.modalTitle = 'Письмо успешно отправлено!';
                    setTimeout(() => {
                        e.target.reset();
                        modal.hide();
                        this.modalTitle = 'Отправить доступы пользователю';
                    }, 1500);
                    
                } else {
                    this.modalTitle = 'Произошла ошибка при отправке!';
                }
            });
        },
        submitStat() {
            this.getDocsStat({ start: Date.parse(this.date.startDate._d), end: Date.parse(this.date.endDate._d)})
            .then(response => {
                this.loadedStat = true;
            });
        }
    },
    created() {
        this.getCurrentGroup();
    },
    components: {
        DateRange,
    }
};
</script>
<style lang="sass" scoped>
.admin
    padding: 40px 0
.users-list
    max-height: 445px
    overflow-y: scroll
    overflow-x: hidden
ol
    list-style: inside
</style>
