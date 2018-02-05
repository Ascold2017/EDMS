<template lang="pug">
    b-col
        b-form-group(
            label=""
            label-for="authors-selected"
            description="Выбранные исполнители"
            v-if="selectedUsers.length")
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
                    p.subtitle {{ selectedUsers.indexOf(user)}}
        b-alert(variant="warning" v-else) Выберите исполнителей
</template>

<script>
export default {
    props: {
        selectedUsers: Array
    },
    methods: {
        removeAuthor(user) {
            // if we removing first user - second must switch canSee in 'yes' - he will be first after remove current first
            if (this.selectedUsers.indexOf(user) === 0) {
                if (this.selectedUsers[1])
                    this.selectedUsers[1].canSee = 'yes';
            }
            this.$emit('updateSelectedUser', this.selectedUsers.filter(item => item._id !== user._id));
        },
    },
}
</script>

<style>

</style>
