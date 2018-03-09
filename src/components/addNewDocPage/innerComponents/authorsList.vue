<template lang="pug">
    b-col
        b-form-group(
            label="Список виз:"
            label-for="authors-selected"
            v-if="selectedUsers.length")
            draggable(id="authors-selected" class="list-group" v-model="selectedUsers").authors-list
                b-list-group-item(
                    v-for="user in selectedUsers"
                    :key="user.author"
                    variant="success"
                    class="authors-item"
                    href="#"
                    )
                    .authors-list__top
                        h3.subtitle.subtitle_small {{ user.author }}
                        button(type="button" @click="removeAuthor(user)").close X
                    p.subtitle.subtitle_small {{ user.role }}
                    p.subtitle.subtitle_small Порядок в списке: {{ selectedUsers.indexOf(user) + 1 }}
        b-alert(variant="warning" show v-else) Выберите исполнителей
</template>

<script>
import draggable from 'vuedraggable';
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
    watch: {
        selectedUsers(changingList) {
            changingList.map(item => {
                // update canSee
                changingList.indexOf(item) === 0 ? item.canSee = 'yes' : item.canSee = 'no';
                return item;
            })
            this.$emit('updateSelectedUser', changingList);
        }
    },
    components: {
        draggable,
    }
}
</script>

