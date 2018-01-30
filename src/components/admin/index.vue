<template lang="pug">
    b-container
        section.admin
            h1.title Панель администратора {{ group.name }}
            b-row
                b-col
                    b-form(@submit.prevent="createUser" class="mb-3")
                        h2.subtitle Создать пользователя
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
                b-col
                    h2.subtitle Пользователи группы {{ group.name }}
                    b-list-group.users-list
                        b-list-group-item(v-for="сurrUser in users" :key="сurrUser._id")
                            b-btn(v-if="сurrUser.role !== 'Admin'" @click="openSendModal(сurrUser)") Отправить доступ
                            h4 {{ сurrUser.author ? сurrUser.author : 'Не зарегистрирован' }}
                            small Роль: {{ сurrUser.role }}

            b-modal(ref="modalSend" title="Отправить доступы пользователю" hide-footer)
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
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      group: {
        name: "ФИТКБ",
        token: "53hle",
        _id: "5a70c442c6b46614d9c3a1cf"
      },
      user: {
        role: "",
        invite: "",
        login: ""
      },
      userForMail: {
        token: "",
        login: "",
        email: ""
      }
    };
  },
  computed: {
    ...mapGetters("groupsStore", ["groups"]),
    users() {
      return this.groups[0].users;
    }
  },
  methods: {
    ...mapActions("groupsStore", ["createNewUser", "getCurrentGroup"]),
    ...mapActions("usersStore", ["sendMail"]),
    generateInvite() {
      return randomizer(5);
    },
    createUser(e) {
      this.createNewUser({ ...this.user, group: this.group._id })
        .then(response => {
          e.target.reset();
          this.getCurrentGroup(this.group.token);
        })
        .catch(e => console.log(e));
    },
    openSendModal(user) {
      this.userForMail = { ...user };
      this.$refs.modalSend.show();
    },
    sendInvite(e) {
      console.log(this.userForMail);
      this.sendMail(this.userForMail)
        .then(response => {
          console.log(response);
          e.target.reset();
          this.$refs.modalSend.hide();
        })
        .catch((e = console.error(e)));
    }
  },
  created() {
    this.getCurrentGroup(this.group.token);
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
