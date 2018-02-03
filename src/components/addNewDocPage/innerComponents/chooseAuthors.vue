<template lang="pug">
    div
        b-form-group(
            label="Исполнитель:"
            label-for="authors"
            description="Выберите исполнителей")
            b-form-input(
                type="text"
                v-model="authorNameOrRole"
                placeholder="Начните поиск исполнителей")

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
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
            authorNameOrRole: '',
        };
    },
    props: {
        selectedUsers: Array,
    },
    computed: {
        ...mapGetters('usersStore', ['users']),
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
        addAuthor(user) {
            user.status = 'waiting';
            this.selectedUsers.push({...user})
            this.$emit('updateSelectedUsers', this.selectedUsers);
        },
    },
}
</script>
<style lang="sass" scoped>
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
</style>

